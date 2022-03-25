"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteDict = void 0;
const SQLite_1 = require("./SQLite");
class SQLiteDict {
    constructor(_szName, _szSrcFile) {
        this._szName = _szName;
        this._szSrcFile = _szSrcFile;
    }
    get szSrcFile() {
        return this._szSrcFile;
    }
    get szName() {
        return this._szName;
    }
    async Open(dictSrc, tabName) {
        this.dataBase = new SQLite_1.SQLite();
        this.tabName = tabName;
        await this.dataBase.Open(dictSrc);
    }
    ;
    async ExistTable(tabName) {
        try {
            let sql = `SELECT COUNT(*) FROM sqlite_master WHERE TYPE = 'table' AND NAME = '${tabName}'`;
            let ret = await this.dataBase.get(sql);
            if (ret) {
                let num = ret['count(*)'];
                if (num >= 1) {
                    return Promise.resolve(true);
                }
                else {
                    return Promise.resolve(false);
                }
            }
            else {
                return Promise.reject(false);
            }
        }
        catch (e) {
            console.error(e);
            return Promise.reject(false);
        }
    }
    async NewTable(tabName, style) {
        try {
            let r = await this.dataBase.run(`CREATE TABLE ${tabName}(${style})`);
            if (r) {
                console.log(`Table ${tabName} created`);
                return Promise.resolve(true);
            }
            else {
                return Promise.resolve(false);
            }
        }
        catch (e) {
            console.error(e);
            return Promise.reject(false);
        }
    }
    async ExistWord(word) {
        let sql = `SELECT COUNT(*) FROM ${this.tabName} WHERE Word = '${word}'`;
        try {
            let ret = await this.dataBase.get(sql);
            if (ret) {
                let num = ret['count(*)'];
                if (num >= 1) {
                    return Promise.resolve(true);
                }
                else {
                    return Promise.resolve(false);
                }
            }
            else {
                return Promise.resolve(false);
            }
        }
        catch (e) {
            console.error(e);
            return Promise.reject(false);
        }
    }
    async InsertItems(word, items, values) {
        // `INSERT INTO ${this.level} (Word, Familiar) VALUES (${entry})`
        let sql = `INSERT INTO ${this.tabName} (${items}) VALUES (${values})`;
        try {
            let r = await this.dataBase.run(sql);
            if (r) {
                console.log(word + " was inserted.");
                return Promise.resolve(true);
            }
            else {
                return Promise.resolve(false);
            }
        }
        catch (e) {
            console.error(e);
            return Promise.reject(false);
        }
    }
    async DelWord(word) {
        let sql = `DELETE FROM ${this.tabName} WHERE Word='${word}'`;
        try {
            let r = await this.dataBase.run(sql);
            if (r) {
                console.log(word + " was deleted.");
                return Promise.resolve(true);
            }
            else {
                return Promise.resolve(false);
            }
        }
        catch (e) {
            console.log(e);
            return Promise.reject(false);
        }
    }
    async GetItem(word, item) {
        let sql = `SELECT ${item} FROM ${this.tabName} WHERE Word = '${word}'`;
        try {
            let ret = await this.dataBase.get(sql, []);
            if (ret) {
                let anything = ret[item];
                return Promise.resolve(anything);
            }
            else {
                return Promise.resolve(false);
            }
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
    async GetItems(word) {
        let sql = `SELECT * FROM ${this.tabName} WHERE Word = '${word}'`;
        try {
            let anything = await this.dataBase.get(sql, []);
            if (anything) {
                return Promise.resolve(anything);
            }
            else {
                return Promise.reject(false);
            }
        }
        catch (e) {
            console.log(e);
            return Promise.reject(false);
        }
    }
    async UpdateItem(word, item, value) {
        let sql = `UPDATE ${this.tabName} SET ${item}=${value}`;
        sql += ` WHERE Word='${word}'`;
        return await this.dataBase.run(sql);
    }
    async UpdateItems(word, itemLst, valueLst) {
        let sql = `UPDATE ${this.tabName} SET `;
        for (let i in itemLst) {
            let item = itemLst[i], value = valueLst[i];
            sql += `${item} = ${value}, `;
        }
        sql += `WHERE Word='${word}'`;
        return await this.dataBase.run(sql);
    }
    async GetCount(tabName, where) {
        let sql = `SELECT COUNT(*) FROM ${tabName} WHERE ${where}`;
        try {
            let ret = await this.dataBase.get(sql);
            if (ret) {
                let num = ret['count(*)'];
                return Promise.resolve(num);
            }
            else {
                return Promise.reject(-1);
            }
        }
        catch (e) {
            console.log(e);
            return Promise.reject(-1);
        }
    }
    async GetWordsLst(wdsLst, lvl) {
        let sql = "select Word,Level from Words";
        try {
            let r = await this.dataBase.each(sql, [], function (row) {
                // console.log("Word: ", row.Word, " Level: ", row.Level);
                if (row.Level != null) {
                    if (row.Level.length > 0) {
                        let lvlLst = row.Level.split(";");
                        let index = lvlLst.indexOf(lvl);
                        if (index != -1) {
                            wdsLst.push(row.Word);
                        }
                    }
                }
            });
            if (r) {
                if (wdsLst.length >= 1) {
                    return Promise.resolve(true);
                }
                else {
                    return Promise.resolve(false);
                }
            }
            else {
                return Promise.reject(false);
            }
        }
        catch (e) {
            console.error(e);
            return Promise.reject(false);
        }
    }
    async Close() {
        try {
            let ret = await this.dataBase.Close();
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
}
exports.SQLiteDict = SQLiteDict;
;
//# sourceMappingURL=SQLiteDict.js.map