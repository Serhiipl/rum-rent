"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState, useMemo, useCallback } from "react";
// import CellAction from "./cellAction";
import { ServiceCategory, ServiceProps } from "@/lib/serviceStore";
import ServiceCard from "@/components/product-card";
import EmptyState from "@/components/emptyItemState";
import LoadingState from "./loadingItemState";

interface ShowServicesProps {
  services: ServiceProps[];
  activeCategoryId?: string | null;
}

const ShowServices: React.FC<ShowServicesProps> = ({
  services,
  activeCategoryId: activeCategoryIdProp = null,
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
        <ul className="grid grid-cols-1 place-items-center  items-center md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servicesToDisplay.map((service: ServiceProps) => (
            <ServiceCard
              key={service.serviceId}
              service={service}
              categoryName={categoryMap[service.categoryId]}
            />
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default ShowServices;
