export abstract class DictBase {
    private _download: any = null;

    constructor(readonly _szName: string, readonly _szSrcFile: string) {
    }

    public get szSrcFile() {
        return this._szSrcFile;
    }

    public get szName() {
        return this._szName;
    }

    public set download(download: any) {
        this._download = download;
    }

    public get download() {
        return this._download;
    }

    abstract Open(): void;

    abstract query_word(word: string): Promise<[number, string]>

    abstract get_wordsLst(word: string, wdMatchLst: string[]): any;

    abstract CheckAndAddFile(localFile: string): void;

    abstract del_word(word: string): boolean;

    abstract Close(): Promise<[boolean, string]>;
};