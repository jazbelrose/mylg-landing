export type WorkItem = {
  id?: number | string;
  slug: string;
  date?: string;
  tags?: string[];
  title: string;
  subtitle?: string;
  description?: string;
  images: string[];
  readingTime?: string | number;
  authorName?: string;
  [key: string]: unknown;
};

export type WorkSlug = WorkItem['slug'];
