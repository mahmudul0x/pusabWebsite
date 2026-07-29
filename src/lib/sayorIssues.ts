// Shared SAYOR issue list — used by the /sayor archive page and the
// home page preview so both read the same 11 covers from one place.

const COVER_IMAGES = import.meta.glob<{ default: string }>(
  "../assets/sayor/*.{jpg,jpeg}",
  { eager: true },
);

function coverFor(id: number, extension: string): string {
  return COVER_IMAGES[`../assets/sayor/${id}.${extension}`]?.default ?? "";
}

export const SAYOR_ISSUE_COUNT = 11;

export const SAYOR_ISSUES = Array.from({ length: SAYOR_ISSUE_COUNT }, (_, index) => {
  const id = index + 1;
  const extension = id === 6 ? "jpeg" : "jpg";
  return { id, title: `SAYOR Issue ${String(id).padStart(2, "0")}`, image: coverFor(id, extension) };
});
