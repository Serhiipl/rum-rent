"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/mongo-operations";
import { Button } from "@/components/ui/button";
import { buildCategoryTree, type CategoryNode } from "@/lib/category-tree";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import PhoneLink from "./phone-link";
import { FolderSymlink, Home } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories]
  );

  if (!categoryTree || categoryTree.length === 0) return null;

  const renderMobileTree = (
    nodes: CategoryNode[],
    depth = 0
  ): React.ReactNode => (
    <ul className="space-y-2">
      {nodes.map((node) => (
        <li key={node.id}>
          <SheetClose asChild>
            <Link
              href={`/catalog/${node.slug}`}
              className="block border-b border-stone-900 pb-2"
              style={{ paddingLeft: `${depth * 12}px` }}
            >
              <FolderSymlink className="inline-block mr-3 mb-1 size-5 text-amber-500" />
              {node.name}
            </Link>
          </SheetClose>
          {node.children.length > 0 && (
            <div className="mt-2 ml-3 border-l border-stone-300 pl-3">
              {renderMobileTree(node.children, depth + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const renderDesktopDropdown = (nodes: CategoryNode[], depth = 0) => (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          <Link
            href={`/catalog/${node.slug}`}
            className="block rounded-md px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
            style={{ paddingLeft: depth * 12 }}
          >
            {node.name}
          </Link>
          {node.children.length > 0 && (
            <div className="ml-2 border-l border-stone-200 pl-2">
              {renderDesktopDropdown(node.children, depth + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative flex justify-center">
      {/* Desktop nav */}
      <div className="hidden sm:flex">
        <NavigationMenu className="ml-5">
          <NavigationMenuList>
            {categoryTree.map((node) => (
              <NavigationMenuItem key={node.id}>
                {node.children.length > 0 ? (
                  <>
                    <NavigationMenuTrigger className="text-amber-200 hover:text-amber-400">
                      {node.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="p-4">
                      {renderDesktopDropdown(node.children)}
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-amber-200 hover:text-amber-400"
                    )}
                  >
                    <Link href={`/catalog/${node.slug}`}>{node.name}</Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
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
            <div className="flex flex-col mx-5 space-y-3 mt-4">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="font-bold text-lg mb-8 hover:underline"
                >
                  <Home className="inline-block mr-3 mb-1 size-5" />
                  Strona główna
                </Link>
              </SheetClose>
              {renderMobileTree(categoryTree)}
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
