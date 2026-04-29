export function getImage(product, type) {
  if (!product?.images) return null;

  const img = product.images.find(i => i.type === type);
  if (!img) return null;

  // If the backend provides full_url → use it
  if (img.full_url) return img.full_url;

  // If backend gives only path → build full URL
  if (img.path?.startsWith("/")) {
    return `https://node.marbar.co.uk${img.path}`;
  }

  // If path is already absolute
  return img.path;
}
