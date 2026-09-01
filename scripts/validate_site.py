from pathlib import Path
from html.parser import HTMLParser
import sys

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"

required_files = [
    INDEX,
    ROOT / "styles.css",
    ROOT / "script.js",
    ROOT / ".nojekyll",
    ROOT / "assets" / "social-card.svg",
]

missing = [str(p.relative_to(ROOT)) for p in required_files if not p.exists()]
if missing:
    raise SystemExit(f"Missing required files: {', '.join(missing)}")

html = INDEX.read_text(encoding="utf-8")
required_strings = [
    "LightPath Tecnologia",
    "Menos operação manual.",
    "Mapear uma oportunidade",
    'id="solucoes"',
    'id="metodo"',
    'id="provas"',
    'id="contato"',
    'href="styles.css"',
    'src="script.js"',
]
for value in required_strings:
    if value not in html:
        raise SystemExit(f"index.html missing required marker: {value}")

class Checker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicates = set()
        self.local_refs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.duplicates.add(attrs["id"])
            self.ids.add(attrs["id"])
        for key in ("href", "src"):
            ref = attrs.get(key)
            if not ref or ref.startswith(("http://", "https://", "mailto:", "#", "data:")):
                continue
            self.local_refs.append(ref.split("?", 1)[0].split("#", 1)[0])

checker = Checker()
checker.feed(html)
if checker.duplicates:
    raise SystemExit(f"Duplicate HTML ids: {sorted(checker.duplicates)}")

for ref in checker.local_refs:
    if ref and not (ROOT / ref).exists():
        raise SystemExit(f"Broken local reference in index.html: {ref}")

css = (ROOT / "styles.css").read_text(encoding="utf-8")
js = (ROOT / "script.js").read_text(encoding="utf-8")
if "prefers-reduced-motion" not in css:
    raise SystemExit("Accessibility check failed: reduced-motion CSS missing")
if "prefersReduced" not in js:
    raise SystemExit("Accessibility check failed: reduced-motion JS guard missing")
if "vifalqueiro@gmail.com" not in js:
    raise SystemExit("Lead mailto destination missing")

print("LightPath static site validation passed.")
