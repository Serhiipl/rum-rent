"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/useIsMobile";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useServiceStore from "@/lib/serviceStore";
import { settingsFormSchema } from "@/lib/zod";

type SettingsFormFields = z.infer<typeof settingsFormSchema>;

const DEFAULT_VALUES: SettingsFormFields = {
  company_name: "",
  company_address: "",
  company_phone: "",
  company_nip: "",
  smtp_user_emailFrom: "",
  email_receiver: "",
  motto_description: "",
};

const SettingsForm: React.FC = () => {
  const { isLoading, addSettings } = useServiceStore();

  const isMobile = useIsMobile();

  const form = useForm<SettingsFormFields>({
    resolver: zodResolver(settingsFormSchema, undefined, { raw: true }),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (values: SettingsFormFields) => {
    try {
      const parsedValues = settingsFormSchema.parse(values);
      await addSettings(parsedValues);
      form.reset(DEFAULT_VALUES);

      toast.success("Dodano dane! 🎉", {
        duration: 3000,
        position: "top-center",
        icon: "👏",
      });
    } catch (error) {
      console.error("Error adding settings:", error);
      toast.error("Wystąpił błąd podczas dodawania dannych.", {
        position: "top-center",
        duration: 3000,
        icon: "❌",
      });
    }
  };

  const renderForm = () => (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full border rounded-md p-4 flex flex-col flex-wrap gap-3 relative"
      >
        <div className="flex flex-wrap bg-stone-600 sm:flex-row gap-3">
          <FormField
            name="company_name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative p-2 border border-gray-300 rounded-sm w-full lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Dane właściciela/firmy
                </FormLabel>
                <FormControl className="text-white">
                  <Input
                    className="bg-stone-300 text-black"
                    placeholder="Uzupełnij dane"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="company_address"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative p-2 border border-gray-300 rounded-sm w-full lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Adres firmy
                </FormLabel>
                <FormControl className="text-white">
                  <Input
                    className="bg-stone-300 text-black"
                    placeholder="Uzupełnij adres"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="company_phone"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative p-2 border border-gray-300 rounded-sm w-full lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Telefon firmy
                </FormLabel>
                <FormControl className="text-white">
                  <Input
                    className="bg-stone-300 text-black"
                    placeholder="Uzupełnij telefon"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="company_nip"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative p-2 border border-gray-300 rounded-sm w-full lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  NIP firmy
                </FormLabel>
                <FormControl className="text-white">
                  <Input
                    className="bg-stone-300 text-black"
                    placeholder="Uzupełnij NIP"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="smtp_user_emailFrom"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative p-1 border border-gray-300 rounded-sm lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm font-medium text-white">
                  Email for Gmail provider SMTP
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-stone-300 text-black text-xs"
                    placeholder="wpisz email"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email_receiver"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative p-1 border border-gray-300 rounded-sm lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm font-medium text-white">
                  Email odbiorcy wiadomości z formularza kontaktowego
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-stone-300 text-black text-xs"
                    placeholder="wpisz email"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="motto_description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Główne motto</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="wpisz motto ..."
                  rows={4}
                  className="w-full rounded-sm px-2 py-1 resize-none shadow-md focus:outline-none focus:border-black-400 border border-gray-300 bg-stone-300 text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full font-semibold text-lg sm:w-44 ml-auto"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Dodawanie..." : "Dodaj!"}
        </Button>
      </form>
    </Form>
  );
  return (
    <div className="flex flex-col items-center sm:items-start justify-center my-3 rounded-md w-full bg-stone-600 sm:py-4 sm:px-3 text-black">
      {isMobile ? (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue={isMobile ? undefined : "service-form"}
          // key={isMobile ? "mobile-service-form" : "desktop-service-form"}
        >
          <AccordionItem value="service-form">
            <AccordionTrigger className="flex justify-around items-center border border-stone-800 bg-stone-300 ">
              <h2 className="text-base sm:text-xl font-semibold">
                Dodaj Element
              </h2>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-center text-sm text-muted-foreground m-2">
                Wypełnij poniższe dane i kliknij <b>Dodaj!</b>
              </p>
              {renderForm()}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <>
          <h2 className="text-base sm:text-xl m-2 font-semibold">
            Dodaj Element
          </h2>
          <p className="text-center text-sm text-muted-foreground m-2">
            Wypełnij poniższe dane i kliknij <b>Dodaj!</b>
          </p>
          {renderForm()}
        </>
      )}
    </div>
  );
};
export default SettingsForm;
