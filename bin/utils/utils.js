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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adler32FromBuffer = exports.BufferConcat = exports.DecodeBytes = exports.Num2Bytes = exports.Bytes2Num = exports.formatTime = exports.formatDate = exports.randomArray2 = exports.randomArray = exports.asyncCheck = exports.pathExists = exports.RemoveDir = void 0;
const fs = __importStar(require("fs"));
const jdataview_1 = __importDefault(require("jdataview"));
const ADLER32 = __importStar(require("adler-32"));
function RemoveDir(dir) {
    if (fs.existsSync(dir) == true) {
        if (fs.statSync(dir).isDirectory()) {
            let files = fs.readdirSync(dir);
            files.forEach((file, index) => {
                let currentPath = dir + "/" + file;
                if (fs.statSync(currentPath).isDirectory()) {
                    RemoveDir(currentPath);
                }
                else {
                    fs.unlinkSync(currentPath);
                }
            });
            fs.rmdirSync(dir);
        }
        else {
            fs.unlinkSync(dir);
        }
    }
    ;
}
exports.RemoveDir = RemoveDir;
function pathExists(p) {
    try {
        fs.accessSync(p);
    }
    catch (err) {
        return false;
    }
    return true;
}
exports.pathExists = pathExists;
/**
* 异步等待对象的生成，对象生成完成返回生成的对象
* @param getter 对象的获取函数
* @param checkInterval 检查粒度，ms
* @param timeout 超时时间, ms
*/
const asyncCheck = async (getter, checkInterval = 100, timeout = 1000) => {
    return new Promise(x => {
        const check = (num = 0) => {
            const target = getter();
            if (target !== undefined && target !== null) {
                x(target);
            }
            else if (num > timeout / checkInterval) { // 超时
                x(target);
            }
            else {
                setTimeout(() => check(++num), checkInterval);
            }
        };
        check();
    });
};
exports.asyncCheck = asyncCheck;
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
function randomArray(oldArray) {
    let newArray = new Array();
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
exports.randomArray = randomArray;
function randomArray2(arr) {
    for (let i = 0, len = arr.length; i < len; i++) {
        let currentRandom = Number((Math.random() * (len - 1)).toFixed(0));
        let current = arr[i];
        arr[i] = arr[currentRandom];
        arr[currentRandom] = current;
    }
}
exports.randomArray2 = randomArray2;
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
console.info(now.toLocaleString()); // 2020-11-14 14:00:46
console.info(now.toLocaleDateString()); // 2020-11-14
console.info(now.toLocaleTimeString()); // 14:00:46
*/
// 2021-09-04
function formatDate(data) {
    return `${data.getFullYear()}-${data.getMonth() + 1 >= 10 ? (data.getMonth() + 1) : '0' + (data.getMonth() + 1)}-${data.getDate() >= 10 ? data.getDate() : '0' + data.getDate()}`;
}
exports.formatDate = formatDate;
// 2021-09-04 15:49:54
function formatTime(data) {
    return `${data.getFullYear()}-${data.getMonth() + 1 >= 10 ? (data.getMonth() + 1) : '0' + (data.getMonth() + 1)}-${data.getDate() >= 10 ? data.getDate() : '0' + data.getDate()} ${data.getHours() >= 10 ? data.getHours() : '0' + data.getHours()}:${data.getMinutes() >= 10 ? data.getMinutes() : '0' + data.getMinutes()}:${data.getSeconds() >= 10 ? data.getSeconds() : '0' + data.getSeconds()}`;
}
exports.formatTime = formatTime;
function Bytes2Num(format, buf, offset, length) {
    let bLittleEndian = (format[0] == "<");
    let jdv = new jdataview_1.default(buf, offset, length, bLittleEndian);
    let typ = format[1];
    if (typ == "B") {
        return jdv.getUint8();
    }
    else if (typ == "H") {
        return jdv.getUint16();
    }
    else if (typ == "I" || typ == 'L') {
        return jdv.getUint32();
    }
    else if (typ == "Q") {
        let bigNum = jdv.getUint64();
        let value = bigNum.valueOf();
        // if (bigNum.hi > 0) {
        if (!Number.isSafeInteger(value)) {
            throw new Error(`${value} exceeds MAX_SAFE_INTEGER. Precision may be lost`);
        }
        return value;
    }
    else {
        throw new Error(`Don't support to convert to type of number: ${typ}`);
    }
}
exports.Bytes2Num = Bytes2Num;
function Num2Bytes(format, num) {
    // let bLittleEndian = (format[0] == "<");
    let endian = (format[0] == "<") ? 'LE' : 'BE';
    let typ = format[1];
    if (typ == "L") {
        let buf = Buffer.alloc(4);
        let fcn = `buf.writeUInt32${endian}(${num})`;
        eval(fcn);
        return buf;
    }
    else if (typ == "Q") {
        let buf = Buffer.allocUnsafe(8);
        let fcn = `buf.writeBigUInt64${endian}(64)`;
        eval(fcn);
        return buf;
    }
    else {
        throw new Error(`Don't support convert from type of number: ${typ}`);
    }
}
exports.Num2Bytes = Num2Bytes;
function DecodeBytes(buf, code = 'utf-8') {
    let decoder = new TextDecoder(code);
    return decoder.decode(buf);
}
exports.DecodeBytes = DecodeBytes;
function BufferConcat(firstBuf, ...bufAry) {
    let lenOfBuf = firstBuf.length;
    for (let buf of bufAry) {
        lenOfBuf += buf.length;
    }
    let c = Buffer.alloc(lenOfBuf);
    c.set(firstBuf);
    let offset = firstBuf.length;
    for (let buf of bufAry) {
        c.set(buf, offset);
        offset += buf.length;
    }
    return c;
}
exports.BufferConcat = BufferConcat;
function Adler32FromBuffer(data) {
    // notice that adler32 returns signed value
    let retOfAdler32Sign = ADLER32.buf(data);
    let a = new Uint32Array([retOfAdler32Sign]);
    return a[0];
}
exports.Adler32FromBuffer = Adler32FromBuffer;
//# sourceMappingURL=utils.js.map