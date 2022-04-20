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
exports.dictApp = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const timers_1 = require("timers");
const ElectronApp_1 = require("./ElectronApp");
const UsrProgress_1 = require("./components/UsrProgress");
class dictApp extends ElectronApp_1.ElectronApp {
    constructor(startPath) {
        super(startPath);
    }
    async ReadAndConfigure() {
        await super.ReadAndConfigure();
        let usrsCfg = JSON.parse(JSON.stringify(this._cfg['Users']));
        let defaultUsr = this._cfg.Dictionary.User;
        for (let usrCfg of usrsCfg) {
            // let progressFile = path.join(this._startPath, usrCfg.Progress).replace(/\\/g, '/');
            if (usrCfg.Name == defaultUsr) {
                let progressFile = path.join(this._startPath, usrCfg.Progress);
                this._usrProgress = new UsrProgress_1.UsrProgress();
                await this._usrProgress.Open(progressFile, "New");
                if (await this._usrProgress.ExistTable("New") == false) {
                    this._usrProgress.NewTable("New");
                }
                break;
            }
        }
        return true;
    }
    async Run(argvs) {
        await super.Run(argvs);
        if (argvs.typ == "c") {
            this._curDictId = "dict1";
            this._curDictBase = this.getDictBase(this._curDictId);
            let wordsLst = argvs.word.split(" ");
            for (let wd of wordsLst) {
                await this.QueryWord2(wd);
            }
            this.WaitAsyncTasksFnshd(async () => {
                await this.Quit();
            });
        }
    }
    GetWindow() {
        return this._win;
    }
    WaitAsyncTasksFnshd(cb) {
        this._logger.info("Start to quit Dictionary");
        let timerID = setInterval(async () => {
            if (this._dQueue.IsFnshd()) {
                console.info("Finshed to download all files.");
                (0, timers_1.clearInterval)(timerID);
                this._logger.info("Wait 2s to quit.");
                setTimeout(() => {
                    cb();
                }, 2000);
            }
        }, 2000);
    }
    async OnButtonClicked(id) {
        switch (id) {
            case "btn_close":
                // this.WaitAsyncTasksFnshd(async () => {
                //     await this.Quit();
                // })
                await this.Quit();
                break;
            case "btn_min":
                this._win.minimize();
                break;
            case 'btn_prev':
                this.QueryPrev();
                break;
            case 'btn_next':
                this.QueryNext();
                break;
            default:
                this._logger.info(id);
        }
    }
    QueryNext() {
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
    }
    QueryPrev() {
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
    }
    OnMenuClicked(menuId) {
        throw new Error('Method not implemented.');
        /*
        let action: string = 'this._' + this._dictSysMenu[menuId];
        this._logger.info(`action = ${action}`);
        
        // eval(action)(menuId);
        // this._get_browser().ExecuteFunction('active_menu', menuId);
        */
    }
    OnDocumentReady() {
        this.AddTabs();
        // this.FillMenus();
    }
    AddTabs() {
        const html = `\r\n							<p></p>`;
        for (let tab of JSON.parse(JSON.stringify(this._cfg.Dictionary.Tabs))) {
            let dictBase = this._dictMap.get(tab.Dict);
            if (dictBase) {
                let dictName = dictBase.szName;
                let tabName = tab.Name;
                this._logger.info(`AddTab: ${tabName} with dict: ${dictName}`);
                this._win.webContents.send("gui", "AddTab", dictName, tabName, html);
            }
        }
        // this._dictMap.forEach((dict: DictBase, tabId: string) => {
        //     let name = dict.szName;
        //     this._logger.info(`Add tab: ${tabId}, dict: ${name}`);
        //     this._win.webContents.send("gui", "AddTab", tabId, name, html);
        //     this._curDictId = tabId;
        // });
        this._win.webContents.send("gui", "BindSwitchTab");
        // switch to default tab
        this._curDictId = this._cfg.Dictionary.Tab;
        this._curDictBase = this.getDictBase(this._curDictId);
        this._win.webContents.send("gui", "ActiveTab", this._curDictId);
        // this._bHomeRdy = true;
    }
    AddMenu(name, action, bActived = false) {
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
    }
    FillMenus() {
        throw new Error('Method not implemented.');
        /*
        for (key of this._dictAgent.keys()){
            this.AddMenu(key, "ActiveAgent", this._dictAgent[key]["bActived"]);
        }
        // self.get_browser().ExecuteFunction("bindMenus");
        this._win.webContents.send("gui", "bindMenus");
        */
    }
    getDictBase(tabId) {
        return this._dictMap.get(tabId);
    }
    SwitchTab(tabId) {
        this._curDictId = tabId;
        this._logger.info("switch to tab: " + tabId);
        this._curDictBase = this.getDictBase(tabId);
    }
    // only for command line
    async QueryWord2(word) {
        this._logger.info(`word = ${word};`);
        let retDict = -1;
        let dict = "";
        let retAudio = -1;
        let audio = "";
        [retDict, dict] = await this._curDictBase.query_word(word);
        [retAudio, audio] = await this._audioBase.query_audio(word);
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
    }
    // only for gui
    async QueryWord(word, tabId, nDirect = 0) {
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
        if (word == this._curWord && !tabId) {
            this.speechWord();
            return;
        }
        if (tabId) {
            this._curDictId = tabId;
        }
        this._logger.info(`word = ${word};`);
        let retDict = -1;
        let dict = "";
        let retAudio = -1;
        let audio = "";
        let bNew = false;
        [retDict, dict] = await this._curDictBase.query_word(word);
        [retAudio, audio] = await this._audioBase.query_audio(word);
        if (retDict == 0) {
            let dictName = this._curDictBase.szName;
            if (this._curDictBase.download) {
                this.TriggerDownload(this._curDictBase, word, dict);
            }
            else {
                let errMsg = `Dict of ${word}: ${dictName} doesn't support to download.\n`;
                this.Record2File(this._miss_dict, errMsg);
                this.Info(-1, 1, word, errMsg);
            }
            dict = `there is no ${word} in ${dictName}.`;
        }
        if (retDict < 0) {
            this.Record2File(this._miss_dict, dict);
        }
        if (retDict <= 0) {
            this._curWord = "";
            let dictErrFile = path.join(this._curDictBase.szTmpDir, word + "-error.html");
            let html = `<div class="headword">\r\n\t<div class="text">${dict}</div>\r\n</div>`;
            fs.writeFileSync(dictErrFile, html);
            dict = dictErrFile;
        }
        else {
            this._curWord = word;
            if ((await this._usrProgress.ExistWord(word)) == false) {
                this._usrProgress.InsertWord(word).then(() => {
                    console.log(word + " will be marked as new.");
                    this._win.webContents.send("QueryWord", "mark_new", true);
                });
                bNew = false;
            }
            else {
                let familiar = await this._usrProgress.GetItem(word, "Familiar");
                if (familiar < 10) {
                    console.log(word + " has been marked as new.");
                    bNew = true;
                }
                else {
                    console.log(word + " has been rectied.");
                    bNew = false;
                }
            }
        }
        if (retAudio < 0) {
            this.Info(-1, 2, word, audio);
            this.Record2File(this._miss_audio, "Audio of " + word + ": " + audio + "\n");
        }
        else if (retAudio == 0) {
            if (this._audioBase.download) {
                this.TriggerDownload(this._audioBase, word, audio);
            }
            else {
                let audioName = this._audioBase.szName;
                this.Record2File(this._miss_audio, `Audio of ${word}: ${audioName} doesn't support to download.\n`);
                this.Record2File(this._miss_audio, "\n");
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
        dict = dict.replace(/\\/g, "/");
        audio = audio.replace(/\\/g, "/");
        let level = "";
        let nStars = 0;
        try {
            level = await this._wordsDict.GetLevel(word);
            nStars = await this._wordsDict.GetStar(word);
        }
        catch (e) {
            this._logger.error(`Fail to read ${word} from ${this._wordsDict.szSrcFile}, because of ${e}.`);
        }
        this._win.webContents.send("QueryWord", "dictHtml", word, this._curDictId, dict, audio, bNew, level, nStars);
        // this._lastWord = word;
    }
    speechWord(audio = "") {
        try {
            if (audio) {
                if (fs.statSync(audio).isFile() == false) {
                    this._logger.error("There is no mp3: " + audio);
                }
                else {
                    this._win.webContents.send("gui", "loadAndPlayAudio", audio);
                }
            }
            else {
                this._win.webContents.send("gui", "playAudio");
            }
        }
        catch (e) {
            this._logger.error("wrong mp3: " + audio);
            this._logger.error(e.message);
        }
    }
    markNew(word, bNew) {
        if (bNew === 'true') {
            this._usrProgress.InsertWord(word).then(() => {
                console.log(word + " has been marked as new.");
                this._win.webContents.send("QueryWord", "mark_new", true);
            });
        }
        else {
            this._usrProgress.DelWord(word).then(() => {
                console.log(word + " has been removed mark of new.");
                this._win.webContents.send("QueryWord", "mark_new", false);
            });
        }
    }
    TopMostOrNot() {
        var bTop = this._win.isAlwaysOnTop();
        this._win.setAlwaysOnTop(!bTop);
    }
    async OnTextChanged(word) {
        let wdsLst = new Array();
        let ret = await this._curDictBase.get_wordsLst(word, wdsLst);
        if (!ret) {
            console.log("OnTextChanged: no similiar words!");
            return false;
        }
        // this._window.get_browser().ExecuteFunction("clear_words_list");
        this._win.webContents.send("gui", "clearOptions", "words_list");
        for (let wd of wdsLst) {
            // this._window.get_browser().ExecuteFunction("append_words_list", wd);
            this._win.webContents.send("gui", "appendOpt", "words_list", wd);
        }
        return true;
    }
}
exports.dictApp = dictApp;
;
//# sourceMappingURL=dictApp.js.map