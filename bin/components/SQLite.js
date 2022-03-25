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
const sqlite3 = __importStar(require("sqlite3"));
// const sqlite3 = require('sqlite3').verbose()
class SQLite {
    Open(path) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.db = new sqlite3.Database(path, (err) => {
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
    }
    // any query: insert/delete/update
    // run(sql: string, params: any, callback?: (this: RunResult, err: Error | null) => void): this;
    // run(sql: string, callback?: (this: RunResult, err: Error | null) => void): this;
    run(query) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.db.run(query, (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err.message);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    // first row read
    get(query, params) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row);
                }
            });
        });
    }
    // set of rows read
    all(query, params) {
        let _this = this;
        return new Promise((resolve, reject) => {
            if (params === undefined)
                params = [];
            _this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject("Read error: " + err.message);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }
    // each row returned one by one
    // each(sql: string, params: any, callback?: (this: Statement, err: Error | null, row: any) => void, complete?: (err: Error | null, count: number) => void): this;
    each(query, params, action) {
        let db = this.db;
        // console.log(query);
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.each(query, params, (err, row) => {
                    if (err) {
                        reject("Read error: " + err.message);
                    }
                    else {
                        if (row && action != undefined) {
                            action(row);
                        }
                    }
                });
                db.get("", (err, row) => {
                    resolve(true);
                });
            });
        });
    }
    Close() {
        let db = this.db;
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
}
exports.SQLite = SQLite;
;
//# sourceMappingURL=SQLite.js.map