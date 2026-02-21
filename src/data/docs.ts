export type DocType = "PDF" | "DOC" | "DOCX" | "PPTX";

export interface DocumentationItem {
  title: string;
  tags: string[];
  file: string | null;
  available: boolean;
  type: DocType;
}

export interface DocCategory {
  id: "manuals" | "technical" | "solutions" | "international";
  title: string;
  docs: DocumentationItem[];
}

export const docCategories: DocCategory[] = [
  {
    id: "manuals",
    title: "Инструкции и паспорта",
    docs: [
      {
        title: "Пума 35М — Инструкция",
        tags: ["Мишени", "Эксплуатация"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/Инструкция Пума 35М.docx",
        available: true,
        type: "DOCX",
      },
      {
        title: "ПМУ-35 — Инструкция-паспорт",
        tags: ["Подъёмники", "Паспорт"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/ПМУ 35  Инструкция-паспорт.doc",
        available: true,
        type: "DOC",
      },
      {
        title: "ПМУ-53 — Инструкция по эксплуатации",
        tags: ["Подъёмники", "Эксплуатация"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/ПМУ53 Инструкция по эксплуатации (1).docx",
        available: true,
        type: "DOCX",
      },
      {
        title: "Работа с программой ПМУ-300",
        tags: ["Подъёмники", "Программное обеспечение"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/Работа с программой ПМУ300.docx",
        available: true,
        type: "DOCX",
      },
      {
        title: "Стойка Саггитар — Документация",
        tags: ["Оснащение", "Эксплуатация"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/Стойка саггитар.doc",
        available: true,
        type: "DOC",
      },
      {
        title: "ПМУ-7М — Инструкция по эксплуатации",
        tags: ["Подъёмники", "Эксплуатация"],
        file: null,
        available: false,
        type: "DOC",
      },
      {
        title: "ПМУ-90 — Инструкция по эксплуатации",
        tags: ["Подъёмники", "Эксплуатация"],
        file: null,
        available: false,
        type: "DOC",
      },
    ],
  },
  {
    id: "technical",
    title: "Технические материалы",
    docs: [
      {
        title: "Монтаж монорельса на основе уголков 50x50x5 мм",
        tags: ["Монтаж", "Инфраструктура"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/Монтаж монорельса на основе уголков_ 50х50х5 мм.doc",
        available: true,
        type: "DOC",
      },
      {
        title: "Печатный узел блока управления УМУ-С-127",
        tags: ["Электроника", "Компоненты"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/Печатный узел блока управления мишенной установки типа УМУ-С-127.pptx",
        available: true,
        type: "PPTX",
      },
      {
        title: "Точность определения координат удара",
        tags: ["Технологии", "Сенсоры"],
        file: null,
        available: false,
        type: "PDF",
      },
      {
        title: "Выбор способа управления мишенными установками",
        tags: ["Технологии", "Управление"],
        file: null,
        available: false,
        type: "PDF",
      },
    ],
  },
  {
    id: "solutions",
    title: "Решения и проекты",
    docs: [
      {
        title:
          "Комплекс управления мишенным оборудованием войскового стрельбища",
        tags: ["Военные", "Комплексные решения"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/Комплекс управления мишенным оборудованием войскового стрельбища.pptx",
        available: true,
        type: "PPTX",
      },
      {
        title: "Новая жизнь стрелковому тиру — DIY кейс",
        tags: ["Кейсы", "Реализация"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/Новая жизнь стрелковому тиру.docx",
        available: true,
        type: "DOCX",
      },
      {
        title: "Оснащение открытого тира",
        tags: ["Проекты", "Комплексные решения"],
        file: null,
        available: false,
        type: "DOC",
      },
      {
        title: "Комплект для переделки GAN2",
        tags: ["Модернизация", "Компоненты"],
        file: null,
        available: false,
        type: "PDF",
      },
    ],
  },
  {
    id: "international",
    title: "Международные стандарты",
    docs: [
      {
        title: "CR-2 Target Retrieval System — PDS",
        tags: ["Международные", "Стандарты"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/CR-2-Target-Retrieval-System-PDS.pdf",
        available: true,
        type: "PDF",
      },
      {
        title: "CR-2TL Master Range Control — PDS",
        tags: ["Международные", "Управление"],
        file: "/xtir-archive/XTIR_ASSETS_PACK/02_docs/CR-2TL-Master-Range-Control-PDS.pdf",
        available: true,
        type: "PDF",
      },
    ],
  },
];

export const totalDocs = docCategories.reduce(
  (acc, category) => acc + category.docs.length,
  0,
);
export const availableDocs = docCategories.reduce(
  (acc, category) => acc + category.docs.filter((doc) => doc.available).length,
  0,
);

const availableDocsByTitle = new Map(
  docCategories
    .flatMap((category) => category.docs)
    .filter((doc) => doc.available && doc.file)
    .map((doc) => [doc.title, { title: doc.title, href: doc.file as string }]),
);

export const docsByProductId: Record<
  string,
  { title: string; href: string }[]
> = {
  "pmu-100": [
    {
      title: "Инструкция по эксплуатации ПМУ-100",
      href: "/docs/pmy100/instruktsiya-po-ekspluatatsii-pmu-100.pdf",
    },
    { title: "Паспорт ПМУ-100", href: "/docs/pmy100/pasport-pmu-100.pdf" },
    {
      title: "Руководство оператора ПМУ-100",
      href: "/docs/pmy100/rukovodstvo-operatora-pmu-100.pdf",
    },
  ],
  "pmu-53": [
    availableDocsByTitle.get("ПМУ-53 — Инструкция по эксплуатации")!,
  ].filter(Boolean),
  "pmu-35": [availableDocsByTitle.get("ПМУ-35 — Инструкция-паспорт")!].filter(
    Boolean,
  ),
  pak: [
    availableDocsByTitle.get(
      "Комплекс управления мишенным оборудованием войскового стрельбища",
    )!,
  ].filter(Boolean),
};
