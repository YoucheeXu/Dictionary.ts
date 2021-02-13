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

    public async InsertWord(wd: string) {
        let entry = `'${wd}', 0`;
        let sql = `INSERT INTO ${this.level}(word, familiar) VALUES (${entry})`;
        let r = await this.dataBase.run(sql)
        if (r) {
            console.log("Inserted.");
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
        if (args.length == 2) {
            // (wdsLst, familiar);
            familiar = args[1];
            // let sql = "select * from Words where level = '" + level + "' and familiar = " + String(familiar);
            let sql = `select * from ${this.level} where familiar = ${String(familiar)}`;
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
            let sql = `select * from ${this.level} where familiar = ${String(familiar)} limit ${String(limit)}`;
            await this.dataBase.each(sql, [], (row: any) => {
                wdsLst.push(row);
            });
        }
        else if (args.length == 4) {
            // (wdsLst, lastlastdate, familiar, limit);
            let lastlastdate = args[1];
            familiar = args[2];
            limit = args[3];
            // let sql = "select * from Words where level = '" + level + "' and lastdate <= date('" + lastlastdate + "') and familiar < " + String(familiar);
            let sql = `select * from ${this.level} where lastdate <= date('${lastlastdate}') and familiar < ${String(familiar)}`;
            sql += " limit " + String(limit);

            // this.dataBase.GetWordsLst(wdsLst, where);
            await this.dataBase.each(sql, [], (row: any) => {
                wdsLst.push(row);
            });
        }
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

    /*public async GetWordsLst0(args: any[]) {
        let wdsLst: string[] = args[0];
        let level: string = args[1];
        // let familiar: number = args[-2];
        let familiar: number;
        let limit: number;
        if (args.length == 3) {
            // (wdsLst, level, familiar);
            familiar = args[2];
            let sql = "select word from Words where level = '" + level + "' and familiar = " + String(familiar);
            await this.dataBase.each(sql, [], (row: any) => {
                wdsLst.push(row.Word);
            });
        }
        else if (args.length == 4) {
            // (wdsLst, level, familiar, limit);
            familiar = args[2];
            limit = args[3];
            // let sql = "select word from Words where level = '" + level + "' and familiar <= 0 and familiar >= " + String(familiar) + " limit " + String(limit);
            let sql = "select word from Words where level = '" + level + "' and familiar = " + String(familiar) + " limit " + String(limit);
            await this.dataBase.each(sql, [], (row: any) => {
                wdsLst.push(row.Word);
            });
        }
        else if (args.length == 6) {
            // (wdsLst, level, lastdate, lastlastdate, familiar, limit);
            let lastdate = args[2];
            let lastlastdate = args[3];
            familiar = args[4];
            limit = args[5];

            let sql = "select word from Words where level = '" + level + "' and lastdate <= date('" + lastdate + "') and lastdate >= date('" + lastlastdate + "') and familiar < " + String(familiar);
            sql += " order by familiar limit " + String(limit);

            // this.dataBase.GetWordsLst(wdsLst, where);
            await this.dataBase.each(sql, [], (row: any) => {
                wdsLst.push(row.Word);
            });
        }
        else if (args.length == 5) {
            // (wdsLst, level, lastlastdate, familiar, limit);
            let lastlastdate = args[2];
            familiar = args[3];
            limit = args[4];
            let sql = "select word from Words where level = '" + level + "' and lastdate <= date('" + lastlastdate + "') and familiar < " + String(familiar);
            sql += " order by familiar limit " + String(limit);

            // this.dataBase.GetWordsLst(wdsLst, where);
            await this.dataBase.each(sql, [], (row: any) => {
                wdsLst.push(row.Word);
            });
        }
        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }*/

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

    public async Close() {
        await this.dataBase.close();
    };
};