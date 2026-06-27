import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadImage, isUploadConfigured, optimizeImage } from "@/lib/api";

export function ImageUpload({
  value,
  onChange,
  folder = "pusab",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        {/* Compact thumbnail / dropzone */}
        <button
          type="button"
          onClick={() => !busy && inputRef.current?.click()}
          className={
            "relative grid h-[68px] w-[92px] shrink-0 place-items-center overflow-hidden rounded-lg border bg-[var(--color-background)] transition-colors " +
            (value
              ? "border-border"
              : "border-dashed border-border hover:border-[color-mix(in_oklab,var(--color-accent-1)_55%,transparent)]")
          }
          aria-label="Upload image"
        >
          {value ? (
            <img
              src={optimizeImage(value, 240)}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <ImagePlus size={18} className="text-muted-foreground" />
          )}
          {busy && (
            <div className="absolute inset-0 grid place-items-center bg-black/45 text-white">
              <Loader2 className="animate-spin" size={16} />
            </div>
          )}
        </button>

        {/* Actions + helper */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-[color-mix(in_oklab,var(--color-accent-1)_50%,transparent)] hover:text-[var(--color-accent-1)]"
            >
              {busy ? "Uploading…" : value ? "Replace" : "Upload image"}
            </button>
            {value && !busy && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-medium text-muted-foreground hover:text-red-500"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            PNG or JPG · stored on Cloudinary
          </p>
          {!isUploadConfigured() && (
            <p className="mt-0.5 text-[11px] text-amber-600">Cloudinary not configured.</p>
          )}
          {error && <p className="mt-0.5 text-[11px] text-red-500">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
