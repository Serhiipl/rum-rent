// This file is part of the Service Category Management project.
"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "@/components/ui/Modal";
import useServiceStore, { ServiceCategory } from "@/lib/serviceStore";
import toast from "react-hot-toast";

interface ServiceSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory: ServiceCategory;
}

export const ServiceSubcategoryModal: React.FC<
  ServiceSubcategoryModalProps
> = ({ isOpen, onClose, parentCategory }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const addServiceCategory = useServiceStore(
    (state) => state.addServiceCategory
  );

  const handleClose = () => {
    setName("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Nazwa podkategorii nie może być pusta.");
      return;
    }

    try {
      setLoading(true);
      await addServiceCategory({
        name: trimmedName,
        parentId: parentCategory.id,
      });
      toast.success(`Dodano podkategorię w "${parentCategory.name}".`);
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Nie udało się dodać podkategorii.";
      toast.error(message);
      console.error("Error creating subcategory:", error);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Dodaj podkategorię"
      description={`Nowa podkategoria w "${parentCategory.name}"`}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-black">
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Nazwa podkategorii
          </label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Wprowadź nazwę"
            className="w-full rounded-sm px-2 py-1 shadow-md shadow-stone-100 border border-stone-100 focus:outline-none focus:border-stone-400"
            autoFocus
          />
        </div>
        <Button
          className="bg-stone-600"
          type="submit"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "Dodawanie..." : "Dodaj podkategorię"}
        </Button>
      </form>
    </Modal>
  );
};
