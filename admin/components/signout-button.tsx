"use client";

import { authClient } from "@/auth-client";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SignOutButtonProps extends ButtonProps {
  label?: string;
}

export default function SignOutButton({
  label = "Wyloguj",
  variant = "secondary",
  size = "sm",
  className,
  onClick,
  disabled,
  ...props
}: SignOutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    try {
      setPending(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Error signing out", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      disabled={disabled || pending}
      onClick={async (event) => {
        onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        await handleSignOut();
      }}
      {...props}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
