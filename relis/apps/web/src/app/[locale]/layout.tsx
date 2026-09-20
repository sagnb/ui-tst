import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import { getDictionary, isLocale, locales } from "@/i18n/get-dictionary";
import { AppShell } from "./app-shell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "ReLiS",
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <AppShell locale={locale} dictionary={dictionary}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
