"use client";
import HeroCarousel from "@/components/banners-component";
import ShowServices from "@/components/showServices";
import useServiceStore, { ServiceProps } from "@/lib/serviceStore";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    services = [],
    // serviceCategories = [],
    fetchServices,
    fetchServiceCategories,
    // isLoading,
  } = useServiceStore();

  const [filteredServices, setFilteredServices] = useState<ServiceProps[]>([]);

  // const handleFilteredServicesChange = (filtered: ServiceProps[]) => {
  //   setFilteredServices(Array.isArray(filtered) ? filtered : []);
  // };

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

  return (
    <div className="flex flex-col items-center bg-stone-700 border border-amber-500 rounded-xl min-h-screen sm:py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 md:px-20 sm:py-10 text-center">
        <HeroCarousel />
        <ShowServices services={filteredServices} />
      </main>
    </div>
  );
}
