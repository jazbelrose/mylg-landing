import worksJson from "@/pages/works/works.json";

import type { PortfolioCardProps } from "@/shared/ui/PortfolioCard";
import type { WorkItem, WorkSlug } from "@/shared/types/work";

const normalizeSlug = (slug: string): string => slug.trim().toLowerCase();

const normalizeWorkItem = (item: WorkItem): WorkItem => ({
  ...item,
  tags: item.tags ?? [],
  subtitle: item.subtitle ?? "",
  description: item.description ?? "",
  images: item.images ?? [],
});

const rawWorkItems = (worksJson as WorkItem[]).map(normalizeWorkItem);

const slugIndex = new Map<string, WorkItem>();

rawWorkItems.forEach((work) => {
  slugIndex.set(normalizeSlug(work.slug), work);
});

export const workItems: WorkItem[] = [...rawWorkItems];

export const getWorkBySlug = (slug: WorkSlug): WorkItem | undefined =>
  slugIndex.get(normalizeSlug(slug));

export type PortfolioCardDisplayOverrides = Partial<
  Pick<
    PortfolioCardProps,
    "title" | "subtitle" | "description" | "imageSrc" | "imageAlt" | "linkUrl" | "className"
  >
>;

export type PortfolioCardConfig = { slug: WorkSlug } & PortfolioCardDisplayOverrides;

export const createPortfolioCardProps = (
  config: PortfolioCardConfig
): PortfolioCardProps => {
  const work = getWorkBySlug(config.slug);
  const title = config.title ?? work?.title ?? config.slug;
  const subtitle = config.subtitle ?? work?.subtitle ?? "";
  const description = config.description ?? work?.description ?? "";
  const imageSrc = config.imageSrc ?? work?.images?.[0] ?? "";
  const imageAlt = config.imageAlt ?? work?.title ?? title;
  const linkUrl = config.linkUrl ?? (work ? `/works/${work.slug}` : "#");

  if (!work) {
    console.warn(
      `[createPortfolioCardProps] Could not find work data for slug "${config.slug}".`
    );
  }

  return {
    linkUrl,
    imageSrc,
    imageAlt,
    title,
    subtitle,
    description,
    className: config.className,
  };
};

export const orderWorkItems = (preferredSlugs: readonly WorkSlug[] = []): WorkItem[] => {
  if (preferredSlugs.length === 0) {
    return [...workItems];
  }

  const seen = new Set<string>();

  const preferred = preferredSlugs
    .map((slug) => {
      const work = getWorkBySlug(slug);
      if (!work) {
        console.warn(`orderWorkItems: unknown slug "${slug}"`);
        return undefined;
      }

      const key = normalizeSlug(work.slug);
      if (seen.has(key)) {
        return undefined;
      }

      seen.add(key);
      return work;
    })
    .filter((work): work is WorkItem => Boolean(work));

  const remaining = workItems.filter((work) => !seen.has(normalizeSlug(work.slug)));

  return [...preferred, ...remaining];
};

export type { WorkItem };
