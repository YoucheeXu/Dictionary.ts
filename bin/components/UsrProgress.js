"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsrProgress = void 0;
const SQLite_1 = require("./SQLite");
// TODO: support create new dict and initialize it; support to reset level
/*
CREATE TABLE ${Level}(
    Word text NOT NULL PRIMARY KEY,
    Familiar REAL,
    LastDate DATE,
    NextDate DATE
);
*/
class UsrProgress {
    get srcFile() {
        return this._srcFile;
    }
    async Open(srcFile, lvl) {
        this._srcFile = srcFile;
        this.dataBase = new SQLite_1.SQLite();
        await this.dataBase.Open(srcFile);
        this.level = lvl;
        // print("progress of " + srcFile + "is OK to open!");
    }
    ;
    async New(srcFile, lvl) {
        this.dataBase = new SQLite_1.SQLite();
        await this.dataBase.Open(srcFile);
        let r = await this.dataBase.run(`CREATE TABLE ${lvl}(word text NOT NULL PRIMARY KEY, familiar REAL, lastdate DATE)`);
        if (r) {
            console.log("Table created");
        }
    }
    async ExistTable(lvl) {
        let sql = `select count(*) from sqlite_master where type='table' and name = '${lvl}'`;
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
    async NewTable(lvl) {
        let r = await this.dataBase.run(`CREATE TABLE ${lvl}(Word text NOT NULL PRIMARY KEY, Familiar REAL, LastDate DATE, NextDate DATE)`);
        if (r) {
            this.level = lvl;
            console.log("Table created");
        }
    }
    async ExistWord(wd) {
        let sql = `select count(*) from ${this.level} where Word = '${wd}'`;
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
    async InsertWord(wd) {
        let entry = `'${wd}', 0`;
        let sql = `INSERT INTO ${this.level} (Word, Familiar) VALUES (${entry})`;
        console.log(sql);
        let r = await this.dataBase.run(sql);
        if (r) {
            console.log(wd + " was inserted.");
        }
    }
    async DelWord(wd) {
        let sql = `DELETE FROM ${this.level} WHERE Word='${wd}'`;
        try {
            let r = await this.dataBase.run(sql);
            if (r) {
                console.log(wd + " was deleted.");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async GetItem(word, item) {
        // let sql = "select " + item + " from Words where word = '" + word + "'";
        let sql = `select ${item} from ${this.level} where Word = '${word}'`;
        let ret = await this.dataBase.get(sql, []);
        let anything = ret[item];
        if (ret) {
            return Promise.resolve(anything);
        }
        else {
            return Promise.reject(false);
        }
    }
    GetLastDate(word) {
        return Promise.resolve(this.GetItem(word, "LastDate"));
    }
    GetFamiliar(word) {
        return Promise.resolve(this.GetItem(word, "Familiar"));
    }
    async GetCount(table, where) {
        // let sql = "select count(*) from Words where " + where;
        let sql = `select count(*) from ${table} where ${where}`;
        let ret = await this.dataBase.get(sql);
        if (ret) {
            let num = ret['count(*)'];
            return Promise.resolve(num);
        }
        else {
            return Promise.reject(0);
        }
    }
    GetAllCount(level) {
        // let where = "level = '" + level + "'";
        let where = "Familiar is not null";
        return this.GetCount(level, where);
    }
    GetInProgressCount(level) {
        // let where = "level = '" + level + "' and familiar > 0";
        // let where = "LastDate is not null and cast (Familiar as real) < 10";
        let where = "cast (Familiar as real) < 10 and LastDate is not null";
        return this.GetCount(level, where);
    }
    GetNewCount(level) {
        // let where = "level = '" + level + "' and LastDate is null ";
        let where = "LastDate is null and cast (Familiar as real) < 10";
        return this.GetCount(level, where);
    }
    GetFnshedCount(level) {
        // let where = "level = '" + level + "' and familiar = 10";
        let where = "cast (Familiar as real) >= 10";
        return this.GetCount(level, where);
    }
    async GetWordsLst(args) {
        let wdsLst = args[0];
        // let familiar: number = args[-2];
        let familiar;
        let limit;
        // get new words
        if (args.length == 2) {
            // (wdsLst, familiar);
            familiar = args[1];
            // let sql = "select * from Words where level = '" + level + "' and familiar = " + String(familiar);
            let sql = `select * from ${this.level} where cast (Familiar as real) = ${String(familiar)}`;
            await this.dataBase.each(sql, [], (row) => {
                wdsLst.push(row);
            });
        }
        else if (args.length == 3) {
            // (wdsLst, familiar, limit);
            familiar = args[1];
            limit = args[2];
            // let sql = "select word from Words where level = '" + level + "' and familiar <= 0 and familiar >= " + String(familiar) + " limit " + String(limit);
            // let sql = "select * from Words where level = '" + level + "' and familiar = " + String(familiar) + " limit " + String(limit);
            let sql = `select * from ${this.level} where cast (Familiar as real) = ${String(familiar)} limit ${String(limit)}`;
            await this.dataBase.each(sql, [], (row) => {
                wdsLst.push(row);
            });
        }
        // get ancient words
        // get forgotten words
        else if (args.length == 4) {
            // (wdsLst, lastlastdate, familiar, limit);
            let lastlastdate = args[1];
            familiar = args[2];
            limit = args[3];
            // let sql = "select * from Words where level = '" + level + "' and lastdate <= date('" + lastlastdate + "') and familiar < " + String(familiar);
            let sql = `select * from ${this.level} where lastdate <= date('${lastlastdate}') and cast (Familiar as real) < ${String(familiar)}`;
            sql += " limit " + String(limit);
            // this.dataBase.GetWordsLst(wdsLst, where);
            await this.dataBase.each(sql, [], (row) => {
                wdsLst.push(row);
            });
        }
        // get Ebbinghaus Forgetting Curve words
        else if (args.length == 5) {
            // (wdsLst, lastdate, lastlastdate, familiar, limit);
            let lastdate = args[1];
            let lastlastdate = args[2];
            familiar = args[3];
            limit = args[4];
            // let sql = "select * from Words where level = '" + level + "' and lastdate <= date('" + lastdate + "') and lastdate >= date('" + lastlastdate + "') and familiar < " + String(familiar);
            // let sql = "select * from Words where level = '" + level + "' and lastdate <= date('" + lastdate + "') and lastdate >= date('" + lastlastdate + "') and cast (Familiar as real) < " + String(familiar);
            let sql = `select * from ${this.level} where lastdate <= date('${lastdate}') and lastdate >= date('${lastlastdate}') and cast (Familiar as real) < ${String(familiar)}`;
            sql += " limit " + String(limit);
            // this.dataBase.GetWordsLst(wdsLst, where);
            await this.dataBase.each(sql, [], (row) => {
                wdsLst.push(row);
            });
        }
        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    async UpdateProgress(word, familiar, today) {
        // let entry = `'${String(familiar)}','date("${today}")'`;
        // let sql = "update Words(familiar, lastdate) values (" + entry + ")";
        // let sql = `update Words set Familiar=${familiar}, LastDate=date('${today}')`;
        let sql = `update ${this.level} set Familiar=${familiar}, LastDate=date('${today}')`;
        sql += ` where Word='${word}'`;
        /*let ret = this.dataBase.run(sql);

        ret.then((changes: number) => {
            console.info(`${changes} has changed!`);
        }, (reason) => {
            console.error(reason as string);
        })*/
        return await this.dataBase.run(sql);
    }
    async GetForgottenWordsLst(wdsLst) {
        let familiar = 0;
        let sql = `select * from ${this.level} where cast (Familiar as real) < ${String(familiar)}`;
        try {
            await this.dataBase.each(sql, [], (row) => {
                wdsLst.push(row);
            });
            if (wdsLst.length >= 1) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async GetOvrDueWordsLst(wdsLst, today) {
        let familiar = 10;
        let sql = `select * from ${this.level} where NextDate < date('${today}') and cast (Familiar as real) < ${String(familiar)}`;
        await this.dataBase.each(sql, [], (row) => {
            wdsLst.push(row);
        });
        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    async GetDueWordsLst(wdsLst, today) {
        let familiar = 10;
        let sql = `select * from ${this.level} where NextDate = date('${today}') and cast (Familiar as real) < ${String(familiar)}`;
        await this.dataBase.each(sql, [], (row) => {
            wdsLst.push(row);
        });
        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    async GetNewWordsLst(wdsLst, limit) {
        let familiar = 0;
        let sql = `select * from ${this.level} where LastDate is null and cast (Familiar as real) = ${String(familiar)}`;
        sql += " limit " + String(limit);
        await this.dataBase.each(sql, [], (row) => {
            wdsLst.push(row);
        });
        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    async UpdateProgress2(word, familiar, lstDate, nxtDate) {
        let sql = `update ${this.level} set Familiar=${familiar}, LastDate=date('${lstDate}'), NextDate=date('${nxtDate}')`;
        sql += ` where Word='${word}'`;
        console.info(sql);
        return await this.dataBase.run(sql);
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
exports.UsrProgress = UsrProgress;
;
//# sourceMappingURL=UsrProgress.js.map