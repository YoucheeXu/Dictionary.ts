"use strict";
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
exports.SQLiteDict = void 0;
var SQLite_1 = require("./SQLite");
var SQLiteDict = /** @class */ (function () {
    function SQLiteDict() {
    }
    SQLiteDict.prototype.Open = function (dictSrc, tabName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dataBase = new SQLite_1.SQLite();
                        this.tabName = tabName;
                        return [4 /*yield*/, this.dataBase.Open(dictSrc)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SQLiteDict.prototype.ExistTable = function (tabName) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, num, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        sql = "SELECT COUNT(*) FROM sqlite_master WHERE TYPE = 'table' AND NAME = '" + tabName + "'";
                        return [4 /*yield*/, this.dataBase.get(sql)];
                    case 1:
                        ret = _a.sent();
                        if (ret) {
                            num = ret['count(*)'];
                            if (num >= 1) {
                                return [2 /*return*/, Promise.resolve(true)];
                            }
                            else {
                                return [2 /*return*/, Promise.resolve(false)];
                            }
                        }
                        else {
                            return [2 /*return*/, Promise.reject(false)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [2 /*return*/, Promise.reject(false)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.NewTable = function (tabName, style) {
        return __awaiter(this, void 0, void 0, function () {
            var r, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dataBase.run("CREATE TABLE " + tabName + "(" + style + ")")];
                    case 1:
                        r = _a.sent();
                        if (r) {
                            console.log("Table " + tabName + " created");
                            return [2 /*return*/, Promise.resolve(true)];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [2 /*return*/, Promise.reject(false)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.ExistWord = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, num, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT COUNT(*) FROM " + this.tabName + " WHERE Word = '" + word + "'";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataBase.get(sql)];
                    case 2:
                        ret = _a.sent();
                        if (ret) {
                            num = ret['count(*)'];
                            if (num >= 1) {
                                return [2 /*return*/, Promise.resolve(true)];
                            }
                            else {
                                return [2 /*return*/, Promise.resolve(false)];
                            }
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [2 /*return*/, Promise.reject(false)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.InsertItems = function (word, items, values) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, r, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "INSERT INTO " + this.tabName + " (" + items + ") VALUES (" + values + ")";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataBase.run(sql)];
                    case 2:
                        r = _a.sent();
                        if (r) {
                            console.log(word + " was inserted.");
                            return [2 /*return*/, Promise.resolve(true)];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        console.error(e_4);
                        return [2 /*return*/, Promise.reject(false)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.DelWord = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, r, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "DELETE FROM " + this.tabName + " WHERE Word='" + word + "'";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataBase.run(sql)];
                    case 2:
                        r = _a.sent();
                        if (r) {
                            console.log(word + " was deleted.");
                            return [2 /*return*/, Promise.resolve(true)];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        console.log(e_5);
                        return [2 /*return*/, Promise.reject(false)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.GetItem = function (word, item) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, anything, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT " + item + " FROM " + this.tabName + " WHERE Word = '" + word + "'";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataBase.get(sql, [])];
                    case 2:
                        ret = _a.sent();
                        if (ret) {
                            anything = ret[item];
                            return [2 /*return*/, Promise.resolve(anything)];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_6 = _a.sent();
                        console.log(e_6);
                        return [2 /*return*/, Promise.reject(false)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.GetItems = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, anything, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT * FROM " + this.tabName + " WHERE Word = '" + word + "'";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataBase.get(sql, [])];
                    case 2:
                        anything = _a.sent();
                        if (anything) {
                            return [2 /*return*/, Promise.resolve(anything)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(false)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_7 = _a.sent();
                        console.log(e_7);
                        return [2 /*return*/, Promise.reject(false)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.UpdateItem = function (word, item, value) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "UPDATE " + this.tabName + " SET " + item + "=" + value;
                        sql += " WHERE Word='" + word + "'";
                        return [4 /*yield*/, this.dataBase.run(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SQLiteDict.prototype.UpdateItems = function (word, itemLst, valueLst) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, i, item, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "UPDATE " + this.tabName + " SET ";
                        for (i in itemLst) {
                            item = itemLst[i], value = valueLst[i];
                            sql += item + " = " + value + ", ";
                        }
                        sql += "WHERE Word='" + word + "'";
                        return [4 /*yield*/, this.dataBase.run(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SQLiteDict.prototype.GetCount = function (tabName, where) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, num, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "SELECT COUNT(*) FROM " + tabName + " WHERE " + where;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataBase.get(sql)];
                    case 2:
                        ret = _a.sent();
                        if (ret) {
                            num = ret['count(*)'];
                            return [2 /*return*/, Promise.resolve(num)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(-1)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_8 = _a.sent();
                        console.log(e_8);
                        return [2 /*return*/, Promise.reject(-1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.GetWordsLst = function (wdsLst, lvl) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, r, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select Word,Level from Words";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                // console.log("Word: ", row.Word, " Level: ", row.Level);
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
                    case 2:
                        r = _a.sent();
                        if (r) {
                            if (wdsLst.length >= 1) {
                                return [2 /*return*/, Promise.resolve(true)];
                            }
                            else {
                                return [2 /*return*/, Promise.resolve(false)];
                            }
                        }
                        else {
                            return [2 /*return*/, Promise.reject(false)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_9 = _a.sent();
                        console.error(e_9);
                        return [2 /*return*/, Promise.reject(false)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SQLiteDict.prototype.Close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataBase.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return SQLiteDict;
}());
exports.SQLiteDict = SQLiteDict;
;
//# sourceMappingURL=SQLiteDict.js.map