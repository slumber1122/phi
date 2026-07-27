#!/usr/bin/env python3
"""Build a client-side search index for the static physics tutorial.

Walks every course HTML page, extracts title + visible text, and writes a
compact JSON array js/search-index.json = [{u, t, c}, ...] where
  u = page URL relative to site root (e.g. 'mechanics/01-vectors.html')
  t = page title (cleaned)
  c = visible text content (tags/scripts/styles/MathJax markup stripped)

The site loads this once — lazily, on first search — and does substring
matching in the browser. Zero backend, works offline. Substring search needs
no tokenizer, so it matches Chinese terms and English phrases equally well.

Re-run this after content changes:
    python3 tools/build-search-index.py
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIRS = ["mechanics", "analytical", "relativity", "fluids", "advanced",
        "sem2", "sem3", "sem4", "sem5", "sem6", "sem7", "sem8", "appendix"]
EXTRA = ["index.html"]
SKIP = {"_smoke.html", "smoke-test.html"}

TAG_SCRIPT = re.compile(r"<script\b.*?</script>", re.I | re.S)
TAG_STYLE  = re.compile(r"<style\b.*?</style>",  re.I | re.S)
TAG        = re.compile(r"<[^>]+>")
TITLE      = re.compile(r"<title>(.*?)</title>", re.I | re.S)
MJX_DELIM  = re.compile(r"\\[\[\]\(\)]")
MJX_CMD    = re.compile(r"\\[a-zA-Z]+")
WS         = re.compile(r"\s+")


def clean(raw):
    """Strip markup → flat searchable text."""
    raw = TAG_SCRIPT.sub(" ", raw)
    raw = TAG_STYLE.sub(" ", raw)
    raw = html.unescape(raw)
    raw = TAG.sub(" ", raw)
    raw = MJX_DELIM.sub(" ", raw)   # drop \( \) \[ \]
    raw = MJX_CMD.sub(" ", raw)     # drop \vec \frac \mathrm …
    raw = WS.sub(" ", raw).strip()
    return raw


def title_of(raw, fallback):
    m = TITLE.search(raw)
    if not m:
        return fallback
    t = html.unescape(m.group(1)).strip()
    t = re.sub(r"\s*[—–-]\s*物理学教程.*$", "", t)   # drop ' — 物理学教程' suffix
    return t


def index(path, url):
    try:
        raw = open(path, encoding="utf-8").read()
    except Exception as e:
        print("skip", url, e)
        return None
    text = clean(raw)
    if len(text) < 40:
        return None
    return {"u": url, "t": title_of(raw, url), "c": text}


def main():
    out = []
    for f in EXTRA:
        p = os.path.join(ROOT, f)
        if os.path.isfile(p):
            out.append(index(p, f))
    for d in DIRS:
        dp = os.path.join(ROOT, d)
        if not os.path.isdir(dp):
            continue
        for f in sorted(os.listdir(dp)):
            if not f.endswith(".html") or f in SKIP:
                continue
            out.append(index(os.path.join(dp, f), d + "/" + f))
    out = [x for x in out if x]
    dest = os.path.join(ROOT, "js", "search-index.json")
    with open(dest, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))
    size = os.path.getsize(dest)
    print("indexed {} pages -> js/search-index.json ({} KB)".format(len(out), round(size / 1024)))


if __name__ == "__main__":
    main()
