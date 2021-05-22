import * as path from "path";
import { BrowserWindow, app, dialog } from 'electron';
import { dictApp } from "./dictApp";
import { ReciteWordsApp } from "./ReciteWordsApp";
import { globalVar } from "./utils/globalInterface";
import { fstat } from "fs";

export class ElectronApp {
    private win: BrowserWindow;
    private myApp: any;

    async waitForElectronAppReady() {
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

    public ensureSingleInstance(): boolean {
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
            const win = _this.win;
            if (!win) return;
            if (win.isMinimized()) win.restore();
            win.show();
            win.focus();
        });

        return false;
    }

    public async Start(typ: string, bDev: boolean) {
        // Since we are doing other async things before creating the window, we might miss
        // the "ready" event. So we use the function below to make sure that the app is ready.
        await this.waitForElectronAppReady();

        const alreadyRunning = this.ensureSingleInstance();
        if (alreadyRunning) return;

        let sel = -1;
        if (typ == "?") {
            let ret = await dialog.showMessageBox({
                type: "info",
                message: "Select a application",
                buttons: ["Dictionary", "ReciteWords"]
            });

            sel = ret.response;
        }
        else if (typ == "r") {
            sel = 1;
        }
        else if (typ == "d") {
            sel = 0;
        }

        if (sel == 1) {
            this.myApp = new ReciteWordsApp();
            globalVar.app = this.myApp;
        }
        else if (sel == 0) {
            this.myApp = new dictApp();
            globalVar.app = this.myApp;
        }
        else {
            app.quit();
        }

        let startPath = "";
        // if (process.env.NODE_ENV === 'development') {
        if (bDev) {
            startPath = path.join(process.cwd(), "/publish/");
        }
        else {
            startPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(), "../");
        }

        console.log(startPath);

        this.myApp.Start(bDev, startPath).catch((error: any) => {
            console.error(`ElectronApp fatal error: ${error}`);
        });

        app.on('before-quit', () => {
            // this.willQuitApp_ = true;
        });

        app.on('window-all-closed', () => {
            app.quit();
        });

        app.on('activate', () => {
            this.win.show();
        });
    }
}