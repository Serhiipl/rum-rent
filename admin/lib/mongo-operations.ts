import { getMongoDb } from "@/lib/mongodb";
import { extractPublicIdFromUrl, getCloudinary } from "@/lib/cloudinary";

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
};

export type Image = {
  id: string;
  serviceId: string;
  url: string;
  createdAt: string;
};

export type Service = {
  serviceId: string;
  name: string;
  description: string;
  rentalPrice: number;
  rentalPeriod: number;
  deposit: number;
  quantity: number;
  condition: string;
  available: boolean;
  categoryId: string;
  images: Image[];
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    name: string | null;
    slug: string | null;
  } | null;
};

export type Banner = {
  id: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
};

export interface SettingsFormData {
  company_name: string;
  owner_name: string;
  company_address: string;
  company_phone: string;
  company_nip?: string | null;
  smtp_user_emailFrom: string;
  email_receiver: string;
  h1_title: string;
  motto_description: string;
}

type CategoryDocument = {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

type ServiceDocument = {
  _id: string;
  name: string;
  description: string;
  rentalPrice: number;
  rentalPeriod: number;
  deposit: number;
  quantity: number;
  condition: string;
  available: boolean;
  categoryId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  deletedBy?: string | null;
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
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
};

const toIsoString = (value?: Date | string | null): string => {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const mapCategory = (category: CategoryDocument): Category => ({
  id: String(category._id),
  name: category.name,
  slug: category.slug,
  parentId: typeof category.parentId === "string" ? category.parentId : null,
  createdAt: category.createdAt ? toIsoString(category.createdAt) : undefined,
  updatedAt: category.updatedAt ? toIsoString(category.updatedAt) : undefined,
  deletedAt: category.deletedAt ? toIsoString(category.deletedAt) : null,
});

const mapImage = (image: ImageDocument): Image => ({
  id: String(image._id),
  serviceId: String(image.serviceId),
  url: image.url,
  createdAt: toIsoString(image.createdAt ?? new Date()),
});

const mapService = (
  service: ServiceDocument & {
    images?: ImageDocument[];
    category?: CategoryDocument | null;
  }
): Service => ({
  serviceId: String(service._id),
  name: service.name,
  description: service.description ?? "",
  rentalPrice: service.rentalPrice ?? 0,
  rentalPeriod: service.rentalPeriod ?? 0,
  deposit: service.deposit ?? 0,
  quantity: service.quantity ?? 0,
  condition: service.condition ?? "",
  available: service.available ?? true,
  categoryId: service.categoryId ? String(service.categoryId) : "",
  images: (service.images ?? []).map(mapImage),
  deletedAt: service.deletedAt ? toIsoString(service.deletedAt) : null,
  deletedBy: service.deletedBy ?? null,
  createdAt: service.createdAt ? toIsoString(service.createdAt) : undefined,
  updatedAt: service.updatedAt ? toIsoString(service.updatedAt) : undefined,
  category: service.category
    ? {
        name: service.category.name ?? null,
        slug: service.category.slug ?? null,
      }
    : null,
});

const mapBanner = (banner: BannerDocument): Banner => ({
  id: String(banner._id),
  title: banner.title,
  description: banner.description ?? undefined,
  ctaText: banner.ctaText ?? undefined,
  ctaLink: banner.ctaLink ?? undefined,
  createdAt: toIsoString(banner.createdAt),
  updatedAt: toIsoString(banner.updatedAt),
  imageUrl: banner.imageUrl,
});

export async function getCategories(): Promise<Category[]> {
  const db = await getMongoDb();
  const categories = await db
    .collection<CategoryDocument>("Category")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return categories.map(mapCategory);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getMongoDb();
  const category = await db
    .collection<CategoryDocument>("Category")
    .findOne({ _id: id });
  return category ? mapCategory(category) : null;
}

export async function findCategoryByName(
  name: string
): Promise<Category | null> {
  const db = await getMongoDb();
  const category = await db
    .collection<CategoryDocument>("Category")
    .findOne({ name }, { collation: { locale: "en", strength: 2 } });
  return category ? mapCategory(category) : null;
}

export async function findCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const db = await getMongoDb();
  const category = await db
    .collection<CategoryDocument>("Category")
    .findOne({ slug });
  return category ? mapCategory(category) : null;
}

export async function insertCategory(data: {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}): Promise<Category> {
  const db = await getMongoDb();
  const now = new Date();
  await db.collection<CategoryDocument>("Category").insertOne({
    _id: data.id,
    name: data.name,
    slug: data.slug,
    parentId: data.parentId ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    parentId: data.parentId ?? null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export async function updateCategoryDoc(
  id: string,
  update: { name: string; slug: string; parentId?: string | null }
): Promise<void> {
  const db = await getMongoDb();
  const updateFields: Record<string, unknown> = {
    name: update.name,
    slug: update.slug,
    updatedAt: new Date(),
  };
  if (Object.prototype.hasOwnProperty.call(update, "parentId")) {
    updateFields.parentId = update.parentId ?? null;
  }
  await db
    .collection<CategoryDocument>("Category")
    .updateOne({ _id: id }, { $set: updateFields });
}

export async function deleteCategoryDoc(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection<CategoryDocument>("Category").deleteOne({ _id: id });
}

export async function categoryUsedByService(
  categoryId: string
): Promise<boolean> {
  const db = await getMongoDb();
  const service = await db
    .collection<ServiceDocument>("Service")
    .findOne({ categoryId });
  return Boolean(service);
}

export async function categoryHasChildren(
  categoryId: string
): Promise<boolean> {
  const db = await getMongoDb();
  const child = await db
    .collection<CategoryDocument>("Category")
    .findOne({ parentId: categoryId });
  return Boolean(child);
}

export async function getServices(): Promise<Service[]> {
  const db = await getMongoDb();
  const services = await db
    .collection<ServiceDocument>("Service")
    .aggregate<
      ServiceDocument & {
        images: ImageDocument[];
        category?: CategoryDocument;
      }
    >([
      { $sort: { createdAt: -1 } },
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
    .toArray();
  return services.map(mapService);
}

export async function getServiceById(
  serviceId: string
): Promise<Service | null> {
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
  return service ? mapService(service) : null;
}

export async function insertService(data: {
  serviceId: string;
  name: string;
  description: string;
  rentalPrice: number;
  rentalPeriod: number;
  deposit: number;
  quantity: number;
  condition: string;
  available: boolean;
  categoryId?: string;
  images?: { id: string; url: string }[];
}): Promise<Service> {
  const db = await getMongoDb();
  const now = new Date();
  const serviceDoc: ServiceDocument = {
    _id: data.serviceId,
    name: data.name,
    description: data.description,
    rentalPrice: data.rentalPrice,
    rentalPeriod: data.rentalPeriod,
    deposit: data.deposit,
    quantity: data.quantity,
    condition: data.condition,
    available: data.available,
    categoryId: data.categoryId ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection<ServiceDocument>("Service").insertOne(serviceDoc);

  if (data.images && data.images.length > 0) {
    await db.collection<ImageDocument>("Image").insertMany(
      data.images.map((image) => ({
        _id: image.id,
        serviceId: data.serviceId,
        url: image.url,
        createdAt: now,
      }))
    );
  }

  return getServiceById(data.serviceId).then((service) => {
    if (!service) {
      return mapService({ ...serviceDoc, images: [] });
    }
    return service;
  });
}

export async function updateServiceDoc(
  serviceId: string,
  update: Partial<
    Pick<
      ServiceDocument,
      | "name"
      | "description"
      | "rentalPrice"
      | "rentalPeriod"
      | "deposit"
      | "quantity"
      | "condition"
      | "available"
      | "categoryId"
    >
  >
): Promise<void> {
  const db = await getMongoDb();
  const set: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  for (const [key, value] of Object.entries(update)) {
    if (typeof value !== "undefined") {
      set[key] = key === "categoryId" && value != null ? String(value) : value;
    }
  }
  await db.collection<ServiceDocument>("Service").updateOne(
    { _id: serviceId },
    {
      $set: set,
    }
  );
}

export async function deleteServiceDoc(serviceId: string): Promise<void> {
  const db = await getMongoDb();
  const images = await db
    .collection<ImageDocument>("Image")
    .find({ serviceId })
    .toArray();

  const cloudinary = getCloudinary();

  if (cloudinary && images.length > 0) {
    const publicIds = images
      .map((image) => extractPublicIdFromUrl(image.url))
      .filter((publicId): publicId is string => Boolean(publicId));

    await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          await cloudinary.uploader.destroy(publicId, { invalidate: true });
        } catch (error) {
          console.error(
            `Failed to delete Cloudinary asset for service ${serviceId}:`,
            error
          );
        }
      })
    );
  }

  await db.collection<ServiceDocument>("Service").deleteOne({ _id: serviceId });
  await db.collection<ImageDocument>("Image").deleteMany({ serviceId });
}

export async function getBanners(): Promise<Banner[]> {
  const db = await getMongoDb();
  const banners = await db
    .collection<BannerDocument>("Banner")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return banners.map(mapBanner);
}

export async function insertBanner(data: {
  id: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
}): Promise<Banner> {
  const db = await getMongoDb();
  const now = new Date();
  const bannerDoc: BannerDocument = {
    _id: data.id,
    title: data.title,
    description: data.description ?? null,
    ctaText: data.ctaText ?? null,
    ctaLink: data.ctaLink ?? null,
    imageUrl: data.imageUrl,
    createdAt: now,
    updatedAt: now,
  };
  await db.collection<BannerDocument>("Banner").insertOne(bannerDoc);
  return mapBanner(bannerDoc);
}

export async function updateBannerDoc(
  bannerId: string,
  update: {
    title?: string;
    description?: string | null;
    ctaText?: string | null;
    ctaLink?: string | null;
    imageUrl?: string;
  }
): Promise<void> {
  const db = await getMongoDb();
  const set: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  for (const [key, value] of Object.entries(update)) {
    if (typeof value !== "undefined") {
      set[key] = value;
    }
  }
  await db.collection<BannerDocument>("Banner").updateOne(
    { _id: bannerId },
    {
      $set: set,
    }
  );
}

export async function deleteBannerDoc(bannerId: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection<BannerDocument>("Banner").deleteOne({ _id: bannerId });
}

export async function getBannerById(bannerId: string): Promise<Banner | null> {
  const db = await getMongoDb();
  const banner = await db
    .collection<BannerDocument>("Banner")
    .findOne({ _id: bannerId });
  return banner ? mapBanner(banner) : null;
}

type SettingsDocument = {
  _id: string;
  company_name: string;
  owner_name: string;
  company_address: string;
  company_phone: string;
  company_nip?: string | null;
  smtp_user_emailFrom: string;
  email_receiver: string;
  h1_title: string;
  motto_description: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Settings extends SettingsFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const mapSettings = (settings: SettingsDocument): Settings => ({
  id: String(settings._id),
  company_name: settings.company_name,
  owner_name: settings.owner_name,
  company_address: settings.company_address,
  company_phone: settings.company_phone,
  company_nip: settings.company_nip ?? undefined,
  smtp_user_emailFrom: settings.smtp_user_emailFrom,
  email_receiver: settings.email_receiver,
  h1_title: settings.h1_title,
  motto_description: settings.motto_description,
  createdAt: toIsoString(settings.createdAt),
  updatedAt: toIsoString(settings.updatedAt),
});

export async function getSettings(): Promise<Settings[]> {
  const db = await getMongoDb();
  const settings = await db
    .collection<SettingsDocument>("Settings")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return settings.map(mapSettings);
}

export async function getSettingsById(id: string): Promise<Settings | null> {
  const db = await getMongoDb();
  const settings = await db
    .collection<SettingsDocument>("Settings")
    .findOne({ _id: id });
  return settings ? mapSettings(settings) : null;
}

export async function insertSettings(
  data: {
    settingsId: string;
  } & SettingsFormData
): Promise<Settings> {
  const db = await getMongoDb();
  const now = new Date();
  const document: SettingsDocument = {
    _id: data.settingsId,
    company_name: data.company_name,
    owner_name: data.owner_name,
    company_address: data.company_address,
    company_phone: data.company_phone,
    company_nip:
      typeof data.company_nip === "string" && data.company_nip.trim() !== ""
        ? data.company_nip.trim()
        : null,
    smtp_user_emailFrom: data.smtp_user_emailFrom,
    email_receiver: data.email_receiver,
    h1_title: data.h1_title.trim(),
    motto_description: data.motto_description,
    createdAt: now,
    updatedAt: now,
  };
  await db.collection<SettingsDocument>("Settings").insertOne(document);
  return mapSettings(document);
}

export async function updateSettingsDoc(
  id: string,
  update: SettingsFormData
): Promise<Settings> {
  const db = await getMongoDb();
  const now = new Date();
  const set: Partial<SettingsDocument> = {
    company_name: update.company_name,
    owner_name: update.owner_name,
    company_address: update.company_address,
    company_phone: update.company_phone,
    company_nip:
      typeof update.company_nip === "string" && update.company_nip.trim() !== ""
        ? update.company_nip.trim()
        : null,
    smtp_user_emailFrom: update.smtp_user_emailFrom,
    email_receiver: update.email_receiver,
    h1_title: update.h1_title.trim(),
    motto_description: update.motto_description,
    updatedAt: now,
  };

  const result = await db
    .collection<SettingsDocument>("Settings")
    .findOneAndUpdate(
      { _id: id },
      {
        $set: set,
        $setOnInsert: {
          createdAt: now,
        },
      },
      { returnDocument: "after", upsert: true }
    );

  if (!result) {
    const fetched = await getSettingsById(id);
    if (!fetched) {
      throw new Error("Failed to fetch updated settings");
    }
    return fetched;
  }

  return mapSettings(result);
}

export async function deleteSettingsDoc(id: string): Promise<void> {
  const db = await getMongoDb();
  await db.collection<SettingsDocument>("Settings").deleteOne({ _id: id });
}
