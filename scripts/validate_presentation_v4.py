from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "apresentacao"
html = (BASE / "index.html").read_text(encoding="utf-8")
copy = (BASE / "presentation-i18n-v4.js").read_text(encoding="utf-8")
js = (BASE / "presentation-v4.js").read_text(encoding="utf-8")
css = (BASE / "presentation-v4.css").read_text(encoding="utf-8")

errors = []
if len(re.findall(r'<section\s+class="[^"]*scene', html)) != 11:
    errors.append("expected 11 scenes")
if 'id="scene-total">11<' not in html:
    errors.append("scene total must be 11")
if '../#contato' in html:
    errors.append("broken #contato anchor found")
if css.count("{") != css.count("}"):
    errors.append("CSS braces unbalanced")

ptm = re.search(r'pt:\{(.*?)\n\s*\},\n\s*en:\{', copy, re.S)
enm = re.search(r'en:\{(.*?)\n\s*\}\n\s*\};', copy, re.S)
if not ptm or not enm:
    errors.append("cannot isolate PT/EN dictionaries")
else:
    pt_keys = set(re.findall(r"'([^']+)'\s*:", ptm.group(1)))
    en_keys = set(re.findall(r"'([^']+)'\s*:", enm.group(1)))
    if pt_keys != en_keys:
        errors.append(f"dictionary key mismatch: PT-only={sorted(pt_keys-en_keys)} EN-only={sorted(en_keys-pt_keys)}")
    html_keys = set(re.findall(r'data-i18n(?:-aria)?="([^"]+)"', html))
    miss_pt = html_keys - pt_keys
    miss_en = html_keys - en_keys
    if miss_pt:
        errors.append(f"HTML keys missing in PT: {sorted(miss_pt)}")
    if miss_en:
        errors.append(f"HTML keys missing in EN: {sorted(miss_en)}")

if "const impact={" in js or "pt:[" in js or "en:[" in js:
    errors.append("presentation runtime contains duplicated bilingual copy")
for required in ["renderImpact", "renderBottleneck", "renderSolution", "renderGrowth", "renderMethod", "renderProof", "renderAI", "renderDiagnostic"]:
    if required not in js:
        errors.append(f"missing dynamic renderer {required}")

if errors:
    print("FAIL")
    for error in errors:
        print("-", error)
    sys.exit(1)

print("PASS — presentation V4 structural + bilingual validation")
