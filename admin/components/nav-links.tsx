import useServiceStore, { ServiceProps } from "@/lib/serviceStore";
// import Link from "next/link";
// import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useCallback } from "react";

export const filterServicesByCategory = (
  services: ServiceProps[],
  categoryId: string | null
): ServiceProps[] =>
  categoryId ? services.filter((s) => s.categoryId === categoryId) : services;

const NavLinks = () => {
  const { serviceCategories, activeCategoryId, setActiveCategoryId } =
    useServiceStore();

  const handleCategoryChange = useCallback(
    (value: string) => {
      setActiveCategoryId(value === "all" ? null : value);
    },
    [setActiveCategoryId]
  );
  const currentValue = activeCategoryId ?? "all";

  return (
    <>
      {/* Desktop Tabs */}
      <div className="hidden text-lg bg-transparent sm:flex flex-row sm:top-20 sm:z-20  mb-6">
        <Tabs value={currentValue} onValueChange={handleCategoryChange}>
          <TabsList
            className="bg-stone-700 border h-12  border-yellow-500 rounded-lg"
            aria-label="Kategorie usług"
          >
            <TabsTrigger className="text-yellow-500 text-lg" value="all">
              Wszystkie
            </TabsTrigger>
            {serviceCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                className={`rounded-sm text-lg  ${
                  cat.id === currentValue
                    ? "text-yellow-500 bg-amber-500"
                    : "text-white"
                }`}
                value={cat.id}
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Sheet */}
      <div className="sm:hidden flex justify-end mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu className="w-5 h-5 mr-2" /> MENU
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="sr-only">Kategorie</SheetTitle>
            </SheetHeader>
            <div className="space-y-3 mt-4">
              <Button
                variant={activeCategoryId === null ? "default" : "ghost"}
                onClick={() => handleCategoryChange("all")}
                aria-pressed={activeCategoryId === null}
                className="w-full"
              >
                Wszystkie
              </Button>
              {serviceCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategoryId === cat.id ? "default" : "ghost"}
                  onClick={() => handleCategoryChange(cat.id)}
                  aria-pressed={activeCategoryId === cat.id}
                  className="w-full"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
export default NavLinks;
