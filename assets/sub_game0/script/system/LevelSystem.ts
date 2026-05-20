
import { Utils } from "db://assets/doge/framework/common/Utils";
import { Clock } from "db://assets/doge/framework/common/Clock";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { Language } from "db://assets/doge/framework/language/Language";
import { CHALLENGE_PASS, ENDLESS_PASS, SUBGAME } from "../../constant/Constant";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";
import { UploadSystem } from "./UploadSystem";

const STORAGE_KEY = {
    LEVEL_INFO: "LEVEL_INFO",
    CHALLENGE_PASSED_TIME: "CHALLENGE_PASSED_TIME",
    ENDLESS_ROUND: "ENDLESS_ROUND",
    ENDLESS_TIME: "ENDLESS_TIME",
    PASSED_LEVEL: "PASSED_LEVEL",
};

export type LevelInfo = {
    level: number, // 关卡等级
    star: number, // 关卡星级
}

export enum GameMode {
    PASS_0 = 0, // 关卡模式
    PASS_1 = 1, // 无尽模式
    PASS_2 = 2, // 无尽模式
}

export class LevelSystem {

    private static _instance = null;
    public static get I(): LevelSystem {
        if (!LevelSystem._instance) {
            LevelSystem._instance = new LevelSystem();
        }
        return LevelSystem._instance;
    }

    private vo: LevelSystemVO = new LevelSystemVO();

    init(passed: number) {
        // this.vo.passedLv = StorageBox.load(STORAGE_KEY.PASSED_LEVEL, "0").int();
        this.vo.passedLv = passed;
        this.vo.currLv = this.initCurrLevel();
        this.vo.runningPass = 0;
        this.vo.runningMode = GameMode.PASS_0;
    }

    private initCurrLevel() {
        return this.vo.passedLv + 1;
    }

    // 关卡模式
    public runPass(pass: number) {
        if (this.isCanRunPass()) {
            this.enterPass(pass, GameMode.PASS_0);
            return true;
        } else {
            return false;
        }
    }

    public enterPass(pass: number, mode: GameMode) {
        let prePass = this.vo.runningPass;
        this.setRunningPass(pass, mode);
        getEventEmiter().emit(SUBGAME.SCENE.GAME, pass, prePass);
        return true;
    }

    public setRunningPass(pass: number, mode: GameMode) {
        this.vo.runningPass = pass;
        this.vo.runningMode = mode;
    }

    // 下一关
    public next() {
        if (this.vo.runningMode == GameMode.PASS_0) {
            PlayerSystem.I.addDailyGameData(1);
            return this.runPass(this.vo.runningPass + 1);
        }
    }

    // 重玩关卡
    public replay() {
        switch (this.vo.runningMode) {
            case GameMode.PASS_0:
                this.runPass(this.vo.runningPass);
                break;
        }
    }

    // 通关
    public passed(star?: number) {
        UploadSystem.I.level();
        switch (this.vo.runningMode) {
            case GameMode.PASS_0:
                this.updateLevelInfo(this.vo.runningPass, star);
                if (this.vo.runningPass == this.vo.passedLv) {
                    this.addLevelInfo();
                }
                break;
        }

    }

    public isCanRunPass() {
        return true;
    }

    public getRunningPass() {
        return this.vo.runningPass;
    }

    public getRunningMode() {
        return this.vo.runningMode;
    }

    // 获取最大关卡数
    public getMaxLevel() {
        return this.vo.totalLevel;
    }

    // 更新关卡信息
    public updateLevelInfo(level: number, starNum: number) {
    }

    // 增加关卡信息
    public addLevelInfo() {
        this.vo.passedLv += 1;
        this.vo.currLv = this.vo.passedLv + 1;
    }

    // 获取当前关卡
    public getCurrPass() {
        return this.vo.passedLv;
    }

    // 获取当前等级
    public getCurrLevel() {
        return this.vo.currLv;
    }

    // 关卡时间
    public getLevelTime() {
        return this.vo.levelTime;
    }

    // 获取复活补充时间
    public getReviveTime() {
        return this.vo.reviveTime;
    }

    // 获取奖励增加时间
    public getRewardTime() {
        return this.vo.rewardTime;
    }
}

class LevelSystemVO {
    // 关卡复活时间
    public readonly reviveTime: number = 60;
    // 关卡奖励时间
    public readonly rewardTime: number = 0;
    // 总关卡数
    public readonly totalLevel: number = 2;
    // 关卡时间
    public readonly levelTime: number = 480;
    // 无尽关卡数量
    public readonly endLessLevelCount: number = 50;

    // 已通过关卡数
    private _passedLv: number = 0;

    // 当前等级
    private _currLv: number = 0;
    // 关卡数据
    private _levelInfo: LevelInfo[] = null;
    // 运行中关卡
    private _runningLv: number = 0;
    // 运行中关卡模式
    private _runningMode: number = 0;
    // 挑战模式通关时间
    private _challengePassedTime: number = 0;
    // 无尽模式回合数
    private _endLessRound: number = 0;
    // 无尽模式开始时间
    private _endLessTime: number = 0;

    public get passedLv(): number {
        return this._passedLv;
    }
    public set passedLv(value: number) {
        this._passedLv = value;
        Language.updVariable("passedLv", this._passedLv.toString());
        StorageBox.save(STORAGE_KEY.PASSED_LEVEL, this._passedLv.toString());
    }

    public get currLv(): number {
        return this._currLv;
    }
    public set currLv(value: number) {
        this._currLv = value;
        Language.updVariable("currLv", (this._currLv + 1).toString());
    }

    public get runningPass(): number {
        return this._runningLv;
    }
    public set runningPass(value: number) {
        this._runningLv = value;
        Language.updVariable("runningLv", (this._runningLv + 1).toString());
    }

    public get runningMode(): number {
        return this._runningMode;
    }
    public set runningMode(value: number) {
        this._runningMode = value;
    }
}




