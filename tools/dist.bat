cd /d %~dp0..
REM start cmd /k "npm run dist-win"
set originFolder=.\dist
set dictFolder=C:\Green\Dictionary\bin
rmdir /q /s %dictFolder%
xcopy /y/e %originFolder%\win-ia32-unpacked\ %dictFolder%\
rmdir /q /s %originFolder%
pause