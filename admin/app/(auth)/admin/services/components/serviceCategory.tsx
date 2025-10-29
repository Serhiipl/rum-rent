"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { serviceCategorySchema } from "@/lib/zod";
import useServiceStore, { ServiceCategory } from "@/lib/serviceStore";
import toast from "react-hot-toast";
import { ShowCategories } from "./showCategories";
import { useEffect, useMemo } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

type ServiceCategoryFormValues = z.infer<typeof serviceCategorySchema>;

const ServiceCategoryForm = () => {
  const form = useForm<ServiceCategoryFormValues>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: {
      name: "",
      parentId: null,
    },
  });

  // const { addServiceCategory } = useServiceStore();

  // const onSubmit = async (data: ServiceCategoryFormValues) => {
  //   try {
  //     const response = await fetch("/api/categories", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error("Error response:", errorText);

  //       if (response.status === 409) {
  //         toast.error("Taka kategoria już istnieje!", {
  //           duration: 3000,
  //           position: "top-center",
  //           icon: "⚠️",
  //           style: {
  //             border: "1px solid #713200",
  //             padding: "16px",
  //             color: "#713200",
  //             backgroundColor: "#f8d7da",
  //           },
  //         });
  //         return;
  //       }

  //       throw new Error(
  //         `Nie udało się dodać kategorii: ${response.statusText}`
  //       );
  //     }
  //     const newCategory = await response.json();
  //     addServiceCategory(newCategory);

  //     toast.success("Kategoria została dodana pomyślnie!", {
  //       duration: 3000,
  //       position: "top-center",
  //       icon: "✅",
  //     });
  //   } catch (error) {
  //     console.error("Error creating category:", error);
  //     toast.error("Nie udało się dodać kategorii!", {
  //       duration: 3000,
  //       position: "top-center",
  //       icon: "❌",
  //     });
  //   }

  //   form.reset();
  // };

  const { serviceCategories, fetchServiceCategories } = useServiceStore(); // Тільки для оновлення списку

  useEffect(() => {
    fetchServiceCategories();
  }, [fetchServiceCategories]);

  // const categoryOptions = useMemo(() => {
  //   const grouped = serviceCategories.reduce<Record<string, ServiceCategory[]>>(
  //     (acc, category) => {
  //       const key = category.parentId ?? "root";
  //       if (!acc[key]) {
  //         acc[key] = [];
  //       }
  //       acc[key].push(category);
  //       return acc;
  //     },
  //     {}
  //   );

  //   const buildOptions = (
  //     parentId: string | null,
  //     depth = 0
  //   ): Array<{ id: string; label: string }> => {
  //     const siblings = grouped[parentId ?? "root"] ?? [];
  //     const sorted = [...siblings].sort((a, b) =>
  //       a.name.localeCompare(b.name, "pl", { sensitivity: "base" })
  //     );
  //     return sorted.flatMap((category) => [
  //       {
  //         id: category.id,
  //         label: `${"  ".repeat(depth)}${category.name}`,
  //       },
  //       ...buildOptions(category.id, depth + 1),
  //     ]);
  //   };

  //   return buildOptions(null, 0);
  // }, [serviceCategories]);

  const onSubmit = async (data: ServiceCategoryFormValues) => {
    try {
      const payload = {
        ...data,
        parentId: data.parentId ?? null,
      };
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        if (response.status === 409) {
          toast.error("Taka kategoria już istnieje!", {
            duration: 3000,
            position: "top-center",
            icon: "⚠️",
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
              backgroundColor: "#f8d7da",
            },
          });
          return;
        }

        throw new Error(
          `Nie udało się dodać kategorii: ${response.statusText}`
        );
      }

      // Оновлюємо список категорій після успішного створення
      await fetchServiceCategories();

      toast.success("Kategoria została dodana pomyślnie!", {
        duration: 3000,
        position: "top-center",
        icon: "✅",
      });

      form.reset({ name: "", parentId: null });
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Nie udało się dodać kategorii!", {
        duration: 3000,
        position: "top-center",
        icon: "❌",
      });
    }
  };
  return (
    <div className=" flex flex-col items-start justify-start rounded-md my-3 w-full bg-stone-600 sm:py-4 sm:px-3 text-zinc-700">
      <h2 className=" text-base sm:text-xl m-2 font-semibold text-black">
        Dodaj nową kategorie.
      </h2>
      <p className="text-center text-xs sm:text-sm text-muted-foreground mx-1 sm:my-5">
        Wypełnij poniższe dane i kliknij <b>Dodaj Kategorie!</b>
      </p>

      <div className="w-full flex flex-col items-center justify-center mb-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row sm:justify-start sm:items-start items-center justify-center sm:gap-3 gap-2 relative w-full"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full flex justify-center  bg-transparent sm:w-1/2">
                  <FormControl>
                    <Input
                      className="bg-white w-full h-auto text-xs sm:text-sm mx-1 mt-2 px-2 py-2 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                      id={field.name}
                      placeholder="Wprowadź nazwę kategorii"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem className="w-full flex justify-center bg-transparent sm:w-1/2">
                <FormControl>
                  <Select
                    value={field.value ?? "root"}
                    onValueChange={(value) =>
                      field.onChange(value === "root" ? null : value)
                    }
                  >
                    <SelectTrigger className="bg-white w-full h-auto text-xs sm:text-sm mx-1 mt-2 px-2 py-2 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Wybierz kategorię nadrzędną" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">
                        Brak kategorii nadrzędnej
                      </SelectItem>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
            <Button className="mt-2 text-xs sm:text-sm" type="submit">
              Dodaj kategorię!
            </Button>
          </form>
        </Form>
      </div>
      <ShowCategories />
    </div>
  );
};

export default ServiceCategoryForm;
