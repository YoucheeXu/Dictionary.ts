"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts
const electron_1 = require("electron");
const MasterApp_1 = require("./MasterApp");
var argvs = {};
for (let argv of process.argv) {
    console.log(argv);
    let paraStrtIndex = argv.indexOf("--");
    if (paraStrtIndex >= 0) {
        let paraEndtIndex = argv.indexOf(" ");
        let para = "";
        if (paraEndtIndex > 0) {
            para = argv.substring(paraStrtIndex + 2, paraEndtIndex);
        }
        else {
            para = argv.substring(paraStrtIndex + 2);
        }
        if (para == "type") {
            argvs.typ = argv.substring(7);
        }
        else if (para == "q") {
            argvs.word = argv.substring(4);
        }
        else if (para == "dev") {
            argvs.bDev = true;
        }
    }
}
try {
    var myApp = new MasterApp_1.MasterApp();
    myApp.Run(argvs);
}
catch (e) {
    console.error(`ElectronApp fatal error: ${e}`);
}
;
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//-----------------------------------------------------------------
//监听与渲染进程的通信
electron_1.ipcMain.on('syncMsg', async (event, fun, ...paras) => {
    let parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    let command = `myApp.myApp.${fun}(${parasStr})`;
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        // event.returnValue = eval(command);
        event.returnValue = await eval(command);
    }
    catch (e) {
        // console.error(`Fail to exec ${command} because ${(e as Error).message}`);
        console.error(`Fail to exec ${command} because ${e}`);
        event.returnValue = e;
    }
});
electron_1.ipcMain.on('dictApp', (event, fun, ...paras) => {
    let parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    let command = `myApp.myApp.${fun}(${parasStr})`;
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        eval(command);
    }
    catch (e) {
        console.error(`Fail to exec ${command} because ${e.message}`);
    }
    event.returnValue = 'true';
});
electron_1.ipcMain.on('ReciteWordsApp', (event, fun, ...paras) => {
    let parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    let command = `myApp.myApp.${fun}(${parasStr})`;
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        eval(command);
    }
    catch (e) {
        console.error(`Fail to exec ${command} because ${e.message}`);
    }
    // asynchronous-reply
    // event.reply('log', 'pong');
    event.returnValue = 'true';
});
//# sourceMappingURL=main.js.map