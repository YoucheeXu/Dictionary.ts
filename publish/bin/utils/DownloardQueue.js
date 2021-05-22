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
var fs = __importStar(require("fs"));
var DownloardQueue = /** @class */ (function () {
    function DownloardQueue(win) {
        this.win = win;
        this.downloadQueue = new Array();
        this.bDownloading = false;
    }
    DownloardQueue.prototype.AddQueue = function (url, local, caller, notify) {
        for (var _i = 0, _a = this.downloadQueue; _i < _a.length; _i++) {
            var item = _a[_i];
            var urlinQueue = item["url"];
            if (urlinQueue == url) {
                return;
            }
        }
        this.downloadQueue.push({ url: url, local: local, caller: caller, notify: notify });
        this.downloadNext();
    };
    DownloardQueue.prototype.downloadNext = function () {
        if (!this.bDownloading) {
            if (this.downloadQueue.length != 0) {
                var valMap = this.downloadQueue.pop();
                this.bDownloading = true;
                // this.download_file(valMap.get("url"), valMap.get("local"), valMap.get("caller"), valMap.get("notify"));
                this.download_file(valMap.url, valMap.local, valMap.caller, valMap.notify);
            }
        }
    };
    DownloardQueue.prototype.download_file = function (url, local, caller, notify) {
        var _this = this;
        if (fs.existsSync(local) == true) {
            console.log("Already exists " + local);
            return;
        }
        this.win.webContents.session.on('will-download', function (event, item, webContents) {
            item.setSavePath(local);
            item.on('updated', function (e, state) {
                if (state === 'progressing') {
                    if (item.isPaused()) {
                    }
                    else {
                        var totalBytes = item.getTotalBytes();
                        if (totalBytes == 0) {
                            totalBytes = 0.0001;
                        }
                        var progress = item.getReceivedBytes() / totalBytes;
                        notify.call(caller, local, progress, "ongoing");
                    }
                }
                else {
                    console.error(state);
                    notify.call(caller, local, -1, "fail", state);
                    _this.bDownloading = false;
                    _this.downloadNext();
                }
            });
            item.on('done', function (event, state) {
                if (state === 'completed') {
                    // 这里是主战场
                    notify.call(caller, local, 1, "done");
                    _this.bDownloading = false;
                    _this.downloadNext();
                }
                else {
                    console.error(state);
                    notify.call(caller, local, -1, "fail", state);
                    _this.bDownloading = false;
                }
            });
            // 是否可恢复下载
            if (item.canResume()) {
                item.resume();
            }
        });
        this.win.webContents.downloadURL(url);
    };
    return DownloardQueue;
}());
exports.DownloardQueue = DownloardQueue;
//# sourceMappingURL=DownloardQueue.js.map