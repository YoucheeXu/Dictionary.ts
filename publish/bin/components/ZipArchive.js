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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipArchive = void 0;
//https://stuk.github.io/jszip/documentation/howto/read_zip.html
var jszip_1 = __importDefault(require("jszip"));
var fs = __importStar(require("fs"));
var ZipArchive = /** @class */ (function () {
    function ZipArchive(zipFile, compression, compresslevel) {
        if (compression === void 0) { compression = ""; }
        if (compresslevel === void 0) { compresslevel = ""; }
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
    ZipArchive.prototype.Open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this;
            return __generator(this, function (_a) {
                _this = this;
                return [2 /*return*/, new jszip_1.default.external.Promise(function (resolve, reject) {
                        fs.readFile(_this.zipFile, function (err, data) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(data);
                            }
                        });
                    }).then(function (data) {
                        jszip_1.default.loadAsync(data).then(function (zip) {
                            _this.zip = zip;
                            _this.fileList = Object.keys(_this.zip.files);
                            // console.log(_this.fileList);
                        });
                    })];
            });
        });
    };
    ZipArchive.prototype.addFile = function (fileName, datum) {
        var _this_1 = this;
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
            }).then(function (content) {
                fs.writeFile(_this_1.zipFile, content, function (err) {
                    if (err) {
                        console.error("Fail to save " + fileName + "!");
                    }
                    else {
                        console.info("Success to save " + fileName + "!");
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
    };
    ZipArchive.prototype.bFileIn = function (fileName) {
        // if (fileName in this.fileList) {
        if (this.fileList.indexOf(fileName) != -1) {
            return true;
        }
        else {
            return false;
        }
    };
    ZipArchive.prototype.searchFile = function (pattern, wdMatchLst, limit) {
        // let regex = re.compile(pattern);
        // for (let word of this.fileList) {
        // 	// gLogger.info(word);
        // 	match = regex.search(word);
        // 	if match{
        // 		wdMatchLst.push(word);
        // 	}
        // }
        var i = 0;
        var regex = new RegExp(pattern);
        for (var _i = 0, _a = this.fileList; _i < _a.length; _i++) {
            var word = _a[_i];
            if (i >= limit) {
                break;
            }
            else if (regex.test(word)) {
                wdMatchLst.push(word);
                i++;
            }
        }
        return wdMatchLst.length;
    };
    ZipArchive.prototype.readFileSync = function (fileName) {
        if (this.bFileIn(fileName) == false) {
            return [false, "%{fileName} desn't exist."];
        }
        try {
            this.zip.file(fileName).async("blob").then(function (content) {
                return [true, content];
            });
        }
        catch (e) {
            return [false, e.message];
        }
        return [false, "Unkown Error!"];
    };
    ZipArchive.prototype.readFilePromise = function (fileName) {
        var _this_1 = this;
        if (this.bFileIn(fileName) == false) {
            return [false, null];
        }
        var promise1 = new Promise(function (resolve, reject) {
            _this_1.zip.file(fileName).async("string").then(function (datum) {
                resolve(datum);
            });
        });
        promise1.then(function (content) {
            return [true, content];
        });
        // asyncCheck
        return [false, "Unkown Error!"];
    };
    ZipArchive.prototype.readFileAsync = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this_1.zip.file(fileName).async("nodebuffer").then(function (datum) {
                            resolve([true, datum]);
                        }, function (reason) {
                            reject([false, reason]);
                        });
                    })];
            });
        });
    };
    ZipArchive.prototype.readFile = function (fileName, callback) {
        if (this.bFileIn(fileName) == false) {
            callback(false, null);
        }
        try {
            // with ZipFile(self.__zip, 'a', ZIP_DEFLATED, compresslevel = 2) as zipf:
            // 	file = zipf.read(fileName)
            this.zip.file(fileName).async("string").then(function (content) {
                callback(true, content);
            });
        }
        catch (e) {
            callback(false, e.message);
        }
    };
    ZipArchive.prototype.delFile = function (fileName) {
        throw new Error("don't support to delete file: " + fileName);
        return false;
    };
    return ZipArchive;
}());
exports.ZipArchive = ZipArchive;
;
//# sourceMappingURL=ZipArchive.js.map