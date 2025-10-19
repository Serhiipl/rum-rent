import Link from "next/link";
import { getCategories } from "@/lib/mongo-operations";

export const runtime = "nodejs";
export const revalidate = 60;

export default async function CatalogIndex() {
  const categories = await getCategories();
  return (
    <main className="font-sans min-h-screen p-8 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Kategorii</h1>
        {categories.length === 0 ? (
          <p className="text-stone-500">Brak kategorii.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((c) => (
              <li key={c.id} className="rounded border p-4 bg-white/70">
                <Link className="underline" href={`/catalog/${c.slug}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
