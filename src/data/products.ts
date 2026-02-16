import type { DocumentationItem } from './docs';
import { docsByProductId } from './docs';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  features: string[];
  specs: Record<string, string>;
  price?: string;
  images: string[];
  modelUrl?: string;
  documentation?: DocumentationItem[];

  // Расширенный контент для «эталонных» карточек.
  // Для большинства изделий поля могут отсутствовать — страница отрисуется корректно.
  highlights?: { label: string; value: string }[];
  useCases?: { title: string; text: string }[];
  howItWorks?: { title: string; text: string }[];
  configurations?: { title: string; points: string[] }[];
  orderSteps?: { title: string; text: string }[];
  related?: string[];
}

export const productCategories = [
  { id: 'electronic', name: 'Электронные мишени', icon: 'target' },
  { id: 'lifters', name: 'Подъемники', icon: 'arrow-up' },
  { id: 'turners', name: 'Поворотки', icon: 'rotate' },
  { id: 'lift_turn', name: 'Подъемно-поворотные', icon: 'repeat' },
  { id: 'ceiling_wall', name: 'Потолочные / Настенные', icon: 'layout' },
  { id: 'moving', name: 'Движущиеся цели', icon: 'trending' },
  { id: 'hanging', name: 'Подвесные мишени', icon: 'anchor' },
  { id: 'systems', name: 'Системы', icon: 'server' },
  { id: 'accessories', name: 'Попперы / Аксессуары', icon: 'package' },
  { id: 'misc', name: 'Прочее', icon: 'grid' },
  { id: 'texts', name: 'Тексты и документация', icon: 'file-text' },
] as const;

export const featuredProducts: Product[] = [
  {
    id: 'pmu-100',
    name: 'ПМУ-100',
    category: 'electronic',
    shortDescription: 'Электронная мишень с автопечатью результатов',
    description:
      'Беспроводная Wi‑Fi мишень для профессиональной подготовки стрелков из пневматики. Недорогой аналог известных систем с высокой точностью и встроенной печатью результатов.',
    highlights: [
      { label: 'Точность', value: '0.1–0.01 мм' },
      { label: 'Печать', value: 'автопечать результатов' },
      { label: 'Камера', value: '2–5 МП, вариофокальный объектив' },
      { label: 'Сеть', value: 'Wi‑Fi, пульт / ПК оператора' },
    ],
    features: [
      'Встроенная видеокамера 2–5 МП',
      'Точность 0.1–0.01 мм',
      'Автоматическая печать результатов',
      'Wi‑Fi соединение',
      'Автоподстройка под освещение 200–2000 лк',
      'Принтер с ресурсом 100 км ленты',
    ],
    useCases: [
      {
        title: 'Спортивная подготовка',
        text: 'Пневматика, точное начисление очков и быстрый разбор серий — удобно для тренеров и спортсменов.',
      },
      {
        title: 'Учебные центры',
        text: 'Стабильная работа и печать протокола помогают выстроить дисциплину занятий и учёт результатов.',
      },
      {
        title: 'Стрелковые клубы',
        text: 'Беспроводное управление и автопечать ускоряют поток стрелков и снижают нагрузку на персонал.',
      },
    ],
    howItWorks: [
      {
        title: 'Оптический бесконтактный принцип',
        text: 'Видеокамера внутри корпуса фиксирует пробоины по бумажной ленте на чёрном фоне и вычисляет координаты.',
      },
      {
        title: 'Автоподстройка под освещение',
        text: 'Автоматическая адаптация к условиям освещения в диапазоне 200–2000 лк.',
      },
      {
        title: 'Автопечать результатов',
        text: 'После каждого выстрела/серии печатается актуальный результат: изображение мишени, пробоины, СТП/КТП и т.п.',
      },
      {
        title: 'Wi‑Fi управление',
        text: 'Опционально комплектуется ПК оператора и выносным Wi‑Fi пультом стрелка для удобства управления.',
      },
    ],
    configurations: [
      {
        title: 'Базовая',
        points: ['Мишень ПМУ‑100', 'Wi‑Fi управление', 'Встроенный принтер с автообрезкой'],
      },
      {
        title: 'Рабочее место оператора',
        points: ['ПК/ноутбук оператора (опционально)', 'Протоколы тренировок и управление сериями'],
      },
      {
        title: 'Пульт стрелка',
        points: ['Выносной Wi‑Fi пульт', 'Быстрый старт/сброс/печать без оператора'],
      },
      {
        title: 'Под ТЗ',
        points: ['Интеграция в систему тира', 'Адаптация под условия объекта и сценарии упражнений'],
      },
    ],
    specs: {
      'Размеры (Д×В×Ш)': '22 × 32 × 12 см',
      'Вес': '8 кг',
      'Точность': '0.1–0.01 мм',
      'Питание': '220 В, 50 Гц',
      'Режим работы': 'Непрерывный',
      'Управление': 'Wi‑Fi пульт / ПК оператора',
    },
    images: [
      '/images/products/pmu-100/01.png',
      '/images/products/pmu-100/02.png',
      '/images/products/pmu-100/03.png',
      '/images/products/pmu-100/04.png',
      '/images/products/pmu-100/05.png',
      '/images/products/pmu-100.svg',
    ],
    documentation: [
      { title: 'Инструкция по эксплуатации' },
      { title: 'Паспорт' },
      { title: 'Руководство оператора' },
    ],
    orderSteps: [
      {
        title: 'Опишите задачу',
        text: 'Тип тира/клуба, дисциплина, количество стрелковых мест и требования к протоколу результатов.',
      },
      {
        title: 'Подберём конфигурацию',
        text: 'Базовая/с оператором/с пультом стрелка или интеграция в систему управления тиром.',
      },
      {
        title: 'Подготовим КП и сроки',
        text: 'Согласуем комплектность, подготовим коммерческое предложение и сроки изготовления/поставки.',
      },
    ],
    related: ['pmu-25', 'puma-35', 'multilaser'],
  },
  {
    id: 'pmu-25',
    name: 'ПМУ-25',
    category: 'electronic',
    shortDescription: 'Комбинированная мишень для пневматики и лазера',
    description:
      'Автономная беспроводная мишень для стрельбы из пневматики и лазерного оружия. Может работать без внешнего компьютера и проектора (в зависимости от сценария).',
    highlights: [
      { label: 'Точность', value: 'средняя ±1.5 мм' },
      { label: 'Режимы', value: 'пневматика + лазер' },
      { label: 'Автономность', value: 'работа без ПК/проектора' },
      { label: 'Сеть', value: 'Wi‑Fi, пульт / авто' },
    ],
    features: [
      'Работа с пневматикой и лазером',
      'Автономная работа',
      'Wi‑Fi соединение',
      'Средняя точность ±1.5 мм',
      'Температурный диапазон до −20…+40 °C',
      'Встроенная АКБ',
    ],
    useCases: [
      {
        title: 'Мобильные и учебные тиры',
        text: 'Самодостаточная работа упрощает развёртывание и эксплуатацию: минимум внешнего оборудования.',
      },
      {
        title: 'Пневматика и лазер',
        text: 'Одна установка под разные сценарии занятий: от базовых тренировок до учебных упражнений.',
      },
      {
        title: 'Учёт результатов',
        text: 'ПО визуализирует попадания и хранит результаты в базе для анализа и отчётности.',
      },
    ],
    howItWorks: [
      {
        title: 'Самодостаточная мишень',
        text: 'Для работы не требуется внешний компьютер или проектор — в типовых сценариях мишень работает автономно.',
      },
      {
        title: 'ПО для удобства эксплуатации',
        text: 'Бесплатное ПО показывает мишень, поражения, координаты и ведёт базу результатов.',
      },
      {
        title: 'Точность по всей площади',
        text: 'Равномерная точность по всей площади мишени: средняя ±1.5 мм (при диаметре пули 4–5 мм).',
      },
      {
        title: 'Связь и управление',
        text: 'Wi‑Fi, управление с радиопульта или в автоматическом режиме; встроенная зарядка АКБ.',
      },
    ],
    configurations: [
      {
        title: 'Базовая',
        points: ['Мишень ПМУ‑25', 'Wi‑Fi связь', 'Автономная работа, встроенная АКБ'],
      },
      {
        title: 'С выносным табло',
        points: ['Табло результатов для стрелковой линии', 'Удобно для групповых занятий и работы с инструктором'],
      },
      {
        title: 'Со стойкой',
        points: ['Стойка/крепление под объект', 'Быстрое развёртывание и перенос'],
      },
      {
        title: 'Под ТЗ',
        points: ['Адаптация под сценарии и условия', 'Интеграция в комплекс/тир при необходимости'],
      },
    ],
    specs: {
      'Размеры (Д×Ш×В)': '51 × 51 × 8 см',
      'Вес': 'менее 10 кг',
      'Точность': '±1.5 мм (средняя)',
      'Питание': '12 В, 0.2 А, АКБ 7 А·ч',
      'Время работы': 'до 4 часов',
      'Время зарядки': '≈ 1.5 часа',
    },
    images: [
      '/images/products/pmu-25/01.png',
      '/images/products/pmu-25/02.png',
      '/images/products/pmu-25/03.png',
      '/images/products/pmu-25/04.png',
      '/images/products/pmu-25/05.png',
      '/images/products/pmu-25.svg',
    ],
    orderSteps: [
      {
        title: 'Опишите сценарий занятий',
        text: 'Пневматика/лазер, дистанции, условия установки (класс/тир), количество мишеней.',
      },
      {
        title: 'Выберем комплектность',
        text: 'Табло, стойка, варианты управления и режимы — под вашу задачу.',
      },
      {
        title: 'КП и сроки',
        text: 'Согласуем характеристики, подготовим коммерческое предложение и сроки поставки.',
      },
    ],
    related: ['pmu-100', 'multilaser', 'puma-35'],
  },
  {
    id: 'puma-35',
    name: 'ПУМА-35',
    category: 'moving',
    shortDescription: 'Монорельсовая тросовая установка',
    description:
      'Монорельсовая тросовая установка для перемещения мишени на программируемые рубежи. Скорости, ускорения и режимы движения настраиваются под упражнение; поддерживаются сценарии с разными профилями движения и остановками. Возможна интеграция в систему управления тиром.',
    highlights: [
      { label: 'Скорость каретки', value: 'до 4 м/с' },
      { label: 'Привод', value: 'BLDC 500 Вт + тормоз' },
      { label: 'Сценарии', value: 'программируемые рубежи' },
      { label: 'Управление', value: 'пульт / центральная система' },
    ],
    features: [
      'Скорость каретки до 4 м/с',
      'Программируемые рубежи и сценарии',
      'BLDC мотор 500 Вт',
      'Процессорный контроль движения',
      'Монорельс из нержавеющей стали',
      'Электродинамический тормоз',
    ],
    useCases: [
      {
        title: 'Динамические упражнения',
        text: 'Бегущие цели, смена темпа, «рывки» и остановки — настройка под требования упражнения и уровня подготовки.',
      },
      {
        title: 'Учебные комплексы',
        text: 'Программируемые рубежи и повторяемость траекторий упрощают методику занятий и контроль результатов.',
      },
      {
        title: 'Интеграция в тир',
        text: 'Подключение к центральному управлению позволяет синхронизировать движение цели со светом, сигналами и сценариями тира.',
      },
    ],
    howItWorks: [
      {
        title: 'Прецизионное управление движением',
        text: 'Процессорный контроллер задаёт профиль ускорения/скорости, обеспечивает повторяемость и стабильность сценариев.',
      },
      {
        title: 'Энергоэффективный BLDC-привод',
        text: 'Бесщёточный двигатель (500 Вт) обеспечивает динамику, ресурс и низкие требования к обслуживанию.',
      },
      {
        title: 'Торможение и безопасность',
        text: 'Электродинамический тормоз и контроль режимов уменьшают износ и повышают стабильность остановок на рубежах.',
      },
      {
        title: 'Монорельс из нержавеющей стали',
        text: 'Жёсткая база и коррозионная стойкость: подходит для интенсивной эксплуатации в тире и на учебных объектах.',
      },
    ],
    configurations: [
      {
        title: 'Базовая',
        points: ['Установка ПУМА‑35', 'Управление с пульта', 'Базовые сценарии движения и остановки'],
      },
      {
        title: 'Интеграция в центральную систему',
        points: ['Подключение к АСУ тира', 'Синхронизация со светом/сигналами', 'Сложные сценарии упражнений'],
      },
      {
        title: 'Расширенная механика',
        points: ['Доп. датчики/ограничители (по ТЗ)', 'Адаптация рубежей и креплений', 'Условия объекта (температура/пыль)'],
      },
      {
        title: 'Под ТЗ',
        points: ['Длина, рубежи, скорость/ускорение', 'Интеграция с мишенными модулями', 'Комплектность под проект'],
      },
    ],
    specs: {
      'Скорость каретки': 'до 4 м/с',
      'Питание': '24/48 В, 500 Вт',
      'Управление': 'Пульт / центральная система',
      'Материал рельса': 'Нержавеющая сталь',
    },
    images: [
      '/images/products/puma-35/01.png',
      '/images/products/puma-35/02.png',
      '/images/products/puma-35/03.png',
      '/images/products/puma-35/04.png',
      '/images/products/puma-35/05.png',
      '/images/products/puma-35/06.png',
      '/images/products/puma-35.svg',
    ],
    orderSteps: [
      {
        title: 'Опишите упражнение',
        text: 'Дистанции, требуемые рубежи, профиль движения (темп/ускорение), тип мишени и условия объекта.',
      },
      {
        title: 'Согласуем конфигурацию',
        text: 'Пульт/центральная система, механическая часть, датчики и интеграции — под вашу методику.',
      },
      {
        title: 'КП и сроки',
        text: 'Подготовим коммерческое предложение, согласуем сроки изготовления и поставки.',
      },
    ],
    related: ['beguschiy-kaban-trosovaya-ustanovka', 'trosovaya-ustanovka-pmu-tr2', 'poperechnaya-trosovaya-ustanovka-puma-90'],
  },
  {
    id: 'multilaser',
    name: 'Мультилазер НВП',
    category: 'misc',
    shortDescription: 'Лазерный тир для обучения и подготовки',
    description:
      'Комплект лазерного тира для образовательных учреждений и учебных классов. Возможны сценарии занятий разной сложности и работа без проектора (в зависимости от конфигурации).',
    features: [
      'Стрельба без проектора (опционально)',
      'Конструктор 2D/3D упражнений',
      'Автоматическая калибровка',
      'Поддержка базы данных результатов',
      'Возможность расширения комплекта',
    ],
    specs: {
      'Назначение': 'НВП/ОБЖ, обучение, тренировки',
      'Поставка': 'по запросу',
    },
    images: [
      '/images/products/multilaser/01.png',
      '/images/products/multilaser/02.png',
      '/images/products/multilaser/03.png',
      '/images/products/multilaser.svg',
    ],
    documentation: [{ title: 'Описание ПО (при наличии в комплекте)' }],
  },
];

export const allProducts: Product[] = [
  ...featuredProducts,
  {
    "id": "beguschiy-kaban-trosovaya-ustanovka",
    "name": "Бегущий кабан. Тросовая установка",
    "category": "moving",
    "shortDescription": "Мишенная установка \"Бегущий кабан\" предназначена для выполнения упражнений по стрельбе из огнестрельного оружия любых калибров (в т.ч.",
    "description": "Мишенная установка \"Бегущий кабан\" предназначена для выполнения упражнений по стрельбе из огнестрельного оружия любых калибров (в т.ч. и нарезных) на учебно-тренировочных занятиях, при проведении соревнований по стрелковым видам спорта, или при отработке вариантов охоты на диких зверей, например на стрелковых полигонах охотничьих хозяйств. Вместо типовой мишени 1215 х 735 мм возможна установка другого оборудования - манекенов, поворотных мишенных установок и т.д.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/beguschiy-kaban-trosovaya-ustanovka/01.png",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka/02.png",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka/03.png",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka/04.jpg",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka/05.png",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka/06.png",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka/07.png",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka.svg",
      "/images/products/beguschiy-kaban-trosovaya-ustanovka.svg",
    ]
  },
  {
    "id": "elektronnaya-mishen-puma-51",
    "name": "Электронная мишень ПУМА 51",
    "category": "electronic",
    "shortDescription": "PUMA-51 это автономная, беспроводная мишень для стрельбы из пневматики.",
    "description": "PUMA-51 это автономная, беспроводная мишень для стрельбы из пневматики. Мишень передает данные о времени попадания и начисленных очках в открытую сеть WiFi.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/elektronnaya-mishen-puma-51/01.png",
      "/images/products/elektronnaya-mishen-puma-51/02.png",
      "/images/products/elektronnaya-mishen-puma-51/03.png",
      "/images/products/elektronnaya-mishen-puma-51.svg",
      "/images/products/elektronnaya-mishen-puma-51.svg",
    ]
  },
  {
    "id": "trosovaya-ustanovka-pmu-tr2",
    "name": "Тросовая установка ПМУ ТР2",
    "category": "moving",
    "shortDescription": "ПУМА ТР - это линейка моделей тросовых мишенных установок, обеспечивающих перемещение мишени для стрельбы из любого пневматического оружия о",
    "description": "ПУМА ТР - это линейка моделей тросовых мишенных установок, обеспечивающих перемещение мишени для стрельбы из любого пневматического оружия от стрелка на рубеж и обратно. Установка позволяет быстро перемещать мишень с размерами 30х30см на фиксированную при монтаже дистанцию (от5 до 15м) и возвращать ее обратно через устанавливаемое время (0-100сек).",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/trosovaya-ustanovka-pmu-tr2.svg"
    ]
  },
  {
    "id": "elektronnaya-mishen-baggi",
    "name": "Электронная мишень \"БАГГИ\"",
    "category": "electronic",
    "shortDescription": "Игровая мишень предназначена для установки на заднюю дугу багги.",
    "description": "Игровая мишень предназначена для установки на заднюю дугу багги. Водители нескольких багги, уклоняясь и преследуя друг друга, стреляют из стрейкбольного оружия, стараясь попасть в мишень.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/elektronnaya-mishen-baggi/01.png",
      "/images/products/elektronnaya-mishen-baggi/02.png",
      "/images/products/elektronnaya-mishen-baggi/03.png",
      "/images/products/elektronnaya-mishen-baggi/04.png",
      "/images/products/elektronnaya-mishen-baggi/05.png",
      "/images/products/elektronnaya-mishen-baggi/06.png",
      "/images/products/elektronnaya-mishen-baggi/07.png",
      "/images/products/elektronnaya-mishen-baggi.svg",
      "/images/products/elektronnaya-mishen-baggi.svg",
    ]
  },
  {
    "id": "poperechnaya-trosovaya-ustanovka-puma-90",
    "name": "Поперечная тросовая установка ПУМА 90",
    "category": "moving",
    "shortDescription": "ПУМА 90 - монорельсовая мишенная установка для перемещения мишени поперек стрелковой галереи на огневом рубеже.",
    "description": "ПУМА 90 - монорельсовая мишенная установка для перемещения мишени поперек стрелковой галереи на огневом рубеже. Не мешает мультимедийному экрану, если он установлен.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/01.png",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/02.png",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/03.png",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/04.png",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/05.png",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/06.png",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/07.png",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90/08.jpg",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90.svg",
      "/images/products/poperechnaya-trosovaya-ustanovka-puma-90.svg",
    ]
  },
  {
    "id": "monorelsovaya-ustanovka-pmu-300",
    "name": "Монорельсовая установка ПМУ 300",
    "category": "moving",
    "shortDescription": "Потолочная монорельсовая мишенная установка (далее установка, изделие) предназначена для подвоза легких мишеней размера №4 с дистанций (рубе",
    "description": "Потолочная монорельсовая мишенная установка (далее установка, изделие) предназначена для подвоза легких мишеней размера №4 с дистанций (рубежей) на удалениях 25м при обучении стрельбе на различных удалениях. Подвижная роликовая каретка, перемещающаяся по прикрепленному к потолку помещения тира сборному монорельсу с необходимой пользователю длиной, с прикрепленным к ней мишенным щитом, обеспечивает показ грудной мишени №4 на выбранных удалениях (рубежах) путем поворота мишенного щита из транспортного положения «ребром» в боевое положение (на заданное время).",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/monorelsovaya-ustanovka-pmu-300/01.png",
      "/images/products/monorelsovaya-ustanovka-pmu-300/02.png",
      "/images/products/monorelsovaya-ustanovka-pmu-300/03.png",
      "/images/products/monorelsovaya-ustanovka-pmu-300/04.png",
      "/images/products/monorelsovaya-ustanovka-pmu-300/05.png",
      "/images/products/monorelsovaya-ustanovka-pmu-300.svg",
      "/images/products/monorelsovaya-ustanovka-pmu-300.svg",
    ]
  },
  {
    "id": "elektronnaya-mishen-puma-100",
    "name": "Электронная мишень ПУМА 100",
    "category": "electronic",
    "shortDescription": "Компактная, автономная электронная мишень для стрельбы стальными шарами или свинцовыми пулями из пневматического оружия, а так же из малокал",
    "description": "Компактная, автономная электронная мишень для стрельбы стальными шарами или свинцовыми пулями из пневматического оружия, а так же из малокалиберного огнестрельного 5,6мм - предназначена для тренировочной и развлекательной стрельбы. Быстросъемная бумажная мишень на бланке 140х140мм любого типа точно и быстро центруется визуально, по внешней окружности D130мм.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/elektronnaya-mishen-puma-100/01.png",
      "/images/products/elektronnaya-mishen-puma-100/02.png",
      "/images/products/elektronnaya-mishen-puma-100/03.png",
      "/images/products/elektronnaya-mishen-puma-100/04.png",
      "/images/products/elektronnaya-mishen-puma-100/05.png",
      "/images/products/elektronnaya-mishen-puma-100/06.png",
      "/images/products/elektronnaya-mishen-puma-100.svg",
      "/images/products/elektronnaya-mishen-puma-100.svg",
    ]
  },
  {
    "id": "avtomaticheskiy-popper-puma-10",
    "name": "Автоматический поппер ПУМА 10",
    "category": "accessories",
    "shortDescription": "Автоматический поппер ПУМА 10",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/avtomaticheskiy-popper-puma-10/01.png",
      "/images/products/avtomaticheskiy-popper-puma-10/02.png",
      "/images/products/avtomaticheskiy-popper-puma-10/03.png",
      "/images/products/avtomaticheskiy-popper-puma-10/04.png",
      "/images/products/avtomaticheskiy-popper-puma-10/05.png",
      "/images/products/avtomaticheskiy-popper-puma-10/06.png",
      "/images/products/avtomaticheskiy-popper-puma-10/07.png",
      "/images/products/avtomaticheskiy-popper-puma-10/08.png",
      "/images/products/avtomaticheskiy-popper-puma-10/09.png",
      "/images/products/avtomaticheskiy-popper-puma-10/10.png",
      "/images/products/avtomaticheskiy-popper-puma-10/11.png",
      "/images/products/avtomaticheskiy-popper-puma-10.svg",
      "/images/products/avtomaticheskiy-popper-puma-10.svg",
    ]
  },
  {
    "id": "trosovaya-ustanovka-puma-tr",
    "name": "Тросовая установка ПУМА ТР",
    "category": "moving",
    "shortDescription": "ПУМА 35 это монорельсовая тросовая установка, предназначенная для перемещения мишени от стрелка на нужный рубеж и обратно.",
    "description": "ПУМА 35 это монорельсовая тросовая установка, предназначенная для перемещения мишени от стрелка на нужный рубеж и обратно. Питание установки осуществляется от безопасно низкого напряжения.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/trosovaya-ustanovka-puma-tr/01.png",
      "/images/products/trosovaya-ustanovka-puma-tr/02.png",
      "/images/products/trosovaya-ustanovka-puma-tr/03.png",
      "/images/products/trosovaya-ustanovka-puma-tr/04.png",
      "/images/products/trosovaya-ustanovka-puma-tr/05.png",
      "/images/products/trosovaya-ustanovka-puma-tr/06.png",
      "/images/products/trosovaya-ustanovka-puma-tr/07.png",
      "/images/products/trosovaya-ustanovka-puma-tr/08.png",
      "/images/products/trosovaya-ustanovka-puma-tr/09.png",
      "/images/products/trosovaya-ustanovka-puma-tr/10.jpg",
      "/images/products/trosovaya-ustanovka-puma-tr.svg",
      "/images/products/trosovaya-ustanovka-puma-tr.svg",
    ]
  },
  {
    "id": "beguschaya-mishen-puma-45",
    "name": "Бегущая мишень ПУМА 45",
    "category": "moving",
    "shortDescription": "Бегущая мишень ПУМА 45",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/beguschaya-mishen-puma-45/01.png",
      "/images/products/beguschaya-mishen-puma-45/02.png",
      "/images/products/beguschaya-mishen-puma-45/03.png",
      "/images/products/beguschaya-mishen-puma-45/04.png",
      "/images/products/beguschaya-mishen-puma-45.svg",
      "/images/products/beguschaya-mishen-puma-45.svg",
    ]
  },
  {
    "id": "povorotka-na-dve-misheni-pmu-8s",
    "name": "Поворотка на две мишени ПМУ 8С",
    "category": "turners",
    "shortDescription": "Поворотка на две мишени ПМУ 8С",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/povorotka-na-dve-misheni-pmu-8s.svg"
    ]
  },
  {
    "id": "sistema-otvetnogo-ognya-pmu-30",
    "name": "Система ответного огня ПМУ 30",
    "category": "systems",
    "shortDescription": "Переносная установка для организации \"ответного огня противника\" может быть использована в тире для мобилизации внимания стрелка или в разли",
    "description": "Переносная установка для организации \"ответного огня противника\" может быть использована в тире для мобилизации внимания стрелка или в различных играх типа \"Зарница\", стрейкбольных \"боях\" и охране неких обьектов и проходов и т.п. В отличии от аналогов, установка автономна и не имеет проводных подключений, быстро развертывается и переносится на новое место.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/sistema-otvetnogo-ognya-pmu-30/01.png",
      "/images/products/sistema-otvetnogo-ognya-pmu-30/02.png",
      "/images/products/sistema-otvetnogo-ognya-pmu-30.svg",
      "/images/products/sistema-otvetnogo-ognya-pmu-30.svg",
    ]
  },
  {
    "id": "shatun-pmu-9",
    "name": "Шатун ПМУ 9",
    "category": "misc",
    "shortDescription": "ПМУ-9 Шатун это мобильная мишенная установка, предназначенная для стрельбы из всех носимых видов оружия по качающейся цели.",
    "description": "ПМУ-9 Шатун это мобильная мишенная установка, предназначенная для стрельбы из всех носимых видов оружия по качающейся цели. В отличие от аналогов",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/shatun-pmu-9.svg"
    ]
  },
  {
    "id": "biatlon-puma-45",
    "name": "Биатлон ПУМА 45",
    "category": "misc",
    "shortDescription": "Биатлон ПУМА 45",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/biatlon-puma-45/01.png",
      "/images/products/biatlon-puma-45/02.png",
      "/images/products/biatlon-puma-45/03.png",
      "/images/products/biatlon-puma-45/04.png",
      "/images/products/biatlon-puma-45.svg",
      "/images/products/biatlon-puma-45.svg",
    ]
  },
  {
    "id": "vertikalnyy-podemnik-pmu-7",
    "name": "Вертикальный подъемник ПМУ 7",
    "category": "lifters",
    "shortDescription": "ПМУ-7 (торговая марка ПУМА 3) - переносная автономная мишенная установка, предназначенная для показа ростовых мишеней из пластика путем их п",
    "description": "ПМУ-7 (торговая марка ПУМА 3) - переносная автономная мишенная установка, предназначенная для показа ростовых мишеней из пластика путем их подъема и опускания в полевых условиях. Имеет \"стаканы\" для закрепления мишени, благодаря чему может использоваться для подачи мишени из-за угла или препятствий, в проемах зданий, из окопа и т.п.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/vertikalnyy-podemnik-pmu-7/01.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/02.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/03.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/04.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/05.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/06.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/07.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/08.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/09.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/10.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/11.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/12.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/13.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/14.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/15.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/16.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/17.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/18.png",
      "/images/products/vertikalnyy-podemnik-pmu-7/19.png",
      "/images/products/vertikalnyy-podemnik-pmu-7.svg",
      "/images/products/vertikalnyy-podemnik-pmu-7.svg",
    ]
  },
  {
    "id": "telezhka-dlya-mishennyh-moduley-pmu-50",
    "name": "Тележка для мишенных модулей ПМУ 50",
    "category": "misc",
    "shortDescription": "ПМУ-50 это радиоуправляемая мишенная тележка, предназначенная для использования как в закрытых помещениях, так и на открытой специально подг",
    "description": "ПМУ-50 это радиоуправляемая мишенная тележка, предназначенная для использования как в закрытых помещениях, так и на открытой специально подготовленной местности (полигонах), в целях обучения стрельбе по движущимся целям из любого носимого оружия. Управление движением тележки в пределах прямой видимости - осуществляет оператор с помощью пульта управления, имеющего джойстик. При потере связи ПМУ-50 автоматически останавливается.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/01.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/02.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/03.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/04.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/05.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/06.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/07.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/08.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50/09.png",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50.svg",
      "/images/products/telezhka-dlya-mishennyh-moduley-pmu-50.svg",
    ]
  },
  {
    "id": "elektronnaya-udarnaya-mishen-puma-110",
    "name": "Электронная ударная мишень ПУМА 110",
    "category": "electronic",
    "shortDescription": "Автономная электронная мишень для стрельбы стальными шарами или свинцовыми пулями из пневматического оружия, а так же из малокалиберного огн",
    "description": "Автономная электронная мишень для стрельбы стальными шарами или свинцовыми пулями из пневматического оружия, а так же из малокалиберного огнестрельного 5,6мм - предназначена для тренировочной и развлекательной стрельбы. Возможна установка броневой плиты для использования легкого огнестрельного оружия - ПМ и т.п.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/elektronnaya-udarnaya-mishen-puma-110/01.png",
      "/images/products/elektronnaya-udarnaya-mishen-puma-110/02.png",
      "/images/products/elektronnaya-udarnaya-mishen-puma-110.svg",
      "/images/products/elektronnaya-udarnaya-mishen-puma-110.svg",
    ]
  },
  {
    "id": "modul-dlya-podema-mishennogo-torsa-puma-10",
    "name": "Модуль для подъема мишенного торса ПУМА 10",
    "category": "misc",
    "shortDescription": "Модуль для подъема мишенного торса ПУМА 10",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/modul-dlya-podema-mishennogo-torsa-puma-10.svg"
    ]
  },
  {
    "id": "povorotka-na-odnu-mishen-puma-4",
    "name": "Поворотка на одну мишень ПУМА 4",
    "category": "turners",
    "shortDescription": "ПУМА 4 это мобильная мишенная установка, предназначенная для показа ростовых мишеней путем их поворота в положения \"боевое\" и \"ребром\".",
    "description": "ПУМА 4 это мобильная мишенная установка, предназначенная для показа ростовых мишеней путем их поворота в положения \"боевое\" и \"ребром\". Механизм электропривода содержит резиновые муфты и ограничители, смягчающие нагрузки от случайных ударов и усилий в процессе эксплуатации.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/povorotka-na-odnu-mishen-puma-4.svg"
    ]
  },
  {
    "id": "podemno-povorotnyy-podemnik-pmu-15",
    "name": "Подъемно-поворотный подъемник ПМУ 15",
    "category": "lift_turn",
    "shortDescription": "Автономная мишенная установка ПМУ-15 предназначена для быстрого развертывания мишенной обстановки в полевых условиях или закрытых тирах - сл",
    "description": "Автономная мишенная установка ПМУ-15 предназначена для быстрого развертывания мишенной обстановки в полевых условиях или закрытых тирах - случаях, когда требуется сложное управление мишенью (её поворот в положение ребром-чужой и подъем-опускание) и использовании носимого пневматического или огнестрельного оружия. ПМУ-15 обеспечивает высокую скорость смены положения мишени и способна работать при пониженных температурах.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/podemno-povorotnyy-podemnik-pmu-15.svg"
    ]
  },
  {
    "id": "okonnyy-podemnik-pmu-12",
    "name": "Оконный подъемник ПМУ 12",
    "category": "ceiling_wall",
    "shortDescription": "ПМУ-12 это автономный, малогабаритный \"оконный\" подъемник, предназначенный для монтажа в дверных и оконных проемах и позволяющий имитировать",
    "description": "ПМУ-12 это автономный, малогабаритный \"оконный\" подъемник, предназначенный для монтажа в дверных и оконных проемах и позволяющий имитировать появление в них головы снайпера, наблюдателя и т.п. Две и более таких установок могут быть быстро смонтированны и работать совместно, по одному сценарию, от радиосигналов управляющего ПК или пульта.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/okonnyy-podemnik-pmu-12/01.png",
      "/images/products/okonnyy-podemnik-pmu-12/02.jpg",
      "/images/products/okonnyy-podemnik-pmu-12/03.png",
      "/images/products/okonnyy-podemnik-pmu-12.svg",
      "/images/products/okonnyy-podemnik-pmu-12.svg",
    ]
  },
  {
    "id": "potolochnyy-podemnik-pmu-35",
    "name": "Потолочный подъемник ПМУ 35",
    "category": "ceiling_wall",
    "shortDescription": "Потолочный подъемник ПМУ 35",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/potolochnyy-podemnik-pmu-35/01.png",
      "/images/products/potolochnyy-podemnik-pmu-35/02.png",
      "/images/products/potolochnyy-podemnik-pmu-35/03.png",
      "/images/products/potolochnyy-podemnik-pmu-35/04.png",
      "/images/products/potolochnyy-podemnik-pmu-35/05.png",
      "/images/products/potolochnyy-podemnik-pmu-35/06.png",
      "/images/products/potolochnyy-podemnik-pmu-35/07.png",
      "/images/products/potolochnyy-podemnik-pmu-35.svg",
      "/images/products/potolochnyy-podemnik-pmu-35.svg",
    ]
  },
  {
    "id": "popper-pmu-a6",
    "name": "Поппер ПМУ А6",
    "category": "accessories",
    "shortDescription": "Автоматический поппер для практической стрельбы на открытой местности.",
    "description": "Автоматический поппер для практической стрельбы на открытой местности. Управляется встроенным таймером или радиобрелком.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/popper-pmu-a6/01.png",
      "/images/products/popper-pmu-a6/02.png",
      "/images/products/popper-pmu-a6.svg",
      "/images/products/popper-pmu-a6.svg",
    ]
  },
  {
    "id": "sistema-upravleniya-poligonom-pak",
    "name": "Система управления полигоном ПАК",
    "category": "systems",
    "shortDescription": "Предлагаемый комплект оборудования предназначен для \"перехватывания\" управления мишенным полем на полигонах, где имеющиеся пульты управления",
    "description": "Предлагаемый комплект оборудования предназначен для \"перехватывания\" управления мишенным полем на полигонах, где имеющиеся пульты управления оказались неисправными или устаревшими, не позволяющими решать текущие тактические задачи подготовки стрелков на современном уровне. Подключение плат управления к полигонной сети не вносит никаких изменений в существующую схему подключений и не мешает её обычной работе.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/sistema-upravleniya-poligonom-pak/01.png",
      "/images/products/sistema-upravleniya-poligonom-pak/02.png",
      "/images/products/sistema-upravleniya-poligonom-pak/03.png",
      "/images/products/sistema-upravleniya-poligonom-pak/04.png",
      "/images/products/sistema-upravleniya-poligonom-pak.svg",
      "/images/products/sistema-upravleniya-poligonom-pak.svg",
    ]
  },
  {
    "id": "modul-povorota-misheni-puma-4a",
    "name": "Модуль поворота мишени ПУМА 4А",
    "category": "turners",
    "shortDescription": "Модуль поворота мишени ПУМА 4А",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/modul-povorota-misheni-puma-4a.svg"
    ]
  },
  {
    "id": "podemno-povorotnyy-podemnik-pmu-4",
    "name": "Подъемно-поворотный подъемник ПМУ 4",
    "category": "lift_turn",
    "shortDescription": "Подъемно-поворотная мишенная установка ПМУ-4 предназначена для эксплуатации в закрытом боевом тире.",
    "description": "Подъемно-поворотная мишенная установка ПМУ-4 предназначена для эксплуатации в закрытом боевом тире. Для удобства перемещения - смонтирована на раме с колесиками.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/podemno-povorotnyy-podemnik-pmu-4/01.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4/02.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4/03.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4/04.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4/05.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4/06.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4/07.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4.svg",
      "/images/products/podemno-povorotnyy-podemnik-pmu-4.svg",
    ]
  },
  {
    "id": "povorotnyy-podemnik-puma-4v",
    "name": "Поворотный подъемник ПУМА 4В",
    "category": "lifters",
    "shortDescription": "Поворотный подъемник ПУМА 4В",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/povorotnyy-podemnik-puma-4v.svg"
    ]
  },
  {
    "id": "potolochnaya-mishennaya-ustanovka-pmu-mr",
    "name": "Потолочная мишенная установка ПМУ МР",
    "category": "ceiling_wall",
    "shortDescription": "ПМУ МР - потолочная мишенная установка, специально созданная для условий закрытого тира, в котором уже имеется мультимедийный экран - но ест",
    "description": "ПМУ МР - потолочная мишенная установка, специально созданная для условий закрытого тира, в котором уже имеется мультимедийный экран - но есть необходимость провести стрельбы в строгом соответствии с КС, именно по бумажным мишеням на разных удалениях (рубежах). Например, длина галереи 50 или 100м, а зачетные стрельбы необходимо выполнить на 15 и 25м и т.п.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr/01.png",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr/02.png",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr/03.png",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr/04.png",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr/05.png",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr/06.png",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr/07.png",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr.svg",
      "/images/products/potolochnaya-mishennaya-ustanovka-pmu-mr.svg",
    ]
  },
  {
    "id": "podemno-povorotnyy-podemnik-pmu-5",
    "name": "Подъемно-поворотный подъемник ПМУ 5",
    "category": "lift_turn",
    "shortDescription": "Подъемно-поворотная мишенная установка ПМУ-5 предназначена для работы в закрытых помещениях (тирах) - а так же на открытой местности в услов",
    "description": "Подъемно-поворотная мишенная установка ПМУ-5 предназначена для работы в закрытых помещениях (тирах) - а так же на открытой местности в условиях отсутствия осадков. Может управляться от носимых пультов или от центрального управляющего компьютера.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/01.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/02.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/03.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/04.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/05.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/06.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/07.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5/08.png",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5.svg",
      "/images/products/podemno-povorotnyy-podemnik-pmu-5.svg",
    ]
  },
  {
    "id": "vybor-sposoba-upravleniya-odnorangovaya-set",
    "name": "Выбор способа управления. Одноранговая сеть",
    "category": "texts",
    "shortDescription": "ПМУ-25 это автономная, беспроводная мишень для стрельбы из пневматики и одновременно, из электронного оружия (лазерного).",
    "description": "ПМУ-25 это автономная, беспроводная мишень для стрельбы из пневматики и одновременно, из электронного оружия (лазерного). Для работы мишени не требуется внешний компьютер или проектор - мишень вполне \"самодостаточна\".",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/vybor-sposoba-upravleniya-odnorangovaya-set.svg"
    ]
  },
  {
    "id": "tochnost-opredeleniya-koordinat",
    "name": "Точность определения координат",
    "category": "texts",
    "shortDescription": "Точность определения координат",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/tochnost-opredeleniya-koordinat.svg"
    ]
  },
  {
    "id": "osnaschenie-otkrytogo-tira-avtomaticheskimi-mu",
    "name": "Оснащение открытого тира автоматическими МУ",
    "category": "texts",
    "shortDescription": "Оснащение открытого тира автоматическими МУ",
    "description": "Краткое описание будет уточнено под ваш проект. Оборудование XTIR разрабатывается и производится под задачу; возможна адаптация характеристик.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/osnaschenie-otkrytogo-tira-avtomaticheskimi-mu.svg"
    ]
  },
  {
    "id": "komplekt-dlya-peredelki-oruzhiya-pod-lazer",
    "name": "Комплект для переделки оружия под лазер",
    "category": "misc",
    "shortDescription": "Предлагаемый для самостоятельной установки комплект, состоящий из электронной платы, лазерного модуля, микровыключателя и пьезоэлемента - по",
    "description": "Предлагаемый для самостоятельной установки комплект, состоящий из электронной платы, лазерного модуля, микровыключателя и пьезоэлемента - позволит практически любое оружие превратить в электронное (лазерное). После установки этого комплекта - оружие можно использовать для стрельбы в 99% лазерных тирах.",
    "features": [
      "Надежная конструкция",
      "Интеграция в сценарии стрельбы",
      "Возможность кастомизации под задачу"
    ],
    "specs": {
      "Класс": "XTIR",
      "Поставка": "по запросу"
    },
    "images": [
      "/images/products/komplekt-dlya-peredelki-oruzhiya-pod-lazer.svg"
    ]
  },
];


// -------------------------------
// Автозаполнение контента
// -------------------------------

const DEFAULT_ORDER_STEPS = [
  {
    title: 'Опишите задачу',
    text: 'Тип объекта (тир/полигон/клуб), дистанции, сценарии и условия эксплуатации (свет/температура/пыль).',
  },
  {
    title: 'Подберём конфигурацию',
    text: 'Согласуем комплектность, варианты управления, датчики/ограничители и требования по интеграции.',
  },
  {
    title: 'Подготовим КП и сроки',
    text: 'Сформируем коммерческое предложение, сроки изготовления и поставки, а также перечень документации.',
  },
] as const;

const DEFAULT_DOCUMENTATION: DocumentationItem[] = [
  { title: 'Паспорт изделия' },
  { title: 'Инструкция по монтажу' },
  { title: 'Руководство оператора' },
];

function pickHighlightsFromSpecs(specs: Record<string, string> | undefined): { label: string; value: string }[] {
  if (!specs) return [];
  const preferred = ['Точность', 'Скорость', 'Скорость каретки', 'Дистанция', 'Питание', 'Управление', 'Режимы', 'Печать', 'Камера'];
  const items: { label: string; value: string }[] = [];

  for (const key of preferred) {
    if (specs[key] && items.length < 4) items.push({ label: key, value: specs[key] });
  }
  if (items.length < 4) {
    for (const [k, v] of Object.entries(specs)) {
      if (items.length >= 4) break;
      if (items.some((x) => x.label === k)) continue;
      items.push({ label: k, value: v });
    }
  }
  return items;
}

function defaultsByCategory(category: string): {
  useCases: { title: string; text: string }[];
  howItWorks: { title: string; text: string }[];
  configurations: { title: string; points: string[] }[];
} {
  switch (category) {
    case 'electronic':
      return {
        useCases: [
          { title: 'Учебные тиры', text: 'Отработка навыков и контроль результатов. Удобно для групповых занятий и инструкторов.' },
          { title: 'Клубы и секции', text: 'Стабильная эксплуатация в режиме потока: быстрое обслуживание, понятная логика работы.' },
          { title: 'Мобильные комплексы', text: 'Гибкая установка и минимальная инфраструктура: можно разворачивать под задачу.' },
        ],
        howItWorks: [
          { title: 'Оптические/сенсорные измерения', text: 'Попадания фиксируются датчиками/оптикой и преобразуются в координаты с заданной точностью.' },
          { title: 'Сценарии и протокол', text: 'ПО отображает результаты, серии, СТП/КТП и сохраняет данные для анализа и отчётности.' },
          { title: 'Связь и управление', text: 'Wi‑Fi/радиоканал, работа с пульта или ПК оператора — в зависимости от комплектации.' },
        ],
        configurations: [
          { title: 'Базовая', points: ['Изделие', 'Крепёж/стойка по типу объекта', 'Стартовые сценарии'] },
          { title: 'Расширенная', points: ['Доп. режимы и сценарии', 'Выносные элементы (табло/пульт)', 'Подключение к ПК оператора'] },
          { title: 'Под ТЗ', points: ['Интеграция в систему тира', 'Адаптация под условия объекта (свет/пыль/температура)', 'Комплектность под проект'] },
        ],
      };

    case 'moving':
    case 'lifters':
    case 'turners':
    case 'lift_turn':
    case 'ceiling_wall':
    case 'hanging':
      return {
        useCases: [
          { title: 'Учебные полигоны', text: 'Динамические упражнения и отработка сценариев. Надёжная механика под интенсивную эксплуатацию.' },
          { title: 'Ведомственные тиры', text: 'Программируемые рубежи и сценарии, интеграция в упражнение, управление с центрального поста.' },
          { title: 'Спортивные объекты', text: 'Репетиция дисциплин и упражнений, точное повторение траекторий и режимов.' },
        ],
        howItWorks: [
          { title: 'Привод и кинематика', text: 'Электропривод обеспечивает заданные режимы движения/поворота/подъёма с торможением и ограничителями.' },
          { title: 'Сценарии', text: 'Управление по рубежам: программируемые остановки, ускорение, задержки и реакции на сигналы.' },
          { title: 'Управление', text: 'Пульт или центральная система. Возможна синхронизация со светом/звуком и другими мишенными модулями.' },
        ],
        configurations: [
          { title: 'Базовая', points: ['Установка', 'Управление с пульта', 'Базовые сценарии движения/остановки'] },
          { title: 'Интеграция в центральную систему', points: ['Подключение к АСУ тира', 'Синхронизация со светом/сигналами', 'Сложные сценарии упражнений'] },
          { title: 'Расширенная механика', points: ['Доп. датчики/ограничители (по ТЗ)', 'Адаптация рубежей и креплений', 'Условия объекта (температура/пыль)'] },
          { title: 'Под ТЗ', points: ['Длина, рубежи, скорость/ускорение', 'Интеграция с мишенными модулями', 'Комплектность под проект'] },
        ],
      };

    default:
      return {
        useCases: [
          { title: 'Проектные решения', text: 'Изделие подбирается под задачу и условия объекта, возможно изготовление по ТЗ.' },
          { title: 'Модернизация объектов', text: 'Интеграция в существующие тиры и комплексы, добавление функций и сценариев.' },
          { title: 'Комплектность', text: 'Поставка в составе системы: крепёж, кабели, пульты, элементы управления и документация.' },
        ],
        howItWorks: [
          { title: 'Инженерный подход', text: 'Проектирование, изготовление и настройка под сценарии эксплуатации и требования заказчика.' },
          { title: 'Интеграция', text: 'Подключение к существующим системам управления и сигналам (по ТЗ).' },
          { title: 'Сервис и поддержка', text: 'Документация, консультации по монтажу и эксплуатации, сопровождение проекта.' },
        ],
        configurations: [
          { title: 'Базовая', points: ['Изделие', 'Крепёж/монтажный комплект', 'Базовые настройки'] },
          { title: 'Расширенная', points: ['Доп. функции и модули', 'Интеграция', 'Сценарии'] },
          { title: 'Под ТЗ', points: ['Адаптация характеристик', 'Комплектность под проект', 'Документация'] },
        ],
      };
  }
}

function applyDefaults(p: Product): Product {
  const base = defaultsByCategory(p.category);

  const highlights = p.highlights?.length ? p.highlights : pickHighlightsFromSpecs(p.specs);
  const useCases = p.useCases?.length ? p.useCases : base.useCases;
  const howItWorks = p.howItWorks?.length ? p.howItWorks : base.howItWorks;
  const configurations = p.configurations?.length ? p.configurations : base.configurations;
  const orderSteps = p.orderSteps?.length ? p.orderSteps : [...DEFAULT_ORDER_STEPS];
  const documentation = (docsByProductId[p.id]?.length
    ? docsByProductId[p.id]
    : p.documentation?.length
      ? p.documentation
      : DEFAULT_DOCUMENTATION);

  return {
    ...p,
    highlights,
    useCases,
    howItWorks,
    configurations,
    orderSteps,
    documentation: documentation.map((d) => ({ ...d })),
  };
}

export function getProductById(id: string): Product | undefined {
  const found = allProducts.find((product) => product.id === id);
  return found ? applyDefaults(found) : undefined;
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter((product) => product.category === category).map(applyDefaults);
}

export function getFeaturedProducts(): Product[] {
  return featuredProducts.map(applyDefaults);
}
