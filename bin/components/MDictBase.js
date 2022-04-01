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
exports.MDictBase = void 0;
// MDictBase.ts
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const DictBase_1 = require("./DictBase");
const MdPakage_1 = require("./MdPakage");
const utils_1 = require("../utils/utils");
// read from mdd, mdx
class MDictBase extends DictBase_1.DictBase {
    constructor(name, mdxFile, _passcode) {
        super(name, mdxFile);
        this._passcode = _passcode;
        let filePath = path.dirname(mdxFile);
        let fileName = path.basename(mdxFile, ".mdx");
        let tmpDir = path.join(filePath, fileName);
        this.szTmpDir = tmpDir;
        let _this = this;
        if (fs.existsSync(_this.szTmpDir) == false) {
            fs.mkdir(_this.szTmpDir, function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('Success to create folder: ' + _this.szTmpDir);
            });
        }
        this._mdx = new MdPakage_1.MdPakage(mdxFile, false, "", this._passcode);
        let mddFile = path.join(filePath, fileName + ".mdd");
        if (fs.existsSync(mddFile) == true) {
            // this._mdd = new MdPakage(mddFile, true, "GB18030", this._passcode);
            this._mdd = new MdPakage_1.MdPakage(mddFile, true, "UTF-16", this._passcode);
        }
    }
    async Open() {
        await this._mdx.Open();
        if (this._mdd) {
            await this._mdd.Open();
        }
    }
    async query_word(word) {
        let datum;
        let ret = false;
        let dictFile = path.join(this.szTmpDir, word + ".html");
        let retNum = -1;
        let errMsg = '';
        if (fs.existsSync(dictFile) == true) {
            return Promise.resolve([1, dictFile]);
        }
        else if (this._mdx.bRecordIn(word)) {
            try {
                [ret, datum] = await this._mdx.ReadRecord(word);
                if (ret) {
                    let html = "<!DOCTYPE html><html><body>" + datum + "</body></html>";
                    fs.writeFileSync(dictFile, html);
                }
                else {
                    retNum = -1;
                    errMsg = `Fail to read ${word} in ${this._szName}.mdx`;
                }
                // let regEx = /src="google-toggle.js" | href="google.css"/g;
                let regexp = /href="(.+?)"/g;
                const matches = datum.matchAll(regexp);
                let srcFile = "";
                for (const match of matches) {
                    let src = "\\" + match[1];
                    if (this._mdd.bRecordIn(src)) {
                        [ret, datum] = await this._mdd.ReadRecord(src);
                        if (ret) {
                            srcFile = path.join(this.szTmpDir, src);
                            fs.writeFileSync(srcFile, datum);
                        }
                        else {
                            retNum = -1;
                            errMsg = `Fail to read ${src} in ${this._szName}.mdd`;
                        }
                    }
                    else {
                        retNum = -1;
                        errMsg = `There is no ${src} in ${this._szName}.mdd`;
                    }
                }
                return Promise.resolve([1, dictFile]);
            }
            catch (e) {
                if (fs.existsSync(dictFile)) {
                    fs.unlinkSync(dictFile);
                }
                retNum = -1;
                errMsg = e.message.replace("<", "").replace(">", "");
            }
        }
        else {
            retNum = -1;
            errMsg = `${word} isn't in ${this._szName}`;
        }
        return Promise.resolve([retNum, errMsg]);
    }
    get_wordsLst(word, wdMatchLst) {
        let wordLike = "^" + word + ".*";
        this._mdx.searchFile(wordLike, wdMatchLst, 100);
        if (wdMatchLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    CheckAndAddFile(localFile) {
        throw new Error("Don't support to add record: " + localFile);
        return;
    }
    del_word(word) {
        throw new Error("Don't support to delete word: " + word);
        return false;
    }
    async Close() {
        let ret1 = true;
        let msg1 = "";
        let ret2 = true;
        let msg2 = "";
        let ret3 = true;
        let msg3 = "";
        [ret1, msg1] = await this._mdx.Close();
        if (this._mdd) {
            [ret2, msg2] = await this._mdd.Close();
        }
        (0, utils_1.RemoveDir)(this.szTmpDir);
        if (fs.existsSync(this.szTmpDir) == false) {
            msg3 = `OK to remove ${this.szTmpDir}`;
        }
        else {
            msg3 = `Fail to remove ${this.szTmpDir}`;
            ret3 = false;
        }
        let ret = ret1 && ret2 && ret3;
        let msg = `${msg1}; ${msg2}; ${msg3}`;
        return [ret, msg];
    }
}
exports.MDictBase = MDictBase;
;
//# sourceMappingURL=MDictBase.js.map