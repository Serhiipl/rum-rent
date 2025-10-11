import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ServiceProps } from "@/lib/types";
import Gallery from "@/components/galery-tab";
import PhoneLink from "../phone-link";
import ContactForm from "../contact-form";

interface ServiceModalPopupProps {
  service: ServiceProps;
  onClose: () => void;
}

const ServiceModalPopup: React.FC<ServiceModalPopupProps> = ({
  service,
  onClose,
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full mt-7 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-auto md:my-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {service.name}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Szczegóły usługi, galeria, opis, dostępność i formularz kontaktowy.
        </DialogDescription>

        <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-6 mt-4 border border-gray-400 p-2 rounded-md">
          <div className="w-full space-y-3 border  p-4 rounded-md">
            <Gallery images={service.images} />
          </div>

          <div className="text-gray-700 space-y-3 border border-amber-400 p-4 rounded-md">
            <p>
              <strong>Cena wynajmu:</strong> {service.rentalPrice} zł/doba
            </p>
            <p>
              <strong>Min. czas wypożyczenia:</strong> {service.rentalPeriod}{" "}
              {service.rentalPeriod === 1 ? "dzień" : "dni"}
            </p>
            <p>
              <strong>Stan:</strong> {service.condition}
            </p>
            <p>
              <strong>Depozyt:</strong> {service.deposit} zł
            </p>
            <p>
              <strong>Ilość na magazynie:</strong> {service.quantity}
            </p>
            <div className="flex flex-col items-center space-y-2 w-full pt-2 border-t border-gray-300">
              <p className="text-sm text-gray-600 ">
                Zadzwoń i zapytaj o dostępność:
              </p>
              <PhoneLink />
            </div>
          </div>
          <div className="flex flex-col text-gray-700 space-y-2 w-full border border-amber-400 p-4 rounded-md md:col-span-2">
            <span className="font-semibold mx-auto">Opis produktu:</span>
            <p className="text-sm w-full leading-relaxed">
              {service.description || "Brak opisu."}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-full border border-amber-400 p-4 rounded-md md:col-span-2">
            <span className="font-semibold mb-2">Chcesz wypożyczyć?</span>
            <div className="flex flex-row  w-full space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-col items-center space-y-2 w-full">
                <ContactForm
                  productName={service.name}
                  productId={service.serviceId}
                  productImageUrl={service.images?.[0]?.url}
                  receiverEmail={process.env.NEXT_PUBLIC_CONTACT_RECEIVER}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModalPopup;
