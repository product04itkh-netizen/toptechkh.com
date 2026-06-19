import type { Metadata } from "next";
import "./globals.css";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = {
  title: "Top Tech Computer | Electronics & Tech Store",
  description:
    "Top Tech Computer — Phnom Penh's leading electronics store. Shop the latest smartphones, laptops, cameras, headphones, and more at the best prices.",
  keywords:
    "electronics, Cambodia, Phnom Penh, smartphones, laptops, cameras, headphones, watches, Top Tech Computer",
};

const FALLBACK = {
  fontFamily:        "Inter",
  headingFontFamily: "Inter",
  baseFontSize:      "16",
  headingColor:      "#021523",
  bodyColor:         "#3d4f61",
  primaryColor:      "#041e42",
  accentColor:       "#ef262c",
};

function googleFontsUrl(families: string[]): string | null {
  const unique = [...new Set(families.filter((f) => f && f !== "Geist"))]
  if (unique.length === 0) return null
  const params = unique
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { data, error } = await supabaseAdmin
    .from("cms_settings")
    .select("value")
    .eq("key", "global_typography")
    .maybeSingle()

  if (error) console.error("CMS settings fetch error:", error)
  const s = { ...FALLBACK, ...((data?.value as Record<string, string>) ?? {}) }

  const fontsUrl = googleFontsUrl([s.fontFamily, s.headingFontFamily])

  const cssVars = [
    `:root {`,
    `  --cms-font-body: '${s.fontFamily}', sans-serif;`,
    `  --cms-font-heading: '${s.headingFontFamily}', sans-serif;`,
    `  --cms-font-size-base: ${s.baseFontSize}px;`,
    `  --cms-color-heading: ${s.headingColor};`,
    `  --cms-color-body: ${s.bodyColor};`,
    `  --cms-color-primary: ${s.primaryColor};`,
    `  --cms-color-accent: ${s.accentColor};`,
    `  --cms-color-primary-hover: color-mix(in srgb, ${s.primaryColor} 80%, white);`,
    `  --cms-color-accent-light: color-mix(in srgb, ${s.accentColor} 10%, white);`,
    `  --cms-color-accent-border: color-mix(in srgb, ${s.accentColor} 25%, white);`,
    `}`,
    `h1,h2,h3,h4,h5,h6 { font-family: var(--cms-font-heading); }`,
  ].join("\n")

  return (
    <html lang="en">
      <head>
        {fontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link rel="stylesheet" href={fontsUrl} />
          </>
        )}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body
        className="bg-white text-[#021523] antialiased"
        style={{ fontFamily: `'${s.fontFamily}', sans-serif`, fontSize: `${s.baseFontSize}px` }}
      >
        {children}
      </body>
    </html>
  );
}
