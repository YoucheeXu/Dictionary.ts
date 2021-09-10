import * as fs from "fs";
import * as path from "path";
import * as log4js from "log4js";
import { BrowserWindow, app } from 'electron';
import { AuidoArchive } from "./components/AuidoArchive";
import { DictBase } from "./components/DictBase";
import { GDictBase } from "./components/GDictBase";
import { SDictBase } from "./components/SDictBase";
import { DownloardQueue } from "./utils/DownloardQueue";
import { globalVar } from "./utils/globalInterface";

import { UsrProgress } from "./components/UsrProgress";
import { WordsDict } from "./components/WordsDict";

export class dictApp {
    private cfg: any;
    private cfgFile: string;
    private bCfgModfied: boolean = false;
    private logger: log4js.Logger;
    private bDebug: boolean;
    private win: BrowserWindow;
    private dictAgent: any = new Array();
    private audioPackage: AuidoArchive;
    private dictId: string;
    private dictParseFun: string;
    private curDictBase: DictBase;
    private wordsDict: WordsDict;
    private dictBaseDict: any = new Map();
    private dictSysMenu: string[] | any;

    private usrProgress: UsrProgress;

    private miss_dict: string;
    private miss_audio: string;

    private curWord: string = "";

    constructor() {
        this.bDebug = false;
    }

    public async ReadAndConfigure(startPath: string): Promise<boolean> {
        this.cfgFile = path.join(startPath, 'Dictionary.json').replace(/\\/g, '/');

        let _this = this;
        if (fs.existsSync(this.cfgFile) == false) {
            console.log(_this.cfgFile + " doesn't exist");
            return false;
        };

        this.cfg = JSON.parse(fs.readFileSync(this.cfgFile).toString());

        let common = JSON.parse(JSON.stringify(this.cfg.Dictionary.common));
        console.log('ver: ' + common.ver);

        let debugCfg = JSON.parse(JSON.stringify(this.cfg.Dictionary.Debug));

        this.bDebug = debugCfg.bEnable;

        let debugLvl = 'INFO';
        if (this.bDebug == true) {
            debugLvl = 'DEBUG';
            let logFile = path.join(startPath, debugCfg.file);
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

        let agentCfg = JSON.parse(JSON.stringify(this.cfg['Agents']));
        let bIEAgent = agentCfg.bIEAgent;
        let activeAgent = agentCfg.activeAgent;
        let agentInfo = JSON.parse(JSON.stringify(agentCfg['Info']));
        for (let agent of agentInfo) {
            this.dictAgent.push({ name: agent.name, ip: agent.ip, program: agent.program });
        }
        this.dictAgent.push({ name: '', ip: '', program: '' });
        this.ActiveAgent(activeAgent);

        let dictBasesCfg = JSON.parse(JSON.stringify(this.cfg.DictBases));
        for (let tab of JSON.parse(JSON.stringify(this.cfg.Dictionary.Tabs))) {
            for (let dictBaseCfg of dictBasesCfg) {
                if (tab.Dict == dictBaseCfg.Name) {
                    let dictSrc = path.join(startPath, dictBaseCfg.Dict);
                    this.AddDictBase(tab.Name, dictSrc, JSON.parse(JSON.stringify(dictBaseCfg.Format)));
                    break;
                }
            }
        }

        let wordsDictCfg = this.cfg.WordsDict;
        let dictSrc = path.join(startPath, wordsDictCfg.Dict);
        this.wordsDict = new WordsDict();
        await this.wordsDict.Open(dictSrc);

        let audioCfg = JSON.parse(JSON.stringify(this.cfg['AudioBases']))[0];
        let audioFile = path.join(startPath, audioCfg.Audio);
        let audioFormatCfg = JSON.parse(JSON.stringify(audioCfg['Format']));
        if (audioFormatCfg.Type == 'ZIP') {
            this.audioPackage = new AuidoArchive(audioFile, audioFormatCfg.Compression, audioFormatCfg.CompressLevel);
        }

        let usrCfg = JSON.parse(JSON.stringify(this.cfg['Users']))[0];
        let progressFile = path.join(startPath, usrCfg.Progress).replace(/\\/g, '/');
        this.usrProgress = new UsrProgress();
        await this.usrProgress.Open(progressFile, "New");
        if (await this.usrProgress.ExistTable("New") == false) {
            this.usrProgress.NewTable("New");
        }

        let missCfg = JSON.parse(JSON.stringify(this.cfg.Dictionary.Miss));
        this.miss_dict = path.join(startPath, missCfg.miss_dict);
        this.miss_audio = path.join(startPath, missCfg.miss_audio);

        return true;
    }

    private SaveConfigure(): void {
        fs.writeFile(this.cfgFile, JSON.stringify(this.cfg), { 'flag': 'w' }, (err: any) => {
            if (err) {
                this.logger.error("Fail to SaveConfigure!");
            } else {
                this.logger.info("Success to SaveConfigure");
            }
        })
    }

    public async Start(bDev: boolean, startPath: string) {

        await this.CreateWindow(bDev, startPath);

        let dQueue = new DownloardQueue(this.win);
        globalVar.dQueue = dQueue;
    }

    public async CreateWindow(bDev: boolean, startPath: string) {
        let size = { w: 0, h: 0 };
        if (await this.ReadAndConfigure(startPath) == false) {
            return;
        }

        this.getWinSize(size);

        // Create the browser window.
        this.win = new BrowserWindow({
            icon: path.join(__dirname, 'assets/img/dictApp.ico'),
            width: size.w,
            height: size.h,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
            },
        });

        // and load the index.html of the app.
        this.win.loadURL(`file://${__dirname}/assets/Dictionary.html`);

        if (bDev) {
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

    public GetWindow(): BrowserWindow {
        return this.win;
    }

    public Close(): void {
        // only work in target >= es6
        // for (let value of this.dictBaseDict.values()) {
        // 	console.log("Close " + value["name"]);
        // 	this.logger.info("Close " + value["name"]);
        // 	value["dictBase"]?.close();
        // }
        this.dictBaseDict.forEach((value: any, key: string) => {
            console.log("Start to close " + value["name"]);
            value["dictBase"]?.close();
        });
        this.audioPackage.close();

        if (this.bCfgModfied) {
            this.SaveConfigure()
        }
    }

    private Record2File(file: string, something: string) {
        fs.writeFile(file, something, { 'flag': 'a' }, (err: any) => {
            if (err) {
                this.logger.error(`Fail to record ${something} in ${file}!`);
            } else {
                console.log(`Success to record ${something} in ${file}!`);
            }
        })
    }

    public ActiveAgent(activeAgent: any): boolean {
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
    }

    private AddDictBase(name: string, dictSrc: string, format: any): void {
        let dictBase = null;
        if (format.Type == 'ZIP') {
            dictBase = new GDictBase(dictSrc, format.Compression, format.Compress_Level);
        } else if (format.Type == 'SQLite') {
            dictBase = new SDictBase(dictSrc);
        } else if (format.Type == 'mdx') {
            // dictBase = new MDictBase(dictSrc);
        }
        else {
            throw new Error(`Unknown dict's type: ${format.Type}!`);
        }

        let dictId = 'dict' + String(this.dictBaseDict.size + 1);
        // this.dictBaseDict.push({dictId: { 'name': name, 'dictBase': dictBase } });
        // this.dictBaseDict[dictId] = { 'name': name, 'dictBase': dictBase };
        this.dictBaseDict.set(dictId, { 'name': name, 'dictBase': dictBase });
    }

    public getWinSize(size: any): void {
        /*
        let width = int(this.cfgDict["GUI"]["Width"])
        let height = int(this.cfgDict["GUI"]["Height"])
        let fileURL = os.path.join(curPath, this.cfgDict["GUI"]["html"])
    	
        let showHiRatio = float(this.cfgDict["GUI"]["ShowHiRatio"]);
        let showWiRatio = float(this.cfgDict["GUI"]["ShowWiRatio"]);
        */
        // let gui = JSON.parse(JSON.stringify(this.//dictCfg["GUI"]));
        let gui = JSON.parse(JSON.stringify(this.cfg["Dictionary"]['GUI']));
        size.h = gui.Height;
        size.w = gui.Width;
        // size.showHiRatio = gui.ShowHiRatio;
        // size.showWiRatio = gui.ShowWiRatio;
    }

    public OnButtonClicked(id: string): void {
        switch (id) {
            case "btn_close":
                // 做点其它操作：比如记录窗口大小、位置等，下次启动时自动使用这些设置；不过因为这里（主进程）无法访问localStorage，这些数据需要使用其它的方式来保存和加载，这里就不作演示了。这里推荐一个相关的工具类库，可以使用它在主进程中保存加载配置数据：https://github.com/sindresorhus/electron-store
                // ...
                // safeExit = true;
                this.Close();
                app.quit(); // 退出程序
                break;
            case "btn_min":
                this.win.minimize();
                break;
            case 'btn_prev':
                this.QueryPrev();
                break;
            case 'btn_next':
                this.QueryNext();
                break;
            default:
                this.logger.info(id);
        }
    }

    public QueryNext() {
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
    }

    public QueryPrev() {
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
    }

    public OnMenuClicked(menuId: string) {
        throw new Error('Method not implemented.');
        /*
        let action: string = 'this.' + this.dictSysMenu[menuId];
        this.logger.info(`action = ${action}`);
    	
        // eval(action)(menuId);
        // this.get_browser().ExecuteFunction('active_menu', menuId);
        */
    }

    public OnDocumentReady(): void {
        this.AddTabs();
        // this.FillMenus();
    }

    private AddTabs(): void {
        const html = `\n							<div id = "toggle_example" align = "right">- Hide Examples</div>
							<p></p>`;

        this.dictBaseDict.forEach((value: any, key: string) => {
            this.logger.info(`AddTab: ${key}, ${value["name"]}`);
            // self.get_browser().ExecuteFunction("AddTab", dictId, item["name"], html)
            this.win.webContents.send("gui", "AddTab", key, value["name"], html);
            this.dictId = key;
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
    }

    private AddMenu(name: string, action: string, bActived: boolean = false): void {
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
    }

    public FillMenus(): void {
        throw new Error('Method not implemented.');
        /*
        for (key of this.dictAgent.keys()){
            this.AddMenu(key, "ActiveAgent", this.dictAgent[key]["bActived"]);
        }
        // self.get_browser().ExecuteFunction("bindMenus");
        this.win.webContents.send("gui", "bindMenus");
        */
    }

    public SwitchTab(tabId: string): void {
        this.logger.info("switch to tab: " + tabId);
        this.dictId = tabId;
        this.curDictBase = this.get_curDB();
        this.dictParseFun = this.curDictBase.get_parseFun();
    }
    public get_curDB(): DictBase {
        return this.dictBaseDict.get(this.dictId)["dictBase"];
    }
    public playMP3(audio: string): boolean {
        this.logger.info("going to play " + audio);
        // self.get_browser().ExecuteFunction("playMP3", audio);
        this.win.webContents.send("gui", "playMP3", audio);
        return true;
    }

    public async QueryWord(word: string, nDirect: number = 0): Promise<void> {
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

        this.logger.info(`word = ${word};`);

        let retDict = -1;
        let dict = "";
        let retAudio = -1;
        let audio = "";

        let bNew = false;

        [retDict, dict] = await this.curDictBase.query_word(word);
        [retAudio, audio] = await this.audioPackage.query_audio(word);

        if (retDict <= 0) {
            this.logger.error("dict: " + dict);
            dict =
                `<div class="headword">
                    <div class="text">${word}</div>
                    <div class="phonetic">${dict}</div>
                </div>`;
            dict = dict.replace(/[\r\n]/g, "");

            if (retDict < 0) {
                this.Record2File(this.miss_dict, "Dict of " + word + ": " + dict + "\n");
            }
        }
        else {
            if ((await this.usrProgress.ExistWord(word)) == false) {
                this.usrProgress.InsertWord(word).then(() => {
                    console.log(word + " will be marked as new.");
                    this.win.webContents.send("QueryWord", "mark_new", true);
                });
                bNew = false;
            }
            else {
                console.log(word + " has been marked as new.");
                bNew = true;
            }
        }

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

        let level = await this.wordsDict.GetLevel(word);
        let nStars = await this.wordsDict.GetStar(word);

        this.win.webContents.send("QueryWord", this.dictParseFun, word, this.dictId, dict, audio, bNew, level, nStars);

        // this.lastWord = word;
    }

    public speechWord(audio: string): void {
        if (fs.statSync(audio).isFile() == false) {
            this.logger.error("The is no mp3: " + audio);
        }
        try {
            this.playMP3(audio);
        }
        catch (e) {
            this.logger.error("wrong mp3: " + audio);
            this.logger.error((e as Error).message);
        }
    }

    public markNew(word: string, bNew: string): void {
        if (bNew === 'true') {
            this.usrProgress.InsertWord(word).then(() => {
                console.log(word + " has been marked as new.");
                this.win.webContents.send("QueryWord", "mark_new", true);
            });
        }
        else {
            this.usrProgress.DelWord(word).then(() => {
                console.log(word + " has been removed mark of new.");
                this.win.webContents.send("QueryWord", "mark_new", false);
            });
        }
    }

    public TopMostOrNot(): void {
        var bTop = this.win.isAlwaysOnTop();
        this.win.setAlwaysOnTop(!bTop);
    }

    public async OnTextChanged(word: string): Promise<boolean> {
        let wdsLst: string[] = new Array();

        let ret = await this.curDictBase.get_wordsLst(word, wdsLst);
        if (!ret) {
            console.log("OnTextChanged: no similiar words!")
            return false;
        }

        // this.window.get_browser().ExecuteFunction("clear_words_list");
        this.win.webContents.send("gui", "clearOptions", "words_list");

        for (let wd of wdsLst) {
            // this.window.get_browser().ExecuteFunction("append_words_list", wd);
            this.win.webContents.send("gui", "appendOpt", "words_list", wd);
        }

        return true;
    }

    /**
     *
     *
     * @param {number} ret result of msg, <0 means failure, =0 means ongoing, 1 means success
     * @param {number} typ type of info, 1 means json, 2 means mp3
     * @param {string} word
     * @param {string} msg when ret equals 1 and typ equals 2, it represent local address of word's mp3
     * @memberof dictApp
     */
    public info(ret: number, typ: number, word: string, msg: string) {
        if (ret < 0) {
            this.logger.error(msg);
            if (typ == 1) {
                this.Record2File(this.miss_dict, `dict of ${word} : ${msg}\n`);
            }
            else if (typ == 2) {
                this.Record2File(this.miss_audio, `audio of ${word} : ${msg}\n`);
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
    }

    public log(lvl: string, msg: string) {
        if (lvl == "info") {
            this.logger.info(msg);
        }
        else if (lvl == "error") {
            this.logger.error(msg);
        }
    }
};
