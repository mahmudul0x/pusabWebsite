import { o as __toESM } from "../_runtime.mjs";
import { r as PROGRAMS } from "./site-content-C5LuCSvL.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion, o as AnimatePresence } from "../_libs/framer-motion.mjs";
import { N as ArrowUpRight, b as GraduationCap, c as Radio, i as Trees, j as BookOpen, n as Users, o as Stethoscope, s as Sparkles, y as HeartHandshake } from "../_libs/lucide-react.mjs";
import { t as PageHero } from "./PageHero-BYH4IfxF.mjs";
import { t as GradientButton } from "./GradientButton-BM84sC4q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/programs-C6_pGVo8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_programs_default = "/assets/hero-programs-DDkTFfh1.jpg";
var ICONS = {
	reunion: Users,
	schooling: GraduationCap,
	scholarship: HeartHandshake,
	picnic: Trees,
	humanity: Stethoscope,
	online: Radio,
	sayor: BookOpen,
	others: Sparkles
};
var META = {
	reunion: {
		tag: "Flagship",
		cadence: "Annual · December",
		impact: "500+ attendees",
		highlights: [
			"Cross-batch networking",
			"Awards & recognition",
			"Cultural evening"
		]
	},
	schooling: {
		tag: "Education",
		cadence: "Weekly sessions",
		impact: "12 schools",
		highlights: [
			"Free tutoring",
			"Career mentoring",
			"Olympiad prep"
		]
	},
	scholarship: {
		tag: "Aid",
		cadence: "Yearly intake",
		impact: "Need-based",
		highlights: [
			"Merit + need based",
			"Direct disbursal",
			"Mentor pairing"
		]
	},
	picnic: {
		tag: "Community",
		cadence: "Annual · Winter",
		impact: "All members",
		highlights: [
			"Outdoor venue",
			"Games & cuisine",
			"Family welcome"
		]
	},
	humanity: {
		tag: "Relief",
		cadence: "On-demand drives",
		impact: "Upazila-wide",
		highlights: [
			"Flood response",
			"Blanket drive",
			"Free medical camps"
		]
	},
	online: {
		tag: "Digital",
		cadence: "Monthly",
		impact: "Reach anywhere",
		highlights: [
			"Admission AMAs",
			"Career webinars",
			"Live Q&A"
		]
	},
	sayor: {
		tag: "Publication",
		cadence: "Yearly issue",
		impact: "6 sections",
		highlights: [
			"Literature & essays",
			"Alumni voices",
			"Print + digital"
		]
	},
	others: {
		tag: "Culture",
		cadence: "Year round",
		impact: "Mixed formats",
		highlights: [
			"Cultural nights",
			"Sports tournaments",
			"Partnerships"
		]
	}
};
function ProgramsPage() {
	const [active, setActive] = (0, import_react.useState)(PROGRAMS[0].key);
	const current = PROGRAMS.find((p) => p.key === active);
	const activeIdx = PROGRAMS.findIndex((p) => p.key === active);
	const CurrentIcon = ICONS[current.key] ?? Sparkles;
	const currentMeta = META[current.key];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
		title: "Programs & Activities",
		lede: "From annual reunions to scholarship support, education drives to humanitarian response, PUSAB programs continue to serve students and the wider community.",
		crumbs: [{
			label: "Home",
			to: "/"
		}, { label: "Programs" }],
		image: hero_programs_default,
		imageAlt: "PUSAB scholarship handover ceremony"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pb-24 md:pb-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-12 flex flex-col items-center text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-label mb-4",
					children: "Eight focus areas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap justify-center gap-2",
					children: PROGRAMS.map((p, i) => {
						const Icon = ICONS[p.key] ?? Sparkles;
						const isActive = active === p.key;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActive(p.key),
							className: "group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold tracking-[0.02em] transition-colors " + (isActive ? "border-transparent text-white" : "border-border bg-[var(--color-surface)] text-foreground/75 hover:text-foreground hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]"),
							children: [
								isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									layoutId: "prog-chip",
									transition: {
										type: "spring",
										stiffness: 380,
										damping: 32
									},
									className: "absolute inset-0 rounded-full bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] shadow-[0_8px_24px_-10px_color-mix(in_oklab,var(--color-accent-1)_70%,transparent)]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative z-10 font-display text-[10px] tabular-nums " + (isActive ? "text-white/80" : "text-muted-foreground"),
									children: String(i + 1).padStart(2, "0")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									size: 14,
									className: "relative z-10"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "relative z-10",
									children: p.title
								})
							]
						}) }, p.key);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
					initial: {
						opacity: 0,
						y: 16
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -10
					},
					transition: {
						duration: .4,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] shadow-sm lg:grid-cols-[1fr_1.25fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-h-[260px] overflow-hidden border-b border-border p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--color-accent-1)_55%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--color-accent-2)_45%,transparent),transparent_55%),radial-gradient(circle_at_60%_40%,color-mix(in_oklab,var(--color-accent-3)_35%,transparent),transparent_60%)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-10 flex h-full flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-white/15 bg-black/30 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/90",
										children: currentMeta.tag
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full border border-white/15 bg-black/30 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/80",
										children: [
											String(activeIdx + 1).padStart(2, "0"),
											" /",
											" ",
											String(PROGRAMS.length).padStart(2, "0")
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white shadow-lg shadow-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrentIcon, { size: 24 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "gradient-text",
												children: current.title
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-foreground/70",
											children: currentMeta.cadence
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 sm:p-8 lg:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base leading-relaxed text-foreground/85 sm:text-lg",
								children: current.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background/40 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
											children: "Cadence"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1.5 font-display font-semibold",
											children: currentMeta.cadence
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background/40 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
											children: "Reach"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1.5 font-display font-semibold",
											children: currentMeta.impact
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background/40 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
											children: "Format"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1.5 font-display font-semibold",
											children: currentMeta.tag
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-label mb-3",
									children: "Highlights"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "grid gap-2 sm:grid-cols-3",
									children: currentMeta.highlights.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2 rounded-xl border border-border bg-background/40 p-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-1)] shadow-[0_0_10px_var(--color-accent-1)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground/85",
											children: h
										})]
									}, h))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 flex flex-wrap items-center gap-3",
								children: [current.key === "scholarship" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientButton, {
									to: "/contact",
									children: "Apply for Scholarship"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientButton, {
									to: "/contact",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5",
										children: ["Get Involved ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 16 })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setActive(PROGRAMS[(activeIdx + 1) % PROGRAMS.length].key),
									className: "inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]",
									children: ["Next Program ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
								})]
							})
						]
					})]
				}, current.key)
			})]
		})
	})] });
}
//#endregion
export { ProgramsPage as component };
