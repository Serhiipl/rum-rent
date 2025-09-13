"use client";
import Link from "next/link";
import NavLinks from "@/components/nav-links";
import type { Category } from "@/lib/prisma-operations";
import { Roboto } from "next/font/google";
import Container from "./container";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });

type Props = { categories: Category[] };

export default function Header({ categories }: Props) {
  return (
    <nav
      className={` ${roboto.variable}flex justify-between sm:justify-center items-baseline py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-stone-500`}
    >
      <Container className="flex justify-around items-center">
        <Link href="/" className="text-xl font-bold">
          Główna
        </Link>
        <NavLinks categories={categories} />
      </Container>
    </nav>
  );
}
