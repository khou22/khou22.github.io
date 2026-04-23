import { connectToStoreDb } from "./storeDbManager";

export interface InventoryItem {
  product_id: string;
  variant_id: string;
  stock: number;
}

/**
 * Initialize the inventory table if it doesn't exist.
 */
export const initInventoryDb = async () => {
  const db = await connectToStoreDb();
  await db.exec(`CREATE TABLE IF NOT EXISTS inventory (
    product_id TEXT,
    variant_id TEXT,
    stock INTEGER DEFAULT 0,
    PRIMARY KEY (product_id, variant_id)
  );`);
};

/**
 * Get all inventory items.
 */
export const getAllInventory = async (): Promise<InventoryItem[]> => {
  const db = await connectToStoreDb();
  return db.all("SELECT * FROM inventory");
};

/**
 * Get inventory for a specific product and variant.
 */
export const getInventoryItem = async (
  productId: string,
  variantId: string,
): Promise<InventoryItem | null> => {
  const db = await connectToStoreDb();
  const item = await db.get(
    "SELECT * FROM inventory WHERE product_id = ? AND variant_id = ?",
    [productId, variantId],
  );
  return item || null;
};

export const getStock = async (productId: string, variantId: string) => {
  const db = await connectToStoreDb();
  const row = await db.get(
    "SELECT stock FROM inventory WHERE product_id = ? AND variant_id = ?",
    [productId, variantId]
  );
  return row ? row.stock : 0;
};

export const checkStock = async (productId: string, variantId: string, quantity: number) => {
  const stock = await getStock(productId, variantId);
  return stock >= quantity;
};

/**
 * Update stock for a specific product and variant.
 * If the item doesn't exist, it will be created.
 */
export const updateStock = async (
  productId: string,
  variantId: string,
  stock: number,
) => {
  const db = await connectToStoreDb();
  await db.run(
    `INSERT INTO inventory (product_id, variant_id, stock) 
     VALUES (?, ?, ?) 
     ON CONFLICT(product_id, variant_id) DO UPDATE SET stock = excluded.stock`,
    [productId, variantId, stock],
  );
};

// Alias setStock to updateStock for compatibility if needed
export const setStock = updateStock;

/**
 * Decrement stock for a specific product and variant.
 */
export const decrementStock = async (
  productId: string,
  variantId: string,
  quantity: number,
) => {
  const db = await connectToStoreDb();
  await db.run(
    "UPDATE inventory SET stock = stock - ? WHERE product_id = ? AND variant_id = ?",
    [quantity, productId, variantId]
  );
};
