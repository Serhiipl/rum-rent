import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Gallery from "@/components/galery-tab";
import { BackButton } from "@/components/back-button";
import ContactForm from "@/components/contact-form";
import PhoneLink from "@/components/phone-link";

type ProductPageParams = Promise<{ serviceId: string }>;

interface ProductPageProps {
  params: ProductPageParams;
}

const getServiceById = cache(async (serviceId: string) => {
  if (!serviceId) {
    return null;
  }

  return prisma.service.findUnique({
    where: { serviceId },
    include: {
      category: true,
      images: true,
    },
  });
});

export const revalidate = 0;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { serviceId } = await params;
  if (!serviceId) {
    return { title: "Usługa nieznaleziona" };
  }

  const service = await getServiceById(serviceId);
  if (!service) {
    return { title: "Usługa nieznaleziona" };
  }

  return {
    title: `${service.name} | RumRent`,
    description: service.description ?? undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { serviceId } = await params;
  const service = await getServiceById(serviceId);

  if (!service) {
    return notFound();
  }

  // Local badge to mirror ServiceCard quantity styling
  const QuantityBadge = ({ quantity }: { quantity: number }) => (
    <span
      className={`inline-flex items-center pr-2 py-1 rounded-full text-xs font-semibold ${
        quantity > 0
          ? "bg-green-100 text-green-600"
          : "bg-red-100 text-orange-600"
      }`}
    >
      <span
        className={`flex justify-center items-center ml-1 w-4 h-4 rounded-full mr-1 ${
          quantity > 0 ? "bg-green-300" : "bg-orange-300"
        }`}
      >
        {quantity}
      </span>
      {quantity == 1
        ? "Dostępny"
        : quantity > 0
        ? "Dostępne"
        : "Zadzwoń do nas"}
    </span>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-yellow-50 rounded-lg border border-amber-500 shadow-sm shadow-yellow-400 overflow-hidden">
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {service.name}
          </h1>
          <div className="flex items-center justify-between mb-3">
            <QuantityBadge quantity={service.quantity ?? 0} />
            <p className="text-sm text-slate-950">
              Cena za dzień
              <span className="font-bold"> {service.rentalPrice} PLN</span>
            </p>
          </div>
        </div>

        <div className="px-4 mb-4">
          <Gallery images={service.images} aspectClass="aspect-square" />
        </div>

        <div className="px-4 pb-4 space-y-2 text-gray-700">
          <p className="text-gray-600">
            <strong>Kategoria:</strong>{" "}
            {service.category?.name || "Brak kategorii"}
          </p>
          {service.deposit !== undefined && (
            <p>
              <strong>Depozyt:</strong> {service.deposit} PLN
            </p>
          )}
          {service.rentalPeriod !== undefined && (
            <p>
              <strong>Okres wynajmu:</strong> {service.rentalPeriod} dni
            </p>
          )}
          {service.condition && (
            <p>
              <strong>Stan:</strong> {service.condition}
            </p>
          )}
          {service.description && (
            <p className="text-gray-600">{service.description}</p>
          )}
        </div>
        <div className="flex flex-col items-center space-y-2 w-full pt-2 border-t border-gray-300">
          <p className="text-sm text-gray-600 ">
            Zadzwoń i zapytaj o dostępność:
          </p>
          <PhoneLink />
        </div>
        <div className="px-4 pb-6">
          <h2 className="text-xl font-semibold mb-3">Skontaktuj się z nami</h2>
          <ContactForm
            productName={service.name}
            productId={service.serviceId}
            productImageUrl={service.images?.[0]?.url}
            receiverEmail={process.env.NEXT_PUBLIC_CONTACT_RECEIVER}
          />
        </div>
      </div>
      <BackButton />
    </div>
  );
}
