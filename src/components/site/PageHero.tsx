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
  return (
    <section className="relative pt-40 pb-24 overflow-hidden min-h-[68vh] flex items-end">
      {image ? (
        <>
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/40 to-background/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(79,110,247,0.12),transparent_55%),radial-gradient(circle_at_75%_75%,rgba(124,58,237,0.12),transparent_55%)]" />
        </>
      ) : (
        <MeshGradientBg />
      )}
      <div className="container-page relative">
        {crumbs && (
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.to ? (
                  <Link to={c.to} className="hover:text-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < crumbs.length - 1 && <ChevronRight size={12} />}
              </span>
            ))}
          </nav>
        )}
        <AnimatedHeading
          as="h1"
          className="font-display text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl"
        >
          {title}
        </AnimatedHeading>
        {lede && (
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">{lede}</p>
        )}
      </div>
    </section>
  );
}
