"use client";
import Link from "next/link";
import NavLinks from "@/components/nav-links";
import type { Category } from "@/lib/prisma-operations";

type Props = { categories: Category[] };

export default function Header({ categories }: Props) {
  return (
    <nav className="flex justify-between items-baseline py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-stone-500">
      <Link href="/" className="text-xl font-bold">
        Główna
      </Link>
      <NavLinks categories={categories} />
    </nav>
  );
}
