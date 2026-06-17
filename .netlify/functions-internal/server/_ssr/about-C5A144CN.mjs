import { i as SITE, n as OBJECTIVES } from "./site-content-C5LuCSvL.mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
import { t as PageHero } from "./PageHero-BYH4IfxF.mjs";
import { t as GlowCard } from "./GlowCard-MFXPkW7K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-C5A144CN.js
var import_jsx_runtime = require_jsx_runtime();
var hero_about_default = "/assets/hero-about-tQI5PyWi.jpg";
var about_mission_default = "/assets/about-mission-DbAOWm5p.jpg";
function AboutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			title: "About PUSAB",
			lede: "Public University Students' Association of Bishwambarpur is a non-political, non-profit student body representing students from public universities, medical and engineering colleges.",
			crumbs: [{
				label: "Home",
				to: "/"
			}, { label: "About" }],
			image: hero_about_default,
			imageAlt: "PUSAB members gathered in Bishwambarpur"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page grid lg:grid-cols-2 gap-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl border border-border aspect-[4/3] shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: about_mission_default,
						alt: "PUSAB students studying together",
						loading: "lazy",
						className: "absolute inset-0 w-full h-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-tr from-background/25 via-transparent to-transparent" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 text-muted-foreground leading-relaxed",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-label",
							children: "At a glance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground",
							children: "A student-led organization rooted in service."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"PUSAB was founded on ",
							SITE.founded,
							" at ",
							SITE.foundedAt,
							". It is the first organization of its kind in Sunamganj district and brings together more than ",
							SITE.members,
							" ",
							"students from public universities, medical and engineering colleges across Bangladesh."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The association is non-political and non-profit. Its work centers on education, cooperation, scholarship support, humanitarian relief and youth leadership for the development of Bishwambarpur Upazila." })
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-10 md:p-14",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 w-1 bg-[var(--color-accent-3)] shadow-[0_0_40px_var(--color-accent-3)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-label mb-4",
							children: "Our mission"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display italic text-2xl md:text-3xl leading-snug max-w-4xl",
							children: "To build a stronger, more connected academic and social community for students from Bishwambarpur through cooperation, opportunity and service."
						})
					]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-24 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label mb-3",
						children: "Our aims"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mb-12",
						children: "Fourteen commitments that guide our work."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
						children: OBJECTIVES.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 24
							},
							whileInView: {
								opacity: 1,
								y: 0
							},
							viewport: {
								once: true,
								margin: "-60px"
							},
							transition: {
								duration: .5,
								delay: i % 6 * .06,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							className: "rounded-2xl border border-border bg-[var(--color-surface)] p-6 hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-xl font-bold text-muted-foreground",
										children: String(i + 1).padStart(2, "0")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[var(--color-accent-1)]" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-display text-lg font-semibold",
									children: o.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground leading-relaxed",
									children: o.desc
								})
							]
						}, o.title))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-24 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label mb-3",
						children: "Timeline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl md:text-5xl font-bold tracking-tight mb-16",
						children: "The journey so far."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent-1)] via-[var(--color-accent-2)] to-[var(--color-accent-3)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-14 md:space-y-20",
							children: [
								{
									date: SITE.founded,
									title: "Founding of PUSAB",
									desc: `Established at ${SITE.foundedAt} — the first organization of its kind in Sunamganj district.`
								},
								{
									date: "2016",
									title: "First scholarship drive",
									desc: "Launched merit & need-based stipends for HSC graduates from Bishwambarpur preparing for university admissions."
								},
								{
									date: "2018",
									title: "SAYOR — pre-admission coaching",
									desc: "Started the Students' Admission Yearly Orientation Round, mentoring hundreds of admission seekers each year."
								},
								{
									date: "2020",
									title: "Pandemic relief operations",
									desc: "Distributed food, medical aid and learning materials across the upazila during COVID-19 lockdowns."
								},
								{
									date: "2022",
									title: "Flood response in Sunamganj",
									desc: "Coordinated emergency relief, shelter support and rebuilding aid for flood-affected families."
								},
								{
									date: "2024",
									title: "300+ active members",
									desc: "Crossed 300 members across public universities, medical and engineering colleges nationwide."
								},
								{
									date: "2026",
									title: "Digital home of PUSAB",
									desc: "Launched the official PUSAB platform — programs, leadership, publicity and moments, all in one place."
								}
							].map((item, i) => {
								const left = i % 2 === 0;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.li, {
									initial: {
										opacity: 0,
										y: 28
									},
									whileInView: {
										opacity: 1,
										y: 0
									},
									viewport: {
										once: true,
										margin: "-80px"
									},
									transition: {
										duration: .6,
										ease: [
											.16,
											1,
											.3,
											1
										]
									},
									className: "relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-2 md:left-1/2 top-1.5 md:-translate-x-1/2 h-3 w-3 rounded-full bg-[var(--color-accent-1)] shadow-[0_0_20px_var(--color-accent-1)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: left ? "md:text-right md:pr-12" : "md:col-start-2 md:pl-12",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-label",
												children: item.date
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "mt-2 font-display text-2xl font-semibold",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-muted-foreground leading-relaxed",
												children: item.desc
											})
										]
									})]
								}, item.title);
							})
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-20 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlowCard, {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label mb-3",
						children: "Connect with PUSAB"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-2xl md:text-3xl font-bold",
						children: [
							SITE.email,
							" · ",
							SITE.phone
						]
					})]
				})
			})
		})
	] });
}
//#endregion
export { AboutPage as component };
