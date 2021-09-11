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
exports.AuidoArchive = void 0;
// AuidoArchive.ts
// import { fs, path } from "electron";
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var utils_1 = require("../utils/utils");
var ZipArchive_1 = require("./ZipArchive");
var globalInterface_1 = require("../utils/globalInterface");
var AuidoArchive = /** @class */ (function () {
    function AuidoArchive(audioSrc, compression, compresslevel) {
        this.audioSrc = audioSrc;
        this.compression = compression;
        this.compresslevel = compresslevel;
        this.bWritable = false;
        this.szAudioArchive = path.basename(audioSrc);
        // console.log(this.szAudioArchive);
        var filePath = path.dirname(audioSrc);
        var fileName = path.basename(audioSrc, ".zip");
        // console.log(fileName);
        this.tempAudioDir = path.join(filePath, fileName);
        // console.log(this.tempAudioDir);
        var _this = this;
        if (fs.existsSync(_this.tempAudioDir) == false) {
            fs.mkdir(_this.tempAudioDir, function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('Success to create folder: ' + _this.tempAudioDir);
            });
        }
        // gLogger.info("tempAudioDir: " + this.tempAudioDir);
        this.audioZip = new ZipArchive_1.ZipArchive(audioSrc, compression, compresslevel);
    }
    AuidoArchive.prototype.GetName = function () {
        return this.szAudioArchive;
    };
    AuidoArchive.prototype.Close = function () {
        utils_1.RemoveDir(this.tempAudioDir);
        if (fs.existsSync(this.tempAudioDir) == false) {
            return [true, "; OK to remove " + this.tempAudioDir];
        }
        else {
            return [false, "; Fail to remove " + this.tempAudioDir];
        }
    };
    AuidoArchive.prototype.query_audio = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName, audioFile, ret, audio, audioURL, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fileName = word[0] + "/" + word + ".mp3";
                        audioFile = path.join(this.tempAudioDir, word + ".mp3");
                        ret = false;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        if (!(fs.existsSync(audioFile) == true)) return [3 /*break*/, 2];
                        return [2 /*return*/, Promise.resolve([1, audioFile])];
                    case 2:
                        if (!this.audioZip.bFileIn(fileName)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.audioZip.readFileAsync(fileName)];
                    case 3:
                        _a = _b.sent(), ret = _a[0], audio = _a[1];
                        if (ret) {
                            try {
                                fs.writeFileSync(audioFile, audio);
                            }
                            catch (e) {
                                return [2 /*return*/, Promise.resolve([-1, e.message])];
                            }
                            return [2 /*return*/, Promise.resolve([1, audioFile])];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve([-1, "Fail to read " + word + " in " + this.szAudioArchive + "!"])];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        if (this.bWritable) {
                            audioURL = "https://ssl.gstatic.com/dictionary/static/sounds/oxford/" + word + "--_us_1.mp3";
                            globalInterface_1.globalVar.dQueue.AddQueue(audioURL, audioFile, this, this.notify);
                            audioFile = "audio of " + word + " is downloading.";
                            return [2 /*return*/, Promise.resolve([0, audioFile])];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve([-1, "no audio of " + word + " in " + this.szAudioArchive])];
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        return [2 /*return*/, Promise.resolve([-1, e_1.message])];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AuidoArchive.prototype.notify = function (name, progress, state, why) {
        var gApp = globalInterface_1.globalVar.app;
        console.log((progress * 100).toFixed(2) + "% of " + name + " was " + state + " to download!");
        var word = path.basename(name, ".mp3");
        switch (state) {
            case 'ongoing':
                break;
            case 'fail':
                gApp.info(-1, 2, word, "Fail to download audio of " + word);
                break;
            case 'done':
                this.checkAndAddFile(name);
                break;
        }
    };
    AuidoArchive.prototype.checkAndAddFile = function (audioFile) {
        var word = path.basename(audioFile, ".mp3");
        var fileName = word[0] + "/" + word + ".mp3";
        var _this = this;
        var gApp = globalInterface_1.globalVar.app;
        if (fs.existsSync(audioFile)) {
            var audio = fs.readFileSync(audioFile);
            fs.unlink(audioFile, function () { });
            _this.audioZip.addFile(fileName, audio);
            // return gApp.info(1, 2, word, "OK to download audio of " + word);
            return gApp.info(1, 2, word, audioFile);
        }
        else {
            console.log(audioFile + " doesn't exist");
            return gApp.info(-1, 2, word, "Fail to download audio of " + word);
        }
    };
    AuidoArchive.prototype.getWritable = function () {
        return this.bWritable;
    };
    AuidoArchive.prototype.del_audio = function (word) {
        var fileName = word[0] + "/" + word + ".mp3";
        return this.audioZip.delFile(fileName);
    };
    return AuidoArchive;
}());
exports.AuidoArchive = AuidoArchive;
;
//# sourceMappingURL=AuidoArchive.js.map