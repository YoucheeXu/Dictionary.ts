import * as fs from "fs";
import * as path from "path";
import { BrowserWindow, app } from 'electron';

import { clearInterval } from "timers";
import { ElectronApp } from "./ElectronApp";

import { DictBase } from "./components/DictBase";
import { UsrProgress } from "./components/UsrProgress";

export class dictApp extends ElectronApp {
    private _dictId: string;

    private _dictSysMenu: string[] | any;

    constructor(startPath: string) {
        super(startPath);
    }

    public async ReadAndConfigure(): Promise<boolean> {
        await super.ReadAndConfigure();

        let usrsCfg = JSON.parse(JSON.stringify(this._cfg['Users']));

        let defaultUsr = this._cfg.Dictionary.User;

        for (let usrCfg of usrsCfg) {
            // let progressFile = path.join(this._startPath, usrCfg.Progress).replace(/\\/g, '/');
            if (usrCfg.Name == defaultUsr) {
                let progressFile = path.join(this._startPath, usrCfg.Progress);
                this._usrProgress = new UsrProgress();
                await this._usrProgress.Open(progressFile, "New");
                if (await this._usrProgress.ExistTable("New") == false) {
                    this._usrProgress.NewTable("New");
                }
                break;
            }
        }
        return true;
    }

    public async Run(argvs: any) {

        await super.Run(argvs);

        if (argvs.typ == "c") {
            this._dictId = "dict1";
            this._curDictBase = this.get_curDB();
            let wordsLst = argvs.word.split(" ");
            for (let wd of wordsLst) {
                await this.QueryWord2(wd);
            }

            this.WaitAsyncTasksFnshd(async () => {
                await this.Quit();
            })
        }
    }

    public GetWindow(): BrowserWindow {
        return this._win;
    }

    public WaitAsyncTasksFnshd(cb: () => void) {
        this._logger.info("Start to quit Dictionary");
        let timerID = setInterval(async () => {
            if (this._dQueue.IsFnshd()) {
                console.info("Finshed to download all files.");
                clearInterval(timerID);
                this._logger.info("Wait 2s to quit.");
                setTimeout(() => {
                    cb();
                }, 2000);
            }
        }, 2000)
    }

    public async OnButtonClicked(id: string) {
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

    public QueryNext() {
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

    public QueryPrev() {
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

    public OnMenuClicked(menuId: string) {
        throw new Error('Method not implemented.');
        /*
        let action: string = 'this._' + this._dictSysMenu[menuId];
        this._logger.info(`action = ${action}`);
    	
        // eval(action)(menuId);
        // this._get_browser().ExecuteFunction('active_menu', menuId);
        */
    }

    public OnDocumentReady(): void {
        this.AddTabs();
        // this.FillMenus();
    }

    private AddTabs(): void {
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
        //     this._dictId = tabId;
        // });

        this._win.webContents.send("gui", "BindSwitchTab");

        // switch to default tab
        this._dictId = this._cfg.Dictionary.Tab;
        this._curDictBase = this.get_curDB();
        this._win.webContents.send("gui", "ActiveTab", this._dictId);

        this._curDictBase = this.get_curDB();

        // this._bHomeRdy = true;
    }

    private AddMenu(name: string, action: string, bActived: boolean = false): void {
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

    public FillMenus(): void {
        throw new Error('Method not implemented.');
        /*
        for (key of this._dictAgent.keys()){
            this.AddMenu(key, "ActiveAgent", this._dictAgent[key]["bActived"]);
        }
        // self.get_browser().ExecuteFunction("bindMenus");
        this._win.webContents.send("gui", "bindMenus");
        */
    }

    public SwitchTab(tabId: string): void {
        this._logger.info("switch to tab: " + tabId);
        this._dictId = tabId;
        this._curDictBase = this.get_curDB();
    }

    public get_curDB(): DictBase {
        return this._dictMap.get(this._dictId);
    }

    public PlayAudio(audio: string): boolean {
        this._logger.info("going to play " + audio);
        // self.get_browser().ExecuteFunction("playMP3", audio);
        this._win.webContents.send("gui", "playMP3", audio);
        return true;
    }

    // only for command line
    public async QueryWord2(word: string): Promise<void> {
        this._logger.info(`word = ${word};`);

        let retDict = -1;
        let dict = "";
        let retAudio = -1;
        let audio = "";

        [retDict, dict] = await this._curDictBase.query_word(word);
        [retAudio, audio] = await this._audioBase.query_audio(word);

        if (retDict < 0) {
            this.Record2File(this._miss_dict, "Dict of " + word + ": " + dict + "\n");
        } else if (retDict == 0) {
            this._logger.info(dict);
        }

        if (retAudio < 0) {
            this.Record2File(this._miss_audio, "Audio of " + word + ": " + audio + "\n");
        } else if (retAudio == 0) {
            this._logger.info(audio);
        }

        if (retDict < 0 || retAudio < 0) {
            this.Record2File(this._miss_audio, "\n");
        }
    }

    // only for gui
    public async QueryWord(word: string, nDirect: number = 0): Promise<void> {
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

        this._logger.info(`word = ${word};`);

        let retDict = -1;
        let dict = "";
        let retAudio = -1;
        let audio = "";

        let bNew = false;

        [retDict, dict] = await this._curDictBase.query_word(word);
        [retAudio, audio] = await this._audioBase.query_audio(word);

        if (retDict < 0) {
            this.Record2File(this._miss_dict, "Dict of " + word + ": " + dict + "\n");
        } else if (retDict == 0) {
            if (this._curDictBase.download) {
                this.TriggerDownload(this._curDictBase, word, dict);
            } else {
                let dictName = this._curDictBase.szName;
                this.Record2File(this._miss_dict, `Dict of ${word}: ${dictName} doesn't support to download.\n`);
            }
        }

        if (retDict <= 0) {
            dict =
                `<div class="headword">
                    <div class="text">${word}</div>
                    <div class="phonetic">${dict}</div>
                </div>`;
            dict = dict.replace(/[\r\n]/g, "");
        } else {
            if ((await this._usrProgress.ExistWord(word)) == false) {
                this._usrProgress.InsertWord(word).then(() => {
                    console.log(word + " will be marked as new.");
                    this._win.webContents.send("QueryWord", "mark_new", true);
                });
                bNew = false;
            } else {
                let familiar = await this._usrProgress.GetItem(word, "Familiar");
                if (familiar < 10) {
                    console.log(word + " has been marked as new.");
                    bNew = true;
                } else {
                    console.log(word + " has been rectied.");
                    bNew = false;
                }
            }
        }

        if (retAudio < 0) {
            this.Info(-1, 2, word, audio);
            this.Record2File(this._miss_audio, "Audio of " + word + ": " + audio + "\n");
        } else if (retAudio == 0) {
            if (this._audioBase.download) {
                this.TriggerDownload(this._audioBase, word, audio);
            } else {
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

        this._win.webContents.send("QueryWord", "dictHtml", word, this._dictId, dict, audio, bNew, level, nStars);

        // this._lastWord = word;
    }

    public speechWord(audio: string): void {
        if (fs.statSync(audio).isFile() == false) {
            this._logger.error("There is no mp3: " + audio);
        }
        try {
            this.PlayAudio(audio);
        }
        catch (e) {
            this._logger.error("wrong mp3: " + audio);
            this._logger.error((e as Error).message);
        }
    }

    public markNew(word: string, bNew: string): void {
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

    public TopMostOrNot(): void {
        var bTop = this._win.isAlwaysOnTop();
        this._win.setAlwaysOnTop(!bTop);
    }

    public async OnTextChanged(word: string): Promise<boolean> {
        let wdsLst: string[] = new Array();

        let ret = await this._curDictBase.get_wordsLst(word, wdsLst);
        if (!ret) {
            console.log("OnTextChanged: no similiar words!")
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
};