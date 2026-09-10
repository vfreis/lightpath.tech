from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
PRESENTATION = ROOT / "apresentacao" / "index.html"

required_files = [
    INDEX,
    ROOT / "site-v2.css",
    ROOT / "app-v2.js",
    ROOT / "motion-director.js",
    ROOT / "i18n-v2.js",
    PRESENTATION,
    ROOT / "apresentacao" / "presentation.css",
    ROOT / "apresentacao" / "mobile-safe-area.css",
    ROOT / "apresentacao" / "presentation.js",
    ROOT / "favicon.svg",
    ROOT / ".nojekyll",
    ROOT / "assets" / "social-card.svg",
]
missing = [str(p.relative_to(ROOT)) for p in required_files if not p.exists()]
if missing:
    raise SystemExit(f"Missing required files: {', '.join(missing)}")

class Checker(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.duplicates=set(); self.local_refs=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if "id" in attrs:
            if attrs["id"] in self.ids: self.duplicates.add(attrs["id"])
            self.ids.add(attrs["id"])
        for key in ("href","src"):
            ref=attrs.get(key)
            if not ref or ref.startswith(("http://","https://","mailto:","#","data:")): continue
            self.local_refs.append(ref.split("?",1)[0].split("#",1)[0])

def validate_html(document, base_dir, name):
    checker=Checker(); checker.feed(document)
    if checker.duplicates: raise SystemExit(f"Duplicate HTML ids in {name}: {sorted(checker.duplicates)}")
    for ref in checker.local_refs:
        if ref.endswith("/"):
            target=base_dir/ref/"index.html"
        else:
            target=base_dir/ref
        if ref and not target.exists(): raise SystemExit(f"Broken local reference in {name}: {ref}")

html=INDEX.read_text(encoding="utf-8")
required_markers=[
    "LightPath Tecnologia", 'id="lp-path-canvas"', 'class="hero-story"', 'id="growth"',
    'class="growth-story"', 'class="impact-story"', 'id="diagnostic"', 'href="apresentacao/"',
    'href="site-v2.css"', 'src="app-v2.js"', 'src="motion-director.js"', 'src="i18n-v2.js"',
    'data-i18n="hero.line1"', 'data-i18n-html="growth.title"', 'data-path-state="final"', 'class="counter"'
]
for value in required_markers:
    if value not in html: raise SystemExit(f"index.html missing required marker: {value}")
validate_html(html,ROOT,"index.html")

# Runtime must load one visual/motion stack only.
legacy_runtime=["styles.css","enhancements.css","business-cases.css","mobile-first.css","storytelling.css","script.js","storytelling.js","i18n.js"]
for name in legacy_runtime:
    if f'href="{name}"' in html or f'src="{name}"' in html:
        raise SystemExit(f"Legacy runtime still loaded by home: {name}")
if html.count('<canvas') != 1:
    raise SystemExit(f"Home must declare exactly one canvas, found {html.count('<canvas')}")

css=(ROOT/"site-v2.css").read_text(encoding="utf-8")
app=(ROOT/"app-v2.js").read_text(encoding="utf-8")
motion=(ROOT/"motion-director.js").read_text(encoding="utf-8")
i18n=(ROOT/"i18n-v2.js").read_text(encoding="utf-8")
if "prefers-reduced-motion" not in css or "prefers-reduced-motion" not in motion:
    raise SystemExit("Reduced-motion support missing")
if "data-motion" not in motion or "deviceMemory" not in motion or "hardwareConcurrency" not in motion:
    raise SystemExit("Motion tier detection missing")
if "class MotionDirector" not in motion:
    raise SystemExit("Unified MotionDirector missing")
if "scaleX" not in motion:
    raise SystemExit("Transform-based scroll progress missing")
if "R$1" not in html or "revenue-token" not in html:
    raise SystemExit("Growth scrolltelling narrative missing")
if "case-panel" not in html or "bindCases" not in motion:
    raise SystemExit("Pinned business-case storytelling missing")
if "data-i18n" not in html or "const EN=" not in i18n or "const PT=" not in i18n:
    raise SystemExit("Semantic PT/EN translation contract missing")
if "MutationObserver" in i18n:
    raise SystemExit("i18n must not use a DOM-wide MutationObserver")

presentation_html=PRESENTATION.read_text(encoding="utf-8")
for value in ['id="story"','id="vector-field"','src="presentation.js"','href="mobile-safe-area.css"']:
    if value not in presentation_html: raise SystemExit(f"Interactive presentation missing marker: {value}")
validate_html(presentation_html,PRESENTATION.parent,"apresentacao/index.html")
presentation_js=(ROOT/"apresentacao"/"presentation.js").read_text(encoding="utf-8")
if "touchstart" not in presentation_js or "goTo" not in presentation_js:
    raise SystemExit("Presentation touch/navigation contract missing")

print("LightPath V2 validation passed: one motion director, one canvas, semantic PT/EN, mobile-first storytelling and presentation.")
