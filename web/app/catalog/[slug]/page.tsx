import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCategorySlugs,
  getServicesByCategorySlug,
} from "@/lib/prisma-operations";

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
  console.log(services);

  return (
    <main className="font-sans min-h-screen p-8 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">Категорія: {category.name}</h1>
          <Link className="text-sm underline" href="/">
            На головну
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="text-stone-500">
            Немає доступних сервісів у цій категорії.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {services.map((s) => (
              <li key={s.id} className="rounded border p-4 bg-white/70">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-stone-600">
                  {s.rentalPrice} zł / доба
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
