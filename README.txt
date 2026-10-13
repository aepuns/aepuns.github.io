AEPUNS HOMEPAGE VERSION SYSTEM
==============================
ONE-TIME INSTALL
1. Copy version.js, INSTALL-VERSION-SYSTEM.py and INSTALL-VERSION-SYSTEM.bat into your website repository's ROOT folder (the folder containing index.html).
2. Double-click INSTALL-VERSION-SYSTEM.bat. It modifies only index.html to read version.js.
3. In GitHub Desktop, commit index.html and version.js, then push origin.
   You do NOT need to commit the .py or .bat installer files.

EVERY FUTURE UPDATE
1. Open version.js in Notepad or VS Code.
2. Change the number in this line: window.AEPUNS_SITE_VERSION = "2.0";
3. Save, commit and push using GitHub Desktop.
4. Refresh aepuns.ca (Ctrl+Shift+R) to see the new number.

The initial number stays 2.0 until you choose to change it.

MANUAL INSTALL (if Python is unavailable)
- Copy version.js beside index.html.
- In index.html, find: <script src="js/script.js"></script>
- Immediately ABOVE it insert:
<script src="version.js"></script>
<script>
  document.getElementById('site-version').textContent =
    'v' + window.AEPUNS_SITE_VERSION.replace(/^v/i, '');
</script>
- Save, commit and push index.html and version.js.
