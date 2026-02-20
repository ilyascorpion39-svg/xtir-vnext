import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { withBase } from "@/site";

type AssetType = "image" | "pdf" | "video" | "audio" | "doc" | "other";

export type GalleryItem = {
  id: string;
  title: string;
  relPath: string;
  folder: string;
  type: AssetType;
  size: number;
  url: string;
  updatedAt: string;
};

type Props = {
  items: GalleryItem[];
};

function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} КБ`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} МБ`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} ГБ`;
}

function typeLabel(t: AssetType): string {
  switch (t) {
    case "image":
      return "Фото";
    case "pdf":
      return "PDF";
    case "video":
      return "Видео";
    case "audio":
      return "Аудио";
    case "doc":
      return "Документ";
    default:
      return "Файл";
  }
}

function esc(s: string): string {
  try {
    return encodeURIComponent(s);
  } catch {
    return s;
  }
}

export default function GalleryApp({ items }: Props) {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const toAssetUrl = (url: string) => withBase(url);

  const byId = useMemo(() => {
    const m = new Map<string, GalleryItem>();
    for (const it of items || []) m.set(it.id, it);
    return m;
  }, [items]);

  const folders = useMemo(() => {
    const m = new Map<
      string,
      { name: string; count: number; cover?: string }
    >();
    for (const it of items || []) {
      const key = it.folder || "Прочее";
      const cur = m.get(key) || {
        name: key,
        count: 0 as number,
        cover: undefined as string | undefined,
      };
      cur.count += 1;
      if (!cur.cover && it.type === "image") cur.cover = toAssetUrl(it.url);
      m.set(key, cur);
    }

    return Array.from(m.values()).sort((a, b) => b.count - a.count);
  }, [items]);

  const visibleItems = useMemo(() => {
    let list = items || [];
    if (activeFolder)
      list = list.filter((it) => (it.folder || "Прочее") === activeFolder);
    if (typeFilter !== "all")
      list = list.filter((it) => it.type === typeFilter);
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((it) => {
        const hay = `${it.title} ${it.relPath} ${it.folder}`.toLowerCase();
        return hay.includes(needle);
      });
    }
    // стабильная сортировка: сначала изображения, потом остальное; внутри по имени
    const order: Record<string, number> = {
      image: 0,
      pdf: 1,
      doc: 2,
      video: 3,
      audio: 4,
      other: 5,
    };
    return [...list].sort((a, b) => {
      const oa = order[a.type] ?? 99;
      const ob = order[b.type] ?? 99;
      if (oa !== ob) return oa - ob;
      return a.title.localeCompare(b.title, "ru");
    });
  }, [items, activeFolder, q, typeFilter]);

  const openItem = openId ? byId.get(openId) : undefined;

  // Открытие конкретного файла по hash: #asset=<id>
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash || "";
      const m = h.match(/asset=([^&]+)/i);
      if (!m) return;
      const raw = m[1];
      let decoded = raw;
      try {
        decoded = decodeURIComponent(raw);
      } catch {
        decoded = raw;
      }
      const it = byId.get(decoded);
      if (it) {
        setActiveFolder((it.folder || "Прочее") as string);
        setOpenId(it.id);
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [byId]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setTiltEnabled(media.matches && !reduced.matches && window.innerWidth >= 1024);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    media.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      media.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  const handlePhotoMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!tiltEnabled) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - py) * 3;
    const rotateY = (px - 0.5) * 3;
    card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    card.style.setProperty("--glow-x", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--glow-y", `${(py * 100).toFixed(1)}%`);
  };

  const handlePhotoLeave = (event: MouseEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    card.style.transform = "";
    card.style.removeProperty("--glow-x");
    card.style.removeProperty("--glow-y");
  };

  const hasAny = (items || []).length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold text-white">Материалы</div>
            <div className="text-sm text-gray-300">
              Фотоматериалы, документы и медиа по установкам XTIR и партнёрам.
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Поиск по названиям и папкам…"
                className="w-full sm:w-[360px] rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 outline-none focus:border-primary-400/60"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full sm:w-auto rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-gray-100 outline-none focus:border-primary-400/60"
            >
              <option value="all">Все типы</option>
              <option value="image">Фото</option>
              <option value="pdf">PDF</option>
              <option value="doc">Документы</option>
              <option value="video">Видео</option>
              <option value="audio">Аудио</option>
              <option value="other">Прочее</option>
            </select>
          </div>
        </div>
      </div>

      {!activeFolder && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((f) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setActiveFolder(f.name)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-primary-300/35 hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)]"
            >
              <div className="absolute inset-0">
                {f.cover ? (
                  <img
                    src={f.cover}
                    alt={f.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                  />
                ) : (
                  <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(110,183,255,.2),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(60,220,255,.1),transparent_55%)]" />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#070a0f]/78 via-[#070a0f]/34 to-transparent" />
              </div>
              <div className="relative p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {f.name}
                    </div>
                    <div className="mt-1 text-sm text-gray-300">
                      {f.count} файлов
                    </div>
                  </div>
                  <span className="rounded-full border border-primary-300/30 bg-black/40 px-3 py-1 text-xs text-gray-200">
                    Открыть
                  </span>
                </div>
                <div className="mt-4 text-xs text-gray-400">
                  Карточки с названиями и описанием — удобно для просмотра.
                </div>
              </div>
            </button>
          ))}

          {!hasAny && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-gray-300">
              Пока нет материалов для галереи.
              <div className="mt-2 text-xs text-gray-400">
                Как только добавим фото и документы — здесь появятся карточки с
                названиями и описанием.
              </div>
            </div>
          )}
        </div>
      )}

      {activeFolder && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-2xl font-bold text-white">
                {activeFolder}
              </div>
              <div className="text-sm text-gray-300">
                {visibleItems.length} файлов
                {q.trim() ? " по вашему поиску" : ""}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveFolder(null);
                  setQ("");
                  setTypeFilter("all");
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-100 hover:bg-white/10"
              >
                ← Все разделы
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => {
                  setOpenId(it.id);
                  // сохраняем ссылку, чтобы можно было поделиться
                  window.location.hash = `asset=${esc(it.id)}`;
                }}
                onMouseMove={it.type === "image" ? handlePhotoMove : undefined}
                onMouseLeave={it.type === "image" ? handlePhotoLeave : undefined}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition duration-300 hover:-translate-y-1 hover:border-primary-300/35 hover:shadow-[0_20px_36px_rgba(0,0,0,0.35)]"
            >
                {it.type === "image" && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(260px circle at var(--glow-x,50%) var(--glow-y,0%), rgba(255,255,255,0.2), rgba(255,255,255,0) 62%)",
                    }}
                  />
                )}
                <div className="aspect-[4/3] w-full overflow-hidden bg-black/30">
                  {it.type === "image" ? (
                    <img
                      src={toAssetUrl(it.url)}
                      alt={it.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.035]"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-gray-200">
                        {typeLabel(it.type)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="line-clamp-2 text-sm font-semibold text-white">
                    {it.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {typeLabel(it.type)}
                    {formatSize(it.size) ? ` • ${formatSize(it.size)}` : ""}
                  </div>
                  <div className="mt-2 line-clamp-1 text-[11px] text-gray-500">
                    {it.relPath}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal viewer */}
      {openItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(e) => {
            // клик по фону закрывает
            if (e.target === e.currentTarget) {
              setOpenId(null);
              // оставим hash чистым
              if (window.location.hash.startsWith("#asset="))
                window.location.hash = "";
            }
          }}
        >
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f14] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-black/30 px-5 py-4">
              <div>
                <div className="text-base font-semibold text-white">
                  {openItem.title}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {openItem.folder} • {typeLabel(openItem.type)}
                  {formatSize(openItem.size)
                    ? ` • ${formatSize(openItem.size)}`
                    : ""}
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={toAssetUrl(openItem.url)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-100 hover:bg-white/10"
                >
                  Открыть файл
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setOpenId(null);
                    if (window.location.hash.startsWith("#asset="))
                      window.location.hash = "";
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-100 hover:bg-white/10"
                >
                  Закрыть
                </button>
              </div>
            </div>

            <div className="max-h-[75vh] overflow-auto p-4">
              {openItem.type === "image" && (
                <img
                  src={toAssetUrl(openItem.url)}
                  alt={openItem.title}
                  className="mx-auto max-h-[70vh] w-auto rounded-xl border border-white/10"
                  decoding="async"
                />
              )}

              {openItem.type === "pdf" && (
                <iframe
                  title={openItem.title}
                  src={toAssetUrl(openItem.url)}
                  loading="lazy"
                  className="h-[70vh] w-full rounded-xl border border-white/10 bg-black/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
                />
              )}

              {openItem.type !== "image" && openItem.type !== "pdf" && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-gray-200">
                  Этот тип файла лучше открыть напрямую:{" "}
                  <a
                    className="text-primary-300 hover:underline"
                    href={toAssetUrl(openItem.url)}
                  >
                    нажмите сюда
                  </a>
                  .
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                Обновлено: {openItem.updatedAt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
