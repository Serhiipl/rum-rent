import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteNavbar from "@/components/site-navbar";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rum Rent",
  description: "Najlepszy wynajem narzędzi w Polsce",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SiteNavbar user={session?.user ?? null} />
        <div className="min-h-screen sm:max-w-screen-2xl flex flex-col mr-auto ml-auto px-1 sm:px-8 bg-stone-500">
          {children}
        </div>
        {/* {children} */}
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
