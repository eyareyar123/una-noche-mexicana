/* Shapes the page components render. Built from src/content/site.ts. */

export type DishTags = {
  vegan: boolean;
  vegetarian: boolean;
  spicy: boolean;
  glutenFree: boolean;
};

export type PublicEvent = {
  title: string;
  subtitle: string;
  date: string | null; // YYYY-MM-DD
  time: string | null; // HH:MM
  endTime: string | null;
  locationName: string;
  address: string;
  additionalInfo: string;
  heroImage: string | null;
  rsvpOpen: boolean;
  hostWhatsApp: string;
  fontTheme: string;
};

export type PublicDish = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  tags: DishTags;
};

export type PublicCategory = {
  id: string;
  name: string;
  accent: string;
  dishes: PublicDish[];
};
