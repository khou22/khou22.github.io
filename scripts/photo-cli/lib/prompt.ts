import readline from "readline/promises";

/**
 * Ask a yes/no question. Always returns false when not attached to a TTY.
 */
export const confirm = async (question: string): Promise<boolean> => {
  if (!process.stdin.isTTY) return false;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(`${question} [y/N] `);
  rl.close();
  return answer.trim().toLowerCase().startsWith("y");
};
