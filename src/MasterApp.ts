// MasterApp.ts
import { BrowserWindow, app, dialog } from 'electron';
import * as path from "path";
import { dictApp } from "./dictApp";
import { ReciteWordsApp } from "./ReciteWordsApp";
import { globalVar } from "./utils/globalInterface";

export class MasterApp {
    private _myApp: any;
    private _win: BrowserWindow;

    public get myApp() {
        return this._myApp;
    }

    private async WaitForElectronAppReady() {
        if (app.isReady()) return Promise.resolve();

        return new Promise((resolve) => {
            const iid = setInterval(() => {
                if (app.isReady()) {
                    clearInterval(iid);
                    resolve(null);
                }
            }, 10);
        });
    }

    private EnsureSingleInstance(): boolean {
        // if (this.env_ === 'dev') return false;

        const gotTheLock = app.requestSingleInstanceLock();

        if (!gotTheLock) {
            // Another instance is already running - exit
            app.quit();
            return true;
        }

        // Someone tried to open a second instance - focus our window instead
        let _this = this;
        app.on('second-instance', () => {
            const win = _this._win;
            if (!win) return;
            if (win.isMinimized()) win.restore();
            win.show();
            win.focus();
        });

        return false;
    }

    public async Run(argvs: any): Promise<void> {
        // Since we are doing other async things before creating the window, we might miss
        // the "ready" event. So we use the function below to make sure that the app is ready.
        await this.WaitForElectronAppReady();

        const alreadyRunning = this.EnsureSingleInstance();
        if (alreadyRunning) return;

        let sel = -1;
        if (argvs.typ) {
            if (argvs.typ == "r") {
                sel = 1;
            }
            else if (argvs.typ == "d" || argvs.typ == "c") {
                sel = 0;
            }
        } else {
            let ret = await dialog.showMessageBox({
                type: "info",
                message: "Select a application",
                buttons: ["Dictionary", "ReciteWords"]
            });

            sel = ret.response;
        }

        let startPath = "";
        // if (process.env.NODE_ENV === 'development') {
        if (argvs.bDev) {
            startPath = path.join(process.cwd(), "/publish/");
        }
        else {
            startPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(), "../");
        }

        console.log(startPath);

        if (sel == 1) {
            this._myApp = new ReciteWordsApp(startPath);
            this._myApp.name = "ReciteWords";
            globalVar.app = this._myApp;
        }
        else if (sel == 0) {
            this._myApp = new dictApp(startPath);
            this._myApp.name = "Dictionary";
            globalVar.app = this._myApp;
        }
        else {
            app.quit();
        }

        try {
            this._myApp.Run(argvs);
        } catch (e) {
            console.error(`ElectronApp fatal error: ${e}`);
        };

        app.on('before-quit', () => {
            // this.willQuitApp_ = true;
        });

        app.on('window-all-closed', () => {
            app.quit();
        });

        app.on('activate', () => {
            this._win.show();
        });
    }
}