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
exports.ReciteWordsApp = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var log4js = __importStar(require("log4js"));
var electron_1 = require("electron");
var utils_1 = require("./utils/utils");
var SDictBase_1 = require("./components/SDictBase");
var AuidoArchive_1 = require("./components/AuidoArchive");
var UsrProgress_1 = require("./components/UsrProgress");
var DownloardQueue_1 = require("./utils/DownloardQueue");
var globalInterface_1 = require("./utils/globalInterface");
var ReciteWordsApp = /** @class */ (function () {
    function ReciteWordsApp() {
        this.bDebug = false;
        this.bCfgModfied = false;
        this.usrsDict = new Map();
        this.today = new Date();
        this.timeDayLst = new Array();
        this.Mode = "Study Mode";
        this.WordsDict = new Map();
        this.LearnLst = new Array();
        this.CurLearnLst = new Array();
        this.CurLearnPos = 0;
        this.TestLst = new Array();
        this.CurTestLst = new Array();
        this.CurTestPos = 0;
        this.TestCount = 0;
        this.ErrCount = 0;
        this.CurCount = 1;
        this.lastWord = "";
        this.curWord = "";
        /*
        this.root.bind("<Escape>", this.exit_app);
        this.root.bind("<Return>", this.check_input);
        */
        console.clear();
    }
    ReciteWordsApp.prototype.ReadAndConfigure = function () {
        this.cfgFile = path.join(this.startPath, 'ReciteWords.json').replace(/\\/g, '/');
        var _this = this;
        if (fs.existsSync(_this.cfgFile) == false) {
            console.log(_this.cfgFile + " doesn't exist");
            return false;
        }
        ;
        this.cfg = JSON.parse(fs.readFileSync(_this.cfgFile).toString());
        var common = JSON.parse(JSON.stringify(this.cfg.common));
        console.log('ver: ' + common.ver);
        var debugCfg = JSON.parse(JSON.stringify(this.cfg.Debug));
        this.bDebug = debugCfg.bEnable;
        var debugLvl = 'INFO';
        if (this.bDebug == true) {
            debugLvl = 'DEBUG';
            var logFile = path.join(this.startPath, debugCfg.file);
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
                    reciteWordsLogs: {
                        type: 'file',
                        filename: logFile,
                        category: 'reciteWords',
                        layout: {
                            type: 'pattern',
                            pattern: '%d{yyyy-MM-dd hh:mm:ss} %-5p [%l@%f{1}] - %m'
                        }
                    },
                },
                categories: {
                    default: {
                        appenders: ['consoleAppender', 'reciteWordsLogs'],
                        level: debugLvl,
                        enableCallStack: true
                    },
                },
            });
        }
        this.logger = log4js.getLogger('reciteWordsLogs');
        // read all users
        for (var _i = 0, _a = this.cfg.Users; _i < _a.length; _i++) {
            var usrCfg = _a[_i];
            var name_1 = usrCfg.Name;
            var levels = usrCfg.Target;
            this.usrsDict.set(name_1, levels);
            console.log("User: " + name_1 + ", Levels: " + levels);
        }
        return true;
    };
    ReciteWordsApp.prototype.Start = function (bDev, startPath) {
        return __awaiter(this, void 0, void 0, function () {
            var dQueue;
            return __generator(this, function (_a) {
                this.startPath = startPath;
                this.CreateWindow(bDev);
                this.initDict();
                dQueue = new DownloardQueue_1.DownloardQueue(this.win);
                globalInterface_1.globalVar.dQueue = dQueue;
                return [2 /*return*/];
            });
        });
    };
    ReciteWordsApp.prototype.CreateWindow = function (bDev) {
        var size = { w: 0, h: 0 };
        if (this.ReadAndConfigure() == false) {
            return;
        }
        // Create the browser window.
        this.win = new electron_1.BrowserWindow({
            fullscreen: true,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        // and load the index.html of the app.
        this.win.loadURL("file://" + __dirname + "/assets/ReciteWords.html");
        if (this.bDebug) {
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
    };
    ReciteWordsApp.prototype.initDict = function () {
        try {
            var dict = this.cfg["DictBase"]["DictBase"]["Dict"];
            var dictFile = path.join(this.startPath, dict).replace(/\\/g, '/');
            console.log("dict: " + dictFile);
            this.dictBase = new SDictBase_1.SDictBase(dictFile);
            var audioCfg = this.cfg["DictBase"]["AudioBase"];
            var audio = audioCfg["Audio"];
            var audioFile = path.join(this.startPath, audio).replace(/\\/g, '/');
            console.log("audio: " + audioFile);
            var compression = audioCfg["Format"]["Compression"];
            var compressLevel = audioCfg["Format"]["Compress Level"];
            this.audioBase = new AuidoArchive_1.AuidoArchive(audioFile, compression, compressLevel);
        }
        catch (e) {
            this.logger.error(e.message);
            electron_1.app.quit();
        }
    };
    ReciteWordsApp.prototype.GoStudyMode = function () {
        this.Mode = "Study Mode";
        this.win.webContents.send("gui", "modifyValue", "title", "Study Mode");
        console.log("Study Mode");
        this.win.webContents.send("gui", "modifyValue", "count", "");
        this.CurLearnPos = 0;
        var len = this.LearnLst.length;
        if (len > 10) {
            // this.CurLearnLst = this.LearnLst.slice(0, 10);
            this.CurLearnLst = this.LearnLst.splice(0, 10);
        }
        else if (len > 0) {
            // this.CurLearnLst = (this.LearnLst || []).concat();
            // this.LearnLst = [];
            this.CurLearnLst = this.LearnLst.splice(0, len);
        }
        else {
            this.CurLearnLst.length = 0;
            // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
            this.GoTestMode();
        }
        this.win.webContents.send("gui", "modifyValue", "numOfLearn", this.LearnLst.length + " words to Learn!");
        this.Study_Next();
    };
    ReciteWordsApp.prototype.Study_Next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var len, word, lastDate, data, familiar, lastDate_1, nextDate, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        len = this.CurLearnLst.length;
                        if (!(len > 0)) return [3 /*break*/, 2];
                        word = this.CurLearnLst[this.CurLearnPos];
                        return [4 /*yield*/, this.usrProgress.GetLastDate(word)];
                    case 1:
                        lastDate = _a.sent();
                        if (lastDate == null) {
                            this.win.webContents.send("gui", "modifyValue", "score", "New!");
                        }
                        else {
                            this.win.webContents.send("gui", "modifyValue", "score", "");
                        }
                        data = this.WordsDict.get(word);
                        if (data != undefined) {
                            familiar = data[0];
                            lastDate_1 = data[1];
                            nextDate = data[2];
                            msg = "Familiar: " + familiar + ", LastDate: " + utils_1.formatDate(lastDate_1) + ", NextDate: " + utils_1.formatDate(nextDate);
                            console.log("LearnWord: " + word + ", " + msg);
                            this.win.webContents.send("gui", "modifyValue", "info", msg);
                        }
                        this.Show_Content(word, true);
                        this.Play_MP3(word);
                        this.win.webContents.send("gui", "modifyValue", "numOfWords", this.CurLearnPos + 1 + " of " + len);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.GoTestMode = function () {
        this.Mode = "Test Mode";
        this.win.webContents.send("gui", "modifyValue", "title", "Test Mode");
        console.log("Test Mode");
        var len = this.TestLst.length;
        if (this.CurCount <= this.TestCount && this.CurTestLst.length > 0) {
            this.CurTestPos = 0;
            this.win.webContents.send("gui", "modifyValue", "count", "Count: " + this.CurCount + " of " + this.TestCount);
            // this.Clear_Content();
            this.Test_Next();
        }
        else if (this.CurLearnLst.length > 0) {
            // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", true);
            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else if (len > 10) {
            this.CurTestLst = this.TestLst.splice(0, 10);
            this.win.webContents.send("gui", "modifyValue", "numOfTest", this.TestLst.length + " words to Test!");
            this.CurTestPos = 0;
            this.CurCount = 1;
            this.win.webContents.send("gui", "modifyValue", "count", "Count: " + this.CurCount + " of " + this.TestCount);
            this.Test_Next();
        }
        else if (len > 0) {
            this.CurTestLst = this.TestLst.splice(0, len);
            this.win.webContents.send("gui", "modifyValue", "numOfTest", this.TestLst.length + " words to Test!");
            this.CurTestPos = 0;
            this.CurCount = 1;
            this.win.webContents.send("gui", "modifyValue", "count", "Count: " + this.CurCount + " of " + this.TestCount);
            this.Test_Next();
        }
        else if (this.LearnLst.length > 0) {
            // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", true);
            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else {
            this.CurTestPos += 1;
            this.quit();
        }
    };
    ReciteWordsApp.prototype.Test_Next = function () {
        var word = this.CurTestLst[this.CurTestPos];
        var data = this.WordsDict.get(word);
        if (data != undefined) {
            var familiar = data[0];
            var lastDate = data[1];
            var nextDate = data[2];
            var msg = "Familiar: " + familiar + ", LastDate: " + utils_1.formatDate(lastDate) + ", NextDate: " + utils_1.formatDate(nextDate);
            console.log("TestWord: " + word + ", " + msg);
            this.win.webContents.send("gui", "modifyValue", "info", msg);
        }
        this.win.webContents.send("gui", "modifyValue", "word", "");
        this.Play_MP3(word);
        if (this.lastWord != "") {
            this.Show_Content(this.lastWord);
        }
        this.win.webContents.send("gui", "modifyValue", "numOfWords", this.CurTestPos + 1 + " of " + this.CurTestLst.length);
        // this.CurTestPos += 1;
    };
    ReciteWordsApp.prototype.Check_Input = function (input_word) {
        if (this.Mode == "Study Mode") {
            this.lastWord = this.CurLearnLst[this.CurLearnPos];
            this.CurLearnPos++;
            if (this.CurLearnPos < this.CurLearnLst.length) {
                this.Study_Next();
            }
            else {
                this.CurCount = 1;
                console.log("curCount: " + this.CurCount);
                this.CurTestLst = (this.CurLearnLst || []).concat();
                // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
                this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                this.GoTestMode();
            }
        }
        else {
            // let input_word = this.win.webContents.send("gui", "getValue", "score");
            var word = this.CurTestLst[this.CurTestPos];
            if (input_word != word) {
                this.ErrCount += 1;
                this.win.webContents.send("gui", "modifyValue", "score", "Wrong " + this.ErrCount + "!");
                console.log("ErrCount: " + this.ErrCount);
                console.log("Right word: " + word + ", Wrong word: " + input_word + ".");
                var data = this.WordsDict.get(word);
                if (data === undefined) {
                    throw new Error("${word} is not in WordsDict!");
                }
                var familiar = data[0];
                var lastDate = data[1];
                var nextDate = data[2];
                if (this.ErrCount == 1) {
                    // this.CurTestPos -= 1;
                    // this.WordsDict.set(word, familiar - 1);
                }
                else if (this.ErrCount < 3) {
                    // this.CurTestPos -= 1;
                    this.WordsDict.set(word, [familiar - 1, lastDate, nextDate]);
                }
                else {
                    this.Play_MP3(word);
                    this.win.webContents.send("gui", "modifyValue", "word", "");
                    this.Show_Content(word, true);
                    this.win.webContents.send("gui", "modifyValue", "score", "Go on!");
                    this.WordsDict.set(word, [familiar - 4, lastDate, nextDate]);
                    this.LearnLst.push(word);
                    console.log(word + " has been added in learn list.");
                    this.ErrCount = 0;
                    this.win.webContents.send("gui", "modifyValue", "numOfLearn", this.LearnLst.length + " words to Learn!");
                    return;
                }
            }
            else {
                this.win.webContents.send("gui", "modifyValue", "score", "OK!");
                this.ErrCount = 0;
                this.lastWord = word;
                this.CurTestPos++;
            }
            if (this.CurTestPos < this.CurTestLst.length) {
                // this.win.webContents.send("gui", "modifyValue", "word", "");
                this.Test_Next();
            }
            else {
                this.CurCount += 1;
                console.log("curCount: " + this.CurCount);
                this.GoTestMode();
            }
        }
    };
    ReciteWordsApp.prototype.Chop = function () {
        var word = "";
        if (this.Mode == "Study Mode") {
            word = this.CurLearnLst[this.CurLearnPos];
            for (var i = 0; i < this.CurLearnLst.length; i++) {
                if (this.CurLearnLst[i] == word) {
                    this.CurLearnLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.LearnLst.length; i++) {
                if (this.LearnLst[i] == word) {
                    this.LearnLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.CurTestLst.length; i++) {
                if (this.CurTestLst[i] == word) {
                    this.CurTestLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.TestLst.length; i++) {
                if (this.TestLst[i] == word) {
                    this.TestLst.splice(i, 1);
                    i--;
                }
            }
            var data = this.WordsDict.get(word);
            if (data != undefined) {
                var lastDate = this.today;
                var nextDate = data[2];
                this.WordsDict.set(word, [10, lastDate, nextDate]);
            }
            console.log(word + " has been chopped!");
            this.win.webContents.send("gui", "modifyValue", "numOfTest", this.TestLst.length + " words to Test!");
            this.lastWord = this.CurLearnLst[this.CurLearnPos - 1];
            // this.CurLearnPos++;
            if (this.CurLearnPos < this.CurLearnLst.length) {
                this.Study_Next();
            }
            else {
                this.CurCount = 1;
                console.log("curCount: " + this.CurCount);
                // this.GoStudyMode();
                this.CurTestLst = (this.CurLearnLst || []).concat();
                // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
                this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                this.GoTestMode();
            }
        }
        else {
            word = this.CurTestLst[this.CurTestPos];
            for (var i = 0; i < this.CurLearnLst.length; i++) {
                if (this.CurLearnLst[i] == word) {
                    this.CurLearnLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.LearnLst.length; i++) {
                if (this.LearnLst[i] == word) {
                    this.LearnLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.CurTestLst.length; i++) {
                if (this.CurTestLst[i] == word) {
                    this.CurTestLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.TestLst.length; i++) {
                if (this.TestLst[i] == word) {
                    this.TestLst.splice(i, 1);
                    i--;
                }
            }
            var data = this.WordsDict.get(word);
            if (data != undefined) {
                var lastDate = this.today;
                var nextDate = data[2];
                this.WordsDict.set(word, [10, lastDate, nextDate]);
            }
            console.log(word + " has been chopped!");
            this.win.webContents.send("gui", "modifyValue", "numOfTest", this.TestLst.length + " words to Test!");
            this.lastWord = this.CurTestLst[this.CurTestPos - 1];
            // this.CurTestPos++;
            if (this.CurTestPos < this.CurTestLst.length) {
                this.Test_Next();
            }
            else {
                this.CurCount += 1;
                console.log("curCount: " + this.CurCount);
                this.GoTestMode();
            }
        }
    };
    ReciteWordsApp.prototype.Forgoten = function () {
        var word = "";
        if (this.Mode == "Test Mode") {
            word = this.CurTestLst[this.CurTestPos];
            for (var i = 0; i < this.CurTestLst.length; i++) {
                if (this.CurTestLst[i] == word) {
                    this.CurTestLst.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.TestLst.length; i++) {
                if (this.TestLst[i] == word) {
                    this.TestLst.splice(i, 1);
                    i--;
                }
            }
            var data = this.WordsDict.get(word);
            if (data != undefined) {
                var familiar = data[0];
                var lastDate = this.today;
                var nextDate = new Date();
                // nextDate.setDate(this.today.getDate() - Number(this.timeDayLst[0]));
                this.WordsDict.set(word, [familiar - 5, lastDate, nextDate]);
            }
            this.LearnLst.push(word);
            console.log(word + " has been added in learn list.");
            this.win.webContents.send("gui", "modifyValue", "numOfLearn", this.LearnLst.length + " words to Learn!");
            console.log(word + " is forgotten!");
            this.lastWord = this.CurTestLst[this.CurTestPos - 1];
            if (this.CurTestPos < this.CurTestLst.length) {
                this.Test_Next();
            }
            else {
                this.CurCount += 1;
                console.log("curCount: " + this.CurCount);
                this.GoTestMode();
            }
        }
        return word;
    };
    ReciteWordsApp.prototype.Clear_Content = function () {
        this.win.webContents.send("gui", "modifyValue", "word", "");
        this.win.webContents.send("gui", "modifyValue", "symbol", "");
        this.win.webContents.send("gui", "modifyValue", "txtArea", "");
    };
    ReciteWordsApp.prototype.Play_Again = function () {
        /*let word = "";
        if (this.Mode == "Study Mode") {
            word = this.CurLearnLst[this.CurLearnPos];
        }
        else {
            word = this.CurTestLst[this.CurTestPos];
        }
        this.Play_MP3(word);*/
        this.win.webContents.send("gui", "playAudio");
    };
    // To-Do
    ReciteWordsApp.prototype.Play_MP3 = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var retAudio, audioFile;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(word == this.lastWord)) return [3 /*break*/, 1];
                        this.win.webContents.send("gui", "playAudio");
                        return [2 /*return*/, true];
                    case 1:
                        retAudio = -1;
                        audioFile = "";
                        return [4 /*yield*/, this.audioBase.query_audio(word)];
                    case 2:
                        _a = _b.sent(), retAudio = _a[0], audioFile = _a[1];
                        if (retAudio <= 0) {
                            this.logger.error(audioFile);
                            audioFile = path.join(this.startPath, "audio", "WrongHint.mp3");
                            this.win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
                            this.curWord = word;
                            return [2 /*return*/, false];
                        }
                        else {
                            this.win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ReciteWordsApp.prototype.Show_Content = function (word, bShowWord) {
        if (bShowWord === void 0) { bShowWord = false; }
        return __awaiter(this, void 0, void 0, function () {
            var txt, retDict, txtLst, symbol, meaning, sentences, txtContent;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (bShowWord) {
                            this.win.webContents.send("gui", "modifyValue", "word", word);
                        }
                        txt = "";
                        retDict = -1;
                        return [4 /*yield*/, this.dictBase.query_word(word)];
                    case 1:
                        _a = _b.sent(), retDict = _a[0], txt = _a[1];
                        txtLst = txt.split(";;");
                        if (retDict == 1) {
                            symbol = txtLst[0];
                            this.win.webContents.send("gui", "modifyValue", "symbol", "[" + symbol + "]");
                            meaning = txtLst[1];
                            if (txtLst[2] == null) {
                                txtLst[2] = "";
                            }
                            sentences = txtLst[2].replace(/\"/g, "\\\"");
                            sentences = sentences.replace(/\'/g, "\\\'");
                            sentences = sentences.replace(/\`/g, "\\\`");
                            txtContent = meaning + "\n" + sentences.replace(/\/r\/n/g, "\n");
                            // txtContent = txtContent.replace(/<br>/g, "");
                            this.win.webContents.send("gui", "modifyValue", "txtArea", txtContent);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.readUsrs = function () {
        /*this.usrDict.forEach((usrName: string, levels: Array<string>) => {
            this.logger.info(`User: ${usrName}, Levels: ${levels}`);
            this.win.webContents.send("gui", "appendList", "usr-select", usrName);
            for (let lvl of levels){

            }
        });

        this.win.webContents.send("gui", "appendList", "usr-select", "Add more...");
        this.win.webContents.send("gui", "appendList", "lvl-select", "Add more...");
        
        this.win.webContents.send("gui", "displayOrHide", "SelDiag", true);
        this.win.webContents.send("gui", "displayOrHide", "bg", true);
        */
        return this.usrsDict;
    };
    ReciteWordsApp.prototype.readAllLvls = function () {
        return this.cfg["DictBase"]["DictBase"]["allLvls"];
    };
    // TODO: 
    ReciteWordsApp.prototype.newLevel = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, usrCfg, progressFile, lvlWordsLst, ret, _b, lvlWordsLst_1, word, target;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("usr: " + usrName + ", new level: " + level);
                        _i = 0, _a = this.cfg.Users;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 12];
                        usrCfg = _a[_i];
                        if (!(usrName == usrCfg.Name)) return [3 /*break*/, 11];
                        if (this.usrProgress === undefined) {
                            this.usrProgress = new UsrProgress_1.UsrProgress();
                        }
                        progressFile = path.join(this.startPath, usrCfg.Progress).replace(/\\/g, '/');
                        return [4 /*yield*/, this.usrProgress.Open(progressFile, level)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.usrProgress.ExistTable(level)];
                    case 3:
                        if ((_c.sent()) == false) {
                            this.usrProgress.NewTable(level);
                        }
                        lvlWordsLst = new Array();
                        return [4 /*yield*/, this.dictBase.GetWordsLst(lvlWordsLst, level)];
                    case 4:
                        ret = _c.sent();
                        if (!ret) return [3 /*break*/, 9];
                        _b = 0, lvlWordsLst_1 = lvlWordsLst;
                        _c.label = 5;
                    case 5:
                        if (!(_b < lvlWordsLst_1.length)) return [3 /*break*/, 8];
                        word = lvlWordsLst_1[_b];
                        // console.log("Going to insert: " + word);
                        return [4 /*yield*/, this.usrProgress.InsertWord(word)];
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
                        this.bCfgModfied = true;
                        return [2 /*return*/, Promise.resolve(true)];
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/, Promise.resolve(false)];
                }
            });
        });
    };
    ReciteWordsApp.prototype.NewUsr = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var progressFile, lvlWordsLst, _i, lvlWordsLst_2, word;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // TODO: record it in json
                        this.bCfgModfied = true;
                        this.usrProgress = new UsrProgress_1.UsrProgress();
                        progressFile = path.join(this.startPath, "dict", "usrName" + ".progress").replace(/\\/g, '/');
                        return [4 /*yield*/, this.usrProgress.New(progressFile, level)];
                    case 1:
                        _a.sent();
                        lvlWordsLst = new Array();
                        this.dictBase.GetWordsLst(lvlWordsLst, level);
                        _i = 0, lvlWordsLst_2 = lvlWordsLst;
                        _a.label = 2;
                    case 2:
                        if (!(_i < lvlWordsLst_2.length)) return [3 /*break*/, 5];
                        word = lvlWordsLst_2[_i];
                        return [4 /*yield*/, this.usrProgress.InsertWord(word)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.isLevelDone = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, usrCfg, progress, progressFile, numOfUnrecitedWord, ret, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.cfg.Users;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 14];
                        usrCfg = _a[_i];
                        if (!(usrName == usrCfg.Name)) return [3 /*break*/, 13];
                        progress = usrCfg.Progress;
                        progressFile = path.join(this.startPath, progress).replace(/\\/g, '/');
                        // this.logger.info("progress: ", progressFile);
                        if (this.usrProgress === undefined) {
                            this.usrProgress = new UsrProgress_1.UsrProgress();
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 11, , 12]);
                        return [4 /*yield*/, this.usrProgress.Open(progressFile, level)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.usrProgress.GetInProgressCount(level)];
                    case 4:
                        numOfUnrecitedWord = _b.sent();
                        if (!(numOfUnrecitedWord == 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, electron_1.dialog.showMessageBox({
                                type: "info",
                                message: usrName + "'s " + level + " is done! Do you want to reset?",
                                buttons: ["Yes", "No"]
                            })];
                    case 5:
                        ret = _b.sent();
                        if (!(ret.response == 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, electron_1.dialog.showMessageBox({
                                type: "info",
                                message: "Reset function is not implemented!",
                                buttons: ["Confirm"]
                            })];
                    case 6:
                        ret = _b.sent();
                        return [2 /*return*/, Promise.resolve(true)];
                    case 7: return [2 /*return*/, Promise.resolve(true)];
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, Promise.resolve(false)];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        e_1 = _b.sent();
                        this.logger.error(e_1);
                        return [2 /*return*/, Promise.reject(e_1)];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        _i++;
                        return [3 /*break*/, 1];
                    case 14: return [2 /*return*/, Promise.reject("Usr doesn't exist!")];
                }
            });
        });
    };
    ReciteWordsApp.prototype.Go = function (usrName, level) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, usrCfg, progress, progressFile, allCount, newCount, finishCount, InProgressCount, timeArray, _b, timeArray_1, timeGroup, allLimit, newWdsLimit, limit, wdsLst, numOfWords, todayStr, _c, wdsLst_1, wd, _d, wdsLst_2, wd, _e, wdsLst_3, wd, _f, _g, word;
            var _this_1 = this;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        console.log("Go!");
                        /*globalShortcut.unregister('Enter');
                        globalShortcut.register('Enter', () => {
                        });*/
                        electron_1.globalShortcut.register('F5', function () {
                            _this_1.Play_Again();
                        });
                        electron_1.globalShortcut.register('F6', function () {
                            _this_1.Forgoten();
                        });
                        electron_1.globalShortcut.register('F7', function () {
                            _this_1.Chop();
                        });
                        _i = 0, _a = this.cfg.Users;
                        _h.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        usrCfg = _a[_i];
                        if (!(usrName == usrCfg.Name)) return [3 /*break*/, 3];
                        this.logger.info("selectUser: " + usrName + ", Level: " + level);
                        progress = usrCfg.Progress;
                        progressFile = path.join(this.startPath, progress).replace(/\\/g, '/');
                        this.logger.info("progress: ", progressFile);
                        if (this.usrProgress === undefined) {
                            this.usrProgress = new UsrProgress_1.UsrProgress();
                        }
                        // await this.usrProgress.Open(progressFile);
                        return [4 /*yield*/, this.usrProgress.Open(progressFile, level)];
                    case 2:
                        // await this.usrProgress.Open(progressFile);
                        _h.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        // let level = usrCfg.Target;
                        // 
                        // await this.usrProgress.UpdateProgress('cord', 5, '2020-12-31');
                        // await this.usrProgress.Close();
                        // console.log('Done');
                        // update info;
                        this.win.webContents.send("gui", "modifyValue", "studyLearnBtn", "\u6B63\u5728\u5B66\u4E60");
                        this.win.webContents.send("gui", "modifyValue", "usr", "" + usrName);
                        this.win.webContents.send("gui", "modifyValue", "level", "" + level);
                        return [4 /*yield*/, this.usrProgress.GetAllCount(level)];
                    case 5:
                        allCount = _h.sent();
                        this.win.webContents.send("gui", "modifyValue", "allCount", "All words: " + allCount);
                        this.logger.info("All words: " + allCount);
                        return [4 /*yield*/, this.usrProgress.GetNewCount(level)];
                    case 6:
                        newCount = _h.sent();
                        this.win.webContents.send("gui", "modifyValue", "newCount", "New words to learn: " + newCount);
                        this.logger.info("New words to learn: " + newCount);
                        return [4 /*yield*/, this.usrProgress.GetFnshedCount(level)];
                    case 7:
                        finishCount = _h.sent();
                        this.win.webContents.send("gui", "modifyValue", "finishCount", "Words has recited: " + finishCount);
                        this.logger.info("Words has recited: " + finishCount);
                        return [4 /*yield*/, this.usrProgress.GetInProgressCount(level)];
                    case 8:
                        InProgressCount = _h.sent();
                        this.win.webContents.send("gui", "modifyValue", "InProgressCount", "Words in learning: " + InProgressCount);
                        this.logger.info("Words in learning: " + InProgressCount);
                        timeArray = this.cfg["TimeInterval"];
                        for (_b = 0, timeArray_1 = timeArray; _b < timeArray_1.length; _b++) {
                            timeGroup = timeArray_1[_b];
                            if (timeGroup["Unit"] == "d") {
                                this.timeDayLst.push(timeGroup["Interval"]);
                            }
                        }
                        allLimit = this.cfg.General.Limit;
                        newWdsLimit = this.cfg.StudyMode.Limit;
                        this.TestCount = this.cfg.TestMode.Times;
                        limit = 0;
                        wdsLst = new Array();
                        numOfWords = 0;
                        todayStr = utils_1.formatDate(this.today);
                        // get over due words
                        console.log("starting to get over due words");
                        wdsLst.length = 0;
                        limit = allLimit;
                        return [4 /*yield*/, this.usrProgress.GetOvrDueWordsLst(wdsLst, todayStr)];
                    case 9:
                        if (_h.sent()) {
                            for (_c = 0, wdsLst_1 = wdsLst; _c < wdsLst_1.length; _c++) {
                                wd = wdsLst_1[_c];
                                this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                                console.log("Word: " + wd.Word + ", Familiar: " + wd.Familiar + ", LastDate: " + wd.LastDate + ", NextDate: " + wd.NextDate);
                                if (this.WordsDict.size >= limit) {
                                    break;
                                }
                            }
                        }
                        this.logger.info("got " + (this.WordsDict.size - numOfWords) + " over due words.");
                        numOfWords = this.WordsDict.size;
                        // get due words
                        console.log("starting to get due words");
                        wdsLst.length = 0;
                        limit = allLimit - this.WordsDict.size;
                        if (!(limit > 0)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.usrProgress.GetDueWordsLst(wdsLst, todayStr)];
                    case 10:
                        if (_h.sent()) {
                            for (_d = 0, wdsLst_2 = wdsLst; _d < wdsLst_2.length; _d++) {
                                wd = wdsLst_2[_d];
                                this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                                console.log("Word: " + wd.Word + ", Familiar: " + wd.Familiar + ", LastDate: " + wd.LastDate + ", NextDate: " + wd.NextDate);
                                if (this.WordsDict.size >= limit) {
                                    break;
                                }
                            }
                        }
                        _h.label = 11;
                    case 11:
                        this.logger.info("got " + (this.WordsDict.size - numOfWords) + " due words.");
                        numOfWords = this.WordsDict.size;
                        // get new words
                        console.log("starting to get new words");
                        wdsLst.length = 0;
                        limit = Math.min(allLimit - this.WordsDict.size, newWdsLimit);
                        if (!(limit > 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.usrProgress.GetNewWordsLst(wdsLst, limit)];
                    case 12:
                        if (_h.sent()) {
                            for (_e = 0, wdsLst_3 = wdsLst; _e < wdsLst_3.length; _e++) {
                                wd = wdsLst_3[_e];
                                this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                                console.log("Word: " + wd.Word + ", Familiar: " + wd.Familiar + ", LastDate: " + wd.LastDate + ", NextDate: " + wd.NextDate);
                                this.LearnLst.push(wd.Word);
                            }
                        }
                        _h.label = 13;
                    case 13:
                        this.logger.info("got " + (this.WordsDict.size - numOfWords) + " new words.");
                        // complement learn list
                        this.WordsDict.forEach(function (_a, word) {
                            var familiar = _a[0], lastDate = _a[1], nextDate = _a[2];
                            if (familiar < 0) {
                                _this_1.LearnLst.push(word);
                            }
                        });
                        utils_1.randomArray2(this.LearnLst);
                        this.logger.info("len of LearnList: " + this.LearnLst.length + ".");
                        for (_f = 0, _g = Array.from(this.WordsDict.keys()); _f < _g.length; _f++) {
                            word = _g[_f];
                            this.TestLst.push(word);
                        }
                        // random test list
                        this.TestLst = utils_1.randomArray(this.TestLst);
                        this.logger.info("len of TestList: " + this.TestLst.length + ".");
                        //this.wordInput['state'] = 'readonly';
                        this.win.webContents.send("gui", "modifyValue", "numOfLearn", this.LearnLst.length + " words to Learn!");
                        this.win.webContents.send("gui", "modifyValue", "numOfTest", this.TestLst.length + " words to Test!");
                        if (this.LearnLst.length > 0) {
                            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
                            this.GoStudyMode();
                        }
                        else {
                            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                            this.GoTestMode();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.Save_Progress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, word, _b, _c, word, data, familiar, lastDate, nextDate, _d, _e, word, _f, _g, word, data, familiar, lastDate, nextDate, allLen, lastDateStr, nexDateStr, mapStr, i, nFnshd, iterator, r, todayStr, interval, index, nextInterval, _h, word, _j, familiar, lastDate, nextDate, percent, e_2;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        // remove words which hadn't be recited
                        for (_i = 0, _a = this.TestLst; _i < _a.length; _i++) {
                            word = _a[_i];
                            if (this.WordsDict.has(word)) {
                                this.WordsDict.delete(word);
                            }
                        }
                        if (this.Mode == "Study Mode") {
                            for (_b = 0, _c = this.CurLearnLst; _b < _c.length; _b++) {
                                word = _c[_b];
                                if (this.WordsDict.has(word)) {
                                    data = this.WordsDict.get(word);
                                    if (data != undefined) {
                                        familiar = data[0] - 1;
                                        lastDate = data[1];
                                        nextDate = data[2];
                                        this.WordsDict.set(word, [familiar, lastDate, nextDate]);
                                    }
                                }
                            }
                        }
                        else {
                            if (this.CurCount >= this.TestCount) {
                                this.CurTestLst.splice(0, this.CurTestPos - 1);
                            }
                            for (_d = 0, _e = this.CurTestLst; _d < _e.length; _d++) {
                                word = _e[_d];
                                if (this.WordsDict.has(word)) {
                                    this.WordsDict.delete(word);
                                }
                            }
                        }
                        for (_f = 0, _g = this.LearnLst; _f < _g.length; _f++) {
                            word = _g[_f];
                            if (this.WordsDict.has(word)) {
                                data = this.WordsDict.get(word);
                                if (data != undefined) {
                                    familiar = data[0] - 1;
                                    lastDate = data[1];
                                    nextDate = data[2];
                                    this.WordsDict.set(word, [familiar, lastDate, nextDate]);
                                }
                            }
                        }
                        allLen = this.WordsDict.size;
                        this.logger.info("number of words' familiar will be changed: " + allLen);
                        lastDateStr = "", nexDateStr = "";
                        mapStr = "{";
                        this.WordsDict.forEach(function (_a, word) {
                            var familiar = _a[0], lastDate = _a[1], nextDate = _a[2];
                            if (lastDate != null) {
                                lastDateStr = utils_1.formatDate(lastDate);
                            }
                            else {
                                lastDateStr = "";
                            }
                            if (nextDate != null) {
                                nexDateStr = utils_1.formatDate(nextDate);
                            }
                            else {
                                nexDateStr = "";
                            }
                            mapStr += word + ": " + String(familiar) + ", lastDate: " + lastDateStr + ", nextDate: " + nexDateStr + ";";
                        });
                        mapStr += "}";
                        console.log("WordsDict = " + mapStr);
                        i = 0, nFnshd = 0;
                        iterator = this.WordsDict.entries();
                        todayStr = utils_1.formatDate(this.today);
                        interval = 0, index = 0;
                        nextInterval = 0;
                        _k.label = 1;
                    case 1:
                        if (!(r = iterator.next(), !r.done)) return [3 /*break*/, 6];
                        _h = r.value, word = _h[0], _j = _h[1], familiar = _j[0], lastDate = _j[1], nextDate = _j[2];
                        familiar += 1.0;
                        if (familiar > 10) {
                            familiar = 10.0;
                        }
                        else if (familiar < -10) {
                            familiar = -10.0;
                        }
                        familiar = Number(familiar.toFixed(1));
                        if (familiar >= 10) {
                            nFnshd++;
                        }
                        // calc next date
                        if (lastDate != null && nextDate != null) {
                            interval = (nextDate.valueOf() - lastDate.valueOf()) / 1000 / 60 / 60 / 24;
                        }
                        else {
                            interval = 0;
                            index = 0;
                        }
                        if (interval > 0) {
                            if ((nextDate.getFullYear() == this.today.getFullYear()) && (nextDate.getMonth() == this.today.getMonth()) && (nextDate.getDate() == this.today.getDate())) { // due
                                index = this.timeDayLst.indexOf(interval);
                                if (index != -1) {
                                    index++;
                                    if (index >= this.timeDayLst.length) {
                                        index = 0;
                                    }
                                }
                                else {
                                    index = 0;
                                }
                            }
                            else { // over due
                                index = 0;
                            }
                        }
                        else {
                            index = 0;
                        }
                        nextInterval = this.timeDayLst[index];
                        nextDate = new Date();
                        // Object.assign(nextDate, this.today);
                        nextDate.setDate(this.today.getDate() + nextInterval);
                        nexDateStr = utils_1.formatDate(nextDate);
                        _k.label = 2;
                    case 2:
                        _k.trys.push([2, 4, , 5]);
                        console.log(word + ": " + String(familiar) + ", lastDate: " + todayStr + ", nextDate: " + nexDateStr);
                        return [4 /*yield*/, this.usrProgress.UpdateProgress2(word, familiar, todayStr, nexDateStr)];
                    case 3:
                        _k.sent();
                        i++;
                        percent = i / allLen * 100;
                        console.log(percent.toFixed(2) + "% to save progress.");
                        this.win.webContents.send("gui", "modifyValue", "info", percent.toFixed(2) + "% to save progress.");
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _k.sent();
                        this.logger.error(e_2.message);
                        this.logger.error(e_2);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 1];
                    case 6:
                        this.logger.info("finish to receite number of words: " + nFnshd);
                        // console.log("OK to save progress.");
                        this.win.webContents.send("gui", "modifyValue", "info", "OK to save progress.");
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.SaveConfigure = function () {
        var _this_1 = this;
        return new Promise(function (resolve, reject) {
            // Indent by 4 spaces
            fs.writeFile(_this_1.cfgFile, JSON.stringify(_this_1.cfg, null, 4), { 'flag': 'w' }, function (err) {
                if (err) {
                    _this_1.logger.error("Fail to SaveConfigure!");
                    reject("Fail to SaveConfigure!");
                }
                else {
                    console.log("Success to SaveConfigure");
                    resolve(true);
                }
            });
        });
    };
    ReciteWordsApp.prototype.Close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.dictBase) {
                            this.dictBase.close();
                        }
                        if (this.audioBase) {
                            this.audioBase.close();
                        }
                        if (!this.usrProgress) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.usrProgress.Close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!this.bCfgModfied) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.SaveConfigure()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.quit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, sec, min, hour;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Save_Progress()];
                    case 1:
                        _a.sent();
                        this.Close();
                        now = new Date();
                        sec = now.getSeconds() - this.today.getSeconds();
                        min = now.getMinutes() - this.today.getMinutes();
                        hour = now.getHours() - this.today.getHours();
                        if (sec < 0) {
                            sec += 60;
                            min--;
                        }
                        if (min < 0) {
                            min += 60;
                            hour--;
                        }
                        this.logger.info("it cost " + hour + " hours, " + min + " minutes, " + sec + " seconds.");
                        electron_1.app.quit();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReciteWordsApp.prototype.info = function (ret, typ, word, msg) {
        console.log(msg);
        if (ret == 1) {
            if (typ == 2) {
                if (word = this.curWord) {
                    this.win.webContents.send("gui", "loadAndPlayAudio", msg.replace(/\\/g, '/'));
                    msg = "OK to download audio of " + word;
                }
            }
        }
        this.win.webContents.send("gui", "modifyValue", "status", msg);
    };
    return ReciteWordsApp;
}());
exports.ReciteWordsApp = ReciteWordsApp;
;
//# sourceMappingURL=ReciteWordsApp.js.map