import { updateInventoryStock } from "./actions";
import { getAllPhotographyPhotoIDs, getPhotoName } from "@/utils/cdn/cdnAssets";
import { photoPricing } from "@/constants/photoPricing";
import { getAllInventory } from "@/data/store/inventoryDbManager";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const photoIds = getAllPhotographyPhotoIDs();
  const inventoryFromDb = await getAllInventory();

  // Create a map for quick lookup
  const inventoryMap = new Map<string, number>();
  inventoryFromDb.forEach((item) => {
    inventoryMap.set(`${item.product_id}_${item.variant_id}`, item.stock);
  });

  const products = photoIds.flatMap((photoId) => {
    return photoPricing.map((variant) => {
      const key = `${photoId}_${variant.id}`;
      return {
        photoId,
        variantId: variant.id,
        name: `${getPhotoName(photoId)} (${variant.name})`,
        stock: inventoryMap.get(key) ?? 0,
      };
    });
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">View and update stock levels for all photo variants.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Variant</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Stock</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={`${product.photoId}_${product.variantId}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{getPhotoName(product.photoId)}</div>
                  <div className="text-xs text-gray-500">{product.photoId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{product.variantId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                   <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                    product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <form action={updateInventoryStock} className="flex items-center space-x-2">
                    <input type="hidden" name="productId" value={product.photoId} />
                    <input type="hidden" name="variantId" value={product.variantId} />
                    <input 
                      type="number" 
                      name="stock" 
                      defaultValue={product.stock}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Update
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
