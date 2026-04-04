import products from "../assets/products.json";

export type Product = (typeof products)[0];

export function findProductByEan(ean: string): Product | null {
  return (products as Product[]).find((p) => String(p.ean) === String(ean)) ?? null;
}

export const TOTAL_PRODUCTS = products.length;
