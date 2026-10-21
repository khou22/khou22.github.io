import path from "path";
import { spawnSync } from "child_process";
import { REPO_ROOT } from "./config";
import { CliError } from "./errors";

/**
 * Regenerate `src/utils/cdn/cdnAssets.generated.ts` and `asset-catalog.md`
 * with the existing Python script.
 */
export const generateAssetMap = () => {
  const script = path.join(REPO_ROOT, "scripts/generate_assets.py");
  for (const python of ["python3", "python"]) {
    const result = spawnSync(python, [script], { stdio: "inherit" });
    if (
      (result.error as NodeJS.ErrnoException | undefined)?.code === "ENOENT"
    ) {
      continue;
    }
    if (result.status !== 0) {
      throw new CliError(`generate_assets.py failed (exit ${result.status})`);
    }
    console.log("Regenerated the CDN asset map.");
    return;
  }
  throw new CliError("Python is required to regenerate the asset map.");
};
