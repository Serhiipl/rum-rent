"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ClipboardList,
  Home,
  LayoutDashboard,
  Presentation,
  Settings,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SignOutButton from "@/components/signout-button";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Usługi",
    href: "/admin/services",
    icon: ClipboardList,
    description: "Zarządzaj ofertą, kategoriami i dostępnością",
  },
  {
    label: "Użytkownicy",
    href: "/admin/users",
    icon: Users2,
    description: "Przeglądaj konta użytkowników i uprawnienia",
  },
  {
    label: "Banery",
    href: "/admin/banners",
    icon: Presentation,
    description: "Aktualizuj treści marketingowe i grafiki",
  },
];

function DesktopMenu() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden sm:flex">
      <NavigationMenuList>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <NavigationMenuItem key={item.href} className="relative">
              {item.description ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      "gap-2 text-amber-200 hover:text-amber-400 data-[state=open]:text-amber-400",
                      isActive && "text-amber-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-0 top-full mt-2 w-64 rounded-md border border-stone-700 bg-stone-500 p-4 shadow-lg">
                    <p className="text-sm text-amber-100">{item.description}</p>
                    <Link
                      href={item.href}
                      className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-stone-900 transition-colors hover:bg-amber-400"
                    >
                      Przejdź do {item.label.toLowerCase()}
                    </Link>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "gap-2 text-amber-200 hover:text-amber-400",
                    isActive && "text-amber-400"
                  )}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              navigationMenuTriggerStyle(),
              "gap-2 text-amber-200 hover:text-amber-400"
            )}
          >
            <Link href="/admin/settings">
              <Settings className="h-4 w-4" />
              Ustawienia
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function QuickActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* <Button
        asChild
        size="sm"
        variant="secondary"
        className="bg-amber-500 text-stone-900 hover:bg-amber-400"
      >
        <Link href="/admin">Admin</Link>
      </Button> */}
      <SignOutButton
        size="sm"
        variant="outline"
        className="border-amber-400 text-amber-200 hover:bg-stone-700 hover:text-amber-100"
        label="Exit"
      />
    </div>
  );
}

function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-base transition-colors",
      pathname === href
        ? "bg-amber-500 text-stone-900"
        : "text-stone-100 hover:bg-stone-600 hover:text-amber-200"
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-amber-500 text-stone-900 sm:hidden"
        >
          <span className="font-semibold uppercase tracking-wide">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[85vw] max-w-sm flex-col bg-stone-800 p-0 text-stone-100"
      >
        <SheetHeader className="border-b border-stone-700 px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-amber-300">
            <Home className="h-5 w-5" /> Panel administracyjny
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {/* <SheetClose asChild>
            <Link href="/admin" className={linkClass("/admin")}>
              <LayoutDashboard className="h-5 w-5" /> Dashboard
            </Link>
          </SheetClose> */}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <SheetClose asChild key={item.href}>
                <Link href={item.href} className={linkClass(item.href)}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
          <SheetClose asChild>
            <Link
              href="/admin/settings"
              className={linkClass("/admin/settings")}
            >
              <Settings className="h-5 w-5" /> Ustawienia
            </Link>
          </SheetClose>
        </nav>
        <div className="border-t border-stone-700 px-6 py-4 text-sm text-stone-300">
          Zarządzaj RumRent z dowolnego miejsca. W razie problemów skontaktuj
          się z zespołem wsparcia.
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminNavLinks() {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="hidden items-center justify-between w-full gap-2 sm:flex">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-amber-400 transition-colors hover:text-amber-200"
        >
          <Home className="h-5 w-5" /> Home
        </Link>
        <DesktopMenu />
        <QuickActions />
      </div>
      <div className="flex w-full items-center justify-between gap-2 sm:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-amber-400 transition-colors hover:text-amber-200"
        >
          <Home className="h-5 w-5" /> Home
        </Link>
        <div className="flex items-center gap-2">
          <MobileMenu />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
