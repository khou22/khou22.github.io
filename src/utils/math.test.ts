import { clamp } from "./math";

test("clamp a value between 1 and 10", () => {
  expect(clamp(1, 10, 5)).toBe(5);
  expect(clamp(1, 10, 12)).toBe(10);
  expect(clamp(1, 10, 0)).toBe(1);
});
