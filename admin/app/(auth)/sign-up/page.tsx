"use client";

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
import LoadingButton from "@/components/loading-button";

import Link from "next/link";

import { signUpSchema } from "@/lib/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/auth-client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast({
            title: "Konto utworzone",
            description:
              "Twoje konto zostało utworzone. Sprawdź link weryfikacyjny wysłany na twoją skrzynkę e-mail.",
          });
        },
        onError: (ctx) => {
          console.log("error", ctx);
          toast({
            title: "Coś poszło nie tak =(",
            description: ctx.error.message ?? "Coś poszło nie tak.",
          });
        },
      }
    );
    setPending(false);
  };
  const fields = ["name", "email", "password", "confirmPassword"];
  const placeholders = {
    name: "Wprowadź swoje imię",
    email: "Wprowadź swój adres e-mail",
    password: "Wprowadź swoje hasło",
    confirmPassword: "Potwierdź swoje hasło",
  };
  const fieldNames = {
    name: "Imię",
    email: "Adres e-mail",
    password: "Hasło",
    confirmPassword: "Potwierdź hasło",
  };
  return (
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Utwórz nowe konto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {fields.map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {fieldNames[field as keyof typeof fieldNames]}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field === "password" || field === "confirmPassword"
                              ? "password"
                              : field === "email"
                              ? "email"
                              : "text"
                          }
                          placeholder={`${
                            placeholders[field as keyof typeof placeholders]
                          }`}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={pending}>Zarejestruj się</LoadingButton>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link href="/sign-in" className="text-primary hover:underline">
              Masz już konto? Zaloguj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
