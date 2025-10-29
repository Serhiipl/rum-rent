import { getMongoDb } from "@/lib/mongodb";
import type { Banner, ServiceProps, ServiceWithCategory } from "./types";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

type CategoryDocument = {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
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
  parentId: typeof category.parentId === "string" ? category.parentId : null,
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
    .find({}, { projection: { name: 1, slug: 1, parentId: 1 } })
    .sort(SORT_BY_NAME_ASC)
    .toArray();

  return categories.map(mapCategory);
}

export async function getServicesByCategorySlug(slug: string): Promise<{
  category: Category | null;
  services: ServiceProps[];
  subcategories: Category[];
  breadcrumbs: Category[];
}> {
  const db = await getMongoDb();
  const categoryAggregation = await db
    .collection<CategoryDocument>("Category")
    .aggregate<
      CategoryDocument & { descendants: CategoryDocument[] }
    >([
      { $match: { slug } },
      {
        $graphLookup: {
          from: "Category",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "descendants",
        },
      },
    ])
    .next();

  if (!categoryAggregation) {
    return {
      category: null,
      services: [],
      subcategories: [],
      breadcrumbs: [],
    };
  }

  const category = mapCategory(categoryAggregation);
  const descendants = categoryAggregation.descendants ?? [];
  const subcategories = descendants
    .filter((descendant) => descendant.parentId === categoryAggregation._id)
    .map(mapCategory);

  const descendantIds = descendants.map((descendant) => String(descendant._id));
  const categoryIds = [String(categoryAggregation._id), ...descendantIds];

  const services = await db
    .collection<ServiceDocument>("Service")
    .aggregate<ServiceWithImages>([
      {
        $match: {
          categoryId: { $in: categoryIds },
          ...AVAILABLE_MATCH,
        },
      },
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

  const breadcrumbs: Category[] = [];
  let currentParentId =
    typeof categoryAggregation.parentId === "string"
      ? categoryAggregation.parentId
      : null;

  while (currentParentId) {
    const parentDoc = await db.collection<CategoryDocument>("Category").findOne(
      { _id: currentParentId },
      { projection: { _id: 1, name: 1, slug: 1, parentId: 1 } }
    );

    if (!parentDoc) {
      break;
    }

    breadcrumbs.unshift(mapCategory(parentDoc));
    currentParentId =
      typeof parentDoc.parentId === "string" ? parentDoc.parentId : null;
  }

  return {
    category,
    services: services.map(mapService),
    subcategories,
    breadcrumbs,
  };
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
