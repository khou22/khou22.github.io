"use server";

import { revalidatePath } from "next/cache";
import { updateStock } from "@/data/store/inventoryDbManager";

export async function updateInventoryStock(formData: FormData) {
  const productId = formData.get("productId") as string;
  const variantId = formData.get("variantId") as string;
  const stock = parseInt(formData.get("stock") as string, 10);

  if (!productId || !variantId || isNaN(stock)) {
    throw new Error("Invalid input");
  }

  await updateStock(productId, variantId, stock);
  
  revalidatePath("/admin/inventory");
}
