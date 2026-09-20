import { describe, expect, it } from "vitest";
import { defaultLocale, getDictionary, isLocale, locales } from "./get-dictionary";

describe("i18n dictionaries", () => {
  it("exposes en and fr as the supported locales, defaulting to en", () => {
    expect(locales).toEqual(["en", "fr"]);
    expect(defaultLocale).toBe("en");
  });

  it("isLocale narrows only known locale strings", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });

  it("getDictionary returns matching, non-empty strings for every supported locale", () => {
    for (const locale of locales) {
      const dictionary = getDictionary(locale);
      expect(dictionary.layout.appName).toBe("ReLiS");
      expect(dictionary.layout.nav.dashboard.length).toBeGreaterThan(0);
      expect(dictionary.home.greeting).toContain("{name}");
    }
  });
});
