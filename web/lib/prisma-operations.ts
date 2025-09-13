import prisma from "@/lib/prisma";
import { Banner, ServiceProps } from "./types";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export async function getCategoriesPrisma(): Promise<Category[]> {
  const getCategories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: [{ name: "asc" }],
  });
  return getCategories.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
  }));
}

export async function getServicesByCategorySlug(slug: string): Promise<{
  category: Category | null;
  services: ServiceProps[];
}> {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true },
  });
  if (!category) return { category: null, services: [] };

  const rows = await prisma.service.findMany({
    where: { categoryId: category.id, available: true },
    select: {
      serviceId: true,
      name: true,
      description: true,
      rentalPrice: true,
      deposit: true,
      quantity: true,
      rentalPeriod: true,
      condition: true,
      available: true,
      categoryId: true,
      images: {
        select: { id: true, serviceId: true, url: true, createdAt: true },
      },
    },
    orderBy: [{ name: "asc" }],
  });
  return {
    category,
    services: rows.map((r) => ({
      serviceId: r.serviceId,
      name: r.name,
      description: r.description,
      rentalPrice: r.rentalPrice,
      deposit: r.deposit ?? 0,
      quantity: r.quantity ?? 0,
      rentalPeriod: r.rentalPeriod ?? 0,
      condition: r.condition ?? "",
      images: (r.images ?? []).map((img) => ({
        id: img.id,
        serviceId: img.serviceId,
        url: img.url,
        createdAt: (img.createdAt as Date).toISOString(),
      })),
      available: r.available ?? true,
      categoryId: r.categoryId ?? "",
    })),
  };
}

export async function getAllServices(): Promise<ServiceProps[]> {
  const rows = await prisma.service.findMany({
    where: { available: true },
    select: {
      serviceId: true,
      name: true,
      description: true,
      rentalPrice: true,
      deposit: true,
      quantity: true,
      rentalPeriod: true,
      condition: true,
      available: true,
      categoryId: true,
      images: {
        select: { id: true, serviceId: true, url: true, createdAt: true },
      },
    },
    orderBy: [{ name: "asc" }],
  });
  return rows.map((r) => ({
    serviceId: r.serviceId,
    name: r.name,
    description: r.description,
    rentalPrice: r.rentalPrice,
    deposit: r.deposit ?? 0,
    quantity: r.quantity ?? 0,
    rentalPeriod: r.rentalPeriod ?? 0,
    condition: r.condition ?? "",
    images: (r.images ?? []).map((img) => ({
      id: img.id,
      serviceId: img.serviceId,
      url: img.url,
      createdAt: (img.createdAt as Date).toISOString(),
    })),
    available: r.available ?? true,
    categoryId: r.categoryId ?? "",
  }));
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const rows = await prisma.category.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getBanners(): Promise<Banner[]> {
  const banners = await prisma.banner.findMany({
    orderBy: { createdAt: "desc" },
  });
  return banners.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description ?? undefined,
    ctaText: b.ctaText ?? undefined,
    ctaLink: b.ctaLink ?? undefined,
    imageUrl: b.imageUrl,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));
}
