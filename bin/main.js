"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// import { dictApp } from "./dictApp";
// import { ReciteWordsApp } from "./ReciteWordsApp";
var globalInterface_1 = require("./utils/globalInterface");
var ElectronApp_1 = require("./ElectronApp");
// declare global {
//     interface Window {
//         require: any;
//     }
// }
// const globalAny: any = global;
globalInterface_1.globalVar.argvs = process.argv;
console.log('params: ', globalInterface_1.globalVar.argvs);
var typ = "";
var typIndex = -1;
for (var _i = 0, _a = globalInterface_1.globalVar.argvs; _i < _a.length; _i++) {
    var argv = _a[_i];
    typIndex = argv.indexOf("--type ");
    if (typIndex >= 0) {
        console.log(argv);
        typ = argv.substring(7);
        break;
    }
    else {
        typ = "?";
    }
}
globalInterface_1.globalVar.typ = typ;
/*if (typ == "r") {
    let myApp: ReciteWordsApp = new ReciteWordsApp();
    globalVar.app = myApp;
}
else {
    let myApp: dictApp = new dictApp();
    globalVar.app = myApp;
}*/
var bDev = (globalInterface_1.globalVar.argvs.indexOf("--dev") >= 0);
var myApp = new ElectronApp_1.ElectronApp();
myApp.Start(typ, bDev).catch(function (error) {
    console.error("ElectronApp fatal error: " + error);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//-----------------------------------------------------------------
//监听与渲染进程的通信
electron_1.ipcMain.on('syncMsg', function (event, fun) {
    var paras = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paras[_i - 2] = arguments[_i];
    }
    var parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    var command = "myApp.myApp." + fun + "(" + parasStr + ")";
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        event.returnValue = eval(command);
    }
    catch (e) {
        console.exception("Fail to exec " + command + " because " + e.message);
        event.returnValue = 'false';
    }
});
electron_1.ipcMain.on('dictApp', function (event, fun) {
    var paras = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paras[_i - 2] = arguments[_i];
    }
    var parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    var command = "myApp.myApp." + fun + "(" + parasStr + ")";
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        eval(command);
    }
    catch (e) {
        console.exception("Fail to exec " + command + " because " + e.message);
    }
    event.returnValue = 'true';
});
electron_1.ipcMain.on('ReciteWordsApp', function (event, fun) {
    var paras = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paras[_i - 2] = arguments[_i];
    }
    var parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    var command = "myApp.myApp." + fun + "(" + parasStr + ")";
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        eval(command);
    }
    catch (e) {
        console.exception("Fail to exec " + command + " because " + e.message);
    }
    // asynchronous-reply
    // event.reply('log', 'pong');
    event.returnValue = 'true';
});
//# sourceMappingURL=main.js.map