import { ipcMain, dialog } from 'electron';
// import { dictApp } from "./dictApp";
// import { ReciteWordsApp } from "./ReciteWordsApp";
import { globalVar } from "./utils/globalInterface";
import { ElectronApp } from "./ElectronApp";

// declare global {
//     interface Window {
//         require: any;
//     }
// }
// const globalAny: any = global;

globalVar.argvs = process.argv;
console.log('params: ', globalVar.argvs)

let typ = "";

let typIndex = -1;

for (let argv of globalVar.argvs) {
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

globalVar.typ = typ;

/*if (typ == "r") {
    let myApp: ReciteWordsApp = new ReciteWordsApp();
    globalVar.app = myApp;
}
else {
    let myApp: dictApp = new dictApp();
    globalVar.app = myApp;
}*/

const bDev = (globalVar.argvs.indexOf("--dev") >= 0);

let myApp = new ElectronApp();

myApp.Start(typ, bDev).catch((error: any) => {
    console.error(`ElectronApp fatal error: ${error}`);
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//-----------------------------------------------------------------
//监听与渲染进程的通信

ipcMain.on('syncMsg', async (event: any, fun: string, ...paras: string[]) => {
    let parasStr: string = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }

    let command: string = `myApp.myApp.${fun}(${parasStr})`;
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);

    try {
        // event.returnValue = eval(command);
        event.returnValue = await eval(command);
    }
    catch (e) {
        console.error(`Fail to exec ${command} because ${(e as Error).message}`);
        event.returnValue = 'false';
    }
});

ipcMain.on('dictApp', (event: any, fun: string, ...paras: string[]) => {
    let parasStr: string = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }

    let command: string = `myApp.myApp.${fun}(${parasStr})`;
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);

    try {
        eval(command);
    }
    catch (e) {
        console.exception(`Fail to exec ${command} because ${(e as Error).message}`);
    }

    event.returnValue = 'true';
});

ipcMain.on('ReciteWordsApp', (event: any, fun: string, ...paras: string[]) => {
    let parasStr: string = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }

    let command: string = `myApp.myApp.${fun}(${parasStr})`;
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);

    try {
        eval(command);
    }
    catch (e) {
        console.exception(`Fail to exec ${command} because ${(e as Error).message}`);
    }

    // asynchronous-reply
    // event.reply('log', 'pong');
    event.returnValue = 'true';
});
