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
exports.GDictBase = void 0;
// GDictBase.ts
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const DictBase_1 = require("./DictBase");
const ZipArchive_1 = require("./ZipArchive");
const utils_1 = require("../utils/utils");
const globalInterface_1 = require("../utils/globalInterface");
class GDictBase extends DictBase_1.DictBase {
    constructor(name, dictSrc, _compression, _compresslevel) {
        super(name, dictSrc);
        this._compression = _compression;
        this._compresslevel = _compresslevel;
        this._dictZip = new ZipArchive_1.ZipArchive(dictSrc, _compression, _compresslevel);
        let filePath = path.dirname(dictSrc);
        let fileName = path.basename(dictSrc, ".zip");
        let tmpDir = path.join(filePath, fileName);
        this.szTmpDir = tmpDir;
        let styleSrc = path.join(filePath, fileName + "-style.zip");
        this._styleZip = new ZipArchive_1.ZipArchive(styleSrc, _compression, _compresslevel);
        let _this = this;
        if (fs.existsSync(_this.szTmpDir) == false) {
            fs.mkdir(_this.szTmpDir, function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('Success to create folder: ' + _this.szTmpDir);
            });
        }
    }
    async Open() {
        this._styleZip.Open();
        return this._dictZip.Open();
    }
    async Close() {
        (0, utils_1.RemoveDir)(this.szTmpDir);
        if (fs.existsSync(this.szTmpDir) == false) {
            return [true, `OK to remove ${this.szTmpDir}`];
        }
        else {
            return [false, `Fail to remove ${this.szTmpDir}`];
        }
    }
    async query_word(word) {
        let fileName = word[0] + "/" + word + ".json";
        let dictFile = path.join(this.szTmpDir, word + ".html");
        let datum;
        let ret = false;
        let wordFile = "";
        let retNum = -1;
        let errMsg = '';
        try {
            if (fs.existsSync(dictFile) == true) {
                return Promise.resolve([1, dictFile]);
            }
            else if (this._dictZip.bFileIn(fileName)) {
                [ret, datum] = await this._dictZip.readFileAsync(fileName);
                if (!ret) {
                    retNum = -1;
                    errMsg = `Fail to read ${word} in ${this.szName}`;
                }
            }
            else {
                wordFile = path.join(this.szTmpDir, word + ".json");
                return Promise.resolve([0, wordFile]);
            }
            let strDatum = String(datum);
            let dictDatum = JSON.parse(strDatum);
            if (dictDatum["ok"]) {
                let info = dictDatum["info"];
                info = String(info).replace(/\\x/g, "\\u00");
                let obj = JSON.parse(info);
                let tabAlign = '\t\t';
                let dict = this.process_primary(tabAlign, obj.primaries);
                let jsName = "google-toggle.js";
                let cssName = "google.css";
                let css = tabAlign + '<link rel="stylesheet" href="../../assets/scripts/player.css">' + '\r\n';
                css += tabAlign + `<link rel="stylesheet" type="text/css" href="${cssName}">`;
                let js = tabAlign + '<script src="../../assets/third_party/jquery-3.4.1.min.js"></script>' + '\r\n';
                js += tabAlign + '<script src="../../assets/scripts/player.js"></script>' + '\r\n';
                js += tabAlign + `<script src="${jsName}"></script>`;
                let togeg = tabAlign + '<div id="toggle_example" align="right">- Hide Examples</div>';
                let html = `<!DOCTYPE html><html>\r\n\t<body>\r\n${css}\r\n${js}\r\n${togeg}\r\n${dict}\r\n\t</body>\r\n</html>`;
                fs.writeFileSync(dictFile, html);
                let jsFile = path.join(this.szTmpDir, jsName);
                if (fs.existsSync(jsFile) == false) {
                    if (this._styleZip.bFileIn(jsName)) {
                        [ret, datum] = await this._styleZip.readFileAsync(jsName);
                        if (!ret) {
                            return Promise.resolve([-1, `Fail to read ${jsName} in ${this._styleZip}`]);
                        }
                        fs.writeFileSync(jsFile, String(datum));
                    }
                }
                let cssFile = path.join(this.szTmpDir, cssName);
                if (fs.existsSync(cssFile) == false) {
                    if (this._styleZip.bFileIn(cssName)) {
                        [ret, datum] = await this._styleZip.readFileAsync(cssName);
                        if (!ret) {
                            return Promise.resolve([-1, `Fail to read ${cssName} in ${this._styleZip}`]);
                        }
                        fs.writeFileSync(cssFile, String(datum));
                    }
                }
                return Promise.resolve([1, dictFile]);
            }
            else {
                retNum = -1;
                errMsg = "Fail to read: " + word;
            }
        }
        catch (e) {
            if (fs.existsSync(wordFile)) {
                fs.unlinkSync(wordFile);
            }
            retNum = -1;
            errMsg = errMsg = e.message.replace("<", "").replace(">", "");
        }
        return Promise.resolve([retNum, errMsg]);
    }
    CheckAndAddFile(localFile) {
        let word = path.basename(localFile, ".json");
        let fileName = word[0] + "/" + word + ".json";
        let info = "";
        let _this = this;
        let gApp = globalInterface_1.globalVar.app;
        if (fs.existsSync(localFile)) {
            let dict = fs.readFileSync(localFile).toString();
            let inWord = this.GetInWord(dict);
            fs.unlink(localFile, () => { });
            if (inWord != "") {
                if (inWord == word) {
                    // gApp.log("info", "%s's json is OK!" %word)
                    _this._dictZip.addFile(fileName, dict);
                    return gApp.Info(1, 1, word, "OK to download dict of " + word);
                }
                else {
                    // gApp.log("error", "%s isn't what we want!" %word)
                    return gApp.Info(-1, 1, inWord, `Wrong word: We except '${word}', but we get '${inWord}' at ${this._szName}`);
                }
            }
            else {
                return gApp.Info(-1, 1, word, `No dict of ${word} in ${this.szName}`);
            }
        }
        else {
            console.log(localFile + " doesn't exist");
            return gApp.Info(-1, 1, word, `Doesn't exist dict of ${word} at ${this.szName}`);
        }
    }
    GetInWord(dict) {
        let datum = JSON.parse(dict);
        if (datum["ok"]) {
            let info = datum["info"];
            info = String(info).replace(/\\x/g, "\\u00");
            // info = info.replace('\\', '\\\\');
            try {
                datum = JSON.parse(info);
                if (datum["primaries"][0]["type"] == "headword") {
                    return datum["primaries"][0]["terms"][0]["text"];
                }
            }
            catch (e) {
                let errMsg = e.message.replace("<", "").replace(">", "");
                console.error(errMsg);
                return "";
            }
        }
        return "";
    }
    get_wordsLst(word, wdMatchLst) {
        let fileName = word[0] + "/" + word + ".*\.json";
        // print("Going to find: " + fileName)
        this._dictZip.searchFile(fileName, wdMatchLst, 100);
        // for i in range(len(wdMatchLst)){
        for (let i = 0; i < wdMatchLst.length; i++) {
            wdMatchLst[i] = wdMatchLst[i].slice(2, -5);
        }
        if (wdMatchLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    }
    del_word(word) {
        let fileName = word[0] + "/" + word + ".json";
        return this._dictZip.delFile(fileName);
    }
    process_primary(tabAlign, dict_primary) {
        let primary = dict_primary;
        let xml = "";
        let html = "";
        let bMeaning = false;
        if (primary instanceof Array) {
            for (let i in primary) {
                let data = primary[i];
                html = this.process_primary(tabAlign, data);
                // console.log("html1: " + html + ";");
                if (html.slice(0, 1) == "<") {
                    xml += "\r\n" + tabAlign;
                }
                xml += html;
            }
        }
        else if (typeof (primary) == "object") {
            let hasChild = false;
            let hasType = false;
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
    }
    process_terms(tabAlign, dict_terms, type) {
        let terms = dict_terms;
        let xml = "";
        let html = "";
        if (terms instanceof Array) {
            for (let i in terms) {
                let data = terms[i];
                html = this.process_terms(tabAlign, data, type);
                // if(html.slice(0,1) == "<"){
                // xml += "\r\n" + tabAlign;
                // }
                xml += html;
            }
        }
        else if (typeof (terms) == "object") {
            let hasType = false;
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
    }
    process_term(dict_terms) {
        let terms = dict_terms;
        let xml = "";
        for (let i in terms) {
            let data = terms[i];
            xml += (data.text);
        }
        return xml;
    }
    getSound(tabAlign, url) {
        let sound = '\r\n' +
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
    }
}
exports.GDictBase = GDictBase;
;
//# sourceMappingURL=GDictBase.js.map