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
exports.dictApp = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var timers_1 = require("timers");
var ElectronApp_1 = require("./ElectronApp");
var UsrProgress_1 = require("./components/UsrProgress");
var dictApp = /** @class */ (function (_super) {
    __extends(dictApp, _super);
    function dictApp(startPath) {
        return _super.call(this, startPath) || this;
    }
    dictApp.prototype.ReadAndConfigure = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usrsCfg, defaultUsr, _i, usrsCfg_1, usrCfg, progressFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.ReadAndConfigure.call(this)];
                    case 1:
                        _a.sent();
                        usrsCfg = JSON.parse(JSON.stringify(this._cfg['Users']));
                        defaultUsr = this._cfg.Dictionary.User;
                        _i = 0, usrsCfg_1 = usrsCfg;
                        _a.label = 2;
                    case 2:
                        if (!(_i < usrsCfg_1.length)) return [3 /*break*/, 6];
                        usrCfg = usrsCfg_1[_i];
                        if (!(usrCfg.Name == defaultUsr)) return [3 /*break*/, 5];
                        progressFile = path.join(this._startPath, usrCfg.Progress);
                        this._usrProgress = new UsrProgress_1.UsrProgress();
                        return [4 /*yield*/, this._usrProgress.Open(progressFile, "New")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this._usrProgress.ExistTable("New")];
                    case 4:
                        if ((_a.sent()) == false) {
                            this._usrProgress.NewTable("New");
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, true];
                }
            });
        });
    };
    dictApp.prototype.Run = function (argvs) {
        return __awaiter(this, void 0, void 0, function () {
            var wordsLst, _i, wordsLst_1, wd;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.Run.call(this, argvs)];
                    case 1:
                        _a.sent();
                        if (!(argvs.typ == "c")) return [3 /*break*/, 6];
                        this._dictId = "dict1";
                        this._curDictBase = this.get_curDB();
                        wordsLst = argvs.word.split(" ");
                        _i = 0, wordsLst_1 = wordsLst;
                        _a.label = 2;
                    case 2:
                        if (!(_i < wordsLst_1.length)) return [3 /*break*/, 5];
                        wd = wordsLst_1[_i];
                        return [4 /*yield*/, this.QueryWord2(wd)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.WaitAsyncTasksFnshd(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.Quit()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.GetWindow = function () {
        return this._win;
    };
    dictApp.prototype.WaitAsyncTasksFnshd = function (cb) {
        var _this = this;
        this._logger.info("Start to quit Dictionary");
        var timerID = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this._dQueue.IsFnshd()) {
                    console.info("Finshed to download all files.");
                    timers_1.clearInterval(timerID);
                    this._logger.info("Wait 2s to quit.");
                    setTimeout(function () {
                        cb();
                    }, 2000);
                }
                return [2 /*return*/];
            });
        }); }, 2000);
    };
    dictApp.prototype.OnButtonClicked = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = id;
                        switch (_a) {
                            case "btn_close": return [3 /*break*/, 1];
                            case "btn_min": return [3 /*break*/, 3];
                            case 'btn_prev': return [3 /*break*/, 4];
                            case 'btn_next': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 6];
                    case 1: 
                    // this.WaitAsyncTasksFnshd(async () => {
                    //     await this.Quit();
                    // })
                    return [4 /*yield*/, this.Quit()];
                    case 2:
                        // this.WaitAsyncTasksFnshd(async () => {
                        //     await this.Quit();
                        // })
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        this._win.minimize();
                        return [3 /*break*/, 7];
                    case 4:
                        this.QueryPrev();
                        return [3 /*break*/, 7];
                    case 5:
                        this.QueryNext();
                        return [3 /*break*/, 7];
                    case 6:
                        this._logger.info(id);
                        _b.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.QueryNext = function () {
        throw new Error('QueryNext not implemented.');
        /*
        // word = this.NextQueue.Dequeue()
        word = this.NextStack.Pop()
        if (this.NextStack.GetSize() == 0){
            // self.get_browser().ExecuteFunction("disableButton", "btn_next", true);
            this._win.webContents.send("gui", "disableButton", "btn_next", true);
        }
        
        // this.PrevStack.Push(word)
        // if this.PrevStack.GetSize() == 2:
                // self.get_browser().ExecuteFunction("disableButton", "btn_prev", false);
        
        // self.get_browser().ExecuteFunction("set_word", word);
        this._win.webContents.send("gui", "set_word", word);
        // self.get_browser().ExecuteFunction("query_word");
        self.query_word(word, 1)
        */
    };
    dictApp.prototype.QueryPrev = function () {
        throw new Error('Method not implemented.');
        /*
        word = this.PrevStack.Pop()
        if (this.PrevStack.GetSize() == 0){
            // self.get_browser().ExecuteFunction("disableButton", "btn_prev", true);
            this._win.webContents.send("gui", "disableButton", "btn_prev", true);
        }
        
        // this.NextQueue.Enqueue(word)
        // if this.NextQueue.GetSize() == 2:
                // self.get_browser().ExecuteFunction("disableButton", "btn_next", false);
        
        self.get_browser().ExecuteFunction("set_word", word);
        // self.get_browser().ExecuteFunction("query_word");
        self.query_word(word, -1);
        */
    };
    dictApp.prototype.OnMenuClicked = function (menuId) {
        throw new Error('Method not implemented.');
        /*
        let action: string = 'this._' + this._dictSysMenu[menuId];
        this._logger.info(`action = ${action}`);
        
        // eval(action)(menuId);
        // this._get_browser().ExecuteFunction('active_menu', menuId);
        */
    };
    dictApp.prototype.OnDocumentReady = function () {
        this.AddTabs();
        // this.FillMenus();
    };
    dictApp.prototype.AddTabs = function () {
        var html = "\n\t\t\t\t\t\t\t<div id = \"toggle_example\" align = \"right\">- Hide Examples</div>\n\t\t\t\t\t\t\t<p></p>";
        for (var _i = 0, _a = JSON.parse(JSON.stringify(this._cfg.Dictionary.Tabs)); _i < _a.length; _i++) {
            var tab = _a[_i];
            var dictBase = this._dictMap.get(tab.Dict);
            if (dictBase) {
                var dictName = dictBase.szName;
                var tabName = tab.Name;
                this._logger.info("AddTab: " + tabName + " with dict: " + dictName);
                this._win.webContents.send("gui", "AddTab", dictName, tabName, html);
            }
        }
        // this._dictMap.forEach((dict: DictBase, tabId: string) => {
        //     let name = dict.szName;
        //     this._logger.info(`Add tab: ${tabId}, dict: ${name}`);
        //     this._win.webContents.send("gui", "AddTab", tabId, name, html);
        //     this._dictId = tabId;
        // });
        this._win.webContents.send("gui", "BindSwitchTab");
        // switch to default tab
        this._dictId = this._cfg.Dictionary.Tab;
        this._curDictBase = this.get_curDB();
        this._win.webContents.send("gui", "ActiveTab", this._dictId);
        this._curDictBase = this.get_curDB();
        // this._bHomeRdy = true;
    };
    dictApp.prototype.AddMenu = function (name, action, bActived) {
        if (bActived === void 0) { bActived = false; }
        throw new Error('Method not implemented.');
        /*
        this._dictSysMenu.set(name, action);
        // menuId = "dict" + str(len(this._dictSysMenu) + 1)
        menuId = name;
        // self.get_browser().ExecuteFunction("fill_menu", menuId, name);
        this._win.webContents.send("gui", "fill_menu", menuId, name);
        if (bActived){
            this._logger.info(`Active Menu: ${menuId}`);
            // self.get_browser().ExecuteFunction("active_menu", menuId);
            this._win.webContents.send("gui", "active_menu", menuId);
        }
        */
    };
    dictApp.prototype.FillMenus = function () {
        throw new Error('Method not implemented.');
        /*
        for (key of this._dictAgent.keys()){
            this.AddMenu(key, "ActiveAgent", this._dictAgent[key]["bActived"]);
        }
        // self.get_browser().ExecuteFunction("bindMenus");
        this._win.webContents.send("gui", "bindMenus");
        */
    };
    dictApp.prototype.SwitchTab = function (tabId) {
        this._logger.info("switch to tab: " + tabId);
        this._dictId = tabId;
        this._curDictBase = this.get_curDB();
    };
    dictApp.prototype.get_curDB = function () {
        return this._dictMap.get(this._dictId);
    };
    dictApp.prototype.PlayAudio = function (audio) {
        this._logger.info("going to play " + audio);
        // self.get_browser().ExecuteFunction("playMP3", audio);
        this._win.webContents.send("gui", "playMP3", audio);
        return true;
    };
    dictApp.prototype.QueryWord2 = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var retDict, dict, retAudio, audio;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._logger.info("word = " + word + ";");
                        retDict = -1;
                        dict = "";
                        retAudio = -1;
                        audio = "";
                        return [4 /*yield*/, this._curDictBase.query_word(word)];
                    case 1:
                        _a = _c.sent(), retDict = _a[0], dict = _a[1];
                        return [4 /*yield*/, this._audioBase.query_audio(word)];
                    case 2:
                        _b = _c.sent(), retAudio = _b[0], audio = _b[1];
                        if (retDict < 0) {
                            this.Record2File(this._miss_dict, "Dict of " + word + ": " + dict + "\n");
                        }
                        else if (retDict == 0) {
                            this._logger.info(dict);
                        }
                        if (retAudio < 0) {
                            this.Record2File(this._miss_audio, "Audio of " + word + ": " + audio + "\n");
                        }
                        else if (retAudio == 0) {
                            this._logger.info(audio);
                        }
                        if (retDict < 0 || retAudio < 0) {
                            this.Record2File(this._miss_audio, "\n");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.QueryWord = function (word, nDirect) {
        if (nDirect === void 0) { nDirect = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var retDict, dict, retAudio, audio, bNew, familiar, level, nStars, e_1;
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Not implemented
                        /*
                        if (this._lastWord){
                            if (nDirect == -1){
                                this.NextStack.Push(this._lastWord)
                                // this._logger.info("__PrevQueue: %d", this.PrevQueue.GetSize())
                                if this.NextStack.GetSize() >= 1:
                                    // self.get_browser().ExecuteFunction("disableButton", "btn_next", false);
                                    this._win.webContents.send("gui", "disableButton", "btn_next", false);
                            }
                            else{
                                this.PrevStack.Push(this._lastWord)
                                // this._logger.info("__PrevQueue: %d", this.PrevQueue.GetSize())
                                if (this.PrevStack.GetSize() >= 1){
                                    // self.get_browser().ExecuteFunction("disableButton", "btn_prev", false);
                                    this._win.webContents.send("gui", "disableButton", "btn_prev", false);
                                }
                            }
                        }
                        
                        this._word = word;
                        
                        if (this._bHomeRdy == false){
                            return;
                        }
                        */
                        this._curWord = word;
                        this._logger.info("word = " + word + ";");
                        retDict = -1;
                        dict = "";
                        retAudio = -1;
                        audio = "";
                        bNew = false;
                        return [4 /*yield*/, this._curDictBase.query_word(word)];
                    case 1:
                        _a = _c.sent(), retDict = _a[0], dict = _a[1];
                        return [4 /*yield*/, this._audioBase.query_audio(word)];
                    case 2:
                        _b = _c.sent(), retAudio = _b[0], audio = _b[1];
                        if (retDict < 0) {
                            this.Record2File(this._miss_dict, "Dict of " + word + ": " + dict + "\n");
                        }
                        else if (retDict == 0) {
                            if (this._curDictBase.download) {
                                this.TriggerDownload(this._curDictBase, word, dict);
                            }
                        }
                        if (!(retDict <= 0)) return [3 /*break*/, 3];
                        dict =
                            "<div class=\"headword\">\n                    <div class=\"text\">" + word + "</div>\n                    <div class=\"phonetic\">" + dict + "</div>\n                </div>";
                        dict = dict.replace(/[\r\n]/g, "");
                        return [3 /*break*/, 7];
                    case 3: return [4 /*yield*/, this._usrProgress.ExistWord(word)];
                    case 4:
                        if (!((_c.sent()) == false)) return [3 /*break*/, 5];
                        this._usrProgress.InsertWord(word).then(function () {
                            console.log(word + " will be marked as new.");
                            _this._win.webContents.send("QueryWord", "mark_new", true);
                        });
                        bNew = false;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this._usrProgress.GetItem(word, "Familiar")];
                    case 6:
                        familiar = _c.sent();
                        if (familiar < 10) {
                            console.log(word + " has been marked as new.");
                            bNew = true;
                        }
                        else {
                            console.log(word + " has been rectied.");
                            bNew = false;
                        }
                        _c.label = 7;
                    case 7:
                        if (retAudio < 0) {
                            this.Info(-1, 2, word, audio);
                            this.Record2File(this._miss_audio, "Audio of " + word + ": " + audio + "\n");
                        }
                        else if (retAudio == 0) {
                            if (this._audioBase.download) {
                                this.TriggerDownload(this._audioBase, word, audio);
                            }
                        }
                        if (retAudio <= 0) {
                            audio = this._wrongHintFile;
                        }
                        if (retDict < 0 || retAudio < 0) {
                            this.Record2File(this._miss_audio, "\n");
                        }
                        if (retAudio == 1) {
                            this.Info(0, 2, "", "");
                        }
                        audio = audio.replace(/\\/g, "/");
                        level = "";
                        nStars = 0;
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 11, , 12]);
                        return [4 /*yield*/, this._wordsDict.GetLevel(word)];
                    case 9:
                        level = _c.sent();
                        return [4 /*yield*/, this._wordsDict.GetStar(word)];
                    case 10:
                        nStars = _c.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        e_1 = _c.sent();
                        this._logger.error("Fail to read " + word + " from " + this._wordsDict.szSrcFile + ", because of " + e_1 + ".");
                        return [3 /*break*/, 12];
                    case 12:
                        this._win.webContents.send("QueryWord", "dictHtml", word, this._dictId, dict, audio, bNew, level, nStars);
                        return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.speechWord = function (audio) {
        if (fs.statSync(audio).isFile() == false) {
            this._logger.error("There is no mp3: " + audio);
        }
        try {
            this.PlayAudio(audio);
        }
        catch (e) {
            this._logger.error("wrong mp3: " + audio);
            this._logger.error(e.message);
        }
    };
    dictApp.prototype.markNew = function (word, bNew) {
        var _this = this;
        if (bNew === 'true') {
            this._usrProgress.InsertWord(word).then(function () {
                console.log(word + " has been marked as new.");
                _this._win.webContents.send("QueryWord", "mark_new", true);
            });
        }
        else {
            this._usrProgress.DelWord(word).then(function () {
                console.log(word + " has been removed mark of new.");
                _this._win.webContents.send("QueryWord", "mark_new", false);
            });
        }
    };
    dictApp.prototype.TopMostOrNot = function () {
        var bTop = this._win.isAlwaysOnTop();
        this._win.setAlwaysOnTop(!bTop);
    };
    dictApp.prototype.OnTextChanged = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var wdsLst, ret, _i, wdsLst_1, wd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wdsLst = new Array();
                        return [4 /*yield*/, this._curDictBase.get_wordsLst(word, wdsLst)];
                    case 1:
                        ret = _a.sent();
                        if (!ret) {
                            console.log("OnTextChanged: no similiar words!");
                            return [2 /*return*/, false];
                        }
                        // this._window.get_browser().ExecuteFunction("clear_words_list");
                        this._win.webContents.send("gui", "clearOptions", "words_list");
                        for (_i = 0, wdsLst_1 = wdsLst; _i < wdsLst_1.length; _i++) {
                            wd = wdsLst_1[_i];
                            // this._window.get_browser().ExecuteFunction("append_words_list", wd);
                            this._win.webContents.send("gui", "appendOpt", "words_list", wd);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return dictApp;
}(ElectronApp_1.ElectronApp));
exports.dictApp = dictApp;
;
//# sourceMappingURL=dictApp.js.map