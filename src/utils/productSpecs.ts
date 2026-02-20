import type { Product, ProductSpec } from "@/data/products";

const keyPatterns = [
  "Длина",
  "Высота",
  "Ширина",
  "Вес",
  "Средняя точность",
  "Точность",
  "Управление",
  "Режим работы",
  "Скорость каретки",
  "Напряжение питания",
  "Электропитание",
  "Диаметры мишеней",
] as const;

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function pushSpec(target: ProductSpec[], label: string, value: string) {
  const cleanLabel = normalize(label).replace(/[–—-]+$/, "");
  const cleanValue = normalize(value).replace(/[;,.]+$/, "");
  if (!cleanLabel || !cleanValue) return;
  if (cleanLabel.length > 60 || cleanValue.length > 110) return;

  const key = cleanLabel.toLowerCase();
  if (target.some((spec) => spec.label.toLowerCase() === key)) return;
  target.push({ label: cleanLabel, value: cleanValue });
}

export function deriveProductSpecs(product: Product, limit = 8): ProductSpec[] {
  const explicit = (product.specs ?? [])
    .map((spec) => ({ label: normalize(spec.label), value: normalize(spec.value) }))
    .filter((spec) => spec.label && spec.value);
  if (explicit.length > 0) return explicit.slice(0, limit);

  const source = product.description.replace(/\r?\n/g, " ");
  const specs: ProductSpec[] = [];

  // Generic "Label: value" pairs.
  const genericPattern = /([A-ZА-ЯЁ][^:.;]{1,52}):\s*([^.;]{1,110})/g;
  for (const match of source.matchAll(genericPattern)) {
    pushSpec(specs, match[1], match[2]);
    if (specs.length >= limit) return specs;
  }

  // Key-based fallback for entries where ":" may be omitted or malformed.
  for (const key of keyPatterns) {
    const pattern = new RegExp(`${key}\\s*:?\\s*([^.;]{1,90})`, "i");
    const found = source.match(pattern);
    if (!found) continue;
    pushSpec(specs, key, found[1]);
    if (specs.length >= limit) break;
  }

  return specs.slice(0, limit);
}
