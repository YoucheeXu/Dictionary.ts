// main.ts
import { ipcMain } from 'electron';
import { MasterApp } from './MasterApp';

interface KeyValue {
    [key: string]: any
}

var argvs: KeyValue = {};

for (let argv of process.argv) {
    console.log(argv);

    let paraStrtIndex = argv.indexOf("--");
    if (paraStrtIndex >= 0) {
        let paraEndtIndex = argv.indexOf(" ");
        let para = "";
        if (paraEndtIndex > 0) {
            para = argv.substring(paraStrtIndex + 2, paraEndtIndex);
        } else {
            para = argv.substring(paraStrtIndex + 2);
        }
        if (para == "type") {
            argvs.typ = argv.substring(7);
        } else if (para == "q") {
            argvs.word = argv.substring(4);
        } else if (para == "dev") {
            argvs.bDev = true;
        }
    }
}

try {
    let myApp = new MasterApp();
    myApp.Run(argvs)
}
catch (e) {
    console.error(`ElectronApp fatal error: ${e}`);
};


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
        // console.error(`Fail to exec ${command} because ${(e as Error).message}`);
        console.error(`Fail to exec ${command} because ${e}`);
        event.returnValue = e;
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
        console.error(`Fail to exec ${command} because ${(e as Error).message}`);
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
        console.error(`Fail to exec ${command} because ${(e as Error).message}`);
    }

    // asynchronous-reply
    // event.reply('log', 'pong');
    event.returnValue = 'true';
});
