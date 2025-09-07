import { notFound } from "next/navigation";
import Gallery from "@/components/galery-tab";
import { BackButton } from "@/components/back-button";
import { NextPage } from "next";
import ContactForm from "@/components/contact-form";

//komponent strony usługi dla telefonów
interface ProductPageProps {
  params: Promise<{ serviceId: string }>;
}
const ProductPage: NextPage<ProductPageProps> = async ({ params }) => {
  const { serviceId } = await params;
  if (!serviceId) {
    return notFound();
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/services/${serviceId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const service = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{service.name}</h1>
      <div className="mb-4">
        <Gallery images={service.images} />
      </div>
      <p className="text-gray-600 mb-4">
        <strong>Kategoria:</strong> {service.category?.name || "Brak kategorii"}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Cena:</strong> {service.price} zł
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Trwanie:</strong> {service.duration} min
      </p>
      <p className="text-gray-600">{service.description}</p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Skontaktuj się z nami</h2>
        <ContactForm
          productName={service.name}
          productId={service.serviceId || service.id}
          productImageUrl={service.images?.[0]?.url}
          receiverEmail={process.env.NEXT_PUBLIC_CONTACT_RECEIVER}
        />
      </div>
      <BackButton />
    </div>
  );
};
export default ProductPage;
