import { o as __toESM } from "../_runtime.mjs";
import { i as SITE } from "./site-content-C5LuCSvL.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion, o as AnimatePresence } from "../_libs/framer-motion.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ChevronLeft, E as ChevronRight, N as ArrowUpRight, S as Facebook, T as Clock, h as Mail, k as Check, m as MapPin, u as Phone, w as Copy } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-Cxb5cBlI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as GradientButton } from "./GradientButton-BM84sC4q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-Dvomc4hC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var contact_hero_1_default = "/assets/contact-hero-1-BqIBphWK.jpg";
var contact_hero_2_default = "/assets/contact-hero-2-CsZB5gsx.jpg";
var contact_hero_3_default = "/assets/contact-hero-3-BmNjsl_E.jpg";
function Field({ label, type = "text", value, onChange, textarea }) {
	const hasValue = value.length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "relative block",
		children: [textarea ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			rows: 5,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "peer w-full bg-transparent outline-none px-4 pt-6 pb-2 text-sm border border-border rounded-xl focus:border-[var(--color-accent-1)] transition-colors resize-none"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "peer w-full bg-transparent outline-none px-4 pt-6 pb-2 text-sm border border-border rounded-xl focus:border-[var(--color-accent-1)] transition-colors"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute left-4 transition-all duration-200 " + (hasValue ? "top-2 text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent-1)]" : "top-4 text-sm text-muted-foreground peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-[var(--color-accent-1)]"),
			children: label
		})]
	});
}
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSlider, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactBody, {})] });
}
var HERO_SLIDES = [
	{
		img: contact_hero_1_default,
		kicker: "Get in touch",
		title: "Start a conversation",
		caption: "Questions, partnerships and scholarship inquiries are always welcome."
	},
	{
		img: contact_hero_2_default,
		kicker: "From Bishwambarpur",
		title: "Rooted in service",
		caption: "A student-led organization shaped by community and commitment."
	},
	{
		img: contact_hero_3_default,
		kicker: "We respond promptly",
		title: "A reply within 48 hours",
		caption: "Every message is reviewed by a member of the team."
	}
];
function HeroSlider() {
	const [i, setI] = (0, import_react.useState)(0);
	const n = HERO_SLIDES.length;
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setI((v) => (v + 1) % n), 6e3);
		return () => clearInterval(id);
	}, [n]);
	const go = (next) => setI((next % n + n) % n);
	const slide = HERO_SLIDES[i];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative h-[78vh] min-h-[560px] max-h-[820px] w-full overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "sync",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						scale: 1.06
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					exit: { opacity: 0 },
					transition: {
						opacity: {
							duration: .9,
							ease: "easeOut"
						},
						scale: {
							duration: 7,
							ease: "linear"
						}
					},
					className: "absolute inset-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: slide.img,
							alt: "",
							className: "w-full h-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" })
					]
				}, i)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-32 md:top-36 left-0 right-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container-page",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "hover:text-foreground",
								children: "Home"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 12 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: "Contact"
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-end pb-20 md:pb-24 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "container-page",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 28
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: -16
							},
							transition: {
								duration: .6,
								ease: "easeOut"
							},
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-label mb-4 text-[var(--color-accent-1)]",
									children: slide.kicker
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.05]",
									children: slide.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 text-base md:text-lg text-muted-foreground max-w-xl",
									children: slide.caption
								})
							]
						}, i)
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-6 md:bottom-8 right-0 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page flex items-center justify-end gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5",
							children: HERO_SLIDES.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => go(idx),
								"aria-label": `Slide ${idx + 1}`,
								className: `h-1 transition-all rounded-full ${idx === i ? "w-10 bg-[var(--color-accent-1)]" : "w-5 bg-border hover:bg-muted-foreground"}`
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-mono text-muted-foreground tabular-nums",
							children: [
								String(i + 1).padStart(2, "0"),
								" / ",
								String(n).padStart(2, "0")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 ml-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => go(i - 1),
								"aria-label": "Previous",
								className: "h-9 w-9 rounded-full border border-border bg-background/60 backdrop-blur hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] transition-colors flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { size: 16 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => go(i + 1),
								"aria-label": "Next",
								className: "h-9 w-9 rounded-full border border-border bg-background/60 backdrop-blur hover:border-[var(--color-accent-1)] hover:text-[var(--color-accent-1)] transition-colors flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 16 })
							})]
						})
					]
				})
			})
		]
	});
}
function ContactBody() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const COORDS = {
		lat: 25.1639,
		lng: 91.2533
	};
	function copyValue(key, value) {
		navigator.clipboard?.writeText(value);
		setCopied(key);
		setTimeout(() => setCopied((c) => c === key ? null : c), 1600);
	}
	async function submit(e) {
		e.preventDefault();
		if (busy) return;
		setBusy(true);
		const { error } = await supabase.from("contact_submissions").insert({
			name,
			email,
			subject: subject || null,
			message
		});
		setBusy(false);
		if (error) toast.error("Couldn't send your message. Please check the fields and try again.");
		else {
			toast.success("Message sent — we'll get back to you soon.");
			setName("");
			setEmail("");
			setSubject("");
			setMessage("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pb-16 md:pb-24",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-label mb-2 text-[var(--color-accent-1)]",
					children: "Write to us"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-5xl font-display tracking-tight",
					children: "Share your inquiry"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
					onSubmit: submit,
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
						margin: "-80px"
					},
					transition: {
						duration: .5,
						ease: "easeOut"
					},
					className: "md:col-span-8 rounded-3xl border border-border bg-[var(--color-surface)] p-6 md:p-10 space-y-4 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Name",
								value: name,
								onChange: setName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								type: "email",
								value: email,
								onChange: setEmail
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Subject",
							value: subject,
							onChange: setSubject
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Message",
							value: message,
							onChange: setMessage,
							textarea: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 flex items-center justify-between gap-4 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "We aim to respond within 48 hours."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradientButton, {
								type: "submit",
								children: busy ? "Sending…" : "Send Message"
							})]
						})
					]
				}), [
					{
						key: "email",
						icon: Mail,
						label: "Email",
						value: SITE.email,
						href: `mailto:${SITE.email}`
					},
					{
						key: "phone",
						icon: Phone,
						label: "Phone",
						value: SITE.phone,
						href: `tel:${SITE.phone}`
					},
					{
						key: "social",
						icon: Facebook,
						label: "Facebook",
						value: "facebook.com/PUSAB",
						href: SITE.facebook
					},
					{
						key: "hours",
						icon: Clock,
						label: "Response time",
						value: "Within 48 hours",
						href: null
					}
				].map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 14
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
						duration: .45,
						delay: .06 * (idx + 1),
						ease: "easeOut"
					},
					className: "md:col-span-4 group rounded-3xl border border-border bg-[var(--color-surface)] p-6 hover:border-[var(--color-accent-1)]/40 transition-colors shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-xl bg-[var(--color-accent-1)]/10 border border-[var(--color-accent-1)]/20 flex items-center justify-center text-[var(--color-accent-1)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { size: 18 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-label mt-5",
							children: c.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between gap-3",
							children: [c.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: c.href,
								target: c.href.startsWith("http") ? "_blank" : void 0,
								rel: "noreferrer",
								className: "text-sm md:text-base font-medium truncate hover:text-[var(--color-accent-1)] transition-colors",
								children: c.value
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm md:text-base font-medium truncate",
								children: c.value
							}), c.href && c.key !== "hours" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: (e) => {
									e.preventDefault();
									copyValue(c.key, c.value);
								},
								className: "shrink-0 text-muted-foreground hover:text-[var(--color-accent-1)] transition-colors",
								"aria-label": `Copy ${c.label}`,
								children: copied === c.key ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 14 })
							})]
						})
					]
				}, c.key))]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pb-28 md:pb-32",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-end justify-between gap-6 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-label mb-2 text-[var(--color-accent-2)]",
					children: "Visit us"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl md:text-5xl font-display tracking-tight",
					children: "Bishwambarpur, Sunamganj"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent-1)] hover:underline",
					children: ["Get directions ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { size: 14 })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
					margin: "-80px"
				},
				transition: {
					duration: .6,
					ease: "easeOut"
				},
				className: "rounded-3xl border border-border overflow-hidden bg-[var(--color-surface)] shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-[1fr_320px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: "PUSAB — Bishwambarpur, Sunamganj",
							src: `https://www.google.com/maps?q=${COORDS.lat},${COORDS.lng}&z=13&output=embed`,
							className: "w-full h-[420px] md:h-[520px] grayscale-[0.4]",
							loading: "lazy",
							referrerPolicy: "no-referrer-when-downgrade"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t lg:border-t-0 lg:border-l border-border p-6 md:p-8 space-y-6 bg-background/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-label mb-2",
									children: "Our location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-display leading-tight",
									children: "PUSAB · Bishwambarpur"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-2",
									children: "Govt. Digendra Barman College vicinity, Bishwambarpur Upazila, Sunamganj — Sylhet Division, Bangladesh."
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										size: 16,
										className: "mt-0.5 text-[var(--color-accent-1)] shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sylhet Division, Bangladesh" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										size: 16,
										className: "mt-0.5 text-[var(--color-accent-1)] shrink-0"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Local time · UTC +06:00" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-border space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `https://www.google.com/maps/search/?api=1&query=${COORDS.lat},${COORDS.lng}`,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center justify-between text-sm group hover:text-[var(--color-accent-1)] transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open in Google Maps" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
										size: 14,
										className: "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `https://www.google.com/maps/dir/?api=1&destination=${COORDS.lat},${COORDS.lng}`,
									target: "_blank",
									rel: "noreferrer",
									className: "flex items-center justify-between text-sm group hover:text-[var(--color-accent-1)] transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Get directions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
										size: 14,
										className: "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
									})]
								})]
							})
						]
					})]
				})
			})]
		})
	})] });
}
//#endregion
export { ContactPage as component };
