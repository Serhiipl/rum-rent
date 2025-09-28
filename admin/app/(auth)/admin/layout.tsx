"use client";
import Link from "next/link";
import {
  ClipboardList,
  Home,
  PanelLeft,
  Settings,
  Users2,
  Presentation,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

import { NavItem } from "@/components/side-nav-item";
// import { SearchInput } from "@/components/search";
import Providers from "@/lib/providers";
import { Toaster } from "react-hot-toast";
// import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  if (isPending) return <div>Loading...</div>;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="rounded-md border bg-background px-6 py-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold">Nie udało się wczytać sesji</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Spróbuj ponownie odświeżyć stronę.
          </p>
        </div>
      </div>
    );
  }

  const userRole = session?.user.role;
  if (userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="rounded-md border bg-background px-6 py-8 text-center shadow-sm space-y-4">
          <h1 className="text-lg font-semibold">Brak dostępu</h1>
          <p className="text-sm text-muted-foreground">
            Ta sekcja jest dostępna wyłącznie dla administratorów.
          </p>
          <Button onClick={() => router.push("/")}>
            Wróć do strony głównej
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
          </header>
          <main className="grid flex-1 items-start gap-1 p-2 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
        <Toaster />
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 mt-14 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/admin" label="Dashboard">
          <Home className="h-5 w-5" />
        </NavItem>

        {/* <NavItem href="#" label="Orders">
          <ShoppingCart className="h-5 w-5" />
        </NavItem> */}

        <NavItem href="/admin/services" label="Usługi">
          <ClipboardList className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/users" label="Users">
          <Users2 className="h-5 w-5" />
        </NavItem>

        <NavItem href="/admin/banners" label="Banners">
          <Presentation className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
        </SheetHeader>
        <nav className="grid mt-7 gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-4 px-2.5 text-xl font-bold left-0 top-1"
          >
            <Home size={20} className="inline-block mr-2 text-yellow-500" />
            Główna
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Panel Administracyjny
          </Link>

          {/* <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Zamówienia
          </Link> */}
          <Link
            href="/admin/services"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <ClipboardList className="h-5 w-5" />
            Produkty
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Użytkownicy
          </Link>
          <Link
            href="/admin/banners"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Presentation className="h-5 w-5" />
            Banery
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
