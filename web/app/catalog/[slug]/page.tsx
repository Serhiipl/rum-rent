import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getServicesByCategorySlug,
} from "@/lib/prisma-operations";
import ServiceCard from "@/components/product-card";

export const runtime = "nodejs";
export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
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
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold"> {category.name}</h1>
          <Link className="text-sm underline" href="/">
            Główna
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="text-stone-500">
            Немає доступних сервісів у цій категорії.
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
