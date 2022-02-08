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
exports.ElectronApp = void 0;
// ElectronApp.ts
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var log4js = __importStar(require("log4js"));
var electron_1 = require("electron");
var globalInterface_1 = require("./utils/globalInterface");
var WordsDict_1 = require("./components/WordsDict");
var GDictBase_1 = require("./components/GDictBase");
var SDictBase_1 = require("./components/SDictBase");
var MDictBase_1 = require("./components/MDictBase");
var AuidoArchive_1 = require("./components/AuidoArchive");
var DownloardQueue_1 = require("./utils/DownloardQueue");
var ElectronApp = /** @class */ (function () {
    function ElectronApp(_startPath) {
        this._startPath = _startPath;
        this._bCfgModfied = false;
        this._bDebug = false;
        this._dictMap = new Map(); // <name, database>
        this._dictAgent = new Array();
        console.clear();
        globalInterface_1.globalVar.app = this;
        this._wrongHintFile = path.join(this._startPath, "audio", "WrongHint.mp3");
    }
    Object.defineProperty(ElectronApp.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            this._name = name;
        },
        enumerable: false,
        configurable: true
    });
    ElectronApp.prototype.AddDictBase = function (name, dictSrc, format, download) {
        if (download === void 0) { download = null; }
        return __awaiter(this, void 0, void 0, function () {
            var dictBase, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (format.Type == 'ZIP') {
                            dictBase = new GDictBase_1.GDictBase(name, dictSrc, format.Compression, format.Compress_Level);
                        }
                        else if (format.Type == 'SQLite') {
                            dictBase = new SDictBase_1.SDictBase(name, dictSrc);
                        }
                        else if (format.Type == 'mdx') {
                            dictBase = new MDictBase_1.MDictBase(name, dictSrc);
                        }
                        else {
                            throw new Error("Unknown dict's type: " + format.Type + "!");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dictBase.Open()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this._logger.error("Fail to open " + dictSrc + ", because of " + e_1);
                        return [2 /*return*/];
                    case 4:
                        if (name == this._cfg[this._name].DictBase) {
                            this._curDictBase = dictBase;
                        }
                        if (download) {
                            dictBase.download = download;
                        }
                        this._dictMap.set(name, dictBase);
                        return [2 /*return*/];
                }
            });
        });
    };
    ElectronApp.prototype.ReadAndConfigure = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this, debugCfg, debugLvl, logFile, common, agentCfg, bIEAgent, activeAgent, agentInfo, _i, agentInfo_1, agent, dictBasesCfg, _a, dictBasesCfg_1, dictBaseCfg, dictSrc_1, download, wordsDictCfg, dictSrc, e_2, audioCfg, audioFile, audioFormatCfg, e_3, missCfg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._cfgFile = path.join(this._startPath, 'Dictionary.json').replace(/\\/g, '/');
                        _this = this;
                        if (fs.existsSync(this._cfgFile) == false) {
                            console.log(_this._cfgFile + " doesn't exist");
                            return [2 /*return*/, false];
                        }
                        ;
                        this._cfg = JSON.parse(fs.readFileSync(this._cfgFile).toString());
                        debugCfg = JSON.parse(JSON.stringify(this._cfg[this.name].Debug));
                        this._bDebug = debugCfg.bEnable;
                        debugLvl = 'INFO';
                        if (this._bDebug == true) {
                            debugLvl = 'DEBUG';
                        }
                        logFile = path.join(this._startPath, debugCfg.file);
                        console.log("logFile: " + logFile);
                        // %r time in toLocaleTimeString format
                        // %p log level
                        // %c log category
                        // %h hostname
                        // %m log data
                        // %d date, formatted - default is ISO8601, format options are: ISO8601, ISO8601_WITH_TZ_OFFSET, ABSOLUTE, DATE, or any string compatible with the date-format library. e.g. %d{DATE}, %d{yyyy/MM/dd-hh.mm.ss}
                        // %% % - for when you want a literal % in your output
                        // %n newline
                        // %z process id (from process.pid)
                        // %f full path of filename (requires enableCallStack: true on the category, see configuration object)
                        // %f{depth} path’s depth let you chose to have only filename (%f{1}) or a chosen number of directories
                        // %l line number (requires enableCallStack: true on the category, see configuration object)
                        // %o column postion (requires enableCallStack: true on the category, see configuration object)
                        // %s call stack (requires enableCallStack: true on the category, see configuration object)
                        // %x{<tokenname>} add dynamic tokens to your log. Tokens are specified in the tokens parameter.
                        // %X{<tokenname>} add values from the Logger context. Tokens are keys into the context values.
                        // %[ start a coloured block (colour will be taken from the log level, similar to colouredLayout)
                        // %] end a coloured block
                        log4js.configure({
                            appenders: {
                                consoleAppender: {
                                    type: 'console',
                                    layout: {
                                        type: 'pattern',
                                        pattern: '%d{yyyy-MM-dd hh:mm:ss} %-5p [%l@%f{1}] - %m'
                                    }
                                },
                                dictLogs: {
                                    type: 'file', filename: logFile, category: this.name,
                                    layout: {
                                        type: 'pattern',
                                        pattern: '%d{yyyy-MM-dd hh:mm:ss} %-5p [%l@%f{1}] - %m'
                                    }
                                },
                            },
                            categories: {
                                default: { appenders: ['consoleAppender', 'dictLogs'], level: debugLvl, enableCallStack: true },
                            },
                        });
                        this._logger = log4js.getLogger('dictLogs');
                        globalInterface_1.globalVar.Logger = this._logger;
                        common = JSON.parse(JSON.stringify(this._cfg[this.name].common));
                        this._logger.info(this._name + " v" + common.ver);
                        agentCfg = JSON.parse(JSON.stringify(this._cfg['Agents']));
                        bIEAgent = agentCfg.bIEAgent;
                        activeAgent = agentCfg.activeAgent;
                        agentInfo = JSON.parse(JSON.stringify(agentCfg['Info']));
                        for (_i = 0, agentInfo_1 = agentInfo; _i < agentInfo_1.length; _i++) {
                            agent = agentInfo_1[_i];
                            this._dictAgent.push({ name: agent.name, ip: agent.ip, program: agent.program });
                        }
                        this._dictAgent.push({ name: '', ip: '', program: '' });
                        this.ActiveAgent(activeAgent);
                        dictBasesCfg = JSON.parse(JSON.stringify(this._cfg.DictBases));
                        _a = 0, dictBasesCfg_1 = dictBasesCfg;
                        _b.label = 1;
                    case 1:
                        if (!(_a < dictBasesCfg_1.length)) return [3 /*break*/, 4];
                        dictBaseCfg = dictBasesCfg_1[_a];
                        dictSrc_1 = path.join(this._startPath, dictBaseCfg.Dict);
                        download = dictBaseCfg.Download;
                        return [4 /*yield*/, this.AddDictBase(dictBaseCfg.Name, dictSrc_1, JSON.parse(JSON.stringify(dictBaseCfg.Format)), download)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4:
                        wordsDictCfg = this._cfg.WordsDict;
                        dictSrc = path.join(this._startPath, wordsDictCfg.Dict);
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        this._wordsDict = new WordsDict_1.WordsDict(wordsDictCfg.Name, dictSrc);
                        return [4 /*yield*/, this._wordsDict.Open()];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_2 = _b.sent();
                        this._logger.error("Fail to open " + dictSrc + ", because of " + e_2);
                        return [3 /*break*/, 8];
                    case 8:
                        audioCfg = JSON.parse(JSON.stringify(this._cfg['AudioBases']))[0];
                        audioFile = path.join(this._startPath, audioCfg.Audio);
                        audioFormatCfg = JSON.parse(JSON.stringify(audioCfg['Format']));
                        if (!(audioFormatCfg.Type == 'ZIP')) return [3 /*break*/, 13];
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        this._audioBase = new AuidoArchive_1.AuidoArchive(audioCfg.Name, audioFile, audioFormatCfg.Compression, audioFormatCfg.CompressLevel);
                        return [4 /*yield*/, this._audioBase.Open()];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        e_3 = _b.sent();
                        this._logger.error("Fail to open " + audioFile + ", because of " + e_3);
                        return [3 /*break*/, 12];
                    case 12:
                        if (audioCfg.Download) {
                            this._audioBase.download = audioCfg.Download;
                        }
                        _b.label = 13;
                    case 13:
                        missCfg = JSON.parse(JSON.stringify(this._cfg.Miss));
                        this._miss_dict = path.join(this._startPath, missCfg.miss_dict);
                        this._miss_audio = path.join(this._startPath, missCfg.miss_audio);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ElectronApp.prototype.CreateWindow = function (bShow, bDev) {
        return __awaiter(this, void 0, void 0, function () {
            var guiCfg;
            return __generator(this, function (_a) {
                guiCfg = JSON.parse(JSON.stringify(this._cfg[this._name]['GUI']));
                // Create the browser window.
                this._win = new electron_1.BrowserWindow({
                    icon: path.join(__dirname, 'assets/img/dictApp.ico'),
                    width: guiCfg.Width,
                    height: guiCfg.Height,
                    fullscreen: guiCfg.bFullScreen,
                    show: bShow,
                    frame: false,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false
                    },
                });
                if (bShow) {
                    this._win.loadURL("file://" + __dirname + "/assets/" + this._name + ".html");
                    if (bDev) {
                        // Open the DevTools.
                        this._win.webContents.openDevTools({ mode: 'detach' });
                    }
                }
                // let _this = this;
                // Emitted when the window is closed.
                this._win.on('closed', function () {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    // _this._win = null;
                });
                return [2 /*return*/];
            });
        });
    };
    ElectronApp.prototype.Run = function (argvs) {
        return __awaiter(this, void 0, void 0, function () {
            var bShow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ReadAndConfigure()];
                    case 1:
                        if ((_a.sent()) == false) {
                            return [2 /*return*/];
                        }
                        bShow = true;
                        if (argvs.typ == "c") {
                            bShow = false;
                        }
                        return [4 /*yield*/, this.CreateWindow(bShow, argvs.bDev)];
                    case 2:
                        _a.sent();
                        this._dQueue = new DownloardQueue_1.DownloardQueue(this._win);
                        return [2 /*return*/];
                }
            });
        });
    };
    ElectronApp.prototype.ActiveAgent = function (activeAgent) {
        /*
        bIEAgent = false;
        opener = None;
        this._logger.info("activeAgent = %s" %activeAgent);
        this._cfgDict["Agents"]["activeAgent"] = activeAgent
        for (name in this._dictAgent.keys()){
            if (name == activeAgent){
                this._dictAgent[name]["bActived"] = true;
            }
            else{
                this._dictAgent[name]["bActived"] = false;
            }
        }
        
        if (activeAgent != "None"){
            this._logger.info("active agent: %s" %activeAgent);
            ip = this._dictAgent[activeAgent]["ip"];
            proxyHandler = urllib.request.ProxyHandler({
                'http': ip,
                'https': ip
            });
            opener = urllib.request.build_opener(proxyHandler);
        }
        else if (bIEAgent){
            this._logger.info("ie_agent");
            opener = urllib.request.build_opener();
        }
        else{
            proxyHandler = urllib.request.ProxyHandler({});
            opener = urllib.request.build_opener(proxyHandler);
        }
        
        opener.addheaders = [('User-agent', 'Mozilla/5.0')];
        // install the openen on the module-level
        urllib.request.install_opener(opener);
        
        proxies = urllib.request.getproxies();
        
        if (proxies){
            this._logger.info("proxies: " + str(proxies));
        }
        
        this._bCfgModfied = true;
        */
        return false;
    };
    ElectronApp.prototype.TriggerDownload = function (owner, word, localFile) {
        return __awaiter(this, void 0, void 0, function () {
            var download, mode, iterator, r, _a, id, dict, _b, ret, html, regEx, match, url, url;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        download = owner.download;
                        mode = download.Mode;
                        console.log("mode: " + mode);
                        if (!(mode == 'Dict')) return [3 /*break*/, 5];
                        iterator = this._dictMap.entries();
                        r = void 0;
                        _c.label = 1;
                    case 1:
                        if (!(r = iterator.next(), !r.done)) return [3 /*break*/, 4];
                        _a = r.value, id = _a[0], dict = _a[1];
                        console.log("name: " + dict.szName);
                        if (!(download.Dict == dict.szName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, dict.query_word(word)];
                    case 2:
                        _b = _c.sent(), ret = _b[0], html = _b[1];
                        if (ret == 1) {
                            regEx = download.RegEx.replace("${word}", word);
                            match = html.match(regEx);
                            if (match) {
                                url = match[0];
                                this._dQueue.AddQueue(word, url, localFile, function (dFile) {
                                    owner.CheckAndAddFile(dFile);
                                });
                            }
                            else {
                                this._logger.error("no audio in " + word + " of " + download.Dict + ".");
                            }
                        }
                        else {
                            this.Info(-1, 1, word, "no " + word + " in the dict of " + download.Dict);
                        }
                        return [3 /*break*/, 4];
                    case 3: return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (mode == "Direct") {
                            url = download.URL.replace(" ", "%20");
                            url = url.replace("${word}", word);
                            this._dQueue.AddQueue(word, url, localFile, function (dFile) {
                                owner.CheckAndAddFile(dFile);
                            });
                        }
                        else {
                            this._logger.error("Not support to download " + localFile + ", in " + mode + " mode.");
                        }
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     *
     * @param {number} ret result of msg: <0 means failure, 0 means ongoing, 1 means success
     * @param {number} typ type of info: 1 means dict, 2 means audio
     * @param {string} word
     * @param {string} msg when ret equals 1, it represent local address of word's dict or audio
     * @memberof dictApp
     */
    ElectronApp.prototype.Info = function (ret, typ, word, msg) {
        if (ret < 0) {
            this._logger.error(msg);
            if (typ == 1) {
                this.Record2File(this._miss_dict, "dict of " + word + " : " + msg + "\n");
            }
            else if (typ == 2) {
                this.Record2File(this._miss_audio, "audio of " + word + " : " + msg + "\n");
            }
        }
        else if (ret = 1) {
            if (typ == 2) {
                if (this._curWord == word) {
                    this._win.webContents.send("gui", "loadAndPlayAudio", msg);
                    msg = "OK to download audio of " + word;
                }
            }
        }
        this._win.webContents.send("gui", "modifyValue", "status", msg);
    };
    ElectronApp.prototype.Record2File = function (file, something) {
        return __awaiter(this, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.writeFile(file, something, { 'flag': 'a' }, function (err) {
                            if (err) {
                                _this_1._logger.error("Fail to record " + something + " in " + file + "!");
                                resolve(false);
                            }
                            else {
                                // console.log(`Success to record ${something} in ${file}!`);
                                resolve(true);
                            }
                        });
                    })];
            });
        });
    };
    ElectronApp.prototype.log = function (lvl, msg) {
        if (lvl == "info") {
            this._logger.info(msg);
        }
        else if (lvl == "error") {
            this._logger.error(msg);
        }
    };
    ElectronApp.prototype.SaveConfigure = function () {
        var _this_1 = this;
        return new Promise(function (resolve, reject) {
            // Indent by 4 spaces
            fs.writeFile(_this_1._cfgFile, JSON.stringify(_this_1._cfg, null, 4), { 'flag': 'w' }, function (err) {
                if (err) {
                    reject("Fail to SaveConfigure!");
                }
                else {
                    resolve("Success to SaveConfigure");
                }
            });
        });
    };
    ElectronApp.prototype.Close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ret, msg, srcFile, _b, ret, msg, srcFile, ret, e_4;
            var _this_1 = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._dictMap.forEach(function (dict, tabId) { return __awaiter(_this_1, void 0, void 0, function () {
                            var srcFile, _a, ret, msg;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        srcFile = dict.szSrcFile;
                                        console.log("Start to close " + srcFile);
                                        return [4 /*yield*/, dict.Close()];
                                    case 1:
                                        _a = _b.sent(), ret = _a[0], msg = _a[1];
                                        if (ret) {
                                            this._logger.info("OK to close " + srcFile + "; " + msg);
                                        }
                                        else {
                                            this._logger.error("Fail to close " + srcFile + ", because of " + msg);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        if (this._audioBase) {
                            _a = this._audioBase.Close(), ret = _a[0], msg = _a[1];
                            srcFile = this._audioBase.srcFile;
                            if (ret) {
                                this._logger.info("OK to close " + srcFile + "; " + msg);
                            }
                            else {
                                this._logger.error("Fail to close " + srcFile + ", because of " + msg);
                            }
                        }
                        if (!this._usrProgress) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._usrProgress.Close()];
                    case 1:
                        _b = _c.sent(), ret = _b[0], msg = _b[1];
                        srcFile = this._usrProgress.srcFile;
                        if (ret) {
                            this._logger.info("OK to close " + srcFile + "; " + msg);
                        }
                        else {
                            this._logger.error("Fail to close " + srcFile + ", because of " + msg);
                        }
                        _c.label = 2;
                    case 2:
                        if (!this._bCfgModfied) return [3 /*break*/, 6];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.SaveConfigure()];
                    case 4:
                        ret = _c.sent();
                        this._logger.info(ret);
                        return [3 /*break*/, 6];
                    case 5:
                        e_4 = _c.sent();
                        this._logger.error(e_4);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ElectronApp.prototype.Quit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 做点其它操作：比如记录窗口大小、位置等，下次启动时自动使用这些设置；不过因为这里（主进程）无法访问localStorage，这些数据需要使用其它的方式来保存和加载，这里就不作演示了。这里推荐一个相关的工具类库，可以使用它在主进程中保存加载配置数据：https://github.com/sindresorhus/electron-store
                    // ...
                    // safeExit = true;
                    return [4 /*yield*/, this.Record2File(this._miss_audio, "")];
                    case 1:
                        // 做点其它操作：比如记录窗口大小、位置等，下次启动时自动使用这些设置；不过因为这里（主进程）无法访问localStorage，这些数据需要使用其它的方式来保存和加载，这里就不作演示了。这里推荐一个相关的工具类库，可以使用它在主进程中保存加载配置数据：https://github.com/sindresorhus/electron-store
                        // ...
                        // safeExit = true;
                        _a.sent();
                        return [4 /*yield*/, this.Close()];
                    case 2:
                        _a.sent();
                        this._logger.info("Quit!\n");
                        log4js.shutdown(function (error) {
                            if (error) {
                                console.error(error.message);
                            }
                            else {
                                console.info("Succes to shutdown log4js");
                            }
                            electron_1.app.quit(); // 退出程序
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return ElectronApp;
}());
exports.ElectronApp = ElectronApp;
//# sourceMappingURL=ElectronApp.js.map