import { boolean, object, string, z } from "zod";

const getPasswordSchema = (type: "password" | "confirmPassword") =>
  string({ required_error: `${type} is required` })
    .min(8, `${type} must be at least 8 characters`)
    .max(32, `${type} can not exceed 32 characters`);

const getEmailSchema = () =>
  string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email");

const getNameSchema = () =>
  string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters");

export const signUpSchema = object({
  name: getNameSchema(),
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
});

export const forgotPasswordSchema = object({
  email: getEmailSchema(),
});

export const resetPasswordSchema = object({
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const serviceFormSchema = object({
  name: string().min(1, "Nazwa jest wymagana"),
  description: string().min(1, "Opis jest wymagany"),
  rentalPrice: string()
    .min(1, "Cena jest wymagana")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "Cena musi być większa niż 0"),
  deposit: string()
    .min(1, "Kaucja jest wymagana")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "Kaucja musi być większa niż 0"),
  quantity: string()
    .min(1, "Ilość na stanie jest wymagana")
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Fajnie było b gdy bym ilość na stanie była większa niż 0"
    ),
  rentalPeriod: string()
    .min(1, "Minimum jeden dzień")
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val > 0,
      "Czas najmu musi być co najmniej 1 dzień"
    ),
  condition: string().min(1, "Opis stanu jest wymagany"),
  // images: object({ url: string() }).array(),
  images: z
    .array(
      z.object({
        url: z.string().url("Невірний URL зображення"),
      })
    )
    .default([]),
  available: boolean().default(true),
  categoryId: string().min(1, "Kategoria jest wymagana"), // 🔥 Додано
});

export const serviceCategorySchema = object({
  name: string().min(1, "Name is required"),
  parentId: string().min(1).optional().nullable(),
});

export const contactFormSchema = z
  .object({
    name: z.string().min(2, "Imię jest wymagane"),
    email: z.string().email("Nieprawidłowy email").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    info: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasEmail = !!data.email && data.email.trim().length > 0;
    const hasPhone = !!data.phone && data.phone.trim().length > 0;
    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Podaj e-mail lub telefon",
        path: ["email"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Podaj e-mail lub telefon",
        path: ["phone"],
      });
    }
  });

export const settingsFormSchema = object({
  company_name: string().min(1, "Nazwa jest wymagana"),
  company_address: string().min(1, "Adres jest wymagany"),
  company_phone: string().min(1, "Telefon jest wymagany"),
  company_nip: string().min(1, "Nip jest wymagany").optional(),
  smtp_user_emailFrom: string()
    .email("Nieprawidłowy email")
    .min(1, "Email nadawcy jest wymagany"),
  // smtp_user_password: string().min(1, "Hasło emaila jest wymagane"),
  // smtp_host: string().min(1, "Host SMTP jest wymagany"),
  // smtp_port: string().min(1, "Port SMTP jest wymagany"),
  email_receiver: string()
    .email("Nieprawidłowy email")
    .min(1, "Email odbiorcy jest wymagany"),
  motto_description: string().min(1, "Opis stanu jest wymagany"),
});
