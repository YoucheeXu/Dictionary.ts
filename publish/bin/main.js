"use strict";
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
// main.ts
var electron_1 = require("electron");
var MasterApp_1 = require("./MasterApp");
var argvs = {};
for (var _i = 0, _a = process.argv; _i < _a.length; _i++) {
    var argv = _a[_i];
    console.log(argv);
    var paraStrtIndex = argv.indexOf("--");
    if (paraStrtIndex >= 0) {
        var paraEndtIndex = argv.indexOf(" ");
        var para = "";
        if (paraEndtIndex > 0) {
            para = argv.substring(paraStrtIndex + 2, paraEndtIndex);
        }
        else {
            para = argv.substring(paraStrtIndex + 2);
        }
        if (para == "type") {
            argvs.typ = argv.substring(7);
        }
        else if (para == "q") {
            argvs.word = argv.substring(4);
        }
        else if (para == "dev") {
            argvs.bDev = true;
        }
    }
}
try {
    var myApp = new MasterApp_1.MasterApp();
    myApp.Run(argvs);
}
catch (e) {
    console.error("ElectronApp fatal error: " + e);
}
;
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
//-----------------------------------------------------------------
//监听与渲染进程的通信
electron_1.ipcMain.on('syncMsg', function (event, fun) {
    var paras = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paras[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var parasStr, command, _a, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parasStr = paras.join('`, `');
                    if (paras.length >= 1) {
                        parasStr = '`' + parasStr + '`';
                    }
                    command = "myApp.myApp." + fun + "(" + parasStr + ")";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    // event.returnValue = eval(command);
                    _a = event;
                    return [4 /*yield*/, eval(command)];
                case 2:
                    // event.returnValue = eval(command);
                    _a.returnValue = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    // console.error(`Fail to exec ${command} because ${(e as Error).message}`);
                    console.error("Fail to exec " + command + " because " + e_1);
                    event.returnValue = e_1;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
electron_1.ipcMain.on('dictApp', function (event, fun) {
    var paras = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paras[_i - 2] = arguments[_i];
    }
    var parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    var command = "myApp.myApp." + fun + "(" + parasStr + ")";
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        eval(command);
    }
    catch (e) {
        console.error("Fail to exec " + command + " because " + e.message);
    }
    event.returnValue = 'true';
});
electron_1.ipcMain.on('ReciteWordsApp', function (event, fun) {
    var paras = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        paras[_i - 2] = arguments[_i];
    }
    var parasStr = paras.join('`, `');
    if (paras.length >= 1) {
        parasStr = '`' + parasStr + '`';
    }
    var command = "myApp.myApp." + fun + "(" + parasStr + ")";
    // let command: string = `globalVar.app.${fun}(${parasStr})`;
    // console.log("command: " + command);
    try {
        eval(command);
    }
    catch (e) {
        console.error("Fail to exec " + command + " because " + e.message);
    }
    // asynchronous-reply
    // event.reply('log', 'pong');
    event.returnValue = 'true';
});
//# sourceMappingURL=main.js.map