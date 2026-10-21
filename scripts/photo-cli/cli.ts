import { parseArgs } from "node:util";
import { commands } from "./commands";
import { CliError } from "./lib/errors";

export const helpText = () =>
  [
    `Photo catalog CLI

Usage: pnpm photos <command> [options]

Photos can be referenced by ID (photography/foo/Bar_jpg), path
(docs/photography/foo/Bar.jpg), file name, or any unique substring.
Tags can be referenced by full value, name, slug, or short name.
`,
    ...Object.values(commands).map(
      (command) => `  ${command.usage}\n      ${command.description}\n`,
    ),
  ].join("\n");

/**
 * Run the CLI with the given arguments (excluding `node script`). Returns the
 * process exit code.
 */
export const runCli = async (argv: string[]): Promise<number> => {
  const [name, ...rest] = argv;
  try {
    if (!name || ["help", "--help", "-h"].includes(name)) {
      console.log(helpText());
      return 0;
    }
    const command = commands[name];
    if (!command) {
      throw new CliError(`Unknown command "${name}". Run with --help.`);
    }
    if (rest.includes("--help") || rest.includes("-h")) {
      console.log(
        `Usage: pnpm photos ${command.usage}\n\n${command.description}`,
      );
      return 0;
    }

    let parsed;
    try {
      parsed = parseArgs({
        args: rest,
        options: command.options ?? {},
        allowPositionals: true,
      });
    } catch (e) {
      throw new CliError(
        `${(e as Error).message}\nUsage: pnpm photos ${command.usage}`,
      );
    }
    await command.run(parsed.positionals, parsed.values);
    return 0;
  } catch (e) {
    if (e instanceof CliError) {
      console.error(`Error: ${e.message}`);
    } else {
      console.error(e);
    }
    return 1;
  }
};
