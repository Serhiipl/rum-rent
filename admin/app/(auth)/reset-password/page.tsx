"use client";

import { authClient } from "@/auth-client";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function ResetPasswordContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsPending(true);

    try {
      const token = searchParams.get("token"); // Getting a token from a URL

      if (!data.password || !data.confirmPassword) {
        toast({
          title: "Error",
          description: "Wypełnij wszystkie wymagane pola.",
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }

      if (!token) {
        toast({
          title: "Error",
          description: "Invalid or missing reset token. Please try again.",
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }

      const response = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (response?.error) {
        toast({
          title: "Error",
          description:
            response.error.message ||
            "Wystąpił nieznany błąd. Spróbuj ponownie.",
          variant: "destructive",
        });

        form.setFocus("password");
      } else {
        toast({
          title: "Success",
          description: "Pomyślnie zresetowano hasło",
        });
        router.push("/sign-in");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      toast({
        title: "Error",
        description: "Coś poszło nie tak. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  if (error === "invalid_token") {
    return (
      <div className="flex items-center justify-center p-4 grow">
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Nieprawidłowy link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Link do resetowania jest nieprawidłowy lub wygasł. Sprobuj
              ponownie.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Zresetuj hasło
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nowe hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Wprowadź nowe hasło"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potwierdź hasło</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Potwierdź nowe hasło"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={isPending}>Zresetuj hasło</LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
