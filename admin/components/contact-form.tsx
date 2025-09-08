"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendEmail } from "@/actions/email";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { contactFormSchema } from "@/lib/zod";

// const contactFormSchema = z
//   .object({
//     name: z.string().min(2, "Imię jest wymagane"),
//     email: z.string().email("Nieprawidłowy email").optional().or(z.literal("")),
//     phone: z.string().optional().or(z.literal("")),
//     info: z.string().optional().or(z.literal("")),
//   })
//   .superRefine((data, ctx) => {
//     const hasEmail = !!data.email && data.email.trim().length > 0;
//     const hasPhone = !!data.phone && data.phone.trim().length > 0;
//     if (!hasEmail && !hasPhone) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Podaj e-mail lub telefon",
//         path: ["email"],
//       });
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Podaj e-mail lub telefon",
//         path: ["phone"],
//       });
//     }
//   });

type FormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  productName: string;
  productId?: string | number;
  productImageUrl?: string;
  receiverEmail?: string; // if not provided, uses NEXT_PUBLIC_CONTACT_RECEIVER
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  productName,
  productId,
  productImageUrl,
  receiverEmail,
  className,
}) => {
  const fallbackReceiver = process.env.NEXT_PUBLIC_CONTACT_RECEIVER || "";
  const toEmail = (receiverEmail || fallbackReceiver || "").trim();

  const form = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", info: "" },
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<null | {
    type: "success" | "error";
    message: string;
  }>(null);

  const onSubmit = async (values: FormValues) => {
    setStatus(null);
    if (!toEmail) {
      setStatus({ type: "error", message: "Brak adresu odbiorcy wiadomości." });
      return;
    }
    setSubmitting(true);
    try {
      const subject = `Zapytanie o usługę: ${productName}`;
      const lines = [
        `Produkt/Usługa: ${productName}${
          productId ? ` (ID: ${productId})` : ""
        }`,
        values.name ? `Imię: ${values.name}` : undefined,
        values.email ? `Email: ${values.email}` : undefined,
        values.phone ? `Telefon: ${values.phone}` : undefined,
        values.info ? `Dodatkowe informacje: ${values.info}` : undefined,
      ].filter(Boolean);

      const text = lines.join("\n");
      const res = await sendEmail({ to: toEmail, subject, text });
      if (res?.success) {
        setStatus({ type: "success", message: "Wiadomość wysłana pomyślnie." });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: "Nie udało się wysłać wiadomości.",
        });
      }
    } catch (error) {
      console.error("Error sending contact form email:", error);
      setStatus({ type: "error", message: "Wystąpił błąd podczas wysyłki." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-center gap-3">
        {productImageUrl ? (
          <div className="relative h-12 w-12 overflow-hidden rounded">
            <Image
              src={productImageUrl}
              alt={productName}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div>
          <div className="text-sm text-muted-foreground">Zapytanie o:</div>
          <div className="font-medium">{productName}</div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="relative p-2 border  border-gray-300 w-full sm:w-1/3 rounded-sm">
                  <FormLabel className="absolute -top-3 left-2 px-1  bg-slate-100 text-sm font-medium text-gray-600">
                    Imię
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Twoje imię" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* pola email i telefon obok siebie na md */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2  md:pr-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative p-2 border  border-gray-300 w-full  rounded-sm">
                    <FormLabel className="absolute -top-3 left-2 px-1  bg-slate-100 text-sm font-medium text-gray-600">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@domena.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="relative p-2 border  border-gray-300 w-full rounded-sm">
                    <FormLabel className="absolute -top-3 left-2 px-1  bg-slate-100 text-sm font-medium text-gray-600">
                      Telefon
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+48 123 456 789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <span>Pola email lub telefon są wymagane</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 space-y-4">
            <FormField
              control={form.control}
              name="info"
              render={({ field }) => (
                <FormItem
                  className="relative p-2 border  border-gray-300 w-full rounded-sm"
                  // style to make it full height of the two fields on the left
                  style={{ alignSelf: "center" }}
                >
                  <FormLabel className="absolute -top-3 left-2 px-1  bg-slate-100 text-sm font-medium text-gray-600">
                    Dodatkowe informacje{" "}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Jak możemy pomóc? (opcjonalnie)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center sm:items-end sm:justify-end w-full">
              <Button type="submit" disabled={submitting || !toEmail}>
                {submitting ? "Wysyłanie..." : "Wyślij zapytanie"}
              </Button>
            </div>
          </div>

          {status ? (
            <div
              className={cn(
                "rounded-md p-3 text-sm",
                status.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {status.message}
            </div>
          ) : null}
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
