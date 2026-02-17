export type DocumentationItem = {
  title: string;
  /**
   * If present, the document opens/downloads from this URL.
   * If missing, the material is available on request.
   */
  href?: string;
};

export type DocGroup = {
  id: string;
  title: string;
  description?: string;
  items: DocumentationItem[];
};

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
  {
    id: "puma-51",
    title: "ПУМА 51",
    description: "Архивные материалы по установке ПУМА 51 доступны по запросу.",
    items: [
      { title: "Паспорт (по запросу)" },
      { title: "Инструкция по эксплуатации (по запросу)" },
    ],
  },
  {
    id: "puma-4m",
    title: "ПУМА‑4М",
    description:
      "Документация для модуля ПУМА‑4М (также применима к семейству ПУМА‑4).",
    items: [
      {
        title: "Инструкция по эксплуатации",
        href: "/docs/puma4/puma-4m-instruktsiya-po-ekspluatatsii.doc",
      },
      { title: "Паспорт", href: "/docs/puma4/puma-4m-pasprort.doc" },
    ],
  },
  {
    id: "multilaser",
    title: "Мультилазер (ПО «Мультитир»)",
    description:
      "Материалы по ПО доступны по запросу (публичная ссылка отсутствует).",
    items: [{ title: "Описание ПО «Мультитир» (по запросу)" }],
  },
  {
    id: "poligon",
    title: "ПАК «Полигон»",
    description:
      "Материалы по полигонному оборудованию и восстановлению работоспособности.",
    items: [
      { title: "ПАК «Полигон»", href: "/docs/poligon/pak-poligon.pdf" },
      {
        title: "Руководство оператора ПАК «Полигон»",
        href: "/docs/poligon/rukovodstvo-operatora-pak-poligon.pdf",
      },
      {
        title: "Восстановление работы устаревшего полигонного оборудования",
        href: "/docs/poligon/vosstanovlenie-raboty-ustarevshego-poligonnogo-oborudovaniya.pdf",
      },
    ],
  },
  {
    id: "pmu-300",
    title: "ПМУ‑300",
    description: "Документы по потолочной установке ПМУ‑300.",
    items: [
      {
        title: "Паспорт (потолочная установка)",
        href: "/docs/pmy300/pasport-potolochnaya-ustanovka-pmu-300.doc",
      },
      {
        title: "Инструкция по эксплуатации",
        href: "/docs/pmy300/pmu300-instruktsiya-po-ekspluatatsii.docx",
      },
    ],
  },
  {
    id: "materials",
    title: "Материалы и статьи",
    description:
      "Полезные материалы для проектирования тиров и управления мишенными установками.",
    items: [
      {
        title: "Выбор способа управления мишенными установками",
        href: "/docs/misc/vybor-sposoba-upravleniya-mishennymi-ustanovkami.pdf",
      },
      {
        title: "Точность определения координат удара",
        href: "/docs/misc/tochnost-opredeleniya-koordinat-udara.pdf",
      },
      {
        title: "Оснащение открытого тира",
        href: "/docs/misc/osnaschenie-otkrytogo-tira.doc",
      },
      { title: "ПУМА ТР — материалы", href: "/docs/misc/puma-tr.doc" },
      {
        title: "ПМУ‑7М — инструкция",
        href: "/docs/misc/pmu-7m-instruktsiya.doc",
      },
      {
        title: "ПМУ‑90 — инструкция",
        href: "/docs/misc/pmu-90-instruktsiya.doc",
      },
      {
        title: "Комплект для переделки GAN2",
        href: "/docs/misc/komplekt-dlya-peredelki-gan2.pdf",
      },
    ],
  },
];

/**
 * Product-page documentation mapping.
 * If a product id exists here, its product page will show these docs as clickable links.
 */
export const docsByProductId: Record<string, DocumentationItem[]> = {
  // PMU
  "pmu-100": docGroups.find((g) => g.id === "pmu-100")!.items,

  // Electronic targets
  "elektronnaya-mishen-puma-51": docGroups.find((g) => g.id === "puma-51")!
    .items,

  // Turners / Puma-4 family
  "povorotka-na-odnu-mishen-puma-4": docGroups.find((g) => g.id === "puma-4m")!
    .items,
  "modul-povorota-misheni-puma-4a": docGroups.find((g) => g.id === "puma-4m")!
    .items,
  "povorotnyy-podemnik-puma-4v": docGroups.find((g) => g.id === "puma-4m")!
    .items,

  // Software / systems
  multilaser: docGroups.find((g) => g.id === "multilaser")!.items,

  // Misc
  "trosovaya-ustanovka-puma-tr": [
    { title: "Документация ПУМА ТР", href: "/docs/misc/puma-tr.doc" },
  ],
};
