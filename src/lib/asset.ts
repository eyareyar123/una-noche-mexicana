/**
 * Prefix a /public file path with the site's base path.
 * On GitHub Pages the site lives under /<repo-name>, set at build time
 * via PAGES_BASE_PATH (see next.config.ts). Locally it's empty.
 */
export function asset(path: string): string;
export function asset(path: string | null): string | null;
export function asset(path: string | null): string | null {
  if (!path || !path.startsWith("/")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
