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

    private Mode = "Study Mode";

    private WordsDict = new Map<string, [number, Date]>();

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
                console.log(`LearnWord: ${word}, familiar: ${familiar}, lastDate: ${lastDate}`);
                this.win.webContents.send("gui", "modifyValue", "info", `Familiar: ${familiar}, LastDate: ${lastDate}`);
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
            console.log(`LearnWord: ${word}, familiar: ${familiar}, lastDate: ${lastDate}`);
            this.win.webContents.send("gui", "modifyValue", "info", `Familiar: ${familiar}, LastDate: ${lastDate}`);
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

                if (this.ErrCount == 1) {
                    // this.CurTestPos -= 1;
                    // this.WordsDict.set(word, familiar - 1);
                }
                else if (this.ErrCount < 3) {
                    // this.CurTestPos -= 1;
                    this.WordsDict.set(word, [familiar - 1, lastDate]);
                }
                else {
                    this.Play_MP3(word);
                    this.win.webContents.send("gui", "modifyValue", "word", "");
                    this.Show_Content(word, true);

                    this.win.webContents.send("gui", "modifyValue", "score", "Go on!");
                    this.WordsDict.set(word, [familiar - 4, lastDate]);
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
                // let familiar = data[0];
                let lastDate = data[1];
                this.WordsDict.set(word, [10, lastDate]);
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
                // let familiar = data[0];
                let lastDate = data[1];
                this.WordsDict.set(word, [10, lastDate]);
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
                let lastDate = data[1];
                this.WordsDict.set(word, [familiar - 5, lastDate]);
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
                return;
            }

            let txtContent = meaning + "\n" + txtLst[2].replace(/\/r\/n/g, "\n");
            // txtContent = txtContent.replace(/<br>/g, "");
            this.win.webContents.send("gui", "modifyValue", "txtArea", txtContent);
        }
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

        let allLimit = this.cfg.General.Limit;
        let newWdsLimit = this.cfg.StudyMode.Limit;
        this.TestCount = this.cfg.TestMode.Times;

        // let wdsLst: string[] = new Array();
        let wdsLst = new Array();
        let numOfWords = 0;

        // get forgotten words
        console.log("starting to get forgotten words");
        let yesterday = new Date();
        yesterday.setDate(this.today.getDate() - 1);
        let yesterdayStr = formatDate(yesterday);
        wdsLst.length = 0;
        // "select word from Words where level = 'level' and lastdate <= date('yesterdayStr') and familiar < 0.5 limit allLimit"
        // if (await this.usrProgress.GetWordsLst([wdsLst, level, yesterdayStr, 0.5, allLimit])) {
        // if (await this.usrProgress.GetWordsLst([wdsLst, level, yesterdayStr, 0.5, allLimit])) {
        if (await this.usrProgress.GetWordsLst([wdsLst, yesterdayStr, 0.5, allLimit])) {
            for (let wd of wdsLst) {
                this.WordsDict.set(wd.Word, [Number(wd.Familiar), wd.LastDate]);
                console.log(`word: ${wd.Word}, familiar: ${wd.Familiar}, date: ${wd.LastDate}`);
            }
        }
        this.logger.info(`got ${this.WordsDict.size - numOfWords} forgotten words.`);
        numOfWords = this.WordsDict.size;

        // get old words;
        let timeDayLst: string[] = new Array;
        let timeArray = this.cfg["TimeInterval"];
        for (let timeGroup of timeArray) {
            if (timeGroup["Unit"] == "d") {
                timeDayLst.push(timeGroup["Interval"]);
            }
        }

        // timeDayLst = timeDayLst.reverse();
        console.log("timeDayLst = " + timeDayLst);

        let curTotalLimit = allLimit - this.WordsDict.size;

        let lastlastDateStr = "";

        // get ancient words
        console.log("starting to get ancient words");
        let lastlastDate = new Date();
        if (curTotalLimit > 0) {
            lastlastDate.setDate(this.today.getDate() - Number(timeDayLst[timeDayLst.length - 1]));
            lastlastDateStr = formatDate(lastlastDate);
            wdsLst.length = 0;
            // "select word from Words where level = 'level' and lastdate <= date('lastlastDateStr') and familiar < 10 limit curTotalLimit"
            // if (await this.usrProgress.GetWordsLst([wdsLst, level, lastlastDateStr, 10, curTotalLimit])) {
            // if (await this.usrProgress.GetWordsLst([wdsLst, level, lastlastDateStr, 10, curTotalLimit])) {
            if (await this.usrProgress.GetWordsLst([wdsLst, lastlastDateStr, 10, curTotalLimit])) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [Number(wd.Familiar), wd.LastDate]);
                    console.log(`word: ${wd.Word}, familiar: ${wd.Familiar}, date: ${wd.LastDate}`);
                }
            }
        }
        this.logger.info(`got ${this.WordsDict.size - numOfWords} ancient words.`);
        numOfWords = this.WordsDict.size;

        // get Ebbinghaus Forgetting Curve words
        console.log("starting to get Ebbinghaus Forgetting Curve words");
        for (let i = timeDayLst.length - 1; i >= 0; i--) {
            let curLimit = allLimit - this.WordsDict.size;
            if (curLimit > 0) {
                lastlastDate = new Date();
                lastlastDate.setDate(this.today.getDate() - Number(timeDayLst[i]));
                lastlastDateStr = formatDate(lastlastDate);
                let num = this.WordsDict.size;
                let bMore = true;
                while (bMore && curLimit > 0) {
                    wdsLst.length = 0;
                    // "select word from Words where level = 'level' and lastdate <= date('lastlastDateStr') and lastdate >= date('lastlastDateStr') and familiar < 10 limit curLimit"
                    // if (await this.usrProgress.GetWordsLst([wdsLst, level, lastlastDateStr, lastlastDateStr, 10, curLimit])) {
                    // if (await this.usrProgress.GetWordsLst([wdsLst, level, lastlastDateStr, lastlastDateStr, 10, curLimit])) {
                    if (await this.usrProgress.GetWordsLst([wdsLst, lastlastDateStr, lastlastDateStr, 10, allLimit])) {
                        for (let wd of wdsLst) {
                            this.WordsDict.set(wd.Word, [Number(wd.Familiar), wd.LastDate]);
                            console.log(`word: ${wd.Word}, familiar: ${wd.Familiar}, date: ${wd.LastDate}`);
                            if (this.WordsDict.size >= allLimit) {
                                break;
                            }
                        }
                        bMore = (wdsLst.length == curLimit);
                    }
                    else {
                        bMore = false;
                    }
                    curLimit = allLimit - this.WordsDict.size;
                }
                let dif = this.WordsDict.size - num;
                if (dif > 0) {
                    this.logger.info(`got ${dif} on ${timeDayLst[i]} day Ebbinghaus Forgetting Curve words.`);
                }

                if (curLimit <= 0) {
                    break;
                }
            }
        }
        this.logger.info(`got ${this.WordsDict.size - numOfWords} Ebbinghaus Forgetting Curve words.`);
        numOfWords = this.WordsDict.size;

        // get new words list (familiar = 0 and lastDate is null);
        console.log("starting to get new words.");
        curTotalLimit = Math.min(allLimit - this.WordsDict.size, newWdsLimit);
        let totalLimit = curTotalLimit + this.WordsDict.size;
        wdsLst.length = 0;
        if (curTotalLimit > 0) {
            // "select word from Words where level = 'level' and familiar = 0"
            // if (await this.usrProgress.GetWordsLst([wdsLst, level, 0])) {
            // if (await this.usrProgress.GetWordsLst([wdsLst, level, 0])) {
            if (await this.usrProgress.GetWordsLst([wdsLst, 0])) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [0, wd.LastDate]);
                    console.log(`word: ${wd.Word}, familiar: ${wd.Familiar}, date: ${wd.LastDate}`);
                    if (this.WordsDict.size >= totalLimit) {
                        break;
                    }
                }
            }
        }
        this.logger.info(`got ${this.WordsDict.size - numOfWords} new words.`);
        numOfWords = this.WordsDict.size;

        // this.logger.info("WordsDict = " + String(this.WordsDict));
        this.logger.info(`len of WordsDict: ${this.WordsDict.size}.`);

        this.WordsDict.forEach(([familiar, lastDate], word) => {
            if (familiar <= 0) {
                this.LearnLst.push(word);
            }
        });
        randomArray2(this.LearnLst);

        // this.logger.info("LearnLst = " + this.LearnLst);
        this.logger.info(`len of LearnList: ${this.LearnLst.length}.`);

        for (let word of Array.from(this.WordsDict.keys())) {
            this.TestLst.push(word);
        }
        // this.logger.info("TestLst = " + this.TestLst);
        // this.logger.info(`len of TestLst: ${this.TestLst.length}.`);

        // this.TestLst = [...new Set(this.TestLst)];	// remove duplicate item

        // random test list
        this.TestLst = randomArray(this.TestLst);

        //this.wordInput['state'] = 'readonly';

        this.win.webContents.send("gui", "modifyValue", "numOfLearn", `${this.LearnLst.length} words to Learn!`);
        this.win.webContents.send("gui", "modifyValue", "numOfTest", `${this.TestLst.length} words to Test!`);

        if (this.LearnLst.length > 0) {
            // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", true);
            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else {
            // this.win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
            this.win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
            this.GoTestMode();
        }
    }

    private async Save_Progress() {
        console.info(`len of this.WordsDict: ${this.WordsDict.size}`);

        for (let word of this.TestLst) {
            if (this.WordsDict.has(word)) {
                this.WordsDict.delete(word);
            }
        }

        if (this.Mode == "Study Mode") {
            for (let word of this.CurLearnLst) {
                if (this.WordsDict.has(word)) {
                    // this.WordsDict.delete(word);
                    let data = this.WordsDict.get(word);
                    if (data != undefined) {
                        let familiar = data[0] - 1;
                        let lastDate = data[1];
                        this.WordsDict.set(word, [familiar, lastDate]);
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
                // this.WordsDict.delete(word);
                let data = this.WordsDict.get(word);
                if (data != undefined) {
                    let familiar = data[0] - 1;
                    let lastDate = data[1];
                    this.WordsDict.set(word, [familiar, lastDate]);
                }
            }
        }

        let allLen = this.WordsDict.size;
        this.logger.info(`number of words' familiar will be changed: ${allLen}`);
        let mapStr = "{";
        this.WordsDict.forEach(([familiar, lastDate], word) => {
            mapStr += `${word}: ${String(familiar)}, `;
        });
        mapStr += "}";
        console.log("WordsDict = " + mapStr);

        let todayStr = formatDate(this.today);

        /*let _this = this;
        this.WordsDict.forEach(async function (familiar: number, word: string) {
            familiar += 1.0;
        
            if (familiar > 10) {
                familiar = 10.0;
            }
            else if (familiar < -10) {
                familiar = -10.0;
            }
        
            familiar = Number(familiar.toFixed(1));
            try {
                console.info(`update ${word} familiar: ${familiar}.`)
                await _this.usrProgress.UpdateProgress(word, familiar, todayStr);
            }
            catch (e) {
                _this.logger.error((e as Error).message);
                _this.logger.error(e);
            }
        });*/

        let i = 0, nfnshd = 0;
        let iterator = this.WordsDict.entries();
        let r: IteratorResult<[string, [number, Date]]>;
        while (r = iterator.next(), !r.done) {
            let [word, [familiar, lastDate]] = r.value;
            familiar += 1.0;

            if (familiar > 10) {
                familiar = 10.0;
            }
            else if (familiar < -10) {
                familiar = -10.0;
            }

            familiar = Number(familiar.toFixed(1));

            if (familiar >= 10) {
                nfnshd++;
            }

            try {
                await this.usrProgress.UpdateProgress(word, familiar, todayStr);
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

        this.logger.info(`finish to receite number of words: ${nfnshd}`);
        // console.log("OK to save progress.");
        this.win.webContents.send("gui", "modifyValue", "info", `OK to save progress.`);
    }

    private SaveConfigure(): Promise<string | boolean> {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.cfgFile, JSON.stringify(this.cfg), { 'flag': 'w' }, (err: any) => {
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