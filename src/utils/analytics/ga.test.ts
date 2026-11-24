import {
  cartItemsToGAItems,
  GA_CURRENCY,
  sendGA4Event,
  toGAPrintItem,
  trackAddToCart,
  trackBeginCheckout,
  trackCheckoutError,
  trackPurchase,
  trackRemoveFromCart,
  trackSearch,
  trackSelectItem,
  trackSelectPrintVariant,
  trackViewCart,
  trackViewItem,
  trackViewItemList,
} from "./ga";
import { photoPricing } from "@/constants/photoPricing";
import { CartItem } from "@/utils/cart/cartCookie";
import { PhotoIdType } from "@/utils/cdn/cdnAssets";

const SAMPLE_PHOTO_1: PhotoIdType = "photography/Lombard_Street_Drone_jpg";
const SAMPLE_PHOTO_2: PhotoIdType = "photography/1903_Courtyard_Landscape_jpg";
const PAPER_VARIANT = photoPricing.find((v) => v.id === "11x14-photo-paper")!;
const METAL_VARIANT = photoPricing.find((v) => v.id === "11x14-metal")!;

describe("GA4 ecommerce analytics helpers", () => {
  let gtagMock: jest.Mock;

  beforeEach(() => {
    gtagMock = jest.fn();
    window.gtag = gtagMock;
  });

  afterEach(() => {
    delete window.gtag;
  });

  test("sendGA4Event safely no-ops when window.gtag is undefined", () => {
    delete window.gtag;
    expect(() => sendGA4Event("view_item", { value: 49 })).not.toThrow();
  });

  test("toGAPrintItem builds a GA4 ecommerce item payload", () => {
    expect(toGAPrintItem(SAMPLE_PHOTO_1, PAPER_VARIANT, 2)).toEqual({
      item_id: `${SAMPLE_PHOTO_1}_${PAPER_VARIANT.id}`,
      item_name: "Lombard Street Drone",
      item_category: "Photo Print",
      item_category2: "Photo Paper",
      item_variant: "11x14",
      price: 49,
      quantity: 2,
    });
  });

  test("cartItemsToGAItems converts valid cart items and ignores invalid ones", () => {
    const cartItems: CartItem[] = [
      { photoID: SAMPLE_PHOTO_1, variantId: PAPER_VARIANT.id, qty: 2 },
      { photoID: SAMPLE_PHOTO_2, variantId: METAL_VARIANT.id, qty: 1 },
      {
        photoID: "photography/nonexistent_jpg",
        variantId: PAPER_VARIANT.id,
        qty: 1,
      },
      { photoID: SAMPLE_PHOTO_1, variantId: "unknown-variant", qty: 1 },
    ];

    const result = cartItemsToGAItems(cartItems);
    expect(result.items).toHaveLength(2);
    expect(result.value).toBe(49 * 2 + 149);
  });

  test("trackViewItemList caps items at 20 and skips empty lists", () => {
    trackViewItemList([], "Featured");
    expect(gtagMock).not.toHaveBeenCalled();

    const manyPhotos = Array.from({ length: 25 }, () => SAMPLE_PHOTO_1);
    trackViewItemList(manyPhotos, "Featured");
    expect(gtagMock).toHaveBeenCalledTimes(1);
    const [, eventName, params] = gtagMock.mock.calls[0];
    expect(eventName).toBe("view_item_list");
    expect(params.item_list_name).toBe("Featured");
    expect(params.items).toHaveLength(20);
    expect(params.items[0].index).toBe(0);
    expect(params.items[19].index).toBe(19);
  });

  test("trackSelectItem emits select_item with list metadata", () => {
    trackSelectItem(SAMPLE_PHOTO_1, "Landscapes", 3);
    expect(gtagMock).toHaveBeenCalledWith("event", "select_item", {
      item_list_name: "Landscapes",
      items: [
        {
          item_id: SAMPLE_PHOTO_1,
          item_name: "Lombard Street Drone",
          item_category: "Photo Print",
          item_list_name: "Landscapes",
          index: 3,
        },
      ],
    });
  });

  test("trackViewItem emits view_item with USD currency and value", () => {
    trackViewItem(SAMPLE_PHOTO_1, PAPER_VARIANT);
    expect(gtagMock).toHaveBeenCalledWith("event", "view_item", {
      currency: GA_CURRENCY,
      value: 49,
      items: [toGAPrintItem(SAMPLE_PHOTO_1, PAPER_VARIANT, 1)],
    });
  });

  test("trackSelectPrintVariant emits select_print_variant", () => {
    trackSelectPrintVariant(SAMPLE_PHOTO_1, METAL_VARIANT, "material");
    expect(gtagMock).toHaveBeenCalledWith("event", "select_print_variant", {
      currency: GA_CURRENCY,
      value: 149,
      photo_id: SAMPLE_PHOTO_1,
      item_id: `${SAMPLE_PHOTO_1}_${METAL_VARIANT.id}`,
      item_name: "Lombard Street Drone",
      item_variant: "11x14 Metal",
      material: "Glossy Metal",
      selection_type: "material",
    });
  });

  test("trackAddToCart and trackRemoveFromCart scale value by quantity", () => {
    trackAddToCart(SAMPLE_PHOTO_1, PAPER_VARIANT, 2);
    expect(gtagMock).toHaveBeenCalledWith("event", "add_to_cart", {
      currency: GA_CURRENCY,
      value: 98,
      items: [toGAPrintItem(SAMPLE_PHOTO_1, PAPER_VARIANT, 2)],
    });

    trackRemoveFromCart(SAMPLE_PHOTO_1, PAPER_VARIANT, 2);
    expect(gtagMock).toHaveBeenCalledWith("event", "remove_from_cart", {
      currency: GA_CURRENCY,
      value: 98,
      items: [toGAPrintItem(SAMPLE_PHOTO_1, PAPER_VARIANT, 2)],
    });
  });

  test("trackViewCart, trackBeginCheckout, trackCheckoutError, and trackPurchase emit expected events", () => {
    const cartItems: CartItem[] = [
      { photoID: SAMPLE_PHOTO_1, variantId: PAPER_VARIANT.id, qty: 1 },
      { photoID: SAMPLE_PHOTO_2, variantId: METAL_VARIANT.id, qty: 1 },
    ];
    const expectedItems = [
      toGAPrintItem(SAMPLE_PHOTO_1, PAPER_VARIANT, 1),
      toGAPrintItem(SAMPLE_PHOTO_2, METAL_VARIANT, 1),
    ];

    trackViewCart(cartItems);
    expect(gtagMock).toHaveBeenCalledWith("event", "view_cart", {
      currency: GA_CURRENCY,
      value: 198,
      items: expectedItems,
    });

    trackBeginCheckout(cartItems);
    expect(gtagMock).toHaveBeenCalledWith("event", "begin_checkout", {
      currency: GA_CURRENCY,
      value: 198,
      items: expectedItems,
    });

    trackCheckoutError("http_500", cartItems);
    expect(gtagMock).toHaveBeenCalledWith("event", "checkout_error", {
      currency: GA_CURRENCY,
      value: 198,
      item_count: 2,
      error_reason: "http_500",
    });

    trackPurchase("cs_test_123", cartItems);
    expect(gtagMock).toHaveBeenCalledWith("event", "purchase", {
      transaction_id: "cs_test_123",
      currency: GA_CURRENCY,
      value: 198,
      items: expectedItems,
    });
  });

  test("trackSearch trims query and ignores blank queries", () => {
    trackSearch("   ");
    expect(gtagMock).not.toHaveBeenCalled();

    trackSearch("  yosemite ");
    expect(gtagMock).toHaveBeenCalledWith("event", "search", {
      search_term: "yosemite",
    });
  });
});
