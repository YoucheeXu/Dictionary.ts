set dictFolder=C:\Green\Dictionary
mklink /J ..\dict 				%dictFolder%\dict
mklink /J ..\audio 				%dictFolder%\audio
mklink /J ..\log 				%dictFolder%\log
mklink /J ..\tools 				%dictFolder%\tools
REM mklink /D ..\Dictionary.json 	%dictFolder%\Dictionary.json
REM mklink /D ..\ReciteWords.json	%dictFolder%\ReciteWords.json
pause