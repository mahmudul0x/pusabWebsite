// Direct, unsigned image upload to Cloudinary from the browser (industry
// standard). Returns the hosted secure URL, which we store in the database.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export function isUploadConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

export async function uploadImage(file: File, folder = "pusab"): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Image upload isn't configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.",
    );
  }
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.error?.message ?? "";
    } catch {
      /* ignore */
    }
    throw new Error(detail || "Image upload failed. Check your Cloudinary preset.");
  }
  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}

/**
 * Add Cloudinary on-the-fly optimization (auto format + quality, optional
 * resize) to a Cloudinary URL. No-ops for non-Cloudinary URLs, so it's safe
 * to wrap any image src.
 */
export function optimizeImage(url: string | null | undefined, width?: number): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url ?? "";
  }
  const t = ["f_auto", "q_auto", ...(width ? [`w_${width}`, "c_limit"] : [])].join(",");
  return url.replace("/upload/", `/upload/${t}/`);
}
