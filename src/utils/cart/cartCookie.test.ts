import {
  CartItem,
  MAX_CART_LINES,
  MAX_ITEM_QTY,
  readCartCookie,
  writeCartCookie,
} from "./cartCookie";
import { getAllPhotographyPhotoIDs } from "@/utils/cdn/cdnAssets";

describe("cartCookie", () => {
  beforeEach(() => {
    document.cookie = "khou_cart=; path=/; max-age=0";
  });

  test("round-trips valid photography cart items via writeCartCookie and readCartCookie", () => {
    const items: CartItem[] = [
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "8x10-photo-paper",
        qty: 2,
      },
      {
        photoID: "photography/1903_Courtyard_Landscape_jpg",
        variantId: "11x14-metal",
        qty: 1,
      },
    ];

    writeCartCookie(items);
    expect(readCartCookie()).toEqual(items);
  });

  test("clears cart when writing an empty array", () => {
    writeCartCookie([
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "8x10-photo-paper",
        qty: 1,
      },
    ]);
    writeCartCookie([]);
    expect(readCartCookie()).toEqual([]);
  });

  test("rejects thumbnail (_placeholder_jpg), non-photography, and unknown asset keys", () => {
    const raw = [
      {
        photoID: "photography/San_Francisco_from_Twin_Peaks_placeholder_jpg",
        variantId: "8x10-photo-paper",
        qty: 1,
      },
      {
        photoID: "Design_Guide_txt",
        variantId: "8x10-photo-paper",
        qty: 1,
      },
      {
        photoID: "photography/nonexistent_photo_jpg",
        variantId: "8x10-photo-paper",
        qty: 1,
      },
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "8x10-photo-paper",
        qty: 3,
      },
    ];

    document.cookie = `khou_cart=${encodeURIComponent(
      JSON.stringify(raw),
    )}; path=/`;
    expect(readCartCookie()).toEqual([
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "8x10-photo-paper",
        qty: 3,
      },
    ]);
  });

  test("rejects invalid variants, non-positive or non-integer quantities, and malformed JSON", () => {
    const raw = [
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "invalid-variant",
        qty: 1,
      },
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "8x10-photo-paper",
        qty: 0,
      },
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "8x10-photo-paper",
        qty: -2,
      },
      {
        photoID: "photography/Lombard_Street_Drone_jpg",
        variantId: "8x10-photo-paper",
        qty: 1.5,
      },
      null,
      "invalid",
    ];

    document.cookie = `khou_cart=${encodeURIComponent(
      JSON.stringify(raw),
    )}; path=/`;
    expect(readCartCookie()).toEqual([]);

    document.cookie = "khou_cart=%E0%A4%A; path=/";
    expect(readCartCookie()).toEqual([]);
  });

  test("clamps item quantities to MAX_ITEM_QTY and line count to MAX_CART_LINES", () => {
    const allPhotos = getAllPhotographyPhotoIDs().slice(0, MAX_CART_LINES + 5);
    const raw = allPhotos.map((photoID) => ({
      photoID,
      variantId: "4x6-photo-paper",
      qty: MAX_ITEM_QTY + 50,
    }));

    document.cookie = `khou_cart=${encodeURIComponent(
      JSON.stringify(raw),
    )}; path=/`;
    const result = readCartCookie();

    expect(result).toHaveLength(MAX_CART_LINES);
    expect(result.every((item) => item.qty === MAX_ITEM_QTY)).toBe(true);
  });
});
