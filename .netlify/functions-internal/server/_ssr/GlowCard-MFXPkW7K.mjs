import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GlowCard-MFXPkW7K.js
var import_jsx_runtime = require_jsx_runtime();
function GlowCard({ children, className = "", delay = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
			margin: "-80px"
		},
		transition: {
			duration: .6,
			delay,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		whileHover: { y: -4 },
		className: "group relative rounded-2xl border border-border bg-[var(--color-surface)] p-8 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--color-accent-1)_60%,transparent)] hover:shadow-[0_0_60px_-10px_rgba(79,110,247,0.30)] " + className,
		children
	});
}
//#endregion
export { GlowCard as t };
