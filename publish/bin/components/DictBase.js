"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictBase = void 0;
var DictBase = /** @class */ (function () {
    function DictBase(_szName, _szSrcFile) {
        this._szName = _szName;
        this._szSrcFile = _szSrcFile;
        this._download = null;
    }
    Object.defineProperty(DictBase.prototype, "szSrcFile", {
        get: function () {
            return this._szSrcFile;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictBase.prototype, "szName", {
        get: function () {
            return this._szName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DictBase.prototype, "download", {
        get: function () {
            return this._download;
        },
        set: function (download) {
            this._download = download;
        },
        enumerable: false,
        configurable: true
    });
    return DictBase;
}());
exports.DictBase = DictBase;
;
//# sourceMappingURL=DictBase.js.map