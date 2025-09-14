import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import Gallery from "@/components/galery-tab";
import { BackButton } from "@/components/back-button";
import { NextPage } from "next";
import ContactForm from "@/components/contact-form";
import PhoneLink from "@/components/phone-link";
import { getServiceForSeo } from "@/lib/prisma-operations";

export const revalidate = 300; // Cache this page for 5 minutes

//komponent strony usługi dla telefonów
interface ProductPageProps {
  params: Promise<{ serviceId: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { serviceId } = await params;
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const service = await getServiceForSeo(serviceId);
  if (!service) {
    return {
      title: "Usługa nieznaleziona | RumRent",
      description: "Nie odnaleziono usługi.",
      alternates: { canonical: `/services/${serviceId}` },
    };
  }
  const title = `${service.name} | RumRent`;
  const description = service.description || "Szczegóły usługi i wynajmu.";
  const ogImage = service.images?.[0]?.url || `${base}/no-image.jpg`;
  const url = `/services/${serviceId}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      // Use a valid OpenGraph type supported by Next.js metadata
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
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
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return notFound();

  const service = await res.json();
  const seoInfo = await getServiceForSeo(serviceId);

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
    <div className="p-4 h-fit bg-stone-700 sm:p-6">
      <Script id="ld-product" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: service.name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          image: (service.images || []).map((i: any) => i.url).slice(0, 10),
          description: service.description,
          category: service.category?.name,
          offers: {
            "@type": "Offer",
            priceCurrency: "PLN",
            price: service.rentalPrice,
            availability:
              (service.quantity ?? 0) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/services/${
              service.serviceId || service.id
            }`,
          },
        })}
      </Script>
      <Script id="ld-breadcrumb-product" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Strona główna",
              item: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/`,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Katalog",
              item: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/catalog`,
            },
            seoInfo?.category?.slug
              ? {
                  "@type": "ListItem",
                  position: 3,
                  name: seoInfo.category.name || "Kategoria",
                  item: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/catalog/${
                    seoInfo.category.slug
                  }`,
                }
              : undefined,
            {
              "@type": "ListItem",
              position: seoInfo?.category?.slug ? 4 : 3,
              name: service.name,
              item: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/services/${
                service.serviceId || service.id
              }`,
            },
          ].filter(Boolean),
        })}
      </Script>
      <div className="bg-yellow-50 mt-20 rounded-lg border border-amber-500 shadow-sm shadow-yellow-400 overflow-hidden">
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
            productId={service.serviceId || service.id}
            productImageUrl={service.images?.[0]?.url}
            receiverEmail={process.env.NEXT_PUBLIC_CONTACT_RECEIVER}
          />
        </div>
      </div>
      <BackButton />
    </div>
  );
};
export default ProductPage;
