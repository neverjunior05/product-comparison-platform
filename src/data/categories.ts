import type { Category, CategoryId } from "../types";
import { SPEC_FIELDS } from "./specConfig";

/** Pexels CDN helper — consistent 4:3 crops for every product image. */
export const px = (id: number, w = 960, h = 720) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;

export const CATEGORIES: Category[] = [
  {
    id: "smartphones",
    name: "Smartphones",
    singular: "Smartphone",
    description: "Flagships, compacts and value picks — compared on display, camera, battery and more.",
    image: px(10883732),
    accent: "from-orange-500 to-amber-400",
    fields: SPEC_FIELDS.smartphones,
  },
  {
    id: "laptops",
    name: "Laptops",
    singular: "Laptop",
    description: "Ultraportables, creator rigs and budget workhorses, side by side.",
    image: px(12951088),
    accent: "from-emerald-500 to-teal-400",
    fields: SPEC_FIELDS.laptops,
  },
  {
    id: "headphones",
    name: "Headphones",
    singular: "Headphones",
    description: "Over-ears, on-ears and earbuds — ANC, battery life, codecs and comfort.",
    image: px(7772548),
    accent: "from-rose-500 to-orange-400",
    fields: SPEC_FIELDS.headphones,
  },
  {
    id: "cameras",
    name: "Cameras",
    singular: "Camera",
    description: "Mirrorless bodies and compacts — sensors, autofocus, video and build.",
    image: px(19969463),
    accent: "from-slate-700 to-slate-500",
    fields: SPEC_FIELDS.cameras,
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function getCategory(id: string | undefined): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
