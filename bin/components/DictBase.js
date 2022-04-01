"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictBase = void 0;
class DictBase {
    constructor(_szName, _szSrcFile) {
        this._szName = _szName;
        this._szSrcFile = _szSrcFile;
        this._download = null;
    }
    get szSrcFile() {
        return this._szSrcFile;
    }
    get szName() {
        return this._szName;
    }
    set szTmpDir(tmpDir) {
        this._szTmpDir = tmpDir;
    }
    get szTmpDir() {
        return this._szTmpDir;
    }
    set download(download) {
        this._download = download;
    }
    get download() {
        return this._download;
    }
}
exports.DictBase = DictBase;
;
//# sourceMappingURL=DictBase.js.map