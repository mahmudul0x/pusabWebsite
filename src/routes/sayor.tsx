import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { BookOpen, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { GradientButton } from "@/components/site/GradientButton";
import { useFlipbook } from "@/lib/flipbook-context";

const COVER_IMAGES = import.meta.glob<{ default: string }>(
  "../assets/sayor/*.{jpg,jpeg}",
  { eager: true },
);

function coverFor(id: number, extension: string): string {
  return COVER_IMAGES[`../assets/sayor/${id}.${extension}`]?.default ?? "";
}

const ISSUE_ITEMS = Array.from({ length: 11 }, (_, index) => {
  const id = index + 1;
  const extension = id === 6 ? "jpeg" : "jpg";
  return { id, title: `SAYOR Issue ${String(id).padStart(2, "0")}`, image: coverFor(id, extension) };
});

type SayorChapter = { title: string; author: string; bio: string; paragraphs: string[] };
type SayorDoc = { id: number; editor: string; chapters: SayorChapter[] };

const CONTENT_LOADERS = import.meta.glob<{ default: SayorDoc }>("../content/sayor/*.json");

function loadIssueContent(id: number): Promise<SayorDoc | null> {
  const loader = CONTENT_LOADERS[`../content/sayor/${id}.json`];
  if (!loader) return Promise.resolve(null);
  return loader().then((mod) => mod.default ?? null);
}

export const Route = createFileRoute("/sayor")({
  head: () => ({
    meta: [
      { title: "SAYOR — The Annual Magazine of PUSAB" },
      { name: "description", content: "SAYOR is PUSAB's annual magazine spanning education, culture, science, heritage, literature and a directory of Bishwambarpur students." },
      { property: "og:title", content: "SAYOR — Annual Magazine of PUSAB" },
      { property: "og:description", content: "Six sections, one publication — the voice of Bishwambarpur's brightest." },
      { property: "og:url", content: "/sayor" },
    ],
    links: [{ rel: "canonical", href: "/sayor" }],
  }),
  component: SayorPage,
});

// ════════════════════════════════════════════════════════════════════════════
// LEAF MODEL
// A book is a flat list of "leaves" (single pages). Two leaves shown side by
// side form a spread. Each leaf is one of:
//   cover  | toc | chapter-title | chapter-body (a slice of paragraphs) | blank
// Chapter bodies are auto-paginated by measuring rendered height, so the reader
// never scrolls — text flows page to page like a real book.
// ════════════════════════════════════════════════════════════════════════════

type Leaf =
  | { kind: "cover" }
  | { kind: "toc"; from: number; to: number; page: number } // chapters [from,to)
  | { kind: "chapter-title"; chapter: number }
  | { kind: "chapter-body"; chapter: number; paragraphs: string[]; pageInChapter: number; withBio: boolean }
  | { kind: "blank" };

// ─── Page geometry ─────────────────────────────────────────────────────────
// A single leaf keeps a book-like portrait aspect (~1 : 1.45). The spread is
// two of these. We compute the size to fit the viewport.

function usePageSize() {
  const [size, setSize] = useState({ w: 380, h: 540, mobile: false });

  useLayoutEffect(() => {
    function compute() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = vw < 768;

      // available area inside chrome (top bar ~34, dots ~24)
      const availH = vh - 34 - 24 - 6;
      const ratio = 1.32; // height / width of ONE page (slightly wider page)

      let pageH: number;
      let pageW: number;

      if (mobile) {
        const availW = vw - 16;
        pageH = Math.min(availH, availW * ratio);
        pageW = pageH / ratio;
      } else {
        // two pages side by side — fill as much as possible
        const availW = (vw - 60) / 2; // small room for arrows
        pageH = availH;
        pageW = pageH / ratio;
        if (pageW > availW) { pageW = availW; pageH = pageW * ratio; }
      }
      setSize({ w: Math.floor(pageW), h: Math.floor(pageH), mobile });
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return size;
}

// ─── Auto-pagination ───────────────────────────────────────────────────────
// Measure how many paragraphs fit per body page given the page height, by
// rendering into a hidden probe and slicing.

const BODY_PAD_Y = 36; // px top+bottom padding inside a body page (each side ~28, minus a little)
const BODY_PAD_X = 30;

function paginateChapter(
  paragraphs: string[],
  bio: string,
  pageW: number,
  pageH: number,
  probe: HTMLDivElement,
): string[][] {
  // configure probe to match a real body page text column
  probe.style.width = `${pageW - BODY_PAD_X * 2}px`;
  probe.style.fontFamily = "Georgia,'Noto Serif Bengali',serif";
  probe.style.fontSize = "0.92rem";
  probe.style.lineHeight = "1.85";
  probe.style.textAlign = "justify";

  const maxH = pageH - BODY_PAD_Y * 2;
  const pages: string[][] = [];
  let current: string[] = [];

  const renderTest = (paras: string[], firstIsDropcap: boolean) => {
    probe.innerHTML = "";
    paras.forEach((p, idx) => {
      const el = document.createElement("p");
      el.style.margin = "0 0 0.85rem 0";
      if (idx === 0 && firstIsDropcap && p.length > 0) {
        const span = document.createElement("span");
        span.style.cssText = "float:left;font-weight:bold;margin-right:6px;line-height:0.82;font-size:3.2rem;font-family:Georgia,serif;";
        span.textContent = p[0];
        el.appendChild(span);
        el.appendChild(document.createTextNode(p.slice(1)));
      } else {
        el.textContent = p;
      }
      probe.appendChild(el);
    });
    return probe.scrollHeight;
  };

  for (let i = 0; i < paragraphs.length; i++) {
    const trial = [...current, paragraphs[i]];
    const h = renderTest(trial, pages.length === 0);
    if (h > maxH && current.length > 0) {
      // current is full; push and start new page with this paragraph
      pages.push(current);
      current = [paragraphs[i]];
    } else {
      current = trial;
    }
  }
  if (current.length > 0) pages.push(current);
  if (pages.length === 0) pages.push([]);
  return pages;
}

// Split the chapter list into TOC pages that fit. First TOC page reserves room
// for the "Contents" heading; later pages use the full height for entries.
function paginateToc(
  chapters: SayorChapter[],
  pageW: number,
  pageH: number,
  probe: HTMLDivElement,
): Array<{ from: number; to: number }> {
  probe.style.width = `${pageW - pageW * 0.14}px`; // ~7% padding each side
  probe.style.fontFamily = "Georgia,serif";
  probe.style.fontSize = "";
  probe.style.lineHeight = "";
  probe.style.textAlign = "left";

  const headingH = 90; // px reserved on the first page for "Contents" title
  const pad = pageH * 0.14;

  const measureRange = (from: number, to: number, withHeading: boolean) => {
    probe.innerHTML = "";
    for (let i = from; i < to; i++) {
      const c = chapters[i];
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:10px;padding:8px 0;border-bottom:1px solid rgba(139,115,85,0.18);";
      const num = document.createElement("span");
      num.style.cssText = "width:1.6rem;font-size:13px;";
      num.textContent = String(i + 1).padStart(2, "0");
      const txt = document.createElement("div");
      txt.innerHTML = `<div style="font-size:14px;line-height:1.3">${c.title}</div>${c.author ? `<div style="font-size:11px;margin-top:2px">${c.author}</div>` : ""}`;
      row.appendChild(num); row.appendChild(txt);
      probe.appendChild(row);
    }
    return probe.scrollHeight + (withHeading ? headingH : 0);
  };

  const maxH = pageH - pad;
  const pages: Array<{ from: number; to: number }> = [];
  let start = 0;
  while (start < chapters.length) {
    let end = start + 1;
    while (end <= chapters.length) {
      const h = measureRange(start, end, pages.length === 0);
      if (h > maxH && end - 1 > start) { end -= 1; break; }
      if (end === chapters.length) break;
      end += 1;
    }
    pages.push({ from: start, to: end });
    start = end;
  }
  if (pages.length === 0) pages.push({ from: 0, to: 0 });
  return pages;
}

function buildLeaves(
  doc: SayorDoc | null,
  pageW: number,
  pageH: number,
  probe: HTMLDivElement | null,
): Leaf[] {
  const leaves: Leaf[] = [{ kind: "cover" }];
  if (!doc || !probe) {
    leaves.push({ kind: "toc", from: 0, to: 0, page: 0 });
    return leaves;
  }

  // TOC (possibly multiple pages)
  const tocPages = paginateToc(doc.chapters, pageW, pageH, probe);
  tocPages.forEach((tp, i) => leaves.push({ kind: "toc", from: tp.from, to: tp.to, page: i }));

  doc.chapters.forEach((ch, ci) => {
    leaves.push({ kind: "chapter-title", chapter: ci });
    const bodyPages = paginateChapter(ch.paragraphs, ch.bio, pageW, pageH, probe);
    bodyPages.forEach((paras, pi) => {
      leaves.push({
        kind: "chapter-body",
        chapter: ci,
        paragraphs: paras,
        pageInChapter: pi,
        withBio: pi === bodyPages.length - 1,
      });
    });
  });
  // ensure even leaf count so spreads pair up nicely on desktop
  if (leaves.length % 2 !== 0) leaves.push({ kind: "blank" });
  return leaves;
}

// ════════════════════════════════════════════════════════════════════════════
// LEAF RENDERERS
// ════════════════════════════════════════════════════════════════════════════

const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`;

function LeafFace({
  leaf,
  doc,
  issueData,
  side,
  onChapterClick,
}: {
  leaf: Leaf;
  doc: SayorDoc | null;
  issueData: { id: number; title: string; image: string };
  side: "left" | "right";
  onChapterClick?: (i: number) => void;
}) {
  // inner shadow toward the spine gives a curved-page feel
  const spineShadow =
    side === "left"
      ? "inset -14px 0 22px -14px rgba(0,0,0,0.28)"
      : "inset 14px 0 22px -14px rgba(0,0,0,0.28)";

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      style={{ background: "#f3eee2", backgroundImage: PAPER_TEXTURE, backgroundBlendMode: "multiply", boxShadow: spineShadow }}
    >
      {leaf.kind === "cover" && <CoverLeaf issueData={issueData} doc={doc} />}
      {leaf.kind === "toc" && <TocLeaf doc={doc} from={leaf.from} to={leaf.to} page={leaf.page} onChapterClick={onChapterClick} />}
      {leaf.kind === "chapter-title" && doc && <ChapterTitleLeaf chapter={doc.chapters[leaf.chapter]} index={leaf.chapter} total={doc.chapters.length} />}
      {leaf.kind === "chapter-body" && doc && <ChapterBodyLeaf chapter={doc.chapters[leaf.chapter]} leaf={leaf} />}
      {leaf.kind === "blank" && null}
    </div>
  );
}

function CoverLeaf({ issueData, doc }: { issueData: { id: number; title: string; image: string }; doc: SayorDoc | null }) {
  return (
    <div className="relative h-full">
      <img src={issueData.image} alt={issueData.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7),rgba(0,0,0,0.05) 55%,transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-[6%]">
        <p className="text-white/65 uppercase tracking-[0.2em] mb-1.5" style={{ fontSize: "clamp(8px,1.6vw,11px)" }}>PUSAB Annual Magazine</p>
        <p className="text-white font-bold leading-snug" style={{ fontFamily: "Georgia,serif", fontSize: "clamp(16px,3.4vw,24px)" }}>{issueData.title}</p>
        {doc?.editor && <p className="text-white/55 mt-1" style={{ fontSize: "clamp(11px,2.2vw,14px)" }}>সম্পাদক · {doc.editor}</p>}
      </div>
    </div>
  );
}

function TocLeaf({ doc, from, to, page, onChapterClick }: { doc: SayorDoc | null; from: number; to: number; page: number; onChapterClick?: (i: number) => void }) {
  const chapters = doc?.chapters ?? [];
  const slice = chapters.slice(from, to);
  return (
    <div className="h-full flex flex-col p-[7%]">
      {page === 0 && (
        <>
          <p className="uppercase tracking-[0.28em] mb-1" style={{ color: "#9a856a", fontSize: "clamp(8px,1.6vw,11px)" }}>SAYOR · সূচিপত্র</p>
          <h2 className="font-bold leading-tight mb-4" style={{ fontFamily: "Georgia,serif", color: "#1a1a14", fontSize: "clamp(20px,4.5vw,34px)" }}>Contents</h2>
        </>
      )}
      {page > 0 && (
        <p className="uppercase tracking-[0.28em] mb-4" style={{ color: "#9a856a", fontSize: "clamp(8px,1.6vw,11px)" }}>Contents · continued</p>
      )}
      <div className="flex-1 overflow-hidden">
        {chapters.length === 0 ? (
          <p className="text-sm" style={{ color: "#8a7660" }}>Text for this edition isn't available yet.</p>
        ) : (
          <ol>
            {slice.map((c, idx) => {
              const i = from + idx;
              return (
                <li key={i}>
                  <button onClick={() => onChapterClick?.(i)} className="group w-full text-left flex items-baseline gap-2.5 py-2 border-b" style={{ borderColor: "rgba(139,115,85,0.18)" }}>
                    <span className="shrink-0 tabular-nums" style={{ color: "#c0aa8a", width: "1.6rem", fontFamily: "Georgia,serif", fontSize: "clamp(11px,2vw,13px)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block leading-snug group-hover:underline" style={{ color: "#1a1a14", fontFamily: "Georgia,serif", fontSize: "clamp(12px,2.3vw,14px)" }}>{c.title}</span>
                      {c.author && <span className="block mt-0.5" style={{ color: "#9a856a", fontSize: "clamp(10px,1.8vw,11px)" }}>{c.author}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function ChapterTitleLeaf({ chapter, index, total }: { chapter: SayorChapter; index: number; total: number }) {
  return (
    <div className="h-full flex flex-col justify-between p-[8%]" style={{ background: "#ece6da", backgroundImage: PAPER_TEXTURE, backgroundBlendMode: "multiply" }}>
      <div>
        <p className="uppercase tracking-[0.28em] mb-5" style={{ color: "#b8a48a", fontSize: "clamp(9px,1.7vw,11px)" }}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <div className="font-black leading-none select-none" style={{ fontFamily: "Georgia,serif", color: "rgba(0,0,0,0.055)", fontSize: "clamp(70px,16vw,150px)" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
      <div>
        <div className="mb-3" style={{ width: "1.8rem", borderTop: "1.5px solid #c0aa8a" }} />
        <h2 className="font-bold leading-tight" style={{ fontFamily: "Georgia,serif", color: "#2a2318", fontSize: "clamp(18px,3.6vw,30px)" }}>{chapter.title}</h2>
        {chapter.author && <p className="mt-2 italic" style={{ color: "#8a7660", fontFamily: "Georgia,serif", fontSize: "clamp(12px,2.3vw,15px)" }}>{chapter.author}</p>}
      </div>
    </div>
  );
}

function ChapterBodyLeaf({ chapter, leaf }: { chapter: SayorChapter; leaf: Extract<Leaf, { kind: "chapter-body" }> }) {
  return (
    <div className="h-full flex flex-col" style={{ padding: `${BODY_PAD_Y / 2}px ${BODY_PAD_X}px`, fontFamily: "Georgia,'Noto Serif Bengali',serif" }}>
      <div className="flex-1 overflow-hidden">
        {leaf.paragraphs.map((p, i) => {
          const isDropcap = leaf.pageInChapter === 0 && i === 0 && p.length > 0;
          return (
            <p key={i} className="text-justify" style={{ margin: "0 0 0.85rem 0", fontSize: "0.92rem", lineHeight: "1.85", color: "#2a2318" }}>
              {isDropcap ? (
                <>
                  <span className="float-left font-bold mr-1.5" style={{ fontFamily: "Georgia,serif", fontSize: "3.2rem", lineHeight: "0.82", color: "#5a4a38" }}>{p[0]}</span>
                  {p.slice(1)}
                </>
              ) : p}
            </p>
          );
        })}
        {leaf.withBio && chapter.bio && (
          <p className="italic" style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid rgba(139,115,85,0.22)", color: "#7a6a54", fontSize: "0.82rem", lineHeight: 1.7 }}>
            {chapter.bio}
          </p>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// THE BOOK — page-flip engine
// ════════════════════════════════════════════════════════════════════════════

function Book({
  issueData,
  doc,
  loading,
  onClose,
}: {
  issueData: { id: number; title: string; image: string };
  doc: SayorDoc | null;
  loading: boolean;
  onClose: () => void;
}) {
  const { w: pageW, h: pageH, mobile } = usePageSize();
  const probeRef = useRef<HTMLDivElement | null>(null);
  const [leaves, setLeaves] = useState<Leaf[]>([{ kind: "cover" }, { kind: "toc", from: 0, to: 0, page: 0 }]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Build (and re-build) leaves once we have doc + measured page size + probe.
  useEffect(() => {
    if (!doc) { setLeaves([{ kind: "cover" }, { kind: "toc", from: 0, to: 0, page: 0 }]); return; }
    // wait a tick so probe is mounted
    const id = requestAnimationFrame(() => {
      setLeaves(buildLeaves(doc, pageW, pageH, probeRef.current));
    });
    return () => cancelAnimationFrame(id);
  }, [doc, pageW, pageH]);

  // ── Navigation state ──
  // On desktop we move by spreads (2 leaves). On mobile, by single leaf.
  const step = mobile ? 1 : 2;
  const [leafIndex, setLeafIndex] = useState(0); // index of left leaf of current spread (or single leaf on mobile)
  const [flip, setFlip] = useState<{ dir: 1 | -1 } | null>(null);
  const lock = useRef(false);

  useEffect(() => { setLeafIndex(0); setFlip(null); lock.current = false; }, [doc]);

  const maxIndex = Math.max(0, leaves.length - (mobile ? 1 : 2));

  const go = useCallback((dir: 1 | -1) => {
    if (lock.current) return;
    const target = leafIndex + dir * step;
    if (target < 0 || target > maxIndex) return;
    lock.current = true;
    setFlip({ dir });
    setTimeout(() => {
      setLeafIndex(target);
      setFlip(null);
      lock.current = false;
    }, 720);
  }, [leafIndex, step, maxIndex]);

  const jumpToLeaf = useCallback((target: number) => {
    if (lock.current) return;
    // snap to spread boundary on desktop
    const snapped = mobile ? target : target - (target % 2);
    if (snapped === leafIndex) return;
    setLeafIndex(snapped);
  }, [leafIndex, mobile]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go, onClose]);

  const leafAt = (i: number): Leaf | null => (i >= 0 && i < leaves.length ? leaves[i] : null);

  const renderLeaf = (leaf: Leaf | null, side: "left" | "right") => {
    if (!leaf) return <div className="w-full h-full" style={{ background: "#e8e2d4" }} />;
    return (
      <LeafFace
        leaf={leaf}
        doc={doc}
        issueData={issueData}
        side={side}
        onChapterClick={(ci) => {
          const idx = leaves.findIndex((l) => l.kind === "chapter-title" && l.chapter === ci);
          if (idx >= 0) jumpToLeaf(idx);
        }}
      />
    );
  };

  // progress
  const totalSpreads = Math.ceil(leaves.length / step);
  const currentSpread = Math.floor(leafIndex / step);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 flex flex-col"
      style={{ background: "#39362f", zIndex: 10000 }}
    >
      {/* hidden measuring probe */}
      <div
        ref={probeRef}
        aria-hidden
        style={{ position: "fixed", visibility: "hidden", pointerEvents: "none", top: 0, left: 0, zIndex: -1 }}
      />

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-1.5 shrink-0" style={{ background: "#26241f" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-white/80 text-sm font-medium tracking-wide shrink-0">
            SAYOR · {String(issueData.id).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors"
          >
            <BookOpen size={14} /> <span className="hidden sm:inline">Contents</span>
          </button>
          <span className="text-white/35 text-xs">{currentSpread + 1} / {totalSpreads}</span>
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors">
            <X size={14} /> <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Book stage */}
      <div className="flex-1 flex items-center justify-center overflow-hidden relative min-h-0">
        {loading ? (
          <div className="flex items-center gap-3 text-white/50">
            <Loader2 className="animate-spin" size={22} /><span className="text-sm">Loading issue…</span>
          </div>
        ) : mobile ? (
          <MobileBook
            pageW={pageW}
            pageH={pageH}
            leafIndex={leafIndex}
            flip={flip}
            leafAt={leafAt}
            renderLeaf={renderLeaf}
            go={go}
            canPrev={leafIndex > 0}
            canNext={leafIndex < maxIndex}
          />
        ) : (
          <DesktopBook
            pageW={pageW}
            pageH={pageH}
            leafIndex={leafIndex}
            flip={flip}
            leafAt={leafAt}
            renderLeaf={renderLeaf}
            go={go}
            canPrev={leafIndex > 0}
            canNext={leafIndex < maxIndex}
          />
        )}
      </div>

      {/* Contents sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.25)", zIndex: 40 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 left-0 h-full flex flex-col"
              style={{ width: "min(280px, 78vw)", zIndex: 50, background: "#f3eee2", backgroundImage: PAPER_TEXTURE, backgroundBlendMode: "multiply", boxShadow: "12px 0 40px rgba(0,0,0,0.4)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "rgba(139,115,85,0.2)" }}>
                <div>
                  <p className="uppercase tracking-[0.25em]" style={{ color: "#9a856a", fontSize: 9 }}>সূচিপত্র</p>
                  <h3 className="font-bold" style={{ fontFamily: "Georgia,serif", color: "#1a1a14", fontSize: 18 }}>Contents</h3>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded hover:bg-black/5 transition-colors" style={{ color: "#7a6a54" }} aria-label="Close contents">
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-1.5">
                {(doc?.chapters ?? []).map((c, ci) => (
                  <button
                    key={ci}
                    onClick={() => {
                      const idx = leaves.findIndex((l) => l.kind === "chapter-title" && l.chapter === ci);
                      if (idx >= 0) jumpToLeaf(idx);
                      setSidebarOpen(false);
                    }}
                    className="group w-full text-left flex items-baseline gap-2.5 px-2.5 py-2 rounded-md transition-colors hover:bg-black/5"
                  >
                    <span className="shrink-0 tabular-nums" style={{ color: "#c0aa8a", width: "1.5rem", fontFamily: "Georgia,serif", fontSize: 12 }}>{String(ci + 1).padStart(2, "0")}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block leading-snug group-hover:underline" style={{ color: "#1a1a14", fontFamily: "Georgia,serif", fontSize: 13 }}>{c.title}</span>
                      {c.author && <span className="block mt-0.5" style={{ color: "#9a856a", fontSize: 11 }}>{c.author}</span>}
                    </span>
                  </button>
                ))}
                {(doc?.chapters ?? []).length === 0 && (
                  <p className="px-3 py-4 text-sm" style={{ color: "#8a7660" }}>No contents available.</p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5 py-1.5 shrink-0 flex-wrap px-4">
        {Array.from({ length: totalSpreads }).map((_, i) => (
          <button key={i} onClick={() => jumpToLeaf(i * step)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === currentSpread ? 20 : 6, height: 6, background: i === currentSpread ? "#c8b89a" : "rgba(255,255,255,0.2)" }}
            aria-label={`Go to spread ${i + 1}`} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Desktop: two-page spread with realistic page-flip ──────────────────────

function DesktopBook({
  pageW, pageH, leafIndex, flip, leafAt, renderLeaf, go, canPrev, canNext,
}: {
  pageW: number; pageH: number; leafIndex: number;
  flip: { dir: 1 | -1 } | null;
  leafAt: (i: number) => Leaf | null;
  renderLeaf: (leaf: Leaf | null, side: "left" | "right") => React.ReactNode;
  go: (dir: 1 | -1) => void;
  canPrev: boolean; canNext: boolean;
}) {
  const isFlipping = flip !== null;
  const dir = flip?.dir ?? 1;

  // current visible spread
  const curLeft = leafAt(leafIndex);
  const curRight = leafAt(leafIndex + 1);
  // destination spread (after flip)
  const dstLeft = leafAt(leafIndex + dir * 2);
  const dstRight = leafAt(leafIndex + dir * 2 + 1);

  return (
    <>
      <button onClick={() => go(-1)} disabled={!canPrev || isFlipping} aria-label="Previous"
        className="absolute left-1 z-30 flex items-center justify-center w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20">
        <ChevronLeft size={28} />
      </button>

      <div
        className="relative"
        style={{ width: pageW * 2, height: pageH, perspective: 2600, perspectiveOrigin: "50% 45%", boxShadow: "0 40px 90px rgba(0,0,0,0.6)" }}
      >
        {/* Left page (static) — click to go back */}
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{ width: pageW, height: pageH, cursor: canPrev ? "w-resize" : "default" }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("button,a")) return;
            if (!isFlipping) go(-1);
          }}
        >
          {renderLeaf(isFlipping && dir === -1 ? dstLeft : curLeft, "left")}
        </div>
        {/* Right page (static) — click to go forward */}
        <div
          className="absolute top-0 overflow-hidden"
          style={{ left: pageW, width: pageW, height: pageH, cursor: canNext ? "e-resize" : "default" }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("button,a")) return;
            if (!isFlipping) go(1);
          }}
        >
          {renderLeaf(isFlipping && dir === 1 ? dstRight : curRight, "right")}
        </div>

        {/* Flipping page */}
        {isFlipping && (
          <div
            className="absolute top-0"
            style={{
              width: pageW, height: pageH,
              left: dir === 1 ? pageW : 0,
              transformStyle: "preserve-3d",
              transformOrigin: dir === 1 ? "left center" : "right center",
              animation: `${dir === 1 ? "flipFwd" : "flipBwd"} 0.72s cubic-bezier(0.42,0,0.25,1) forwards`,
              zIndex: 20,
            }}
          >
            {/* Front face = current outer page */}
            <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
              {renderLeaf(dir === 1 ? curRight : curLeft, dir === 1 ? "right" : "left")}
              <FlipShade dir={dir} face="front" />
            </div>
            {/* Back face = destination inner page */}
            <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              {renderLeaf(dir === 1 ? dstLeft : dstRight, dir === 1 ? "left" : "right")}
              <FlipShade dir={dir} face="back" />
            </div>
          </div>
        )}

        {/* Spine */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: 18, zIndex: 15, background: "linear-gradient(to right,rgba(0,0,0,0.32),rgba(0,0,0,0.02) 45%,rgba(0,0,0,0.02) 55%,rgba(0,0,0,0.32))" }} />
      </div>

      <button onClick={() => go(1)} disabled={!canNext || isFlipping} aria-label="Next"
        className="absolute right-1 z-30 flex items-center justify-center w-10 h-10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20">
        <ChevronRight size={28} />
      </button>

      <style>{`
        @keyframes flipFwd { 0%{transform:rotateY(0deg);} 100%{transform:rotateY(-180deg);} }
        @keyframes flipBwd { 0%{transform:rotateY(0deg);} 100%{transform:rotateY(180deg);} }
      `}</style>
    </>
  );
}

// Moving shadow that sweeps across the flipping page for depth.
function FlipShade({ dir, face }: { dir: 1 | -1; face: "front" | "back" }) {
  // front darkens as it lifts; back brightens as it lands — approximate with a
  // static gradient + animated opacity.
  const gradient =
    (dir === 1) === (face === "front")
      ? "linear-gradient(to left, rgba(0,0,0,0.22), transparent 65%)"
      : "linear-gradient(to right, rgba(0,0,0,0.22), transparent 65%)";
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: gradient, animation: `${face === "front" ? "shadeIn" : "shadeOut"} 0.72s ease forwards` }}
    >
      <style>{`
        @keyframes shadeIn { 0%{opacity:0;} 60%{opacity:1;} 100%{opacity:0.6;} }
        @keyframes shadeOut { 0%{opacity:0.6;} 40%{opacity:1;} 100%{opacity:0;} }
      `}</style>
    </div>
  );
}

// ─── Mobile: single page with flip ──────────────────────────────────────────

function MobileBook({
  pageW, pageH, leafIndex, flip, leafAt, renderLeaf, go, canPrev, canNext,
}: {
  pageW: number; pageH: number; leafIndex: number;
  flip: { dir: 1 | -1 } | null;
  leafAt: (i: number) => Leaf | null;
  renderLeaf: (leaf: Leaf | null, side: "left" | "right") => React.ReactNode;
  go: (dir: 1 | -1) => void;
  canPrev: boolean; canNext: boolean;
}) {
  const isFlipping = flip !== null;
  const dir = flip?.dir ?? 1;
  const cur = leafAt(leafIndex);
  const dst = leafAt(leafIndex + dir);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative" style={{ width: pageW, height: pageH, perspective: 1600, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
        {/* destination underneath */}
        <div className="absolute inset-0 overflow-hidden">{renderLeaf(dst, "right")}</div>
        {/* current on top, slides/flips away */}
        {isFlipping ? (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              transformOrigin: dir === 1 ? "left center" : "right center",
              animation: `${dir === 1 ? "mflipFwd" : "mflipBwd"} 0.55s cubic-bezier(0.42,0,0.25,1) forwards`,
              backfaceVisibility: "hidden",
            }}
          >
            {renderLeaf(cur, "right")}
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden">{renderLeaf(cur, "right")}</div>
        )}
      </div>

      {/* tap zones */}
      <button onClick={() => go(-1)} disabled={!canPrev || isFlipping} aria-label="Previous"
        className="absolute left-0 top-0 bottom-0 w-1/4 flex items-center justify-start pl-2 text-white/40 disabled:opacity-0">
        <ChevronLeft size={26} />
      </button>
      <button onClick={() => go(1)} disabled={!canNext || isFlipping} aria-label="Next"
        className="absolute right-0 top-0 bottom-0 w-1/4 flex items-center justify-end pr-2 text-white/40 disabled:opacity-0">
        <ChevronRight size={26} />
      </button>

      <style>{`
        @keyframes mflipFwd { 0%{transform:rotateY(0deg);} 100%{transform:rotateY(-90deg);opacity:0;} }
        @keyframes mflipBwd { 0%{transform:rotateY(0deg);} 100%{transform:rotateY(90deg);opacity:0;} }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════════════════

function SayorPage() {
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [doc, setDoc] = useState<SayorDoc | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const { setIsOpen } = useFlipbook();

  const selectedIndex = ISSUE_ITEMS.findIndex((item) => item.id === selectedIssue);
  const selectedIssueData = selectedIndex >= 0 ? ISSUE_ITEMS[selectedIndex] : null;

  const openIssue = (id: number) => { setSelectedIssue(id); setIsOpen(true); };
  const closeIssue = () => { setSelectedIssue(null); setIsOpen(false); };

  useEffect(() => {
    if (selectedIssue == null) {
      setDoc(null);
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    let cancelled = false;
    setLoadingContent(true);
    setDoc(null);
    loadIssueContent(selectedIssue).then((loaded) => {
      if (!cancelled) { setDoc(loaded); setLoadingContent(false); }
    });
    return () => { cancelled = true; document.body.style.overflow = ""; };
  }, [selectedIssue]);

  // safety: ensure navbar restored if component unmounts while open
  useEffect(() => () => setIsOpen(false), [setIsOpen]);

  return (
    <>
      <section className="pt-32 pb-10 overflow-hidden md:pt-40">
        <div className="container-page text-center">
          <h2 className="font-display font-extrabold tracking-tighter gradient-text leading-none text-[clamp(4rem,18vw,16rem)]">SAYOR</h2>
          <p className="-mt-2 text-label">Annual · Bilingual · Bishwambarpur</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-6 border-b border-border pb-4">
            <div>
              <p className="text-label mb-2">Archive</p>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">Browse all SAYOR editions</h2>
            </div>
            <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground">11 issues</span>
          </div>

          <p className="mb-10 max-w-2xl text-sm text-muted-foreground">
            Pull any volume off the shelf — click a cover to open the full magazine and read it page by page.
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {ISSUE_ITEMS.map((issue, i) => (
              <motion.button
                key={issue.id}
                type="button"
                onClick={() => openIssue(issue.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: (i % 5) * 0.05 }}
                className="group flex flex-col items-center perspective-[1400px]"
                aria-label={`Open ${issue.title}`}
              >
                <div className="relative w-full max-w-50 aspect-3/4 transition-transform duration-500 ease-out transform-3d group-hover:transform-[rotateY(-22deg)] group-hover:-translate-y-1">
                  <div className="absolute right-0 top-[2%] h-[96%] w-3 translate-x-px rounded-r-sm bg-[repeating-linear-gradient(to_right,#e7e2d6_0px,#e7e2d6_1px,#cfc9ba_2px,#cfc9ba_3px)] transform-[rotateY(78deg)] origin-right" />
                  <div className="relative h-full w-full overflow-hidden rounded-r-md rounded-l-sm border border-black/10 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.55)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(79,110,247,0.45)]">
                    <img src={issue.image} alt={issue.title} loading="lazy" className="h-full w-full object-cover" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-black/45 via-black/15 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/0 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
                      No. {String(issue.id).padStart(2, "0")}
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="font-display text-base font-semibold tracking-tight">{issue.title}</h3>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">Read now →</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIssueData && (
          <Book
            key={selectedIssue}
            issueData={selectedIssueData}
            doc={doc}
            loading={loadingContent}
            onClose={closeIssue}
          />
        )}
      </AnimatePresence>

      <section className="py-20">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] p-8 md:p-12 bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[32px_32px] opacity-50" />
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-xl text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">Student Directory</p>
                <h3 className="mt-3 font-display text-2xl md:text-4xl font-bold leading-tight">A complete directory of Bishwambarpur's brightest — past and present.</h3>
                <p className="mt-3 text-white/85">Connect with the creators, writers, doctors, and engineers featured across every SAYOR issue.</p>
              </div>
              <div className="flex md:justify-end">
                <GradientButton to="/contact">
                  <span className="inline-flex items-center gap-1.5">Explore directory <ArrowUpRight size={16} /></span>
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
