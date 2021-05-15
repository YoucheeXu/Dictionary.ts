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
exports.UsrProgress = void 0;
var console_1 = require("console");
var SQLite_1 = require("./SQLite");
/*
To-Do{
* support create new dict and initialize it
*/
// Words: word, symbol, meaning, sentences, level, familiar, lastdate
// Words: word, level, familiar, lastdate
var UsrProgress = /** @class */ (function () {
    function UsrProgress() {
    }
    UsrProgress.prototype.Open = function (dictSrc, lvl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dataBase = new SQLite_1.SQLite();
                        return [4 /*yield*/, this.dataBase.Open(dictSrc)];
                    case 1:
                        _a.sent();
                        this.level = lvl;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    UsrProgress.prototype.New = function (dictSrc, lvl) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dataBase = new SQLite_1.SQLite();
                        return [4 /*yield*/, this.dataBase.Open(dictSrc)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataBase.run("CREATE TABLE " + lvl + "(word text NOT NULL PRIMARY KEY, familiar REAL, lastdate DATE)")];
                    case 2:
                        r = _a.sent();
                        if (r) {
                            console.log("Table created");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UsrProgress.prototype.ExistTable = function (lvl) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, num;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select count(*) from sqlite_master where type='table' and name = '" + lvl + "'";
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
                        return [2 /*return*/];
                }
            });
        });
    };
    UsrProgress.prototype.NewTable = function (dictSrc, lvl) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // this.dataBase = new SQLite();
                        console_1.assert(this.dataBase);
                        return [4 /*yield*/, this.dataBase.Open(dictSrc)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dataBase.run("CREATE TABLE " + lvl + "(Word text NOT NULL PRIMARY KEY, Familiar REAL, LastDate DATE, NextDate DATE)")];
                    case 2:
                        r = _a.sent();
                        if (r) {
                            this.level = lvl;
                            console.log("Table created");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UsrProgress.prototype.ExistWord = function (wd) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, num;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select count(*) from " + this.level + " where Word = '" + wd + "'";
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
                        return [2 /*return*/];
                }
            });
        });
    };
    UsrProgress.prototype.InsertWord = function (wd) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, sql, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entry = "'" + wd + "', 0";
                        sql = "INSERT INTO " + this.level + " (Word, Familiar) VALUES (" + entry + ")";
                        console.log(sql);
                        return [4 /*yield*/, this.dataBase.run(sql)];
                    case 1:
                        r = _a.sent();
                        if (r) {
                            console.log(wd + " was inserted.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UsrProgress.prototype.GetItem = function (word, item) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, anything;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select " + item + " from " + this.level + " where Word = '" + word + "'";
                        return [4 /*yield*/, this.dataBase.get(sql, [])];
                    case 1:
                        ret = _a.sent();
                        anything = ret[item];
                        if (ret) {
                            return [2 /*return*/, Promise.resolve(anything)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(false)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UsrProgress.prototype.GetLastDate = function (word) {
        return Promise.resolve(this.GetItem(word, "LastDate"));
    };
    UsrProgress.prototype.GetFamiliar = function (word) {
        return Promise.resolve(this.GetItem(word, "Familiar"));
    };
    UsrProgress.prototype.GetCount = function (table, where) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, ret, num;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select count(*) from " + table + " where " + where;
                        return [4 /*yield*/, this.dataBase.get(sql)];
                    case 1:
                        ret = _a.sent();
                        if (ret) {
                            num = ret['count(*)'];
                            return [2 /*return*/, Promise.resolve(num)];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(0)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UsrProgress.prototype.GetAllCount = function (level) {
        // let where = "level = '" + level + "'";
        var where = "Familiar is not null";
        return this.GetCount(level, where);
    };
    UsrProgress.prototype.GetInProgressCount = function (level) {
        // let where = "level = '" + level + "' and familiar > 0";
        var where = "LastDate is not null and cast (Familiar as real) < 10";
        return this.GetCount(level, where);
    };
    UsrProgress.prototype.GetNewCount = function (level) {
        // let where = "level = '" + level + "' and LastDate is null ";
        var where = "LastDate is null and cast (Familiar as real) < 10";
        return this.GetCount(level, where);
    };
    UsrProgress.prototype.GetFnshedCount = function (level) {
        // let where = "level = '" + level + "' and familiar = 10";
        var where = "cast (Familiar as real) >= 10";
        return this.GetCount(level, where);
    };
    UsrProgress.prototype.GetWordsLst = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var wdsLst, familiar, limit, sql, sql, lastlastdate, sql, lastdate, lastlastdate, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        wdsLst = args[0];
                        if (!(args.length == 2)) return [3 /*break*/, 2];
                        // (wdsLst, familiar);
                        familiar = args[1];
                        sql = "select * from " + this.level + " where cast (Familiar as real) = " + String(familiar);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        if (!(args.length == 3)) return [3 /*break*/, 4];
                        // (wdsLst, familiar, limit);
                        familiar = args[1];
                        limit = args[2];
                        sql = "select * from " + this.level + " where cast (Familiar as real) = " + String(familiar) + " limit " + String(limit);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(args.length == 4)) return [3 /*break*/, 6];
                        lastlastdate = args[1];
                        familiar = args[2];
                        limit = args[3];
                        sql = "select * from " + this.level + " where lastdate <= date('" + lastlastdate + "') and cast (Familiar as real) < " + String(familiar);
                        sql += " limit " + String(limit);
                        // this.dataBase.GetWordsLst(wdsLst, where);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 5:
                        // this.dataBase.GetWordsLst(wdsLst, where);
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(args.length == 5)) return [3 /*break*/, 8];
                        lastdate = args[1];
                        lastlastdate = args[2];
                        familiar = args[3];
                        limit = args[4];
                        sql = "select * from " + this.level + " where lastdate <= date('" + lastdate + "') and lastdate >= date('" + lastlastdate + "') and cast (Familiar as real) < " + String(familiar);
                        sql += " limit " + String(limit);
                        // this.dataBase.GetWordsLst(wdsLst, where);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 7:
                        // this.dataBase.GetWordsLst(wdsLst, where);
                        _a.sent();
                        _a.label = 8;
                    case 8:
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
    UsrProgress.prototype.UpdateProgress = function (word, familiar, today) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "update " + this.level + " set Familiar=" + familiar + ", LastDate=date('" + today + "')";
                        sql += " where Word='" + word + "'";
                        return [4 /*yield*/, this.dataBase.run(sql)];
                    case 1: 
                    /*let ret = this.dataBase.run(sql);
            
                    ret.then((changes: number) => {
                        console.info(`${changes} has changed!`);
                    }, (reason) => {
                        console.error(reason as string);
                    })*/
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsrProgress.prototype.GetForgottenWordsLst = function (wdsLst, today) {
        return __awaiter(this, void 0, void 0, function () {
            var familiar, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        familiar = 0;
                        sql = "select * from " + this.level + " where cast (Familiar as real) < " + String(familiar);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 1:
                        _a.sent();
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
    UsrProgress.prototype.GetOvrDueWordsLst = function (wdsLst, today) {
        return __awaiter(this, void 0, void 0, function () {
            var familiar, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        familiar = 10;
                        sql = "select * from " + this.level + " where NextDate < date('" + today + "') and cast (Familiar as real) < " + String(familiar);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 1:
                        _a.sent();
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
    UsrProgress.prototype.GetDueWordsLst = function (wdsLst, today) {
        return __awaiter(this, void 0, void 0, function () {
            var familiar, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        familiar = 10;
                        sql = "select * from " + this.level + " where NextDate = date('" + today + "') and cast (Familiar as real) < " + String(familiar);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 1:
                        _a.sent();
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
    UsrProgress.prototype.GetNewWordsLst = function (wdsLst, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var familiar, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        familiar = 0;
                        sql = "select * from " + this.level + " where LastDate is null and cast (Familiar as real) = " + String(familiar);
                        sql += " limit " + String(limit);
                        return [4 /*yield*/, this.dataBase.each(sql, [], function (row) {
                                wdsLst.push(row);
                            })];
                    case 1:
                        _a.sent();
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
    UsrProgress.prototype.UpdateProgress2 = function (word, familiar, lstDate, nxtDate) {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "update " + this.level + " set Familiar=" + familiar + ", LastDate=date('" + lstDate + "'), NextDate=date('" + nxtDate + "')";
                        sql += " where Word='" + word + "'";
                        console.info(sql);
                        return [4 /*yield*/, this.dataBase.run(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsrProgress.prototype.Close = function () {
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
    return UsrProgress;
}());
exports.UsrProgress = UsrProgress;
;
//# sourceMappingURL=UsrProgress.js.map