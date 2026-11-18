/**
 * Hebrew font pairings the host can choose from (admin → הגדרות האירוע).
 * Client-safe metadata only; the actual next/font loaders live in src/app/fonts.ts.
 *
 * Every family here ships a real Hebrew subset on Google Fonts and was verified
 * in the browser to render Hebrew glyphs (not a system fallback).
 */

export type FontThemeId = "classic" | "chef" | "modern" | "editorial" | "cantina" | "noto";

export type FontTheme = {
  id: FontThemeId;
  name: string;
  description: string;
  heading: { family: string; cssVar: string };
  body: { family: string; cssVar: string };
};

export const FONT_THEMES: FontTheme[] = [
  {
    id: "classic",
    name: "קלאסי אלגנטי",
    description: "סריף עברי קלאסי לכותרות, סנס נקי לטקסט",
    heading: { family: "Frank Ruhl Libre", cssVar: "--font-frank" },
    body: { family: "Assistant", cssVar: "--font-assistant" },
  },
  {
    id: "chef",
    name: "מסעדת שף",
    description: "כותרות דקות ומעודנות, אווירת פיין דיינינג",
    heading: { family: "Bellefair", cssVar: "--font-bellefair" },
    body: { family: "Assistant", cssVar: "--font-assistant" },
  },
  {
    id: "modern",
    name: "מודרני אחיד",
    description: "משפחה אחת לכל האתר — הכי עקבי",
    heading: { family: "Heebo", cssVar: "--font-heebo" },
    body: { family: "Heebo", cssVar: "--font-heebo" },
  },
  {
    id: "editorial",
    name: "עריכתי",
    description: "סריף ספרותי עם סנס עגלגל וחם",
    heading: { family: "David Libre", cssVar: "--font-david" },
    body: { family: "Rubik", cssVar: "--font-rubik" },
  },
  {
    id: "cantina",
    name: "קנטינה נועזת",
    description: "כותרות כבדות ושמחות, טקסט עגול",
    heading: { family: "Suez One", cssVar: "--font-suez" },
    body: { family: "Rubik", cssVar: "--font-rubik" },
  },
  {
    id: "noto",
    name: "נקי ומאוזן",
    description: "זוג Noto תואם — סריף וסנס מאותה משפחה",
    heading: { family: "Noto Serif Hebrew", cssVar: "--font-noto-serif" },
    body: { family: "Noto Sans Hebrew", cssVar: "--font-noto-sans" },
  },
];

export const FONT_THEME_IDS = FONT_THEMES.map((t) => t.id) as [FontThemeId, ...FontThemeId[]];
export const DEFAULT_FONT_THEME: FontThemeId = "classic";

export function getFontTheme(id: string | null | undefined): FontTheme {
  return FONT_THEMES.find((t) => t.id === id) ?? FONT_THEMES[0];
}
