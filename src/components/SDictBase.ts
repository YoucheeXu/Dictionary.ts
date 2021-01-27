import { DictBase } from "./DictBase";
import { SQLite } from "./SQLite";

// Words: word, symbol, meaning, sentences, level, familiar, lastdate;
// Words: word, symbol, meaning, sentences;

export class SDictBase extends DictBase {
    private bWritable: boolean = false;
    private dict: SQLite = new SQLite();

    constructor(dictSrc: string) {
        super();
        this.dict.Open(dictSrc);
    }
    public close() {
        this.dict.close();
    }
    public get_parseFun() {
        return "dictHtml";
    }

    // [symbol, meaning, sentences]
    // To-Do: to html
    public async query_word(word: string): Promise<[number, string]> {
        let sql = "select * from Words where word=?";
        let r: any = await this.dict.get(sql, [word]);
        if (r === undefined) {
            return [-1, `${word} not in dict!`];
        }
        else {
            return [1, `${r.Symbol};;${r.Meaning};;${r.Sentences}`];
        }
    }

    public async get_wordsLst(word: string, wdsLst: string[]): Promise<boolean> {
        // let sql = "select word from Words where word like '?%'";
        let sql = `select word from Words where word like '${word}%' limit 100`;

        // let r = await this.dict.all(sql, [word]);
        let r = await this.dict.all(sql);
        r.forEach((row: any) => {
            wdsLst.push(row.Word);
        })

        if (wdsLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }

    public async GetWordsLst(wdsLst: string[], lvl: string): Promise<boolean> {
        let sql = "select Word,Level from Words"
        let r = await this.dict.each(sql, [], function (row: any) {
            console.log("Word: ", row.ID, " Level: ", row.Level);
            if (row.Level != null) {
                let lvlLst = row.Level.split(";");
                if (lvlLst.has(lvl)) {
                    wdsLst.push(row.Word);
                }
            }
        });

        if (r) {
            if (wdsLst.length >= 1) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    public getWritable(): boolean {
        return this.bWritable;
    }

    public del_word(word: string): boolean {
        throw new Error('Method not implemented.');
        let sql = '';
        this.dict.run(sql);
        return true;
    }
};