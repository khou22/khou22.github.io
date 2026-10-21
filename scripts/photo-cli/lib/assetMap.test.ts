/** @jest-environment node */
import { spawnSync } from "child_process";
import { generateAssetMap } from "./assetMap";
import { CliError } from "./errors";

jest.mock("child_process", () => ({ spawnSync: jest.fn() }));
const mockSpawn = spawnSync as jest.MockedFunction<typeof spawnSync>;

const result = (overrides: object) =>
  ({ status: 0, error: undefined, ...overrides }) as ReturnType<
    typeof spawnSync
  >;
const enoent = () =>
  result({
    status: null,
    error: Object.assign(new Error(), { code: "ENOENT" }),
  });

beforeEach(() => {
  mockSpawn.mockReset();
  jest.spyOn(console, "log").mockImplementation(() => {});
});

it("runs generate_assets.py with python3", () => {
  mockSpawn.mockReturnValue(result({}));
  generateAssetMap();
  expect(mockSpawn).toHaveBeenCalledTimes(1);
  expect(mockSpawn.mock.calls[0][0]).toBe("python3");
  expect(mockSpawn.mock.calls[0][1]?.[0]).toMatch(
    /scripts\/generate_assets\.py$/,
  );
});

it("falls back to python when python3 is missing", () => {
  mockSpawn.mockReturnValueOnce(enoent()).mockReturnValueOnce(result({}));
  generateAssetMap();
  expect(mockSpawn.mock.calls.map((call) => call[0])).toEqual([
    "python3",
    "python",
  ]);
});

it("throws when the script fails", () => {
  mockSpawn.mockReturnValue(result({ status: 2 }));
  expect(() => generateAssetMap()).toThrow(/exit 2/);
});

it("throws when no python is installed", () => {
  mockSpawn.mockReturnValue(enoent());
  expect(() => generateAssetMap()).toThrow(CliError);
  expect(() => generateAssetMap()).toThrow(/Python is required/);
});
