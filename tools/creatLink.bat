set dictFolder=C:\Green\Dictionary
mklink /J ..\publish\dict 				%dictFolder%\dict
mklink /J ..\publish\audio 				%dictFolder%\audio
mklink /J ..\publish\log 				%dictFolder%\log
mklink /J ..\publish\tools 				%dictFolder%\tools
REM mklink /D ..\publish\Dictionary.json 	%dictFolder%\Dictionary.json
REM mklink /D ..\publish\ReciteWords.json	%dictFolder%\ReciteWords.json
pause