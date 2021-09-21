import * as fs from "fs";
import * as path from "path";
import * as log4js from "log4js";
import { BrowserWindow, app, globalShortcut, dialog } from 'electron';

import { formatTime, formatDate, randomArray, randomArray2 } from "./utils/utils";

import { DownloardQueue } from "./utils/DownloardQueue";
import { globalVar } from "./utils/globalInterface";
import { ExecException } from "child_process";

import { WordsDict } from "./components/WordsDict";
import { AuidoArchive } from "./components/AuidoArchive";
import { UsrProgress } from "./components/UsrProgress";

import { SDictBase } from "./components/SDictBase";

export class ReciteWordsApp {
    private cfgFile: string;
    private cfg: any;
    private bDebug: boolean = false;
    private bCfgModfied: boolean = false;
    private logger: log4js.Logger;

    private usrsDict = new Map();

    private personalProgressFile = "";

    private audioBase: AuidoArchive;
    private usrProgress: UsrProgress;

    private dictBase: SDictBase;

    private win: BrowserWindow;

    private today: Date;
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

    constructor(readonly startPath: string) {
        /*
        this.root.bind("<Escape>", this.exit_app);
        this.root.bind("<Return>", this.check_input);
        */
        console.clear();
    }

    public ReadAndConfigure(): boolean {

        this.cfgFile = path.join(this.startPath, 'Dictionary.json').replace(/\\/g, '/');

        let _this = this;
        if (fs.existsSync(_this.cfgFile) == false) {
            console.log(_this.cfgFile + " doesn't exist");
            return false;
        };

        this.cfg = JSON.parse(fs.readFileSync(_this.cfgFile).toString());

        let common = JSON.parse(JSON.stringify(this.cfg.ReciteWords.common));
        console.log('ver: ' + common.ver);

        let debugCfg = JSON.parse(JSON.stringify(this.cfg.ReciteWords.Debug));

        this.bDebug = debugCfg.bEnable;

        let debugLvl = 'INFO';
        if (this.bDebug == true) {
            debugLvl = 'DEBUG';
            let logFile = path.join(this.startPath, debugCfg.file);
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
                    }
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

    public async Run(argvs: any) {
        this.CreateWindow(argvs.bDev);

        let dQueue = new DownloardQueue(this.win);
        globalVar.dQueue = dQueue;

        await this.initDict();
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

    private async initDict() {
        try {
            let dictBase = this.cfg.ReciteWords.DictBase;
            let dictBasesCfg = JSON.parse(JSON.stringify(this.cfg.DictBases));
            for (let dictBaseCfg of dictBasesCfg) {
                if (dictBase == dictBaseCfg.Name) {
                    let dictFile = path.join(this.startPath, dictBaseCfg.Dict).replace(/\\/g, '/');
                    console.log(`dict: ${dictFile}`);
                    this.dictBase = new SDictBase(dictFile);
                    break;
                }
            }

            let audioBase = this.cfg.ReciteWords.AudioBase;
            let audioBasesCfg = JSON.parse(JSON.stringify(this.cfg.AudioBases));
            for (let audioBaseCfg of audioBasesCfg) {
                if (audioBase == audioBaseCfg.Name) {
                    let audioFile = path.join(this.startPath, audioBaseCfg.Audio).replace(/\\/g, '/');
                    console.log(`audio: ${audioFile}`);
                    let compression = audioBaseCfg["Format"]["Compression"];
                    let compressLevel = audioBaseCfg["Format"]["Compress Level"];
                    this.audioBase = new AuidoArchive(audioFile, compression, compressLevel);
                    await this.audioBase.Open();
                    break;
                }
            }
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
        if (len > 0) {
            let limit = Math.min(10, len);
            this.CurLearnLst = this.LearnLst.splice(0, limit);
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
            this.curWord = this.CurLearnLst[this.CurLearnPos];

            // TODO: get 'lastDate' from 'this.WordsDict'
            let lastDate = await this.usrProgress.GetLastDate(this.curWord);

            if (lastDate == null) {
                this.win.webContents.send("gui", "modifyValue", "score", "New!");
            }
            else {
                this.win.webContents.send("gui", "modifyValue", "score", "");
            }

            let data = this.WordsDict.get(this.curWord);
            if (data != undefined) {
                let familiar = data[0];
                let lastDate = data[1];
                let nextDate = data[2];
                let msg = `Familiar: ${familiar}, LastDate: ${formatDate(lastDate)}, NextDate: ${formatDate(nextDate)}`;
                console.log(`LearnWord: ${this.curWord}, ${msg}`);
                this.win.webContents.send("gui", "modifyValue", "info", msg);
            }

            this.Show_Content(this.curWord, true);
            this.PlayAudio();

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
        else if (len > 0) {
            let limit = Math.min(10, len);
            this.CurTestLst = this.TestLst.splice(0, limit);
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
        this.curWord = this.CurTestLst[this.CurTestPos];

        let data = this.WordsDict.get(this.curWord);
        if (data != undefined) {
            let familiar = data[0];
            let lastDate = data[1];
            let nextDate = data[2];
            let msg = `Familiar: ${familiar}, LastDate: ${formatDate(lastDate)}, NextDate: ${formatDate(nextDate)}`;
            console.log(`TestWord: ${this.curWord}, ${msg}`);
            this.win.webContents.send("gui", "modifyValue", "info", msg);
        }

        this.win.webContents.send("gui", "modifyValue", "word", "");

        if (this.lastWord != "") {
            this.Show_Content(this.lastWord);
        }
        this.PlayAudio();

        this.win.webContents.send("gui", "modifyValue", "numOfWords", `${this.CurTestPos + 1} of ${this.CurTestLst.length}`);
    }

    private Check_Input(input_word: string) {
        if (this.Mode == "Study Mode") {
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
            if (input_word != this.curWord) {
                this.ErrCount += 1;
                this.win.webContents.send("gui", "modifyValue", "score", `Wrong ${this.ErrCount}!`);
                console.log(`ErrCount: ${this.ErrCount}`);
                console.log(`Right word: ${this.curWord}, Wrong word: ${input_word}.`);

                let data = this.WordsDict.get(this.curWord);
                if (data === undefined) {
                    throw new Error(`${this.curWord} is not in WordsDict!`);
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
                    this.WordsDict.set(this.curWord, [familiar - 1, lastDate, nextDate]);
                }
                else {
                    this.win.webContents.send("gui", "modifyValue", "word", "");
                    this.Show_Content(this.curWord, true);
                    this.PlayAudio();

                    this.win.webContents.send("gui", "modifyValue", "score", "Go on!");
                    this.WordsDict.set(this.curWord, [familiar - 4, lastDate, nextDate]);
                    this.LearnLst.push(this.curWord);
                    console.log(this.curWord + " has been added in learn list.");
                    this.ErrCount = 0;
                    this.win.webContents.send("gui", "modifyValue", "numOfLearn", `${this.LearnLst.length} words to Learn!`);
                    return;
                }
            }
            else {
                this.win.webContents.send("gui", "modifyValue", "score", "OK!");
                this.ErrCount = 0;
                this.lastWord = this.curWord;
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
        for (var i = 0; i < this.CurLearnLst.length; i++) {
            if (this.CurLearnLst[i] == this.curWord) {
                this.CurLearnLst.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < this.LearnLst.length; i++) {
            if (this.LearnLst[i] == this.curWord) {
                this.LearnLst.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < this.CurTestLst.length; i++) {
            if (this.CurTestLst[i] == this.curWord) {
                this.CurTestLst.splice(i, 1);
                i--;
            }
        }

        for (var i = 0; i < this.TestLst.length; i++) {
            if (this.TestLst[i] == this.curWord) {
                this.TestLst.splice(i, 1);
                i--;
            }
        }

        let data = this.WordsDict.get(this.curWord);
        if (data != undefined) {
            let lastDate = this.today;
            let nextDate = data[2];
            this.WordsDict.set(this.curWord, [10, lastDate, nextDate]);
        }
        console.log(`${this.curWord} has been chopped!`);
        this.win.webContents.send("gui", "modifyValue", "numOfTest", `${this.TestLst.length} words to Test!`);

        if (this.Mode == "Study Mode") {
            this.lastWord = this.curWord;

            if (this.CurLearnPos < this.CurLearnLst.length) {
                this.Study_Next();
            }
            else if (this.LearnLst.length > 0 && this.CurLearnLst.length == 0) {
                this.GoStudyMode();
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
            this.lastWord = this.curWord;

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
        // let word = "";

        if (this.Mode == "Test Mode") {

            this.ErrCount = 0;

            // word = this.CurTestLst[this.CurTestPos];

            for (var i = 0; i < this.CurTestLst.length; i++) {
                if (this.CurTestLst[i] == this.curWord) {
                    this.CurTestLst.splice(i, 1);
                    i--;
                }
            }

            for (var i = 0; i < this.TestLst.length; i++) {
                if (this.TestLst[i] == this.curWord) {
                    this.TestLst.splice(i, 1);
                    i--;
                }
            }

            let data = this.WordsDict.get(this.curWord);
            if (data != undefined) {
                let familiar = data[0];
                let lastDate = this.today;
                let nextDate = new Date();
                // nextDate.setDate(this.today.getDate() - Number(this.timeDayLst[0]));
                this.WordsDict.set(this.curWord, [familiar - 5, lastDate, nextDate]);
            }

            this.LearnLst.push(this.curWord);
            console.log(this.curWord + " has been added in learn list.");
            this.win.webContents.send("gui", "modifyValue", "numOfLearn", `${this.LearnLst.length} words to Learn!`);

            console.log(this.curWord + " is forgotten!");

            this.lastWord = this.curWord;

            if (this.CurTestPos < this.CurTestLst.length) {
                this.Test_Next();
            }
            else {
                this.CurCount += 1;
                console.log(`curCount: ${this.CurCount}`);
                this.GoTestMode();
            }
        }
        return this.curWord;
    }

    private Clear_Content() {
        this.win.webContents.send("gui", "modifyValue", "word", "");
        this.win.webContents.send("gui", "modifyValue", "symbol", "");
        this.win.webContents.send("gui", "modifyValue", "txtArea", "");
    }

    // To-Do
    private async PlayAudio(): Promise<boolean> {
        if (this.curWord == this.lastWord) {
            this.win.webContents.send("gui", "playAudio");
            return Promise.resolve(true);
        }
        else {
            let retAudio = -1;
            let audioFile = "";
            [retAudio, audioFile] = await this.audioBase.query_audio(this.curWord);
            if (retAudio <= 0) {
                this.logger.error(audioFile);
                audioFile = path.join(this.startPath, "audio", "WrongHint.mp3");
                console.log(audioFile);
                this.win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
                return Promise.resolve(false);
            }
            else {
                this.win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
                if (this.Mode == "Study Mode") {
                    this.lastWord = this.curWord;
                }
            }
            return Promise.resolve(true);
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
        return this.cfg["WordsDict"]["allLvls"];
    }

    public async newLevel(usrName: string, level: string) {
        console.log(`usr: ${usrName}, new level: ${level}`);
        for (let usrCfg of this.cfg.Users) {
            if (usrName == usrCfg.Name) {
                if (this.usrProgress === undefined) {
                    this.usrProgress = new UsrProgress();
                }
                let progressFile = path.join(this.startPath, usrCfg.Progress).replace(/\\/g, '/');
                await this.usrProgress.Open(progressFile, level);
                if (await this.usrProgress.ExistTable(level) == false) {
                    this.usrProgress.NewTable(level);
                }

                let wordsDictCfg = this.cfg["WordsDict"];
                let words = wordsDictCfg["Dict"];
                let wordsFile = path.join(this.startPath, words).replace(/\\/g, '/');
                console.log(`words: ${wordsFile}`);
                let wordsDict = new WordsDict();
                wordsDict.Open(wordsFile);

                let lvlWordsLst: string[] = new Array();
                let ret = await wordsDict.GetWordsLst(lvlWordsLst, level);
                wordsDict.Close();
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
        let progressFile = path.join(this.startPath, "dict", "usrName" + ".progress").replace(/\\/g, '/');
        await this.usrProgress.New(progressFile, level);

        let wordsCfg = this.cfg["WordsDict"];
        let words = wordsCfg["Dict"];
        let wordsFile = path.join(this.startPath, words).replace(/\\/g, '/');
        console.log(`words: ${wordsFile}`);
        let wordsDict = new WordsDict();
        wordsDict.Open(wordsFile);

        let lvlWordsLst: string[] = new Array();
        let ret = await wordsDict.GetWordsLst(lvlWordsLst, level);
        wordsDict.Close();
        if (ret) {
            for (let word of lvlWordsLst) {
                // console.log("Going to insert: " + word);
                await this.usrProgress.InsertWord(word);
            }
        }
        else {
            return Promise.resolve<boolean>(false);
        }
    }

    public async isLevelDone(usrName: string, level: string): Promise<boolean | string> {
        for (let usrCfg of this.cfg.Users) {
            if (usrName == usrCfg.Name) {
                let progress = usrCfg.Progress;
                let progressFile = path.join(this.startPath, progress).replace(/\\/g, '/');
                this.logger.info("progress: ", progressFile);
                if (this.usrProgress === undefined) {
                    this.usrProgress = new UsrProgress();
                }
                try {
                    await this.usrProgress.Open(progressFile, level);
                    let numOfUnrecitedWord1 = await this.usrProgress.GetInProgressCount(level);
                    let numOfUnrecitedWord2 = await this.usrProgress.GetNewCount(level);
                    if (numOfUnrecitedWord1 + numOfUnrecitedWord2 == 0) {
                        let ret = await dialog.showMessageBox({
                            type: "info",
                            message: `${usrName}'s ${level} is done! Do you want to reset?`,
                            buttons: ["Yes", "No"]
                        });

                        if (ret.response == 0) {
                            ret = await dialog.showMessageBox({
                                type: "info",
                                message: `Reset function is not implemented!`,
                                buttons: ["Confirm"]
                            });
                            return Promise.resolve(true);
                        }
                        else {
                            return Promise.resolve(true);
                        }
                    }
                    else {
                        return Promise.resolve(false);
                    }
                }
                catch (e) {
                    this.logger.error(e);
                    return Promise.reject(e);
                }
                break;
            }
        }
        return Promise.reject("Usr doesn't exist!");
    }

    public async Go(usrName: string, level: string) {
        console.log("Go!");

        /*globalShortcut.unregister('Enter');
        globalShortcut.register('Enter', () => {
        });*/
        globalShortcut.register('F5', () => {
            this.PlayAudio();
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
                let progress = usrCfg.Progress;
                let progressFile = path.join(this.startPath, progress).replace(/\\/g, '/');
                this.logger.info("progress: ", progressFile);
                if (this.usrProgress === undefined) {
                    this.usrProgress = new UsrProgress();
                }
                // await this.usrProgress.Open(progressFile);
                await this.usrProgress.Open(progressFile, level);
                break;
            }
        }

        this.today = new Date();
        this.personalProgressFile = path.join(this.startPath, 'log', `${usrName}_${level}.log`);
        this.LogProgress(`Select User: ${usrName}, Level: ${level}`);

        // update info;
        this.win.webContents.send("gui", "modifyValue", "studyLearnBtn", `正在学习`);

        this.win.webContents.send("gui", "modifyValue", "usr", `${usrName}`);

        this.win.webContents.send("gui", "modifyValue", "level", `${level}`);

        // where = "level = '" + level + "'";
        let allCount = await this.usrProgress.GetAllCount(level);
        this.win.webContents.send("gui", "modifyValue", "allCount", `All words: ${allCount}`);
        this.LogProgress(`All words: ${allCount}`);

        // where = "level = '" + level + "' and LastDate is null ";
        let newCount = await this.usrProgress.GetNewCount(level);
        this.win.webContents.send("gui", "modifyValue", "newCount", `New words to learn: ${newCount}`);
        this.LogProgress(`New words to learn: ${newCount}`);

        // where = "level = '" + level + "' and familiar = 10";
        let finishCount = await this.usrProgress.GetFnshedCount(level);
        this.win.webContents.send("gui", "modifyValue", "finishCount", `Words has recited: ${finishCount}`);
        this.LogProgress(`Words has recited: ${finishCount}`);

        // where = "level = '" + level + "' and familiar > 0";
        let InProgressCount = await this.usrProgress.GetInProgressCount(level);
        this.win.webContents.send("gui", "modifyValue", "InProgressCount", `Words in learning: ${InProgressCount}`);
        this.LogProgress(`Words in learning: ${InProgressCount}`);


        // ready to get words to recite
        let allLimit = this.cfg.ReciteWords.General.TotalLimit;
        let newWdsLimit = this.cfg.ReciteWords.General.NewLimit;
        let limit = 0;

        // start get words to recite
        let wdsLst = new Array();
        let todayStr = formatDate(this.today);

        // Start to get forgotten words
        console.log("Start to get forgotten words");
        wdsLst.length = 0;
        limit = allLimit - this.WordsDict.size;
        let forgottenWdNum = 0;

        if (limit > 0) {
            if (await this.usrProgress.GetForgottenWordsLst(wdsLst)) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                    console.log(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                    this.LearnLst.push(wd.Word);
                    forgottenWdNum++;
                    if (forgottenWdNum >= limit) {
                        break;
                    }
                }
            }
        }
        this.LogProgress(`Got ${forgottenWdNum} forgotten words.`);

        // Start to get over due words
        console.log("Start to get over due words");
        wdsLst.length = 0;
        limit = allLimit - this.WordsDict.size;
        let OvrDueWdNum = 0;

        if (limit > 0) {
            if (await this.usrProgress.GetOvrDueWordsLst(wdsLst, todayStr)) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                    console.log(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                    OvrDueWdNum++;
                    if (OvrDueWdNum >= limit) {
                        break;
                    }
                }
            }
        }
        this.LogProgress(`Got ${OvrDueWdNum} over due words.`);

        // Start to get due words
        console.log("Start to get due words");
        wdsLst.length = 0;
        limit = allLimit - this.WordsDict.size;
        let dueWdNum = 0;

        if (limit > 0) {
            if (await this.usrProgress.GetDueWordsLst(wdsLst, todayStr)) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                    console.log(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                    dueWdNum++;
                    if (dueWdNum >= limit) {
                        break;
                    }
                }
            }
        }
        this.LogProgress(`Got ${dueWdNum} due words.`);

        // Start to get new words
        console.log("Start to get new words");
        wdsLst.length = 0;
        limit = Math.min(newWdsLimit - forgottenWdNum, allLimit - this.WordsDict.size);
        let newWdNum = 0;

        if (limit > 0) {
            if (await this.usrProgress.GetNewWordsLst(wdsLst, limit)) {
                for (let wd of wdsLst) {
                    this.WordsDict.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                    console.log(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                    this.LearnLst.push(wd.Word);
                    newWdNum++;
                }
            }
        }
        this.LogProgress(`Got ${newWdNum} new words.`);


        // ready to recite
        let timeArray = this.cfg["ReciteWords"]["TimeInterval"];
        for (let timeGroup of timeArray) {
            if (timeGroup["Unit"] == "d") {
                this.timeDayLst.push(timeGroup["Interval"]);
            }
        }
        this.TestCount = this.cfg.ReciteWords.TestMode.Times;

        // random learn list
        randomArray2(this.LearnLst);
        this.LogProgress(`Length of LearnList: ${this.LearnLst.length}.`);

        // complement test list
        for (let word of Array.from(this.WordsDict.keys())) {
            this.TestLst.push(word);
        }
        // random test list
        this.TestLst = randomArray(this.TestLst);
        this.LogProgress(`Length of TestList: ${this.TestLst.length}.`);

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

    private async LogProgress(info: string): Promise<boolean> {
        // 2021-08-25 19:59:01 it cost 0 hours, 50 minutes, 18 seconds.
        let now = new Date();
        let nowStr = formatTime(now);
        let something = `${nowStr} ${info}\n`;
        console.log(something);

        return new Promise((resolve, reject) => {
            fs.writeFile(this.personalProgressFile, something, { 'flag': 'a' }, (err: any) => {
                if (err) {
                    this.logger.error(`Fail to log ${something} in ${this.personalProgressFile}! Because of ${err}`);
                    resolve(false);
                } else {
                    console.log(`Success to log ${something} in ${this.personalProgressFile}!`);
                    resolve(true);
                }
            })
        });
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
        this.LogProgress(`Number of words' familiar will be changed: ${allLen}`);

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
                        if (index >= this.timeDayLst.length) {	// next round
                            index = 0;
                        }
                    }
                    else {	// error
                        index = 0;
                    }
                }
                else {   // over due
                    index = 0;
                }
            }
            else {	// new word
                index = 0;
            }

            if (familiar < 0) {	// forgotten word
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

        this.LogProgress(`Finish to receite number of words: ${nFnshd}`);
        // console.log("OK to save progress.");
        this.win.webContents.send("gui", "modifyValue", "info", `OK to save progress.`);
    }

    private SaveConfigure(): Promise<string> {
        return new Promise((resolve, reject) => {
            // Indent by 4 spaces
            fs.writeFile(this.cfgFile, JSON.stringify(this.cfg, null, 4), { 'flag': 'w' }, (err: any) => {
                if (err) {
                    reject("Fail to SaveConfigure!");
                } else {
                    resolve("Success to SaveConfigure");
                }
            })
        })
    }

    public async Close() {
        if (this.dictBase) {
            let [ret, msg] = await this.dictBase.Close();
            let name = this.dictBase.GetName();
            if (ret) {
                this.logger.info(`Ok to close ${name}${msg}`);
            } else {
                this.logger.error(`Fail to close ${name}, because of ${msg}`);
            }
        }
        if (this.audioBase) {
            let [ret, msg] = this.audioBase.Close();
            let name = this.audioBase.GetName();
            if (ret) {
                this.logger.info(`Ok to close ${name}${msg}`);
            } else {
                this.logger.error(`Fail to close ${name}, because of ${msg}`);
            }
        }
        if (this.usrProgress) {
            let [ret, msg] = await this.usrProgress.Close();
            let name = this.usrProgress.GetName();
            if (ret) {
                this.logger.info(`Ok to close ${name}${msg}`);
            } else {
                this.logger.error(`Fail to close ${name}, because of ${msg}`);
            }
        }

        if (this.bCfgModfied) {
            try {
                let ret = await this.SaveConfigure()
                this.logger.info(ret);
            }
            catch (e) {
                this.logger.error(e);
            }
        }
    }

    public async quit(bStrted: boolean = true) {
        if (bStrted == true) {

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

            await this.Save_Progress();
            await this.LogProgress(`It cost ${hour} hours, ${min} minutes, ${sec} seconds.\n`);
        }

        await this.Close();
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