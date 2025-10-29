"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  ServiceCategory,
  ServiceProps,
} from "@/lib/serviceStore";
import ServiceCard from "@/components/product-card";
import EmptyState from "@/components/emptyItemState";
import LoadingState from "./loadingItemState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CellAction from "@/app/(auth)/admin/services/components/cellAction";

type ViewMode = "cards" | "table";

interface ShowServicesProps {
  services: ServiceProps[];
  activeCategoryId?: string | null;
  viewMode?: ViewMode;
}

const priceFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

const ServiceTableView: React.FC<{
  services: ServiceProps[];
  categoryMap: Record<string, string>;
}> = ({ services, categoryMap }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-stone-100/90">
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead>Kategoria</TableHead>
            <TableHead className="whitespace-nowrap">Cena / dzień</TableHead>
            <TableHead>Kaucja</TableHead>
            <TableHead>Ilość</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => {
            const categoryName = categoryMap[service.categoryId] ?? "Brak";
            const availabilityClass = service.available
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700";

            return (
              <TableRow key={service.serviceId} className="bg-white/90">
                <TableCell className="font-semibold text-stone-800">
                  {service.name}
                </TableCell>
                <TableCell>{categoryName}</TableCell>
                <TableCell>
                  {priceFormatter.format(service.rentalPrice ?? 0)}
                </TableCell>
                <TableCell>
                  {priceFormatter.format(service.deposit ?? 0)}
                </TableCell>
                <TableCell>{service.quantity ?? 0}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${availabilityClass}`}
                  >
                    {service.available ? "Dostępny" : "Niedostępny"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <CellAction data={service} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const ShowServices: React.FC<ShowServicesProps> = ({
  services,
  activeCategoryId: activeCategoryIdProp = null,
  viewMode = "cards",
}) => {
  const {
    serviceCategories,
    fetchServiceCategories,
    isLoading,
    error,
    activeCategoryId: storeCategoryId,
  } = useServiceStore();

  const [isMounted, setIsMounted] = useState(false);

  // Функція для завантаження даних

  const loadData = useCallback(async () => {
    try {
      await fetchServiceCategories();
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }, [fetchServiceCategories]);

  // Мемоізована мапа категорій для швидкого пошуку
  const categoryMap = useMemo(() => {
    if (!serviceCategories || !Array.isArray(serviceCategories)) {
      return {};
    }
    return serviceCategories.reduce(
      (acc: Record<string, string>, category: ServiceCategory) => {
        acc[category.id] = category.name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [serviceCategories]);

  useEffect(() => {
    if (!serviceCategories || serviceCategories.length === 0) {
      loadData();
    }
    setIsMounted(true);
  }, [loadData, serviceCategories]);

  // Compute filtered services locally without external dependencies
  const effectiveCategoryId =
    activeCategoryIdProp !== null && activeCategoryIdProp !== undefined
      ? activeCategoryIdProp
      : storeCategoryId;

  const servicesToDisplay = useMemo(() => {
    if (!Array.isArray(services)) return [];
    return effectiveCategoryId
      ? services.filter((s) => s.categoryId === effectiveCategoryId)
      : services;
  }, [services, effectiveCategoryId]);

  // Show null before mounting (for SSR)
  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-stone-600 p-2 rounded-xl border-[2px] border-yellow-500">
      {/* <div className="bg-slate-50 p-2 rounded-xl"> */}
      <h2 className="text-2xl text-yellow-400 mb-4 font-semibold">
        Lista usług
      </h2>

      {/* Обробка помилок */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Контент */}
      {isLoading ? (
        <LoadingState />
      ) : servicesToDisplay.length > 0 ? (
        viewMode === "table" ? (
          <ServiceTableView
            services={servicesToDisplay}
            categoryMap={categoryMap}
          />
        ) : (
          <ul className="grid grid-cols-1 place-items-center items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
            {servicesToDisplay.map((service: ServiceProps) => (
              <ServiceCard
                key={service.serviceId}
                service={service}
                categoryName={categoryMap[service.categoryId]}
              />
            ))}
          </ul>
        )
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default ShowServices;
