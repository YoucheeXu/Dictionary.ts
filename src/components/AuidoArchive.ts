// AuidoArchive.ts
// import { fs, path } from "electron";
import * as fs from "fs";
import * as path from "path";
import { RemoveDir } from "../utils/utils";
import { ZipArchive } from "./ZipArchive";
import { globalVar } from "../utils/globalInterface";

export class AuidoArchive {
    private bWritable: boolean = false;
    private audioArchive: string;
    private audioZip: ZipArchive;
    private tempAudioDir: string;

    constructor(readonly audioSrc: string, readonly compression: string, readonly compresslevel: string) {
        this.audioArchive = path.basename(audioSrc);
        // console.log(this.audioArchive);
        let filePath = path.dirname(audioSrc);
        let fileName = path.basename(audioSrc, ".zip");
        // console.log(fileName);
        this.tempAudioDir = path.join(filePath, fileName);
        // console.log(this.tempAudioDir);
        let _this = this;
        if (fs.existsSync(_this.tempAudioDir) == false) {
            fs.mkdir(_this.tempAudioDir, function (error) {
                if (error) {
                    console.log(error);
                    return false;
                }
                console.log('Success to create folder: ' + _this.tempAudioDir);
            })
        }
        // gLogger.info("tempAudioDir: " + this.tempAudioDir);

        this.audioZip = new ZipArchive(audioSrc, compression, compresslevel);
    }

    public close(): void {
        RemoveDir(this.tempAudioDir);
        if (fs.existsSync(this.tempAudioDir) == false) {
            console.log("OK to remove " + this.tempAudioDir);
        }
    }

    public async query_audio(word: string): Promise<[number, string]> {
        let fileName = word[0] + "/" + word + ".mp3";
        let audioFile: string = path.join(this.tempAudioDir, word + ".mp3");
        let ret: boolean = false;
        let audio: Buffer;
        try {
            if (fs.existsSync(audioFile) == true) {
                return Promise.resolve([1, audioFile]);
            }
            else if (this.audioZip.bFileIn(fileName)) {
                [ret, audio] = await this.audioZip.readFileAsync(fileName);
                if (ret) {
                    try {
                        fs.writeFileSync(audioFile, audio);
                    } catch (e) {
                        return Promise.resolve([-1, (e as Error).message]);
                    }
                    return Promise.resolve([1, audioFile]);
                }
                else {
                    return Promise.resolve([-1, `Fail to read ${word} in ${this.audioArchive}!`]);
                }
            }
            else if (this.bWritable) {
                let audioURL = `https://ssl.gstatic.com/dictionary/static/sounds/oxford/${word}--_us_1.mp3`
                globalVar.dQueue.AddQueue(audioURL, audioFile, this, this.notify);
                audioFile = `audio of ${word} is downloading.`;
                return Promise.resolve([0, audioFile]);
            }
            else {
                return Promise.resolve([-1, `no audio of ${word} in ${this.audioArchive}`]);
            }
        }
        catch (e) {
            return Promise.resolve([-1, (e as Error).message]);
        }
    }

    private notify(name: string, progress: number, state: string, why?: string) {
        let gApp = globalVar.app;
        console.log(`${(progress * 100).toFixed(2)}% of ${name} was ${state} to download!`);
        let word = path.basename(name, ".mp3");
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
    }

    private checkAndAddFile(audioFile: string) {
        let word = path.basename(audioFile, ".mp3");
        let fileName = word[0] + "/" + word + ".mp3";
        let _this = this;
        let gApp = globalVar.app;
        if (fs.existsSync(audioFile)) {
            let audio = fs.readFileSync(audioFile);
            fs.unlink(audioFile, () => { });
            _this.audioZip.addFile(fileName, audio);
            // return gApp.info(1, 2, word, "OK to download audio of " + word);
            return gApp.info(1, 2, word, audioFile);
        }
        else {
            console.log(audioFile + " doesn't exist");
            return gApp.info(-1, 2, word, "Fail to download audio of " + word);
        }
    }

    public getWritable(): boolean {
        return this.bWritable;
    }

    public del_audio(word: string): boolean {
        let fileName = word[0] + "/" + word + ".mp3";
        return this.audioZip.delFile(fileName);
    }
};