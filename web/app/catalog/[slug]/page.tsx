import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getServicesByCategorySlug,
} from "@/lib/mongo-operations";
import ServiceCard from "@/components/product-card";
import Script from "next/script";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const runtime = "nodejs";
export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getServicesByCategorySlug(slug);
  const title = category ? `${category.name}` : "Kategoria";
  const description = category
    ? `Sprawdź dostępne usługi w kategorii ${category.name} w RumRent.`
    : "Przeglądaj kategorie usług w RumRent.";
  const url = `/catalog/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const { category, services } = await getServicesByCategorySlug(slug);
  if (!category) return notFound();

  return (
    <main className="font-sans min-h-screen p-8 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mt-10 mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold"> {category.name}</h1>
          <button
            className=" group w-24 flex flex-row items-center justify-center border border-amber-500 rounded-md px-3 py-1 text-gray-700 hover:bg-gray-200 hover:border-amber-800 transition-all duration-200"
            aria-label="Powrót do strony głównej"
          >
            <ArrowLeft
              className=" left-2 mr-1 group-hover:text-amber-500 group-hover:mr-2 transition-all duration-200"
              size={16}
            />
            <Link className="text-sm" href="/">
              Główna
            </Link>
          </button>
        </div>
        <Script id="ld-breadcrumb-category" type="application/ld+json">
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
              {
                "@type": "ListItem",
                position: 3,
                name: category.name,
                item: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/catalog/${
                  category.slug
                }`,
              },
            ],
          })}
        </Script>

        {services.length === 0 ? (
          <p className="text-stone-500">
            Brak dostępnych usług w tej kategorii.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.serviceId} service={service} />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
