import { assert } from "console";
import { SQLite } from "./SQLite";

/*
To-Do{
* support create new dict and initialize it
*/

// Words: word, symbol, meaning, sentences, level, familiar, lastdate
// Words: word, level, familiar, lastdate

export class UsrProgress {
    private dataBase: SQLite;
    private level: string;

    public async Open(dictSrc: string, lvl: string) {
        this.dataBase = new SQLite();
        await this.dataBase.Open(dictSrc);
        this.level = lvl;
        // print("progress of " + dictSrc + "is OK to open!");
    };

    public async New(dictSrc: string, lvl: string) {
        this.dataBase = new SQLite();
        await this.dataBase.Open(dictSrc);
        let r = await this.dataBase.run(`CREATE TABLE ${lvl}(word text NOT NULL PRIMARY KEY, familiar REAL, lastdate DATE)`);
        if (r) {
            console.log("Table created");
        }
    }

    public async ExistTable(lvl: string) {

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

    public async NewTable(lvl: string) {
        let r = await this.dataBase.run(`CREATE TABLE ${lvl}(Word text NOT NULL PRIMARY KEY, Familiar REAL, LastDate DATE, NextDate DATE)`);
        if (r) {
            this.level = lvl;
            console.log("Table created");
        }
    }

    public async ExistWord(wd: string) {
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

    public async InsertWord(wd: string) {
        let entry = `'${wd}', 0`;
        let sql = `INSERT INTO ${this.level} (Word, Familiar) VALUES (${entry})`;
        console.log(sql);
        let r = await this.dataBase.run(sql)
        if (r) {
            console.log(wd + " was inserted.");
        }
    }

    public async DelWord(wd: string) {
        let sql = `DELETE FROM ${this.level} WHERE Word='${wd}'`;
        try {
            let r = await this.dataBase.run(sql)
            if (r) {
                console.log(wd + " was deleted.");
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async GetItem(word: string, item: string): Promise<any> {
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

    public GetLastDate(word: string): Promise<Date> {
        return Promise.resolve<Date>(this.GetItem(word, "LastDate"));
    }

    public GetFamiliar(word: string): Promise<number> {
        return Promise.resolve<number>(this.GetItem(word, "Familiar"));
    }

    public async GetCount(table: string, where: string): Promise<number> {
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

    public GetAllCount(level: string): Promise<number> {
        // let where = "level = '" + level + "'";
        let where = "Familiar is not null";
        return this.GetCount(level, where);
    }
    public GetInProgressCount(level: string): Promise<number> {
        // let where = "level = '" + level + "' and familiar > 0";
        let where = "LastDate is not null and cast (Familiar as real) < 10";
        return this.GetCount(level, where);
    }
    public GetNewCount(level: string): Promise<number> {
        // let where = "level = '" + level + "' and LastDate is null ";
        let where = "LastDate is null and cast (Familiar as real) < 10";
        return this.GetCount(level, where);
    }
    public GetFnshedCount(level: string): Promise<number> {
        // let where = "level = '" + level + "' and familiar = 10";
        let where = "cast (Familiar as real) >= 10";
        return this.GetCount(level, where);
    }

    public async GetWordsLst(args: any[]) {
        let wdsLst: string[] = args[0];
        // let familiar: number = args[-2];
        let familiar: number;
        let limit: number;
        // get new words
        if (args.length == 2) {
            // (wdsLst, familiar);
            familiar = args[1];
            // let sql = "select * from Words where level = '" + level + "' and familiar = " + String(familiar);
            let sql = `select * from ${this.level} where cast (Familiar as real) = ${String(familiar)}`;
            await this.dataBase.each(sql, [], (row: any) => {
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
            await this.dataBase.each(sql, [], (row: any) => {
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
            await this.dataBase.each(sql, [], (row: any) => {
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
            await this.dataBase.each(sql, [], (row: any) => {
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

    public async UpdateProgress(word: string, familiar: number, today: string): Promise<boolean> {
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


    public async GetForgottenWordsLst(wdsLst: string[], today: string) {

        let familiar = 0;

        let sql = `select * from ${this.level} where cast (Familiar as real) < ${String(familiar)}`;

        await this.dataBase.each(sql, [], (row: any) => {
            wdsLst.push(row);
        });

        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }

    public async GetOvrDueWordsLst(wdsLst: string[], today: string) {

        let familiar = 10;

        let sql = `select * from ${this.level} where NextDate < date('${today}') and cast (Familiar as real) < ${String(familiar)}`;

        await this.dataBase.each(sql, [], (row: any) => {
            wdsLst.push(row);
        });

        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }

    public async GetDueWordsLst(wdsLst: string[], today: string) {

        let familiar = 10;

        let sql = `select * from ${this.level} where NextDate = date('${today}') and cast (Familiar as real) < ${String(familiar)}`;

        await this.dataBase.each(sql, [], (row: any) => {
            wdsLst.push(row);
        });

        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }

    public async GetNewWordsLst(wdsLst: string[], limit: number) {

        let familiar = 0;

        let sql = `select * from ${this.level} where LastDate is null and cast (Familiar as real) = ${String(familiar)}`;
        sql += " limit " + String(limit);

        await this.dataBase.each(sql, [], (row: any) => {
            wdsLst.push(row);
        });

        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }

    public async UpdateProgress2(word: string, familiar: number, lstDate: string, nxtDate: string): Promise<boolean> {
        let sql = `update ${this.level} set Familiar=${familiar}, LastDate=date('${lstDate}'), NextDate=date('${nxtDate}')`;
        sql += ` where Word='${word}'`;
        console.info(sql);

        return await this.dataBase.run(sql);
    }

    public async Close() {
        await this.dataBase.close();
    };
};