import { menu, site } from "@/content/site";
import { asset } from "./asset";
import { getFontTheme } from "./font-themes";
import type { PublicCategory, PublicEvent } from "./types";

/** Event details from src/content/site.ts, normalised for the page. */
export function getEvent(): PublicEvent {
  return {
    title: site.title,
    subtitle: site.subtitle,
    date: site.date || null,
    time: site.time || null,
    endTime: site.endTime || null,
    locationName: site.locationName,
    address: site.address,
    additionalInfo: site.additionalInfo,
    heroImage: asset(site.heroImage || null),
    rsvpOpen: site.rsvpOpen,
    hostWhatsApp: site.hostWhatsApp.replace(/\D/g, ""),
    fontTheme: getFontTheme(site.fontTheme).id,
  };
}

/** Visible categories and dishes only, in file order. */
export function getMenu(): PublicCategory[] {
  return menu
    .filter((c) => c.visible !== false)
    .map((c, ci) => ({
      id: `c${ci}`,
      name: c.name,
      accent: c.accent ?? "",
      dishes: c.dishes
        .filter((d) => d.visible !== false)
        .map((d, di) => ({
          id: `c${ci}d${di}`,
          name: d.name,
          description: d.description ?? "",
          image: asset(d.image ?? null),
          tags: {
            vegan: !!d.vegan,
            vegetarian: !!d.vegetarian || !!d.vegan,
            spicy: !!d.spicy,
            glutenFree: !!d.glutenFree,
          },
        })),
    }))
    .filter((c) => c.dishes.length > 0);
}
