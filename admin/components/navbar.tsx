"use client";
import Link from "next/link";
import AuthButtons from "@/components/auth-buttons";
import NavLinks from "./nav-links";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-baseline py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-stone-500">
      <Link href="/" className="hidden sm:flex text-xl font-bold">
        Główna
      </Link>
      <NavLinks />
      <AuthButtons />
    </nav>
  );
}
