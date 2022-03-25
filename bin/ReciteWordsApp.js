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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReciteWordsApp = void 0;
// ReciteWordsApp.ts
const path = __importStar(require("path"));
const electron_1 = require("electron");
const utils_1 = require("./utils/utils");
const ElectronApp_1 = require("./ElectronApp");
const UsrProgress_1 = require("./components/UsrProgress");
class ReciteWordsApp extends ElectronApp_1.ElectronApp {
    constructor(startPath) {
        /*
        this._root.bind("<Escape>", this._exit_app);
        this._root.bind("<Return>", this._check_input);
        */
        super(startPath);
        this.startPath = startPath;
        this._usrsDict = new Map();
        this._personalProgressFile = "";
        this._timeDayLst = new Array();
        this._mode = "Study Mode";
        this._wordsMap = new Map();
        this._learnLst = new Array();
        this._curLearnLst = new Array();
        this._curLearnPos = 0;
        this._testLst = new Array();
        this._curTestLst = new Array();
        this._curTestPos = 0;
        this._testCount = 0;
        this._errCount = 0;
        this._curCount = 1;
        this._lastWord = "";
    }
    async ReadAndConfigure() {
        await super.ReadAndConfigure();
        // read all users
        for (let usrCfg of this._cfg.Users) {
            let name = usrCfg.Name;
            let levels = usrCfg.Target;
            this._usrsDict.set(name, levels);
            console.log(`User: ${name}, Levels: ${levels}`);
        }
        return true;
    }
    async Run(argvs) {
        await super.Run(argvs);
    }
    GoStudyMode() {
        this._mode = "Study Mode";
        this._win.webContents.send("gui", "modifyValue", "title", "Study Mode");
        console.log("Study Mode");
        this._win.webContents.send("gui", "modifyValue", "count", "");
        this._curLearnPos = 0;
        let len = this._learnLst.length;
        if (len > 0) {
            let limit = Math.min(10, len);
            this._curLearnLst = this._learnLst.splice(0, limit);
        }
        else {
            this._curLearnLst.length = 0;
            // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
            this.GoTestMode();
        }
        this._win.webContents.send("gui", "modifyValue", "numOfLearn", `${this._learnLst.length} words to Learn!`);
        this.Study_Next();
    }
    async Study_Next() {
        let len = this._curLearnLst.length;
        if (len > 0) {
            this._curWord = this._curLearnLst[this._curLearnPos];
            this._win.webContents.send("gui", "modifyValue", "score", "");
            let value = this._wordsMap.get(this._curWord);
            if (value) {
                let familiar = value[0];
                let lastDate = value[1];
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
            let data = this._wordsMap.get(this._curWord);
            if (data != undefined) {
                let familiar = data[0];
                let lastDate = data[1];
                let nextDate = data[2];
                let msg = `Familiar: ${familiar}, LastDate: ${(0, utils_1.formatDate)(lastDate)}, NextDate: ${(0, utils_1.formatDate)(nextDate)}`;
                console.log(`LearnWord: ${this._curWord}, ${msg}`);
                this._win.webContents.send("gui", "modifyValue", "info", msg);
            }
            this.Show_Content(this._curWord, true);
            this.PlayAudio();
            this._win.webContents.send("gui", "modifyValue", "numOfWords", `${this._curLearnPos + 1} of ${len}`);
            // this._curLearnPos += 1;
        }
    }
    GoTestMode() {
        this._mode = "Test Mode";
        this._win.webContents.send("gui", "modifyValue", "title", "Test Mode");
        console.log("Test Mode");
        let len = this._testLst.length;
        if (this._curCount <= this._testCount && this._curTestLst.length > 0) {
            this._curTestPos = 0;
            this._win.webContents.send("gui", "modifyValue", "count", `Count: ${this._curCount} of ${this._testCount}`);
            // this.Clear_Content();
            this.Test_Next();
        }
        else if (this._curLearnLst.length > 0) {
            // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", true);
            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else if (len > 0) {
            let limit = Math.min(10, len);
            this._curTestLst = this._testLst.splice(0, limit);
            this._win.webContents.send("gui", "modifyValue", "numOfTest", `${this._testLst.length} words to Test!`);
            this._curTestPos = 0;
            this._curCount = 1;
            this._win.webContents.send("gui", "modifyValue", "count", `Count: ${this._curCount} of ${this._testCount}`);
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
    }
    Test_Next() {
        this._curWord = this._curTestLst[this._curTestPos];
        let data = this._wordsMap.get(this._curWord);
        if (data != undefined) {
            let familiar = data[0];
            let lastDate = data[1];
            let nextDate = data[2];
            let msg = `Familiar: ${familiar}, LastDate: ${(0, utils_1.formatDate)(lastDate)}, NextDate: ${(0, utils_1.formatDate)(nextDate)}`;
            console.log(`TestWord: ${this._curWord}, ${msg}`);
            this._win.webContents.send("gui", "modifyValue", "info", msg);
        }
        this._win.webContents.send("gui", "modifyValue", "word", "");
        if (this._lastWord != "") {
            this.Show_Content(this._lastWord);
        }
        this.PlayAudio();
        this._win.webContents.send("gui", "modifyValue", "numOfWords", `${this._curTestPos + 1} of ${this._curTestLst.length}`);
    }
    Check_Input(input_word) {
        if (this._mode == "Study Mode") {
            this._curLearnPos++;
            if (this._curLearnPos < this._curLearnLst.length) {
                this.Study_Next();
            }
            else {
                this._curCount = 1;
                console.log(`curCount: ${this._curCount}`);
                this._curTestLst = (this._curLearnLst || []).concat();
                // this._win.webContents.send("gui", "modifyAttr", "forgetBtn", "disabled", false);
                this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
                this.GoTestMode();
            }
        }
        else {
            if (input_word != this._curWord) {
                this._errCount += 1;
                this._win.webContents.send("gui", "modifyValue", "score", `Wrong word: ${input_word}, wrong count: ${this._errCount}!`);
                this._logger.debug(`ErrCount: ${this._errCount}`);
                this._logger.debug(`Right word: ${this._curWord}, Wrong word: ${input_word}.`);
                let data = this._wordsMap.get(this._curWord);
                if (data === undefined) {
                    throw new Error(`${this._curWord} is not in WordsDict!`);
                }
                let familiar = data[0];
                let lastDate = data[1];
                let nextDate = data[2];
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
                    this._win.webContents.send("gui", "modifyValue", "numOfLearn", `${this._learnLst.length} words to Learn!`);
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
                console.log(`curCount: ${this._curCount}`);
                this.GoTestMode();
            }
        }
    }
    Chop() {
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
        let data = this._wordsMap.get(this._curWord);
        if (data != undefined) {
            let lastDate = this._today;
            let nextDate = data[2];
            this._wordsMap.set(this._curWord, [10, lastDate, nextDate]);
        }
        console.log(`${this._curWord} has been chopped!`);
        this._win.webContents.send("gui", "modifyValue", "numOfTest", `${this._testLst.length} words to Test!`);
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
                console.log(`curCount: ${this._curCount}`);
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
                console.log(`curCount: ${this._curCount}`);
                this.GoTestMode();
            }
        }
    }
    Forgoten() {
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
            let data = this._wordsMap.get(this._curWord);
            if (data != undefined) {
                let familiar = data[0];
                let lastDate = this._today;
                let nextDate = new Date();
                // nextDate.setDate(this._today.getDate() - Number(this._timeDayLst[0]));
                this._wordsMap.set(this._curWord, [familiar - 5, lastDate, nextDate]);
            }
            this._learnLst.push(this._curWord);
            console.log(this._curWord + " has been added in learn list.");
            this._win.webContents.send("gui", "modifyValue", "numOfLearn", `${this._learnLst.length} words to Learn!`);
            console.log(this._curWord + " is forgotten!");
            this._lastWord = this._curWord;
            if (this._curTestPos < this._curTestLst.length) {
                this.Test_Next();
            }
            else {
                this._curCount += 1;
                console.log(`curCount: ${this._curCount}`);
                this.GoTestMode();
            }
        }
        return this._curWord;
    }
    Clear_Content() {
        this._win.webContents.send("gui", "modifyValue", "word", "");
        this._win.webContents.send("gui", "modifyValue", "symbol", "");
        this._win.webContents.send("gui", "modifyValue", "txtArea", "");
    }
    // To-Do
    async PlayAudio() {
        if (this._curWord == this._lastWord) {
            this._win.webContents.send("gui", "playAudio");
        }
        else {
            let retAudio = -1;
            let audioFile = "";
            [retAudio, audioFile] = await this._audioBase.query_audio(this._curWord);
            if (retAudio < 0) {
                this._logger.error(audioFile);
                this._win.webContents.send("gui", "loadAndPlayAudio", this._wrongHintFile.replace(/\\/g, '/'));
                return Promise.resolve(false);
            }
            else if (retAudio == 0) {
                if (this._audioBase.download) {
                    await this.TriggerDownload(this._audioBase, this._curWord, audioFile);
                }
                else {
                    this._logger.error(`There is no audio of ${this._curWord} in ${this._audioBase.srcFile}`);
                }
                return Promise.resolve(false);
            }
            else {
                this._win.webContents.send("gui", "loadAndPlayAudio", audioFile.replace(/\\/g, '/'));
                if (this._mode == "Study Mode") {
                    this._lastWord = this._curWord;
                }
            }
        }
        return Promise.resolve(true);
    }
    async Show_Content(word, bShowWord = false) {
        if (bShowWord) {
            this._win.webContents.send("gui", "modifyValue", "word", word);
        }
        let [retDict, dict] = await this._curDictBase.query_word(word);
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
            let txtLst = dict.split(";;");
            if (retDict == 1) {
                let symbol = txtLst[0];
                this._win.webContents.send("gui", "modifyValue", "symbol", "[" + symbol + "]");
                let meaning = txtLst[1];
                if (txtLst[2] == null) {
                    txtLst[2] = "";
                }
                let sentences = txtLst[2].replace(/\"/g, "\\\"");
                sentences = sentences.replace(/\'/g, "\\\'");
                sentences = sentences.replace(/\`/g, "\\\`");
                let txtContent = meaning + "\n" + sentences.replace(/\/r\/n/g, "\n");
                // txtContent = txtContent.replace(/<br>/g, "");
                this._win.webContents.send("gui", "modifyValue", "txtArea", txtContent);
            }
        }
    }
    readUsrs() {
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
    }
    readAllLvls() {
        return this._cfg["WordsDict"]["allLvls"];
    }
    async newLevel(usrName, level) {
        console.log(`usr: ${usrName}, new level: ${level}`);
        for (let usrCfg of this._cfg.Users) {
            if (usrName == usrCfg.Name) {
                if (this._usrProgress === undefined) {
                    this._usrProgress = new UsrProgress_1.UsrProgress();
                }
                let progressFile = path.join(this._startPath, usrCfg.Progress).replace(/\\/g, '/');
                await this._usrProgress.Open(progressFile, level);
                if (await this._usrProgress.ExistTable(level) == false) {
                    this._usrProgress.NewTable(level);
                }
                let lvlWordsLst = new Array();
                let ret = await this._wordsDict.GetWordsLst(lvlWordsLst, level);
                if (ret) {
                    for (let word of lvlWordsLst) {
                        // console.log("Going to insert: " + word);
                        await this._usrProgress.InsertWord(word);
                    }
                }
                else {
                    return Promise.resolve(false);
                }
                let target = usrCfg.Target;
                target[target.length] = level;
                this._bCfgModfied = true;
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }
    // TODO: record it in json
    async NewUsr(usrName, level) {
        this._bCfgModfied = true;
        this._usrProgress = new UsrProgress_1.UsrProgress();
        // dict/XYQ.progress
        let progressFile = path.join(this._startPath, "dict", "usrName" + ".progress").replace(/\\/g, '/');
        await this._usrProgress.New(progressFile, level);
        let lvlWordsLst = new Array();
        let ret = await this._wordsDict.GetWordsLst(lvlWordsLst, level);
        if (ret) {
            for (let word of lvlWordsLst) {
                // console.log("Going to insert: " + word);
                await this._usrProgress.InsertWord(word);
            }
        }
        else {
            return Promise.resolve(false);
        }
    }
    async isLevelDone(usrName, level) {
        for (let usrCfg of this._cfg.Users) {
            if (usrName == usrCfg.Name) {
                let progress = usrCfg.Progress;
                let progressFile = path.join(this._startPath, progress).replace(/\\/g, '/');
                this._logger.info("progress: ", progressFile);
                if (this._usrProgress === undefined) {
                    this._usrProgress = new UsrProgress_1.UsrProgress();
                }
                try {
                    await this._usrProgress.Open(progressFile, level);
                    let numOfUnrecitedWord1 = await this._usrProgress.GetInProgressCount(level);
                    let numOfUnrecitedWord2 = await this._usrProgress.GetNewCount(level);
                    if (numOfUnrecitedWord1 + numOfUnrecitedWord2 == 0) {
                        let ret = await electron_1.dialog.showMessageBox({
                            type: "info",
                            message: `${usrName}'s ${level} is done! Do you want to reset?`,
                            buttons: ["Yes", "No"]
                        });
                        if (ret.response == 0) {
                            ret = await electron_1.dialog.showMessageBox({
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
                    this._logger.error(e);
                    return Promise.reject(e);
                }
                break;
            }
        }
        return Promise.reject("Usr doesn't exist!");
    }
    async Go(usrName, level) {
        console.log("Go!");
        /*globalShortcut.unregister('Enter');
        globalShortcut.register('Enter', () => {
        });*/
        electron_1.globalShortcut.register('F5', () => {
            this.PlayAudio();
        });
        electron_1.globalShortcut.register('F6', () => {
            this.Forgoten();
        });
        electron_1.globalShortcut.register('F7', () => {
            this.Chop();
        });
        // read user;
        for (let usrCfg of this._cfg.Users) {
            if (usrName == usrCfg.Name) {
                let progress = usrCfg.Progress;
                let progressFile = path.join(this._startPath, progress).replace(/\\/g, '/');
                this._logger.info("progress: ", progressFile);
                if (this._usrProgress === undefined) {
                    this._usrProgress = new UsrProgress_1.UsrProgress();
                }
                // await this._usrProgress.Open(progressFile);
                await this._usrProgress.Open(progressFile, level);
                break;
            }
        }
        this._today = new Date();
        this._personalProgressFile = path.join(this._startPath, 'log', `${usrName}_${level}.log`);
        this.LogProgress(`Select User: ${usrName}, Level: ${level}`);
        // update info;
        this._win.webContents.send("gui", "modifyValue", "studyLearnBtn", `正在学习`);
        this._win.webContents.send("gui", "modifyValue", "usr", `${usrName}`);
        this._win.webContents.send("gui", "modifyValue", "level", `${level}`);
        // where = "level = '" + level + "'";
        let allCount = await this._usrProgress.GetAllCount(level);
        this._win.webContents.send("gui", "modifyValue", "allCount", `All words: ${allCount}`);
        this.LogProgress(`All words: ${allCount}`);
        // where = "level = '" + level + "' and LastDate is null ";
        let newCount = await this._usrProgress.GetNewCount(level);
        this._win.webContents.send("gui", "modifyValue", "newCount", `New words to learn: ${newCount}`);
        this.LogProgress(`New words to learn: ${newCount}`);
        // where = "level = '" + level + "' and familiar = 10";
        let finishCount = await this._usrProgress.GetFnshedCount(level);
        this._win.webContents.send("gui", "modifyValue", "finishCount", `Words has recited: ${finishCount}`);
        this.LogProgress(`Words has recited: ${finishCount}`);
        // where = "level = '" + level + "' and familiar > 0";
        let InProgressCount = await this._usrProgress.GetInProgressCount(level);
        this._win.webContents.send("gui", "modifyValue", "InProgressCount", `Words in learning: ${InProgressCount}`);
        this.LogProgress(`Words in learning: ${InProgressCount}`);
        // ready to get words to recite
        let allLimit = this._cfg.ReciteWords.General.TotalLimit;
        let newWdsLimit = this._cfg.ReciteWords.General.NewLimit;
        let limit = 0;
        // start get words to recite
        let wdsLst = new Array();
        let todayStr = (0, utils_1.formatDate)(this._today);
        // Start to get forgotten words
        console.log("Start to get forgotten words");
        wdsLst.length = 0;
        limit = Math.min(allLimit - this._wordsMap.size, newWdsLimit);
        let numOfAllForgoten = 0, numOfSelForgotten = 0;
        if (await this._usrProgress.GetForgottenWordsLst(wdsLst)) {
            numOfAllForgoten = wdsLst.length;
            for (let wd of wdsLst) {
                this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                this._logger.debug(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                this._learnLst.push(wd.Word);
                numOfSelForgotten++;
                if (numOfSelForgotten >= limit) {
                    break;
                }
            }
        }
        this.LogProgress(`Got ${numOfAllForgoten} forgotten words.`);
        this.LogProgress(`Select ${numOfSelForgotten} forgotten words.`);
        // Start to get over due words
        console.log("Start to get over due words");
        wdsLst.length = 0;
        limit = allLimit - this._wordsMap.size;
        let numOfAllOvrDue = 0, numOfSelOvrDue = 0;
        if (await this._usrProgress.GetOvrDueWordsLst(wdsLst, todayStr)) {
            numOfAllOvrDue = wdsLst.length;
            for (let wd of wdsLst) {
                this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                this._logger.debug(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                numOfSelOvrDue++;
                if (this._wordsMap.size >= allLimit) {
                    break;
                }
            }
        }
        this.LogProgress(`Got ${numOfAllOvrDue} over due words.`);
        this.LogProgress(`Select ${numOfSelOvrDue} over due words.`);
        // Start to get due words
        console.log("Start to get due words");
        wdsLst.length = 0;
        limit = allLimit - this._wordsMap.size;
        let numOfAllDue = 0, numOfSelDue = 0;
        if (await this._usrProgress.GetDueWordsLst(wdsLst, todayStr)) {
            numOfAllDue = wdsLst.length;
            for (let wd of wdsLst) {
                this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                this._logger.debug(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                numOfSelDue++;
                if (this._wordsMap.size >= allLimit) {
                    break;
                }
            }
        }
        this.LogProgress(`Got ${numOfAllDue} due words.`);
        this.LogProgress(`Selct ${numOfSelDue} due words.`);
        // Start to get new words
        console.log("Start to get new words");
        wdsLst.length = 0;
        limit = Math.min(newWdsLimit - numOfSelForgotten, allLimit - this._wordsMap.size);
        let newWdNum = 0;
        if (limit > 0) {
            if (await this._usrProgress.GetNewWordsLst(wdsLst, limit)) {
                for (let wd of wdsLst) {
                    this._wordsMap.set(wd.Word, [Number(wd.Familiar), new Date(wd.LastDate), new Date(wd.NextDate)]);
                    this._logger.debug(`Word: ${wd.Word}, Familiar: ${wd.Familiar}, LastDate: ${wd.LastDate}, NextDate: ${wd.NextDate}`);
                    this._learnLst.push(wd.Word);
                    newWdNum++;
                }
            }
        }
        this.LogProgress(`Got ${newWdNum} new words.`);
        // ready to recite
        let timeArray = this._cfg["ReciteWords"]["TimeInterval"];
        for (let timeGroup of timeArray) {
            if (timeGroup["Unit"] == "d") {
                this._timeDayLst.push(timeGroup["Interval"]);
            }
        }
        this._testCount = this._cfg.ReciteWords.TestMode.Times;
        // random learn list
        (0, utils_1.randomArray2)(this._learnLst);
        this.LogProgress(`Length of LearnList: ${this._learnLst.length}.`);
        // complement test list
        for (let word of Array.from(this._wordsMap.keys())) {
            this._testLst.push(word);
        }
        // random test list
        this._testLst = (0, utils_1.randomArray)(this._testLst);
        this.LogProgress(`Length of TestList: ${this._testLst.length}.`);
        //this._wordInput['state'] = 'readonly';
        this._win.webContents.send("gui", "modifyValue", "numOfLearn", `${this._learnLst.length} words to Learn!`);
        this._win.webContents.send("gui", "modifyValue", "numOfTest", `${this._testLst.length} words to Test!`);
        if (this._learnLst.length > 0) {
            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn");
            this.GoStudyMode();
        }
        else {
            this._win.webContents.send("gui", "DisaOrEnaBtn", "forgetBtn", false);
            this.GoTestMode();
        }
    }
    async LogProgress(info) {
        // 2021-08-25 19:59:01 it cost 0 hours, 50 minutes, 18 seconds.
        let now = new Date();
        let nowStr = (0, utils_1.formatTime)(now);
        let something = `${nowStr} ${info}\n`;
        // console.log(something);
        return super.Record2File(this._personalProgressFile, something);
    }
    async Save_Progress() {
        // remove words which hadn't be recited
        for (let word of this._testLst) {
            if (this._wordsMap.has(word)) {
                this._wordsMap.delete(word);
            }
        }
        if (this._mode == "Study Mode") {
            for (let word of this._curLearnLst) {
                if (this._wordsMap.has(word)) {
                    let data = this._wordsMap.get(word);
                    if (data != undefined) {
                        let familiar = data[0] - 1;
                        let lastDate = data[1];
                        let nextDate = data[2];
                        this._wordsMap.set(word, [familiar, lastDate, nextDate]);
                    }
                }
            }
        }
        else {
            if (this._curCount >= this._testCount) {
                this._curTestLst.splice(0, this._curTestPos - 1);
            }
            for (let word of this._curTestLst) {
                if (this._wordsMap.has(word)) {
                    this._wordsMap.delete(word);
                }
            }
        }
        for (let word of this._learnLst) {
            if (this._wordsMap.has(word)) {
                let data = this._wordsMap.get(word);
                if (data != undefined) {
                    let familiar = data[0] - 1;
                    let lastDate = data[1];
                    let nextDate = data[2];
                    this._wordsMap.set(word, [familiar, lastDate, nextDate]);
                }
            }
        }
        let allLen = this._wordsMap.size;
        this.LogProgress(`Number of words' familiar will be changed: ${allLen}`);
        let lastDateStr = "", nexDateStr = "";
        let mapStr = "{";
        this._wordsMap.forEach(([familiar, lastDate, nextDate], word) => {
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
            mapStr += `${word}: ${String(familiar)}, lastDate: ${lastDateStr}, nextDate: ${nexDateStr};`;
        });
        mapStr += "}";
        console.log("WordsDict = " + mapStr);
        let i = 0, nFnshd = 0;
        let iterator = this._wordsMap.entries();
        let r;
        let todayStr = (0, utils_1.formatDate)(this._today);
        let intervalDay = 0, index = 0;
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
            try {
                this._logger.debug(`${word}: ${String(familiar)}, lastDate: ${todayStr}, nextDate: ${nexDateStr}`);
                await this._usrProgress.UpdateProgress2(word, familiar, todayStr, nexDateStr);
                i++;
                let percent = i / allLen * 100;
                this._win.webContents.send("gui", "modifyValue", "info", `${percent.toFixed(2)}% to save progress.`);
            }
            catch (e) {
                this._logger.error(e.message);
                this._logger.error(e);
            }
        }
        this.LogProgress(`Finish to receite number of words: ${nFnshd}`);
        // console.log("OK to save progress.");
        this._win.webContents.send("gui", "modifyValue", "info", `OK to save progress.`);
    }
    async Quit(bStrted = true) {
        if (bStrted == true) {
            let now = new Date();
            let sec = now.getSeconds() - this._today.getSeconds();
            let min = now.getMinutes() - this._today.getMinutes();
            let hour = now.getHours() - this._today.getHours();
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
        await super.Quit();
    }
}
exports.ReciteWordsApp = ReciteWordsApp;
;
//# sourceMappingURL=ReciteWordsApp.js.map