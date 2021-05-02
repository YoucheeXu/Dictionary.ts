import * as fs from "fs";
import * as path from "path";
import * as log4js from "log4js";
import { BrowserWindow, app, globalShortcut } from 'electron';

import { formatDate, randomArray, randomArray2 } from "./utils/utils";
import { SDictBase } from "./components/SDictBase";
import { AuidoArchive } from "./components/AuidoArchive";
import { UsrProgress } from "./components/UsrProgress";
import { DownloardQueue } from "./utils/DownloardQueue";
import { globalVar } from "./utils/globalInterface";

export class ReciteWordsApp {
    private cfgFile: string;
    private cfg: any;
    private bDebug: boolean = false;
    private bCfgModfied: boolean = false;
    private logger: log4js.Logger;

    private usrsDict = new Map();

    private dictBase: SDictBase;
    private audioBase: AuidoArchive;
    private usrProgress: UsrProgress;

    private win: BrowserWindow;

    private readonly today = new Date();
    private timeDayLst: number[] = new Array();

    private Mode = "Study Mode";

    private WordsDict = new Map<string, [number, Date, Date]>();

    private LearnLst: string[] = new Array();
    private CurLearnLst: string[] = new Array();
    private CurLearnPos = 0;
    private TestLst: string[] = new Array();
    private CurTestLst: string[] = new Array();
    private CurTestPos = 0;

    private TestCount = 0;
    private ErrCount = 0;
    private CurCount = 1;

    private lastWord = "";
    private curWord = "";

    constructor() {
        /*
        this.root.bind("<Escape>", this.exit_app);
        this.root.bind("<Return>", this.check_input);
        */
        console.clear();
    }

    public ReadAndConfigure(): boolean {

        this.cfgFile = path.join(__dirname, '../bin/ReciteWords.json').replace(/\\/g, '/');
        let _this = this;
        if (fs.existsSync(_this.cfgFile) == false) {
            console.log(_this.cfgFile + " doesn't exist");
            return false;
        };

        this.cfg = JSON.parse(fs.readFileSync(_this.cfgFile).toString());

        let common = JSON.parse(JSON.stringify(this.cfg.common));
        console.log('ver: ' + common.ver);

        let debugCfg = JSON.parse(JSON.stringify(this.cfg.Debug));

        this.bDebug = debugCfg.bEnable;

        let debugLvl = 'INFO';
        if (this.bDebug == true) {
            debugLvl = 'DEBUG';
            let logFile = path.join(__dirname, debugCfg.file);
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
        for (let usrCfg of this.cfg.Users) {
            let name = usrCfg.Name;
            let levels = usrCfg.Target;
            this.usrsDict.set(name, levels);
            console.log(`User: ${name}, Levels: ${levels}`);
        }

        return true;
    }

    public async Start(bDev: boolean) {
        this.CreateWindow(bDev);
        this.initDict();

        let dQueue = new DownloardQueue(this.win);
        globalVar.dQueue = dQueue;
    }

    public CreateWindow(bDev: boolean): void {
        let size = { w: 0, h: 0 };
        if (this.ReadAndConfigure() == false) {
            return;
        }

        // Create the browser window.
        this.win = new BrowserWindow({
            fullscreen: true,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
            },
        })

        // and load the index.html of the app.
        this.win.loadURL(`file://${__dirname}/assets/ReciteWords.html`);

        if (this.bDebug) {
            // Open the DevTools.
            this.win.webContents.openDevTools({ mode: 'detach' });
        }

        // let _this = this;
        // Emitted when the window is closed.
        this.win.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            // _this.win = null;
        });
    }

    private initDict() {
        try {
            let dict = this.cfg["DictBase"]["DictBase"]["Dict"];
            let dictFile = path.join(__dirname, dict).replace(/\\/g, '/');
            console.log(`dict: ${dictFile}`);
            this.dictBase = new SDictBase(dictFile);

            let audioCfg = this.cfg["DictBase"]["AudioBase"];
            let audio = audioCfg["Audio"];
            let audioFile = path.join(__dirname, audio).replace(/\\/g, '/');
            console.log(`audio: ${audioFile}`);
            let compression = audioCfg["Format"]["Compression"];
            let compressLevel = audioCfg["Format"]["Compress Level"];
            this.audioBase = new AuidoArchive(audioFile, compression, compressLevel);
        }
        catch (e) {
            this.logger.error((e as Error).message);
            app.quit();
        }
    }

    private GoStudyMode() {
        this.Mode = "Study Mode";
        this.win.webContents.send("gui", "modifyValue", "title", "Study Mode");
        console.log("Study Mode");

        this.win.webContents.send("gui", "modifyValue", "count", "");

        this.CurLearnPos = 0;
        let len = this.LearnLst.length;
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

        this.win.webContents.send("gui", "modifyValue", "numOfLearn", `${this.LearnLst.length} words to Learn!`);
        this.Study_Next();
    }

    private async Study_Next() {
        let len = this.CurLearnLst.length;
        if (len > 0) {
            let word = this.CurLearnLst[this.CurLearnPos];

            let lastDate = await this.usrProgress.GetLastDate(word);

            if (lastDate == null) {
                this.win.webContents.send("gui", "modifyValue", "score", "New!");
            }
            else {
                this.win.webContents.send("gui", "modifyValue", "score", "");
            }

            let data = this.WordsDict.get(word);
            if (data != undefined) {
                let familiar = data[0];
                let lastDate = data[1];
                let nextDate = data[2];
                let msg = `Familiar: ${familiar}, LastDate: ${formatDate(lastDate)}, NextDate: ${formatDate(nextDate)}`;
                console.log(`LearnWord: ${word}, ${msg}`);
                this.win.webContents.send("gui", "modifyValue", "info", msg);
            }

            this.Show_Content(word, true);
            this.Play_MP3(word);

            this.win.webContents.send("gui", "modifyValue", "numOfWords", `${this.CurLearnPos + 1} of ${len}`);

            // this.CurLearnPos += 1;
        }
    }

    private GoTestMode() {
        this.Mode = "Test Mode";
        this.win.webContents.send("gui", "modifyValue", "title", "Test Mode");
        console.log("Test Mode");

        let len = this.TestLst.length;
        if (this.CurCount <= this.TestCount && this.CurTestLst.length > 0) {
            this.CurTestPos = 0;
            this.win.webContents.send("gui", "modifyValue", "count", `Count: ${this.CurCount} of ${this.TestCount}`);
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
            this.win.webContents.send("gui", "modifyValue", "numOfTest", `${this.TestLst.length} words to Test!`);
            this.CurTestPos = 0;
            this.CurCount = 1;
            this.win.webContents.send("gui", "modifyValue", "count", `Count: ${this.CurCount} of ${this.TestCount}`);
            this.Test_Next();
        }
        else if (len > 0) {
            this.CurTestLst = this.TestLst.splice(0, len);
            this.win.webContents.send("gui", "modifyValue", "numOfTest", `${this.TestLst.length} words to Test!`);
            this.CurTestPos = 0;
            this.CurCount = 1;
            this.win.webContents.send("gui", "modifyValue", "count", `Count: ${this.CurCount} of ${this.TestCount}`);
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
    }

    private Test_Next() {
        let word = this.CurTestLst[this.CurTestPos];

        let data = this.WordsDict.get(word);
        if (data != undefined) {
            let familiar = data[0];
            let lastDate = data[1];
            let nextDate = data[2];
            let msg = `Familiar: ${familiar}, LastDate: ${formatDate(lastDate)}, NextDate: ${formatDate(nextDate)}`;
            console.log(`TestWord: ${word}, ${msg}`);
            this.win.webContents.send("gui", "modifyValue", "info", msg);
        }

        this.win.webContents.send("gui", "modifyValue", "word", "");
        this.Play_MP3(word);

        if (this.lastWord != "") {
            this.Show_Content(this.lastWord);
        }

        this.win.webContents.send("gui", "modifyValue", "numOfWords", `${this.CurTestPos + 1} of ${this.CurTestLst.length}`);

        // this.CurTestPos += 1;
    }

    private Check_Input(input_word: string) {
        if (this.Mode == "Study Mode") {
            this.lastWord = this.CurLearnLst[this.CurLearnPos];
            this.CurLearnPos++;
            if (this.CurLearnPos < this.CurLearnLst.length) {
                this.Study_Next();
            }
            else {
                this.CurCount = 1;
                console.log(`curCount: ${this.CurCount}`);
                this.CurTestLst = (this.CurLearnLst || []).concat();
                // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
                this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                this.GoTestMode();
            }
        }
        else {
            // let input_word = this.win.webContents.send("gui", "getValue", "score");
            let word = this.CurTestLst[this.CurTestPos];
            if (input_word != word) {
                this.ErrCount += 1;
                this.win.webContents.send("gui", "modifyValue", "score", `Wrong ${this.ErrCount}!`);
                console.log(`ErrCount: ${this.ErrCount}`);
                console.log(`Right word: ${word}, Wrong word: ${input_word}.`);

                let data = this.WordsDict.get(word);
                if (data === undefined) {
                    throw new Error("${word} is not in WordsDict!");
                }
                let familiar = data[0];
                let lastDate = data[1];
                let nextDate = data[2];

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
                    this.win.webContents.send("gui", "modifyValue", "numOfLearn", `${this.LearnLst.length} words to Learn!`);
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
                console.log(`curCount: ${this.CurCount}`);
                this.GoTestMode();
            }
        }
    }

    private Chop() {
        let word = "";
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

            let data = this.WordsDict.get(word);
            if (data != undefined) {
                let lastDate = this.today;
                let nextDate = data[2];
                this.WordsDict.set(word, [10, lastDate, nextDate]);
            }

            console.log(`${word} has been chopped!`);
            this.win.webContents.send("gui", "modifyValue", "numOfTest", `${this.TestLst.length} words to Test!`);

            this.lastWord = this.CurLearnLst[this.CurLearnPos - 1];

            // this.CurLearnPos++;
            if (this.CurLearnPos < this.CurLearnLst.length) {
                this.Study_Next();
            }
            else {
                this.CurCount = 1;
                console.log(`curCount: ${this.CurCount}`);
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

            let data = this.WordsDict.get(word);
            if (data != undefined) {
                let lastDate = this.today;
                let nextDate = data[2];
                this.WordsDict.set(word, [10, lastDate, nextDate]);
            }
            console.log(`${word} has been chopped!`);
            this.win.webContents.send("gui", "modifyValue", "numOfTest", `${this.TestLst.length} words to Test!`);

            this.lastWord = this.CurTestLst[this.CurTestPos - 1];

            // this.CurTestPos++;
            if (this.CurTestPos < this.CurTestLst.length) {
                this.Test_Next();
            }
            else {
                this.CurCount += 1;
                console.log(`curCount: ${this.CurCount}`);
                this.GoTestMode();
            }
        }
    }

    private Forgoten() {
        let word = "";

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

            let data = this.WordsDict.get(word);
            if (data != undefined) {
                let familiar = data[0];
                let lastDate = this.today;
                let nextDate = new Date();
                // nextDate.setDate(this.today.getDate() - Number(this.timeDayLst[0]));
                this.WordsDict.set(word, [familiar - 5, lastDate, nextDate]);
            }

            this.LearnLst.push(word);
            console.log(word + " has been added in learn list.");
            this.win.webContents.send("gui", "modifyValue", "numOfLearn", `${this.LearnLst.length} words to Learn!`);

            console.log(word + " is forgotten!");

            this.lastWord = this.CurTestLst[this.CurTestPos - 1];

            if (this.CurTestPos < this.CurTestLst.length) {
                this.Test_Next();
            }
            else {
                this.CurCount += 1;
                console.log(`curCount: ${this.CurCount}`);
                this.GoTestMode();
            }
        }
        return word;
    }

    private Clear_Content() {
        this.win.webContents.send("gui", "modifyValue", "word", "");
        this.win.webContents.send("gui", "modifyValue", "symbol", "");
        this.win.webContents.send("gui", "modifyValue", "txtArea", "");
    }

    private Play_Again() {
        /*let word = "";
        if (this.Mode == "Study Mode") {
            word = this.CurLearnLst[this.CurLearnPos];
        }
        else {
            word = this.CurTestLst[this.CurTestPos];
        }
        this.Play_MP3(word);*/
        this.win.webContents.send("gui", "playAudio");
    }

    // To-Do
    private async Play_MP3(word: string): Promise<boolean> {
        if (word == this.lastWord) {
            this.win.webContents.send("gui", "playAudio");
            return true;
        }
        else {
            let retAudio = -1;
            let audioFile = "";
            [retAudio, audioFile] = await this.audioBase.query_audio(word);
            if (retAudio <= 0) {
                this.logger.error(audioFile);
                audioFile = path.join(__dirname, "audio", "WrongHint.mp3");
                this.win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
                this.curWord = word;
                return false;
            }
            else {
                this.win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
            }
            return true;
        }
    }

    private async Show_Content(word: string, bShowWord = false) {
        if (bShowWord) {
            this.win.webContents.send("gui", "modifyValue", "word", word);
        }
        let txt = "";
        let retDict = -1;
        [retDict, txt] = await this.dictBase.query_word(word);
        let txtLst = txt.split(";;");
        if (retDict == 1) {
            let symbol = txtLst[0];
            this.win.webContents.send("gui", "modifyValue", "symbol", "[" + symbol + "]");
            let meaning = txtLst[1];

            if (txtLst[2] == null) {
                txtLst[2] = "";
            }

            let sentences = txtLst[2].replace(/\"/g, "\\\"");
            sentences = sentences.replace(/\'/g, "\\\'");
            sentences = sentences.replace(/\`/g, "\\\`");

            let txtContent = meaning + "\n" + sentences.replace(/\/r\/n/g, "\n");
            // txtContent = txtContent.replace(/<br>/g, "");
            this.win.webContents.send("gui", "modifyValue", "txtArea", txtContent);
        }
    }

    public readUsrs() {
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
        return this.usrsDict
    }

    public readAllLvls() {
        return this.cfg["DictBase"]["DictBase"]["allLvls"];
    }

    // TODO: 
    public async newLevel(usrName: string, level: string) {
        console.log(`usr: ${usrName}, new level: ${level}`);
        for (let usrCfg of this.cfg.Users) {
            if (usrName == usrCfg.Name) {
                if (this.usrProgress === undefined) {
                    this.usrProgress = new UsrProgress();
                }
                let progressFile = path.join(__dirname, usrCfg.Progress).replace(/\\/g, '/');
                await this.usrProgress.NewTable(progressFile, level);

                let lvlWordsLst: string[] = new Array();
                let ret = await this.dictBase.GetWordsLst(lvlWordsLst, level);
                if (ret) {
                    for (let word of lvlWordsLst) {
                        // console.log("Going to insert: " + word);
                        await this.usrProgress.InsertWord(word);
                    }
                }
                else {
                    return Promise.resolve<boolean>(false);
                }

                let target = usrCfg.Target;
                target[target.length] = level;
                this.bCfgModfied = true;

                return Promise.resolve<boolean>(true);
            }
        }
        return Promise.resolve<boolean>(false);
    }

    public async NewUsr(usrName: number, level: string) {
        // TODO: record it in json
        this.bCfgModfied = true;

        this.usrProgress = new UsrProgress();
        // dict/XYQ.progress
        let progressFile = path.join(__dirname, "dict", "usrName" + ".progress").replace(/\\/g, '/');
        await this.usrProgress.New(progressFile, level);

        let lvlWordsLst: string[] = new Array();
        this.dictBase.GetWordsLst(lvlWordsLst, level);
        for (let word of lvlWordsLst) {
            await this.usrProgress.InsertWord(word);
        }
    }

    public async Go(usrName: number, level: string) {
        console.log("Go!");

        /*globalShortcut.unregister('Enter');
        globalShortcut.register('Enter', () => {
        });*/
        globalShortcut.register('F5', () => {
            this.Play_Again();
        });
        globalShortcut.register('F6', () => {
            this.Forgoten();
        });
        globalShortcut.register('F7', () => {
            this.Chop();
        });

        // read user;

        for (let usrCfg of this.cfg.Users) {
            if (usrName == usrCfg.Name) {
                this.logger.info(`selectUser: ${usrName}, Level: ${level}`);
                let progress = usrCfg.Progress;
                let progressFile = path.join(__dirname, progress).replace(/\\/g, '/');
                this.logger.info("progress: ", progressFile);
                if (this.usrProgress === undefined) {
                    this.usrProgress = new UsrProgress();
                }
                // await this.usrProgress.Open(progressFile);
                await this.usrProgress.Open(progressFile, level);
                break;
            }
        }

        // let level = usrCfg.Target;

        // 
        // await this.usrProgress.UpdateProgress('cord', 5, '2020-12-31');
        // await this.usrProgress.Close();
        // console.log('Done');

        // update info;
        this.win.webContents.send("gui", "modifyValue", "studyLearnBtn", `正在学习`);

        this.win.webContents.send("gui", "modifyValue", "usr", `${usrName}`);

        this.win.webContents.send("gui", "modifyValue", "level", `${level}`);

        // where = "level = '" + level + "'";
        let allCount = await this.usrProgress.GetAllCount(level);
        this.win.webContents.send("gui", "modifyValue", "allCount", `All words: ${allCount}`);
        this.logger.info(`All words: ${allCount}`);

        // where = "level = '" + level + "' and LastDate is null ";
        let newCount = await this.usrProgress.GetNewCount(level);
        this.win.webContents.send("gui", "modifyValue", "newCount", `New words to learn: ${newCount}`);
        this.logger.info(`New words to learn: ${newCount}`);

        // where = "level = '" + level + "' and familiar = 10";
        let finishCount = await this.usrProgress.GetFnshedCount(level);
        this.win.webContents.send("gui", "modifyValue", "finishCount", `Words has recited: ${finishCount}`);
        this.logger.info(`Words has recited: ${finishCount}`);

        // where = "level = '" + level + "' and familiar > 0";
        let InProgressCount = await this.usrProgress.GetInProgressCount(level);
        this.win.webContents.send("gui", "modifyValue", "InProgressCount", `Words in learning: ${InProgressCount}`);
        this.logger.info(`Words in learning: ${InProgressCount}`);

        // read configuration
        let timeArray = this.cfg["TimeInterval"];
        for (let timeGroup of timeArray) {
            if (timeGroup["Unit"] == "d") {
                this.timeDayLst.push(timeGroup["Interval"]);
            }
        }
        let allLimit = this.cfg.General.Limit;
        let newWdsLimit = this.cfg.StudyMode.Limit;
        this.TestCount = this.cfg.TestMode.Times;
        let limit = 0;

        // start get words to recite

        let wdsLst = new Array();
        let numOfWords = 0;
        let todayStr = formatDate(this.today);

        // get over due words
        console.log("starting to get over due words");
        wdsLst.length = 0;
        limit = allLimit;

        if (await this.usrProgress.GetOvrDueWordsLst(wdsLst, todayStr)) {
            for (let wd of wdsLst) {
                this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                console.log(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                if (this.WordsDict.size >= limit) {
                    break;
                }
            }
        }
        this.logger.info(`got ${this.WordsDict.size - numOfWords} over due words.`);
        numOfWords = this.WordsDict.size;

        // get due words
        console.log("starting to get due words");
        wdsLst.length = 0;
        limit = allLimit - this.WordsDict.size;

        if (limit > 0) {
            if (await this.usrProgress.GetDueWordsLst(wdsLst, todayStr)) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                    console.log(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                    if (this.WordsDict.size >= limit) {
                        break;
                    }
                }
            }
        }
        this.logger.info(`got ${this.WordsDict.size - numOfWords} due words.`);
        numOfWords = this.WordsDict.size;

        // get new words
        console.log("starting to get new words");
        wdsLst.length = 0;
        limit = Math.min(allLimit - this.WordsDict.size, newWdsLimit);

        if (limit > 0) {
            if (await this.usrProgress.GetNewWordsLst(wdsLst, limit)) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                    console.log(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                    this.LearnLst.push(wd.Word);
                }
            }
        }
        this.logger.info(`got ${this.WordsDict.size - numOfWords} new words.`);

        // complement learn list
        this.WordsDict.forEach(([familiar, lastDate, nextDate], word) => {
            if (familiar < 0) {
                this.LearnLst.push(word);
            }
        });
        randomArray2(this.LearnLst);
        this.logger.info(`len of LearnList: ${this.LearnLst.length}.`);

        for (let word of Array.from(this.WordsDict.keys())) {
            this.TestLst.push(word);
        }

        // random test list
        this.TestLst = randomArray(this.TestLst);
        this.logger.info(`len of TestList: ${this.TestLst.length}.`);

        //this.wordInput['state'] = 'readonly';

        this.win.webContents.send("gui", "modifyValue", "numOfLearn", `${this.LearnLst.length} words to Learn!`);
        this.win.webContents.send("gui", "modifyValue", "numOfTest", `${this.TestLst.length} words to Test!`);

        if (this.LearnLst.length > 0) {
            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else {
            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
            this.GoTestMode();
        }
    }

    private async Save_Progress() {
        // remove words which hadn't be recited
        for (let word of this.TestLst) {
            if (this.WordsDict.has(word)) {
                this.WordsDict.delete(word);
            }
        }

        if (this.Mode == "Study Mode") {
            for (let word of this.CurLearnLst) {
                if (this.WordsDict.has(word)) {
                    let data = this.WordsDict.get(word);
                    if (data != undefined) {
                        let familiar = data[0] - 1;
                        let lastDate = data[1];
                        let nextDate = data[2];
                        this.WordsDict.set(word, [familiar, lastDate, nextDate]);
                    }
                }
            }
        }
        else {
            if (this.CurCount >= this.TestCount) {
                this.CurTestLst.splice(0, this.CurTestPos - 1);
            }

            for (let word of this.CurTestLst) {
                if (this.WordsDict.has(word)) {
                    this.WordsDict.delete(word);
                }
            }
        }

        for (let word of this.LearnLst) {
            if (this.WordsDict.has(word)) {
                let data = this.WordsDict.get(word);
                if (data != undefined) {
                    let familiar = data[0] - 1;
                    let lastDate = data[1];
                    let nextDate = data[2];
                    this.WordsDict.set(word, [familiar, lastDate, nextDate]);
                }
            }
        }

        let allLen = this.WordsDict.size;
        this.logger.info(`number of words' familiar will be changed: ${allLen}`);

        let lastDateStr = "", nexDateStr = "";
        let mapStr = "{";
        this.WordsDict.forEach(([familiar, lastDate, nextDate], word) => {
            if (lastDate != null) {
                lastDateStr = formatDate(lastDate);
            }
            else {
                lastDateStr = "";
            }
            if (nextDate != null) {
                nexDateStr = formatDate(nextDate);
            }
            else {
                nexDateStr = "";
            }

            mapStr += `${word}: ${String(familiar)}, lastDate: ${lastDateStr}, nextDate: ${nexDateStr};`;
        });
        mapStr += "}";
        console.log("WordsDict = " + mapStr);

        let i = 0, nFnshd = 0;
        let iterator = this.WordsDict.entries();
        let r: IteratorResult<[string, [number, Date, Date]]>;
        let todayStr = formatDate(this.today);
        let interval = 0, index = 0;
        let nextInterval = 0;
        while (r = iterator.next(), !r.done) {
            let [word, [familiar, lastDate, nextDate]] = r.value;
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
                if ((nextDate.getFullYear() == this.today.getFullYear()) && (nextDate.getMonth() == this.today.getMonth()) && (nextDate.getDate() == this.today.getDate())) {  // due
                    index = this.timeDayLst.indexOf(interval)
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
                else {   // over due
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
            nexDateStr = formatDate(nextDate);

            try {
                console.log(`${word}: ${String(familiar)}, lastDate: ${todayStr}, nextDate: ${nexDateStr}`);
                await this.usrProgress.UpdateProgress2(word, familiar, todayStr, nexDateStr);
                i++;
                let percent = i / allLen * 100;
                console.log(`${percent.toFixed(2)}% to save progress.`);
                this.win.webContents.send("gui", "modifyValue", "info", `${percent.toFixed(2)}% to save progress.`);
            }
            catch (e) {
                this.logger.error((e as Error).message);
                this.logger.error(e);
            }
        }

        this.logger.info(`finish to receite number of words: ${nFnshd}`);
        // console.log("OK to save progress.");
        this.win.webContents.send("gui", "modifyValue", "info", `OK to save progress.`);
    }

    private SaveConfigure(): Promise<string | boolean> {
        return new Promise((resolve, reject) => {
            // Indent by 4 spaces
            fs.writeFile(this.cfgFile, JSON.stringify(this.cfg, null, 4), { 'flag': 'w' }, (err: any) => {
                if (err) {
                    this.logger.error("Fail to SaveConfigure!");
                    reject("Fail to SaveConfigure!");
                } else {
                    console.log("Success to SaveConfigure");
                    resolve(true);
                }
            })
        })
    }

    public async Close() {
        if (this.dictBase) {
            this.dictBase.close();
        }
        if (this.audioBase) {
            this.audioBase.close();
        }
        if (this.usrProgress) {
            await this.usrProgress.Close();
        }

        if (this.bCfgModfied) {
            await this.SaveConfigure()
        }
    }

    public async quit() {
        await this.Save_Progress();
        this.Close();

        let now = new Date();
        let sec = now.getSeconds() - this.today.getSeconds();
        let min = now.getMinutes() - this.today.getMinutes();
        let hour = now.getHours() - this.today.getHours();

        if (sec < 0) {
            sec += 60;
            min--;
        }
        if (min < 0) {
            min += 60;
            hour--;
        }

        this.logger.info(`it cost ${hour} hours, ${min} minutes, ${sec} seconds.`);

        app.quit();
    }

    public info(ret: number, typ: number, word: string, msg: string) {
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
    }
};