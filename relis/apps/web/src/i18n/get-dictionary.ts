import en from "./dictionaries/en.json";
import fr from "./dictionaries/fr.json";

const dictionaries = { en, fr };

export type Locale = keyof typeof dictionaries;
export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";

export type Dictionary = (typeof dictionaries)[Locale];

export function isLocale(value: string): value is Locale {
  return (locales as string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
