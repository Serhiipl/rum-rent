"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/prisma-operations";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import PhoneLink from "./phone-link";

function Hamburger({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-5 w-6 items-center justify-center text-black"
    >
      <span
        className={`absolute block h-0.5 w-6 bg-current transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0 rotate-45" : "-translate-y-2 rotate-0"
        }`}
      />
      <span
        className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute block h-0.5 w-6 bg-current transition-transform duration-300 ease-in-out ${
          open ? "translate-y-0 -rotate-45" : "translate-y-2 rotate-0"
        }`}
      />
    </span>
  );
}

type Props = { categories: Category[] };

export default function NavLinks({ categories }: Props) {
  const [open, setOpen] = useState(false);
  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative justify-center w-full">
      {/* Desktop nav */}
      <div className="hidden text-lg bg-transparent sm:flex flex-row gap-4 sm:z-20">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/catalog/${c.slug}`}
            className="hover:underline"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Mobile toggle */}
      <div className="sm:hidden  flex justify-end w-full">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="flex bg-amber-500 border border-stone-900 text-white items-center"
            >
              <Hamburger open={open} />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" id="mobile-nav">
            <SheetHeader>
              <SheetTitle className="sr-only">Kategorie</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-4">
              <SheetClose asChild>
                {/* <Button
                  variant={activeCategoryId === null ? "default" : "ghost"}
                  onClick={() => handleCategoryChange("all")}
                  aria-pressed={activeCategoryId === null}
                  className="w-full"
                >
                  Wszystkie
                </Button> */}
              </SheetClose>
              {categories.map((cat) => (
                <SheetClose asChild key={cat.id}>
                  <Link
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    className="hover:underline"
                  >
                    {cat.name}
                  </Link>
                </SheetClose>
              ))}
              <div className="mt-6 flex flex-col items-center gap-3">
                <hr className="my-2 border-t border-stone-500" />
                <p className="text-sm text-center text-gray-500">
                  Skontaktuj się z nami:
                </p>
                <PhoneLink />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
