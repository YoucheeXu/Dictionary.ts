export abstract class DictBase {
    private dictSrc: string;
    constructor(dictSrc: string) {
        this.dictSrc = dictSrc;
    }
    GetName(): string {
        return this.dictSrc;
    }
    abstract get_parseFun(): string;

    abstract query_word(word: string): Promise<[number, string]>

    abstract get_wordsLst(word: string, wdMatchLst: string[]): any;

    abstract getWritable(): boolean;

    abstract del_word(word: string): boolean;

    abstract Close(): Promise<[boolean, string]>;
};