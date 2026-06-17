import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion, o as AnimatePresence } from "../_libs/framer-motion.mjs";
import { D as ChevronLeft, E as ChevronRight, N as ArrowUpRight, _ as LoaderCircle, j as BookOpen, t as X } from "../_libs/lucide-react.mjs";
import { t as PageHero } from "./PageHero-BYH4IfxF.mjs";
import { t as GradientButton } from "./GradientButton-BM84sC4q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sayor-Dc6DZAfA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var _1_exports = /* @__PURE__ */ __exportAll({ default: () => _1_default });
var _1_default = "/assets/1-B6hxyZMB.jpg";
var _10_exports = /* @__PURE__ */ __exportAll({ default: () => _10_default });
var _10_default = "/assets/10-PAjhTO7O.jpg";
var _11_exports = /* @__PURE__ */ __exportAll({ default: () => _11_default });
var _11_default = "/assets/11-C0oe2-9R.jpg";
var _2_exports = /* @__PURE__ */ __exportAll({ default: () => _2_default });
var _2_default = "/assets/2-Dg2d_VCf.jpg";
var _3_exports = /* @__PURE__ */ __exportAll({ default: () => _3_default });
var _3_default = "/assets/3-Ditq90zL.jpg";
var _4_exports = /* @__PURE__ */ __exportAll({ default: () => _4_default });
var _4_default = "/assets/4-BRtFt_QZ.jpg";
var _5_exports = /* @__PURE__ */ __exportAll({ default: () => _5_default });
var _5_default = "/assets/5-DUkfB_nr.jpg";
var _6_exports = /* @__PURE__ */ __exportAll({ default: () => _6_default });
var _6_default = "/assets/6-w1WvLsYv.jpeg";
var _7_exports = /* @__PURE__ */ __exportAll({ default: () => _7_default });
var _7_default = "/assets/7-D1FyYN41.jpg";
var _8_exports = /* @__PURE__ */ __exportAll({ default: () => _8_default });
var _8_default = "/assets/8-Dp_9aOuk.jpg";
var _9_exports = /* @__PURE__ */ __exportAll({ default: () => _9_default });
var _9_default = "/assets/9-DyifhN7l.jpg";
var hero_sayor_default = "/assets/hero-sayor-BeS_TNNF.jpg";
var COVER_IMAGES = /* #__PURE__ */ Object.assign({
	"../assets/sayor/1.jpg": _1_exports,
	"../assets/sayor/10.jpg": _10_exports,
	"../assets/sayor/11.jpg": _11_exports,
	"../assets/sayor/2.jpg": _2_exports,
	"../assets/sayor/3.jpg": _3_exports,
	"../assets/sayor/4.jpg": _4_exports,
	"../assets/sayor/5.jpg": _5_exports,
	"../assets/sayor/6.jpeg": _6_exports,
	"../assets/sayor/7.jpg": _7_exports,
	"../assets/sayor/8.jpg": _8_exports,
	"../assets/sayor/9.jpg": _9_exports
});
function coverFor(id, extension) {
	return COVER_IMAGES[`../assets/sayor/${id}.${extension}`]?.default ?? "";
}
var ISSUE_ITEMS = Array.from({ length: 11 }, (_, index) => {
	const id = index + 1;
	const extension = id === 6 ? "jpeg" : "jpg";
	return {
		id,
		title: `SAYOR Issue ${String(id).padStart(2, "0")}`,
		image: coverFor(id, extension)
	};
});
var CONTENT_LOADERS = /* #__PURE__ */ Object.assign({
	"../content/sayor/1.json": () => import("./1-JTFUrSDK.mjs"),
	"../content/sayor/10.json": () => import("./10-DVSU64Ve.mjs"),
	"../content/sayor/11.json": () => import("./11-BRP8Jtfp.mjs"),
	"../content/sayor/2.json": () => import("./2-DiepPJ2I.mjs"),
	"../content/sayor/3.json": () => import("./3-Bbh0AFIH.mjs"),
	"../content/sayor/4.json": () => import("./4-Dy5WrYLz.mjs"),
	"../content/sayor/5.json": () => import("./5-Dha9y8vg.mjs"),
	"../content/sayor/6.json": () => import("./6-CLGjQ3Iu.mjs"),
	"../content/sayor/7.json": () => import("./7-B11e2Kb5.mjs"),
	"../content/sayor/8.json": () => import("./8-CRtGaCK5.mjs"),
	"../content/sayor/9.json": () => import("./9-Dku-13wQ.mjs")
});
function loadIssueContent(id) {
	const loader = CONTENT_LOADERS[`../content/sayor/${id}.json`];
	if (!loader) return Promise.resolve(null);
	return loader().then((mod) => mod.default ?? null);
}
function SayorPage() {
	const [selectedIssue, setSelectedIssue] = (0, import_react.useState)(null);
	const [doc, setDoc] = (0, import_react.useState)(null);
	const [loadingContent, setLoadingContent] = (0, import_react.useState)(false);
	const [openChapter, setOpenChapter] = (0, import_react.useState)(null);
	const selectedIndex = ISSUE_ITEMS.findIndex((item) => item.id === selectedIssue);
	const selectedIssueData = selectedIndex >= 0 ? ISSUE_ITEMS[selectedIndex] : null;
	const handleNavigate = (direction) => {
		if (!selectedIssueData) return;
		setSelectedIssue(ISSUE_ITEMS[(selectedIndex + direction + ISSUE_ITEMS.length) % ISSUE_ITEMS.length].id);
	};
	const chapters = doc?.chapters ?? [];
	const activeChapter = openChapter != null ? chapters[openChapter] : null;
	const flipChapter = (direction) => {
		if (openChapter == null || chapters.length === 0) return;
		const next = openChapter + direction;
		if (next < 0 || next >= chapters.length) return;
		setOpenChapter(next);
	};
	(0, import_react.useEffect)(() => {
		if (selectedIssue == null) {
			setDoc(null);
			setOpenChapter(null);
			return;
		}
		document.body.style.overflow = "hidden";
		let cancelled = false;
		setLoadingContent(true);
		setDoc(null);
		setOpenChapter(null);
		loadIssueContent(selectedIssue).then((loaded) => {
			if (!cancelled) {
				setDoc(loaded);
				setLoadingContent(false);
			}
		});
		return () => {
			cancelled = true;
			document.body.style.overflow = "";
		};
	}, [selectedIssue]);
	(0, import_react.useEffect)(() => {
		if (typeof document === "undefined") return;
		document.getElementById("sayor-reader-scroll")?.scrollTo({ top: 0 });
	}, [openChapter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			title: "SAYOR",
			lede: "The flagship annual magazine of PUSAB — six sections, one publication, the voice of Bishwambarpur's brightest.",
			crumbs: [{
				label: "Home",
				to: "/"
			}, { label: "SAYOR" }],
			image: hero_sayor_default,
			imageAlt: "SAYOR magazine on a desk"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "pb-10 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-extrabold tracking-tighter gradient-text leading-none text-[clamp(4rem,18vw,16rem)]",
					children: "SAYOR"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "-mt-2 text-label",
					children: "Annual · Bilingual · Bishwambarpur"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-end justify-between gap-6 border-b border-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-label mb-2",
							children: "Archive"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl md:text-4xl font-bold tracking-tight",
							children: "Browse all SAYOR editions"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground",
							children: "11 issues"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-10 max-w-2xl text-sm text-muted-foreground",
						children: "Pull any volume off the shelf — click a cover to open the full magazine and read it page by page."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
						children: ISSUE_ITEMS.map((issue, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
							type: "button",
							onClick: () => setSelectedIssue(issue.id),
							initial: {
								opacity: 0,
								y: 16
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: {
								once: true,
								margin: "-40px"
							},
							transition: {
								duration: .45,
								delay: i % 5 * .05
							},
							className: "group flex flex-col items-center [perspective:1400px]",
							"aria-label": `Open ${issue.title}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full max-w-[200px] aspect-[3/4] transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-22deg)] group-hover:-translate-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-0 top-[2%] h-[96%] w-3 translate-x-[1px] rounded-r-sm bg-[repeating-linear-gradient(to_right,#e7e2d6_0px,#e7e2d6_1px,#cfc9ba_2px,#cfc9ba_3px)] [transform:rotateY(78deg)] origin-right" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-full w-full overflow-hidden rounded-r-md rounded-l-sm border border-black/10 shadow-[0_18px_40px_-18px_rgba(15,23,42,0.55)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(79,110,247,0.45)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: issue.image,
											alt: issue.title,
											loading: "lazy",
											className: "h-full w-full object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/45 via-black/15 to-transparent" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm",
											children: ["No. ", String(issue.id).padStart(2, "0")]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold tracking-tight",
									children: issue.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100",
									children: "Read now →"
								})]
							})]
						}, issue.id))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: selectedIssueData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			transition: { duration: .25 },
			className: "fixed inset-0 z-[100] flex flex-col bg-[var(--color-background)] pt-[88px] sm:pt-[100px]",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `${selectedIssueData.title} reader`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-[var(--color-surface)]/85 px-4 py-3 backdrop-blur-md sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [activeChapter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpenChapter(null),
						className: "inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { size: 16 }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Contents"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
							children: ["SAYOR · Edition ", String(selectedIssueData.id).padStart(2, "0")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "truncate font-display text-lg font-semibold sm:text-xl",
							children: activeChapter ? activeChapter.title : selectedIssueData.title
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [!activeChapter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleNavigate(-1),
						className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]",
						"aria-label": "Previous issue",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 18 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleNavigate(1),
						className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]",
						"aria-label": "Next issue",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 18 })
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSelectedIssue(null),
						className: "ml-1 inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)]",
						"aria-label": "Close reader",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Close"
							})
						]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "sayor-reader-scroll",
				className: "flex-1 overflow-y-auto",
				children: [
					loadingContent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-3 py-32 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
							className: "animate-spin",
							size: 20
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Loading the issue…"
						})]
					}),
					!loadingContent && !activeChapter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container-page py-10 sm:py-14",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:sticky lg:top-6 lg:self-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: selectedIssueData.image,
									alt: `${selectedIssueData.title} cover`,
									className: "mx-auto w-full max-w-[300px] rounded-lg border border-black/10 shadow-[0_30px_70px_-25px_rgba(15,23,42,0.6)]"
								}), doc?.editor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-4 text-center text-sm text-muted-foreground",
									children: ["সম্পাদক · ", doc.editor]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-label mb-1",
									children: "Contents · সূচিপত্র"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-3xl font-bold tracking-tight",
									children: [
										chapters.length,
										" ",
										chapters.length === 1 ? "piece" : "pieces",
										" in this edition"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
									className: "mt-8 divide-y divide-border border-y border-border",
									children: chapters.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setOpenChapter(idx),
										className: "group flex w-full items-baseline gap-4 py-4 text-left transition-colors hover:bg-[var(--color-surface)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-8 shrink-0 font-display text-sm tabular-nums text-muted-foreground",
												children: String(idx + 1).padStart(2, "0")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "sayor-prose block text-lg font-semibold leading-snug text-foreground group-hover:text-[var(--color-accent-1)]",
													children: c.title
												}), c.author && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "sayor-prose mt-0.5 block text-sm text-muted-foreground",
													children: c.author
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
												size: 18,
												className: "mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent-1)]"
											})
										]
									}) }, idx))
								}),
								chapters.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "py-10 text-sm text-muted-foreground",
									children: "The text for this edition isn't available yet — enjoy the cover."
								})
							] })]
						})
					}),
					!loadingContent && activeChapter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
							initial: {
								opacity: 0,
								x: 24
							},
							animate: {
								opacity: 1,
								x: 0
							},
							exit: {
								opacity: 0,
								x: -24
							},
							transition: {
								duration: .28,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							className: "mx-auto w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-16",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] uppercase tracking-[0.22em] text-muted-foreground",
									children: [
										String((openChapter ?? 0) + 1).padStart(2, "0"),
										" / ",
										String(chapters.length).padStart(2, "0")
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "sayor-prose mt-3 text-3xl font-bold leading-tight sm:text-4xl",
									children: activeChapter.title
								}),
								activeChapter.author && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "sayor-prose mt-3 text-base text-[var(--color-accent-1)]",
									children: activeChapter.author
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sayor-prose mt-10",
									children: activeChapter.paragraphs.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-5 text-[1.075rem] leading-[2] text-foreground/85",
										children: p
									}, i))
								}),
								activeChapter.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "sayor-prose mt-8 border-l-2 border-[var(--color-accent-1)] pl-4 text-sm italic text-muted-foreground",
									children: activeChapter.bio
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-16 flex items-center justify-between gap-3 border-t border-border pt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: openChapter === 0,
											onClick: () => flipChapter(-1),
											className: "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] disabled:cursor-not-allowed disabled:opacity-40",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 }), " Previous"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setOpenChapter(null),
											className: "text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground",
											children: "Contents"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: openChapter === chapters.length - 1,
											onClick: () => flipChapter(1),
											className: "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] disabled:cursor-not-allowed disabled:opacity-40",
											children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })]
										})
									]
								})
							]
						}, openChapter)
					})
				]
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-[2rem] p-8 md:p-12 bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-xl text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold uppercase tracking-[0.22em] text-white/80",
									children: "Student Directory"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-display text-2xl md:text-4xl font-bold leading-tight",
									children: "A complete directory of Bishwambarpur's brightest — past and present."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-white/85",
									children: "Connect with the creators, writers, doctors, and engineers featured across every SAYOR issue."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex md:justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientButton, {
								to: "/contact",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: ["Explore directory ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })]
								})
							})
						})]
					})]
				})
			})
		})
	] });
}
//#endregion
export { SayorPage as component };
