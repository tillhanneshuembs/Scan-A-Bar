import Fuse from "fuse.js";
import products from "../assets/products.json";

export type Product = (typeof products)[0];

const fuse = new Fuse(products, {
  keys: ["name"],
  threshold: 0.4,
  includeScore: true,
});

export function findProduct(name: string): Product | null {
  const results = fuse.search(name);
  if (results.length === 0) return null;
  return results[0].item as Product;
}

export const TOTAL_PRODUCTS = products.length;
