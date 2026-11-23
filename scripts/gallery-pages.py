"""Selecta's real pages on the showcase: a copy of each kind of page of a client gallery app (the sign-in, the
dashboard, the list of galleries, a gallery with its cover, notes and export, the notices, the settings, a client's
gallery with its tiles, hearts and the photos chosen), as a browser draws them, drawn by this repository's dist/ and
Selecta's own placement (its stylesheets, inline), its photos replaced by a plain gold ground, its own scripts left out,
its links going nowhere. The showcase thus shows every piece of the gallery kit (src/gallery.css) as Selecta uses it.
Take the drawn pages with a running Selecta (its demo base), then run:
    python3 scripts/gallery-pages.py /path/to/selecta/checkout /path/to/drawn
"""
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Comment

APP = Path(sys.argv[1])
DRAWN = Path(sys.argv[2])
ROOT = Path(__file__).resolve().parent.parent
CSS = APP / "src/main/resources/static/css"
PAGES = {
    "gallery-login.html": ("login", "La connexion"),
    "gallery-dashboard.html": ("admin", "Le tableau de bord"),
    "gallery-list.html": ("admin-galleries", "La liste des galeries"),
    "gallery-detail.html": ("admin-galleries-1", "Une galerie : sa couverture, ses notes, son export"),
    "gallery-notices.html": ("admin-notifications", "Les notifications et la cloche"),
    "gallery-settings.html": ("admin-settings", "Les réglages"),
    "gallery-client.html": ("client-galleries-1", "La galerie d’une cliente : ses photos, ses cœurs, son choix"),
}
PHOTO = ("data:image/svg+xml," "%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Cdefs%3E%3ClinearGradient"
         " id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23d8c39a'/%3E%3Cstop offset='1' stop-color='%238a7550'/%3E"
         "%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E")


def asset(href):
    m = re.search(r"/ds/(ds|ds-photo)-\d+\.\d+\.\d+\.(css|js)$", href)
    if m:
        return f"dist/{m.group(1)}.{m.group(2)}"
    m = re.search(r"/ds/icons-\d+\.\d+\.\d+\.svg(#.*)?$", href)
    if m:
        return "dist/icons.svg" + (m.group(1) or "")
    m = re.search(r"/ds/fonts/(.+)$", href)
    return "dist/fonts/" + m.group(1) if m else None


for name, (source, title) in PAGES.items():
    soup = BeautifulSoup((DRAWN / (source + ".html")).read_text(encoding="utf-8"), "html.parser")
    own = []
    for tag in soup.find_all("link"):
        href = tag.get("href") or ""
        kept = asset(href)
        if kept:
            tag["href"] = kept
            continue
        m = re.search(r"/css/([\w-]+\.css)", href)
        if m:
            own.append((CSS / m.group(1)).read_text(encoding="utf-8"))
        tag.decompose()
    for tag in soup.find_all("script"):
        kept = asset(tag.get("src") or "")
        if kept:
            tag["src"] = kept
        else:
            tag.decompose()
    for tag in soup.find_all(True):
        for attr, value in list(tag.attrs.items()):
            if attr in ("srcset", "data-srcset", "sizes"):
                del tag[attr]
            elif isinstance(value, str) and (re.search(r"\.(jpe?g|webp|png|avif)(\?.*)?$", value, re.I) or "img.selecta.test" in value) and attr != "href":
                tag[attr] = PHOTO
        if tag.has_attr("style") and "url(" in tag["style"]:
            tag["style"] = re.sub(r"url\([^)]*\)", f'url("{PHOTO}")', tag["style"])
    for tag in soup.find_all("use"):
        for attr in ("href", "xlink:href"):
            if tag.has_attr(attr):
                tag[attr] = asset(tag[attr]) or tag[attr]
    for tag in soup.find_all(["a", "form"]):
        attr = "href" if tag.name == "a" else "action"
        if tag.has_attr(attr) and not tag[attr].startswith("#"):
            tag[attr] = "#"
    for tag in soup.find_all("input", attrs={"name": "_csrf"}):
        tag.decompose()
    for tag in soup.find_all("meta", attrs={"name": re.compile("csrf|robots")}):
        tag.decompose()
    head = soup.head
    head.append(soup.new_tag("meta", attrs={"name": "robots", "content": "noindex"}))
    if own:
        style = soup.new_tag("style")
        style.string = "/* Selecta's own placement (its stylesheets), around the design system's pieces */\n" + "\n".join(own)
        head.append(style)
    if head.title:
        head.title.string = f"{title} · Kit galerie · Design system"
    soup.body.insert(0, Comment(f" the showcase's copy of Selecta's {source}: made by scripts/gallery-pages.py, do not edit it "))
    (ROOT / name).write_text(str(soup), encoding="utf-8")
    print(name, "from", source)
