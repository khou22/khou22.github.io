"use server";

import { revalidatePath } from "next/cache";
import { updateOrderFulfillmentStatus } from "@/data/store/storeDbManager";

export async function fulfillOrder(formData: FormData) {
  const orderId = Number(formData.get("orderId"));
  if (!orderId) return;

  await updateOrderFulfillmentStatus(orderId, "fulfilled");
  revalidatePath("/admin/orders");
}
