"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import useServiceStore, { ServiceCategory } from "@/lib/serviceStore";
import { cn } from "@/lib/utils";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { serviceFormSchema } from "@/lib/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ImageUpload from "@/components/image-upload";
import { useIsMobile } from "@/hooks/useIsMobile";

type ServiceFormSchema = typeof serviceFormSchema;
type ServiceFormFields = z.input<ServiceFormSchema>;
type ServiceFormData = z.output<ServiceFormSchema>;
type CategoryOption = {
  id: string;
  name: string;
  depth: number;
  isParent?: boolean;
};

const DEFAULT_VALUES: ServiceFormFields = {
  name: "",
  description: "",
  rentalPrice: "",
  deposit: "",
  quantity: "",
  rentalPeriod: "",
  condition: "",
  available: true,
  categoryId: "",
  images: [],
};

const ServiceForm = () => {
  const { fetchServiceCategories, serviceCategories, isLoading, addService } =
    useServiceStore();
  const isMobile = useIsMobile();
  useEffect(() => {
    fetchServiceCategories();
  }, [fetchServiceCategories]);

  const groupedCategoryOptions = useMemo<
    Array<{ parent: ServiceCategory; options: CategoryOption[] }>
  >(() => {
    if (serviceCategories.length === 0) {
      return [];
    }

    const childrenMap = serviceCategories.reduce<
      Record<string, ServiceCategory[]>
    >((acc, category) => {
      if (category.parentId) {
        if (!acc[category.parentId]) {
          acc[category.parentId] = [];
        }
        acc[category.parentId].push(category);
      }
      return acc;
    }, {});

    const sortByName = (list: ServiceCategory[]) =>
      [...list].sort((a, b) =>
        a.name.localeCompare(b.name, "pl", { sensitivity: "base" })
      );

    const buildChildOptions = (
      parentId: string,
      depth: number
    ): CategoryOption[] => {
      const children = sortByName(childrenMap[parentId] ?? []);
      return children.flatMap((child) => [
        { id: child.id, name: child.name, depth },
        ...buildChildOptions(child.id, depth + 1),
      ]);
    };

    const rootCategories = sortByName(
      serviceCategories.filter((category) => !category.parentId)
    );

    return rootCategories.map((parentCategory) => ({
      parent: parentCategory,
      options: [
        {
          id: parentCategory.id,
          name: parentCategory.name,
          depth: 0,
          isParent: true,
        },
        ...buildChildOptions(parentCategory.id, 1),
      ],
    }));
  }, [serviceCategories]);

  const form = useForm<ServiceFormFields>({
    resolver: zodResolver(serviceFormSchema, undefined, { raw: true }),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (values: ServiceFormFields) => {
    try {
      const parsedValues: ServiceFormData = serviceFormSchema.parse(values);
      await addService(parsedValues);
      form.reset(DEFAULT_VALUES);

      toast.success("Dodano nową usługę! 🎉", {
        duration: 3000,
        position: "top-center",
        icon: "👏",
      });
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Wystąpił błąd podczas dodawania usługi.", {
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
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="relative p-2 border border-gray-300 w-full rounded-sm">
              <FormLabel
                id="images"
                className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white"
              >
                Zdjęcia towaru
              </FormLabel>
              <FormControl id="images">
                <ImageUpload
                  aria-labelledby="images"
                  value={(field.value ?? []).map((image) => image.url)}
                  disabled={isLoading}
                  onChange={(url) =>
                    field.onChange([...(field.value ?? []), { url }])
                  }
                  onRemove={(url) =>
                    field.onChange(
                      (field.value ?? []).filter((img) => img.url !== url)
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap bg-stone-600 sm:flex-row gap-3">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative p-2 border border-gray-300 rounded-sm w-full lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Nazwa towaru
                </FormLabel>
                <FormControl className="text-white">
                  <Input
                    className="bg-stone-300 text-black"
                    placeholder="Nazwa towaru"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="rentalPrice"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative p-2 border border-gray-300 rounded-sm lg:w-1/3">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Cena za dzień (zł)
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-stone-300 text-black text-xs"
                    type="number"
                    inputMode="decimal"
                    step="5"
                    min="0"
                    placeholder="Wpisz cenę"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="deposit"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative p-1 border border-gray-300 rounded-sm lg:w-1/3">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Kaucja (zł)
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-stone-300 text-black text-xs"
                    type="number"
                    inputMode="decimal"
                    step="5"
                    min="0"
                    placeholder="Kaucja (zł)"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="quantity"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative p-1 border border-gray-300 rounded-sm lg:w-1/3">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Ilość w magazynie
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-stone-300 text-black text-xs"
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min="0"
                    placeholder="Ilość na stanie"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="rentalPeriod"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative p-1 border border-gray-300 rounded-sm md:min-w-fit lg:w-1/4">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm sm:font-medium text-white">
                  Min. Czas wynajmu (dni)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    step="1"
                    min="1"
                    className="bg-stone-300 text-black text-xs"
                    placeholder="Min. Czas wynajmu"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="condition"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full relative p-1 border border-gray-300 rounded-sm lg:w-1/2">
                <FormLabel className="absolute -top-3 left-2 px-1 bg-stone-600 text-sm font-medium text-white">
                  Stan towaru
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-stone-300 text-black text-xs"
                    placeholder="Stan towaru"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <FormField
            name="available"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Input
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4"
                  />
                </FormControl>
                <FormLabel className="!m-0">Dostępny</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full bg-stone-300 border border-gray-300 rounded-sm md:w-2/3">
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger className="bg-stone-300 text-black w-full border border-gray-300 rounded-sm">
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {groupedCategoryOptions.length > 0 ? (
                      groupedCategoryOptions.map(
                        ({ parent, options }, index) => (
                          <React.Fragment key={parent.id}>
                            <SelectGroup>
                              {options.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id}
                                  style={{
                                    paddingLeft: `${
                                      Math.min(option.depth, 4) * 12 + 8
                                    }px`,
                                  }}
                                  className={cn(
                                    "text-sm",
                                    option.depth === 0
                                      ? "font-medium text-gray-900"
                                      : "text-gray-700"
                                  )}
                                >
                                  {option.isParent ? (
                                    <SelectLabel className="text-gray-500">
                                      {option.name} (główna)
                                    </SelectLabel>
                                  ) : (
                                    option.name
                                  )}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            {index < groupedCategoryOptions.length - 1 && (
                              <SelectSeparator />
                            )}
                          </React.Fragment>
                        )
                      )
                    ) : (
                      <SelectGroup>
                        <SelectLabel>Brak kategorii</SelectLabel>
                        <SelectItem
                          value="__empty"
                          disabled
                          className="text-muted-foreground"
                        >
                          Brak kategorii do wyboru
                        </SelectItem>
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis towaru</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Opis towaru..."
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

export default ServiceForm;
