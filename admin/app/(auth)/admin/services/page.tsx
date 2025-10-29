"use client";

import React, { useState, useEffect } from "react";
import { ServiceProps } from "@/lib/serviceStore";
import useServiceStore from "@/lib/serviceStore";
import CategoryFilter from "./components/categoryFilter";
import ShowServices from "@/components/showServices";
import ServiceForm from "./components/serviceForm";
import ServiceCategoryForm from "./components/serviceCategory";
import { Button } from "@/components/ui/button";

// Komponent dla stanu ładowania
const LoadingState = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Ładowanie danych...</span>
  </div>
);

const AddServicePage = () => {
  // Otrzymujemy dane ze store
  const {
    services = [],
    serviceCategories = [],
    fetchServices,
    fetchServiceCategories,
    isLoading,
  } = useServiceStore();

  // Lokalny stan dla filtrowanych usług
  const [filteredServices, setFilteredServices] = useState<ServiceProps[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Завантажуємо дані при монтуванні компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchServices(), fetchServiceCategories()]);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      }
    };

    loadData();
  }, [fetchServices, fetchServiceCategories]);

  // Оновлюємо фільтровані послуги коли змінюються основні послуги
  useEffect(() => {
    setFilteredServices(Array.isArray(services) ? services : []);
  }, [services]);

  // Обробник зміни фільтрованих послуг
  const handleFilteredServicesChange = (filtered: ServiceProps[]) => {
    console.log("Фільтровані послуги:", filtered); // Для дебагу
    setFilteredServices(Array.isArray(filtered) ? filtered : []);
  };

  // Показуємо завантаження поки дані не загрузились
  if (isLoading && (!services || services.length === 0)) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Dodawanie usług</h1>
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:gap-4 p-1 sm:p-4 max-w-7xl mx-auto bg-stone-700 border-[2px] border-yellow-500">
      {/* <div className="flex flex-col gap-2 sm:gap-4 p-1 sm:p-4 max-w-7xl mx-auto "> */}
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Dodawanie usług
        </h1>
        <p className="text-sm sm:text-xl text-gray-600">
          Tutaj możesz dodać nową usługę do swojego pulpitu i zarządzać
          istniejącymi.
        </p>
      </div>

      {/* Форма додавання послуги */}
      <div className="w-full flex flex-col sm:flex-row bg-white px-2 text-zinc-600 rounded-lg shadow-sm">
        <ServiceCategoryForm />
        <ServiceForm />
      </div>

      {/* Фільтр категорій - показуємо тільки якщо є категорії */}
      {serviceCategories && serviceCategories.length > 0 && (
        <CategoryFilter
          categories={serviceCategories}
          services={services || []}
          onFilteredServicesChange={handleFilteredServicesChange}
          className="mb-6"
        />
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          size="sm"
          variant={viewMode === "cards" ? "default" : "outline"}
          onClick={() => setViewMode("cards")}
        >
          Widok kart
        </Button>
        <Button
          size="sm"
          variant={viewMode === "table" ? "default" : "outline"}
          onClick={() => setViewMode("table")}
        >
          Widok tabeli
        </Button>
      </div>

      {/* Список послуг - передаємо відфільтровані послуги */}
      <ShowServices services={filteredServices} viewMode={viewMode} />

      {/* Дебаг інформація (тільки в режимі розробки) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p>Debug: Всього послуг: {services?.length || 0}</p>
          <p>Debug: Показано послуг: {filteredServices?.length || 0}</p>
          <p>Debug: Категорій: {serviceCategories?.length || 0}</p>
        </div>
      )}
    </div>
  );
};

export default AddServicePage;
