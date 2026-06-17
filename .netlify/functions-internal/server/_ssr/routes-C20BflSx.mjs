import { o as __toESM } from "../_runtime.mjs";
import { a as STATS, i as SITE } from "./site-content-C5LuCSvL.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion, i as useMotionValue, n as animate, o as AnimatePresence, r as useTransform, t as useInView } from "../_libs/framer-motion.mjs";
import { t as AnimatedHeading } from "./AnimatedHeading-CqwUtDbh.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as Award, O as ChevronDown, P as ArrowRight, b as GraduationCap, j as BookOpen, l as Quote, o as Stethoscope, p as Megaphone, s as Sparkles, y as HeartHandshake } from "../_libs/lucide-react.mjs";
import { t as GlowCard } from "./GlowCard-MFXPkW7K.mjs";
import { t as GradientButton } from "./GradientButton-BM84sC4q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C20BflSx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StatCounter({ value, suffix = "", raw = false }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		margin: "-80px"
	});
	const mv = useMotionValue(0);
	const rounded = useTransform(mv, (v) => raw ? Math.round(v).toString() : Math.round(v).toLocaleString());
	(0, import_react.useEffect)(() => {
		if (!inView) return;
		return animate(mv, value, {
			duration: 1.6,
			ease: [
				.16,
				1,
				.3,
				1
			]
		}).stop;
	}, [
		inView,
		value,
		mv
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		className: "font-display text-5xl md:text-6xl font-bold tracking-tight",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, { children: rounded }), suffix && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "gradient-text",
			children: suffix
		})]
	});
}
var HERO_SLIDES = [
	"/assets/home-hero-1-Dhjid7dA.jpg",
	"/assets/home-hero-2-CeFAsPtn.jpg",
	"/assets/home-hero-3-BBftfHLI.jpg"
];
var ACTIVITIES = [
	{
		Icon: HeartHandshake,
		title: "Student Unity & Cooperation",
		desc: "Building lifelong bonds between students from across public universities and the region."
	},
	{
		Icon: Award,
		title: "Achievement Recognition",
		desc: "Honoring those who carry Bishwambarpur's name to the top of national merit lists."
	},
	{
		Icon: Megaphone,
		title: "Educational Campaigns",
		desc: "Awareness drives, study circles and career talks across schools of the upazila."
	},
	{
		Icon: GraduationCap,
		title: "Admission Support",
		desc: "Mentoring aspirants through HSC, admission tests and university application."
	},
	{
		Icon: BookOpen,
		title: "PUSAB Scholarship",
		desc: "Need-based financial aid to deserving students from underserved families."
	},
	{
		Icon: Stethoscope,
		title: "Medical Camps & Humanity",
		desc: "Free health camps, disaster relief and humanitarian aid for the community."
	}
];
function MagazineTilt() {
	const ref = (0, import_react.useRef)(null);
	const [r, setR] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		onMouseMove: (e) => {
			const el = ref.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const px = (e.clientX - rect.left) / rect.width - .5;
			setR({
				x: -((e.clientY - rect.top) / rect.height - .5) * 16,
				y: px * 16
			});
		},
		onMouseLeave: () => setR({
			x: 0,
			y: 0
		}),
		style: { perspective: "1200px" },
		className: "relative aspect-[3/4] w-full max-w-sm mx-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			animate: {
				rotateX: r.x,
				rotateY: r.y
			},
			transition: {
				type: "spring",
				stiffness: 120,
				damping: 14
			},
			style: { transformStyle: "preserve-3d" },
			className: "absolute inset-0 rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(124,58,237,0.45)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(135deg,#0F0F1A,#16162A)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,110,247,0.4),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(124,58,237,0.4),transparent_55%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-full flex flex-col justify-between p-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-[0.25em] text-white/70",
								children: "Vol · Annual"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-[0.25em] text-white/70",
								children: "PUSAB"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-6xl font-extrabold tracking-tighter gradient-text",
							children: "SAYOR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-white/70 max-w-[14rem]",
							children: "The annual magazine of PUSAB · Bishwambarpur"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.2em] text-white/50",
							children: "Education · Culture · Science · Heritage"
						})
					]
				})
			]
		})
	});
}
function Index() {
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.add("dark");
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-h-[100dvh] flex items-center overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSlideshow, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-slate-950/15 via-slate-900/10 to-background/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page relative z-10 pt-44 pb-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 14
							},
							animate: {
								opacity: 1,
								y: 0
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
							className: "mx-auto w-fit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "formal-pill flex items-center gap-2 text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
									size: 13,
									className: "text-[var(--color-accent-1)]"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Student-led · Non-political · Community-focused" })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 text-center mx-auto max-w-5xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedHeading, {
									as: "h1",
									className: "font-display text-[44px] leading-[1.0] sm:text-6xl md:text-7xl lg:text-[78px] font-extrabold tracking-[-0.04em] text-foreground",
									children: "Building a stronger"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
									initial: {
										opacity: 0,
										y: 20,
										filter: "blur(8px)"
									},
									animate: {
										opacity: 1,
										y: 0,
										filter: "blur(0px)"
									},
									transition: {
										delay: .55,
										duration: .8,
										ease: [
											.16,
											1,
											.3,
											1
										]
									},
									className: "font-display text-[44px] leading-[1.0] sm:text-6xl md:text-7xl lg:text-[78px] font-extrabold tracking-[-0.04em] gradient-text",
									children: "future for Bishwambarpur."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.p, {
									initial: {
										opacity: 0,
										y: 10
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										delay: .9,
										duration: .7
									},
									className: "mt-8 mx-auto max-w-2xl text-base md:text-lg text-foreground/90 leading-relaxed",
									children: [
										"PUSAB brings together ",
										SITE.members,
										" students from public universities, medical and engineering colleges to support learning, leadership, and community development in Bishwambarpur."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 10
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										delay: 1.05,
										duration: .7
									},
									className: "mt-10 flex flex-wrap items-center justify-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientButton, {
										to: "/programs",
										children: "Explore Our Programs"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GradientButton, {
										to: "/about",
										variant: "ghost",
										children: [
											"About PUSAB",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
												size: 16,
												className: "transition-transform group-hover:translate-x-1"
											})
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: { delay: 1.4 },
							className: "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
								className: "animate-float-bounce text-foreground/60",
								size: 18
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 w-px bg-gradient-to-b from-foreground/40 to-transparent" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
          .formal-pill {
            padding: 8px 14px;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 24px rgba(15, 23, 42, 0.16);
            backdrop-filter: blur(8px);
          }
        ` })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-[var(--color-surface-2)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page grid grid-cols-2 md:grid-cols-4 divide-x divide-border",
				children: STATS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-6 py-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCounter, {
						value: s.value,
						suffix: s.suffix,
						raw: s.raw
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-label",
						children: s.label
					})]
				}, i))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-28 md:py-32",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-6 flex-wrap mb-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label mb-3",
						children: "Our areas of work"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-4xl md:text-5xl font-bold tracking-tight max-w-xl",
						children: ["Programs That Create ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-text",
							children: "Real Impact"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/programs",
						className: "group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
						children: [
							"View all programs",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								size: 14,
								className: "transition-transform group-hover:translate-x-1"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5",
					children: ACTIVITIES.map(({ Icon, title, desc }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlowCard, {
						delay: i * .06,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[linear-gradient(135deg,var(--color-accent-1),var(--color-accent-2))] text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 20 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-6 font-display text-xl font-semibold",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground leading-relaxed",
								children: desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex items-center text-sm text-[var(--color-accent-1)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all",
								children: ["Learn more ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									size: 14,
									className: "ml-1"
								})]
							})
						]
					}, title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "py-28 md:py-32 relative overflow-hidden bg-[var(--color-surface-2)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-32 top-1/3 h-[40vh] w-[40vh] rounded-full bg-[var(--color-accent-2)] opacity-10 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page relative grid lg:grid-cols-[1.4fr_1fr] gap-16 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-label mb-3",
						children: "Annual Magazine"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-4xl md:text-6xl font-bold tracking-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "gradient-text",
							children: "SAYOR"
						}), " — voice of a generation."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed",
						children: "SAYOR is PUSAB's flagship annual magazine, bringing together voices from education, culture, science, heritage, literature and student life across Bishwambarpur."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/sayor",
						className: "mt-8 inline-flex items-center gap-2 text-[var(--color-accent-1)] font-semibold hover:gap-3 transition-all",
						children: ["Read more ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 16 })]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MagazineTilt, {})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-28 md:py-32 relative bg-[var(--color-surface)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page relative text-center max-w-4xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, {
						className: "absolute -top-6 left-1/2 -translate-x-1/2 text-[var(--color-surface-2)]",
						size: 180,
						strokeWidth: 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
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
							margin: "-100px"
						},
						transition: {
							duration: .7,
							ease: [
								.16,
								1,
								.3,
								1
							]
						},
						className: "relative font-display text-3xl md:text-5xl font-semibold leading-tight tracking-tight",
						children: "\"Our mission is to support every student who dares to dream beyond Bishwambarpur.\""
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-label",
						children: "— PUSAB Executive Committee"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-24 md:py-28 bg-[var(--color-surface-2)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-page",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] p-12 md:p-16 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,110,247,0.18),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(124,58,237,0.14),transparent_50%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-3xl md:text-5xl font-bold tracking-tight",
								children: "Join the Movement"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-muted-foreground max-w-xl mx-auto",
								children: "Whether you are a current student, alumnus, or supporter, your involvement helps build a stronger future for Bishwambarpur."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap items-center justify-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientButton, {
									to: "/contact",
									children: "Contact Us"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientButton, {
									to: "/leadership",
									variant: "ghost",
									children: "Meet the Executive Committee"
								})]
							})
						]
					})]
				})
			})
		})
	] });
}
function HeroSlideshow() {
	const [i, setI] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 6e3);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
				src: HERO_SLIDES[i],
				alt: "",
				initial: {
					opacity: 0,
					scale: 1.08
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: { opacity: 0 },
				transition: {
					opacity: {
						duration: 1.1,
						ease: "easeOut"
					},
					scale: {
						duration: 7,
						ease: "linear"
					}
				},
				className: "absolute inset-0 w-full h-full object-cover"
			}, i) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-background/25 via-background/40 to-background/85" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,110,247,0.10),transparent_50%),radial-gradient(circle_at_70%_75%,rgba(124,58,237,0.08),transparent_50%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5",
				children: HERO_SLIDES.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setI(idx),
					"aria-label": `Slide ${idx + 1}`,
					className: `h-1 rounded-full transition-all ${idx === i ? "w-10 bg-[var(--color-accent-1)]" : "w-5 bg-foreground/30 hover:bg-foreground/50"}`
				}, idx))
			})
		]
	});
}
//#endregion
export { Index as component };
