#!/usr/bin/env node
/**
 * Sanity checks on the static build (run after `npm run build`):
 *  • the site was exported (out/index.html exists, Hebrew RTL)
 *  • nothing from private/kitchen-notes.md leaked into the published files
 *  • no leftover server/API calls
 *  • every menu image referenced on the page exists in out/
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let failed = 0;
const check = (name, ok, extra = "") => {
  console.log(`  ${ok ? "\x1b[32m✓\x1b[0m" : "\x1b[31m✗\x1b[0m"} ${name}${ok ? "" : " " + extra}`);
  if (!ok) failed++;
};

if (!fs.existsSync(path.join(OUT, "index.html"))) {
  console.error("out/index.html not found — run `npm run build` first.");
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(html|js|css|txt|json|svg)$/.test(e.name)) files.push(p);
  }
})(OUT);
const all = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
const html = fs.readFileSync(path.join(OUT, "index.html"), "utf8");

console.log("\nStatic build checks\n");
check("index.html exported", html.length > 1000);
check("Hebrew RTL document", /<html[^>]+lang="he"[^>]+dir="rtl"/.test(html));
check("menu is in the page", html.includes("מה על השולחן"));
check("RSVP goes to WhatsApp", all.includes("wa.me"));
check("no server API calls left", !/["'`]\/api\//.test(all));

// Private notes: every substantial line written in the private file must be absent from out/
const notesFile = path.resolve("private/kitchen-notes.md");
if (fs.existsSync(notesFile)) {
  const lines = fs
    .readFileSync(notesFile, "utf8")
    .split(/\r?\n/)
    // headings and tables only repeat the public dish names — check the note text itself
    .filter((l) => !/^\s*(#|\||>)/.test(l))
    .map((l) => l.replace(/^\s*[-*]\s+/, "").replace(/\*\*[^*]+:\*\*/, "").trim())
    .filter((l) => l.length >= 12 && !/^(מרכיבים|אופן הכנה|קניות|תזכורות|הערות מטבח|רשימת קניות|אורחים שאישרו|הקובץ הזה|אפשר לערוך)/.test(l));
  const leaked = lines.filter((l) => all.includes(l));
  check(`private kitchen notes not published (${lines.length} lines checked)`, leaked.length === 0, leaked.slice(0, 3).join(" | "));
} else {
  // e.g. in GitHub Actions, where private/ is git-ignored and never uploaded
  console.log("  – private/kitchen-notes.md not present here (git-ignored) — leak check skipped");
}
check("private/ folder not copied into out/", !fs.existsSync(path.join(OUT, "private")));

const base = process.env.PAGES_BASE_PATH ?? "";
const imgs = [...html.matchAll(/<img[^>]+src="(\/[^"]+)"/g)].map((m) => m[1]);
check(`image paths use the base path${base ? ` (${base})` : ""}`, imgs.every((src) => src.startsWith(base + "/")));
const missing = imgs.filter((src) => !fs.existsSync(path.join(OUT, src.slice(base.length))));
check(`all ${imgs.length} menu images exist`, missing.length === 0, missing.join(", "));

console.log(`\n${failed ? "\x1b[31m" + failed + " failed" : "\x1b[32mall good"}\x1b[0m\n`);
process.exit(failed ? 1 : 0);
