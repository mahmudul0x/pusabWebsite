import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadImage, isUploadConfigured } from "@/lib/api";

/**
 * Pick many images at once and upload them all to Cloudinary. Reports each
 * finished URL as it lands (via onAdd) so rows appear progressively instead
 * of after the whole batch — a slow upload never blocks the others.
 */
export function MultiImageUpload({
  onAdd,
  folder = "pusab",
  disabled,
}: {
  onAdd: (urls: string[]) => void;
  folder?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(0);
  const [failed, setFailed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    setError(null);
    setFailed(0);
    setPending((n) => n + files.length);

    const results = await Promise.allSettled(files.map((file) => uploadImage(file, folder)));

    const urls: string[] = [];
    let bad = 0;
    let firstError: string | null = null;
    for (const r of results) {
      if (r.status === "fulfilled") {
        urls.push(r.value);
      } else {
        bad += 1;
        firstError ??= r.reason instanceof Error ? r.reason.message : "Upload failed";
      }
    }

    if (urls.length) onAdd(urls);
    setPending((n) => Math.max(0, n - files.length));
    if (bad) {
      setFailed(bad);
      setError(firstError);
    }
  }

  const busy = pending > 0;

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !busy && inputRef.current?.click()}
        className={
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-[var(--color-background)] px-4 py-7 text-center transition-colors " +
          (disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:border-[color-mix(in_oklab,var(--color-accent-1)_55%,transparent)]")
        }
      >
        {busy ? (
          <Loader2 className="animate-spin text-[var(--color-accent-1)]" size={20} />
        ) : (
          <ImagePlus size={20} className="text-muted-foreground" />
        )}
        <span className="text-sm font-semibold">
          {busy ? `Uploading ${pending} image${pending === 1 ? "" : "s"}…` : "Choose images"}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Select multiple files at once · PNG or JPG · stored on Cloudinary
        </span>
      </button>

      {!isUploadConfigured() && (
        <p className="mt-1.5 text-[11px] text-amber-600">Cloudinary not configured.</p>
      )}
      {error && (
        <p className="mt-1.5 text-[11px] text-red-500">
          {failed} upload{failed === 1 ? "" : "s"} failed — {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          // Reset so picking the same file again still fires a change event.
          e.target.value = "";
        }}
      />
    </div>
  );
}
