"use strict";
// ZipArchive.ts
// 将文件归档到zip文件，并从zip文件中读取数据
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
exports.ZipArchive = void 0;
// https://stuk.github.io/jszip/documentation/howto/read_zip.html
const jszip_1 = __importDefault(require("jszip"));
const fs = __importStar(require("fs"));
// import * as path from "path";
const utils_1 = require("../utils/utils");
class ZipArchive {
    constructor(zipFile, compression = "", compresslevel = "") {
        this.zipFile = zipFile;
        this.compression = compression;
        this.compresslevel = compresslevel;
        this.zip = new jszip_1.default();
        // private compression: string;
        // private compresslevel: string;
        this.fileList = new Array();
        // this.zip = zipFile;
        this.compression = compression;
        this.compresslevel = compresslevel;
    }
    async Open() {
        let _this = this;
        if ((0, utils_1.pathExists)(_this.zipFile)) {
            return new jszip_1.default.external.Promise((resolve, reject) => {
                fs.readFile(_this.zipFile, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            }).then(function (data) {
                jszip_1.default.loadAsync(data).then((zip) => {
                    _this.zip = zip;
                    _this.fileList = Object.keys(_this.zip.files);
                });
            });
        }
        else {
            return Promise.resolve(`There is no ${_this.zipFile}`);
        }
    }
    addFile(fileName, datum) {
        try {
            // with ZipFile(this.zip, 'a', ZIP_DEFLATED, compresslevel = 2) as zipf:
            // zipf.writestr(fileName, datum)
            /*let contentPromise = new JSZip.external.Promise(function (resolve, reject) {
                fs.readFile(fileName, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
            this.zip.file(fileName, contentPromise);
            */
            this.zip.file(fileName, datum);
            this.zip.generateAsync({
                type: "nodebuffer",
                compression: "DEFLATE",
                compressionOptions: {
                    level: 2
                }
            }).then((content) => {
                fs.writeFile(this.zipFile, content, (err) => {
                    if (err) {
                        console.error(`Fail to save ${fileName}!`);
                    }
                    else {
                        console.info(`Success to save ${fileName}!`);
                    }
                });
            });
        }
        catch (e) {
            if (e instanceof Error) {
                return false;
            }
            else {
                // if we can't figure out what what we are dealing with then
                // probably cannot recover...therefore, rethrow
                // Note to Self: Rethink my life choices and choose better libraries to use.
                throw e;
            }
        }
        // fileName = os.path.basename(filePath)
        this.fileList.push(fileName);
        return true;
    }
    bFileIn(fileName) {
        // if (fileName in this.fileList) {
        if (this.fileList.indexOf(fileName) != -1) {
            return true;
        }
        else {
            return false;
        }
    }
    searchFile(pattern, wdMatchLst, limit) {
        // let regex = re.compile(pattern);
        // for (let word of this.fileList) {
        // 	// gLogger.info(word);
        // 	match = regex.search(word);
        // 	if match{
        // 		wdMatchLst.push(word);
        // 	}
        // }
        let i = 0;
        let regex = new RegExp(pattern);
        for (let word of this.fileList) {
            if (i >= limit) {
                break;
            }
            else if (regex.test(word)) {
                wdMatchLst.push(word);
                i++;
            }
        }
        return wdMatchLst.length;
    }
    readFileSync(fileName) {
        if (this.bFileIn(fileName) == false) {
            return [false, `%{fileName} desn't exist.`];
        }
        try {
            this.zip.file(fileName).async("blob").then((content) => {
                return [true, content];
            });
        }
        catch (e) {
            return [false, e.message];
        }
        return [false, "Unkown Error!"];
    }
    readFilePromise(fileName) {
        if (this.bFileIn(fileName) == false) {
            return [false, null];
        }
        const promise1 = new Promise((resolve, reject) => {
            this.zip.file(fileName).async("string").then((datum) => {
                resolve(datum);
            });
        });
        promise1.then((content) => {
            return [true, content];
        });
        // asyncCheck
        return [false, "Unkown Error!"];
    }
    async readFileAsync(fileName) {
        return new Promise((resolve, reject) => {
            this.zip.file(fileName).async("nodebuffer").then((datum) => {
                resolve([true, datum]);
            }, (reason) => {
                reject([false, reason]);
            });
        });
    }
    readFile(fileName, callback) {
        if (this.bFileIn(fileName) == false) {
            callback(false, null);
        }
        try {
            // with ZipFile(self.__zip, 'a', ZIP_DEFLATED, compresslevel = 2) as zipf:
            // 	file = zipf.read(fileName)
            this.zip.file(fileName).async("string").then((content) => {
                callback(true, content);
            });
        }
        catch (e) {
            callback(false, e.message);
        }
    }
    delFile(fileName) {
        throw new Error("don't support to delete file: " + fileName);
        return false;
    }
}
exports.ZipArchive = ZipArchive;
;
//# sourceMappingURL=ZipArchive.js.map