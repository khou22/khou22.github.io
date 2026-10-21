import { ParseArgsConfig } from "node:util";
import { CliError } from "./errors";

export type ParsedValues = Record<
  string,
  string | boolean | (string | boolean)[] | undefined
>;

export type Command = {
  usage: string;
  description: string;
  options?: ParseArgsConfig["options"];
  run: (positionals: string[], values: ParsedValues) => Promise<void>;
};

export const parseRating = (input: string): number | null => {
  if (["clear", "none"].includes(input)) return null;
  const rating = Number(input);
  if (
    input.trim() === "" ||
    !Number.isInteger(rating) ||
    rating < 0 ||
    rating > 5
  ) {
    throw new CliError(`Rating must be 0-5 or "clear", got "${input}".`);
  }
  return rating;
};

export const parseOnOff = (input: string | undefined): boolean => {
  if (input && ["on", "yes", "true", "1"].includes(input)) return true;
  if (input && ["off", "no", "false", "0"].includes(input)) return false;
  throw new CliError(`Expected "on" or "off", got "${input}".`);
};

export const parseNumber = (input: unknown, name: string): number => {
  const value = Number(input);
  if (typeof input !== "string" || !Number.isFinite(value) || value <= 0) {
    throw new CliError(`--${name} must be a positive number.`);
  }
  return value;
};

export const optionalNumber = (input: unknown, name: string) =>
  input === undefined ? undefined : parseNumber(input, name);

// Supports `--dry-run` (default) and `--no-dry-run` like the Python scripts.
export const dryRunOptions = {
  "dry-run": { type: "boolean" },
  "no-dry-run": { type: "boolean" },
} as const;

export const isDryRun = (values: ParsedValues) => !values["no-dry-run"];

export const asStrings = (value: ParsedValues[string]): string[] =>
  value === undefined
    ? []
    : (Array.isArray(value) ? value : [value]).map(String);
