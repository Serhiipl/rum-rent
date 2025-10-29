import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
// import { auth } from "@/auth";
// import { headers } from "next/headers";
import { Footer } from "@/components/footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Rum Rent",
  description: "Najlepszy wynajem narzędzi w Polsce",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen sm:max-w-screen-2xl flex flex-col mr-auto ml-auto px-1 sm:px-8 bg-stone-500">
      <div className="flex-1">{children}</div>
      <Toaster />
      <Footer />
    </div>
  );
}
