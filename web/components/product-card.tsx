"use client";

import Image from "next/image";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ServiceModalPopup from "./modals/serviceModalPopup";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
// Use public asset path to avoid Turbopack static import issues
const NO_IMAGE_SRC = "/no-image.jpg";

export interface ServiceProps {
  serviceId: string;
  name: string;
  description: string;
  rentalPrice: number;
  deposit: number;
  quantity: number;
  rentalPeriod: number;
  condition: string;
  images: Image[];
  available: boolean;
  categoryId: string;
}

export interface Image {
  id: string;
  serviceId: string;
  url: string;
  createdAt: string;
}

const ItemQuantity: React.FC<{ service: ServiceProps }> = ({ service }) => (
  <span
    className={`inline-flex items-center pr-2 py-1 rounded-full text-xs font-semibold ${
      service.quantity > 0
        ? "bg-green-100 text-green-600"
        : "bg-red-100 text-orange-600"
    }`}
  >
    <span
      className={`flex justify-center items-center ml-1 w-4 h-4 rounded-full mr-1 ${
        service.quantity > 0 ? "bg-green-300" : "bg-orange-300"
      }`}
    >
      {service.quantity}
    </span>
    {service.quantity == 1
      ? "Dostępny"
      : service.quantity > 0
      ? "Dostępne"
      : "Zadzwoń do nas"}
  </span>
);

const ServiceCard: React.FC<{
  service: ServiceProps;
  categoryName?: string;
}> = ({ service }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (isMobile) {
      router.push(`/services/${service.serviceId}`);
    } else {
      setShowModal(true);
    }
  };
  return (
    <>
      <li className="group bg-yellow-50 space-y-5 rounded-lg inset-shadow-md inset-shadow-stone-400  shadow-sm shadow-yellow-400 hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-amber-500">
        {/* <li className="group bg-yellow-50 space-y-5 p-4 rounded-lg inset-shadow-md inset-shadow-stone-400  shadow-sm shadow-yellow-400 hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-amber-500"> */}
        <div className="rounded-xl mx-auto bg-yellow-50  relative">
          {/* <div className="aspect-square w-full rounded-xl  bg-yellow-50  relative "> */}
          {/* Зображення послуги */}
          {service.images.length > 0 ? (
            <Image
              src={service.images[0].url}
              alt={service.name}
              width={300}
              height={200}
              priority
              className="aspect-[4/3] w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              // className="aspect-square object-cover rounded-lg mx-auto transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-48 sm:h-64 md:h-72 rounded-lg mx-auto bg-yellow-50 ">
              <Image
                src={NO_IMAGE_SRC}
                alt="Brak zdjęcia"
                width={300}
                height={200}
                className="aspect-square object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          {/* info */}
          <div className="flex flex-col bg-yellow-50 px-3  gap-2 items-start mb-2">
            <h3 className="text-lg ml-1 mt-3 font-semibold text-gray-900 truncate ">
              {service.name}
            </h3>
            <Separator className="w-full bg-gray-400" />
            <div className="flex justify-between bg-yellow-50  w-full items-center">
              <ItemQuantity service={service} />
              <p className="text-sm font-normal text-slate-950">
                <span className="font-bold"> {service.rentalPrice} PLN</span>
                /dzień
              </p>
            </div>
          </div>
          {/* button */}
          <div className="flex justify-center bg-yellow-50 mb-3 mt-auto w-full">
            {isMobile ? (
              <Button
                onClick={handleClick}
                variant="outline"
                className="m-4 mx-auto w-auto "
              >
                Zobacz Szczegóły
              </Button>
            ) : (
              <Button
                onClick={() => setShowModal(true)}
                variant="outline"
                className="border border-stone-600 shadow-slate-300 bg-zinc-200 text-zinc-800 font-semibold w-auto transition-transform duration-300 group-hover:scale-105 group-hover:bg-zinc-300"
              >
                Zobacz Szczegóły
              </Button>
            )}
          </div>
        </div>
      </li>
      {/* Okno pop-up dla pulpitu */}
      {!isMobile && showModal && (
        <ServiceModalPopup
          service={service}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
export default ServiceCard;
