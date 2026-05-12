/**
 * Returns the base URL for the current deployment environment.
 *
 * Uses the following environment variables in priority order:
 * 1. `NEXT_PUBLIC_VERCEL_URL` — Automatically set by Vercel on every deployment.
 *    Contains the deployment URL without protocol (e.g. "my-app-xyz.vercel.app"
 *    for preview deployments, or the production domain).
 * 2. Falls back to "http://localhost:3000" for local development.
 *
 * @see https://vercel.com/docs/environment-variables/system-environment-variables
 */
export function getBaseUrl(): string {
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return "http://localhost:3000";
}
