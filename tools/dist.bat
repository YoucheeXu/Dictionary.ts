@echo off

:start
cd /d %~dp0..
echo 1 generate dist bin
echo 2 copy bin to C:\Green folder and exit
echo 3 copy bin to D:\Green folder and exit
echo 4 exit
echo which you want to choose?
set /p a=
if %a%==1 goto genBin
if %a%==2 goto copyFolder2C
if %a%==3 goto copyFolder2D
if %a%==4 goto exit

:genbin
start cmd /k "npm run dist-win"
goto start

:copyFolder2C
set originFolder=.\dist
set dictFolder=C:\Green\Dictionary\bin
rmdir /q /s %dictFolder%
REM xcopy /y/e %originFolder%\win-ia32-unpacked\* %dictFolder%\
xcopy /y/e %originFolder%\win-unpacked\* %dictFolder%\
rmdir /q /s %originFolder%
goto exit

:copyFolder2D
set originFolder=.\dist
set dictFolder=D:\Green\Dictionary\bin
rmdir /q /s %dictFolder%
REM xcopy /y/e %originFolder%\win-ia32-unpacked\* %dictFolder%\
xcopy /y/e %originFolder%\win-unpacked\* %dictFolder%\
rmdir /q /s %originFolder%
goto exit

:exit
pause