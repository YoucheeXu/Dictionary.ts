"use strict";
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
exports.MasterApp = void 0;
// MasterApp.ts
var electron_1 = require("electron");
var path = __importStar(require("path"));
var dictApp_1 = require("./dictApp");
var ReciteWordsApp_1 = require("./ReciteWordsApp");
var globalInterface_1 = require("./utils/globalInterface");
var MasterApp = /** @class */ (function () {
    function MasterApp() {
    }
    Object.defineProperty(MasterApp.prototype, "myApp", {
        get: function () {
            return this._myApp;
        },
        enumerable: false,
        configurable: true
    });
    MasterApp.prototype.WaitForElectronAppReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (electron_1.app.isReady())
                    return [2 /*return*/, Promise.resolve()];
                return [2 /*return*/, new Promise(function (resolve) {
                        var iid = setInterval(function () {
                            if (electron_1.app.isReady()) {
                                clearInterval(iid);
                                resolve(null);
                            }
                        }, 10);
                    })];
            });
        });
    };
    MasterApp.prototype.EnsureSingleInstance = function () {
        // if (this.env_ === 'dev') return false;
        var gotTheLock = electron_1.app.requestSingleInstanceLock();
        if (!gotTheLock) {
            // Another instance is already running - exit
            electron_1.app.quit();
            return true;
        }
        // Someone tried to open a second instance - focus our window instead
        var _this = this;
        electron_1.app.on('second-instance', function () {
            var win = _this._win;
            if (!win)
                return;
            if (win.isMinimized())
                win.restore();
            win.show();
            win.focus();
        });
        return false;
    };
    MasterApp.prototype.Run = function (argvs) {
        return __awaiter(this, void 0, void 0, function () {
            var alreadyRunning, sel, ret, startPath;
            var _this_1 = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Since we are doing other async things before creating the window, we might miss
                    // the "ready" event. So we use the function below to make sure that the app is ready.
                    return [4 /*yield*/, this.WaitForElectronAppReady()];
                    case 1:
                        // Since we are doing other async things before creating the window, we might miss
                        // the "ready" event. So we use the function below to make sure that the app is ready.
                        _a.sent();
                        alreadyRunning = this.EnsureSingleInstance();
                        if (alreadyRunning)
                            return [2 /*return*/];
                        sel = -1;
                        if (!argvs.typ) return [3 /*break*/, 2];
                        if (argvs.typ == "r") {
                            sel = 1;
                        }
                        else if (argvs.typ == "d" || argvs.typ == "c") {
                            sel = 0;
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, electron_1.dialog.showMessageBox({
                            type: "info",
                            message: "Select a application",
                            buttons: ["Dictionary", "ReciteWords"],
                            cancelId: 2 // 点击x号关闭返回值
                        })];
                    case 3:
                        ret = _a.sent();
                        sel = ret.response;
                        _a.label = 4;
                    case 4:
                        startPath = "";
                        // if (process.env.NODE_ENV === 'development') {
                        if (argvs.bDev) {
                            startPath = path.join(process.cwd(), "./");
                        }
                        else {
                            startPath = path.join(process.env.PORTABLE_EXECUTABLE_DIR || process.cwd(), "../");
                        }
                        if (sel == 1) {
                            this._myApp = new ReciteWordsApp_1.ReciteWordsApp(startPath);
                            this._myApp.name = "ReciteWords";
                            globalInterface_1.globalVar.app = this._myApp;
                        }
                        else if (sel == 0) {
                            this._myApp = new dictApp_1.dictApp(startPath);
                            this._myApp.name = "Dictionary";
                            globalInterface_1.globalVar.app = this._myApp;
                        }
                        else {
                            electron_1.app.quit();
                            return [2 /*return*/];
                        }
                        try {
                            this._myApp.Run(argvs);
                        }
                        catch (e) {
                            console.error("ElectronApp fatal error: " + e);
                        }
                        ;
                        electron_1.app.on('before-quit', function () {
                            // this.willQuitApp_ = true;
                        });
                        electron_1.app.on('window-all-closed', function () {
                            electron_1.app.quit();
                        });
                        electron_1.app.on('activate', function () {
                            _this_1._win.show();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return MasterApp;
}());
exports.MasterApp = MasterApp;
//# sourceMappingURL=MasterApp.js.map