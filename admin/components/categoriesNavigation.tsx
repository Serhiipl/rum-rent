import React, { useEffect, useState } from "react";
import useServiceStore from "@/lib/serviceStore";
import ShowServices from "@/components/showServices";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import HeroCarousel from "./banners-component";
// Filtering is handled inside ShowServices

const CategoryMenu: React.FC = () => {
  const { services, serviceCategories, fetchServices, fetchServiceCategories } =
    useServiceStore();
  
  // Ensure data is loaded
  useEffect(() => {
    if (!services || services.length === 0) {
      fetchServices();
    }
    if (!serviceCategories || serviceCategories.length === 0) {
      fetchServiceCategories();
    }
  }, [services, serviceCategories, fetchServices, fetchServiceCategories]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // const filteredServices = useMemo(() => {
  //   if (!activeCategoryId) return services;
  //   return services.filter((s) => s.categoryId === activeCategoryId);
  // }, [services, activeCategoryId]);
  // const { fetchBanners, fetchServices, fetchServiceCategories } =
  //   useServiceStore();

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       await Promise.all([
  //         fetchServices(),
  //         fetchServiceCategories(),
  //         fetchBanners(),
  //       ]);
  //     } catch (error) {
  //       console.error("Błąd ładowania danych:", error);
  //     }
  //   };

  //   loadData();
  // }, [fetchServices, fetchServiceCategories, fetchBanners]);
  return (
    <div className=" w-full">
      {/* Desktop Tabs */}
      {/* <div className="hidden text-lg sm:flex flex-row sm:top-20 sm:z-20  mb-6">
        <Tabs defaultValue="all" value={activeCategoryId || "all"}>
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveCategoryId(null)}>
              Wszystkie
            </TabsTrigger>
            {serviceCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div> */}

      {/* Mobile Sheet */}
      <div className="sm:hidden flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu className="w-5 h-5 mr-2" /> Меню
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="space-y-3 mt-4">
              <Button
                variant={activeCategoryId === null ? "default" : "ghost"}
                onClick={() => setActiveCategoryId(null)}
                className="w-full"
              >
                Wszystkie
              </Button>
              {serviceCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategoryId === cat.id ? "default" : "ghost"}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className="w-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <HeroCarousel />
      <ShowServices services={services} activeCategoryId={activeCategoryId} />
      {/* <ShowServices services={filteredServices} /> */}
    </div>
  );
};

export default CategoryMenu;
