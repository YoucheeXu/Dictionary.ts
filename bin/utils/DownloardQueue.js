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
exports.DownloardQueue = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const globalInterface_1 = require("./globalInterface");
class DownloardQueue {
    constructor(_win) {
        this._win = _win;
        this._downloadQueue = new Array();
        this._bDownloading = false;
    }
    IsFnshd() {
        if (this._downloadQueue.length == 0 && this._bDownloading == false) {
            return true;
        }
        else {
            return false;
        }
    }
    Dealer(cb, word, dfile, progress, state, why) {
        console.log(`${(progress * 100).toFixed(2)}% of ${dfile} was ${state} to download`);
        let gApp = globalInterface_1.globalVar.app;
        let ext = path.extname(dfile);
        console.log(ext);
        switch (state) {
            case 'ongoing':
                break;
            case 'fail':
                if (ext == ".json") {
                    gApp.Info(-1, 1, word, `Fail to download dict of ${word}, because of ${why}`);
                }
                else {
                    gApp.Info(-1, 2, word, `Fail to download audio of ${word}, because of ${why}`);
                }
                break;
            case 'done':
                cb(dfile);
                break;
        }
    }
    AddQueue(word, url, local, cb) {
        for (let item of this._downloadQueue) {
            let urlinQueue = item["url"];
            if (urlinQueue == url) {
                return;
            }
        }
        this._downloadQueue.push({ word: word, url: url, local: local, notify: cb });
        this.DownloadNext();
    }
    DownloadNext() {
        if (!this._bDownloading) {
            if (this._downloadQueue.length > 0) {
                let valMap = this._downloadQueue.pop();
                this._bDownloading = true;
                this.DownloadFile(valMap.word, valMap.url, valMap.local, valMap.notify);
            }
        }
    }
    DownloadFile(word, url, local, cb) {
        if (fs.existsSync(local) == true) {
            console.log("Already exists " + local);
            return;
        }
        let _this = this;
        _this._win.webContents.session.on('will-download', (event, item, webContents) => {
            item.setSavePath(local);
            item.on('updated', (e, state) => {
                if (state === 'progressing') {
                    if (item.isPaused()) {
                    }
                    else {
                        let totalBytes = item.getTotalBytes();
                        if (totalBytes == 0) {
                            totalBytes = 0.0001;
                        }
                        const progress = item.getReceivedBytes() / totalBytes;
                        _this.Dealer(cb, word, local, progress, "ongoing", state + " in updated");
                    }
                }
                else {
                    _this.Dealer(cb, word, local, -1, "fail", state + " in updated");
                    _this._bDownloading = false;
                    _this.DownloadNext();
                }
            });
            item.on('done', (event, state) => {
                if (state === 'completed') {
                    // 这里是主战场
                    _this.Dealer(cb, word, local, 1, "done");
                    _this._bDownloading = false;
                    _this.DownloadNext();
                }
                else {
                    _this.Dealer(cb, word, local, -1, "fail", state + " in done");
                    _this._bDownloading = false;
                    _this.DownloadNext();
                }
            });
            // 是否可恢复下载
            if (item.canResume()) {
                item.resume();
            }
        });
        this._win.webContents.downloadURL(url);
    }
}
exports.DownloardQueue = DownloardQueue;
//# sourceMappingURL=DownloardQueue.js.map