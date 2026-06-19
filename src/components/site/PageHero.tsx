import { AnimatedHeading } from "./AnimatedHeading";
import { MeshGradientBg } from "./MeshGradientBg";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

export function PageHero({
  title,
  lede,
  crumbs,
  image,
  imageAlt,
}: {
  title: string;
  lede?: string;
  crumbs?: Crumb[];
  image?: string;
  imageAlt?: string;
}) {
  const onImage = Boolean(image);
  return (
    <section className="relative pt-40 pb-20 md:pb-24 overflow-hidden min-h-[64vh] flex items-end">
      {image ? (
        <>
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Cinematic scrim so white type reads cleanly over any photo. */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/55 to-slate-950/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(124,58,237,0.20),transparent_55%)]" />
        </>
      ) : (
        <MeshGradientBg />
      )}
      <div
        className={
          "container-page relative z-10 " +
          (onImage ? "[text-shadow:0_2px_30px_rgba(2,6,23,0.5)]" : "")
        }
      >
        {crumbs && (
          <nav
            className={
              "mb-6 flex items-center gap-2 text-xs " +
              (onImage ? "text-white/70" : "text-muted-foreground")
            }
          >
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.to ? (
                  <Link to={c.to} className="transition-colors hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className={onImage ? "text-white" : "text-foreground"}>{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight size={12} className="opacity-60" />}
              </span>
            ))}
          </nav>
        )}

        {/* Accent kicker line for a more deliberate, editorial feel. */}
        <div className="mb-5 h-1 w-14 rounded-full bg-[linear-gradient(90deg,var(--color-accent-1),var(--color-accent-2))]" />

        <AnimatedHeading
          as="h1"
          className={
            "font-display text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.04] max-w-4xl " +
            (onImage ? "text-white" : "text-foreground")
          }
        >
          {title}
        </AnimatedHeading>
        {lede && (
          <p
            className={
              "mt-6 max-w-2xl text-base md:text-lg leading-relaxed " +
              (onImage ? "text-white/80" : "text-muted-foreground")
            }
          >
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
