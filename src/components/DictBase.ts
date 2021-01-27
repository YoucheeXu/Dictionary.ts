export abstract class DictBase {
    // abstract get_parseFun(fun: string): void;
    abstract get_parseFun(): string;

    // abstract query_word(word: string, datum: string): boolean;
    // abstract query_word(word: string): [boolean, string];
    abstract query_word(word: string): Promise<[number, string]>

    abstract get_wordsLst(word: string, wdMatchLst: string[]): any;

    abstract getWritable(): boolean;

    abstract del_word(word: string): boolean;

    abstract close(): void;
};