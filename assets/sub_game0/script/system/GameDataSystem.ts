import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { Language } from "db://assets/doge/framework/language/Language";
import { MAX_BALL_TYPE, STORAGE } from "../../constant/Constant";
import { UploadSystem } from "./UploadSystem";

export class GameDataSystem {

    private static _instance = null;
    public static get I(): GameDataSystem {
        if (!GameDataSystem._instance) {
            GameDataSystem._instance = new GameDataSystem();
        }
        return GameDataSystem._instance;
    }

    private vo: GameDataSystemVO = new GameDataSystemVO();

    init(count2048: number) {
        this.vo.count2048 = count2048;
        this.refresh2048Count();
        if (this.vo.count2048 > 0) {
            this.vo.targetBall = MAX_BALL_TYPE;
        } else {
            this.vo.targetBall = StorageBox.load(STORAGE.TARGET_BALL, "1").int();
        }
        this.vo.count1024 = StorageBox.load(STORAGE.COUNT_1024, "0").int();
        this.refresh1024Count();
        this.vo.score = StorageBox.loadGlobal(STORAGE.CURR_SCORE, "0").int();
        this.vo.higherScore = StorageBox.loadGlobal(STORAGE.HIGHER_SCORE, "0").int();
    }

    public setTargetBallType(type: number) {
        this.vo.targetBall = type;
    }

    public upgradeTargetBallType(type: number) {
        if (type >= this.vo.targetBall && type < MAX_BALL_TYPE) {
            this.setTargetBallType(type + 1);
        }
    }

    public getTargetBallType() {
        return this.vo.targetBall;
    }

    public isSameTargetBall(newType: number) {
        if (newType > MAX_BALL_TYPE) {
            newType = MAX_BALL_TYPE;
        }
        return this.vo.targetBall == newType;
    }

    public add2048() {
        this.vo.count2048 += 1;
        UploadSystem.I.level();
    }

    public refresh2048Count() {
        Language.updVariable("count2048", this.vo.count2048.toString());
    }

    public add1024() {
        this.vo.count1024 += 1;
    }

    public refresh1024Count() {
        Language.updVariable("count1024", this.vo.count1024.toString());
    }

    public get2048Count() {
        return this.vo.count2048;
    }

    public get1024Count() {
        return this.vo.count1024;
    }

    public addScore(score: number) {
        this.vo.score += score;
        if (this.vo.score > this.vo.higherScore) {
            this.vo.higherScore = this.vo.score;
        }
    }

    public getScore() {
        return this.vo.score;
    }

    public clearScore() {
        this.vo.score = 0;
    }
}

export class GameDataSystemVO {
    // 目标球
    private _targetBall: number = 0;
    public get targetBall(): number {
        return this._targetBall;
    }
    public set targetBall(value: number) {
        this._targetBall = value;
        StorageBox.save(STORAGE.TARGET_BALL, this._targetBall.toString());
        Language.updVariable("targetball", this._targetBall.toString());
    }

    // 2048数量
    private _count2048: number = 0;
    public get count2048(): number {
        return this._count2048;
    }
    public set count2048(value: number) {
        this._count2048 = value;
        StorageBox.save(STORAGE.COUNT_2048, this._count2048.toString());
    }

    // 1024数量
    private _count1024: number = 0;
    public get count1024(): number {
        return this._count1024;
    }
    public set count1024(value: number) {
        this._count1024 = value;
        StorageBox.save(STORAGE.COUNT_1024, this._count1024.toString());
    }

    // 当前分
    private _score: number = 0;
    public get score(): number {
        return this._score;
    }
    public set score(value: number) {
        this._score = value;
        StorageBox.save(STORAGE.CURR_SCORE, this._score.toString());
        Language.updVariable("currScore", this._score.toString());
    }

    // 最高分
    private _higherScore: number = 0;
    public get higherScore(): number {
        return this._higherScore;
    }
    public set higherScore(value: number) {
        this._higherScore = value;
        StorageBox.save(STORAGE.HIGHER_SCORE, this._higherScore.toString());
        Language.updVariable("higherScore", this._higherScore.toString());
    }
}


