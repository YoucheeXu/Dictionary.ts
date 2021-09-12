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
exports.dictApp = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var log4js = __importStar(require("log4js"));
var electron_1 = require("electron");
var AuidoArchive_1 = require("./components/AuidoArchive");
var GDictBase_1 = require("./components/GDictBase");
var SDictBase_1 = require("./components/SDictBase");
var DownloardQueue_1 = require("./utils/DownloardQueue");
var globalInterface_1 = require("./utils/globalInterface");
var UsrProgress_1 = require("./components/UsrProgress");
var WordsDict_1 = require("./components/WordsDict");
var timers_1 = require("timers");
var dictApp = /** @class */ (function () {
    function dictApp(startPath) {
        this.startPath = startPath;
        this.bCfgModfied = false;
        this.dictAgent = new Array();
        this.dictBaseDict = new Map();
        this.curWord = "";
        this.bDebug = false;
    }
    dictApp.prototype.ReadAndConfigure = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this, debugCfg, debugLvl, logFile, common, agentCfg, bIEAgent, activeAgent, agentInfo, _i, agentInfo_1, agent, dictBasesCfg, _a, _b, tab, _c, dictBasesCfg_1, dictBaseCfg, dictSrc_1, wordsDictCfg, dictSrc, audioCfg, audioFile, audioFormatCfg, usrCfg, progressFile, missCfg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.cfgFile = path.join(this.startPath, 'Dictionary.json').replace(/\\/g, '/');
                        _this = this;
                        if (fs.existsSync(this.cfgFile) == false) {
                            console.log(_this.cfgFile + " doesn't exist");
                            return [2 /*return*/, false];
                        }
                        ;
                        this.cfg = JSON.parse(fs.readFileSync(this.cfgFile).toString());
                        debugCfg = JSON.parse(JSON.stringify(this.cfg.Dictionary.Debug));
                        this.bDebug = debugCfg.bEnable;
                        debugLvl = 'INFO';
                        if (this.bDebug == true) {
                            debugLvl = 'DEBUG';
                            logFile = path.join(this.startPath, debugCfg.file);
                            console.log("logFile: " + logFile);
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
                                        type: 'file', filename: logFile, category: 'dictionary',
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
                        }
                        this.logger = log4js.getLogger('dictLogs');
                        common = JSON.parse(JSON.stringify(this.cfg.Dictionary.common));
                        this.logger.info('ver: ' + common.ver);
                        agentCfg = JSON.parse(JSON.stringify(this.cfg['Agents']));
                        bIEAgent = agentCfg.bIEAgent;
                        activeAgent = agentCfg.activeAgent;
                        agentInfo = JSON.parse(JSON.stringify(agentCfg['Info']));
                        for (_i = 0, agentInfo_1 = agentInfo; _i < agentInfo_1.length; _i++) {
                            agent = agentInfo_1[_i];
                            this.dictAgent.push({ name: agent.name, ip: agent.ip, program: agent.program });
                        }
                        this.dictAgent.push({ name: '', ip: '', program: '' });
                        this.ActiveAgent(activeAgent);
                        dictBasesCfg = JSON.parse(JSON.stringify(this.cfg.DictBases));
                        _a = 0, _b = JSON.parse(JSON.stringify(this.cfg.Dictionary.Tabs));
                        _d.label = 1;
                    case 1:
                        if (!(_a < _b.length)) return [3 /*break*/, 6];
                        tab = _b[_a];
                        _c = 0, dictBasesCfg_1 = dictBasesCfg;
                        _d.label = 2;
                    case 2:
                        if (!(_c < dictBasesCfg_1.length)) return [3 /*break*/, 5];
                        dictBaseCfg = dictBasesCfg_1[_c];
                        if (!(tab.Dict == dictBaseCfg.Name)) return [3 /*break*/, 4];
                        dictSrc_1 = path.join(this.startPath, dictBaseCfg.Dict);
                        return [4 /*yield*/, this.AddDictBase(tab.Name, dictSrc_1, JSON.parse(JSON.stringify(dictBaseCfg.Format)))];
                    case 3:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _c++;
                        return [3 /*break*/, 2];
                    case 5:
                        _a++;
                        return [3 /*break*/, 1];
                    case 6:
                        wordsDictCfg = this.cfg.WordsDict;
                        dictSrc = path.join(this.startPath, wordsDictCfg.Dict);
                        this.wordsDict = new WordsDict_1.WordsDict();
                        return [4 /*yield*/, this.wordsDict.Open(dictSrc)];
                    case 7:
                        _d.sent();
                        audioCfg = JSON.parse(JSON.stringify(this.cfg['AudioBases']))[0];
                        audioFile = path.join(this.startPath, audioCfg.Audio);
                        audioFormatCfg = JSON.parse(JSON.stringify(audioCfg['Format']));
                        if (!(audioFormatCfg.Type == 'ZIP')) return [3 /*break*/, 9];
                        this.audioPackage = new AuidoArchive_1.AuidoArchive(audioFile, audioFormatCfg.Compression, audioFormatCfg.CompressLevel);
                        return [4 /*yield*/, this.audioPackage.Open()];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9:
                        usrCfg = JSON.parse(JSON.stringify(this.cfg['Users']))[0];
                        progressFile = path.join(this.startPath, usrCfg.Progress).replace(/\\/g, '/');
                        this.usrProgress = new UsrProgress_1.UsrProgress();
                        return [4 /*yield*/, this.usrProgress.Open(progressFile, "New")];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, this.usrProgress.ExistTable("New")];
                    case 11:
                        if ((_d.sent()) == false) {
                            this.usrProgress.NewTable("New");
                        }
                        missCfg = JSON.parse(JSON.stringify(this.cfg.Dictionary.Miss));
                        this.miss_dict = path.join(this.startPath, missCfg.miss_dict);
                        this.miss_audio = path.join(this.startPath, missCfg.miss_audio);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    dictApp.prototype.SaveConfigure = function () {
        var _this_1 = this;
        fs.writeFile(this.cfgFile, JSON.stringify(this.cfg), { 'flag': 'w' }, function (err) {
            if (err) {
                _this_1.logger.error("Fail to SaveConfigure!");
            }
            else {
                _this_1.logger.info("Success to SaveConfigure");
            }
        });
    };
    dictApp.prototype.Run = function (argvs) {
        return __awaiter(this, void 0, void 0, function () {
            var bShow, dQueue, wordsLst, _i, wordsLst_1, wd;
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ReadAndConfigure()];
                    case 1:
                        if ((_a.sent()) == false) {
                            return [2 /*return*/];
                        }
                        this.logger.info("Query word: " + argvs.word);
                        bShow = true;
                        if (argvs.typ == "c") {
                            bShow = false;
                        }
                        return [4 /*yield*/, this.CreateWindow(bShow, argvs.bDev)];
                    case 2:
                        _a.sent();
                        dQueue = new DownloardQueue_1.DownloardQueue(this.win);
                        globalInterface_1.globalVar.dQueue = dQueue;
                        if (!(argvs.typ == "c")) return [3 /*break*/, 7];
                        this.dictId = "dict1";
                        this.curDictBase = this.get_curDB();
                        wordsLst = argvs.word.split(" ");
                        _i = 0, wordsLst_1 = wordsLst;
                        _a.label = 3;
                    case 3:
                        if (!(_i < wordsLst_1.length)) return [3 /*break*/, 6];
                        wd = wordsLst_1[_i];
                        return [4 /*yield*/, this.QueryWord2(wd)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        this.WaitAsyncTasksFnshd(function () { return __awaiter(_this_1, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.Quit()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.CreateWindow = function (bShow, bDev) {
        return __awaiter(this, void 0, void 0, function () {
            var size;
            return __generator(this, function (_a) {
                size = { w: 0, h: 0 };
                this.getWinSize(size);
                // Create the browser window.
                this.win = new electron_1.BrowserWindow({
                    icon: path.join(__dirname, 'assets/img/dictApp.ico'),
                    width: size.w,
                    height: size.h,
                    show: bShow,
                    frame: false,
                    webPreferences: {
                        nodeIntegration: true,
                    },
                });
                if (bShow) {
                    this.win.loadURL("file://" + __dirname + "/assets/Dictionary.html");
                    if (bDev) {
                        // Open the DevTools.
                        this.win.webContents.openDevTools({ mode: 'detach' });
                    }
                }
                // let _this = this;
                // Emitted when the window is closed.
                this.win.on('closed', function () {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    // _this.win = null;
                });
                return [2 /*return*/];
            });
        });
    };
    dictApp.prototype.GetWindow = function () {
        return this.win;
    };
    dictApp.prototype.WaitAsyncTasksFnshd = function (cb) {
        var _this_1 = this;
        this.logger.info("Start to quit Dictionary");
        var timerID = setInterval(function () { return __awaiter(_this_1, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (globalInterface_1.globalVar.dQueue.IsFnshd()) {
                    console.info("Finshed to download all files.");
                    timers_1.clearInterval(timerID);
                    this.logger.info("Wait 2s to quit.");
                    setTimeout(function () {
                        cb();
                    }, 2000);
                }
                return [2 /*return*/];
            });
        }); }, 2000);
    };
    dictApp.prototype.Quit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // 做点其它操作：比如记录窗口大小、位置等，下次启动时自动使用这些设置；不过因为这里（主进程）无法访问localStorage，这些数据需要使用其它的方式来保存和加载，这里就不作演示了。这里推荐一个相关的工具类库，可以使用它在主进程中保存加载配置数据：https://github.com/sindresorhus/electron-store
                    // ...
                    // safeExit = true;
                    return [4 /*yield*/, this.Record2File(this.miss_audio, "")];
                    case 1:
                        // 做点其它操作：比如记录窗口大小、位置等，下次启动时自动使用这些设置；不过因为这里（主进程）无法访问localStorage，这些数据需要使用其它的方式来保存和加载，这里就不作演示了。这里推荐一个相关的工具类库，可以使用它在主进程中保存加载配置数据：https://github.com/sindresorhus/electron-store
                        // ...
                        // safeExit = true;
                        _a.sent();
                        return [4 /*yield*/, this.Close()];
                    case 2:
                        _a.sent();
                        this.logger.info("Quit Dictionary\n");
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
    dictApp.prototype.Close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, ret, msg, name;
            var _this_1 = this;
            return __generator(this, function (_b) {
                this.dictBaseDict.forEach(function (value, key) { return __awaiter(_this_1, void 0, void 0, function () {
                    var dictBase, _a, ret, msg, name;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log("Start to close " + value["name"]);
                                dictBase = value["dictBase"];
                                return [4 /*yield*/, dictBase.Close()];
                            case 1:
                                _a = _b.sent(), ret = _a[0], msg = _a[1];
                                name = dictBase.GetName();
                                if (ret) {
                                    this.logger.info("Ok to close " + name + msg);
                                }
                                else {
                                    this.logger.error("Fail to close " + name + ", because of " + msg);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                _a = this.audioPackage.Close(), ret = _a[0], msg = _a[1];
                name = this.audioPackage.GetName();
                if (ret) {
                    this.logger.info("Ok to close " + name + msg);
                }
                else {
                    this.logger.error("Fail to close " + name + ", because of " + msg);
                }
                if (this.bCfgModfied) {
                    this.SaveConfigure();
                }
                return [2 /*return*/];
            });
        });
    };
    dictApp.prototype.Record2File = function (file, something) {
        return __awaiter(this, void 0, void 0, function () {
            var _this_1 = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs.writeFile(file, something, { 'flag': 'a' }, function (err) {
                            if (err) {
                                _this_1.logger.error("Fail to record " + something + " in " + file + "!");
                                resolve(false);
                            }
                            else {
                                console.log("Success to record " + something + " in " + file + "!");
                                resolve(true);
                            }
                        });
                    })];
            });
        });
    };
    dictApp.prototype.ActiveAgent = function (activeAgent) {
        /*
        bIEAgent = false;
        opener = None;
        this.logger.info("activeAgent = %s" %activeAgent);
        this.cfgDict["Agents"]["activeAgent"] = activeAgent
        for (name in this.dictAgent.keys()){
            if (name == activeAgent){
                this.dictAgent[name]["bActived"] = true;
            }
            else{
                this.dictAgent[name]["bActived"] = false;
            }
        }
        
        if (activeAgent != "None"){
            this.logger.info("active agent: %s" %activeAgent);
            ip = this.dictAgent[activeAgent]["ip"];
            proxyHandler = urllib.request.ProxyHandler({
                'http': ip,
                'https': ip
            });
            opener = urllib.request.build_opener(proxyHandler);
        }
        else if (bIEAgent){
            this.logger.info("ie_agent");
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
            this.logger.info("proxies: " + str(proxies));
        }
        
        this.bCfgModfied = true;
        */
        return false;
    };
    dictApp.prototype.AddDictBase = function (name, dictSrc, format) {
        return __awaiter(this, void 0, void 0, function () {
            var dictBase, dictId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dictBase = null;
                        if (!(format.Type == 'ZIP')) return [3 /*break*/, 2];
                        dictBase = new GDictBase_1.GDictBase(dictSrc, format.Compression, format.Compress_Level);
                        return [4 /*yield*/, dictBase.Open()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        if (format.Type == 'SQLite') {
                            dictBase = new SDictBase_1.SDictBase(dictSrc);
                        }
                        else if (format.Type == 'mdx') {
                            // dictBase = new MDictBase(dictSrc);
                            this.logger.error("not support mdx dict: " + name);
                            return [2 /*return*/];
                        }
                        else {
                            throw new Error("Unknown dict's type: " + format.Type + "!");
                        }
                        _a.label = 3;
                    case 3:
                        dictId = 'dict' + String(this.dictBaseDict.size + 1);
                        this.dictBaseDict.set(dictId, { 'name': name, 'dictBase': dictBase });
                        return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.getWinSize = function (size) {
        /*
        let width = int(this.cfgDict["GUI"]["Width"])
        let height = int(this.cfgDict["GUI"]["Height"])
        let fileURL = os.path.join(curPath, this.cfgDict["GUI"]["html"])
        
        let showHiRatio = float(this.cfgDict["GUI"]["ShowHiRatio"]);
        let showWiRatio = float(this.cfgDict["GUI"]["ShowWiRatio"]);
        */
        // let gui = JSON.parse(JSON.stringify(this.//dictCfg["GUI"]));
        var gui = JSON.parse(JSON.stringify(this.cfg["Dictionary"]['GUI']));
        size.h = gui.Height;
        size.w = gui.Width;
        // size.showHiRatio = gui.ShowHiRatio;
        // size.showWiRatio = gui.ShowWiRatio;
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
                        this.win.minimize();
                        return [3 /*break*/, 7];
                    case 4:
                        this.QueryPrev();
                        return [3 /*break*/, 7];
                    case 5:
                        this.QueryNext();
                        return [3 /*break*/, 7];
                    case 6:
                        this.logger.info(id);
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
            this.win.webContents.send("gui", "disableButton", "btn_next", true);
        }
        
        // this.PrevStack.Push(word)
        // if this.PrevStack.GetSize() == 2:
                // self.get_browser().ExecuteFunction("disableButton", "btn_prev", false);
        
        // self.get_browser().ExecuteFunction("set_word", word);
        this.win.webContents.send("gui", "set_word", word);
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
            this.win.webContents.send("gui", "disableButton", "btn_prev", true);
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
        let action: string = 'this.' + this.dictSysMenu[menuId];
        this.logger.info(`action = ${action}`);
        
        // eval(action)(menuId);
        // this.get_browser().ExecuteFunction('active_menu', menuId);
        */
    };
    dictApp.prototype.OnDocumentReady = function () {
        this.AddTabs();
        // this.FillMenus();
    };
    dictApp.prototype.AddTabs = function () {
        var _this_1 = this;
        var html = "\n\t\t\t\t\t\t\t<div id = \"toggle_example\" align = \"right\">- Hide Examples</div>\n\t\t\t\t\t\t\t<p></p>";
        this.dictBaseDict.forEach(function (value, key) {
            _this_1.logger.info("AddTab: " + key + ", " + value["name"]);
            // self.get_browser().ExecuteFunction("AddTab", dictId, item["name"], html)
            _this_1.win.webContents.send("gui", "AddTab", key, value["name"], html);
            _this_1.dictId = key;
        });
        // self.get_browser().ExecuteFunction("BindSwitchTab");
        this.win.webContents.send("gui", "BindSwitchTab");
        // switch to dict1
        this.dictId = "dict1";
        this.curDictBase = this.get_curDB();
        this.dictParseFun = this.curDictBase.get_parseFun();
        // self.get_browser().ExecuteFunction("ActiveTab", this.dictId);
        this.win.webContents.send("gui", "ActiveTab", this.dictId);
        this.curDictBase = this.get_curDB();
        // this.bHomeRdy = true;
    };
    dictApp.prototype.AddMenu = function (name, action, bActived) {
        if (bActived === void 0) { bActived = false; }
        throw new Error('Method not implemented.');
        /*
        this.dictSysMenu.set(name, action);
        // menuId = "dict" + str(len(this.dictSysMenu) + 1)
        menuId = name;
        // self.get_browser().ExecuteFunction("fill_menu", menuId, name);
        this.win.webContents.send("gui", "fill_menu", menuId, name);
        if (bActived){
            this.logger.info(`Active Menu: ${menuId}`);
            // self.get_browser().ExecuteFunction("active_menu", menuId);
            this.win.webContents.send("gui", "active_menu", menuId);
        }
        */
    };
    dictApp.prototype.FillMenus = function () {
        throw new Error('Method not implemented.');
        /*
        for (key of this.dictAgent.keys()){
            this.AddMenu(key, "ActiveAgent", this.dictAgent[key]["bActived"]);
        }
        // self.get_browser().ExecuteFunction("bindMenus");
        this.win.webContents.send("gui", "bindMenus");
        */
    };
    dictApp.prototype.SwitchTab = function (tabId) {
        this.logger.info("switch to tab: " + tabId);
        this.dictId = tabId;
        this.curDictBase = this.get_curDB();
        this.dictParseFun = this.curDictBase.get_parseFun();
    };
    dictApp.prototype.get_curDB = function () {
        return this.dictBaseDict.get(this.dictId)["dictBase"];
    };
    dictApp.prototype.playMP3 = function (audio) {
        this.logger.info("going to play " + audio);
        // self.get_browser().ExecuteFunction("playMP3", audio);
        this.win.webContents.send("gui", "playMP3", audio);
        return true;
    };
    dictApp.prototype.QueryWord2 = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var retDict, dict, retAudio, audio;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.logger.info("word = " + word + ";");
                        retDict = -1;
                        dict = "";
                        retAudio = -1;
                        audio = "";
                        return [4 /*yield*/, this.curDictBase.query_word(word)];
                    case 1:
                        _a = _c.sent(), retDict = _a[0], dict = _a[1];
                        return [4 /*yield*/, this.audioPackage.query_audio(word)];
                    case 2:
                        _b = _c.sent(), retAudio = _b[0], audio = _b[1];
                        if (retDict < 0) {
                            this.Record2File(this.miss_dict, "Dict of " + word + ": " + dict + "\n");
                        }
                        else if (retDict == 0) {
                            this.logger.info(dict);
                        }
                        if (retAudio < 0) {
                            this.Record2File(this.miss_audio, "Audio of " + word + ": " + audio + "\n");
                        }
                        else if (retAudio == 0) {
                            this.logger.info(audio);
                        }
                        if (retDict < 0 || retAudio < 0) {
                            this.Record2File(this.miss_audio, "\n");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.QueryWord = function (word, nDirect) {
        if (nDirect === void 0) { nDirect = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var retDict, dict, retAudio, audio, bNew, level, nStars;
            var _a, _b;
            var _this_1 = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Not implemented
                        /*
                        if (this.lastWord){
                            if (nDirect == -1){
                                this.NextStack.Push(this.lastWord)
                                // this.logger.info("__PrevQueue: %d", this.PrevQueue.GetSize())
                                if this.NextStack.GetSize() >= 1:
                                    // self.get_browser().ExecuteFunction("disableButton", "btn_next", false);
                                    this.win.webContents.send("gui", "disableButton", "btn_next", false);
                            }
                            else{
                                this.PrevStack.Push(this.lastWord)
                                // this.logger.info("__PrevQueue: %d", this.PrevQueue.GetSize())
                                if (this.PrevStack.GetSize() >= 1){
                                    // self.get_browser().ExecuteFunction("disableButton", "btn_prev", false);
                                    this.win.webContents.send("gui", "disableButton", "btn_prev", false);
                                }
                            }
                        }
                        
                        this.word = word;
                        
                        if (this.bHomeRdy == false){
                            return;
                        }
                        */
                        this.curWord = word;
                        this.logger.info("word = " + word + ";");
                        retDict = -1;
                        dict = "";
                        retAudio = -1;
                        audio = "";
                        bNew = false;
                        return [4 /*yield*/, this.curDictBase.query_word(word)];
                    case 1:
                        _a = _c.sent(), retDict = _a[0], dict = _a[1];
                        return [4 /*yield*/, this.audioPackage.query_audio(word)];
                    case 2:
                        _b = _c.sent(), retAudio = _b[0], audio = _b[1];
                        if (!(retDict <= 0)) return [3 /*break*/, 3];
                        this.logger.error("dict: " + dict);
                        dict =
                            "<div class=\"headword\">\n                    <div class=\"text\">" + word + "</div>\n                    <div class=\"phonetic\">" + dict + "</div>\n                </div>";
                        dict = dict.replace(/[\r\n]/g, "");
                        if (retDict < 0) {
                            this.Record2File(this.miss_dict, "Dict of " + word + ": " + dict + "\n");
                        }
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.usrProgress.ExistWord(word)];
                    case 4:
                        if ((_c.sent()) == false) {
                            this.usrProgress.InsertWord(word).then(function () {
                                console.log(word + " will be marked as new.");
                                _this_1.win.webContents.send("QueryWord", "mark_new", true);
                            });
                            bNew = false;
                        }
                        else {
                            console.log(word + " has been marked as new.");
                            bNew = true;
                        }
                        _c.label = 5;
                    case 5:
                        if (retAudio <= 0) {
                            this.logger.error("audio: " + audio);
                            this.info(-1, 2, word, audio);
                            audio = path.join(this.startPath, "audio", "WrongHint.mp3");
                            if (retAudio < 0) {
                                this.Record2File(this.miss_audio, "Audio of " + word + ": " + audio + "\n\n");
                                audio = path.join(this.startPath, "audio", "WrongHint.mp3");
                            }
                        }
                        else if (retDict < 0) {
                            this.Record2File(this.miss_audio, "\n");
                        }
                        if (retAudio == 1) {
                            this.info(0, 2, "", "");
                        }
                        audio = audio.replace(/\\/g, "/");
                        return [4 /*yield*/, this.wordsDict.GetLevel(word)];
                    case 6:
                        level = _c.sent();
                        return [4 /*yield*/, this.wordsDict.GetStar(word)];
                    case 7:
                        nStars = _c.sent();
                        this.win.webContents.send("QueryWord", this.dictParseFun, word, this.dictId, dict, audio, bNew, level, nStars);
                        return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.speechWord = function (audio) {
        if (fs.statSync(audio).isFile() == false) {
            this.logger.error("The is no mp3: " + audio);
        }
        try {
            this.playMP3(audio);
        }
        catch (e) {
            this.logger.error("wrong mp3: " + audio);
            this.logger.error(e.message);
        }
    };
    dictApp.prototype.markNew = function (word, bNew) {
        var _this_1 = this;
        if (bNew === 'true') {
            this.usrProgress.InsertWord(word).then(function () {
                console.log(word + " has been marked as new.");
                _this_1.win.webContents.send("QueryWord", "mark_new", true);
            });
        }
        else {
            this.usrProgress.DelWord(word).then(function () {
                console.log(word + " has been removed mark of new.");
                _this_1.win.webContents.send("QueryWord", "mark_new", false);
            });
        }
    };
    dictApp.prototype.TopMostOrNot = function () {
        var bTop = this.win.isAlwaysOnTop();
        this.win.setAlwaysOnTop(!bTop);
    };
    dictApp.prototype.OnTextChanged = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var wdsLst, ret, _i, wdsLst_1, wd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wdsLst = new Array();
                        return [4 /*yield*/, this.curDictBase.get_wordsLst(word, wdsLst)];
                    case 1:
                        ret = _a.sent();
                        if (!ret) {
                            console.log("OnTextChanged: no similiar words!");
                            return [2 /*return*/, false];
                        }
                        // this.window.get_browser().ExecuteFunction("clear_words_list");
                        this.win.webContents.send("gui", "clearOptions", "words_list");
                        for (_i = 0, wdsLst_1 = wdsLst; _i < wdsLst_1.length; _i++) {
                            wd = wdsLst_1[_i];
                            // this.window.get_browser().ExecuteFunction("append_words_list", wd);
                            this.win.webContents.send("gui", "appendOpt", "words_list", wd);
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     *
     *
     * @param {number} ret result of msg, <0 means failure, =0 means ongoing, 1 means success
     * @param {number} typ type of info, 1 means json, 2 means mp3
     * @param {string} word
     * @param {string} msg when ret equals 1 and typ equals 2, it represent local address of word's mp3
     * @memberof dictApp
     */
    dictApp.prototype.info = function (ret, typ, word, msg) {
        if (ret < 0) {
            this.logger.error(msg);
            if (typ == 1) {
                this.Record2File(this.miss_dict, "dict of " + word + " : " + msg + "\n");
            }
            else if (typ == 2) {
                this.Record2File(this.miss_audio, "audio of " + word + " : " + msg + "\n");
            }
        }
        else if (ret = 1) {
            if (typ == 2) {
                if (this.curWord == word) {
                    this.win.webContents.send("gui", "loadAndPlayAudio", msg);
                    msg = "OK to download audio of " + word;
                }
            }
        }
        // console.log("info: " + msg);
        // this.logger.info(msg);
        this.win.webContents.send("gui", "modifyValue", "status", msg);
    };
    dictApp.prototype.log = function (lvl, msg) {
        if (lvl == "info") {
            this.logger.info(msg);
        }
        else if (lvl == "error") {
            this.logger.error(msg);
        }
    };
    return dictApp;
}());
exports.dictApp = dictApp;
;
//# sourceMappingURL=dictApp.js.map