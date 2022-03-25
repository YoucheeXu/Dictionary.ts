"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordsDict = void 0;
// WordsDict.ts
const SQLiteDict_1 = require("./SQLiteDict");
/*
CREATE TABLE [Words](
    [Word] CHAR(255) CONSTRAINT [PrimaryKey] PRIMARY KEY,
    [USSymbol] CHAR(255),
    [UKSymbol] CHAR(255),
    [Level] CHAR(255),
    [Stars] TINYINT
);
*/
class WordsDict extends SQLiteDict_1.SQLiteDict {
    async Open() {
        super.Open(this._szSrcFile, "Words");
    }
    async GetLevel(word) {
        let ret = await super.GetItem(word, "Level");
        if (ret) {
            return ret;
        }
        else {
            if (typeof (ret) != "undefined" && ret != 0) {
                console.log(`${word} has no Level`);
            }
            else {
                console.log(`no ${word}`);
            }
            return "";
        }
    }
    async SetLevel(word, level) {
        return super.UpdateItem(word, "Level", level);
    }
    async GetStar(word) {
        let ret = await super.GetItem(word, "Stars");
        if (ret) {
            return ret;
        }
        else {
            if (typeof (ret) != "undefined" && ret != 0) {
                console.log(`${word} has no Star`);
            }
            else {
                console.log(`no ${word}`);
            }
            return 0;
        }
    }
    async SetStar(word, star) {
        return super.UpdateItem(word, "Stars", star);
    }
}
exports.WordsDict = WordsDict;
//# sourceMappingURL=WordsDict.js.map