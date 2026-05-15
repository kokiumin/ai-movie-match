import type { MetadataRoute } from "next";
import { MOCK_CREATORS } from "@/lib/mock-creators";

const SITE_URL = "https://www.ai-movie-match.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const creatorEntries: MetadataRoute.Sitemap = MOCK_CREATORS.map((c) => ({
    url: `${SITE_URL}/creators/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/quote`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/creators`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...creatorEntries,
    { url: `${SITE_URL}/how-scoring-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/badges`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/terms-creator`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/tokushoho`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/ai-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal/community`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
