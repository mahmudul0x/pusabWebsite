import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AnimatedHeading-CqwUtDbh.js
var import_jsx_runtime = require_jsx_runtime();
function AnimatedHeading({ children, as = "h1", className = "", delay = 0 }) {
	const words = children.split(" ");
	const Comp = motion[as];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		initial: "hidden",
		animate: "show",
		variants: {
			hidden: {},
			show: { transition: {
				staggerChildren: .06,
				delayChildren: delay
			} }
		},
		className,
		children: words.map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-block overflow-hidden align-bottom mr-[0.25em]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				className: "inline-block",
				variants: {
					hidden: {
						y: "110%",
						opacity: 0,
						filter: "blur(8px)"
					},
					show: {
						y: 0,
						opacity: 1,
						filter: "blur(0px)",
						transition: {
							duration: .7,
							ease: [
								.16,
								1,
								.3,
								1
							]
						}
					}
				},
				children: word
			})
		}, i))
	});
}
//#endregion
export { AnimatedHeading as t };
