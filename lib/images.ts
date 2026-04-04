const BASE_URL = "https://raw.githubusercontent.com/tillhanneshuembs/Scan-A-Bar/main";

export function getProductImageUrl(ean: string | number): string | null {
  // Extend with supported formats
  return `${BASE_URL}/${ean}.webp`;
}
