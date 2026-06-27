import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/site-content";
import logoPusab from "@/assets/logo-pusab.png";

export function FloatingNavbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Close any open dropdown on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    const close = () => setOpenMenu(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          paddingInline: scrolled ? 16 : 24,
          paddingTop: scrolled ? 14 : 22,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[9999] flex justify-center pointer-events-none"
      >
        <motion.nav
          layout
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={
            "pointer-events-auto flex items-center gap-2 w-full " +
            (scrolled
              ? "max-w-6xl rounded-full glass shadow-[0_10px_40px_-15px_rgba(79,110,247,0.35)]"
              : "max-w-7xl rounded-2xl glass")
          }
          style={{
            paddingInline: scrolled ? 12 : 18,
            paddingBlock: scrolled ? 8 : 12,
          }}
        >
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 pr-3">
            <img
              src={logoPusab}
              alt="PUSAB logo"
              className="h-12 w-12 object-contain transition-transform duration-700 group-hover:rotate-[360deg]"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-[18px] font-bold tracking-[0.02em] text-foreground">
                PUSAB
              </span>
              <span className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground mt-0.5">
                est. 2014
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1 mx-auto">
            {NAV_LINKS.map((link) => {
              const children = "children" in link ? link.children : undefined;
              const childActive = children?.some((c) => pathname.startsWith(c.to));
              const isActive =
                (link.to === "/" ? pathname === "/" : pathname.startsWith(link.to)) ||
                Boolean(childActive);
              const pillClasses =
                "relative inline-flex cursor-pointer items-center gap-1 px-3.5 py-1.5 text-sm font-semibold tracking-[0.02em] text-foreground/75 hover:text-foreground transition-colors";
              const pill = isActive && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[var(--color-surface-2)] border border-border"
                />
              );

              if (!children) {
                return (
                  <li key={link.to}>
                    <Link to={link.to} className={pillClasses}>
                      {pill}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </li>
                );
              }

              const isOpen = openMenu === link.to;
              return (
                <li
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(link.to)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(isOpen ? null : link.to);
                    }}
                    className={pillClasses}
                  >
                    {pill}
                    <span className="relative z-10">{link.label}</span>
                    <ChevronDown
                      size={13}
                      className={
                        "relative z-10 opacity-60 transition-transform duration-200 " +
                        (isOpen ? "rotate-180" : "")
                      }
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute left-1/2 top-full z-20 -translate-x-1/2 pt-3"
                      >
                        <ul className="min-w-[220px] rounded-2xl border border-border bg-[var(--color-surface)] p-1.5 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.45)]">
                          {children.map((c) => {
                            const cActive = pathname.startsWith(c.to);
                            return (
                              <li key={c.to + c.label}>
                                <Link
                                  to={c.to}
                                  onClick={() => setOpenMenu(null)}
                                  className={
                                    "block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors " +
                                    (cActive
                                      ? "bg-[var(--color-surface-2)] text-foreground"
                                      : "text-foreground/75 hover:bg-[var(--color-surface-2)] hover:text-foreground")
                                  }
                                >
                                  {c.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="ml-auto hidden lg:flex items-center gap-2">
            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_45%,transparent)] hover:text-foreground"
            >
              <Heart size={14} className="text-[var(--color-accent-1)]" /> Support
            </Link>
            <Link to="/contact" className="formal-cta group">
              <span>Join PUSAB</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-auto lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] text-foreground"
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>
      </motion.header>

      {/* CTA styles */}
      <style>{`
        .formal-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 10px 18px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #ffffff;
          background: linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2));
          box-shadow: 0 10px 24px -14px color-mix(in srgb, var(--color-accent-1) 60%, transparent);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .formal-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px -14px color-mix(in srgb, var(--color-accent-2) 60%, transparent);
        }
      `}</style>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] lg:hidden bg-background/95 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -left-20 h-[60vh] w-[60vh] rounded-full bg-[var(--color-accent-1)] opacity-10 blur-[120px] animate-blob" />
              <div className="absolute -bottom-20 -right-20 h-[60vh] w-[60vh] rounded-full bg-[var(--color-accent-2)] opacity-10 blur-[120px] animate-blob" />
            </div>
            <div className="relative h-full flex flex-col justify-center px-8 pt-24">
              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                className="space-y-3"
              >
                {NAV_LINKS.map((link) => {
                  const children = "children" in link ? link.children : undefined;
                  return (
                    <motion.li
                      key={link.to}
                      variants={{
                        hidden: { opacity: 0, y: 28 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                    >
                      <Link
                        to={link.to}
                        className="group flex items-center gap-3 text-[32px] font-display font-bold tracking-tight"
                      >
                        <span className="h-px w-6 bg-foreground/40 transition-all duration-300 group-hover:w-14 group-hover:bg-[var(--color-accent-1)]" />
                        <span>{link.label}</span>
                      </Link>
                      {children && (
                        <ul className="mt-2 ml-9 space-y-1.5">
                          {children.map((c) => (
                            <li key={c.to + c.label}>
                              <Link
                                to={c.to}
                                className="text-lg font-medium text-foreground/70 hover:text-foreground transition-colors"
                              >
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold"
                >
                  <Heart size={15} className="text-[var(--color-accent-1)]" /> Support
                </Link>
                <Link to="/contact" className="formal-cta">
                  <span>Join PUSAB</span>
                </Link>
              </div>
              <div className="mt-8 text-xs text-muted-foreground space-y-1">
                <p>{SITE.email}</p>
                <p>{SITE.phone}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
