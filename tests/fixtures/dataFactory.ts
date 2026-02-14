export interface CategoryPayload {
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  category_id: number;
  stock: number;
  sku: string;
  is_active: boolean;
  is_featured: boolean;
  track_stock: boolean;
}

export function uniqueSuffix(prefix = 'e2e'): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${random}`;
}

export function buildCategoryPayload(prefix = 'e2e'): CategoryPayload {
  const suffix = uniqueSuffix(prefix);
  return {
    name: `Category ${suffix}`,
    slug: `category-${suffix}`,
    description: `Category created by Playwright (${suffix})`,
    is_active: true,
  };
}

export function buildProductPayload(categoryId: number, prefix = 'e2e'): ProductPayload {
  const suffix = uniqueSuffix(prefix);
  return {
    name: `Product ${suffix}`,
    slug: `product-${suffix}`,
    description: `Product created by Playwright (${suffix})`,
    short_description: `Short ${suffix}`,
    price: 1999,
    category_id: categoryId,
    stock: 5,
    sku: `SKU-${suffix.toUpperCase()}`,
    is_active: true,
    is_featured: false,
    track_stock: true,
  };
}

export function buildTinyPng(): Buffer {
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5N3foAAAAASUVORK5CYII=',
    'base64'
  );
}

