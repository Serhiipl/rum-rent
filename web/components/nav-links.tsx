"use client";
import Link from "next/link";
import type { Category } from "@/lib/prisma-operations";

type Props = { categories: Category[] };

export default function NavLinks({ categories }: Props) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="hidden text-lg bg-transparent sm:flex flex-row gap-4 sm:z-20">
      {categories.map((c) => (
        <Link key={c.id} href={`/catalog/${c.slug}`} className="hover:underline">
          {c.name}
        </Link>
      ))}
    </div>
  );
}
