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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.randomArray2 = exports.randomArray = exports.asyncCheck = exports.RemoveDir = void 0;
var fs = __importStar(require("fs"));
function RemoveDir(dir) {
    if (fs.existsSync(dir) == true) {
        if (fs.statSync(dir).isDirectory()) {
            var files = fs.readdirSync(dir);
            files.forEach(function (file, index) {
                var currentPath = dir + "/" + file;
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
/**
* 异步等待对象的生成，对象生成完成返回生成的对象
* @param getter 对象的获取函数
* @param checkInterval 检查粒度，ms
* @param timeout 超时时间, ms
*/
var asyncCheck = function (getter, checkInterval, timeout) {
    if (checkInterval === void 0) { checkInterval = 100; }
    if (timeout === void 0) { timeout = 1000; }
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (x) {
                    var check = function (num) {
                        if (num === void 0) { num = 0; }
                        var target = getter();
                        if (target !== undefined && target !== null) {
                            x(target);
                        }
                        else if (num > timeout / checkInterval) { // 超时
                            x(target);
                        }
                        else {
                            setTimeout(function () { return check(++num); }, checkInterval);
                        }
                    };
                    check();
                })];
        });
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
    var newArray = new Array();
    for (var i = 0, oldTotalLen = oldArray.length; i < oldTotalLen;) {
        var currentRandom = Number((Math.random() * oldTotalLen).toFixed(0));
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
    for (var i = 0, len = arr.length; i < len; i++) {
        var currentRandom = Number((Math.random() * (len - 1)).toFixed(0));
        var current = arr[i];
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
console.info(now.toLocaleString()); //2020-11-14 14:00:46
console.info(now.toLocaleDateString()); //2020-11-14
console.info(now.toLocaleTimeString()); //14:00:46
*/
function formatDate(data) {
    return data.getFullYear() + "-" + (data.getMonth() + 1 >= 10 ? (data.getMonth() + 1) : '0' + (data.getMonth() + 1)) + "-" + (data.getDate() >= 10 ? data.getDate() : '0' + data.getDate());
}
exports.formatDate = formatDate;
//# sourceMappingURL=utils.js.map