import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConditionalFooter } from "@/components/conditional-footer";
import { site } from "@/data/site";
import "./globals.css";

// SUIT — Korean-first variable-feel sans, licensed under OFL 1.1.
const plex = localFont({
  // woff2, not otf: otf webfonts load inconsistently across browsers (Safari
  // could fall back to Apple SD Gothic), and woff2 is ~45% smaller.
  src: [
    { path: "./fonts/SUIT-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/SUIT-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/SUIT-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/SUIT-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/SUIT-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-plex",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.shortName}` },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${plex.variable} ${plexMono.variable}`}>
        <SiteHeader />
        <main>{children}</main>
        <ConditionalFooter>
          <SiteFooter />
        </ConditionalFooter>
      </body>
    </html>
  );
}
