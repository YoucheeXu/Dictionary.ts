// GDictBase.ts
import * as path from "path";
import * as fs from "fs";
import { DictBase } from "./DictBase";
import { ZipArchive } from "./ZipArchive";
import { process_primary } from "../utils/Json2Html";
import { RemoveDir } from "../utils/utils";
import { globalVar } from "../utils/globalInterface";

export class GDictBase extends DictBase {
    private readonly bWritable: boolean = true;
    private dictArchive: string;
    private dictZip: ZipArchive;
    private tempDictDir: string;

    constructor(dictSrc: string, readonly compression: string, readonly compresslevel: string) {
        super(dictSrc);
        this.dictZip = new ZipArchive(dictSrc, compression, compresslevel);
        // this.tempDictDir = tempfile.gettempdir();
        this.dictArchive = path.basename(dictSrc);
        let filePath = path.dirname(dictSrc);
        let fileName = path.basename(dictSrc, ".zip");
        // console.log(fileName);
        this.tempDictDir = path.join(filePath, fileName);
    }

    public async Open() {
        return this.dictZip.Open();
    }

    public async Close(): Promise<[boolean, string]> {
        RemoveDir(this.tempDictDir);
        if (fs.existsSync(this.tempDictDir) == false) {
            return [true, `; OK to remove ${this.tempDictDir}`];
        } else {
            return [false, `; Fail to remove ${this.tempDictDir}`];
        }
    }

    public get_parseFun(): string {
        // return "dictJson";
        return "dictHtml";
    }

    public async query_word(word: string): Promise<[number, string]> {
        // fileName = os.path.join(word[0], word + ".json")
        let fileName = word[0] + "/" + word + ".json";
        let datum: string | any;
        let ret: boolean = false;
        // let gApp = globalVar.app;
        let wordFile = "";
        try {
            if (this.dictZip.bFileIn(fileName)) {
                [ret, datum] = await this.dictZip.readFileAsync(fileName);
                if (!ret) {
                    return Promise.resolve([-1, `Fail to read ${word} in ${this.dictArchive}`]);
                }
            }
            else if (this.bWritable) {
                wordFile = path.join(this.tempDictDir, word + ".json");
                let jsonURL = "http://dictionary.so8848.com/ajax_search?q=" + word;
                jsonURL = jsonURL.replace(" ", "%20");
                // download_file(gApp.GetWindow(), jsonURL, wordFile, this, this.notify);
                globalVar.dQueue.AddQueue(jsonURL, wordFile, this, this.notify);
                datum = `dict of ${word} is added to download queue.`;
                return Promise.resolve([0, datum]);
            }

            let strDatum = String(datum);
            let dictDatum = JSON.parse(strDatum);

            if (dictDatum["ok"]) {
                let info = dictDatum["info"];
                info = String(info).replace(/\\x/g, "\\u00");
                let obj = JSON.parse(info);
                let tabAlign = '\t\t\t\t\t\t\t';
                let html = '\r\n' + process_primary(tabAlign + '\t', obj.primaries) + tabAlign;

                html = html.replace(/[\r\n]/g, "");
                return Promise.resolve([1, html]);
            }
            else {
                return Promise.resolve([-1, "Fail to read: " + word]);
            }
        }
        catch (e) {
            if (fs.existsSync(wordFile)) {
                fs.unlinkSync(wordFile);
            }
            // console.error(e);
            let errMsg = (e as Error).message.replace("<", "").replace(">", "");
            return Promise.resolve([-1, errMsg]);
        }
    }

    private notify(name: string, progress: number, state: string, why?: string) {
        console.log(`${(progress * 100).toFixed(2)}% of ${name} was ${state} to download!`);
        let gApp = globalVar.app;
        let word = path.basename(name, ".json");
        switch (state) {
            case 'ongoing':
                break;
            case 'fail':
                gApp.info(-1, 1, word, `Fail to download dict of ${word}, because of ${why}`);
                break;
            case 'done':
                this.checkAndAddFile(name);
                break;
        }
    }

    private checkAndAddFile(wordFile: string) {
        let word = path.basename(wordFile, ".json");
        let fileName = word[0] + "/" + word + ".json";
        let info = "";
        let _this = this;
        let gApp = globalVar.app;
        if (fs.existsSync(wordFile)) {
            let dict = fs.readFileSync(wordFile).toString();
            let inWord = this.GetInWord(dict);

            fs.unlink(wordFile, () => { });

            if (inWord != "") {
                if (inWord == word) {
                    // gApp.log("info", "%s's json is OK!" %word)
                    _this.dictZip.addFile(fileName, dict);
                    return gApp.info(1, 1, word, "OK to download dict of " + word);
                }
                else {
                    return gApp.info(-1, 1, inWord, `Wrong word: We except '${word}', but we get '${inWord}'`);
                    // gApp.log("error", "%s isn't what we want!" %word)
                }
            }
            else {
                return gApp.info(-1, 1, word, `No dict of ${word} in ${this.dictArchive}.`);
            }
        }
        else {
            console.log(wordFile + " doesn't exist");
            return gApp.info(-1, 1, word, "Doesn't exist dict of " + word);
        }
    }

    private GetInWord(dict: string): string {
        let datum = JSON.parse(dict);

        if (datum["ok"]) {
            let info = datum["info"];
            info = String(info).replace(/\\x/g, "\\u00");
            // info = info.replace('\\', '\\\\');
            try {
                datum = JSON.parse(info);
                if (datum["primaries"][0]["type"] == "headword") {
                    return datum["primaries"][0]["terms"][0]["text"];
                }
            } catch (e) {
                let errMsg = (e as Error).message.replace("<", "").replace(">", "");
                console.error(errMsg);
                return "";
            }
        }
        return "";
    }

    public get_wordsLst(word: string, wdMatchLst: string[]): boolean {
        let fileName = word[0] + "/" + word + ".*\.json";
        // print("Going to find: " + fileName)
        this.dictZip.searchFile(fileName, wdMatchLst, 100);

        // for i in range(len(wdMatchLst)){
        for (let i = 0; i < wdMatchLst.length; i++) {
            wdMatchLst[i] = wdMatchLst[i].slice(2, -5);
        }

        if (wdMatchLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }

    public getWritable(): boolean {
        return this.bWritable;
    }

    public del_word(word: string): boolean {
        let fileName = word[0] + "/" + word + ".json";
        return this.dictZip.delFile(fileName);
    }
};