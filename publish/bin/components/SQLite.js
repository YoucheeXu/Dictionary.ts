"use strict";
// import { sqlite3 } from "sqlite3";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLite = void 0;
var sqlite3 = __importStar(require("sqlite3"));
// const sqlite3 = require('sqlite3').verbose()
var SQLite = /** @class */ (function () {
    function SQLite() {
    }
    SQLite.prototype.Open = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db = new sqlite3.Database(path, function (err) {
                if (err) {
                    console.error("Open error: " + err.message);
                    reject("Open error: " + err.message);
                }
                else {
                    // console.log(path + " opened");
                    resolve(path + " opened");
                }
            });
        });
    };
    // any query: insert/delete/update
    // run(sql: string, params: any, callback?: (this: RunResult, err: Error | null) => void): this;
    // run(sql: string, callback?: (this: RunResult, err: Error | null) => void): this;
    SQLite.prototype.run = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.run(query, function (err) {
                if (err) {
                    console.error(err.message);
                    reject(err.message);
                }
                else {
                    resolve(true);
                }
            });
        });
    };
    // first row read
    SQLite.prototype.get = function (query, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.get(query, params, function (err, row) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
    };
    // set of rows read
    SQLite.prototype.all = function (query, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (params === undefined)
                params = [];
            _this.db.all(query, params, function (err, rows) {
                if (err) {
                    reject("Read error: " + err.message);
                }
                else {
                    resolve(rows);
                }
            });
        });
    };
    // each row returned one by one
    // each(sql: string, params: any, callback?: (this: Statement, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
    SQLite.prototype.each = function (query, params, action) {
        var db = this.db;
        // console.log(query);
        return new Promise(function (resolve, reject) {
            db.serialize(function () {
                db.each(query, params, function (err, row) {
                    if (err) {
                        reject("Read error: " + err.message);
                    }
                    else {
                        if (row && action != undefined) {
                            action(row);
                        }
                    }
                });
                db.get("", function (err, row) {
                    resolve(true);
                });
            });
        });
    };
    SQLite.prototype.Close = function () {
        var db = this.db;
        return new Promise(function (resolve, reject) {
            db.close(function (err) {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve(true);
                }
            });
        });
    };
    return SQLite;
}());
exports.SQLite = SQLite;
;
//# sourceMappingURL=SQLite.js.map