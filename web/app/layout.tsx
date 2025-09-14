import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { getCategoriesPrisma } from "@/lib/prisma-operations";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "https://www.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RumRent — Wypożyczalnia sprzętu na Pomorzu",
    template: "%s | RumRent",
  },
  description:
    "Wypożyczalnia narzędzi i sprzętu na Pomorzu. Szybka rezerwacja, atrakcyjne ceny, dostępność od ręki.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "RumRent",
    title: "RumRent — Wypożyczalnia sprzętu na Pomorzu",
    description:
      "Wypożyczalnia narzędzi i sprzętu na Pomorzu. Szybka rezerwacja, atrakcyjne ceny, dostępność od ręki.",
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: "RumRent — Wypożyczalnia sprzętu na Pomorzu",
    description:
      "Wypożyczalnia narzędzi i sprzętu na Pomorzu. Szybka rezerwacja, atrakcyjne ceny, dostępność od ręki.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f59e0b",
};

export const runtime = "nodejs";
export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategoriesPrisma();
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased flex flex-col min-h-screen mx-auto bg-stone-100`}
      >
        {/* Organization JSON-LD */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RumRent",
            url: siteUrl,
            logo: `${siteUrl}/favicon.ico`,
            sameAs: [],
          })}
        </Script>
        <Header categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
