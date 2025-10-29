// This file is part of the Service Category Management project.
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "@/components/ui/Modal";
import { ServiceCategory } from "@/lib/serviceStore";
import useServiceStore from "@/lib/serviceStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface ServiceCategoryChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: ServiceCategory;
}

export const ServiceCategoryChangeModal: React.FC<
  ServiceCategoryChangeModalProps
> = ({ isOpen, onClose, categoryData }) => {
  const [formData, setFormData] = useState<ServiceCategory>({
    ...categoryData,
  });

  const updateServiceCategory = useServiceStore(
    (state) => state.updateServiceCategory
  );
  const serviceCategories = useServiceStore(
    (state) => state.serviceCategories
  );

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...categoryData });
    }
  }, [categoryData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const groupedCategories = useMemo(() => {
    return serviceCategories.reduce<Record<string, ServiceCategory[]>>(
      (acc, category) => {
        const key = category.parentId ?? "root";
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(category);
        return acc;
      },
      {}
    );
  }, [serviceCategories]);

  const blockedParentIds = useMemo(() => {
    const blocked = new Set<string>();
    const traverseDescendants = (parentId: string) => {
      const children = groupedCategories[parentId] ?? [];
      children.forEach((child) => {
        if (!blocked.has(child.id)) {
          blocked.add(child.id);
          traverseDescendants(child.id);
        }
      });
    };

    blocked.add(categoryData.id);
    traverseDescendants(categoryData.id);

    return blocked;
  }, [categoryData.id, groupedCategories]);

  const parentOptions = useMemo(() => {
    const buildOptions = (
      parentId: string | null,
      depth = 0
    ): Array<{ id: string; label: string }> => {
      const siblings = groupedCategories[parentId ?? "root"] ?? [];
      const sorted = [...siblings].sort((a, b) =>
        a.name.localeCompare(b.name, "pl", { sensitivity: "base" })
      );
      return sorted.flatMap((category) => [
        {
          id: category.id,
          label: `${"  ".repeat(depth)}${category.name}`,
        },
        ...buildOptions(category.id, depth + 1),
      ]);
    };

    return buildOptions(null, 0).filter(
      (option) => !blockedParentIds.has(option.id)
    );
  }, [blockedParentIds, groupedCategories]);

  const handleParentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parentId: value === "root" ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nazwa nie może być pusta.");
      return;
    }

    try {
      await updateServiceCategory(formData);
      onClose();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <Modal
      title="Edycja kategorii"
      description="Zmień dane"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-black bg-white"
      >
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Nazwa kategorii
          </label>
          <input
            autoFocus
            name="name"
            type="text"
            value={formData.name ?? ""}
            onChange={handleChange}
            placeholder="Nazwa kategorii"
            required
            className="w-full rounded-sm px-2 py-1 shadow-md shadow-stone-100 border border-stone-100 focus:outline-none focus:border-stone-400"
          />
        </div>
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Kategoria nadrzędna
          </label>
          <Select
            value={formData.parentId ?? "root"}
            onValueChange={handleParentChange}
          >
            <SelectTrigger className="w-full rounded-sm px-2 py-1 shadow-md shadow-stone-100 border border-stone-100 focus:outline-none focus:border-stone-400">
              <SelectValue placeholder="Wybierz kategorię nadrzędną" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">Brak kategorii nadrzędnej</SelectItem>
              {parentOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-stone-600" type="submit">
          Zapisz zmiany
        </Button>
      </form>
    </Modal>
  );
};
