"use client";
import Link from "next/link";
import NavLinks from "@/components/nav-links";
import type { Category } from "@/lib/mongo-operations";
import { Roboto } from "next/font/google";
import { Home } from "lucide-react";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

type Props = { categories: Category[] };

export default function Header({ categories }: Props) {
  return (
    <nav
      className={`${roboto.variable} flex flex-row items-center justify-center  w-full py-2 px-2 fixed top-0 mx-auto z-50 bg-transparent`}
    >
      {/* <nav
      className={`${roboto.variable} flex flex-row items-center justify-center w-full py-4 px-4 fixed top-0 left-0 right-0 z-50 bg-stone-500`}
    > */}
      <div className="flex max-w-7xl w-full  items-center justify-between sm:justify-center gap-6 mx-auto bg-stone-300/30 backdrop-blur-sm py-4 sm:py-2 px-4 rounded-2xl">
        {/* <div className="flex max-w-7xl w-full items-center justify-between sm:justify-center gap-6 mx-auto"> */}
        <Link
          href="/"
          className="text-xl text-amber-500 font-bold flex items-center"
        >
          <Home className="inline-block ml-4 mb-1 mr-3 size-7 text-amber-500" />
          Rum Rent
        </Link>
        <NavLinks categories={categories} />
      </div>
    </nav>
  );
}
