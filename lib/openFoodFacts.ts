export async function lookupBarcode(barcode: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;
    return (
      data.product.product_name_de ||
      data.product.product_name ||
      null
    );
  } catch {
    return null;
  }
}
