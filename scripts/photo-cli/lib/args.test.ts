/** @jest-environment node */
import {
  asStrings,
  isDryRun,
  optionalNumber,
  parseNumber,
  parseOnOff,
  parseRating,
} from "./args";
import { CliError } from "./errors";

describe("parseRating", () => {
  it.each(["0", "1", "5"])("accepts %s", (input) => {
    expect(parseRating(input)).toBe(Number(input));
  });
  it.each(["clear", "none"])("treats %s as no rating", (input) => {
    expect(parseRating(input)).toBeNull();
  });
  it.each(["6", "-1", "2.5", "abc", ""])("rejects %p", (input) => {
    expect(() => parseRating(input)).toThrow(CliError);
  });
});

describe("parseOnOff", () => {
  it.each(["on", "yes", "true", "1"])("%s is on", (input) => {
    expect(parseOnOff(input)).toBe(true);
  });
  it.each(["off", "no", "false", "0"])("%s is off", (input) => {
    expect(parseOnOff(input)).toBe(false);
  });
  it.each([undefined, "maybe"])("rejects %p", (input) => {
    expect(() => parseOnOff(input)).toThrow(CliError);
  });
});

describe("parseNumber", () => {
  it("parses positive numbers", () => {
    expect(parseNumber("250", "max-kb")).toBe(250);
    expect(parseNumber("0.5", "max-kb")).toBe(0.5);
  });
  it.each(["0", "-3", "abc", undefined, true])("rejects %p", (input) => {
    expect(() => parseNumber(input, "max-kb")).toThrow("--max-kb");
  });
  it("optionalNumber passes through undefined", () => {
    expect(optionalNumber(undefined, "max")).toBeUndefined();
    expect(optionalNumber("10", "max")).toBe(10);
  });
});

describe("isDryRun", () => {
  it("defaults to a dry run", () => {
    expect(isDryRun({})).toBe(true);
    expect(isDryRun({ "dry-run": true })).toBe(true);
  });
  it("is disabled by --no-dry-run", () => {
    expect(isDryRun({ "no-dry-run": true })).toBe(false);
  });
});

describe("asStrings", () => {
  it("normalizes option values to string arrays", () => {
    expect(asStrings(undefined)).toEqual([]);
    expect(asStrings("a")).toEqual(["a"]);
    expect(asStrings(["a", "b"])).toEqual(["a", "b"]);
  });
});
