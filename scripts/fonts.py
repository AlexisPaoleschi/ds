"""Copies the fonts of both themes from Google Fonts into dist/fonts, and writes their @font-face rules in
src/fonts.css: the apps then serve them themselves, and no page asks Google for anything.
The files are the ones Google Fonts serves to a recent browser (woff2), for the latin and latin-ext alphabets
(French, and the names of other European languages); run it again to take a newer version of a font.
usage: python3 scripts/fonts.py"""
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# family: weights, as the pages asked for them
FAMILIES = {
    "Archivo": [600, 700, 800],
    "IBM Plex Sans": [400, 500, 600, 700],
    "IBM Plex Mono": [400, 500, 600],
    "Gilda Display": [400],
    "Urbanist": [300, 400, 500, 600, 700],
}
SUBSETS = ("latin-ext", "latin")
# a recent browser, so that Google answers with woff2 and one file per alphabet
AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": AGENT}), timeout=30) as r:
        return r.read()


def main():
    out = ROOT / "dist" / "fonts"
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob("*.woff2"):
        old.unlink()
    rules, names = [], []
    for family, weights in FAMILIES.items():
        query = family.replace(" ", "+") + (":wght@" + ";".join(map(str, weights)) if weights != [400] else "")
        css = get(f"https://fonts.googleapis.com/css2?family={query}&display=swap").decode()
        # Google writes each block after a comment that names its alphabet: /* latin */ @font-face {…}; a variable
        # font gives every weight the same file, kept once, for the range of weights it draws
        files = {}
        for subset, block in re.findall(r"/\* ([a-z-]+) \*/\s*(@font-face \{.*?\})", css, re.S):
            if subset not in SUBSETS:
                continue
            weight = int(re.search(r"font-weight: (\d+)", block).group(1))
            url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
            ranges = re.search(r"unicode-range: ([^;]+);", block).group(1)
            files.setdefault((subset, url), {"ranges": ranges, "weights": []})["weights"].append(weight)
        for (subset, url), f in files.items():
            low, high = min(f["weights"]), max(f["weights"])
            name = f"{family.lower().replace(' ', '-')}-{low if low == high else 'var'}-{subset}.woff2"
            (out / name).write_bytes(get(url))
            names.append(name)
            weight = low if low == high else f"{low} {high}"
            rules.append(f'  @font-face {{ font-family: "{family}"; font-style: normal; font-weight: {weight}; font-display: swap; '
                         f'src: url("fonts/{name}") format("woff2"); unicode-range: {f["ranges"]}; }}')
    (out / "index.txt").write_text("\n".join(sorted(names)) + "\n")
    head = ("/* The fonts of both themes, served with the design system's copy (fonts/ next to ds-X.Y.Z.css): no page asks\n"
            "   Google Fonts for them. Made by scripts/fonts.py; a browser downloads only the faces a page uses. */\n")
    (ROOT / "src" / "fonts.css").write_text(head + "\n".join(rules) + "\n")
    print(f"{len(names)} files in dist/fonts, {sum((out / n).stat().st_size for n in names) // 1024} KB")


if __name__ == "__main__":
    main()
