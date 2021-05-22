"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDictBase = void 0;
var DictBase_1 = require("./DictBase");
var SQLite_1 = require("./SQLite");
// Words: word, symbol, meaning, sentences, level, familiar, lastdate;
// Words: word, symbol, meaning, sentences;
var SDictBase = /** @class */ (function (_super) {
    __extends(SDictBase, _super);
    function SDictBase(dictSrc) {
        var _this = _super.call(this) || this;
        _this.bWritable = false;
        _this.dict = new SQLite_1.SQLite();
        _this.dict.Open(dictSrc);
        return _this;
    }
    SDictBase.prototype.close = function () {
        this.dict.close();
    };
    SDictBase.prototype.get_parseFun = function () {
        return "dictHtml";
    };
    // [symbol, meaning, sentences]
    // To-Do: to html
    SDictBase.prototype.query_word = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select * from Words where word=?";
                        return [4 /*yield*/, this.dict.get(sql, [word])];
                    case 1:
                        r = _a.sent();
                        if (r === undefined) {
                            return [2 /*return*/, [-1, word + " not in dict!"]];
                        }
                        else {
                            return [2 /*return*/, [1, r.Symbol + ";;" + r.Meaning + ";;" + r.Sentences]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SDictBase.prototype.get_wordsLst = function (word, wdsLst) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select word from Words where word like '" + word + "%' limit 100";
                        return [4 /*yield*/, this.dict.all(sql)];
                    case 1:
                        r = _a.sent();
                        r.forEach(function (row) {
                            wdsLst.push(row.Word);
                        });
                        if (wdsLst.length >= 1) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SDictBase.prototype.GetWordsLst = function (wdsLst, lvl) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select Word,Level from Words";
                        return [4 /*yield*/, this.dict.each(sql, [], function (row) {
                                console.log("Word: ", row.Word, " Level: ", row.Level);
                                if (row.Level != null) {
                                    if (row.Level.length > 0) {
                                        var lvlLst = row.Level.split(";");
                                        var index = lvlLst.indexOf(lvl);
                                        if (index != -1) {
                                            wdsLst.push(row.Word);
                                        }
                                    }
                                }
                            })];
                    case 1:
                        r = _a.sent();
                        if (r) {
                            if (wdsLst.length >= 1) {
                                return [2 /*return*/, true];
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SDictBase.prototype.getWritable = function () {
        return this.bWritable;
    };
    SDictBase.prototype.del_word = function (word) {
        throw new Error('Method not implemented.');
        var sql = '';
        this.dict.run(sql);
        return true;
    };
    return SDictBase;
}(DictBase_1.DictBase));
exports.SDictBase = SDictBase;
;
//# sourceMappingURL=SDictBase.js.map