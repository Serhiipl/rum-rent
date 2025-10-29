import Link from "next/link";
import { getCategories } from "@/lib/mongo-operations";
import { buildCategoryTree } from "@/lib/category-tree";

export const runtime = "nodejs";
export const revalidate = 60;

export default async function CatalogIndex() {
  const categories = await getCategories();
  const tree = buildCategoryTree(categories);

  const renderTree = (
    nodes: ReturnType<typeof buildCategoryTree>
  ): React.ReactNode => {
    if (!nodes.length) return null;
    return (
      <ul className="space-y-3">
        {nodes.map((node) => (
          <li key={node.id}>
            <div className="rounded border p-4 bg-white/70">
              <Link className="underline" href={`/catalog/${node.slug}`}>
                {node.name}
              </Link>
            </div>
            {node.children.length > 0 && (
              <div className="ml-4 mt-2 border-l border-stone-200 pl-4">
                {renderTree(node.children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <main className="font-sans min-h-screen p-8 sm:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Kategorii</h1>
        {categories.length === 0 ? (
          <p className="text-stone-500">Brak kategorii.</p>
        ) : (
          renderTree(tree)
        )}
      </div>
    </main>
  );
}
