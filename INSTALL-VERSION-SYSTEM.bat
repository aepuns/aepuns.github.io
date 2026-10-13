@echo off
cd /d "%~dp0"
where py >nul 2>&1
if %errorlevel%==0 (
  py -3 "%~dp0INSTALL-VERSION-SYSTEM.py"
) else (
  where python >nul 2>&1
  if %errorlevel%==0 (
    python "%~dp0INSTALL-VERSION-SYSTEM.py"
  ) else (
    echo Python is not installed. Please follow README.txt for the manual edit.
  )
)
pause
