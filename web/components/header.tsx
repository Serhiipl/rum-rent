"use client";
import Link from "next/link";
import NavLinks from "@/components/nav-links";
import type { Category } from "@/lib/prisma-operations";
import { Roboto } from "next/font/google";
import { Home } from "lucide-react";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

type Props = { categories: Category[] };

export default function Header({ categories }: Props) {
  return (
    <nav
      className={`${roboto.variable} flex flex-row items-center justify-center w-full py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-stone-500`}
    >
      <div className="flex max-w-7xl w-full items-center justify-between sm:justify-center gap-6 mx-auto">
        <Link href="/" className="text-xl font-bold">
          <Home className="inline-block ml-4 mb-1 size-9 text-amber-500" />
        </Link>
        <NavLinks categories={categories} />
      </div>
    </nav>
  );
}
