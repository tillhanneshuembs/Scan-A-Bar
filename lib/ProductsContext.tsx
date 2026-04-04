import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fallbackProducts from "../assets/products.json";

export type Product = (typeof fallbackProducts)[0] & { image_url?: string | null };

const GITHUB_URL =
  "https://scan-a-bar-backend.vercel.app/api/products";
const CACHE_KEY = "products_cache";

interface ProductsContextValue {
  products: Product[];
  findByEan: (ean: string) => Product | null;
}

const ProductsContext = createContext<ProductsContextValue>({
  products: fallbackProducts as Product[],
  findByEan: () => null,
});

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts as Product[]);

  useEffect(() => {
    async function load() {
      // Sofort gecachte Version laden
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) setProducts(JSON.parse(cached));
      } catch {}

      // Im Hintergrund neue Version von GitHub holen
      try {
        const res = await fetch(GITHUB_URL);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
      } catch {}
    }
    load();
  }, []);

  function findByEan(ean: string): Product | null {
    return products.find((p) => String(p.ean) === String(ean)) ?? null;
  }

  return (
    <ProductsContext.Provider value={{ products, findByEan }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
