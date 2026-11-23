"""The site's real pages on the showcase: a copy of each kind of page of alexispaoleschi.com (the home, an event, the list
of events, the newsletter, a legal document), drawn by this repository's dist/ instead of the site's copy, its photos
replaced by a plain gold ground, its own scripts left out (only the design system's run), its links going nowhere.
The showcase thus shows every piece of the site kit as the site uses it. The pages its scripts build (the home's screens
from the site's data, an event's testimonials) are taken as a browser draws them (scripts/site-render.js). Run both
again when the site changes:
    node scripts/site-render.js /path/to/the/site/checkout /tmp/site-drawn
    python3 scripts/site-pages.py /path/to/the/site/checkout /tmp/site-drawn
"""
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Comment

SITE = Path(sys.argv[1])
DRAWN = Path(sys.argv[2]) if len(sys.argv) > 2 else None
ROOT = Path(__file__).resolve().parent.parent
PAGES = {
    "site-home.html": ("index.html", "L’accueil"),
    "site-event.html": ("events/lyon-2026/index.html", "Une page d’événement"),
    "site-senegal.html": ("events/senegal-2027/index.html", "Une autre page d’événement"),
    "site-events.html": ("events/index.html", "La liste des événements"),
    "site-newsletter.html": ("events/newsletter/index.php", "La newsletter"),
    "site-doc.html": ("events/lyon-2026/model-release.html", "Un document légal"),
}
# a photo's place: a plain gold ground, the same everywhere
PHOTO = ("data:image/svg+xml," "%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Cdefs%3E%3ClinearGradient"
         " id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23d8c39a'/%3E%3Cstop offset='1' stop-color='%238a7550'/%3E"
         "%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E")
DIST = {"ds": "dist/ds.css", "ds-site": "dist/ds-site.css"}


def asset(href):
    """The site's copy of the design system, pointed at this repository's dist/."""
    m = re.search(r"ds/(ds|ds-site|ds-photo|ds-tools)-\d+\.\d+\.\d+\.(css|js)$", href)
    if m:
        return f"dist/{m.group(1)}.{m.group(2)}"
    m = re.search(r"ds/icons-\d+\.\d+\.\d+\.svg(#.*)?$", href)
    if m:
        return "dist/icons.svg" + (m.group(1) or "")
    m = re.search(r"ds/fonts/(.+)$", href)
    if m:
        return "dist/fonts/" + m.group(1)
    return None


for name, (source, title) in PAGES.items():
    drawn = DRAWN / name if DRAWN else None
    text = (drawn if drawn and drawn.exists() else SITE / source).read_text(encoding="utf-8")
    text = re.sub(r"<\?(php|=).*?\?>", "", text, flags=re.S)
    soup = BeautifulSoup(text, "html.parser")
    for tag in soup.find_all("script"):
        src = tag.get("src") or ""
        kept = asset(src)
        if kept:
            tag["src"] = kept
        else:
            tag.decompose()
    for tag in soup.find_all("link"):
        kept = asset(tag.get("href") or "")
        if kept:
            tag["href"] = kept
        else:
            tag.decompose()
    for tag in soup.find_all(["img", "source"]):
        for attr in ("srcset", "data-srcset", "sizes"):
            if tag.has_attr(attr):
                del tag[attr]
        if tag.name == "source":
            tag.decompose()
            continue
        tag["src"] = PHOTO
    # a photo named elsewhere (the viewer's full size, data-full)
    for tag in soup.find_all(True):
        for attr, value in list(tag.attrs.items()):
            if isinstance(value, str) and re.search(r"\.(jpe?g|webp|png|avif)(\?.*)?$", value, re.I) and attr != "href":
                tag[attr] = PHOTO
    for tag in soup.find_all(style=re.compile(r"url\(")):
        tag["style"] = re.sub(r"url\([^)]*\)", f'url("{PHOTO}")', tag["style"])
    for tag in soup.find_all("use"):
        for attr in ("href", "xlink:href"):
            if tag.has_attr(attr):
                kept = asset(tag[attr])
                tag[attr] = kept or tag[attr]
    for tag in soup.find_all(["a", "form"]):
        attr = "href" if tag.name == "a" else "action"
        if tag.has_attr(attr) and not tag[attr].startswith("#"):
            tag[attr] = "#"
    for tag in soup.find_all("meta", attrs={"property": True}):
        tag.decompose()
    head = soup.head
    for tag in head.find_all("meta", attrs={"name": re.compile("description|robots")}):
        tag.decompose()
    head.append(soup.new_tag("meta", attrs={"name": "robots", "content": "noindex"}))
    if head.title:
        head.title.string = f"{title} · Kit du site · Design system"
    soup.body.insert(0, Comment(f" the showcase's copy of the site's {source}: made by scripts/site-pages.py, do not edit it "))
    # the loader goes as soon as the page is drawn (the site's own script would say so)
    done = soup.new_tag("script")
    done.string = "window.hideLoader && window.hideLoader();"
    soup.body.append(done)
    (ROOT / name).write_text(str(soup), encoding="utf-8")
    print(name, "from", source)
