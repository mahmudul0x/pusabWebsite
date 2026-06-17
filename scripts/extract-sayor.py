import zipfile, re, json, os, html

SRC = r"E:\pusabWebsite\sayor (all)"
OUT_DIR = r"E:\pusabWebsite\src\content\sayor"

NS_T = re.compile(r"<w:t[^>]*>(.*?)</w:t>", re.S)
# paragraph splitter
PARA = re.compile(r"<w:p[ >].*?</w:p>|<w:p/>", re.S)
BOLD = re.compile(r"<w:b/>|<w:b ")
HEADING = re.compile(r'w:val="(Heading\d|Title|Subtitle)"')

def unescape(s):
    return html.unescape(s)

def extract(path):
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    blocks = []
    for pm in PARA.finditer(xml):
        para = pm.group(0)
        texts = NS_T.findall(para)
        text = unescape("".join(texts)).strip()
        if not text:
            continue
        style = HEADING.search(para)
        is_bold = bool(BOLD.search(para))
        if style:
            level = "h2"
        elif is_bold and len(text) < 90:
            level = "h3"
        else:
            level = "p"
        blocks.append({"type": level, "text": text})
    return blocks

os.makedirs(OUT_DIR, exist_ok=True)
for i in range(1, 12):
    p = os.path.join(SRC, f"{i}.docx")
    blocks = extract(p)
    out = os.path.join(OUT_DIR, f"{i}.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"id": i, "blocks": blocks}, f, ensure_ascii=False)
    chars = sum(len(b["text"]) for b in blocks)
    print(f"issue {i}: {len(blocks)} blocks, {chars} chars -> {os.path.getsize(out)} bytes")
