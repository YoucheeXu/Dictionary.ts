/*
Copyright by https://github.com/zhansliu/writemdict

ripemd128.py - A simple ripemd128 library in pure Python.

Supports both Python 2 (versions >= 2.6) and Python 3.

Usage{
    from ripemd128 import ripemd128
    digest = ripemd128(b"The quick brown fox jumps over the lazy dog")
    assert(digest == b"\x3f\xa9\xb5\x7f\x05\x3c\x05\x3f\xbe\x27\x35\xb2\x38\x0d\xb5\x96")

*/

// import struct
import { strict as assert } from 'assert';
import { globalVar } from './globalInterface';
import { Bytes2Num, Num2Bytes, BufferConcat } from './utils';

// follows this description: http://homes.esat.kuleuven.be/~bosselae/ripemd/rmd128.txt

function f(j: number, x: number, y: number, z: number): number {
    assert(0 <= j && j < 64);
    if (j < 16) {
        return x ^ y ^ z;
    } else if (j < 32) {
        return (x & y) | (z & ~x);
    } else if (j < 48) {
        return (x | (0xffffffff & ~y)) ^ z;
    } else {
        return (x & z) | (y & ~z);
    }
}

function K(j: number): number {
    assert(0 <= j && j < 64);
    if (j < 16) {
        return 0x00000000;
    } else if (j < 32) {
        return 0x5a827999;
    } else if (j < 48) {
        return 0x6ed9eba1;
    } else {
        return 0x8f1bbcdc;
    }
}

function Kp(j: number): number {
    assert(0 <= j && j < 64);
    if (j < 16) {
        return 0x50a28be6;
    }
    else if (j < 32) {
        return 0x5c4dd124;
    }
    else if (j < 48) {
        return 0x6d703ef3;
    }
    else {
        return 0x00000000;
    }
}

function padandsplit(message: Buffer): number[][] {
    /*
    returns a two-dimensional array X[i][j] of 32-bit integers, where j ranges
    from 0 to 16.
    First pads the message to length in bytes is congruent to 56 (mod 64), 
    by first adding a byte 0x80, and then padding with 0x00 bytes until the
    message length is congruent to 56 (mod 64). Then adds the little-endian
    64-bit representation of the original length. Finally, splits the result
    up into 64-byte blocks, which are further parsed as 32-bit integers.
    */
    let len = message.length;
    // let padlength = 64 - ((len - 56) % 64); // minimum padding is 1!
    let LenOfPad = ((len % 64) < 56 ? 56 : 120) - (len % 64); // minimum padding is 1!
    globalVar.Logger.debug(`Len of padding = ${LenOfPad}`);
    let bufOfPad = Buffer.alloc(LenOfPad);
    bufOfPad[0] = 0x80;
    let msgPad = BufferConcat(message, bufOfPad);

    // ending with check bits (= little endian 64-bit int, 8 * data.length)
    // let end = Num2Bytes("<Q", len * 8);
    len = len << 3;
    let end32 = new Uint32Array([len, len >> 31 >> 1]);
    let end = Buffer.from(end32.buffer);
    globalVar.Logger.debug(`End of Msg = ${end.join()}`);

    let newMsg = BufferConcat(msgPad, end);
    let lenOfMsg = newMsg.length;
    globalVar.Logger.debug(`Len of Msg after padding = ${lenOfMsg}`);
    globalVar.Logger.debug(`msg after padding = ${newMsg.join()}`);
    assert(newMsg.length % 64 == 0);

    // return [
    //     [
    //         struct.unpack("<L", message[i + j: i + j + 4])[0]
    //            for (j in range(0, 64, 4))
    //          ]
    // for i in range(0, len(message), 64)
    //        ]
    let X: number[][] = [];
    for (let i = 0; i < newMsg.length; i += 64) {
        X[i] = [];
        // X.push([]);
    }

    for (let i = 0; i < newMsg.length; i += 64) {
        for (let j = 0; j < 64; j += 4) {
            let value = Bytes2Num("<L", newMsg.slice(i + j, i + j + 4));
            X[i / 64][j / 4] = value;
        }
    }
    return X;
}


function add(firstNum: number, ...args: number[]) {
    let sum = firstNum;
    for (let num of args) {
        sum += num;
    }
    return sum & 0xffffffff;
}

// swap high and low bits of a 32-bit int.
function rol(s: number, x: number) {
    assert(s < 32);
    // globalVar.Logger.debug(`s = ${s} x = ${x}`);
    // >>> 无符号右移
    return (x << s | x >>> (32 - s)) & 0xffffffff;
}

let r = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
    3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
    1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2];
let rp = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
    6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
    15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
    8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14];
let s = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
    7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
    11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
    11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12];
let sp = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
    9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
    9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
    15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8];

export function ripemd128(message: Buffer): Buffer {
    let hash = new Uint32Array([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]);
    let X = padandsplit(message);
    globalVar.Logger.debug(`X = ${X}`);
    let lenOfX = X.length;
    globalVar.Logger.debug(`lenOfX = ${lenOfX}`);
    let A, B, C, D, Ap, Bp, Cp, Dp;         // TODO; convert to uint32
    for (let i = 0; i < lenOfX; i++) {
        [A, B, C, D] = [hash[0], hash[1], hash[2], hash[3]];
        [Ap, Bp, Cp, Dp] = [hash[0], hash[1], hash[2], hash[3]];

        for (let j = 0; j < 64; j++) {
            let sj = s[j]
            // globalVar.Logger.debug(`sj = ${sj}`);
            let fj = f(j, B, C, D);
            // globalVar.Logger.debug(`fj = ${fj}`);
            let xj = X[i][r[j]];
            // globalVar.Logger.debug(`xj = ${xj}`);
            let kj = K(j);
            // globalVar.Logger.debug(`kj = ${kj}`);
            let T = rol(sj, add(A, fj, xj, kj));
            // globalVar.Logger.debug(`T1 = ${T}`);
            [A, D, C, B] = [D, C, B, T];
            T = rol(sp[j], add(Ap, f(63 - j, Bp, Cp, Dp), X[i][rp[j]], Kp(j)));
            // globalVar.Logger.debug(`T2 = ${T}`);
            [Ap, Dp, Cp, Bp] = [Dp, Cp, Bp, T];
        }
        globalVar.Logger.debug(`A = ${A}`);
        globalVar.Logger.debug(`Ap = ${Ap}`);
        globalVar.Logger.debug(`B = ${B}`);
        globalVar.Logger.debug(`Bp = ${Bp}`);
        globalVar.Logger.debug(`C = ${C}`);
        globalVar.Logger.debug(`Cp = ${Cp}`);
        globalVar.Logger.debug(`D = ${D}`);
        globalVar.Logger.debug(`Dp = ${Dp}`);
        let T = add(hash[1], C, Dp);
        hash[1] = add(hash[2], D, Ap);
        hash[2] = add(hash[3], A, Bp);
        hash[3] = add(hash[0], B, Cp);
        hash[0] = T;
    }
    globalVar.Logger.debug(`h0 = ${hash[0]}`);
    globalVar.Logger.debug(`h1 = ${hash[1]}`);
    globalVar.Logger.debug(`h2 = ${hash[2]}`);
    globalVar.Logger.debug(`h3 = ${hash[3]}`);
    // return Num2Bytes("<LLLL", hash[0], hash[1], hash[2], hash[3]);
    let h0Bytes = Num2Bytes('<L', hash[0]);
    globalVar.Logger.debug(`h0Bytes = ${h0Bytes.join()}`);
    let h1Bytes = Num2Bytes('<L', hash[1]);
    globalVar.Logger.debug(`h1Bytes = ${h1Bytes.join()}`);
    let h2Bytes = Num2Bytes('<L', hash[2]);
    globalVar.Logger.debug(`h2Bytes = ${h2Bytes.join()}`);
    let h3Bytes = Num2Bytes('<L', hash[3]);
    globalVar.Logger.debug(`h3Bytes = ${h3Bytes.join()}`);

    return BufferConcat(h0Bytes, h1Bytes, h2Bytes, h3Bytes);
}

// function hexstr(bstr) {
//     return "".join("{0:02x}".format(b) for b in bstr);
// }
