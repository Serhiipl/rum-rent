"use client";

import { authClient } from "@/auth-client";
import Link from "next/link";
import SignoutButton from "@/components/signout-button";
import { Button } from "@/components/ui/button";
import AdminButton from "./admin-button";

export default function AuthButtons() {
  const { data: session, isPending, error } = authClient.useSession();
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading session!</div>;

  const userRole = session?.user.role;
  console.log(userRole, "userRole in AuthButtons");
  return !session ? (
    <div className="flex gap-2 justify-center">
      <Link href="/sign-in">
        <Button>Zaloguj się</Button>
      </Link>
      <Link href="/sign-up">
        <Button>Zarejestruj się</Button>
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <AdminButton userRole={userRole} />
      <SignoutButton />
    </div>
  );
}
