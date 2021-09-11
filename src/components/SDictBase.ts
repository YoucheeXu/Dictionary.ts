import { DictBase } from "./DictBase";
import { SQLite } from "./SQLite";

/*
CREATE TABLE [Words](
    [Word] CHAR(255) CONSTRAINT [PrimaryKey] PRIMARY KEY, 
    [Symbol] CHAR(255), 
    [Meaning] CHAR(255), 
    [Sentences] TEXT
);
*/

export class SDictBase extends DictBase {
    private bWritable: boolean = false;
    private dict: SQLite = new SQLite();

    constructor(dictSrc: string) {
        super(dictSrc);
        this.dict.Open(dictSrc);
    }

    public async Close(): Promise<[boolean, string]> {
        try {
            let ret = await this.dict.Close();
            if (ret) {
                return [true, ""];
            }
            else {
                return [false, "Unkown reason"];
            }
        }
        catch (e) {
            return [false, (e as Error).message];
        }
    }

    public get_parseFun() {
        return "dictHtml";
    }

    // [symbol, meaning, sentences]
    // TODO: to html
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