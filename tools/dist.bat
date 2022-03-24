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
set destFolder=C:\Green\Dictionary
goto copyFolder

:copyFolder2D
set destFolder=D:\Green\Dictionary
goto copyFolder

:copyFolder
set distFolder=.\dist
set assertFolder=.\assets

rmdir /q /s %destFolder%\bin
rmdir /q /s %destFolder%\assets

xcopy /y/e %distFolder%\win-unpacked\* %destFolder%\bin\
xcopy /y/e %assertFolder%\* %destFolder%\assets\
rmdir /q /s %distFolder%

:exit
pause