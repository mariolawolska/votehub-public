import { getImage } from "./getImage";

export function getHeroImage(product) {
  return {
    xl: getImage(product, "xl"),
    desktop: getImage(product, "desktop"),
    tablet: getImage(product, "tablet"),
    mobile: getImage(product, "mobile"),
    fallback: product.images?.[0]?.path || "/placeholder.jpg",
  };
}
