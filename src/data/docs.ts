// Define the type for DocumentationItem
interface DocumentationItem {
  title: string;
  href?: string;
}

// Define the type for DocGroup
interface DocGroup {
  id: string;
  title: string;
  description?: string;
  items: DocumentationItem[];
}

/**
 * Public documentation index (used on /docs)
 *
 * Files live in /public/docs/...
 */
export const docGroups: DocGroup[] = [
  {
    id: "pmu-100",
    title: "ПМУ-100",
    description: "Комплект документов для установки ПМУ‑100.",
    items: [
      {
        title: "Инструкция по эксплуатации",
        href: "/docs/pmy100/instruktsiya-po-ekspluatatsii-pmu-100.pdf",
      },
      { title: "Паспорт", href: "/docs/pmy100/pasport-pmu-100.pdf" },
      {
        title: "Руководство оператора",
        href: "/docs/pmy100/rukovodstvo-operatora-pmu-100.pdf",
      },
    ],
  },
  // ... остальные элементы
];

/**
 * Product-page documentation mapping.
 * If a product id exists here, its product page will show these docs as clickable links.
 */
export const docsByProductId: Record<string, DocumentationItem[]> = {
  "pmu-100": docGroups.find((g) => g.id === "pmu-100")?.items ?? [],
  // ... остальные элементы
};
