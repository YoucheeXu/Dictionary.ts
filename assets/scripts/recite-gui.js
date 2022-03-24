"use strict";
const { ipcRenderer } = require('electron');

var HotKeyHandler = {
    currentMainKey: null,

    Register: function (MainKey, value, func) {
        console.log('MainKey: ' + MainKey);
        console.log('register Key: ' + value);
        // let MainKey = "";
        /*switch (tag) {
                    case 0:
                        MainKey = 0; // null 
                        break;
                    case 1:
                        MainKey = 17; // Ctrl 
                        break;
                    case 2:
                        MainKey = 16; // Shift 
                        break;
                    case 3:
                        MainKey = 18; // Alt 
                        break;
                }*/

        document.onkeyup = function (e) {
            HotKeyHandler.currentMainKey = null;
            // console.log("clear main key.");
        };

        document.onkeydown = function (event) {
            if (event.defaultPrevented) {
                return; // Should do nothing if the default action has been cancelled
            }
            // 获取键值
            let bHandled = false;
            let keyValue = '';
            if (event.key !== undefined) {
                // Handle the event with KeyboardEvent.key and set handled true.
                // console.log("event.key");
                keyValue = event.key;
            } else if (event.keyIdentifier !== undefined) {
                // Handle the event with KeyboardEvent.keyIdentifier and set handled true.
                // console.log("event.keyIdentifier");
                keyValue = event.keyIdentifier;
            } else if (event.keyCode !== undefined) {
                // Handle the event with KeyboardEvent.keyCode and set handled true.
                // console.log("event.keyCode");
                keyValue = String.fromCharCode(event.keyCode);
            }

            // console.log("keyValue: " + keyValue);

            if (HotKeyHandler.currentMainKey != null || MainKey == '') {
                if (keyValue == value) {
                    HotKeyHandler.currentMainKey = null;
                    if (func != null) func();
                    bHandled = true;
                }
            }

            if (keyValue == MainKey) {
                HotKeyHandler.currentMainKey = keyValue;
                bHandled = true;
            }

            if (bHandled) {
                // Suppress "double action" if event handled
                event.preventDefault();
            }
        };
    },
};

// popup select dialog
let curUsr = '';
let studyLearnBtn = document.getElementById('studyLearnBtn');
studyLearnBtn.onclick = function () {
    ipcRenderer.on('gui', (event, fun, ...paras) => {
        let parasStr = paras.join('`, `');
        if (paras.length >= 1) {
            parasStr = '`' + parasStr + '`';
        }

        let command = `${fun}(${parasStr})`;
        // console.log('command: ' + command);
        eval(command);

        event.returnValue = 'true';
    });

    let usrDict = ipcRenderer.sendSync('syncMsg', 'readUsrs');
    console.log(usrDict);

    for (let name of usrDict.keys()) {
        appendOpt('usr-select', name);
    }
    appendOpt('usr-select', 'more', 'Add more...');

    let usrName = getSelVal('usr-select');
    // let usrName = usrDict.keys().next().value;
    let levels = usrDict.get(usrName);
    console.log(usrName, levels);

    let usrSel = document.getElementById('usr-select');
    usrSel.addEventListener('change', () => {
        // let txt = usrSel.options[usrSel.selectedIndex].value;
        // console.log("txt: " + txt);
        let name = usrSel.value;
        console.log('user val: ' + name);
        if (name == 'more') {
            // To-Do:
        } else {
            // let lvlSel = document.getElementById('lvl-select');
            // lvlSel.options.length = 0;
            clearOptions('lvl-select');
            for (let lvl of usrDict.get(name)) {
                appendOpt('lvl-select', lvl);
            }
            appendOpt('lvl-select', 'more', 'Add more...');
        }
    });

    for (let lvl of levels) {
        appendOpt('lvl-select', lvl);
    }
    appendOpt('lvl-select', 'more', 'Add more...');

    let lvlSel = document.getElementById('lvl-select');
    lvlSel.addEventListener('change', () => {
        let lvl = lvlSel.value;
        console.log('level val: ' + lvl);
        if (lvl == 'more') {
            curUsr = usrSel.value;
            console.log('current user: ' + curUsr);

            displayOrHide('SelDiag', false);
            let allLvls = ipcRenderer.sendSync('syncMsg', 'readAllLvls');
            console.log('all levels: ' + allLvls);

            let curLvls = usrDict.get(curUsr);
            let bMatch = false;
            for (let lvl of allLvls) {
                for (let curLvl of curLvls) {
                    if (lvl == curLvl) {
                        bMatch = true;
                        break;
                    }
                }
                if (bMatch == true) {
                    bMatch = false;
                    continue;
                }
                appendOpt('newlvl-select', lvl);
            }
            displayOrHide('NewLvlDiag');
        }
    });

    displayOrHide('SelDiag');
    displayOrHide('bg');
    return false;
};

let quitBtn = document.getElementById('quitBtn');
quitBtn.onclick = function () {
    let test_value = confirm('你确定要退出吗？');
    if (test_value == true) {
        // ipc.send('close-main-window');
        ipcRenderer.send('ReciteWordsApp', 'Quit', 'false');
    }
};

// handle with new level dialog
let newCancleBtn = document.getElementById('newCancleBtn');
newCancleBtn.onclick = function () {
    let test_value = confirm('你确定要取消吗？');
    if (test_value == true) {
        displayOrHide('NewLvlDiag', false);
        displayOrHide('SelDiag');
        selIndex('lvl-select', 0);
    }
};

let newlvlConfirmBtn = document.getElementById('newlvlConfirmBtn');
newlvlConfirmBtn.onclick = function () {
    // let newLvlSel = document.getElementById('newlvl-select');
    // let newLvl = newLvlSel.value;
    let newLvl = getSelVal('newlvl-select');
    console.log('new level: ' + newLvl);
    let ret = ipcRenderer.sendSync('syncMsg', 'newLevel', curUsr, newLvl);
    displayOrHide('NewLvlDiag', false);
    displayOrHide('SelDiag');
    // option.options[index].setAttribute("selected", true);
    let lvlSel = document.getElementById('lvl-select');
    selIndex('lvl-select', 0);
    if (ret == true) {
        appendOpt('lvl-select', newLvl);
    }
};

// popup recite dialog
let confirmBtn = document.getElementById('confirmBtn');
confirmBtn.onclick = function () {
    let usrName = getSelVal('usr-select');
    let level = getSelVal('lvl-select');
    console.log(`selUser: ${usrName}, Level: ${level}`);

    let bLevelDone = true;
    try {
        bLevelDone = ipcRenderer.sendSync('syncMsg', 'isLevelDone', usrName, level);
    } catch (e) {
        console.error(e);
        return;
    }
    if (bLevelDone == true) {
        console.log(`User: ${usrName}, Level: ${level} is done!`);
        return;
    } else if (bLevelDone == false) {
        console.log(`User: ${usrName}, Level: ${level} is not done!`);

        displayOrHide('SelDiag', false);
        displayOrHide('ReciteDiag');

        // Enter
        HotKeyHandler.Register('', 'Enter', function () {
            // console.log("enter was clicked!");
            let word = getValue('word');
            ipcRenderer.send('ReciteWordsApp', 'Check_Input', word);
        });

        ipcRenderer.send('ReciteWordsApp', 'Go', usrName, level);
    } else {
        console.error(bLevelDone);
    }
};

let closeBtn = document.getElementById('closeBtn');
closeBtn.onclick = function () {
    let test_value = confirm('你确定要退出吗？');
    if (test_value == true) {
        displayOrHide('ReciteDiag', false);
        displayOrHide('bg', false);
        // ipc.send('close-main-window');
        ipcRenderer.send('ReciteWordsApp', 'Quit');
    }
};

let againBtn = document.getElementById('againBtn');
againBtn.onclick = function () {
    ipcRenderer.send('ReciteWordsApp', 'PlayAudio');
};
let forgetBtn = document.getElementById('forgetBtn');
forgetBtn.onclick = function () {
    ipcRenderer.send('ReciteWordsApp', 'Forgoten');
};
let chopBtn = document.getElementById('chopBtn');
chopBtn.onclick = function () {
    ipcRenderer.send('ReciteWordsApp', 'Chop');
};

/*
        // 鼠标拖拽功能
        var reciteDiag_title = document.getElementById('ReciteDiag-title');
        reciteDiag_title.onmousedown = function (e) {
            e = e || window.event;
            var x = e.pageX || e.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
            var y = e.pageY || e.clientY + (document.body.scrollTop || document.documentElement.scrollTop);

            var boxX = ReciteDiag.offsetLeft;
            var boxY = ReciteDiag.offsetTop;

            var mouse_in_boxX = x - boxX;
            var mouse_in_boxY = y - boxY;

            document.onmousemove = function (e) {
                var x = e.pageX || e.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
                var y = e.pageY || e.clientY + (document.body.scrollTop || document.documentElement.scrollTop);

                reciteDiag.style.left = x - mouse_in_boxX + 256 + 'px';
                reciteDiag.style.top = y - mouse_in_boxY - 142 + 'px';
            }
        }
        reciteDiag_title.onmouseup = function () {
            document.onmousemove = null;
        }
        */

function loadAndPlayAudio(audioFile) {
    // console.log(audioFile);
    let webAudio = document.getElementById('webAudio');
    let source = document.getElementById('audioSource');
    source.src = 'file:///' + audioFile;

    webAudio.load(); //call this to just preload the audio without playing
    webAudio.addEventListener(
        'canplaythrough',
        function () {
            webAudio.play(); //call this to play the song right away
        },
        false
    );
}

function playAudio() {
    let webAudio = document.getElementById('webAudio');
    webAudio.play(); //call this to play the song right away
}

function modifyValue(id, valueStr) {
    let ele = document.getElementById(id);
    if (ele.value === undefined) {
        // console.log(`innerHTML of ${id}: ${ele.innerHTML}`);
        ele.innerHTML = valueStr;
    } else {
        // console.log(`value of ${id}: ${ele.value} to ${valueStr}.`);
        ele.value = valueStr;
    }
}

function getValue(id) {
    let ele = document.getElementById(id);
    if (ele.value) {
        // console.log(`value of ${id}: ${ele.value}`);
        return ele.value;
    } else {
        // console.log(`innerHTML of ${id}: ${ele.innerHTML}`);
        return ele.innerHTML;
    }
}
