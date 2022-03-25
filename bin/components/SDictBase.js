"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDictBase = void 0;
// SDictBase.ts
const DictBase_1 = require("./DictBase");
const SQLite_1 = require("./SQLite");
/*
CREATE TABLE [Words](
    [Word] CHAR(255) CONSTRAINT [PrimaryKey] PRIMARY KEY,
    [Symbol] CHAR(255),
    [Meaning] CHAR(255),
    [Sentences] TEXT
);
*/
class SDictBase extends DictBase_1.DictBase {
    constructor(name, srcFile) {
        super(name, srcFile);
        this._dict = new SQLite_1.SQLite();
    }
    async Open() {
        this._dict.Open(this._szSrcFile);
    }
    async Close() {
        try {
            let ret = await this._dict.Close();
            if (ret) {
                return [true, ""];
            }
            else {
                return [false, "Unkown reason"];
            }
        }
        catch (e) {
            return [false, e.message];
        }
    }
    // [symbol, meaning, sentences]
    // TODO: to html
    async query_word(word) {
        let sql = "select * from Words where word=?";
        try {
            let r = await this._dict.get(sql, [word]);
            if (r === undefined) {
                return [-1, `${word} not in dict!`];
            }
            else {
                return [1, `${r.Symbol};;${r.Meaning};;${r.Sentences}`];
            }
        }
        catch (e) {
            let errMsg = e.message;
            return [-1, errMsg];
        }
    }
    async get_wordsLst(word, wdsLst) {
        // let sql = "select word from Words where word like '?%'";
        let sql = `select word from Words where word like '${word}%' limit 100`;
        // let r = await this._dict.all(sql, [word]);
        let r = await this._dict.all(sql);
        r.forEach((row) => {
            wdsLst.push(row.Word);
        });
        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    del_word(word) {
        throw new Error(`del_word of ${this.szName} not implemented.`);
        let sql = '';
        this._dict.run(sql);
        return true;
    }
    CheckAndAddFile(localFile) {
        throw new Error(`CheckAndAddFile of ${this.szName} not implemented.`);
    }
    ;
}
exports.SDictBase = SDictBase;
;
//# sourceMappingURL=SDictBase.js.map