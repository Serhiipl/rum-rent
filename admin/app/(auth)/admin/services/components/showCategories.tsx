"use client";

import useServiceStore, { ServiceCategory } from "@/lib/serviceStore";
import React, { useEffect, useMemo, useState } from "react";
import CellActionCategory from "./cellActionCategories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ShowCategories: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false); // added last

  const { serviceCategories, fetchServiceCategories } = useServiceStore();
  useEffect(() => {
    fetchServiceCategories();
    setIsMounted(true); //added last
  }, [fetchServiceCategories]);

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

  const getSortedChildren = (parentId: string | null) => {
    const children = groupedCategories[parentId ?? "root"] ?? [];
    return [...children].sort((a, b) =>
      a.name.localeCompare(b.name, "pl", { sensitivity: "base" })
    );
  };

  const renderSubcategoryList = (
    parentId: string,
    depth = 0
  ): React.ReactNode => {
    const children = getSortedChildren(parentId);

    if (children.length === 0) {
      return null;
    }

    return (
      <ul
        className={`space-y-2 ${
          depth > 0 ? "ml-4 border-l border-stone-300 pl-3" : ""
        }`}
      >
        {children.map((category) => (
          <li key={category.id} className="space-y-2">
            <div className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-900">
                {category.name}
              </span>
              <CellActionCategory data={category} />
            </div>
            {renderSubcategoryList(category.id, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  const rootCategories = getSortedChildren(null);

  const renderRootCategories = () => {
    if (rootCategories.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          Brak głównych kategorii do wyświetlenia.
        </p>
      );
    }

    return (
      <Accordion type="multiple" className=" rounded-md bg-stone-100 p-2">
        {rootCategories.map((category) => {
          const childrenTree = renderSubcategoryList(category.id);

          return (
            <AccordionItem key={category.id} value={category.id}>
              <div className="flex justify-between items-stretch gap-3 px-4 pt-2">
                <AccordionTrigger className="flex-1 px-0">
                  <span className="text-base font-semibold text-gray-900">
                    {category.name}
                  </span>
                </AccordionTrigger>
                <CellActionCategory data={category} className="self-center" />
              </div>
              <AccordionContent className="px-4">
                {childrenTree ?? (
                  <p className="text-sm text-muted-foreground">
                    Brak podkategorii dla tej kategorii.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

  if (!isMounted) {
    //added last
    return null;
  }
  return (
    <div className=" bg-stone-600 p-4 border-black  w-full rounded-lg">
      {serviceCategories.length > 0 ? (
        <>
          <div className="sm:hidden bg-stone-300 rounded-md mb-2 px-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="mobile-categories">
                <AccordionTrigger className="px-0">
                  <h2 className="text-xs bg-stone-300 text-center font-bold text-black">
                    Dostępne kategorie: {serviceCategories.length}
                  </h2>
                </AccordionTrigger>
                <AccordionContent>{renderRootCategories()}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-xs text-center sm:text-xl font-bold mb-4 text-black">
              Dostępne kategorie: {serviceCategories.length}
            </h2>
            {renderRootCategories()}
          </div>
        </>
      ) : (
        <p>
          Brak dostępnych kategorii, jak masz pytania skontaktuj się z
          administratorem.
        </p>
      )}
    </div>
  );
};
