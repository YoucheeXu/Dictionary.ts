// MDictBase.ts
import * as path from "path";
import { DictBase } from "./DictBase";

import { ripemd128 } from "../utils/ripemd128";
// import { Salsa20 } from "../utils/pureSalsa20";

// zlib compression is used for engine version >=2.0
import * as zlib from "zlib";

// LZO compression is used for engine version < 2.0
// import * as lzo from "lzo-decompress";

import * as xml from "fast-xml-parser";

// To use the promise-based APIs:
// import * as fs from 'fs/promises';

// To use the callback and sync APIs:
import * as fs from 'fs';

import { rejects, strict as assert } from 'assert';

import { globalVar } from "../utils/globalInterface";
import { Bytes2Num, Num2Bytes, BufferConcat, Adler32FromBuffer, RemoveDir } from "../utils/utils";

// read from mdd, mdx
export class MDictBase extends DictBase {
    private _tempDictDir = "";

    private _fd: any;
    private _posOfFd = 0;

    private _version: number;
    private _encoding = "";
    private _bSubstyle: boolean;

    private _encrypt: number = 0;

    private _stylesheet = new Map();
    private _recordBlockOffset: any;
    private _formatOfNumber: string;

    private _keyBlockOffset: any;
    private _numOfEntries: any;

    private _numOfWidth: number;

    private _keyList = new Array<[number, Uint8Array]>();

    // <word, [recordStart, recordEnd, compressBlockStart, compressedSize, decompressedSize]>;
    private _wordMap = new Map<string, [number, number, number, number, number]>();
    private _wordList: string[];

    private _tagOfHeader: any;

    constructor(name: string, srcFile: string, readonly _bMdd = false, readonly _passcode?: [string, string]) {
        super(name, srcFile);

        let filePath = path.dirname(srcFile);
        let fileName = "";
        if (this._bMdd) {
            this._encoding = 'UTF-16';
            fileName = path.basename(srcFile, ".mdd");
        } else {
            this._encoding = "";
            fileName = path.basename(srcFile, ".mdx");
        }

        // console.log(fileName);
        this._tempDictDir = path.join(filePath, fileName);

        let _this = this;
        if (fs.existsSync(_this._tempDictDir) == false) {
            fs.mkdir(_this._tempDictDir, function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('Success to create folder: ' + _this._tempDictDir);
            })
        }

        this._bSubstyle = false;
    }

    public async Open() {

        this._fd = fs.openSync(this._szSrcFile, 'r');

        if (this._fd == -1) {
            throw new Error(`Can't open ${this._szName}`);
        }

        this._tagOfHeader = this.ReadHeader();

        this._keyList = await this.ReadKeys();

        if (this._bMdd) {
            await this.DecodeMddRecordBlock();
        } else {
            await this.DecodeMdxRecordBlock();
        }

        this._wordList = Array.from(this._wordMap.keys());
    }

    public async query_word(word: string): Promise<[number, string]> {
        let dictFile = path.join(this._tempDictDir, word + ".html");
        if (fs.existsSync(dictFile) == true) {
            return Promise.resolve([1, dictFile]);
        }
        else if (this._wordList.indexOf(word) != -1) {
            let value = this._wordMap.get(word);
            let recordStart = 0, recordEnd = 0, compressBlockStart = 0, compressBlcokSize = 0, decompressSize = 0;
            if (value) {
                recordStart = value[0];
                recordEnd = value[1];
                compressBlockStart = value[2];
                compressBlcokSize = value[3];
                decompressSize = value[4];
            } else {
                return [-1, `There is no ${word} in ${this._szName}`];
            }

            // this._fd.seekSync(compressBlockStart);
            let recordBlockCompressed = this.ReadBuffer(compressBlcokSize, compressBlockStart);
            // 4 bytes indicates block compression type
            let recordBlockType = recordBlockCompressed.slice(0, 4);
            // 4 bytes adler checksum of uncompressed content
            let adler32 = Bytes2Num('>I', recordBlockCompressed.slice(4, 8));

            let recordBlock: Buffer;
            let recordBlockTypeStr = recordBlockType.join();
            recordBlock = await this.Decompress(recordBlockTypeStr, recordBlockCompressed, decompressSize);

            // notice that adler32 return signed value
            assert(Adler32FromBuffer(recordBlock) == adler32);

            assert(recordBlock.length == decompressSize);

            let recordRaw = recordBlock.slice(recordStart, recordEnd);
            // convert to utf-8
            let record = new TextDecoder(this._encoding).decode(recordRaw);
            // record = record.trim('\x00');
            // substitute styles
            if (this._bSubstyle && this._stylesheet) {
                record = this.SubstituteStylesheet(record);
            }

            let html = "<!DOCTYPE html><html><body>" + record + "</body></html>";
            fs.writeFileSync(dictFile, html);

            return [1, dictFile];
        } else {
            return [-1, "Word isn't in DictBase."];
        }
    }

    public get_wordsLst(word: string, wdMatchLst: string[]): any {
        let wordLike = "^" + word + ".*";
        for (let word of this._wordList) {
            let match = word.match(wordLike);
            if (match) {
                wdMatchLst.push(word);
            }
        }

        if (wdMatchLst.length >= 1) {
            return true;
        } else {
            return false;
        }
    }

    public CheckAndAddFile(localFile: string): void {

    }

    public del_word(word: string): boolean {
        throw new Error("Don't support to delete word: " + word);
        return false;
    }

    public async Close(): Promise<[boolean, string]> {
        let ret = false;
        let msg = "";
        let msg2 = "";
        try {
            fs.closeSync(this._fd);
            ret = true;
        } catch (e) {
            msg = (e as Error).message;
        }

        RemoveDir(this._tempDictDir);
        if (fs.existsSync(this._tempDictDir) == false) {
            msg2 = `OK to remove ${this._tempDictDir}`
        } else {
            msg2 = `Fail to remove ${this._tempDictDir}`;
            ret = false;
        }

        if (msg.length != 0) {
            msg = msg + ";" + msg2;
        } else {
            msg = msg2;
        }
        return [ret, msg];
    }

    private ReadHeader() {
        let num = 0;
        // number of bytes of header text, big-endian, integer
        let bufOfSizeOfHeader = this.ReadBuffer(4);
        globalVar.Logger.debug(`sizeOfHeaderRaw = ${bufOfSizeOfHeader.join()}`);

        let sizeOfHeader = Bytes2Num(">I", bufOfSizeOfHeader);
        globalVar.Logger.debug(`sizeOfHeader = ${sizeOfHeader}`);

        let bufOfBytesOfHeader = this.ReadBuffer(sizeOfHeader);

        // 4 bytes: adler32 checksum of header, in little endian
        let bufOfAdler32 = this.ReadBuffer(4);
        globalVar.Logger.debug(`adler32Raw = ${bufOfAdler32.join()}`);
        let adler32 = Bytes2Num("<I", bufOfAdler32);
        globalVar.Logger.debug(`adler32 = ${adler32}`);
        assert(adler32 == Adler32FromBuffer(bufOfBytesOfHeader));

        // mark down key block offset
        // this._keyBlockOffset = this._posOfFd;
        globalVar.Logger.debug(`offsetOfKeyBlk = ${this._posOfFd}`);

        // header text in utf-16 encoding ending with '\x00\x00'
        let decoder = new TextDecoder('UTF-16LE');
        let textOfHeader = decoder.decode(bufOfBytesOfHeader.slice(-2).buffer);
        globalVar.Logger.debug(`textOfHeader = ${textOfHeader}`);
        let tagOfheader = this.ParseHeader(textOfHeader)
        globalVar.Logger.debug(tagOfheader)

        if (!this._encoding) {
            let encoding = tagOfheader["Encoding"];
            if (['GBK', 'GB2312'].indexOf(encoding) != -1) {
                encoding = 'GB18030';
            }
            this._encoding = encoding;
        }
        globalVar.Logger.debug(`Encoding = ${this._encoding}`);

        // encryption flag
        //   0x00 - no encryption
        //   0x01 - encrypt record block
        //   0x02 - encrypt key info block
        let encrypted = tagOfheader.Encrypted;
        if (encrypted) {
            if (encrypted == 'No') {
                this._encrypt = 0;
            } else if (encrypted == 'Yes') {
                this._encrypt = 1;
            } else {
                this._encrypt = Math.round(encrypted);
            }
        }

        globalVar.Logger.debug(`Encrypted: ${this._encrypt}`);

        // stylesheet attribute if present takes form of{
        //   style_number // 1-255
        //   style_begin  // or ''
        //   style_end	// or ''
        // store stylesheet in dict in the form of
        // {'number' : ('style_begin', 'style_end')}
        let styleSheet: string = tagOfheader.StyleSheet
        if (styleSheet && styleSheet != '') {
            let lines = styleSheet.split(/[\r\n]/g);
            for (let i = 0; i < lines.length; i += 3) {
                this._stylesheet.set(lines[i], [lines[i + 1], lines[i + 2]]);
                this._bSubstyle = true;
            }
        } else {
            this._bSubstyle = false;
        }
        // globalVar.Logger.debug("stylesheet = " + str(this._Stylesheet));

        // before version 2.0, number is 4 bytes integer
        // version 2.0 and above uses 8 bytes
        this._version = tagOfheader.GeneratedByEngineVersion;
        globalVar.Logger.debug(`version of Dict = ${this._version}`);
        if (this._version < 2.0) {
            this._numOfWidth = 4;
            this._formatOfNumber = '>I';
        } else {
            this._numOfWidth = 8
            this._formatOfNumber = '>Q';
        }

        return tagOfheader;
    }

    private Salsa_decrypt(ciphertext: Uint8Array, encrypt_key: Uint8Array) {
        // let temp = new Buffer.alloc(8); // "\x00" * 8
        // let s20 = new Salsa20(encrypt_key, temp, 8);
        // return s20.EncryptBytes(ciphertext);
        return Buffer.alloc(4);
    }

    private Decrypt_regcode_by_deviceid(reg_code: string, deviceid: string) {
        // let deviceid_digest = ripemd128(deviceid);
        // let temp = Buffer.alloc(8); // "\x00" * 8
        // let s20 = new Salsa20(deviceid_digest, temp, 8);
        // let encrypt_key = s20.EncryptBytes(reg_code);
        // return encrypt_key;
        return Buffer.alloc(4);
    }

    private Decrypt_regcode_by_email(reg_code: string, email: string) {
        // let email_digest = ripemd128(email.decode().encode('utf-16-le'));
        // let temp = new Uint8Array(8); // "\x00" * 8
        // let s20 = new Salsa20(email_digest, temp, 8);
        // let encrypt_key = s20.EncryptBytes(reg_code);
        // return encrypt_key;
        return Buffer.alloc(4);
    }

    private async ReadKeys() {
        // this._fd.seekSyc(this._keyBlockOffset);

        // the following numbers could be encrypted
        let numOfBytes = 0;
        if (this._version >= 2.0) {
            numOfBytes = this._numOfWidth * 5;
        } else {
            numOfBytes = this._numOfWidth * 4;
        }

        let block = this.ReadBuffer(numOfBytes);

        if (this._encrypt & 1) {
            if (this._passcode == null) {
                throw new Error('user identification is needed to read encrypted file');
            }
            let regcode, userid;
            [regcode, userid] = this._passcode;
            // if isinstance(userid, unicode){
            //     userid = userid.encode('utf8');
            // }
            let encrypted_key;
            if (this._tagOfHeader['RegisterBy'] == 'EMail') {
                encrypted_key = this.Decrypt_regcode_by_email(regcode, userid);
            } else {
                encrypted_key = this.Decrypt_regcode_by_deviceid(regcode, userid);
            }

            block = this.Salsa_decrypt(block, encrypted_key);
        }

        // decode this block
        let offset = 0;

        // number of key blocks
        let numOfKeyBlocks = Bytes2Num(this._formatOfNumber, block, offset, this._numOfWidth);
        globalVar.Logger.debug(`Number of Key Blocks = ${numOfKeyBlocks}`);

        // number of entries
        offset += this._numOfWidth;
        this._numOfEntries = Bytes2Num(this._formatOfNumber, block, offset, this._numOfWidth);;
        globalVar.Logger.debug(`Number of Entries = ${this._numOfEntries}`);

        // number of bytes of key block info after decompression
        offset += this._numOfWidth;
        let sizeOfkeyBlockInfoDecomp = 0;
        if (this._version >= 2.0) {
            // Number of Bytes After Decompression
            sizeOfkeyBlockInfoDecomp = Bytes2Num(this._formatOfNumber, block, offset, this._numOfWidth);
            globalVar.Logger.debug(`Number of Bytes of key block info After Decompression = ${sizeOfkeyBlockInfoDecomp}`);
        }

        // number of bytes of key block info
        offset += this._numOfWidth;
        let sizeOfkeyBlockInfo = Bytes2Num(this._formatOfNumber, block, offset, this._numOfWidth);
        globalVar.Logger.debug(`Number of bytes of key block info = ${sizeOfkeyBlockInfo}`);

        // number of bytes of key block
        offset += this._numOfWidth;
        let sizeOfKeyBlock = Bytes2Num(this._formatOfNumber, block, offset, this._numOfWidth);
        globalVar.Logger.debug(`Number of bytes of key block = ${sizeOfKeyBlock}`);

        // 4 bytes: adler checksum of previous 5 numbers
        if (this._version >= 2.0) {
            let adler32 = Bytes2Num('>I', this.ReadBuffer(4));
            globalVar.Logger.debug(`adler checksum of previous 5 numbers = ${adler32}`)
            assert(adler32 == Adler32FromBuffer(block));
        }

        // read key block info, which indicates key block's compressed and decompressed size
        let keyBlockInfo = this.ReadBuffer(sizeOfkeyBlockInfo);
        let keyBlockInfoList = await this.DecodeKeyBlockInfo(keyBlockInfo, sizeOfkeyBlockInfoDecomp);
        assert(numOfKeyBlocks == keyBlockInfoList.length);

        // read key block
        let keyBlockCompressed = this.ReadBuffer(sizeOfKeyBlock);
        // globalVar.Logger.debug(`keyBlockCompressed = ${ keyBlockCompressed.join() }`);

        // extract key block
        let keyList = await this.DecodeKeyBlocks(keyBlockCompressed, keyBlockInfoList);

        // this._recordBlockOffset = this._fd.tellSync();

        return keyList;
    }

    /*
    extract attributes from <Dict attr="value" ... >
    */
    private ParseHeader(textOfHeader: string) {
        let options = {
            attributeNamePrefix: "",
            ignoreAttributes: false,
        };
        try {
            var jsonObj = xml.parse(textOfHeader, options, true);
            return (JSON.parse(JSON.stringify(jsonObj))).Dictionary;
        } catch (e) {
            console.log((e as Error).message)
        }
    }

    private ReadBuffer(len: number, offset?: number): Buffer {
        let buf = Buffer.alloc(len);
        let pos: any;
        if (offset) {
            pos = offset;
        } else {
            pos = null;
            this._posOfFd += len;
        }
        let num = fs.readSync(this._fd, buf, 0, len, pos);
        assert(num == len);
        return buf;
    }

    private ReadNumber() {
        let buf = this.ReadBuffer(this._numOfWidth);
        return Bytes2Num(this._formatOfNumber, buf);
    }

    private async DecodeKeyBlockInfo(keyBlockInfoCompressed: Buffer, sizeOfKeyBlockInfoDecomp: number) {
        // let keyBlockInfo = Buffer.alloc(sizeOfKeyBlockInfoDecomp);
        let keyBlockInfo: Buffer;
        if (this._version >= 2) {
            let typOfCompr = keyBlockInfoCompressed.slice(0, 4).join();
            globalVar.Logger.debug(`Type of compression of keyBlockInfo = ${typOfCompr}`);
            assert(typOfCompr == '2,0,0,0');   // zlib compression, \x02\x00\x00\x00
            // decrypt if needed
            let infoOfKeyBlockDecrypted: Buffer;
            if (this._encrypt & 0x02) {
                infoOfKeyBlockDecrypted = this.MdxDecrypt(keyBlockInfoCompressed);
            } else {
                infoOfKeyBlockDecrypted = keyBlockInfoCompressed;
            }

            globalVar.Logger.debug(`infoOfKeyBlockDecrypted = ${infoOfKeyBlockDecrypted.join()}`);
            keyBlockInfo = await this.Decompress(typOfCompr, infoOfKeyBlockDecrypted, sizeOfKeyBlockInfoDecomp);

            // adler checksum
            let adler32 = Bytes2Num('>I', keyBlockInfoCompressed.slice(4, 8));
            globalVar.Logger.debug(`adler32 of keyBlockInfo = ${adler32}`);
            assert(adler32 == Adler32FromBuffer(keyBlockInfo));
        } else {
            // no compression and encrypt
            keyBlockInfo = keyBlockInfoCompressed;
        }
        globalVar.Logger.debug(`keyBlockInfo = ${keyBlockInfo.join()}`);
        // decode
        let keyBlockInfoList = new Array<[number, number]>();   // [sizeOfKeyBlkCompreSize, sizeOfKeyBlkDecomprSize]
        let numEntries = 0;
        let i = 0;
        let byteFormat;
        let byteWidth;
        let sizeOfTextTerm;
        if (this._version >= 2) {
            byteFormat = '>H';
            byteWidth = 2;
            sizeOfTextTerm = 1;
        } else {
            byteFormat = '>B';
            byteWidth = 1;
            sizeOfTextTerm = 0;
        }

        let lenOfKeyBlockInfo = keyBlockInfo.length;
        globalVar.Logger.debug(`lenOfKeyBlockInfo = ${lenOfKeyBlockInfo}`);
        while (i < lenOfKeyBlockInfo) {
            // number of entries in current key block
            numEntries += Bytes2Num(this._formatOfNumber, keyBlockInfo.slice(i, i + this._numOfWidth));
            i += this._numOfWidth;
            // text head size
            let sizeOftextHead = Bytes2Num(byteFormat, keyBlockInfo.slice(i, i + byteWidth));
            i += byteWidth;
            // text head
            if (this._encoding != 'UTF-16') {
                i += sizeOftextHead + sizeOfTextTerm;
            } else {
                i += (sizeOftextHead + sizeOfTextTerm) * 2;
            }
            // text tail size
            let textTailSize = Bytes2Num(byteFormat, keyBlockInfo.slice(i, i + byteWidth));
            i += byteWidth;
            // text tail
            if (this._encoding != 'UTF-16') {
                i += textTailSize + sizeOfTextTerm;
            } else {
                i += (textTailSize + sizeOfTextTerm) * 2;
            }

            // key block compressed size
            let sizeOfKeyBlkCompreSize = Bytes2Num(this._formatOfNumber, keyBlockInfo.slice(i, i + this._numOfWidth));
            i += this._numOfWidth
            // key block decompressed size
            let sizeOfKeyBlkDecomprSize = Bytes2Num(this._formatOfNumber, keyBlockInfo.slice(i, i + this._numOfWidth));
            i += this._numOfWidth;

            keyBlockInfoList.push([sizeOfKeyBlkCompreSize, sizeOfKeyBlkDecomprSize]);

            // assert(numEntries == this._numOfEntries)
        }
        globalVar.Logger.debug(`keyBlockInfoList = ${keyBlockInfoList}`);
        return keyBlockInfoList;
    }

    private FastDecrypt(data: Buffer, key: Buffer): Buffer {
        let previous = 0x36;
        for (let i = 0; i < data.length; i++) {
            let t = (data[i] >>> 4 | data[i] << 4) & 0xff;
            t = t ^ previous ^ (i & 0xff) ^ key[i % key.length];
            previous = data[i];
            data[i] = t;
        }
        globalVar.Logger.debug(`FastDecrypt = ${data.join()}`);
        return data;
    }

    private MdxDecrypt(compBlock: Buffer) {
        let tail = Num2Bytes('<L', 0x3695);
        globalVar.Logger.debug(`Tail of key of compBlock = ${tail.join()}`);
        let msg = compBlock.slice(4, 8);
        globalVar.Logger.debug(`msg = ${msg.join()}`);
        let key = ripemd128(BufferConcat(msg, tail));
        globalVar.Logger.debug(`Key of compBlock = ${key.join()}`);
        return BufferConcat(compBlock.slice(0, 8), this.FastDecrypt(compBlock.slice(8), key));
    }

    private async DecodeKeyBlocks(keyBlockCompressed: Buffer, keyBlockInfoList: Array<[number, number]>) {
        let keyList = new Array<[number, Uint8Array]>();
        let i = 0;
        for (let value of keyBlockInfoList) {
            let sizeOfcompressed = value[0];
            let sizeOfDecompressed = value[1];
            let start = i;
            let end = i + sizeOfcompressed;
            // 4 bytes : compression type
            let keyBlockType = keyBlockCompressed.slice(start, start + 4);
            // 4 bytes : adler checksum of decompressed key block
            let adler32 = Bytes2Num('>I', keyBlockCompressed.slice(start + 4, start + 8));

            let keyBlockTypeStr = keyBlockType.join();
            let keyBlock = await this.Decompress(keyBlockTypeStr, keyBlockCompressed.slice(start, end), sizeOfDecompressed);
            assert(adler32 == Adler32FromBuffer(keyBlock));

            // extract one single key block into a key list
            let keyList1 = this.DecodeKeyBlock(keyBlock);
            keyList = keyList.concat(keyList1);

            i += sizeOfcompressed;
        }
        globalVar.Logger.debug(`len of keyList = ${keyList.length}`);
        return keyList;
    }

    private DecodeKeyBlock(keyBlock: Buffer) {
        let keyList = new Array<[number, Uint8Array]>();
        let keyStartIndex = 0;
        let keyEndIndex = 0;
        while (keyStartIndex < keyBlock.length) {
            // the corresponding record's offset in record block
            let keyId = Bytes2Num(this._formatOfNumber, keyBlock.slice(keyStartIndex, keyStartIndex + this._numOfWidth));
            let delimiter;
            let width;
            // key text ends with '\x00'
            if (this._encoding == 'UTF-16') {
                delimiter = '0,0';     // \x00\x00
                width = 2;
            } else {
                delimiter = '0';     // \x00
                width = 1;
            }
            let i = keyStartIndex + this._numOfWidth;
            while (i < keyBlock.length) {
                if (keyBlock.slice(i, i + width).join() == delimiter) {
                    keyEndIndex = i;
                    break;
                }
                i += width;
            }
            let keyTextRaw = keyBlock.slice(keyStartIndex + this._numOfWidth, keyEndIndex);
            let keyText1 = new TextDecoder(this._encoding).decode(keyTextRaw);
            // globalVar.Logger.debug(`keyText1 = ${ keyText1 }`);
            // TODO: why encode?
            let keyText2 = new TextEncoder().encode(keyText1);
            keyStartIndex = keyEndIndex + width;
            keyList.push([keyId, keyText2]);
        }
        return keyList;
    }

    private async DecodeMddRecordBlock() {
        // this._fd.seekSync(this._recordBlockOffset);

        let numRecordBlocks = this.ReadNumber();
        let numEntries = this.ReadNumber();
        assert(numEntries == this._numOfEntries);
        let sizeOfRecordBlockInfo = this.ReadNumber();
        let sizeOfRecordBlock = this.ReadNumber();

        // record block info section
        let recordBlockInfoList = new Array();
        let sizeCounter = 0;
        for (let i = 0; i < numRecordBlocks; i++) {
            let compressedSize = this.ReadNumber();
            let decompressedSize = this.ReadNumber();
            recordBlockInfoList.push([compressedSize, decompressedSize]);
            sizeCounter += this._numOfWidth * 2;
        }
        assert(sizeCounter == sizeOfRecordBlockInfo);

        // actual record block
        let offset = 0;
        let i = 0;
        sizeCounter = 0;
        for (let value of recordBlockInfoList) {
            let compressedSize = value[0];
            let decompressedSize = value[0];
            let compressBlockStart = this._fd.tellSync();
            let recordBlockCompressed = this.ReadBuffer(compressedSize);
            // 4 bytes: compression type
            let recordBlockType = recordBlockCompressed.slice(0, 4);
            // 4 bytes: adler32 checksum of decompressed record block
            let adler32 = Bytes2Num('>I', recordBlockCompressed.slice(4, 8));

            let recordBlockTypeStr = recordBlockType.join('');
            let recordBlock = await this.Decompress(recordBlockTypeStr, recordBlockCompressed, decompressedSize);
            // notice that adler32 return signed value
            assert(adler32 == Adler32FromBuffer(recordBlock));

            assert(recordBlock.length == decompressedSize);

            // split record block according to the offset info from key block
            while (i < this._keyList.length) {
                let value = this._keyList[i];
                let recordStart = value[0];
                let keyText = value[1];
                // reach the end of current record block
                if (recordStart - offset >= recordBlock.length) {
                    break;
                }
                // record end index
                let recordEnd = 0;
                if (i < this._keyList.length - 1) {
                    recordEnd = this._keyList[i + 1][0];
                } else {
                    recordEnd = recordBlock.length + offset;
                }
                i += 1;

                // yield keyText, data
                let txtOfKey = new TextDecoder("UTF-8").decode(keyText);
                this._wordMap.set(txtOfKey, [recordStart - offset, recordEnd - offset, compressBlockStart, compressedSize, decompressedSize]);
            }

            offset += recordBlock.length;
            sizeCounter += compressedSize;
        }
        assert(sizeCounter == sizeOfRecordBlock);
    }

    private async DecodeMdxRecordBlock() {
        // this._fd.seekSync(this._recordBlockOffset);
        globalVar.Logger.debug(`offsetOfRecordBlk = ${this._posOfFd}`);
        let numOfRecordBlocks = this.ReadNumber();
        globalVar.Logger.debug(`Number of Record Blocks = ${numOfRecordBlocks}`);

        let numEntries = this.ReadNumber();
        assert(numEntries == this._numOfEntries);

        let sizeOfRecordBlockInfo = this.ReadNumber();
        globalVar.Logger.debug(`sizeOfRecordBlockInfo = ${sizeOfRecordBlockInfo}`);

        let sizeOfRecordBlock = this.ReadNumber();
        globalVar.Logger.debug(`sizeOfRecordBlock = ${sizeOfRecordBlock}`);

        globalVar.Logger.debug(`mid of file = ${this._posOfFd}`);

        // record block info section
        let recordBlockInfoList = new Array<[number, number]>();
        let sizeCounter = 0;
        for (let i = 0; i < numOfRecordBlocks; i++) {
            let sizeOfcompressed = this.ReadNumber();
            let sizeOfDecompressed = this.ReadNumber();
            recordBlockInfoList.push([sizeOfcompressed, sizeOfDecompressed]);
            sizeCounter += this._numOfWidth * 2;
        }
        assert(sizeCounter == sizeOfRecordBlockInfo);

        // actual record block data
        let offset = 0;
        let i = 0;
        sizeCounter = 0;
        for (let value of recordBlockInfoList) {
            let sizeOfCompressed = value[0];
            let sizeOfDecompressed = value[1];

            let strtOfComprBlk = this._posOfFd;
            // globalVar.Logger.debug(`strtOfComprBlk = ${strtOfComprBlk}`);
            let recordBlockCompressed = this.ReadBuffer(sizeOfCompressed);
            // 4 bytes indicates block compression type
            let recordBlockType = recordBlockCompressed.slice(0, 4);
            // 4 bytes adler checksum of uncompressed content
            let adler32 = Bytes2Num('>I', recordBlockCompressed.slice(4, 8));

            let recordBlockTypeStr = recordBlockType.join();
            let recordBlock = await this.Decompress(recordBlockTypeStr, recordBlockCompressed, sizeOfDecompressed);

            // notice that adler32 return signed value
            assert(adler32 == Adler32FromBuffer(recordBlock));

            assert(recordBlock.length == sizeOfDecompressed);

            // split record block according to the offset info from key block
            // for word, recordStart in this._KeyDict.items(){
            while (i < this._keyList.length) {
                let value = this._keyList[i];
                let recordStart = value[0];
                let keyText = value[1];
                let recordEnd;
                // reach the end of current record block
                if (recordStart - offset >= recordBlock.length) {
                    break;
                }
                // record end index
                if (i < this._keyList.length - 1) {
                    recordEnd = this._keyList[i + 1][0];
                } else {
                    recordEnd = recordBlock.length + offset;
                }
                i += 1;

                let txtOfKey = new TextDecoder("UTF-8").decode(keyText);
                this._wordMap.set(txtOfKey, [recordStart - offset, recordEnd - offset, strtOfComprBlk, sizeOfCompressed, sizeOfDecompressed]);
            }

            offset += recordBlock.length;
            sizeCounter += sizeOfCompressed;
        }
        assert(sizeCounter == sizeOfRecordBlock);
    }

    //TODO
    private SubstituteStylesheet(txt: string) {
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
    }

    private async Decompress(typOfCompr: string, blkOfCompr: Buffer, sizeOfDecompr: number): Promise<Buffer> {
        if (typOfCompr == '0,0,0,0') {    // no compression, \x00\x00\x00\x00
            Promise.resolve(blkOfCompr.slice(8));
        } else if (typOfCompr == '1,0,0,0') {   // lzo compression, \x01\x00\x00\x00
            // let header = '\xf0' + pack('>I', sizeOfDecompr);
            let header = Buffer.alloc(5);
            header[0] = 0xf0;
            header.set(Num2Bytes('>I', sizeOfDecompr), 1);
            // recordBlock = lzo.decompress(header + blkOfCompr.slice(8,));            
            // return new Promise((resolve, reject) => {
            // });
            Promise.reject("Don't support lzo right now");
        } else if (typOfCompr == '2,0,0,0') {   // zlib compression, \x02\x00\x00\x00
            // recordBlock = zlib.decompress(blkOfCompr.slice(8,));
            return new Promise((resolve, reject) => {
                zlib.unzip(blkOfCompr.slice(8), (error: Error | null, result: Buffer) => {
                    if (!error) {
                        assert(result.length == sizeOfDecompr);
                        resolve(result);
                    } else {
                        reject(error.message);
                    }
                });
            });
        }
        return Promise.reject(`Don't suport type of compression: ${typOfCompr}`);
    }
}