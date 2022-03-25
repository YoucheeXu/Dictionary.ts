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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuidoArchive = void 0;
// AuidoArchive.ts
// import { fs, path } from "electron";
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("../utils/utils");
const ZipArchive_1 = require("./ZipArchive");
const globalInterface_1 = require("../utils/globalInterface");
class AuidoArchive {
    constructor(_szName, _srcFile, _compression, _compresslevel) {
        this._szName = _szName;
        this._srcFile = _srcFile;
        this._compression = _compression;
        this._compresslevel = _compresslevel;
        this._download = null;
        this._szAudioArchive = path.basename(_srcFile);
        // console.log(this._szAudioArchive);
        let filePath = path.dirname(_srcFile);
        let fileName = path.basename(_srcFile, ".zip");
        // console.log(fileName);
        this._tempAudioDir = path.join(filePath, fileName);
        // console.log(this._tempAudioDir);
        let _this = this;
        if (fs.existsSync(_this._tempAudioDir) == false) {
            fs.mkdir(_this._tempAudioDir, function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('Success to create folder: ' + _this._tempAudioDir);
            });
        }
        // gLogger.info("tempAudioDir: " + this._tempAudioDir);
        this._audioZip = new ZipArchive_1.ZipArchive(_srcFile, _compression, _compresslevel);
    }
    get szName() {
        return this._szName;
    }
    get srcFile() {
        return this._srcFile;
    }
    async Open() {
        return this._audioZip.Open();
    }
    Close() {
        (0, utils_1.RemoveDir)(this._tempAudioDir);
        if (fs.existsSync(this._tempAudioDir) == false) {
            return [true, `OK to remove ${this._tempAudioDir}`];
        }
        else {
            return [false, `Fail to remove ${this._tempAudioDir}`];
        }
    }
    async query_audio(word) {
        let fileName = word[0] + "/" + word + ".mp3";
        let audioFile = path.join(this._tempAudioDir, word + ".mp3");
        let ret = false;
        let audio;
        try {
            if (fs.existsSync(audioFile) == true) {
                return Promise.resolve([1, audioFile]);
            }
            else if (this._audioZip.bFileIn(fileName)) {
                [ret, audio] = await this._audioZip.readFileAsync(fileName);
                if (ret) {
                    try {
                        fs.writeFileSync(audioFile, audio);
                    }
                    catch (e) {
                        return Promise.resolve([-1, e.message]);
                    }
                    return Promise.resolve([1, audioFile]);
                }
                else {
                    return Promise.resolve([-1, `Fail to read ${word} in ${this._szAudioArchive}!`]);
                }
            }
            else {
                return Promise.resolve([0, audioFile]);
            }
        }
        catch (e) {
            return Promise.resolve([-1, e.message]);
        }
    }
    set download(download) {
        this._download = download;
    }
    get download() {
        return this._download;
    }
    CheckAndAddFile(audioFile) {
        let word = path.basename(audioFile, ".mp3");
        let fileName = word[0] + "/" + word + ".mp3";
        let _this = this;
        let gApp = globalInterface_1.globalVar.app;
        if (fs.existsSync(audioFile)) {
            let audio = fs.readFileSync(audioFile);
            fs.unlink(audioFile, () => { });
            _this._audioZip.addFile(fileName, audio);
            // return gApp.Info(1, 2, word, "OK to download audio of " + word);
            return gApp.Info(1, 2, word, audioFile);
        }
        else {
            console.log(audioFile + " doesn't exist");
            return gApp.Info(-1, 2, word, "Doesn't exist audio of " + word);
        }
    }
    del_audio(word) {
        let fileName = word[0] + "/" + word + ".mp3";
        return this._audioZip.delFile(fileName);
    }
}
exports.AuidoArchive = AuidoArchive;
;
//# sourceMappingURL=AuidoArchive.js.map