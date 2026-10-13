@echo off
setlocal
cd /d "%~dp0"
if not exist "admin-secrets.html" (
  echo ERROR: Put these files in your website repository folder, beside admin-secrets.html.
  pause
  exit /b 1
)
if not exist "admin-secrets-username-addon.js" (
  echo ERROR: Missing admin-secrets-username-addon.js.
  pause
  exit /b 1
)
findstr /C:"admin-secrets-username-addon.js" "admin-secrets.html" >nul
if not errorlevel 1 (
  echo The admin page already has the username addon. Nothing to change.
  pause
  exit /b 0
)
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='admin-secrets.html'; $t=[System.IO.File]::ReadAllText($p); if(-not $t.Contains('</body>')) { throw 'Could not find closing body tag' }; $t=$t.Replace('</body>', '<script src="/admin-secrets-username-addon.js" defer></script></body>'); [System.IO.File]::WriteAllText($p,$t,[System.Text.UTF8Encoding]::new($false))"
if errorlevel 1 (
  echo ERROR: Could not update admin-secrets.html.
  pause
  exit /b 1
)
echo Done! admin-secrets.html now loads the username moderation addon.
echo Commit admin-secrets.html and admin-secrets-username-addon.js in GitHub Desktop.
pause
