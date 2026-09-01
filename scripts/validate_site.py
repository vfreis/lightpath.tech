from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
PRESENTATION = ROOT / "apresentacao" / "index.html"

required_files = [
    INDEX,
    ROOT / "styles.css",
    ROOT / "enhancements.css",
    ROOT / "cinematic.css",
    ROOT / "polish.css",
    ROOT / "business-cases.css",
    ROOT / "mobile-first.css",
    ROOT / "storytelling.css",
    ROOT / "script.js",
    ROOT / "storytelling.js",
    PRESENTATION,
    ROOT / "apresentacao" / "presentation.css",
    ROOT / "apresentacao" / "presentation.js",
    ROOT / "favicon.svg",
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
    "Diagnosticar uma oportunidade",
    'id="solucoes"',
    'id="impacto"',
    'id="metodo"',
    'id="provas"',
    'id="diagnostico"',
    'id="contato"',
    'href="apresentacao/"',
    'href="favicon.svg"',
    'href="styles.css"',
    'href="storytelling.css"',
    'src="script.js"',
    'src="storytelling.js"',
    'class="counter"',
    'class="growth-vector"',
    'class="scanner-section"',
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


def validate_html(document, base_dir, name):
    checker = Checker()
    checker.feed(document)
    if checker.duplicates:
        raise SystemExit(f"Duplicate HTML ids in {name}: {sorted(checker.duplicates)}")
    for ref in checker.local_refs:
        if ref and not (base_dir / ref).exists():
            raise SystemExit(f"Broken local reference in {name}: {ref}")


validate_html(html, ROOT, "index.html")

presentation_html = PRESENTATION.read_text(encoding="utf-8")
for value in [
    "Apresentação Interativa",
    'id="story"',
    'data-scene="8"',
    'id="vector-field"',
    'id="diagnostic-result"',
    'src="presentation.js"',
]:
    if value not in presentation_html:
        raise SystemExit(f"Interactive presentation missing required marker: {value}")
validate_html(presentation_html, PRESENTATION.parent, "apresentacao/index.html")

css_names = (
    "styles.css",
    "enhancements.css",
    "cinematic.css",
    "polish.css",
    "business-cases.css",
    "mobile-first.css",
    "storytelling.css",
)
css = "\n".join((ROOT / name).read_text(encoding="utf-8") for name in css_names)
js = (ROOT / "script.js").read_text(encoding="utf-8")
story_js = (ROOT / "storytelling.js").read_text(encoding="utf-8")
presentation_js = (ROOT / "apresentacao" / "presentation.js").read_text(encoding="utf-8")

if "prefers-reduced-motion" not in css:
    raise SystemExit("Accessibility check failed: reduced-motion CSS missing")
if "prefersReduced" not in js:
    raise SystemExit("Accessibility check failed: reduced-motion JS guard missing")
if "setupFlowCanvas" not in js:
    raise SystemExit("Motion check failed: base vector flow canvas missing")
if "animateCounter" not in js:
    raise SystemExit("Motion check failed: animated counters missing")
if "animation-timeline" not in css:
    raise SystemExit("Cinematic check failed: progressive scroll animation layer missing")
if "@media (max-width: 900px)" not in (ROOT / "mobile-first.css").read_text(encoding="utf-8"):
    raise SystemExit("Mobile-first check failed: dedicated small-screen art direction missing")
if "story-field" not in story_js or "scannerData" not in story_js or "case-mode-switch" not in story_js:
    raise SystemExit("Storytelling check failed: narrative interaction engine incomplete")
if "touchstart" not in presentation_js or "goTo" not in presentation_js or "setupVectorField" not in presentation_js:
    raise SystemExit("Presentation check failed: touch/navigation/motion engine incomplete")
if "vifalqueiro@gmail.com" not in js:
    raise SystemExit("Lead mailto destination missing")

print("LightPath static site validation passed, including storytelling and presentation.")
