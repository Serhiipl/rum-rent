"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/signout-button";
import { Home, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteNavbarProps {
  user: {
    id: string;
    role?: string | null;
    name?: string | null;
  } | null;
}

export default function SiteNavbar({ user }: SiteNavbarProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-stone-700 bg-stone-900/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 text-lg font-semibold text-amber-400 transition-colors hover:text-amber-200"
          )}
        >
          <Home className="h-5 w-5" /> RumRent
        </Link>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-amber-400 text-amber-200 hover:bg-stone-800 hover:text-amber-100"
              >
                <Link href="/sign-in" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Zaloguj
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-amber-500 text-stone-900 hover:bg-amber-400"
              >
                <Link href="/sign-up" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Zarejestruj
                </Link>
              </Button>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="bg-amber-500 text-stone-900 hover:bg-amber-400"
                >
                  <Link href="/admin" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              {isHome && (
                <SignOutButton
                  size="sm"
                  variant="outline"
                  className="border-amber-400 text-amber-200 hover:bg-stone-800 hover:text-amber-100"
                  label="Exit"
                />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
