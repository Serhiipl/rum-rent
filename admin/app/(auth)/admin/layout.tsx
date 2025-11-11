"use client";
import { authClient } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import Providers from "@/lib/providers";
import { Toaster } from "react-hot-toast";
import AdminNavbar from "@/components/admin-navbar";

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
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="rounded-md w-full border bg-background px-2 py-8 text-center shadow-sm">
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
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AdminNavbar />
        {/* <div className="flex flex-col sm:gap-4 sm:py-4 pt-20"> */}
        <main className="pt-20 grid w-full flex-1 items-start gap-1 sm:px-6  md:gap-4 bg-muted/40">
          {children}
        </main>
        {/* </div> */}
        <Toaster />
      </div>
    </Providers>
  );
}
