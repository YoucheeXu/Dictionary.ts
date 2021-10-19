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
exports.GDictBase = void 0;
// GDictBase.ts
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var DictBase_1 = require("./DictBase");
var ZipArchive_1 = require("./ZipArchive");
var utils_1 = require("../utils/utils");
var globalInterface_1 = require("../utils/globalInterface");
var GDictBase = /** @class */ (function (_super) {
    __extends(GDictBase, _super);
    function GDictBase(name, dictSrc, _compression, _compresslevel) {
        var _this_1 = _super.call(this, name, dictSrc) || this;
        _this_1._compression = _compression;
        _this_1._compresslevel = _compresslevel;
        _this_1._dictZip = new ZipArchive_1.ZipArchive(dictSrc, _compression, _compresslevel);
        // this.tempDictDir = tempfile.gettempdir();
        var filePath = path.dirname(dictSrc);
        var fileName = path.basename(dictSrc, ".zip");
        // console.log(fileName);
        _this_1._tempDictDir = path.join(filePath, fileName);
        return _this_1;
    }
    GDictBase.prototype.Open = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._dictZip.Open()];
            });
        });
    };
    GDictBase.prototype.Close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                utils_1.RemoveDir(this._tempDictDir);
                if (fs.existsSync(this._tempDictDir) == false) {
                    return [2 /*return*/, [true, "OK to remove " + this._tempDictDir]];
                }
                else {
                    return [2 /*return*/, [false, "Fail to remove " + this._tempDictDir]];
                }
                return [2 /*return*/];
            });
        });
    };
    GDictBase.prototype.query_word = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName, datum, ret, wordFile, strDatum, dictDatum, info, obj, tabAlign, html, e_1, errMsg;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fileName = word[0] + "/" + word + ".json";
                        ret = false;
                        wordFile = "";
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        if (!this._dictZip.bFileIn(fileName)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._dictZip.readFileAsync(fileName)];
                    case 2:
                        _a = _b.sent(), ret = _a[0], datum = _a[1];
                        if (!ret) {
                            return [2 /*return*/, Promise.resolve([-1, "Fail to read " + word + " in " + this.szName])];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        wordFile = path.join(this._tempDictDir, word + ".json");
                        return [2 /*return*/, Promise.resolve([0, wordFile])];
                    case 4:
                        strDatum = String(datum);
                        dictDatum = JSON.parse(strDatum);
                        if (dictDatum["ok"]) {
                            info = dictDatum["info"];
                            info = String(info).replace(/\\x/g, "\\u00");
                            obj = JSON.parse(info);
                            tabAlign = '\t\t\t\t\t\t\t';
                            html = '\r\n' + this.process_primary(tabAlign + '\t', obj.primaries) + tabAlign;
                            html = html.replace(/[\r\n]/g, "");
                            return [2 /*return*/, Promise.resolve([1, html])];
                        }
                        else {
                            return [2 /*return*/, Promise.resolve([-1, "Fail to read: " + word])];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        if (fs.existsSync(wordFile)) {
                            fs.unlinkSync(wordFile);
                        }
                        errMsg = e_1.message.replace("<", "").replace(">", "");
                        return [2 /*return*/, Promise.resolve([-1, errMsg])];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GDictBase.prototype.CheckAndAddFile = function (localFile) {
        var word = path.basename(localFile, ".json");
        var fileName = word[0] + "/" + word + ".json";
        var info = "";
        var _this = this;
        var gApp = globalInterface_1.globalVar.app;
        if (fs.existsSync(localFile)) {
            var dict = fs.readFileSync(localFile).toString();
            var inWord = this.GetInWord(dict);
            fs.unlink(localFile, function () { });
            if (inWord != "") {
                if (inWord == word) {
                    // gApp.log("info", "%s's json is OK!" %word)
                    _this._dictZip.addFile(fileName, dict);
                    return gApp.Info(1, 1, word, "OK to download dict of " + word);
                }
                else {
                    // gApp.log("error", "%s isn't what we want!" %word)
                    return gApp.Info(-1, 1, inWord, "Wrong word: We except '" + word + "', but we get '" + inWord + "'");
                }
            }
            else {
                return gApp.Info(-1, 1, word, "No dict of " + word + " in " + this.szName + ".");
            }
        }
        else {
            console.log(localFile + " doesn't exist");
            return gApp.Info(-1, 1, word, "Doesn't exist dict of " + word);
        }
    };
    GDictBase.prototype.GetInWord = function (dict) {
        var datum = JSON.parse(dict);
        if (datum["ok"]) {
            var info = datum["info"];
            info = String(info).replace(/\\x/g, "\\u00");
            // info = info.replace('\\', '\\\\');
            try {
                datum = JSON.parse(info);
                if (datum["primaries"][0]["type"] == "headword") {
                    return datum["primaries"][0]["terms"][0]["text"];
                }
            }
            catch (e) {
                var errMsg = e.message.replace("<", "").replace(">", "");
                console.error(errMsg);
                return "";
            }
        }
        return "";
    };
    GDictBase.prototype.get_wordsLst = function (word, wdMatchLst) {
        var fileName = word[0] + "/" + word + ".*\.json";
        // print("Going to find: " + fileName)
        this._dictZip.searchFile(fileName, wdMatchLst, 100);
        // for i in range(len(wdMatchLst)){
        for (var i = 0; i < wdMatchLst.length; i++) {
            wdMatchLst[i] = wdMatchLst[i].slice(2, -5);
        }
        if (wdMatchLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    };
    GDictBase.prototype.del_word = function (word) {
        var fileName = word[0] + "/" + word + ".json";
        return this._dictZip.delFile(fileName);
    };
    GDictBase.prototype.process_primary = function (tabAlign, dict_primary) {
        var primary = dict_primary;
        var xml = "";
        var html = "";
        var bMeaning = false;
        if (primary instanceof Array) {
            for (var i in primary) {
                var data = primary[i];
                html = this.process_primary(tabAlign, data);
                // console.log("html1: " + html + ";");
                if (html.slice(0, 1) == "<") {
                    xml += "\r\n" + tabAlign;
                }
                xml += html;
            }
        }
        else if (typeof (primary) == "object") {
            var hasChild = false;
            var hasType = false;
            if (primary.type != undefined) {
                hasType = true;
                if (primary.type == "container") {
                    xml += "\r\n" + tabAlign + "<div class = 'wordtype'>" + primary.labels[0].text + ": </div>\r\n";
                    xml += tabAlign + "<div class = '" + primary.type + "1'>\r\n";
                    tabAlign += "\t";
                    html = this.process_terms(tabAlign, primary.terms, primary.type);
                    if (html.slice(0, 1) == "<") {
                        xml += "\r\n" + tabAlign;
                    }
                    xml += html;
                }
                else {
                    if (primary.labels != undefined) {
                        // if(xml.substr(-1, 1) == ">"){
                        // xml += "\r\n";
                        // }
                        xml += tabAlign + "<div class = '" + primary.type + "'>";
                        tabAlign += "\t";
                        xml += "\r\n" + tabAlign + "<div class = 'labels'>" + primary.labels[0].text + "</div>";
                        html = this.process_terms(tabAlign, primary.terms, primary.type);
                        if (html.slice(0, 1) == "<") {
                            xml += "\r\n" + tabAlign;
                        }
                        xml += html;
                    }
                    else {
                        if (primary.type == "meaning") {
                            bMeaning = true;
                        }
                        if (primary.type == "example" && bMeaning == true) {
                            xml += "\r\n";
                            bMeaning = false;
                        }
                        xml += tabAlign + "<div class = '" + primary.type + "'>";
                        tabAlign += "\t";
                        html = this.process_terms(tabAlign, primary.terms, primary.type);
                        if (html.slice(0, 1) == "<") {
                            xml += "\r\n" + tabAlign;
                        }
                        // console.log("html4: " + html + ";");
                        xml += html;
                    }
                }
                if (primary.entries != undefined) {
                    html = this.process_primary(tabAlign, primary.entries);
                    // console.log("html: " + html + ";");
                    // console.log("xml: " + xml + ";");
                    // console.log("html2: " + html + ";");
                    if (html.slice(0, 1) == "<") {
                        xml += "\r\n" + tabAlign + "Q: ";
                    }
                    xml += html;
                }
                // xml += tabAlign + "</div>\r\n";
                tabAlign = tabAlign.slice(0, -1);
                // console.log(xml.substr(-3, 3));
                if (xml.substr(-3, 1) == ">") {
                    xml += tabAlign;
                }
                if (xml.substr(-1, 1) == ">") {
                    xml += "\r\n" + tabAlign;
                }
                xml += "</div>\r\n";
                // tabAlign = tabAlign.slice(0, -2);
            }
        }
        else if (typeof (primary) == "string") {
            html = this.process_primary(tabAlign, eval("(" + primary + ")"));
            // console.log("html3: " + html + ";");
            xml += html;
        }
        return xml;
    };
    GDictBase.prototype.process_terms = function (tabAlign, dict_terms, type) {
        var terms = dict_terms;
        var xml = "";
        var html = "";
        if (terms instanceof Array) {
            for (var i in terms) {
                var data = terms[i];
                html = this.process_terms(tabAlign, data, type);
                // if(html.slice(0,1) == "<"){
                // xml += "\r\n" + tabAlign;
                // }
                xml += html;
            }
        }
        else if (typeof (terms) == "object") {
            var hasType = false;
            if (terms.type != undefined) {
                hasType = true;
                if (terms.type != "text" || type == "headword" || type == "related") {
                    if (terms.type == "sound") {
                        /*xml += '<div class="'+ terms.type + '">';
                        //xml += terms.text +"</div>";
                        xml += '<embed type="application/x-shockwave-flash" src="SpeakerApp16.swf"' +
                            'width="20" height="20" id="movie28564" name="movie28564" bgcolor="#000000"' +
                            'quality="high" flashlets="sound_name='+ terms.text + '"wmode="transparent">'
                        xml += "</div>"*/
                        // alert(terms.text);
                        xml += this.getSound(tabAlign, terms.text);
                    }
                    else {
                        // console.log("P: " + xml)
                        // if(xml.substr(-1, 1) == ">"){
                        // xml += "\r\n" + tabAlign;
                        // }
                        xml += "\r\n" + tabAlign + "<div class = '" + terms.type + "'>" +
                            terms.text + "</div>";
                    }
                }
                else {
                    xml += terms.text;
                }
            }
        }
        return xml;
    };
    GDictBase.prototype.process_term = function (dict_terms) {
        var terms = dict_terms;
        var xml = "";
        for (var i in terms) {
            var data = terms[i];
            xml += (data.text);
        }
        return xml;
    };
    GDictBase.prototype.getSound = function (tabAlign, url) {
        var sound = '\r\n' +
            tabAlign +
            "<div class = 'sound' id = 'Player'>\r\n" +
            tabAlign +
            '\t' +
            "<button class = 'jp-play' id = 'playpause' title = 'Play'></button>\r\n" +
            tabAlign +
            '\t' +
            "<audio id = 'myaudio'>\r\n" +
            tabAlign +
            '\t' +
            '\t' +
            '<source src = ' +
            url +
            " type= 'audio/mpeg'>\r\n" +
            tabAlign +
            '\t' +
            '\t' +
            'Your browser does not support the audio tag.\r\n' +
            tabAlign +
            '\t' +
            '</audio>\r\n' +
            tabAlign +
            '</div>';
        return sound;
    };
    return GDictBase;
}(DictBase_1.DictBase));
exports.GDictBase = GDictBase;
;
//# sourceMappingURL=GDictBase.js.map