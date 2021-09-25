// GDictBase.ts
import * as path from "path";
import * as fs from "fs";
import { DictBase } from "./DictBase";
import { ZipArchive } from "./ZipArchive";
import { process_primary } from "../utils/Json2Html";
import { RemoveDir } from "../utils/utils";
import { globalVar } from "../utils/globalInterface";

export class GDictBase extends DictBase {
    private _dictZip: ZipArchive;
    private _tempDictDir: string;

    constructor(name: string, dictSrc: string, readonly _compression: string, readonly _compresslevel: string) {
        super(name, dictSrc);
        this._dictZip = new ZipArchive(dictSrc, _compression, _compresslevel);
        // this.tempDictDir = tempfile.gettempdir();
        let filePath = path.dirname(dictSrc);
        let fileName = path.basename(dictSrc, ".zip");
        // console.log(fileName);
        this._tempDictDir = path.join(filePath, fileName);
    }

    public async Open() {
        return this._dictZip.Open();
    }

    public async Close(): Promise<[boolean, string]> {
        RemoveDir(this._tempDictDir);
        if (fs.existsSync(this._tempDictDir) == false) {
            return [true, `OK to remove ${this._tempDictDir}`];
        } else {
            return [false, `Fail to remove ${this._tempDictDir}`];
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
            if (this._dictZip.bFileIn(fileName)) {
                [ret, datum] = await this._dictZip.readFileAsync(fileName);
                if (!ret) {
                    return Promise.resolve([-1, `Fail to read ${word} in ${this.szName}`]);
                }
            } else {
                wordFile = path.join(this._tempDictDir, word + ".json");
                return Promise.resolve([0, wordFile]);
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

    public CheckAndAddFile(localFile: string) {
        let word = path.basename(localFile, ".json");
        let fileName = word[0] + "/" + word + ".json";
        let info = "";
        let _this = this;
        let gApp = globalVar.app;
        if (fs.existsSync(localFile)) {
            let dict = fs.readFileSync(localFile).toString();
            let inWord = this.GetInWord(dict);

            fs.unlink(localFile, () => { });

            if (inWord != "") {
                if (inWord == word) {
                    // gApp.log("info", "%s's json is OK!" %word)
                    _this._dictZip.addFile(fileName, dict);
                    return gApp.Info(1, 1, word, "OK to download dict of " + word);
                }
                else {
                    return gApp.Info(-1, 1, inWord, `Wrong word: We except '${word}', but we get '${inWord}'`);
                    // gApp.log("error", "%s isn't what we want!" %word)
                }
            }
            else {
                return gApp.Info(-1, 1, word, `No dict of ${word} in ${this.szName}.`);
            }
        }
        else {
            console.log(localFile + " doesn't exist");
            return gApp.Info(-1, 1, word, "Doesn't exist dict of " + word);
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
        this._dictZip.searchFile(fileName, wdMatchLst, 100);

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

    public del_word(word: string): boolean {
        let fileName = word[0] + "/" + word + ".json";
        return this._dictZip.delFile(fileName);
    }
};