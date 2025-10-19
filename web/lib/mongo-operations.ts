import { getMongoDb } from "@/lib/mongodb";
import type { Banner, ServiceProps, ServiceWithCategory } from "./types";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryDocument = {
  _id: string;
  name: string;
  slug: string;
};

type ServiceDocument = {
  _id: string;
  name: string;
  description?: string | null;
  rentalPrice: number;
  deposit?: number | null;
  quantity?: number | null;
  rentalPeriod?: number | null;
  condition?: string | null;
  available?: boolean;
  categoryId?: string | null;
};

type ImageDocument = {
  _id: string;
  serviceId: string;
  url: string;
  createdAt?: Date;
};

type BannerDocument = {
  _id: string;
  title: string;
  description?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

type ServiceWithImages = ServiceDocument & { images?: ImageDocument[] };

const AVAILABLE_MATCH = { available: true };

const SORT_BY_NAME_ASC = { name: 1 as const };

const mapCategory = (category: CategoryDocument): Category => ({
  id: String(category._id),
  name: category.name,
  slug: category.slug,
});

const toIsoString = (value: Date | string | undefined | null): string => {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const mapImage = (image: ImageDocument) => ({
  id: String(image._id),
  serviceId: String(image.serviceId),
  url: image.url,
  createdAt: toIsoString(image.createdAt),
});

const mapService = (service: ServiceWithImages): ServiceProps => ({
  serviceId: String(service._id),
  name: service.name,
  description: service.description ?? "",
  rentalPrice: service.rentalPrice ?? 0,
  deposit: service.deposit ?? 0,
  quantity: service.quantity ?? 0,
  rentalPeriod: service.rentalPeriod ?? 0,
  condition: service.condition ?? "",
  images: (service.images ?? []).map(mapImage),
  available: service.available ?? true,
  categoryId: service.categoryId ? String(service.categoryId) : "",
});

export async function getCategories(): Promise<Category[]> {
  const db = await getMongoDb();
  const categories = await db
    .collection<CategoryDocument>("Category")
    .find({}, { projection: { name: 1, slug: 1 } })
    .sort(SORT_BY_NAME_ASC)
    .toArray();

  return categories.map(mapCategory);
}

export async function getServicesByCategorySlug(slug: string): Promise<{
  category: Category | null;
  services: ServiceProps[];
}> {
  const db = await getMongoDb();
  const categoryDoc = await db
    .collection<CategoryDocument>("Category")
    .findOne({ slug }, { projection: { name: 1, slug: 1 } });

  if (!categoryDoc) return { category: null, services: [] };

  const services = await db
    .collection<ServiceDocument>("Service")
    .aggregate<ServiceWithImages>([
      { $match: { categoryId: categoryDoc._id, ...AVAILABLE_MATCH } },
      { $sort: SORT_BY_NAME_ASC },
      {
        $lookup: {
          from: "Image",
          localField: "_id",
          foreignField: "serviceId",
          as: "images",
        },
      },
    ])
    .toArray();

  return { category: mapCategory(categoryDoc), services: services.map(mapService) };
}

export async function getAllServices(): Promise<ServiceProps[]> {
  const db = await getMongoDb();
  const services = await db
    .collection<ServiceDocument>("Service")
    .aggregate<ServiceWithImages>([
      { $match: AVAILABLE_MATCH },
      { $sort: SORT_BY_NAME_ASC },
      {
        $lookup: {
          from: "Image",
          localField: "_id",
          foreignField: "serviceId",
          as: "images",
        },
      },
    ])
    .toArray();

  return services.map(mapService);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const db = await getMongoDb();
  const categories = await db
    .collection<CategoryDocument>("Category")
    .find({}, { projection: { slug: 1 } })
    .toArray();

  return categories.map((category) => category.slug);
}

export async function getBanners(): Promise<Banner[]> {
  const db = await getMongoDb();
  const banners = await db
    .collection<BannerDocument>("Banner")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return banners.map((banner) => ({
    id: String(banner._id),
    title: banner.title,
    description: banner.description ?? undefined,
    ctaText: banner.ctaText ?? undefined,
    ctaLink: banner.ctaLink ?? undefined,
    imageUrl: banner.imageUrl,
    createdAt: toIsoString(banner.createdAt),
    updatedAt: toIsoString(banner.updatedAt),
  }));
}

export async function getServiceForSeo(serviceId: string): Promise<{
  name: string;
  description?: string | null;
  rentalPrice: number;
  quantity: number | null;
  images: { url: string }[];
  category: { name: string | null; slug: string | null } | null;
} | null> {
  const db = await getMongoDb();
  const service = await db
    .collection<ServiceDocument>("Service")
    .aggregate<
      ServiceDocument & {
        images: ImageDocument[];
        category?: CategoryDocument;
      }
    >([
      { $match: { _id: serviceId } },
      {
        $lookup: {
          from: "Image",
          localField: "_id",
          foreignField: "serviceId",
          as: "images",
        },
      },
      {
        $lookup: {
          from: "Category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ])
    .next();

  if (!service) return null;

  return {
    name: service.name,
    description: service.description,
    rentalPrice: service.rentalPrice,
    quantity: service.quantity ?? null,
    images: (service.images ?? []).map((image) => ({ url: image.url })),
    category: service.category
      ? {
          name: service.category.name ?? null,
          slug: service.category.slug ?? null,
        }
      : null,
  };
}

export async function getServiceWithCategory(
  serviceId: string
): Promise<ServiceWithCategory | null> {
  const db = await getMongoDb();
  const service = await db
    .collection<ServiceDocument>("Service")
    .aggregate<
      ServiceWithImages & {
        category?: CategoryDocument;
      }
    >([
      { $match: { _id: serviceId } },
      {
        $lookup: {
          from: "Image",
          localField: "_id",
          foreignField: "serviceId",
          as: "images",
        },
      },
      {
        $lookup: {
          from: "Category",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ])
    .next();

  if (!service) return null;

  return {
    ...mapService(service),
    category: service.category
      ? {
          name: service.category.name ?? null,
          slug: service.category.slug ?? null,
        }
      : null,
  };
}
