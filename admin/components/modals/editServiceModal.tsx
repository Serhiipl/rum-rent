"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import ImageUpload from "@/components/image-upload";
import { Button } from "../ui/button";
import useServiceStore, {
  Image as ServiceImage,
  ServiceCategory,
  ServiceProps,
} from "@/lib/serviceStore";
import { serviceFormSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceProps | undefined;
  categories: ServiceCategory[];
}

const NO_IMAGE_SRC = "/no-image.jpg";

type ServiceFormValues = z.input<typeof serviceFormSchema>;
type CategoryOption = {
  id: string;
  name: string;
  depth: number;
  isParent?: boolean;
};

const defaultValues: ServiceFormValues = {
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

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  categories,
}) => {
  const fetchServices = useServiceStore((state) => state.fetchServices);
  const updateService = useServiceStore((state) => state.updateService);
  const [saving, setSaving] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues,
  });

  const groupedCategoryOptions = useMemo<
    Array<{ parent: ServiceCategory; options: CategoryOption[] }>
  >(() => {
    if (!categories?.length) {
      return [];
    }

    const childrenMap = categories.reduce<Record<string, ServiceCategory[]>>(
      (acc, category) => {
        if (category.parentId) {
          if (!acc[category.parentId]) {
            acc[category.parentId] = [];
          }
          acc[category.parentId].push(category);
        }
        return acc;
      },
      {}
    );

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
      categories.filter((category) => !category.parentId)
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
  }, [categories]);

  useEffect(() => {
    if (!service) {
      form.reset(defaultValues);
      return;
    }

    form.reset({
      name: service.name ?? "",
      description: service.description ?? "",
      rentalPrice: service.rentalPrice?.toString() ?? "",
      deposit: service.deposit?.toString() ?? "",
      quantity: service.quantity?.toString() ?? "",
      rentalPeriod: service.rentalPeriod?.toString() ?? "",
      condition: service.condition ?? "",
      available: service.available ?? true,
      categoryId: service.categoryId || categories[0]?.id || "",
      images: service.images?.map((img) => ({ url: img.url })) ?? [],
    });
  }, [service, categories, form]);

  const watchedName = form.watch("name");
  const watchedQuantity = Number(form.watch("quantity") || 0);
  const watchedPrice = Number(form.watch("rentalPrice") || 0);
  const watchedImages = form.watch("images");

  const buildUpdatedImages = (
    imageValues: ServiceFormValues["images"] = []
  ): ServiceImage[] => {
    if (!service) {
      return (imageValues ?? []).map((image, index) => ({
        id: `temp-${index}`,
        serviceId: "",
        url: image.url,
        createdAt: new Date().toISOString(),
      }));
    }

    const baseImages = service.images ?? [];

    return (imageValues ?? []).map((image, index) => {
      const existing = baseImages[index];
      if (existing) {
        return { ...existing, url: image.url };
      }
      return {
        id: `temp-${service.serviceId}-${index}`,
        serviceId: service.serviceId,
        url: image.url,
        createdAt: new Date().toISOString(),
      };
    });
  };

  const onSubmit = async (data: ServiceFormValues) => {
    if (!service) {
      toast.error("Brak usługi do edycji");
      return;
    }

    try {
      setSaving(true);
      await updateService({
        serviceId: service.serviceId,
        name: data.name,
        description: data.description,
        rentalPrice: Number(
          typeof data.rentalPrice === "string"
            ? data.rentalPrice
            : data.rentalPrice ?? 0
        ),
        deposit: Number(
          typeof data.deposit === "string" ? data.deposit : data.deposit ?? 0
        ),
        quantity: Number(
          typeof data.quantity === "string" ? data.quantity : data.quantity ?? 0
        ),
        rentalPeriod: Number(
          typeof data.rentalPeriod === "string"
            ? data.rentalPeriod
            : data.rentalPeriod ?? 0
        ),
        condition: data.condition,
        available: Boolean(data.available),
        categoryId: data.categoryId,
        images: buildUpdatedImages(data.images),
      });
      await fetchServices();
      toast.success("Usługa została zaktualizowana");
      onClose();
    } catch (error) {
      console.error("Failed to save service:", error);
      toast.error("Nie udało się zapisać zmian");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="w-full overflow-y-auto h-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edytuj usługę</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-yellow-50 border border-amber-500 rounded-md p-3">
              <div className="flex gap-3 items-center">
                <div className="relative w-20 h-20 rounded overflow-hidden bg-yellow-100">
                  <Image
                    src={watchedImages?.[0]?.url || NO_IMAGE_SRC}
                    alt={watchedName || "Preview"}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-semibold truncate">
                    {watchedName || "Nazwa usługi"}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      Cena za dzień{" "}
                      <span className="font-bold">{watchedPrice} PLN</span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center pr-2 py-1 rounded-full text-xs font-semibold",
                        watchedQuantity > 0
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-orange-600"
                      )}
                    >
                      {watchedQuantity > 0
                        ? `Dostępne (${watchedQuantity})`
                        : "Zadzwoń do nas"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className="relative p-2 border border-gray-300 rounded-sm">
                  <FormLabel className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
                    Zdjęcia towaru
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={(field.value ?? []).map((image) => image.url)}
                      disabled={saving}
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
            <div className="flex flex-wrap bg-gray-100 sm:flex-row gap-3 p-2 rounded-md">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="relative p-2 border border-gray-300 rounded-sm w-full sm:w-1/2">
                    <FormLabel className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
                      Nazwa towaru
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nazwa towaru" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="rentalPrice"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full relative p-2 border border-gray-300 rounded-sm md:w-1/4">
                    <FormLabel className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
                      Cena za dzień (zł)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs"
                        type="text"
                        placeholder="Wpisz cenę"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
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
                  <FormItem className="w-full relative p-2 border border-gray-300 rounded-sm md:w-1/4">
                    <FormLabel className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
                      Kaucja (zł)
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs"
                        type="text"
                        placeholder="Kaucja"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
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
                  <FormItem className="w-full relative p-2 border border-gray-300 rounded-sm md:w-1/4">
                    <FormLabel className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
                      Ilość w magazynie
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xs"
                        type="text"
                        placeholder="Ilość na stanie"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
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
                  <FormItem className="w-full relative p-2 border border-gray-300 rounded-sm md:w-1/4">
                    <FormLabel className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
                      Min. Czas wynajmu (dni)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="text-xs"
                        placeholder="Min. Czas wynajmu"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
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
                  <FormItem className="w-full relative p-2 border border-gray-300 rounded-sm md:w-1/2">
                    <FormLabel className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
                      Stan towaru
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Stan towaru" {...field} />
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
                        checked={field.value}
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
                  <FormItem className="w-full md:w-1/2">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Wybierz kategorię" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groupedCategoryOptions.length ? (
                          groupedCategoryOptions.map(
                            ({ parent, options }, idx) => (
                              <React.Fragment key={parent.id}>
                                <SelectGroup>
                                  <SelectLabel className="text-gray-500">
                                    {parent.name}
                                  </SelectLabel>
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
                                      {option.isParent
                                        ? `${option.name} (kategoria główna)`
                                        : option.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                                {idx < groupedCategoryOptions.length - 1 && (
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
                      placeholder="Opis towaru..."
                      rows={4}
                      className="w-full rounded-sm px-2 py-1 resize-none shadow-md focus:outline-none focus:border-black-400 border border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Zapisywanie..." : "Zapisz"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                Anuluj
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
