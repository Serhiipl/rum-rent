import type { Category as PrismaCategory } from "@prisma/client";
import { getPrismaClient } from "@/lib/prisma";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export async function getCategoriesPrisma(): Promise<Category[]> {
  const prisma = await getPrismaClient();
  const rows = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: [{ name: "asc" }],
  });
  return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug }));
}

export type Service = {
  id: string;
  name: string;
  rentalPrice: number;
  available: boolean;
};

export async function getServicesByCategorySlug(slug: string): Promise<{
  category: Category | null;
  services: Service[];
}> {
  const prisma = await getPrismaClient();
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });
  if (!category) return { category: null, services: [] };

  const rows = await prisma.service.findMany({
    where: { categoryId: category.id, available: true },
    select: { serviceId: true, name: true, rentalPrice: true, available: true },
    orderBy: [{ name: "asc" }],
  });
  return {
    category,
    services: rows.map((r) => ({
      id: r.serviceId,
      name: r.name,
      rentalPrice: r.rentalPrice,
      available: r.available,
    })),
  };
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const prisma = await getPrismaClient();
  const rows = await prisma.category.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
