import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface Props {
  to?: string;
  href?: string;
  variant?: "solid" | "ghost";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function GradientButton({ to, href, variant = "solid", children, className = "", onClick, type }: Props) {
  const base =
    "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 will-change-transform";
  const solid =
    "text-white bg-[linear-gradient(120deg,var(--color-accent-1),var(--color-accent-2))] hover:scale-[1.03] hover:shadow-[0_10px_40px_-10px_rgba(124,58,237,0.6)]";
  const ghost =
    "border border-white/15 text-foreground hover:bg-white/[0.05] hover:border-white/30";
  const cls = `${base} ${variant === "solid" ? solid : ghost} ${className}`;

  if (to) return <Link to={to} className={cls}>{children}</Link>;
  if (href) return <a href={href} className={cls}>{children}</a>;
  return <button onClick={onClick} type={type} className={cls}>{children}</button>;
}