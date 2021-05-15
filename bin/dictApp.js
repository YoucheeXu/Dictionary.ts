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
var dictApp = /** @class */ (function () {
    function dictApp() {
        this.bCfgModfied = false;
        this.dictAgent = new Array();
        this.dictBaseDict = new Map();
        this.curWord = "";
        this.bDebug = false;
    }
    dictApp.prototype.ReadAndConfigure = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this, common, debugCfg, debugLvl, logFile, agentCfg, bIEAgent, activeAgent, agentInfo, _i, agentInfo_1, agent, _a, _b, tabGroup, dictSrc, audioCfg, audioFile, audioFormatCfg, usrCfg, progressFile, missCfg;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.cfgFile = path.join(__dirname, '../bin/Dictionary.json').replace(/\\/g, '/');
                        _this = this;
                        if (fs.existsSync(this.cfgFile) == false) {
                            console.log(_this.cfgFile + " doesn't exist");
                            return [2 /*return*/, false];
                        }
                        ;
                        this.cfg = JSON.parse(fs.readFileSync(this.cfgFile).toString());
                        common = JSON.parse(JSON.stringify(this.cfg.common));
                        console.log('ver: ' + common.ver);
                        debugCfg = JSON.parse(JSON.stringify(this.cfg.Debug));
                        this.bDebug = debugCfg.bEnable;
                        debugLvl = 'INFO';
                        if (this.bDebug == true) {
                            debugLvl = 'DEBUG';
                            logFile = path.join(__dirname, debugCfg.file);
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
                        for (_a = 0, _b = JSON.parse(JSON.stringify(this.cfg['Tabs'])); _a < _b.length; _a++) {
                            tabGroup = _b[_a];
                            dictSrc = path.join(__dirname, tabGroup.Dict);
                            this.AddDictBase(tabGroup.Name, dictSrc, JSON.parse(JSON.stringify(tabGroup['Format'])));
                        }
                        audioCfg = JSON.parse(JSON.stringify(this.cfg['Audio']))[0];
                        audioFile = path.join(__dirname, audioCfg.Audio);
                        audioFormatCfg = JSON.parse(JSON.stringify(audioCfg['Format']));
                        if (audioFormatCfg.Type == 'ZIP') {
                            this.audioPackage = new AuidoArchive_1.AuidoArchive(audioFile, audioFormatCfg.Compression, audioFormatCfg.Compress_Level);
                            // this.AddAudio(name, audioPackage);
                        }
                        usrCfg = JSON.parse(JSON.stringify(this.cfg['Users']))[0];
                        progressFile = path.join(__dirname, usrCfg.Progress).replace(/\\/g, '/');
                        this.usrProgress = new UsrProgress_1.UsrProgress();
                        return [4 /*yield*/, this.usrProgress.Open(progressFile, "New")];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.usrProgress.ExistTable("New")];
                    case 2:
                        if ((_c.sent()) == false) {
                            this.usrProgress.NewTable(progressFile, "New");
                        }
                        missCfg = JSON.parse(JSON.stringify(this.cfg['Miss']));
                        this.miss_dict = path.join(__dirname, missCfg.miss_dict);
                        this.miss_audio = path.join(__dirname, missCfg.miss_audio);
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
    dictApp.prototype.Start = function (bDev) {
        return __awaiter(this, void 0, void 0, function () {
            var dQueue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.CreateWindow(bDev)];
                    case 1:
                        _a.sent();
                        dQueue = new DownloardQueue_1.DownloardQueue(this.win);
                        globalInterface_1.globalVar.dQueue = dQueue;
                        return [2 /*return*/];
                }
            });
        });
    };
    dictApp.prototype.CreateWindow = function (bDev) {
        return __awaiter(this, void 0, void 0, function () {
            var size;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        size = { w: 0, h: 0 };
                        return [4 /*yield*/, this.ReadAndConfigure()];
                    case 1:
                        if ((_a.sent()) == false) {
                            return [2 /*return*/];
                        }
                        this.getWinSize(size);
                        // Create the browser window.
                        this.win = new electron_1.BrowserWindow({
                            icon: path.join(__dirname, 'assets/img/dictApp.ico'),
                            width: size.w,
                            height: size.h,
                            frame: false,
                            webPreferences: {
                                nodeIntegration: true,
                            },
                        });
                        // and load the index.html of the app.
                        this.win.loadURL("file://" + __dirname + "/assets/Dictionary.html");
                        if (bDev) {
                            // Open the DevTools.
                            this.win.webContents.openDevTools({ mode: 'detach' });
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
                }
            });
        });
    };
    dictApp.prototype.GetWindow = function () {
        return this.win;
    };
    dictApp.prototype.Close = function () {
        // only work in target >= es6
        // for (let value of this.dictBaseDict.values()) {
        // 	console.log("Close " + value["name"]);
        // 	this.logger.info("Close " + value["name"]);
        // 	value["dictBase"]?.close();
        // }
        this.dictBaseDict.forEach(function (value, key) {
            var _a;
            console.log("Start to close " + value["name"]);
            (_a = value["dictBase"]) === null || _a === void 0 ? void 0 : _a.close();
        });
        this.audioPackage.close();
        if (this.bCfgModfied) {
            this.SaveConfigure();
        }
    };
    dictApp.prototype.Record2File = function (file, something) {
        var _this_1 = this;
        fs.writeFile(file, something, { 'flag': 'a' }, function (err) {
            if (err) {
                _this_1.logger.error("Fail to record " + something + " in " + file + "!");
            }
            else {
                console.log("Success to record " + something + " in " + file + "!");
            }
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
        var dictBase = null;
        if (format.Type == 'ZIP') {
            dictBase = new GDictBase_1.GDictBase(dictSrc, format.Compression, format.Compress_Level);
        }
        else if (format.Type == 'SQLite') {
            dictBase = new SDictBase_1.SDictBase(dictSrc);
        }
        else if (format.Type == 'mdx') {
            // dictBase = new MDictBase(dictSrc);
        }
        else {
            throw new Error("Unknown dict's type: " + format.Type + "!");
        }
        var dictId = 'dict' + String(this.dictBaseDict.size + 1);
        // this.dictBaseDict.push({dictId: { 'name': name, 'dictBase': dictBase } });
        // this.dictBaseDict[dictId] = { 'name': name, 'dictBase': dictBase };
        this.dictBaseDict.set(dictId, { 'name': name, 'dictBase': dictBase });
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
        var gui = JSON.parse(JSON.stringify(this.cfg['GUI']));
        size.h = gui.Height;
        size.w = gui.Width;
        // size.showHiRatio = gui.ShowHiRatio;
        // size.showWiRatio = gui.ShowWiRatio;
    };
    dictApp.prototype.OnButtonClicked = function (id) {
        switch (id) {
            case "btn_close":
                // 做点其它操作：比如记录窗口大小、位置等，下次启动时自动使用这些设置；不过因为这里（主进程）无法访问localStorage，这些数据需要使用其它的方式来保存和加载，这里就不作演示了。这里推荐一个相关的工具类库，可以使用它在主进程中保存加载配置数据：https://github.com/sindresorhus/electron-store
                // ...
                // safeExit = true;
                this.Close();
                electron_1.app.quit(); // 退出程序
                break;
            // case "btn_min":
            // 	break;
            case 'btn_prev':
                this.QueryPrev();
                break;
            case 'btn_next':
                this.QueryNext();
                break;
            default:
                this.logger.info(id);
        }
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
    dictApp.prototype.QueryWord = function (word, nDirect) {
        if (nDirect === void 0) { nDirect = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var retDict, dict, retAudio, audio;
            var _a, _b;
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
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.usrProgress.ExistWord(word)];
                    case 4:
                        if (!((_c.sent()) == false)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.usrProgress.InsertWord(word)];
                    case 5:
                        _c.sent();
                        _c.label = 6;
                    case 6:
                        if (retAudio <= 0) {
                            this.logger.error("audio: " + audio);
                            this.info(-1, 2, word, audio);
                            audio = path.join(__dirname, "audio", "WrongHint.mp3");
                            if (retAudio < 0) {
                                this.Record2File(this.miss_audio, "Audio of " + word + ": " + audio + "\n\n");
                                audio = path.join(__dirname, "audio", "WrongHint.mp3");
                            }
                        }
                        else if (retDict < 0) {
                            this.Record2File(this.miss_audio, "\n");
                        }
                        if (retAudio == 1) {
                            // this.win.webContents.send("gui", "modifyValue", "status", "");
                            this.info(0, 2, "", "");
                        }
                        audio = audio.replace(/\\/g, "/");
                        this.win.webContents.send("QueryWord", this.dictParseFun, word, this.dictId, dict, audio);
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
    dictApp.prototype.TopMostOrNot = function () {
        throw new Error('Method not implemented.');
        /*
        this.bTop = !this.bTop;
        this.window.TopMostOrNot(this.bTop);
        */
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