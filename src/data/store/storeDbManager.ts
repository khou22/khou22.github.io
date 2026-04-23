import { Pool } from "pg";

let pool: Pool | null = null;

export const connectToStoreDb = async () => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    pool = new Pool({
      connectionString,
    });
  }

  return {
    all: async (query: string, params: any[] = []) => {
      const translatedQuery = translateQuery(query);
      const res = await pool!.query(translatedQuery, params);
      return res.rows;
    },
    get: async (query: string, params: any[] = []) => {
      const translatedQuery = translateQuery(query);
      const res = await pool!.query(translatedQuery, params);
      return res.rows[0];
    },
    run: async (query: string, params: any[] = []) => {
      const translatedQuery = translateQuery(query);
      const res = await pool!.query(translatedQuery, params);
      return { lastID: res.rows[0]?.id };
    },
    exec: async (query: string) => {
      await pool!.query(query);
    }
  };
};

function translateQuery(query: string): string {
  let index = 1;
  return query.replace(/\?/g, () => `$${index++}`);
}

/**
 * Initialize the store database and create tables if they don't exist.
 */
export const initStoreDb = async () => {
  const db = await connectToStoreDb();

  await db.exec(`CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    stripe_session_id TEXT,
    customer_email TEXT,
    shipping_address TEXT,
    total_amount INTEGER,
    payment_status TEXT,
    fulfillment_status TEXT,
    digital_delivery_status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);

  await db.exec(`CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id TEXT,
    variant_id TEXT,
    title TEXT,
    price INTEGER,
    quantity INTEGER
  );`);

  await db.exec(`CREATE TABLE IF NOT EXISTS order_events (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    stripe_event_id TEXT UNIQUE,
    event_type TEXT,
    payload TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`);

  await db.exec(`CREATE TABLE IF NOT EXISTS inventory (
    product_id TEXT,
    variant_id TEXT,
    stock INTEGER DEFAULT 0,
    PRIMARY KEY (product_id, variant_id)
  );`);

  return db;
};

export interface OrderData {
  stripe_session_id?: string;
  customer_email?: string;
  shipping_address?: string;
  total_amount: number;
  payment_status: string;
  fulfillment_status: string;
  digital_delivery_status?: string;
}

export interface OrderItemData {
  product_id: string;
  variant_id?: string;
  title: string;
  price: number;
  quantity: number;
}

/**
 * Create a new order and its items in a transaction.
 */
export const createOrder = async (
  orderData: OrderData,
  itemsData: OrderItemData[],
) => {
  if (!pool) await connectToStoreDb();
  const client = await pool!.connect();

  try {
    await client.query("BEGIN");
    
    const orderRes = await client.query(
      `INSERT INTO orders (stripe_session_id, customer_email, total_amount, payment_status, fulfillment_status, digital_delivery_status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        orderData.stripe_session_id || null,
        orderData.customer_email || null,
        orderData.total_amount,
        orderData.payment_status,
        orderData.fulfillment_status,
        orderData.digital_delivery_status || "not_applicable",
      ]
    );

    const orderId = orderRes.rows[0].id;

    for (const item of itemsData) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, title, price, quantity) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.product_id,
          item.variant_id || null,
          item.title,
          item.price,
          item.quantity,
        ]
      );
    }

    await client.query("COMMIT");
    return orderId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Retrieve an order and its associated items by ID.
 */
export const getOrder = async (id: number) => {
  const db = await connectToStoreDb();
  const order = await db.get(`SELECT * FROM orders WHERE id = ?`, [id]);
  if (!order) return null;

  const items = await db.all(`SELECT * FROM order_items WHERE order_id = ?`, [
    id,
  ]);
  return { ...order, items };
};

/**
 * Update the payment and fulfillment status of an order, optionally updating customer details.
 */
export const updateOrderStatus = async (
  id: number,
  paymentStatus: string,
  fulfillmentStatus: string,
  customerEmail?: string,
  shippingAddress?: string,
) => {
  const db = await connectToStoreDb();
  let query = `UPDATE orders SET payment_status = ?, fulfillment_status = ?`;
  const params: (string | number)[] = [paymentStatus, fulfillmentStatus];

  if (customerEmail) {
    query += `, customer_email = ?`;
    params.push(customerEmail);
  }

  if (shippingAddress) {
    query += `, shipping_address = ?`;
    params.push(shippingAddress);
  }

  query += ` WHERE id = ?`;
  params.push(id);

  const translatedQuery = translateQuery(query);
  await pool!.query(translatedQuery, params);
};

/**
 * Log a Stripe event related to an order.
 */
export const logStripeEvent = async (
  orderId: number | null,
  eventType: string,
  payload: any,
  stripeEventId?: string,
) => {
  const db = await connectToStoreDb();
  await db.run(
    `INSERT INTO order_events (order_id, stripe_event_id, event_type, payload) VALUES (?, ?, ?, ?)`,
    [orderId, stripeEventId || null, eventType, JSON.stringify(payload)],
  );
};

/**
 * Check if a Stripe event has already been processed.
 */
export const isEventProcessed = async (stripeEventId: string) => {
  const db = await connectToStoreDb();
  const event = await db.get(
    `SELECT id FROM order_events WHERE stripe_event_id = ?`,
    [stripeEventId],
  );
  return !!event;
};

/**
 * Retrieve all orders, ordered by creation date descending.
 */
export const getAllOrders = async () => {
  const db = await connectToStoreDb();
  const orders = await db.all(`SELECT * FROM orders ORDER BY created_at DESC`);
  return orders;
};

/**
 * Update only the fulfillment status of an order.
 */
export const updateOrderFulfillmentStatus = async (
  id: number,
  fulfillmentStatus: string,
) => {
  const db = await connectToStoreDb();
  await db.run(`UPDATE orders SET fulfillment_status = ? WHERE id = ?`, [
    fulfillmentStatus,
    id,
  ]);
};

/**
 * Update the Stripe session ID for an order.
 */
export const updateOrderSessionId = async (id: number, stripeSessionId: string) => {
  const db = await connectToStoreDb();
  await db.run(
    `UPDATE orders SET stripe_session_id = ? WHERE id = ?`,
    [stripeSessionId, id],
  );
};

/**
 * Update the digital delivery status of an order.
 */
export const updateOrderDigitalDeliveryStatus = async (
  id: number,
  digitalDeliveryStatus: string,
) => {
  const db = await connectToStoreDb();
  await db.run(`UPDATE orders SET digital_delivery_status = ? WHERE id = ?`, [
    digitalDeliveryStatus,
    id,
  ]);
};
