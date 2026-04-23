# Photography Store & Cart System

This project implements a custom cart and Stripe Checkout system to replace Snipcart.

## Architecture

The system consists of the following key components:

- **Cart State**: Managed via React Context (`CartContext.tsx`) and persisted using cookies to support Server-Side Rendering (SSR).
- **UI Components**: 
  - `CartSidebar.tsx`: Slide-over cart drawer.
  - `CartButton.tsx`: Cart icon with item count.
- **Backend API Routes**:
  - `src/app/api/checkout/route.ts`: Validates cart items against catalog, checks stock, and creates a Stripe Checkout session.
  - `src/app/api/stripe/webhook/route.ts`: Handles Stripe events (like `checkout.session.completed`) to fulfill orders and decrement inventory.
- **Database**: PostgreSQL is used to store orders, line items, inventory, and Stripe events. Managed via `storeDbManager.ts` and `inventoryDbManager.ts`.

## Workflow

1. **Browsing**: Users browse photography items and select variants (size/material).
2. **Cart**: Adding to cart updates the context and cookie.
3. **Checkout**: Clicking checkout sends a POST request to `/api/checkout` with cart items.
4. **Stripe**: The API returns a Stripe Checkout URL. The user is redirected to Stripe to complete payment.
5. **Fulfillment**: Upon successful payment, Stripe sends a webhook to `/api/stripe/webhook`. The webhook updates the order status in the database and decrements inventory stock.

## Setup & Configuration

1. **Database**: Ensure `DATABASE_URL` is set in your environment variables. Run `npx tsx scripts/init_store_db.ts` to initialize the database tables.
2. **Stripe**: Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in your environment variables. See `.env.example` for details.
