export function MeshGradientBg({ className = "" }: { className?: string }) {
  return (
    <div
      className={"pointer-events-none absolute inset-0 overflow-hidden " + className}
      aria-hidden
    >
      <div className="absolute -top-40 -left-32 h-[70vh] w-[70vh] rounded-full bg-[var(--color-accent-1)] opacity-[0.18] blur-[120px] animate-blob" />
      <div
        className="absolute top-1/3 -right-40 h-[70vh] w-[70vh] rounded-full bg-[var(--color-accent-2)] opacity-[0.14] blur-[120px] animate-blob"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute -bottom-32 left-1/4 h-[55vh] w-[55vh] rounded-full bg-[var(--color-accent-3)] opacity-[0.10] blur-[120px] animate-blob"
        style={{ animationDelay: "-12s" }}
      />
      {/* subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
