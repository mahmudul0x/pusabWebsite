import zipfile, re, os, html, json

SRC = r"E:\pusabWebsite\sayor (all)"
OUT_DIR = r"E:\pusabWebsite\src\content\sayor"
PARA = re.compile(r"<w:p[ >].*?</w:p>|<w:p/>", re.S)
NS_T = re.compile(r"<w:t[^>]*>(.*?)</w:t>", re.S)
SENT = "।?!…"
BN_DIGITS = "০১২৩৪৫৬৭৮৯"


def read_paras(issue):
    """Return list of (text, gap_before) for non-empty paragraphs."""
    with zipfile.ZipFile(os.path.join(SRC, f"{issue}.docx")) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    items = []
    gap = 0
    for pm in PARA.finditer(xml):
        t = html.unescape("".join(NS_T.findall(pm.group(0)))).strip()
        if t == "":
            gap += 1
        else:
            items.append((t, gap))
            gap = 0
    return items


def bio_name(line):
    if ":" not in line:
        return None
    prefix, rest = line.split(":", 1)
    prefix, rest = prefix.strip(), rest.strip()
    if not prefix or not rest or len(prefix) > 45:
        return None
    if prefix[0] in "-–—" + BN_DIGITS + "0123456789":
        return None
    if any(c in prefix for c in SENT) or len(prefix.split()) > 6:
        return None
    return prefix


def looks_author(line):
    if not line or ":" in line:
        return False
    if line[0] in "-–—" + BN_DIGITS + "0123456789":
        return False
    if any(c in line for c in SENT):
        return False
    return len(line.split()) <= 6 and len(line) <= 45


def looks_title(line):
    return len(line) <= 90 and not any(c in line for c in "।") and len(line.split()) <= 14


def split_issue(issue):
    items = read_paras(issue)
    n = len(items)
    texts = [t for t, _ in items]

    # An article begins with a (title, author) pair, signalled either by a
    # clear blank-line gap (>=3) or by directly following a previous article's
    # closing author-bio line. Requiring the pair avoids shredding poems and
    # bulleted sub-sections, whose short lines would otherwise look like titles.
    starts = set()
    for i in range(1, n - 1):
        text, gap = items[i]
        has_pair = looks_title(text) and looks_author(texts[i + 1])
        if not has_pair:
            continue
        trigger = gap >= 3 or bio_name(texts[i - 1]) is not None
        if trigger:
            starts.add(i)
    start_list = sorted(starts)

    # front matter = [0, first start)
    first = start_list[0] if start_list else n
    bounds = [0] + start_list + [n]

    # editor detection in front matter
    editor = ""
    for j in range(first):
        if texts[j] in ("সম্পাদক",) and j + 1 < first:
            editor = texts[j + 1]
        nm = bio_name(texts[j])
        if nm and "সম্পাদক" in nm:
            editor = texts[j].split(":", 1)[1].strip()

    chapters = []
    for k in range(len(bounds) - 1):
        s, e = bounds[k], bounds[k + 1]
        seg = texts[s:e]
        if not seg:
            continue
        if k == 0:
            # front matter -> editorial
            body = [x for x in seg]
            # drop masthead-ish leading lines (issue title, 'সম্পাদক', editor name)
            while body and (
                body[0].startswith("সায়র")
                or body[0] == "সম্পাদক"
                or body[0] == editor
                or "সংখ্যা" in body[0][:25]
            ):
                body.pop(0)
            title = "সম্পাদকীয়"
            if body and body[0] == "সম্পাদকীয়":
                body.pop(0)
            chapters.append({"title": title, "author": editor, "bio": "", "paragraphs": body})
            continue
        title = seg[0]
        rest = seg[1:]
        author = ""
        if rest and looks_author(rest[0]):
            author = rest[0]
            rest = rest[1:]
        bio = ""
        if rest and bio_name(rest[-1]):
            bio = rest[-1]
            rest = rest[:-1]
        chapters.append({"title": title, "author": author, "bio": bio, "paragraphs": rest})

    # Merge stray body-less fragments (e.g. a leaked bio line) into the
    # previous chapter so no text is orphaned or shown as an empty article.
    cleaned = []
    for c in chapters:
        if not c["paragraphs"] and cleaned:
            prev = cleaned[-1]
            if not prev["bio"] and bio_name(c["title"]):
                prev["bio"] = c["title"]
            else:
                prev["paragraphs"].append(c["title"])
            if c["author"]:
                prev["paragraphs"].append(c["author"])
            continue
        cleaned.append(c)

    return {"editor": editor, "chapters": cleaned}


if __name__ == "__main__":
    import sys
    report = []
    write = "--write" in sys.argv
    if write:
        os.makedirs(OUT_DIR, exist_ok=True)
    for i in range(1, 12):
        data = split_issue(i)
        ch = data["chapters"]
        report.append(f"=== issue {i}: {len(ch)} chapters | editor={data['editor']}")
        total = 0
        for c in ch:
            wc = sum(len(p) for p in c["paragraphs"])
            total += wc + len(c["title"]) + len(c["author"]) + len(c["bio"])
            report.append(f"    [{c['author'][:18]:18s}] {c['title'][:48]:48s} ({len(c['paragraphs'])}p/{wc}c)")
        report.append(f"    >>> retained chars ~ {total}")
        if write:
            with open(os.path.join(OUT_DIR, f"{i}.json"), "w", encoding="utf-8") as f:
                json.dump({"id": i, "editor": data["editor"], "chapters": ch}, f, ensure_ascii=False)
    open(r"E:\pusabWebsite\scripts\_split2.txt", "w", encoding="utf-8").write("\n".join(report))
    print("wrote report" + (" + json" if write else ""))
