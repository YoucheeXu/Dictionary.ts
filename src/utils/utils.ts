import * as fs from "fs";
import { BrowserWindow } from 'electron';

export function RemoveDir(dir: string) {
    if (fs.existsSync(dir) == true) {
        if (fs.statSync(dir).isDirectory()) {
            let files = fs.readdirSync(dir);
            files.forEach((file, index) => {
                let currentPath = dir + "/" + file;
                if (fs.statSync(currentPath).isDirectory()) {
                    RemoveDir(currentPath);
                } else {
                    fs.unlinkSync(currentPath);
                }
            });
            fs.rmdirSync(dir);
        } else {
            fs.unlinkSync(dir);
        }
    };
}

/**
* 异步等待对象的生成，对象生成完成返回生成的对象
* @param getter 对象的获取函数
* @param checkInterval 检查粒度，ms
* @param timeout 超时时间, ms
*/
export const asyncCheck = async<T>(getter: () => T, checkInterval = 100, timeout = 1000) => {
    return new Promise<T>(x => {
        const check = (num = 0) => {
            const target = getter();
            if (target !== undefined && target !== null) {
                x(target)
            } else if (num > timeout / checkInterval) {// 超时
                x(target)
            } else {
                setTimeout(() => check(++num), checkInterval);
            }
        };
        check();
    });
}

/**
 * 扩展Date的Format函数
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param {[type]} fmt [description]
 */
/*
Date.prototype.Format = function (fmt: string) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
*/

/**
 * must no same element in array
 *
 * @export
 * @template T
 * @param {T[]} oldArray
 * @return {*}  {T[]}
 */
export function randomArray<T>(oldArray: T[]): T[] {

    let newArray: T[] = new Array();

    for (let i = 0, oldTotalLen = oldArray.length; i < oldTotalLen;) {
        let currentRandom = Number((Math.random() * oldTotalLen).toFixed(0));
        if (currentRandom >= oldTotalLen) {
            currentRandom = oldTotalLen - 1;
        }
        if (!newArray.includes(oldArray[currentRandom])) {
            newArray.push(oldArray[currentRandom]);
            i++;
        }
    }
    return newArray;
}

export function randomArray2<T>(arr: T[]) {
    for (let i = 0, len = arr.length; i < len; i++) {
        let currentRandom = Number((Math.random() * (len - 1)).toFixed(0));
        let current = arr[i];
        arr[i] = arr[currentRandom];
        arr[currentRandom] = current;
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
// let time1 = new Date().Format("yyyy-MM-dd");
// let time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
/*export function formatDate(date: Date, fmt: string): string {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S+": date.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
    // for(const k of Object.keys(o))
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};*/

/*
Date.prototype.toLocaleString = function () {   // 重写日期函数格式化日期
    return `${this.getFullYear()}-${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}-${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()} ${this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()}:${this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()}:${this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds()}`;
};
Date.prototype.toLocaleDateString = function () {   // 重写日期函数格式化日期
    return `${this.getFullYear()}-${this.getMonth() + 1 >= 10 ? (this.getMonth() + 1) : '0' + (this.getMonth() + 1)}-${this.getDate() >= 10 ? this.getDate() : '0' + this.getDate()}`;
};
Date.prototype.toLocaleTimeString = function () {   // 重写日期函数格式化日期
    return `${this.getHours() >= 10 ? this.getHours() : '0' + this.getHours()}:${this.getMinutes() >= 10 ? this.getMinutes() : '0' + this.getMinutes()}:${this.getSeconds() >= 10 ? this.getSeconds() : '0' + this.getSeconds()}`;
};
console.info(now.toLocaleString()); //2020-11-14 14:00:46
console.info(now.toLocaleDateString()); //2020-11-14
console.info(now.toLocaleTimeString()); //14:00:46
*/
export function formatDate(data: Date): string {
    return `${data.getFullYear()}-${data.getMonth() + 1 >= 10 ? (data.getMonth() + 1) : '0' + (data.getMonth() + 1)}-${data.getDate() >= 10 ? data.getDate() : '0' + data.getDate()}`;
}

/**
 *
 *
 * @param {string} url      url of file to download
 * @param {string} local    loal path and name where file to save and rename it
 * @param {*} caller        调用域
 * @param {Function} notify 指定的回调方法（兼容.bind(this) 也可以不加.bind(this) ） 
 *                          (local: string, progress: number, state: ('ongoing' | 'fail' | 'done')) => void
 */
// export function download_file(win: BrowserWindow, url: string, local: string, caller: any, notify: Function) {
/*
export function download_file(win: BrowserWindow, url: string, local: string, caller: any, notify: Function) {
    win.webContents.session.on('will-download', (event, item, webContents) => {
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
                notify.call(caller, local, -1, "fail");
            }
        });

        item.on('done', (event, state) => {
            if (state === 'completed') {
                // 这里是主战场
                notify.call(caller, local, 1, "done");
            }
            else {
                console.error(state);
                notify.call(caller, local, -1, "fail");
            }
        })

        // 是否可恢复下载
        if (item.canResume()) {
            item.resume()
        }

    })
    win.webContents.downloadURL(url);
}*/