"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterApp = void 0;
// MasterApp.ts
const electron_1 = require("electron");
const path = __importStar(require("path"));
const dictApp_1 = require("./dictApp");
const ReciteWordsApp_1 = require("./ReciteWordsApp");
const globalInterface_1 = require("./utils/globalInterface");
class MasterApp {
    get myApp() {
        return this._myApp;
    }
    async WaitForElectronAppReady() {
        if (electron_1.app.isReady())
            return Promise.resolve();
        return new Promise((resolve) => {
            const iid = setInterval(() => {
                if (electron_1.app.isReady()) {
                    clearInterval(iid);
                    resolve(null);
                }
            }, 10);
        });
    }
    EnsureSingleInstance() {
        // if (this.env_ === 'dev') return false;
        const gotTheLock = electron_1.app.requestSingleInstanceLock();
        if (!gotTheLock) {
            // Another instance is already running - exit
            electron_1.app.quit();
            return true;
        }
        // Someone tried to open a second instance - focus our window instead
        let _this = this;
        electron_1.app.on('second-instance', () => {
            const win = _this._win;
            if (!win)
                return;
            if (win.isMinimized())
                win.restore();
            win.show();
            win.focus();
        });
        return false;
    }
    async Run(argvs) {
        // Since we are doing other async things before creating the window, we might miss
        // the "ready" event. So we use the function below to make sure that the app is ready.
        await this.WaitForElectronAppReady();
        const alreadyRunning = this.EnsureSingleInstance();
        if (alreadyRunning)
            return;
        let sel = -1;
        if (argvs.typ) {
            if (argvs.typ == "r") {
                sel = 1;
            }
            else if (argvs.typ == "d" || argvs.typ == "c") {
                sel = 0;
            }
        }
        else {
            // let ret = await dialog.showMessageBox({
            //     type: "info",
            //     message: "Select a application",
            //     buttons: ["Dictionary", "ReciteWords"]
            // });
            // sel = ret.response;
            let ret = await electron_1.dialog.showMessageBox({
                type: "info",
                message: "Select a application",
                buttons: ["Dictionary", "ReciteWords"],
                cancelId: 2 // 点击x号关闭返回值
            });
            sel = ret.response;
        }
        let startPath = "";
        // if (process.env.NODE_ENV === 'development') {
        if (argvs.bDev) {
            startPath = path.join(process.cwd(), "./");
        }
        else {
            startPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(), "../");
        }
        if (sel == 1) {
            this._myApp = new ReciteWordsApp_1.ReciteWordsApp(startPath);
            this._myApp.name = "ReciteWords";
            globalInterface_1.globalVar.app = this._myApp;
        }
        else if (sel == 0) {
            this._myApp = new dictApp_1.dictApp(startPath);
            this._myApp.name = "Dictionary";
            globalInterface_1.globalVar.app = this._myApp;
        }
        else {
            electron_1.app.quit();
            return;
        }
        try {
            this._myApp.Run(argvs);
        }
        catch (e) {
            console.error(`ElectronApp fatal error: ${e}`);
        }
        ;
        electron_1.app.on('before-quit', () => {
            // this.willQuitApp_ = true;
        });
        electron_1.app.on('window-all-closed', () => {
            electron_1.app.quit();
        });
        electron_1.app.on('activate', () => {
            this._win.show();
        });
    }
}
exports.MasterApp = MasterApp;
//# sourceMappingURL=MasterApp.js.map