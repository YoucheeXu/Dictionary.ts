@echo off

:start
echo 1 generate dist bin
echo 2 copy bin to Green folder
echo 3 exit
echo which you want to choose?
set /p a=
if %a%==1 goto genBin
if %a%==2 goto copyFolder
if %a%==3 goto exit

:genbin
cd /d %~dp0..
start cmd /k "npm run dist-win"
goto start

:copyFolder
set originFolder=.\dist
set dictFolder=C:\Green\Dictionary\bin
rmdir /q /s %dictFolder%
xcopy /y/e %originFolder%\win-ia32-unpacked\ %dictFolder%\
rmdir /q /s %originFolder%

:exit
pause