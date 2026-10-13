from pathlib import Path
import re
root = Path(__file__).resolve().parent
page = root / 'index.html'
version = root / 'version.js'
if not page.exists():
    raise SystemExit('ERROR: index.html is not in this folder. Copy all three files beside your homepage index.html and retry.')
if not version.exists():
    raise SystemExit('ERROR: version.js is missing.')
html = page.read_text(encoding='utf-8')
if 'id="site-version"' not in html:
    raise SystemExit('ERROR: Could not find the site-version element. No changes made.')
if 'AEPUNS_SITE_VERSION' in html and 'src="version.js"' in html:
    print('Version system is already installed. No changes needed.')
    raise SystemExit(0)
pattern = r'(<p\s+id="site-version"\s*>)(.*?)(</p>)'
html, count = re.subn(pattern, r'\g<1>v2.0\g<3>', html, count=1, flags=re.DOTALL)
if count != 1:
    raise SystemExit('ERROR: Version label could not be updated safely. No changes made.')
script = '''<script src="version.js"></script>
    <script>
        (function () {
            var label = document.getElementById('site-version');
            if (label && typeof window.AEPUNS_SITE_VERSION === 'string') {
                label.textContent = 'v' + window.AEPUNS_SITE_VERSION.replace(/^v/i, '');
            }
        }());
    </script>'''
html = html.replace('    <script src="js/script.js"></script>', '    ' + script + '\n\n    <script src="js/script.js"></script>', 1)
if 'src="version.js"' not in html:
    raise SystemExit('ERROR: Could not find homepage script anchor. No changes made.')
page.write_text(html, encoding='utf-8')
print('SUCCESS: Homepage now reads the version from version.js.')
print('To update later: edit version.js, change 2.0, save, commit and push.')
