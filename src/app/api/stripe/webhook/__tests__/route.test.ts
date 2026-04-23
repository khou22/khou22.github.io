/**
 * @jest-environment node
 */
import { POST } from '../route';
import { stripe } from '@/lib/stripe';
import * as storeDbManager from '@/data/store/storeDbManager';
import * as inventoryDbManager from '@/data/store/inventoryDbManager';
import * as emailService from '@/services/emailService';
import * as catalog from '@/utils/catalog';

// Mock Request/Response if they are missing (common in Jest/Node environment)
if (typeof Request === 'undefined') {
  const { Request, Response, Headers } = require('undici');
  (global as any).Request = Request;
  (global as any).Response = Response;
  (global as any).Headers = Headers;
}

jest.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

jest.mock('@/data/store/storeDbManager', () => ({
  updateOrderStatus: jest.fn(),
  logStripeEvent: jest.fn(),
  getOrder: jest.fn(),
  updateOrderDigitalDeliveryStatus: jest.fn(),
  isEventProcessed: jest.fn(),
}));

jest.mock('@/data/store/inventoryDbManager', () => ({
  decrementStock: jest.fn(),
}));

jest.mock('@/services/emailService', () => ({
  sendDigitalDeliveryEmail: jest.fn(),
}));

jest.mock('@/utils/catalog', () => ({
  getProductDetails: jest.fn(),
}));

describe('Webhook Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, STRIPE_WEBHOOK_SECRET: 'test_secret' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const mockRequest = (body: string, signature: string) => {
    return new Request('http://localhost', {
      method: 'POST',
      body: body,
      headers: {
        'stripe-signature': signature,
      },
    });
  };

  it('returns 400 if signature verification fails', async () => {
    (stripe.webhooks.constructEvent as any).mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const req = mockRequest('{}', 'invalid_sig');
    const response = await POST(req);

    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toContain('Webhook Error: Invalid signature');
  });

  it('skips processing if event is already processed (idempotency)', async () => {
    const mockEvent = { id: 'evt_123', type: 'checkout.session.completed', data: { object: {} } };
    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);
    (storeDbManager.isEventProcessed as jest.Mock).mockResolvedValue(true);

    const req = mockRequest('{}', 'valid_sig');
    const response = await POST(req);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.duplicate).toBe(true);
    expect(storeDbManager.updateOrderStatus).not.toHaveBeenCalled();
  });

  it('processes checkout.session.completed and updates order status', async () => {
    const mockEvent = {
      id: 'evt_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: '456',
          customer_details: { email: 'test@example.com' },
          shipping_details: {
            name: 'John Doe',
            address: { line1: '123 Main St', city: 'San Francisco', country: 'US' }
          }
        }
      }
    };
    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);
    (storeDbManager.isEventProcessed as jest.Mock).mockResolvedValue(false);
    (storeDbManager.getOrder as jest.Mock).mockResolvedValue({
      id: 456,
      items: [
        { product_id: 'prod_1', variant_id: 'var_1', quantity: 1, title: 'Photo 1' }
      ]
    });
    (catalog.getProductDetails as jest.Mock).mockReturnValue({ isDigital: false });

    const req = mockRequest('{}', 'valid_sig');
    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(storeDbManager.updateOrderStatus).toHaveBeenCalledWith(
      456, 'paid', 'unfulfilled', 'test@example.com', 'John Doe, 123 Main St, San Francisco, US'
    );
    expect(inventoryDbManager.decrementStock).toHaveBeenCalledWith('prod_1', 'var_1', 1);
    expect(storeDbManager.logStripeEvent).toHaveBeenCalled();
  });

  it('handles digital delivery for digital items', async () => {
     const mockEvent = {
      id: 'evt_124',
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: '457',
          customer_details: { email: 'digital@example.com' }
        }
      }
    };
    (stripe.webhooks.constructEvent as any).mockReturnValue(mockEvent);
    (storeDbManager.isEventProcessed as jest.Mock).mockResolvedValue(false);
    (storeDbManager.getOrder as jest.Mock).mockResolvedValue({
      id: 457,
      items: [
        { product_id: 'digital_1', variant_id: 'var_d', quantity: 1, title: 'Digital Photo' }
      ]
    });
    (catalog.getProductDetails as jest.Mock).mockReturnValue({ isDigital: true });

    const req = mockRequest('{}', 'valid_sig');
    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(emailService.sendDigitalDeliveryEmail).toHaveBeenCalledWith(
      'digital@example.com', 457, expect.arrayContaining([
        expect.objectContaining({ title: 'Digital Photo' })
      ])
    );
    expect(storeDbManager.updateOrderDigitalDeliveryStatus).toHaveBeenCalledWith(457, 'sent');
  });

  it('returns 500 if database error occurs', async () => {
    (stripe.webhooks.constructEvent as any).mockReturnValue({ id: 'evt_123', data: { object: {} } });
    (storeDbManager.isEventProcessed as jest.Mock).mockRejectedValue(new Error('DB Down'));

    const req = mockRequest('{}', 'valid_sig');
    const response = await POST(req);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('Internal Server Error');
  });
});
