"use client";

import useServiceStore, { ServiceProps } from "@/lib/serviceStore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { usePathname } from "next/navigation";
import PhoneLink from "./phone-link";
import Link from "next/link";
import { Home } from "lucide-react";

export const filterServicesByCategory = (
  services: ServiceProps[],
  categoryId: string | null
): ServiceProps[] =>
  categoryId ? services.filter((s) => s.categoryId === categoryId) : services;

const NavLinks = () => {
  const { serviceCategories, activeCategoryId, setActiveCategoryId } =
    useServiceStore();
  const pathname = usePathname();
  const isServicePage = /^\/services\/[^/]+$/.test(pathname || "");
  const isAdminPage = /^\/admin(\/|$)/.test(pathname || "");
  const isSignInPage = /^\/sign-in(\/|$)/.test(pathname || "");
  const isSignUpPage = /^\/sign-up(\/|$)/.test(pathname || "");

  const handleCategoryChange = useCallback(
    (value: string) => {
      setActiveCategoryId(value === "all" ? null : value);
    },
    [setActiveCategoryId]
  );
  const currentValue = activeCategoryId ?? "all";

  return (
    <>
      {/* Desktop Tabs */}
      <div className="hidden text-lg bg-transparent sm:flex flex-row  sm:z-20 ">
        <Tabs value={currentValue} onValueChange={handleCategoryChange}>
          <TabsList
            className="bg-stone-700 border h-12  border-yellow-500 rounded-lg"
            aria-label="Kategorie usług"
          >
            <TabsTrigger className="text-yellow-500 text-lg" value="all">
              Wszystkie
            </TabsTrigger>
            {serviceCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                className={`rounded-sm text-lg  ${
                  cat.id === currentValue
                    ? "text-yellow-500 bg-amber-500"
                    : "text-white"
                }`}
                value={cat.id}
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Sheet */}
      {!isServicePage && !isAdminPage && !isSignInPage && !isSignUpPage && (
        <div className="sm:hidden flex justify-end mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex bg-amber-600 border border-stone-900 text-white items-center"
              >
                MENU
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="sr-only">Kategorie</SheetTitle>
              </SheetHeader>
              <div className="space-y-3 mt-4">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-2.5 text-xl font-bold left-0 top-1"
                  >
                    <Home
                      size={30}
                      className="inline-block mr-2 text-yellow-500"
                    />
                    Na główną
                  </Link>
                </SheetClose>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <p className="text-2xl font-bold mt-5 text-center text-gray-700">
                    Kategorie usług
                  </p>
                  <hr className="my-2 border-t border-stone-500 w-full" />
                </div>
                <SheetClose asChild>
                  <Button
                    variant={activeCategoryId === null ? "default" : "ghost"}
                    onClick={() => handleCategoryChange("all")}
                    aria-pressed={activeCategoryId === null}
                    className="w-full"
                  >
                    Wszystkie
                  </Button>
                </SheetClose>
                {serviceCategories.map((cat) => (
                  <SheetClose asChild key={cat.id}>
                    <Button
                      variant={
                        activeCategoryId === cat.id ? "default" : "ghost"
                      }
                      onClick={() => handleCategoryChange(cat.id)}
                      aria-pressed={activeCategoryId === cat.id}
                      className={`w-full bg-amber-500  ${
                        activeCategoryId === cat.id ? "bg-amber-500" : ""
                      }`}
                    >
                      {cat.name}
                    </Button>
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
      )}
    </>
  );
};
export default NavLinks;
