import { o as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { C as Crown, s as Sparkles } from "../_libs/lucide-react.mjs";
import { t as PageHero } from "./PageHero-BYH4IfxF.mjs";
import { t as supabase } from "./client-Cxb5cBlI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leadership-D7tIj-hA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_leadership_default = "/assets/hero-leadership-Dl3JiOpE.jpg";
function initials(name) {
	return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
var PLACEHOLDER_ROLES = [
	"Vice President",
	"General Secretary",
	"Treasurer",
	"Organizing Secretary"
];
function MemberPortrait({ m, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "shrink-0 rounded-full grid place-items-center text-white font-semibold overflow-hidden bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] ring-2 ring-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] " + (size === "lg" ? "h-20 w-20 text-xl" : size === "sm" ? "h-10 w-10 text-xs" : "h-14 w-14 text-base"),
		children: m.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: m.photo_url,
			alt: m.name,
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: initials(m.name) })
	});
}
function LeadershipPage() {
	const [members, setMembers] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.from("ec_members").select("id,name,role,university,year,is_current,photo_url").order("year", { ascending: false }).then(({ data }) => setMembers(data ?? []));
	}, []);
	const current = members?.filter((m) => m.is_current) ?? [];
	const past = members?.filter((m) => !m.is_current) ?? [];
	const byYear = {};
	past.forEach((m) => {
		(byYear[m.year] ||= []).push(m);
	});
	const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
	const featured = current.find((m) => /president/i.test(m.role) && !/vice/i.test(m.role)) ?? current[0];
	const rest = current.filter((m) => m !== featured);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			title: "Leadership",
			lede: "Meet the present Executive Committee and look back at the leaders who built PUSAB.",
			crumbs: [{
				label: "Home",
				to: "/"
			}, { label: "Leadership" }],
			image: hero_leadership_default,
			imageAlt: "PUSAB executive committee"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "pb-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 flex items-end justify-between gap-6 border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label mb-2",
						style: { color: "var(--color-accent-2)" },
						children: "Governance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl md:text-4xl font-bold tracking-tight",
						children: "Current Executive Committee"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: ["Session · ", (/* @__PURE__ */ new Date()).getFullYear()]
					})]
				}), members === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "md:col-span-2 md:row-span-2 rounded-3xl border border-border shimmer" }), [
						0,
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "rounded-2xl border border-border shimmer" }, i))]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 20
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						viewport: {
							once: true,
							margin: "-60px"
						},
						transition: { duration: .5 },
						className: "md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl border border-[color-mix(in_oklab,var(--color-accent-1)_25%,transparent)] bg-[linear-gradient(135deg,var(--color-surface-2),var(--color-surface))] p-8 flex flex-col justify-end min-h-[400px] hover:border-[color-mix(in_oklab,var(--color-accent-1)_55%,transparent)] transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,color-mix(in_oklab,var(--color-accent-1)_40%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklab,var(--color-accent-2)_35%,transparent),transparent_55%)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-6 left-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 backdrop-blur px-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, {
									size: 12,
									className: "text-[var(--color-accent-1)]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-[0.2em] text-foreground/85",
									children: featured ? "President" : "Presidential Office"
								})]
							}),
							featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-20 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberPortrait, {
										m: featured,
										size: "lg"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-1 rounded-full bg-[var(--color-accent-1)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-tight",
											children: featured.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[var(--color-accent-1)] text-sm font-semibold uppercase tracking-[0.18em]",
											children: featured.role
										}),
										featured.university && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-foreground/60 text-sm",
											children: featured.university
										})
									] })
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-20 space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-1 rounded-full bg-[var(--color-accent-1)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-3xl font-bold text-foreground/30",
										children: "Presidential Office"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-foreground/45 italic max-w-md",
										children: "No current members on record yet. Nominations for the upcoming term will be announced shortly."
									})
								]
							})
						]
					}), (rest.length > 0 ? rest.slice(0, 4).map((m, i) => ({
						kind: "member",
						m,
						i
					})) : PLACEHOLDER_ROLES.map((role, i) => ({
						kind: "placeholder",
						role,
						i
					}))).map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
							delay: .06 * (slot.i + 1)
						},
						className: "rounded-2xl border border-border bg-[color-mix(in_oklab,var(--color-surface)_92%,transparent)] backdrop-blur-sm p-6 flex flex-col justify-between gap-3 hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] transition-colors",
						children: slot.kind === "member" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-1)]",
							children: slot.m.role
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberPortrait, {
								m: slot.m,
								size: "sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display font-semibold truncate",
									children: slot.m.name
								}), slot.m.university && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground truncate",
									children: slot.m.university
								})]
							})]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-1)]",
								children: slot.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-2/3 bg-white/10 rounded animate-pulse" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-1/2 bg-white/5 rounded" })
						] })
					}, slot.kind === "member" ? slot.m.id : slot.role))]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label mb-2",
						style: { color: "var(--color-accent-2)" },
						children: "Legacy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl md:text-4xl font-bold tracking-tight",
						children: "Through the years"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--color-accent-1)] via-border to-transparent" }), years.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative pl-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-[1px] top-1.5 w-4 h-4 rounded-full border-4 border-background bg-[var(--color-accent-1)] shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent-1)_45%,transparent)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl md:text-2xl font-bold block",
								children: "Archive being curated"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 md:p-8 rounded-2xl bg-[color-mix(in_oklab,var(--color-surface)_60%,transparent)] border border-dashed border-border flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									size: 16,
									className: "text-[var(--color-accent-1)] shrink-0"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-foreground/60",
									children: "Past EC archives will appear here as historical records are digitized and verified."
								})]
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-12 pl-10",
						children: years.map((year, yi) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
								delay: yi * .05
							},
							className: "relative group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-[37px] top-2 w-4 h-4 rounded-full border-4 border-background bg-[var(--color-accent-1)] shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] transition-transform group-hover:scale-125" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-2xl md:text-3xl font-extrabold tracking-tight",
										children: year
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
										children: [byYear[Number(year)].length, " members"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-2xl border border-border bg-[var(--color-surface)] p-5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
										children: byYear[Number(year)].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberPortrait, {
												m,
												size: "sm"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-medium truncate",
													children: m.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-muted-foreground text-xs truncate",
													children: m.role
												})]
											})]
										}, m.id))
									})
								})]
							})]
						}, year))
					})]
				})]
			})
		})
	] });
}
//#endregion
export { LeadershipPage as component };
