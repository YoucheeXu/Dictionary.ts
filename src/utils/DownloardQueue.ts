import * as fs from "fs";
import { BrowserWindow } from 'electron';

export class DownloardQueue {
    private downloadQueue = new Array();
    private bDownloading = false;

    constructor(readonly win: BrowserWindow) {

    }

    public AddQueue(url: string, local: string, caller: any, notify: Function) {
        for (let item of this.downloadQueue) {
            let urlinQueue = item["url"];
            if (urlinQueue == url) {
                return;
            }
        }
        this.downloadQueue.push({ url: url, local: local, caller: caller, notify: notify });
        this.downloadNext();
    }

    private downloadNext() {
        if (!this.bDownloading) {
            if (this.downloadQueue.length != 0) {
                let valMap = this.downloadQueue.pop();
                this.bDownloading = true;
                // this.download_file(valMap.get("url"), valMap.get("local"), valMap.get("caller"), valMap.get("notify"));
                this.download_file(valMap.url, valMap.local, valMap.caller, valMap.notify);
            }
        }
    }

    private download_file(url: string, local: string, caller: any, notify: Function) {
        if (fs.existsSync(local) == true) {
            console.log("Already exists " + local);
            return;
        }

        this.win.webContents.session.on('will-download', (event, item, webContents) => {
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
                        notify.call(caller, local, progress, "ongoing");
                    }
                } else {
                    console.error(state);
                    notify.call(caller, local, -1, "fail", state);
                    this.bDownloading = false;
                    this.downloadNext();
                }
            });

            item.on('done', (event, state) => {
                if (state === 'completed') {
                    // 这里是主战场
                    notify.call(caller, local, 1, "done");
                    this.bDownloading = false;
                    this.downloadNext();
                }
                else {
                    console.error(state);
                    notify.call(caller, local, -1, "fail", state);
                    this.bDownloading = false;
                }
            })

            // 是否可恢复下载
            if (item.canResume()) {
                item.resume()
            }

        })
        this.win.webContents.downloadURL(url);
    }
}