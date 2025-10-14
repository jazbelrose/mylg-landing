import type { PortfolioCardConfig } from "@/shared/data/workItems";

export type FeaturedSectionLayout = "double" | "single";

export type FeaturedSectionConfig = {
  id: string;
  layout: FeaturedSectionLayout;
  cards: PortfolioCardConfig[];
  rowClassName?: string;
};

export const HOME_FEATURED_SECTIONS: readonly FeaturedSectionConfig[] = [
  {
    id: "home-featured-row-1",
    layout: "double",
    cards: [
      {
        slug: "strikefit",
        title: "Strike Fit",
        subtitle: "Paris, France",
        description: "Branding, Photography, Styling",
      },
      {
        slug: "Bloom-and-Bliss",
        title: "Bloom & Bliss",
        subtitle: "Brand Identity",
        description: "Branding, 3D Animation",
      },
    ],
  },
  {
    id: "home-featured-row-2",
    layout: "single",
    cards: [
      {
        slug: "elf-Makeup",
        title: "e.l.f. Beauty",
        subtitle: "Nylon House Mokibaby Art Basel",
        description: "3D Design, Immersive Digital",
        className: "single-card elf",
      },
    ],
  },
];
