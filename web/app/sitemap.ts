import type { MetadataRoute } from "next";
import { getAllCategorySlugs } from "@/lib/prisma-operations";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.example.com"
  ).replace(/\/$/, "");
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/catalog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const slugs = await getAllCategorySlugs();
    slugs.forEach((slug) =>
      entries.push({
        url: `${base}/catalog/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
  } catch (e) {
    console.error("Error generating sitemap:", e);
    // ignore sitemap expansion failures
  }

  return entries;
}
