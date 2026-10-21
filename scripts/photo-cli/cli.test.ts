/** @jest-environment node */
import { helpText, runCli } from "./cli";
import { commands } from "./commands";
import { captureOutput } from "./__fixtures__/setup";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("./__fixtures__/assetMap"),
);

let output: ReturnType<typeof captureOutput>;
beforeEach(() => {
  output = captureOutput();
});
afterEach(() => output.restore());

it("registers every admin UI and image command", () => {
  expect(Object.keys(commands).sort()).toEqual(
    [
      "list",
      "show",
      "tags",
      "subdirs",
      "tag",
      "category",
      "location",
      "sell",
      "rate",
      "move",
      "delete",
      "clean-db",
      "clean",
      "thumbnails",
      "resize",
      "assets",
      "ingest",
    ].sort(),
  );
});

it.each([[[]], [["help"]], [["--help"]], [["-h"]]])(
  "prints help for %p",
  async (argv) => {
    expect(await runCli(argv)).toBe(0);
    expect(output.stdout()).toBe(helpText());
  },
);

it("documents every command in the help text", () => {
  Object.values(commands).forEach((command) => {
    expect(helpText()).toContain(command.usage);
    expect(helpText()).toContain(command.description);
  });
});

it("prints per-command help", async () => {
  expect(await runCli(["rate", "--help"])).toBe(0);
  expect(output.stdout()).toBe(
    `Usage: pnpm photos ${commands.rate.usage}\n\n${commands.rate.description}`,
  );
});

it("rejects unknown commands", async () => {
  expect(await runCli(["nope"])).toBe(1);
  expect(output.stderr()).toBe(
    'Error: Unknown command "nope". Run with --help.',
  );
});

it("rejects unknown options with usage", async () => {
  expect(await runCli(["subdirs", "--bogus"])).toBe(1);
  expect(output.stderr()).toMatch(/Unknown option '--bogus'/);
  expect(output.stderr()).toContain(
    `Usage: pnpm photos ${commands.subdirs.usage}`,
  );
});

it("prints unexpected errors with a stack trace", async () => {
  const spy = jest
    .spyOn(commands.subdirs, "run")
    .mockRejectedValue(new TypeError("boom"));
  expect(await runCli(["subdirs"])).toBe(1);
  expect(output.stderr()).toMatch(/TypeError: boom/);
  spy.mockRestore();
});
