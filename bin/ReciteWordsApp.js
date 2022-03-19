"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
exports.ReciteWordsApp = void 0;
// ReciteWordsApp.ts
var path = __importStar(require("path"));
var electron_1 = require("electron");
var utils_1 = require("./utils/utils");
var ElectronApp_1 = require("./ElectronApp");
var UsrProgress_1 = require("./components/UsrProgress");
var ReciteWordsApp = /** @class */ (function (_super) {
    __extends(ReciteWordsApp, _super);
    function ReciteWordsApp(startPath) {
        var _this = 
        /*
        this._root.bind("<Escape>", this._exit_app);
        this._root.bind("<Return>", this._check_input);
        */
        _super.call(this, startPath) || this;
        _this.startPath = startPath;
        _this._usrsDict = new Map();
        _this._personalProgressFile = "";
        _this._timeDayLst = new Array();
        _this._mode = "Study Mode";
        _this._wordsMap = new Map();
        _this._learnLst = new Array();
        _this._curLearnLst = new Array();
        _this._curLearnPos = 0;
        _this._testLst = new Array();
        _this._curTestLst = new Array();
        _this._curTestPos = 0;
        _this._testCount = 0;
        _this._errCount = 0;
        _this._curCount = 1;
        _this._lastWord = "";
        return _this;
    }
    ReciteWordsApp.prototype.ReadAndConfigure = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, usrCfg, name_1, levels;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, _super.prototype.ReadAndConfigure.call(this)];
                    case 1:
                        _b.sent();
                        // read all users
                        for (_i = 0, _a = this._cfg.Users; _i < _a.length; _i++) {
                            usrCfg = _a[_i];
                            name_1 = usrCfg.Name;
                            levels = usrCfg.Target;
                            this._usrsDict.set(name_1, levels);
                            console.log("User: " + name_1 + ", Levels: " + levels);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ReciteWordsApp.prototype.Run = function (argvs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.Run.call(this, argvs)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.GoStudyMode = function () {
        this._mode = "Study Mode";
        this._win.webContents.send("gui", "modifyValue", "title", "Study Mode");
        console.log("Study Mode");
        this._win.webContents.send("gui", "modifyValue", "count", "");
        this._curLearnPos = 0;
        var len = this._learnLst.length;
        if (len > 0) {
            var limit = Math.min(10, len);
            this._curLearnLst = this._learnLst.splice(0, limit);
        }
        else {
            this._curLearnLst.length = 0;
            // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
            this.GoTestMode();
        }
        this._win.webContents.send("gui", "modifyValue", "numOfLearn", this._learnLst.length + " words to Learn!");
        this.Study_Next();
    };
    ReciteWordsApp.prototype.Study_Next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var len, value, familiar, lastDate, data, familiar, lastDate, nextDate, msg;
            return __generator(this, function (_a) {
                len = this._curLearnLst.length;
                if (len > 0) {
                    this._curWord = this._curLearnLst[this._curLearnPos];
                    this._win.webContents.send("gui", "modifyValue", "score", "");
                    value = this._wordsMap.get(this._curWord);
                    if (value) {
                        familiar = value[0];
                        lastDate = value[1];
                        if (lastDate.getFullYear() == 1970) {
                            this._win.webContents.send("gui", "modifyValue", "score", "New!");
                        }
                        else if (familiar < 0) {
                            this._win.webContents.send("gui", "modifyValue", "score", "Forgotten");
                        }
                        else {
                            this._win.webContents.send("gui", "modifyValue", "score", "");
                        }
                    }
                    data = this._wordsMap.get(this._curWord);
                    if (data != undefined) {
                        familiar = data[0];
                        lastDate = data[1];
                        nextDate = data[2];
                        msg = "Familiar: " + familiar + ", LastDate: " + (0, utils_1.formatDate)(lastDate) + ", NextDate: " + (0, utils_1.formatDate)(nextDate);
                        console.log("LearnWord: " + this._curWord + ", " + msg);
                        this._win.webContents.send("gui", "modifyValue", "info", msg);
                    }
                    this.Show_Content(this._curWord, true);
                    this.PlayAudio();
                    this._win.webContents.send("gui", "modifyValue", "numOfWords", this._curLearnPos + 1 + " of " + len);
                    // this._curLearnPos += 1;
                }
                return [2 /*return*/];
            });
        });
    };
    ReciteWordsApp.prototype.GoTestMode = function () {
        this._mode = "Test Mode";
        this._win.webContents.send("gui", "modifyValue", "title", "Test Mode");
        console.log("Test Mode");
        var len = this._testLst.length;
        if (this._curCount <= this._testCount && this._curTestLst.length > 0) {
            this._curTestPos = 0;
            this._win.webContents.send("gui", "modifyValue", "count", "Count: " + this._curCount + " of " + this._testCount);
            // this.Clear_Content();
            this.Test_Next();
        }
        else if (this._curLearnLst.length > 0) {
            // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", true);
            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else if (len > 0) {
            var limit = Math.min(10, len);
            this._curTestLst = this._testLst.splice(0, limit);
            this._win.webContents.send("gui", "modifyValue", "numOfTest", this._testLst.length + " words to Test!");
            this._curTestPos = 0;
            this._curCount = 1;
            this._win.webContents.send("gui", "modifyValue", "count", "Count: " + this._curCount + " of " + this._testCount);
            this.Test_Next();
        }
        else if (this._learnLst.length > 0) {
            // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", true);
            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else {
            this._curTestPos += 1;
            this.Quit();
        }
    };
    ReciteWordsApp.prototype.Test_Next = function () {
        this._curWord = this._curTestLst[this._curTestPos];
        var data = this._wordsMap.get(this._curWord);
        if (data != undefined) {
            var familiar = data[0];
            var lastDate = data[1];
            var nextDate = data[2];
            var msg = "Familiar: " + familiar + ", LastDate: " + (0, utils_1.formatDate)(lastDate) + ", NextDate: " + (0, utils_1.formatDate)(nextDate);
            console.log("TestWord: " + this._curWord + ", " + msg);
            this._win.webContents.send("gui", "modifyValue", "info", msg);
        }
        this._win.webContents.send("gui", "modifyValue", "word", "");
        if (this._lastWord != "") {
            this.Show_Content(this._lastWord);
        }
        this.PlayAudio();
        this._win.webContents.send("gui", "modifyValue", "numOfWords", this._curTestPos + 1 + " of " + this._curTestLst.length);
    };
    ReciteWordsApp.prototype.Check_Input = function (input_word) {
        if (this._mode == "Study Mode") {
            this._curLearnPos++;
            if (this._curLearnPos < this._curLearnLst.length) {
                this.Study_Next();
            }
            else {
                this._curCount = 1;
                console.log("curCount: " + this._curCount);
                this._curTestLst = (this._curLearnLst || []).concat();
                // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
                this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                this.GoTestMode();
            }
        }
        else {
            if (input_word != this._curWord) {
                this._errCount += 1;
                this._win.webContents.send("gui", "modifyValue", "score", "Wrong word: " + input_word + ", wrong count: " + this._errCount + "!");
                this._logger.debug("ErrCount: " + this._errCount);
                this._logger.debug("Right word: " + this._curWord + ", Wrong word: " + input_word + ".");
                var data = this._wordsMap.get(this._curWord);
                if (data === undefined) {
                    throw new Error(this._curWord + " is not in WordsDict!");
                }
                var familiar = data[0];
                var lastDate = data[1];
                var nextDate = data[2];
                if (this._errCount == 1) {
                    // this._curTestPos -= 1;
                    // this._wordsMap.set(word, familiar - 1);
                }
                else if (this._errCount < 3) {
                    // this._curTestPos -= 1;
                    this._wordsMap.set(this._curWord, [familiar - 1, lastDate, nextDate]);
                }
                else {
                    this._win.webContents.send("gui", "modifyValue", "word", "");
                    this.Show_Content(this._curWord, true);
                    this.PlayAudio();
                    this._win.webContents.send("gui", "modifyValue", "score", "Go on!");
                    this._wordsMap.set(this._curWord, [familiar - 4, lastDate, nextDate]);
                    this._learnLst.push(this._curWord);
                    console.log(this._curWord + " has been added in learn list.");
                    this._errCount = 0;
                    this._win.webContents.send("gui", "modifyValue", "numOfLearn", this._learnLst.length + " words to Learn!");
                    return;
                }
            }
            else {
                this._win.webContents.send("gui", "modifyValue", "score", "OK!");
                this._errCount = 0;
                this._lastWord = this._curWord;
                this._curTestPos++;
            }
            if (this._curTestPos < this._curTestLst.length) {
                // this._win.webContents.send("gui", "modifyValue", "word", "");
                this.Test_Next();
            }
            else {
                this._curCount += 1;
                console.log("curCount: " + this._curCount);
                this.GoTestMode();
            }
        }
    };
    ReciteWordsApp.prototype.Chop = function () {
        for (var i = 0; i < this._curLearnLst.length; i++) {
            if (this._curLearnLst[i] == this._curWord) {
                this._curLearnLst.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < this._learnLst.length; i++) {
            if (this._learnLst[i] == this._curWord) {
                this._learnLst.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < this._curTestLst.length; i++) {
            if (this._curTestLst[i] == this._curWord) {
                this._curTestLst.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < this._testLst.length; i++) {
            if (this._testLst[i] == this._curWord) {
                this._testLst.splice(i, 1);
                i--;
            }
        }
        var data = this._wordsMap.get(this._curWord);
        if (data != undefined) {
            var lastDate = this._today;
            var nextDate = data[2];
            this._wordsMap.set(this._curWord, [10, lastDate, nextDate]);
        }
        console.log(this._curWord + " has been chopped!");
        this._win.webContents.send("gui", "modifyValue", "numOfTest", this._testLst.length + " words to Test!");
        if (this._mode == "Study Mode") {
            this._lastWord = this._curWord;
            if (this._curLearnPos < this._curLearnLst.length) {
                this.Study_Next();
            }
            else if (this._learnLst.length > 0 && this._curLearnLst.length == 0) {
                this.GoStudyMode();
            }
            else {
                this._curCount = 1;
                console.log("curCount: " + this._curCount);
                this._curTestLst = (this._curLearnLst || []).concat();
                // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
                this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                this.GoTestMode();
            }
        }
        else {
            this._lastWord = this._curWord;
            if (this._curTestPos < this._curTestLst.length) {
                this.Test_Next();
            }
            else {
                this._curCount += 1;
                console.log("curCount: " + this._curCount);
                this.GoTestMode();
            }
        }
    };
    ReciteWordsApp.prototype.Forgoten = function () {
        // let word = "";
        if (this._mode == "Test Mode") {
            this._errCount = 0;
            // word = this._curTestLst[this._curTestPos];
            for (var i = 0; i < this._curTestLst.length; i++) {
                if (this._curTestLst[i] == this._curWord) {
                    this._curTestLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this._testLst.length; i++) {
                if (this._testLst[i] == this._curWord) {
                    this._testLst.splice(i, 1);
                    i--;
                }
            }
            var data = this._wordsMap.get(this._curWord);
            if (data != undefined) {
                var familiar = data[0];
                var lastDate = this._today;
                var nextDate = new Date();
                // nextDate.setDate(this._today.getDate() - Number(this._timeDayLst[0]));
                this._wordsMap.set(this._curWord, [familiar - 5, lastDate, nextDate]);
            }
            this._learnLst.push(this._curWord);
            console.log(this._curWord + " has been added in learn list.");
            this._win.webContents.send("gui", "modifyValue", "numOfLearn", this._learnLst.length + " words to Learn!");
            console.log(this._curWord + " is forgotten!");
            this._lastWord = this._curWord;
            if (this._curTestPos < this._curTestLst.length) {
                this.Test_Next();
            }
            else {
                this._curCount += 1;
                console.log("curCount: " + this._curCount);
                this.GoTestMode();
            }
        }
        return this._curWord;
    };
    ReciteWordsApp.prototype.Clear_Content = function () {
        this._win.webContents.send("gui", "modifyValue", "word", "");
        this._win.webContents.send("gui", "modifyValue", "symbol", "");
        this._win.webContents.send("gui", "modifyValue", "txtArea", "");
    };
    // To-Do
    ReciteWordsApp.prototype.PlayAudio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var retAudio, audioFile;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._curWord == this._lastWord)) return [3 /*break*/, 1];
                        this._win.webContents.send("gui", "playAudio");
                        return [3 /*break*/, 8];
                    case 1:
                        retAudio = -1;
                        audioFile = "";
                        return [4 /*yield*/, this._audioBase.query_audio(this._curWord)];
                    case 2:
                        _a = _b.sent(), retAudio = _a[0], audioFile = _a[1];
                        if (!(retAudio < 0)) return [3 /*break*/, 3];
                        this._logger.error(audioFile);
                        this._win.webContents.send("gui", "loadAndPlayAudio", this._wrongHintFile.replace(/\\/g, '/'));
                        return [2 /*return*/, Promise.resolve(false)];
                    case 3:
                        if (!(retAudio == 0)) return [3 /*break*/, 7];
                        if (!this._audioBase.download) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.TriggerDownload(this._audioBase, this._curWord, audioFile)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this._logger.error("There is no audio of " + this._curWord + " in " + this._audioBase.srcFile);
                        _b.label = 6;
                    case 6: return [2 /*return*/, Promise.resolve(false)];
                    case 7:
                        this._win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
                        if (this._mode == "Study Mode") {
                            this._lastWord = this._curWord;
                        }
                        _b.label = 8;
                    case 8: return [2 /*return*/, Promise.resolve(true)];
                }
            });
        });
    };
    ReciteWordsApp.prototype.Show_Content = function (word, bShowWord) {
        if (bShowWord === void 0) { bShowWord = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, retDict, dict, txtLst, symbol, meaning, sentences, txtContent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (bShowWord) {
                            this._win.webContents.send("gui", "modifyValue", "word", word);
                        }
                        return [4 /*yield*/, this._curDictBase.query_word(word)];
                    case 1:
                        _a = _b.sent(), retDict = _a[0], dict = _a[1];
                        if (retDict < 0) {
                            this.Record2File(this._miss_dict, "Dict of " + word + ": " + dict + "\n");
                            this._win.webContents.send("gui", "modifyValue", "txtArea", dict);
                        }
                        else if (retDict == 0) {
                            if (this._curDictBase.download) {
                                this.TriggerDownload(this._curDictBase, word, dict);
                            }
                        }
                        else {
                            txtLst = dict.split(";;");
                            if (retDict == 1) {
                                symbol = txtLst[0];
                                this._win.webContents.send("gui", "modifyValue", "symbol", "[" + symbol + "]");
                                meaning = txtLst[1];
                                if (txtLst[2] == null) {
                                    txtLst[2] = "";
                                }
                                sentences = txtLst[2].replace(/\"/g, "\\\"");
                                sentences = sentences.replace(/\'/g, "\\\'");
                                sentences = sentences.replace(/\`/g, "\\\`");
                                txtContent = meaning + "\n" + sentences.replace(/\/r\/n/g, "\n");
                                // txtContent = txtContent.replace(/<br>/g, "");
                                this._win.webContents.send("gui", "modifyValue", "txtArea", txtContent);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.readUsrs = function () {
        /*this._usrDict.forEach((usrName: string, levels: Array<string>) => {
            this._logger.info(`User: ${usrName}, Levels: ${levels}`);
            this._win.webContents.send("gui", "appendList", "usr-select", usrName);
            for (let lvl of levels){

            }
        });

        this._win.webContents.send("gui", "appendList", "usr-select", "Add more...");
        this._win.webContents.send("gui", "appendList", "lvl-select", "Add more...");
        
        this._win.webContents.send("gui", "displayOrHide", "SelDiag", true);
        this._win.webContents.send("gui", "displayOrHide", "bg", true);
        */
        return this._usrsDict;
    };
    ReciteWordsApp.prototype.readAllLvls = function () {
        return this._cfg["WordsDict"]["allLvls"];
    };
    ReciteWordsApp.prototype.newLevel = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, usrCfg, progressFile, lvlWordsLst, ret, _b, lvlWordsLst_1, word, target;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("usr: " + usrName + ", new level: " + level);
                        _i = 0, _a = this._cfg.Users;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        usrCfg = _a[_i];
                        if (!(usrName == usrCfg.Name)) return [3 /*break*/, 11];
                        if (this._usrProgress === undefined) {
                            this._usrProgress = new UsrProgress_1.UsrProgress();
                        }
                        progressFile = path.join(this._startPath, usrCfg.Progress).replace(/\\/g, '/');
                        return [4 /*yield*/, this._usrProgress.Open(progressFile, level)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this._usrProgress.ExistTable(level)];
                    case 3:
                        if ((_c.sent()) == false) {
                            this._usrProgress.NewTable(level);
                        }
                        lvlWordsLst = new Array();
                        return [4 /*yield*/, this._wordsDict.GetWordsLst(lvlWordsLst, level)];
                    case 4:
                        ret = _c.sent();
                        if (!ret) return [3 /*break*/, 9];
                        _b = 0, lvlWordsLst_1 = lvlWordsLst;
                        _c.label = 5;
                    case 5:
                        if (!(_b < lvlWordsLst_1.length)) return [3 /*break*/, 8];
                        word = lvlWordsLst_1[_b];
                        // console.log("Going to insert: " + word);
                        return [4 /*yield*/, this._usrProgress.InsertWord(word)];
                    case 6:
                        // console.log("Going to insert: " + word);
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, Promise.resolve(false)];
                    case 10:
                        target = usrCfg.Target;
                        target[target.length] = level;
                        this._bCfgModfied = true;
                        return [2 /*return*/, Promise.resolve(true)];
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/, Promise.resolve(false)];
                }
            });
        });
    };
    // TODO: record it in json
    ReciteWordsApp.prototype.NewUsr = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var progressFile, lvlWordsLst, ret, _i, lvlWordsLst_2, word;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._bCfgModfied = true;
                        this._usrProgress = new UsrProgress_1.UsrProgress();
                        progressFile = path.join(this._startPath, "dict", "usrName" + ".progress").replace(/\\/g, '/');
                        return [4 /*yield*/, this._usrProgress.New(progressFile, level)];
                    case 1:
                        _a.sent();
                        lvlWordsLst = new Array();
                        return [4 /*yield*/, this._wordsDict.GetWordsLst(lvlWordsLst, level)];
                    case 2:
                        ret = _a.sent();
                        if (!ret) return [3 /*break*/, 7];
                        _i = 0, lvlWordsLst_2 = lvlWordsLst;
                        _a.label = 3;
                    case 3:
                        if (!(_i < lvlWordsLst_2.length)) return [3 /*break*/, 6];
                        word = lvlWordsLst_2[_i];
                        // console.log("Going to insert: " + word);
                        return [4 /*yield*/, this._usrProgress.InsertWord(word)];
                    case 4:
                        // console.log("Going to insert: " + word);
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 8];
                    case 7: return [2 /*return*/, Promise.resolve(false)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.isLevelDone = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, usrCfg, progress, progressFile, numOfUnrecitedWord1, numOfUnrecitedWord2, ret, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this._cfg.Users;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 15];
                        usrCfg = _a[_i];
                        if (!(usrName == usrCfg.Name)) return [3 /*break*/, 14];
                        progress = usrCfg.Progress;
                        progressFile = path.join(this._startPath, progress).replace(/\\/g, '/');
                        this._logger.info("progress: ", progressFile);
                        if (this._usrProgress === undefined) {
                            this._usrProgress = new UsrProgress_1.UsrProgress();
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 12, , 13]);
                        return [4 /*yield*/, this._usrProgress.Open(progressFile, level)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this._usrProgress.GetInProgressCount(level)];
                    case 4:
                        numOfUnrecitedWord1 = _b.sent();
                        return [4 /*yield*/, this._usrProgress.GetNewCount(level)];
                    case 5:
                        numOfUnrecitedWord2 = _b.sent();
                        if (!(numOfUnrecitedWord1 + numOfUnrecitedWord2 == 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, electron_1.dialog.showMessageBox({
                                type: "info",
                                message: usrName + "'s " + level + " is done! Do you want to reset?",
                                buttons: ["Yes", "No"]
                            })];
                    case 6:
                        ret = _b.sent();
                        if (!(ret.response == 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, electron_1.dialog.showMessageBox({
                                type: "info",
                                message: "Reset function is not implemented!",
                                buttons: ["Confirm"]
                            })];
                    case 7:
                        ret = _b.sent();
                        return [2 /*return*/, Promise.resolve(true)];
                    case 8: return [2 /*return*/, Promise.resolve(true)];
                    case 9: return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, Promise.resolve(false)];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        e_1 = _b.sent();
                        this._logger.error(e_1);
                        return [2 /*return*/, Promise.reject(e_1)];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15: return [2 /*return*/, Promise.reject("Usr doesn't exist!")];
                }
            });
        });
    };
    ReciteWordsApp.prototype.Go = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, usrCfg, progress, progressFile, allCount, newCount, finishCount, InProgressCount, allLimit, newWdsLimit, limit, wdsLst, todayStr, numOfAllForgoten, numOfSelForgotten, _b, wdsLst_1, wd, numOfAllOvrDue, numOfSelOvrDue, _c, wdsLst_2, wd, numOfAllDue, numOfSelDue, _d, wdsLst_3, wd, newWdNum, _e, wdsLst_4, wd, timeArray, _f, timeArray_1, timeGroup, _g, _h, word;
            var _this = this;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        console.log("Go!");
                        /*globalShortcut.unregister('Enter');
                        globalShortcut.register('Enter', () => {
                        });*/
                        electron_1.globalShortcut.register('F5', function () {
                            _this.PlayAudio();
                        });
                        electron_1.globalShortcut.register('F6', function () {
                            _this.Forgoten();
                        });
                        electron_1.globalShortcut.register('F7', function () {
                            _this.Chop();
                        });
                        _i = 0, _a = this._cfg.Users;
                        _j.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        usrCfg = _a[_i];
                        if (!(usrName == usrCfg.Name)) return [3 /*break*/, 3];
                        progress = usrCfg.Progress;
                        progressFile = path.join(this._startPath, progress).replace(/\\/g, '/');
                        this._logger.info("progress: ", progressFile);
                        if (this._usrProgress === undefined) {
                            this._usrProgress = new UsrProgress_1.UsrProgress();
                        }
                        // await this._usrProgress.Open(progressFile);
                        return [4 /*yield*/, this._usrProgress.Open(progressFile, level)];
                    case 2:
                        // await this._usrProgress.Open(progressFile);
                        _j.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this._today = new Date();
                        this._personalProgressFile = path.join(this._startPath, 'log', usrName + "_" + level + ".log");
                        this.LogProgress("Select User: " + usrName + ", Level: " + level);
                        // update info;
                        this._win.webContents.send("gui", "modifyValue", "studyLearnBtn", "\u6B63\u5728\u5B66\u4E60");
                        this._win.webContents.send("gui", "modifyValue", "usr", "" + usrName);
                        this._win.webContents.send("gui", "modifyValue", "level", "" + level);
                        return [4 /*yield*/, this._usrProgress.GetAllCount(level)];
                    case 5:
                        allCount = _j.sent();
                        this._win.webContents.send("gui", "modifyValue", "allCount", "All words: " + allCount);
                        this.LogProgress("All words: " + allCount);
                        return [4 /*yield*/, this._usrProgress.GetNewCount(level)];
                    case 6:
                        newCount = _j.sent();
                        this._win.webContents.send("gui", "modifyValue", "newCount", "New words to learn: " + newCount);
                        this.LogProgress("New words to learn: " + newCount);
                        return [4 /*yield*/, this._usrProgress.GetFnshedCount(level)];
                    case 7:
                        finishCount = _j.sent();
                        this._win.webContents.send("gui", "modifyValue", "finishCount", "Words has recited: " + finishCount);
                        this.LogProgress("Words has recited: " + finishCount);
                        return [4 /*yield*/, this._usrProgress.GetInProgressCount(level)];
                    case 8:
                        InProgressCount = _j.sent();
                        this._win.webContents.send("gui", "modifyValue", "InProgressCount", "Words in learning: " + InProgressCount);
                        this.LogProgress("Words in learning: " + InProgressCount);
                        allLimit = this._cfg.ReciteWords.General.TotalLimit;
                        newWdsLimit = this._cfg.ReciteWords.General.NewLimit;
                        limit = 0;
                        wdsLst = new Array();
                        todayStr = (0, utils_1.formatDate)(this._today);
                        // Start to get forgotten words
                        console.log("Start to get forgotten words");
                        wdsLst.length = 0;
                        limit = Math.min(allLimit - this._wordsMap.size, newWdsLimit);
                        numOfAllForgoten = 0, numOfSelForgotten = 0;
                        return [4 /*yield*/, this._usrProgress.GetForgottenWordsLst(wdsLst)];
                    case 9:
                        if (_j.sent()) {
                            numOfAllForgoten = wdsLst.length;
                            for (_b = 0, wdsLst_1 = wdsLst; _b < wdsLst_1.length; _b++) {
                                wd = wdsLst_1[_b];
                                this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                                this._logger.debug("Word: " + wd.Word + ", Familiar: " + wd.Familiar + ", LastDate: " + wd.LastDate + ", NextDate: " + wd.NextDate);
                                this._learnLst.push(wd.Word);
                                numOfSelForgotten++;
                                if (numOfSelForgotten >= limit) {
                                    break;
                                }
                            }
                        }
                        this.LogProgress("Got " + numOfAllForgoten + " forgotten words.");
                        this.LogProgress("Select " + numOfSelForgotten + " forgotten words.");
                        // Start to get over due words
                        console.log("Start to get over due words");
                        wdsLst.length = 0;
                        limit = allLimit - this._wordsMap.size;
                        numOfAllOvrDue = 0, numOfSelOvrDue = 0;
                        return [4 /*yield*/, this._usrProgress.GetOvrDueWordsLst(wdsLst, todayStr)];
                    case 10:
                        if (_j.sent()) {
                            numOfAllOvrDue = wdsLst.length;
                            for (_c = 0, wdsLst_2 = wdsLst; _c < wdsLst_2.length; _c++) {
                                wd = wdsLst_2[_c];
                                this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                                this._logger.debug("Word: " + wd.Word + ", Familiar: " + wd.Familiar + ", LastDate: " + wd.LastDate + ", NextDate: " + wd.NextDate);
                                numOfSelOvrDue++;
                                if (this._wordsMap.size >= allLimit) {
                                    break;
                                }
                            }
                        }
                        this.LogProgress("Got " + numOfAllOvrDue + " over due words.");
                        this.LogProgress("Select " + numOfSelOvrDue + " over due words.");
                        // Start to get due words
                        console.log("Start to get due words");
                        wdsLst.length = 0;
                        limit = allLimit - this._wordsMap.size;
                        numOfAllDue = 0, numOfSelDue = 0;
                        return [4 /*yield*/, this._usrProgress.GetDueWordsLst(wdsLst, todayStr)];
                    case 11:
                        if (_j.sent()) {
                            numOfAllDue = wdsLst.length;
                            for (_d = 0, wdsLst_3 = wdsLst; _d < wdsLst_3.length; _d++) {
                                wd = wdsLst_3[_d];
                                this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                                this._logger.debug("Word: " + wd.Word + ", Familiar: " + wd.Familiar + ", LastDate: " + wd.LastDate + ", NextDate: " + wd.NextDate);
                                numOfSelDue++;
                                if (this._wordsMap.size >= allLimit) {
                                    break;
                                }
                            }
                        }
                        this.LogProgress("Got " + numOfAllDue + " due words.");
                        this.LogProgress("Selct " + numOfSelDue + " due words.");
                        // Start to get new words
                        console.log("Start to get new words");
                        wdsLst.length = 0;
                        limit = Math.min(newWdsLimit - numOfSelForgotten, allLimit - this._wordsMap.size);
                        newWdNum = 0;
                        if (!(limit > 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this._usrProgress.GetNewWordsLst(wdsLst, limit)];
                    case 12:
                        if (_j.sent()) {
                            for (_e = 0, wdsLst_4 = wdsLst; _e < wdsLst_4.length; _e++) {
                                wd = wdsLst_4[_e];
                                this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                                this._logger.debug("Word: " + wd.Word + ", Familiar: " + wd.Familiar + ", LastDate: " + wd.LastDate + ", NextDate: " + wd.NextDate);
                                this._learnLst.push(wd.Word);
                                newWdNum++;
                            }
                        }
                        _j.label = 13;
                    case 13:
                        this.LogProgress("Got " + newWdNum + " new words.");
                        timeArray = this._cfg["ReciteWords"]["TimeInterval"];
                        for (_f = 0, timeArray_1 = timeArray; _f < timeArray_1.length; _f++) {
                            timeGroup = timeArray_1[_f];
                            if (timeGroup["Unit"] == "d") {
                                this._timeDayLst.push(timeGroup["Interval"]);
                            }
                        }
                        this._testCount = this._cfg.ReciteWords.TestMode.Times;
                        // random learn list
                        (0, utils_1.randomArray2)(this._learnLst);
                        this.LogProgress("Length of LearnList: " + this._learnLst.length + ".");
                        // complement test list
                        for (_g = 0, _h = Array.from(this._wordsMap.keys()); _g < _h.length; _g++) {
                            word = _h[_g];
                            this._testLst.push(word);
                        }
                        // random test list
                        this._testLst = (0, utils_1.randomArray)(this._testLst);
                        this.LogProgress("Length of TestList: " + this._testLst.length + ".");
                        //this._wordInput['state'] = 'readonly';
                        this._win.webContents.send("gui", "modifyValue", "numOfLearn", this._learnLst.length + " words to Learn!");
                        this._win.webContents.send("gui", "modifyValue", "numOfTest", this._testLst.length + " words to Test!");
                        if (this._learnLst.length > 0) {
                            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
                            this.GoStudyMode();
                        }
                        else {
                            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                            this.GoTestMode();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.LogProgress = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            var now, nowStr, something;
            return __generator(this, function (_a) {
                now = new Date();
                nowStr = (0, utils_1.formatTime)(now);
                something = nowStr + " " + info + "\n";
                // console.log(something);
                return [2 /*return*/, _super.prototype.Record2File.call(this, this._personalProgressFile, something)];
            });
        });
    };
    ReciteWordsApp.prototype.Save_Progress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, word, _b, _c, word, data, familiar, lastDate, nextDate, _d, _e, word, _f, _g, word, data, familiar, lastDate, nextDate, allLen, lastDateStr, nexDateStr, mapStr, i, nFnshd, iterator, r, todayStr, intervalDay, index, nextInterval, _h, word, _j, familiar, lastDate, nextDate, percent, e_2;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        // remove words which hadn't be recited
                        for (_i = 0, _a = this._testLst; _i < _a.length; _i++) {
                            word = _a[_i];
                            if (this._wordsMap.has(word)) {
                                this._wordsMap.delete(word);
                            }
                        }
                        if (this._mode == "Study Mode") {
                            for (_b = 0, _c = this._curLearnLst; _b < _c.length; _b++) {
                                word = _c[_b];
                                if (this._wordsMap.has(word)) {
                                    data = this._wordsMap.get(word);
                                    if (data != undefined) {
                                        familiar = data[0] - 1;
                                        lastDate = data[1];
                                        nextDate = data[2];
                                        this._wordsMap.set(word, [familiar, lastDate, nextDate]);
                                    }
                                }
                            }
                        }
                        else {
                            if (this._curCount >= this._testCount) {
                                this._curTestLst.splice(0, this._curTestPos - 1);
                            }
                            for (_d = 0, _e = this._curTestLst; _d < _e.length; _d++) {
                                word = _e[_d];
                                if (this._wordsMap.has(word)) {
                                    this._wordsMap.delete(word);
                                }
                            }
                        }
                        for (_f = 0, _g = this._learnLst; _f < _g.length; _f++) {
                            word = _g[_f];
                            if (this._wordsMap.has(word)) {
                                data = this._wordsMap.get(word);
                                if (data != undefined) {
                                    familiar = data[0] - 1;
                                    lastDate = data[1];
                                    nextDate = data[2];
                                    this._wordsMap.set(word, [familiar, lastDate, nextDate]);
                                }
                            }
                        }
                        allLen = this._wordsMap.size;
                        this.LogProgress("Number of words' familiar will be changed: " + allLen);
                        lastDateStr = "", nexDateStr = "";
                        mapStr = "{";
                        this._wordsMap.forEach(function (_a, word) {
                            var familiar = _a[0], lastDate = _a[1], nextDate = _a[2];
                            if (lastDate != null) {
                                lastDateStr = (0, utils_1.formatDate)(lastDate);
                            }
                            else {
                                lastDateStr = "";
                            }
                            if (nextDate != null) {
                                nexDateStr = (0, utils_1.formatDate)(nextDate);
                            }
                            else {
                                nexDateStr = "";
                            }
                            mapStr += word + ": " + String(familiar) + ", lastDate: " + lastDateStr + ", nextDate: " + nexDateStr + ";";
                        });
                        mapStr += "}";
                        console.log("WordsDict = " + mapStr);
                        i = 0, nFnshd = 0;
                        iterator = this._wordsMap.entries();
                        todayStr = (0, utils_1.formatDate)(this._today);
                        intervalDay = 0, index = 0;
                        nextInterval = 0;
                        _k.label = 1;
                    case 1:
                        if (!(r = iterator.next(), !r.done)) return [3 /*break*/, 6];
                        _h = r.value, word = _h[0], _j = _h[1], familiar = _j[0], lastDate = _j[1], nextDate = _j[2];
                        familiar += 1.0;
                        if (familiar >= 10) {
                            familiar = 10.0;
                            nFnshd++;
                        }
                        else if (familiar < -10) {
                            familiar = -10.0;
                        }
                        familiar = Number(familiar.toFixed(1));
                        // calc next date
                        if (lastDate != null && nextDate != null) {
                            intervalDay = (nextDate.valueOf() - lastDate.valueOf()) / 1000 / 60 / 60 / 24;
                        }
                        else {
                            intervalDay = 0;
                            index = 0;
                        }
                        if (intervalDay > 0) {
                            index = this._timeDayLst.indexOf(intervalDay);
                            if (index != -1) {
                                index++;
                                if (index >= this._timeDayLst.length) { // next round
                                    index = 0;
                                }
                            }
                            else { // error
                                index = 0;
                            }
                        }
                        else { // new word
                            index = 0;
                        }
                        if (familiar < 0) { // forgotten word
                            index = 0;
                        }
                        nextInterval = this._timeDayLst[index];
                        nextDate = new Date();
                        // Object.assign(nextDate, this._today);
                        nextDate.setDate(this._today.getDate() + nextInterval);
                        nexDateStr = (0, utils_1.formatDate)(nextDate);
                        _k.label = 2;
                    case 2:
                        _k.trys.push([2, 4, , 5]);
                        this._logger.debug(word + ": " + String(familiar) + ", lastDate: " + todayStr + ", nextDate: " + nexDateStr);
                        return [4 /*yield*/, this._usrProgress.UpdateProgress2(word, familiar, todayStr, nexDateStr)];
                    case 3:
                        _k.sent();
                        i++;
                        percent = i / allLen * 100;
                        this._win.webContents.send("gui", "modifyValue", "info", percent.toFixed(2) + "% to save progress.");
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _k.sent();
                        this._logger.error(e_2.message);
                        this._logger.error(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        this.LogProgress("Finish to receite number of words: " + nFnshd);
                        // console.log("OK to save progress.");
                        this._win.webContents.send("gui", "modifyValue", "info", "OK to save progress.");
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.Quit = function (bStrted) {
        if (bStrted === void 0) { bStrted = true; }
        return __awaiter(this, void 0, void 0, function () {
            var now, sec, min, hour;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(bStrted == true)) return [3 /*break*/, 3];
                        now = new Date();
                        sec = now.getSeconds() - this._today.getSeconds();
                        min = now.getMinutes() - this._today.getMinutes();
                        hour = now.getHours() - this._today.getHours();
                        if (sec < 0) {
                            sec += 60;
                            min--;
                        }
                        if (min < 0) {
                            min += 60;
                            hour--;
                        }
                        return [4 /*yield*/, this.Save_Progress()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.LogProgress("It cost " + hour + " hours, " + min + " minutes, " + sec + " seconds.\n")];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, _super.prototype.Quit.call(this)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ReciteWordsApp;
}(ElectronApp_1.ElectronApp));
exports.ReciteWordsApp = ReciteWordsApp;
;
//# sourceMappingURL=ReciteWordsApp.js.map