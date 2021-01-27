"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.GDictBase = void 0;
// GDictBase.ts
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var DictBase_1 = require("./DictBase");
var ZipArchive_1 = require("./ZipArchive");
var Json2Html_1 = require("../utils/Json2Html");
var utils_1 = require("../utils/utils");
var globalInterface_1 = require("../utils/globalInterface");
var GDictBase = /** @class */ (function (_super) {
    __extends(GDictBase, _super);
    function GDictBase(dictSrc, compression, compresslevel) {
        var _this_1 = _super.call(this) || this;
        _this_1.dictSrc = dictSrc;
        _this_1.compression = compression;
        _this_1.compresslevel = compresslevel;
        _this_1.bWritable = true;
        _this_1.dictZip = new ZipArchive_1.ZipArchive(dictSrc, compression, compresslevel);
        // this.tempDictDir = tempfile.gettempdir();
        _this_1.dictArchive = path.basename(dictSrc);
        var filePath = path.dirname(dictSrc);
        var fileName = path.basename(dictSrc, ".zip");
        // console.log(fileName);
        _this_1.tempDictDir = path.join(filePath, fileName);
        return _this_1;
    }
    GDictBase.prototype.close = function () {
        utils_1.RemoveDir(this.tempDictDir);
        if (fs.existsSync(this.tempDictDir) == false) {
            console.log("OK to remove " + this.tempDictDir);
        }
        console.log("OK to close " + this.dictArchive + ".");
    };
    GDictBase.prototype.get_parseFun = function () {
        // return "dictJson";
        return "dictHtml";
    };
    GDictBase.prototype.query_word = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName, datum, ret, wordFile, jsonURL, strDatum, dictDatum, info, obj, tabAlign, html, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fileName = word[0] + "/" + word + ".json";
                        ret = false;
                        wordFile = "";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        if (!this.dictZip.bFileIn(fileName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.dictZip.readFileAsync(fileName)];
                    case 2:
                        // [ret, datum] = this.dictZip.readFile(fileName);
                        _a = _b.sent(), ret = _a[0], datum = _a[1];
                        if (!ret) {
                            return [2 /*return*/, Promise.reject([-1, "Fail to read " + word + " in " + this.dictArchive])];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (this.bWritable) {
                            // wordFile = path.join(this.tempDictDir, word + ".json").replace(/\\/g, '/');
                            wordFile = path.join(this.tempDictDir, word + ".json");
                            jsonURL = "http://dictionary.so8848.com/ajax_search?q=" + word;
                            jsonURL = jsonURL.replace(" ", "%20");
                            // download_file(gApp.GetWindow(), jsonURL, wordFile, this, this.notify);
                            globalInterface_1.globalVar.dQueue.AddQueue(jsonURL, wordFile, this, this.notify);
                            datum = "dict of " + word + " is downloading.";
                            return [2 /*return*/, Promise.resolve([0, datum])];
                        }
                        _b.label = 4;
                    case 4:
                        strDatum = String(datum);
                        dictDatum = JSON.parse(strDatum);
                        if (dictDatum["ok"]) {
                            info = dictDatum["info"];
                            // console.log(info);
                            info = String(info).replace(/\\x/g, "%");
                            obj = JSON.parse(info);
                            tabAlign = '\t\t\t\t\t\t\t';
                            html = '\r\n' + Json2Html_1.process_primary(tabAlign + '\t', obj.primaries) + tabAlign;
                            html = html.replace(/[\r\n]/g, "");
                            return [2 /*return*/, Promise.resolve([1, html])];
                        }
                        else {
                            // return [false, "Fail to read: " + word];
                            return [2 /*return*/, Promise.reject([-1, "Fail to read: " + word])];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        // print("fail to query dict of " + word)
                        // GetApp().log("error", "fail to query dict of " + word);
                        if (fs.existsSync(wordFile)) {
                            fs.unlinkSync(wordFile);
                        }
                        // return [false, (e as Error).message.replace("<", "").replace(">", "")];
                        return [2 /*return*/, Promise.reject([-1, e_1.message.replace("<", "").replace(">", "")])];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GDictBase.prototype.notify = function (name, progress, state, why) {
        console.log((progress * 100).toFixed(2) + "% of " + name + " was " + state + " to download!");
        var gApp = globalInterface_1.globalVar.app;
        var word = path.basename(name, ".json");
        switch (state) {
            case 'ongoing':
                break;
            case 'fail':
                gApp.info(-1, 1, word, "Fail to download dict of " + word);
                break;
            case 'done':
                this.checkAndAddFile(name);
                break;
        }
    };
    GDictBase.prototype.checkAndAddFile = function (wordFile) {
        var word = path.basename(wordFile, ".json");
        var fileName = word[0] + "/" + word + ".json";
        var info = "";
        var _this = this;
        var gApp = globalInterface_1.globalVar.app;
        if (fs.existsSync(wordFile)) {
            var dict = fs.readFileSync(wordFile).toString();
            var inWord = this.GetInWord(dict);
            fs.unlink(wordFile, function () { });
            if (inWord != "") {
                if (inWord == word) {
                    // gApp.log("info", "%s's json is OK!" %word)
                    _this.dictZip.addFile(fileName, dict);
                    return gApp.info(1, 1, word, "OK to download dict of " + word);
                }
                else {
                    return gApp.info(-1, 1, inWord, "Wrong word: We except '" + word + "', but we get '" + inWord + "'");
                    // gApp.log("error", "%s isn't what we want!" %word)
                }
            }
            else {
                return gApp.info(-1, 1, word, "No word in dictionary.");
            }
        }
        else {
            console.log(wordFile + " doesn't exist");
            return gApp.info(-1, 1, word, "Fail to download dict of " + word);
        }
    };
    GDictBase.prototype.GetInWord = function (dict) {
        var datum = JSON.parse(dict);
        if (datum["ok"]) {
            var info = datum["info"];
            info = String(info).replace(/\\x/g, "%");
            info = info.replace('\\', '\\\\');
            datum = JSON.parse(info);
            if (datum["primaries"][0]["type"] == "headword") {
                return datum["primaries"][0]["terms"][0]["text"];
            }
        }
        return "";
    };
    GDictBase.prototype.get_wordsLst = function (word, wdMatchLst) {
        var fileName = word[0] + "/" + word + ".*\.json";
        // print("Going to find: " + fileName)
        this.dictZip.searchFile(fileName, wdMatchLst, 100);
        // for i in range(len(wdMatchLst)){
        for (var i = 0; i < wdMatchLst.length; i++) {
            wdMatchLst[i] = wdMatchLst[i].slice(2, -5);
        }
        if (wdMatchLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    };
    GDictBase.prototype.getWritable = function () {
        return this.bWritable;
    };
    GDictBase.prototype.del_word = function (word) {
        var fileName = word[0] + "/" + word + ".json";
        return this.dictZip.delFile(fileName);
    };
    return GDictBase;
}(DictBase_1.DictBase));
exports.GDictBase = GDictBase;
;
//# sourceMappingURL=GDictBase.js.map