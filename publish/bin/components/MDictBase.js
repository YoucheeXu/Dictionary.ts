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
exports.MDictBase = void 0;
// MDictBase.ts
var path = __importStar(require("path"));
var DictBase_1 = require("./DictBase");
var ripemd128_1 = require("../utils/ripemd128");
// import { Salsa20 } from "../utils/pureSalsa20";
// zlib compression is used for engine version >=2.0
var zlib = __importStar(require("zlib"));
// LZO compression is used for engine version < 2.0
// import * as lzo from "lzo-decompress";
var xml = __importStar(require("fast-xml-parser"));
// To use the promise-based APIs:
// import * as fs from 'fs/promises';
// To use the callback and sync APIs:
var fs = __importStar(require("fs"));
var assert_1 = require("assert");
var globalInterface_1 = require("../utils/globalInterface");
var utils_1 = require("../utils/utils");
// read from mdd, mdx
var MDictBase = /** @class */ (function (_super) {
    __extends(MDictBase, _super);
    function MDictBase(name, srcFile, _bMdd, _passcode) {
        if (_bMdd === void 0) { _bMdd = false; }
        var _this = _super.call(this, name, srcFile) || this;
        _this._bMdd = _bMdd;
        _this._passcode = _passcode;
        _this._tempDir = "";
        _this._posOfFd = 0;
        _this._encoding = "";
        _this._encrypt = 0;
        _this._stylesheet = new Map();
        _this._keyList = new Array();
        // <word, [recordStart, recordEnd, compressBlockStart, compressedSize, decompressedSize]>;
        _this._wordMap = new Map();
        var filePath = path.dirname(srcFile);
        var fileName = "";
        if (_this._bMdd) {
            _this._encoding = 'UTF-16';
            fileName = path.basename(srcFile, ".mdd");
        }
        else {
            _this._encoding = "";
            fileName = path.basename(srcFile, ".mdx");
        }
        // console.log(fileName);
        _this._tempDir = path.join(filePath, fileName);
        _this._bSubstyle = false;
        return _this;
    }
    MDictBase.prototype.Open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._fd = fs.openSync(this._szSrcFile, 'r');
                        if (this._fd == -1) {
                            throw new Error("Can't open " + this._szName);
                        }
                        this._tagOfHeader = this.ReadHeader();
                        _a = this;
                        return [4 /*yield*/, this.ReadKeys()];
                    case 1:
                        _a._keyList = _b.sent();
                        if (!this._bMdd) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.DecodeMddRecordBlock()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.DecodeMdxRecordBlock()];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        this._wordList = Array.from(this._wordMap.keys());
                        return [2 /*return*/];
                }
            });
        });
    };
    MDictBase.prototype.query_word = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            var value, recordStart, recordEnd, compressBlockStart, compressBlcokSize, decompressSize, recordBlockCompressed, recordBlockType, adler32, recordBlock, recordBlockTypeStr, recordRaw, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._wordList.indexOf(word) != -1)) return [3 /*break*/, 2];
                        value = this._wordMap.get(word);
                        recordStart = 0, recordEnd = 0, compressBlockStart = 0, compressBlcokSize = 0, decompressSize = 0;
                        if (value) {
                            recordStart = value[0];
                            recordEnd = value[1];
                            compressBlockStart = value[2];
                            compressBlcokSize = value[3];
                            decompressSize = value[4];
                        }
                        else {
                            return [2 /*return*/, [-1, "There is no " + word + " in " + this._szName]];
                        }
                        recordBlockCompressed = this.ReadBuffer(compressBlcokSize, compressBlockStart);
                        recordBlockType = recordBlockCompressed.slice(0, 4);
                        adler32 = (0, utils_1.Bytes2Num)('>I', recordBlockCompressed.slice(4, 8));
                        recordBlock = void 0;
                        recordBlockTypeStr = recordBlockType.join();
                        return [4 /*yield*/, this.Decompress(recordBlockTypeStr, recordBlockCompressed, decompressSize)];
                    case 1:
                        recordBlock = _a.sent();
                        // notice that adler32 return signed value
                        (0, assert_1.strict)((0, utils_1.Adler32FromBuffer)(recordBlock) == adler32);
                        (0, assert_1.strict)(recordBlock.length == decompressSize);
                        recordRaw = recordBlock.slice(recordStart, recordEnd);
                        record = new TextDecoder(this._encoding).decode(recordRaw);
                        // record = record.trim('\x00');
                        // substitute styles
                        if (this._bSubstyle && this._stylesheet) {
                            record = this.SubstituteStylesheet(record);
                        }
                        return [2 /*return*/, [1, record]];
                    case 2: return [2 /*return*/, [-1, "Word isn't in DictBase."]];
                }
            });
        });
    };
    MDictBase.prototype.get_wordsLst = function (word, wdMatchLst) {
        var wordLike = "^" + word + ".*";
        for (var _i = 0, _a = this._wordList; _i < _a.length; _i++) {
            var word_1 = _a[_i];
            var match = word_1.match(wordLike);
            if (match) {
                wdMatchLst.push(word_1);
            }
        }
        if (wdMatchLst.length >= 1) {
            return true;
        }
        else {
            return false;
        }
    };
    MDictBase.prototype.CheckAndAddFile = function (localFile) {
    };
    MDictBase.prototype.del_word = function (word) {
        throw new Error("Don't support to delete word: " + word);
        return false;
    };
    MDictBase.prototype.Close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    fs.closeSync(this._fd);
                    return [2 /*return*/, [true, ""]];
                }
                catch (e) {
                    return [2 /*return*/, [false, e.message]];
                }
                return [2 /*return*/];
            });
        });
    };
    MDictBase.prototype.ReadHeader = function () {
        var num = 0;
        // number of bytes of header text, big-endian, integer
        var bufOfSizeOfHeader = this.ReadBuffer(4);
        globalInterface_1.globalVar.Logger.debug("sizeOfHeaderRaw = " + bufOfSizeOfHeader.join());
        var sizeOfHeader = (0, utils_1.Bytes2Num)(">I", bufOfSizeOfHeader);
        globalInterface_1.globalVar.Logger.debug("sizeOfHeader = " + sizeOfHeader);
        var bufOfBytesOfHeader = this.ReadBuffer(sizeOfHeader);
        // 4 bytes: adler32 checksum of header, in little endian
        var bufOfAdler32 = this.ReadBuffer(4);
        globalInterface_1.globalVar.Logger.debug("adler32Raw = " + bufOfAdler32.join());
        var adler32 = (0, utils_1.Bytes2Num)("<I", bufOfAdler32);
        globalInterface_1.globalVar.Logger.debug("adler32 = " + adler32);
        (0, assert_1.strict)(adler32 == (0, utils_1.Adler32FromBuffer)(bufOfBytesOfHeader));
        // mark down key block offset
        // this._keyBlockOffset = this._posOfFd;
        globalInterface_1.globalVar.Logger.debug("offsetOfKeyBlk = " + this._posOfFd);
        // header text in utf-16 encoding ending with '\x00\x00'
        var decoder = new TextDecoder('UTF-16LE');
        var textOfHeader = decoder.decode(bufOfBytesOfHeader.slice(-2).buffer);
        globalInterface_1.globalVar.Logger.debug("textOfHeader = " + textOfHeader);
        var tagOfheader = this.ParseHeader(textOfHeader);
        globalInterface_1.globalVar.Logger.debug(tagOfheader);
        if (!this._encoding) {
            var encoding = tagOfheader["Encoding"];
            if (['GBK', 'GB2312'].indexOf(encoding) != -1) {
                encoding = 'GB18030';
            }
            this._encoding = encoding;
        }
        globalInterface_1.globalVar.Logger.debug("Encoding = " + this._encoding);
        // encryption flag
        //   0x00 - no encryption
        //   0x01 - encrypt record block
        //   0x02 - encrypt key info block
        var encrypted = tagOfheader.Encrypted;
        if (encrypted) {
            if (encrypted == 'No') {
                this._encrypt = 0;
            }
            else if (encrypted == 'Yes') {
                this._encrypt = 1;
            }
            else {
                this._encrypt = Math.round(encrypted);
            }
        }
        globalInterface_1.globalVar.Logger.debug("Encrypted: " + this._encrypt);
        // stylesheet attribute if present takes form of{
        //   style_number // 1-255
        //   style_begin  // or ''
        //   style_end	// or ''
        // store stylesheet in dict in the form of
        // {'number' : ('style_begin', 'style_end')}
        var styleSheet = tagOfheader.StyleSheet;
        if (styleSheet && styleSheet != '') {
            var lines = styleSheet.split(/[\r\n]/g);
            for (var i = 0; i < lines.length; i += 3) {
                this._stylesheet.set(lines[i], [lines[i + 1], lines[i + 2]]);
                this._bSubstyle = true;
            }
        }
        else {
            this._bSubstyle = false;
        }
        // globalVar.Logger.debug("stylesheet = " + str(this._Stylesheet));
        // before version 2.0, number is 4 bytes integer
        // version 2.0 and above uses 8 bytes
        this._version = tagOfheader.GeneratedByEngineVersion;
        globalInterface_1.globalVar.Logger.debug("version of Dict = " + this._version);
        if (this._version < 2.0) {
            this._numOfWidth = 4;
            this._formatOfNumber = '>I';
        }
        else {
            this._numOfWidth = 8;
            this._formatOfNumber = '>Q';
        }
        return tagOfheader;
    };
    MDictBase.prototype.Salsa_decrypt = function (ciphertext, encrypt_key) {
        // let temp = new Buffer.alloc(8); // "\x00" * 8
        // let s20 = new Salsa20(encrypt_key, temp, 8);
        // return s20.EncryptBytes(ciphertext);
        return Buffer.alloc(4);
    };
    MDictBase.prototype.Decrypt_regcode_by_deviceid = function (reg_code, deviceid) {
        // let deviceid_digest = ripemd128(deviceid);
        // let temp = Buffer.alloc(8); // "\x00" * 8
        // let s20 = new Salsa20(deviceid_digest, temp, 8);
        // let encrypt_key = s20.EncryptBytes(reg_code);
        // return encrypt_key;
        return Buffer.alloc(4);
    };
    MDictBase.prototype.Decrypt_regcode_by_email = function (reg_code, email) {
        // let email_digest = ripemd128(email.decode().encode('utf-16-le'));
        // let temp = new Uint8Array(8); // "\x00" * 8
        // let s20 = new Salsa20(email_digest, temp, 8);
        // let encrypt_key = s20.EncryptBytes(reg_code);
        // return encrypt_key;
        return Buffer.alloc(4);
    };
    MDictBase.prototype.ReadKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var numOfBytes, block, regcode, userid, encrypted_key, offset, numOfKeyBlocks, sizeOfkeyBlockInfoDecomp, sizeOfkeyBlockInfo, sizeOfKeyBlock, adler32, keyBlockInfo, keyBlockInfoList, keyBlockCompressed, keyList;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        numOfBytes = 0;
                        if (this._version >= 2.0) {
                            numOfBytes = this._numOfWidth * 5;
                        }
                        else {
                            numOfBytes = this._numOfWidth * 4;
                        }
                        block = this.ReadBuffer(numOfBytes);
                        if (this._encrypt & 1) {
                            if (this._passcode == null) {
                                throw new Error('user identification is needed to read encrypted file');
                            }
                            regcode = void 0, userid = void 0;
                            _a = this._passcode, regcode = _a[0], userid = _a[1];
                            encrypted_key = void 0;
                            if (this._tagOfHeader['RegisterBy'] == 'EMail') {
                                encrypted_key = this.Decrypt_regcode_by_email(regcode, userid);
                            }
                            else {
                                encrypted_key = this.Decrypt_regcode_by_deviceid(regcode, userid);
                            }
                            block = this.Salsa_decrypt(block, encrypted_key);
                        }
                        offset = 0;
                        numOfKeyBlocks = (0, utils_1.Bytes2Num)(this._formatOfNumber, block, offset, this._numOfWidth);
                        globalInterface_1.globalVar.Logger.debug("Number of Key Blocks = " + numOfKeyBlocks);
                        // number of entries
                        offset += this._numOfWidth;
                        this._numOfEntries = (0, utils_1.Bytes2Num)(this._formatOfNumber, block, offset, this._numOfWidth);
                        ;
                        globalInterface_1.globalVar.Logger.debug("Number of Entries = " + this._numOfEntries);
                        // number of bytes of key block info after decompression
                        offset += this._numOfWidth;
                        sizeOfkeyBlockInfoDecomp = 0;
                        if (this._version >= 2.0) {
                            // Number of Bytes After Decompression
                            sizeOfkeyBlockInfoDecomp = (0, utils_1.Bytes2Num)(this._formatOfNumber, block, offset, this._numOfWidth);
                            globalInterface_1.globalVar.Logger.debug("Number of Bytes of key block info After Decompression = " + sizeOfkeyBlockInfoDecomp);
                        }
                        // number of bytes of key block info
                        offset += this._numOfWidth;
                        sizeOfkeyBlockInfo = (0, utils_1.Bytes2Num)(this._formatOfNumber, block, offset, this._numOfWidth);
                        globalInterface_1.globalVar.Logger.debug("Number of bytes of key block info = " + sizeOfkeyBlockInfo);
                        // number of bytes of key block
                        offset += this._numOfWidth;
                        sizeOfKeyBlock = (0, utils_1.Bytes2Num)(this._formatOfNumber, block, offset, this._numOfWidth);
                        globalInterface_1.globalVar.Logger.debug("Number of bytes of key block = " + sizeOfKeyBlock);
                        // 4 bytes: adler checksum of previous 5 numbers
                        if (this._version >= 2.0) {
                            adler32 = (0, utils_1.Bytes2Num)('>I', this.ReadBuffer(4));
                            globalInterface_1.globalVar.Logger.debug("adler checksum of previous 5 numbers = " + adler32);
                            (0, assert_1.strict)(adler32 == (0, utils_1.Adler32FromBuffer)(block));
                        }
                        keyBlockInfo = this.ReadBuffer(sizeOfkeyBlockInfo);
                        return [4 /*yield*/, this.DecodeKeyBlockInfo(keyBlockInfo, sizeOfkeyBlockInfoDecomp)];
                    case 1:
                        keyBlockInfoList = _b.sent();
                        (0, assert_1.strict)(numOfKeyBlocks == keyBlockInfoList.length);
                        keyBlockCompressed = this.ReadBuffer(sizeOfKeyBlock);
                        return [4 /*yield*/, this.DecodeKeyBlocks(keyBlockCompressed, keyBlockInfoList)];
                    case 2:
                        keyList = _b.sent();
                        // this._recordBlockOffset = this._fd.tellSync();
                        return [2 /*return*/, keyList];
                }
            });
        });
    };
    /*
    extract attributes from <Dict attr="value" ... >
    */
    MDictBase.prototype.ParseHeader = function (textOfHeader) {
        var options = {
            attributeNamePrefix: "",
            ignoreAttributes: false,
        };
        try {
            var jsonObj = xml.parse(textOfHeader, options, true);
            return (JSON.parse(JSON.stringify(jsonObj))).Dictionary;
        }
        catch (e) {
            console.log(e.message);
        }
    };
    MDictBase.prototype.ReadBuffer = function (len, offset) {
        var buf = Buffer.alloc(len);
        var pos;
        if (offset) {
            pos = offset;
        }
        else {
            pos = null;
            this._posOfFd += len;
        }
        var num = fs.readSync(this._fd, buf, 0, len, pos);
        (0, assert_1.strict)(num == len);
        return buf;
    };
    MDictBase.prototype.ReadNumber = function () {
        var buf = this.ReadBuffer(this._numOfWidth);
        return (0, utils_1.Bytes2Num)(this._formatOfNumber, buf);
    };
    MDictBase.prototype.DecodeKeyBlockInfo = function (keyBlockInfoCompressed, sizeOfKeyBlockInfoDecomp) {
        return __awaiter(this, void 0, void 0, function () {
            var keyBlockInfo, typOfCompr, infoOfKeyBlockDecrypted, adler32, keyBlockInfoList, numEntries, i, byteFormat, byteWidth, sizeOfTextTerm, lenOfKeyBlockInfo, sizeOftextHead, textTailSize, sizeOfKeyBlkCompreSize, sizeOfKeyBlkDecomprSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._version >= 2)) return [3 /*break*/, 2];
                        typOfCompr = keyBlockInfoCompressed.slice(0, 4).join();
                        globalInterface_1.globalVar.Logger.debug("Type of compression of keyBlockInfo = " + typOfCompr);
                        (0, assert_1.strict)(typOfCompr == '2,0,0,0'); // zlib compression, \x02\x00\x00\x00
                        infoOfKeyBlockDecrypted = void 0;
                        if (this._encrypt & 0x02) {
                            infoOfKeyBlockDecrypted = this.MdxDecrypt(keyBlockInfoCompressed);
                        }
                        else {
                            infoOfKeyBlockDecrypted = keyBlockInfoCompressed;
                        }
                        globalInterface_1.globalVar.Logger.debug("infoOfKeyBlockDecrypted = " + infoOfKeyBlockDecrypted.join());
                        return [4 /*yield*/, this.Decompress(typOfCompr, infoOfKeyBlockDecrypted, sizeOfKeyBlockInfoDecomp)];
                    case 1:
                        keyBlockInfo = _a.sent();
                        adler32 = (0, utils_1.Bytes2Num)('>I', keyBlockInfoCompressed.slice(4, 8));
                        globalInterface_1.globalVar.Logger.debug("adler32 of keyBlockInfo = " + adler32);
                        (0, assert_1.strict)(adler32 == (0, utils_1.Adler32FromBuffer)(keyBlockInfo));
                        return [3 /*break*/, 3];
                    case 2:
                        // no compression and encrypt
                        keyBlockInfo = keyBlockInfoCompressed;
                        _a.label = 3;
                    case 3:
                        globalInterface_1.globalVar.Logger.debug("keyBlockInfo = " + keyBlockInfo.join());
                        keyBlockInfoList = new Array();
                        numEntries = 0;
                        i = 0;
                        if (this._version >= 2) {
                            byteFormat = '>H';
                            byteWidth = 2;
                            sizeOfTextTerm = 1;
                        }
                        else {
                            byteFormat = '>B';
                            byteWidth = 1;
                            sizeOfTextTerm = 0;
                        }
                        lenOfKeyBlockInfo = keyBlockInfo.length;
                        globalInterface_1.globalVar.Logger.debug("lenOfKeyBlockInfo = " + lenOfKeyBlockInfo);
                        while (i < lenOfKeyBlockInfo) {
                            // number of entries in current key block
                            numEntries += (0, utils_1.Bytes2Num)(this._formatOfNumber, keyBlockInfo.slice(i, i + this._numOfWidth));
                            i += this._numOfWidth;
                            sizeOftextHead = (0, utils_1.Bytes2Num)(byteFormat, keyBlockInfo.slice(i, i + byteWidth));
                            i += byteWidth;
                            // text head
                            if (this._encoding != 'UTF-16') {
                                i += sizeOftextHead + sizeOfTextTerm;
                            }
                            else {
                                i += (sizeOftextHead + sizeOfTextTerm) * 2;
                            }
                            textTailSize = (0, utils_1.Bytes2Num)(byteFormat, keyBlockInfo.slice(i, i + byteWidth));
                            i += byteWidth;
                            // text tail
                            if (this._encoding != 'UTF-16') {
                                i += textTailSize + sizeOfTextTerm;
                            }
                            else {
                                i += (textTailSize + sizeOfTextTerm) * 2;
                            }
                            sizeOfKeyBlkCompreSize = (0, utils_1.Bytes2Num)(this._formatOfNumber, keyBlockInfo.slice(i, i + this._numOfWidth));
                            i += this._numOfWidth;
                            sizeOfKeyBlkDecomprSize = (0, utils_1.Bytes2Num)(this._formatOfNumber, keyBlockInfo.slice(i, i + this._numOfWidth));
                            i += this._numOfWidth;
                            keyBlockInfoList.push([sizeOfKeyBlkCompreSize, sizeOfKeyBlkDecomprSize]);
                            // assert(numEntries == this._numOfEntries)
                        }
                        globalInterface_1.globalVar.Logger.debug("keyBlockInfoList = " + keyBlockInfoList);
                        return [2 /*return*/, keyBlockInfoList];
                }
            });
        });
    };
    MDictBase.prototype.FastDecrypt = function (data, key) {
        var previous = 0x36;
        for (var i = 0; i < data.length; i++) {
            var t = (data[i] >>> 4 | data[i] << 4) & 0xff;
            t = t ^ previous ^ (i & 0xff) ^ key[i % key.length];
            previous = data[i];
            data[i] = t;
        }
        globalInterface_1.globalVar.Logger.debug("FastDecrypt = " + data.join());
        return data;
    };
    MDictBase.prototype.MdxDecrypt = function (compBlock) {
        var tail = (0, utils_1.Num2Bytes)('<L', 0x3695);
        globalInterface_1.globalVar.Logger.debug("Tail of key of compBlock = " + tail.join());
        var msg = compBlock.slice(4, 8);
        globalInterface_1.globalVar.Logger.debug("msg = " + msg.join());
        var key = (0, ripemd128_1.ripemd128)((0, utils_1.BufferConcat)(msg, tail));
        globalInterface_1.globalVar.Logger.debug("Key of compBlock = " + key.join());
        return (0, utils_1.BufferConcat)(compBlock.slice(0, 8), this.FastDecrypt(compBlock.slice(8), key));
    };
    MDictBase.prototype.DecodeKeyBlocks = function (keyBlockCompressed, keyBlockInfoList) {
        return __awaiter(this, void 0, void 0, function () {
            var keyList, i, _i, keyBlockInfoList_1, value, sizeOfcompressed, sizeOfDecompressed, start, end, keyBlockType, adler32, keyBlockTypeStr, keyBlock, keyList1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keyList = new Array();
                        i = 0;
                        _i = 0, keyBlockInfoList_1 = keyBlockInfoList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < keyBlockInfoList_1.length)) return [3 /*break*/, 4];
                        value = keyBlockInfoList_1[_i];
                        sizeOfcompressed = value[0];
                        sizeOfDecompressed = value[1];
                        start = i;
                        end = i + sizeOfcompressed;
                        keyBlockType = keyBlockCompressed.slice(start, start + 4);
                        adler32 = (0, utils_1.Bytes2Num)('>I', keyBlockCompressed.slice(start + 4, start + 8));
                        keyBlockTypeStr = keyBlockType.join();
                        return [4 /*yield*/, this.Decompress(keyBlockTypeStr, keyBlockCompressed.slice(start, end), sizeOfDecompressed)];
                    case 2:
                        keyBlock = _a.sent();
                        (0, assert_1.strict)(adler32 == (0, utils_1.Adler32FromBuffer)(keyBlock));
                        keyList1 = this.DecodeKeyBlock(keyBlock);
                        keyList = keyList.concat(keyList1);
                        i += sizeOfcompressed;
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        globalInterface_1.globalVar.Logger.debug("len of keyList = " + keyList.length);
                        return [2 /*return*/, keyList];
                }
            });
        });
    };
    MDictBase.prototype.DecodeKeyBlock = function (keyBlock) {
        var keyList = new Array();
        var keyStartIndex = 0;
        var keyEndIndex = 0;
        while (keyStartIndex < keyBlock.length) {
            // the corresponding record's offset in record block
            var keyId = (0, utils_1.Bytes2Num)(this._formatOfNumber, keyBlock.slice(keyStartIndex, keyStartIndex + this._numOfWidth));
            var delimiter = void 0;
            var width = void 0;
            // key text ends with '\x00'
            if (this._encoding == 'UTF-16') {
                delimiter = '0,0'; // \x00\x00
                width = 2;
            }
            else {
                delimiter = '0'; // \x00
                width = 1;
            }
            var i = keyStartIndex + this._numOfWidth;
            while (i < keyBlock.length) {
                if (keyBlock.slice(i, i + width).join() == delimiter) {
                    keyEndIndex = i;
                    break;
                }
                i += width;
            }
            var keyTextRaw = keyBlock.slice(keyStartIndex + this._numOfWidth, keyEndIndex);
            var keyText1 = new TextDecoder(this._encoding).decode(keyTextRaw);
            // globalVar.Logger.debug(`keyText1 = ${ keyText1 }`);
            // TODO: why encode?
            var keyText2 = new TextEncoder().encode(keyText1);
            keyStartIndex = keyEndIndex + width;
            keyList.push([keyId, keyText2]);
        }
        return keyList;
    };
    MDictBase.prototype.DecodeMddRecordBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var numRecordBlocks, numEntries, sizeOfRecordBlockInfo, sizeOfRecordBlock, recordBlockInfoList, sizeCounter, i_1, compressedSize, decompressedSize, offset, i, _i, recordBlockInfoList_1, value, compressedSize, decompressedSize, compressBlockStart, recordBlockCompressed, recordBlockType, adler32, recordBlockTypeStr, recordBlock, value_1, recordStart, keyText, recordEnd, txtOfKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        numRecordBlocks = this.ReadNumber();
                        numEntries = this.ReadNumber();
                        (0, assert_1.strict)(numEntries == this._numOfEntries);
                        sizeOfRecordBlockInfo = this.ReadNumber();
                        sizeOfRecordBlock = this.ReadNumber();
                        recordBlockInfoList = new Array();
                        sizeCounter = 0;
                        for (i_1 = 0; i_1 < numRecordBlocks; i_1++) {
                            compressedSize = this.ReadNumber();
                            decompressedSize = this.ReadNumber();
                            recordBlockInfoList.push([compressedSize, decompressedSize]);
                            sizeCounter += this._numOfWidth * 2;
                        }
                        (0, assert_1.strict)(sizeCounter == sizeOfRecordBlockInfo);
                        offset = 0;
                        i = 0;
                        sizeCounter = 0;
                        _i = 0, recordBlockInfoList_1 = recordBlockInfoList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < recordBlockInfoList_1.length)) return [3 /*break*/, 4];
                        value = recordBlockInfoList_1[_i];
                        compressedSize = value[0];
                        decompressedSize = value[0];
                        compressBlockStart = this._fd.tellSync();
                        recordBlockCompressed = this.ReadBuffer(compressedSize);
                        recordBlockType = recordBlockCompressed.slice(0, 4);
                        adler32 = (0, utils_1.Bytes2Num)('>I', recordBlockCompressed.slice(4, 8));
                        recordBlockTypeStr = recordBlockType.join('');
                        return [4 /*yield*/, this.Decompress(recordBlockTypeStr, recordBlockCompressed, decompressedSize)];
                    case 2:
                        recordBlock = _a.sent();
                        // notice that adler32 return signed value
                        (0, assert_1.strict)(adler32 == (0, utils_1.Adler32FromBuffer)(recordBlock));
                        (0, assert_1.strict)(recordBlock.length == decompressedSize);
                        // split record block according to the offset info from key block
                        while (i < this._keyList.length) {
                            value_1 = this._keyList[i];
                            recordStart = value_1[0];
                            keyText = value_1[1];
                            // reach the end of current record block
                            if (recordStart - offset >= recordBlock.length) {
                                break;
                            }
                            recordEnd = 0;
                            if (i < this._keyList.length - 1) {
                                recordEnd = this._keyList[i + 1][0];
                            }
                            else {
                                recordEnd = recordBlock.length + offset;
                            }
                            i += 1;
                            txtOfKey = new TextDecoder("UTF-8").decode(keyText);
                            this._wordMap.set(txtOfKey, [recordStart - offset, recordEnd - offset, compressBlockStart, compressedSize, decompressedSize]);
                        }
                        offset += recordBlock.length;
                        sizeCounter += compressedSize;
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        (0, assert_1.strict)(sizeCounter == sizeOfRecordBlock);
                        return [2 /*return*/];
                }
            });
        });
    };
    MDictBase.prototype.DecodeMdxRecordBlock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var numOfRecordBlocks, numEntries, sizeOfRecordBlockInfo, sizeOfRecordBlock, recordBlockInfoList, sizeCounter, i_2, sizeOfcompressed, sizeOfDecompressed, offset, i, _i, recordBlockInfoList_2, value, sizeOfCompressed, sizeOfDecompressed, strtOfComprBlk, recordBlockCompressed, recordBlockType, adler32, recordBlockTypeStr, recordBlock, value_2, recordStart, keyText, recordEnd, txtOfKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // this._fd.seekSync(this._recordBlockOffset);
                        globalInterface_1.globalVar.Logger.debug("offsetOfRecordBlk = " + this._posOfFd);
                        numOfRecordBlocks = this.ReadNumber();
                        globalInterface_1.globalVar.Logger.debug("Number of Record Blocks = " + numOfRecordBlocks);
                        numEntries = this.ReadNumber();
                        (0, assert_1.strict)(numEntries == this._numOfEntries);
                        sizeOfRecordBlockInfo = this.ReadNumber();
                        globalInterface_1.globalVar.Logger.debug("sizeOfRecordBlockInfo = " + sizeOfRecordBlockInfo);
                        sizeOfRecordBlock = this.ReadNumber();
                        globalInterface_1.globalVar.Logger.debug("sizeOfRecordBlock = " + sizeOfRecordBlock);
                        globalInterface_1.globalVar.Logger.debug("mid of file = " + this._posOfFd);
                        recordBlockInfoList = new Array();
                        sizeCounter = 0;
                        for (i_2 = 0; i_2 < numOfRecordBlocks; i_2++) {
                            sizeOfcompressed = this.ReadNumber();
                            sizeOfDecompressed = this.ReadNumber();
                            recordBlockInfoList.push([sizeOfcompressed, sizeOfDecompressed]);
                            sizeCounter += this._numOfWidth * 2;
                        }
                        (0, assert_1.strict)(sizeCounter == sizeOfRecordBlockInfo);
                        offset = 0;
                        i = 0;
                        sizeCounter = 0;
                        _i = 0, recordBlockInfoList_2 = recordBlockInfoList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < recordBlockInfoList_2.length)) return [3 /*break*/, 4];
                        value = recordBlockInfoList_2[_i];
                        sizeOfCompressed = value[0];
                        sizeOfDecompressed = value[1];
                        strtOfComprBlk = this._posOfFd;
                        recordBlockCompressed = this.ReadBuffer(sizeOfCompressed);
                        recordBlockType = recordBlockCompressed.slice(0, 4);
                        adler32 = (0, utils_1.Bytes2Num)('>I', recordBlockCompressed.slice(4, 8));
                        recordBlockTypeStr = recordBlockType.join();
                        return [4 /*yield*/, this.Decompress(recordBlockTypeStr, recordBlockCompressed, sizeOfDecompressed)];
                    case 2:
                        recordBlock = _a.sent();
                        // notice that adler32 return signed value
                        (0, assert_1.strict)(adler32 == (0, utils_1.Adler32FromBuffer)(recordBlock));
                        (0, assert_1.strict)(recordBlock.length == sizeOfDecompressed);
                        // split record block according to the offset info from key block
                        // for word, recordStart in this._KeyDict.items(){
                        while (i < this._keyList.length) {
                            value_2 = this._keyList[i];
                            recordStart = value_2[0];
                            keyText = value_2[1];
                            recordEnd = void 0;
                            // reach the end of current record block
                            if (recordStart - offset >= recordBlock.length) {
                                break;
                            }
                            // record end index
                            if (i < this._keyList.length - 1) {
                                recordEnd = this._keyList[i + 1][0];
                            }
                            else {
                                recordEnd = recordBlock.length + offset;
                            }
                            i += 1;
                            txtOfKey = new TextDecoder("UTF-8").decode(keyText);
                            this._wordMap.set(txtOfKey, [recordStart - offset, recordEnd - offset, strtOfComprBlk, sizeOfCompressed, sizeOfDecompressed]);
                        }
                        offset += recordBlock.length;
                        sizeCounter += sizeOfCompressed;
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        (0, assert_1.strict)(sizeCounter == sizeOfRecordBlock);
                        return [2 /*return*/];
                }
            });
        });
    };
    //TODO
    MDictBase.prototype.SubstituteStylesheet = function (txt) {
        // substitute stylesheet definition
        // let txt_list = txt.split('`\d + `');
        // let txt_tag = re.findall('`\d + `', txt);
        // let txt_styled = txt_list[0];
        // let style: string[] = new Array;
        // for (j, p in enumerate(txt_list.slice(1))) {
        //     style = this._stylesheet[txt_tag[j].slice(1, -1)];
        // }
        // if (p && p[-1] == '\n') {
        //     txt_styled = txt_styled + style[0] + p.rstrip() + style[1] + '\r\n';
        // } else {
        //     txt_styled = txt_styled + style[0] + p + style[1];
        // }
        // return txt_styled;
        throw new Error("Don't implement: SubstituteStylesheet");
        return "hello";
    };
    MDictBase.prototype.Decompress = function (typOfCompr, blkOfCompr, sizeOfDecompr) {
        return __awaiter(this, void 0, void 0, function () {
            var header;
            return __generator(this, function (_a) {
                if (typOfCompr == '0,0,0,0') { // no compression, \x00\x00\x00\x00
                    Promise.resolve(blkOfCompr.slice(8));
                }
                else if (typOfCompr == '1,0,0,0') { // lzo compression, \x01\x00\x00\x00
                    header = Buffer.alloc(5);
                    header[0] = 0xf0;
                    header.set((0, utils_1.Num2Bytes)('>I', sizeOfDecompr), 1);
                    // recordBlock = lzo.decompress(header + blkOfCompr.slice(8,));            
                    // return new Promise((resolve, reject) => {
                    // });
                    Promise.reject("Don't support lzo right now");
                }
                else if (typOfCompr == '2,0,0,0') { // zlib compression, \x02\x00\x00\x00
                    // recordBlock = zlib.decompress(blkOfCompr.slice(8,));
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            zlib.unzip(blkOfCompr.slice(8), function (error, result) {
                                if (!error) {
                                    (0, assert_1.strict)(result.length == sizeOfDecompr);
                                    resolve(result);
                                }
                                else {
                                    reject(error.message);
                                }
                            });
                        })];
                }
                return [2 /*return*/, Promise.reject("Don't suport type of compression: " + typOfCompr)];
            });
        });
    };
    return MDictBase;
}(DictBase_1.DictBase));
exports.MDictBase = MDictBase;
//# sourceMappingURL=MDictBase.js.map