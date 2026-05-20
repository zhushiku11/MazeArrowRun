
import { CurrencyType, Language } from "db://assets/doge/framework/language/Language";
import { NetworkSystem } from "./NetworkSystem";
import { Toast } from "db://assets/doge/framework/init";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { GameDataSystem } from "./GameDataSystem";
import { LevelSystem } from "./LevelSystem";

export type GoodsData = {
    FtEgAd: number,
    FtEgDl: number,
    FtEgId: number,
    FtEgLg: number,
    FtEgMl: number,
    FtEgNp: number,
    FtEgPri: number
}

export type RankGoodsData = {
    id: number,
    name: string,
    condition: number,
    reward: number,
}

export type RankState = {
    isClaim: number,
}

export class WithdrawSystem {

    private static _instance = null;
    public static get I(): WithdrawSystem {
        if (!WithdrawSystem._instance) {
            WithdrawSystem._instance = new WithdrawSystem();
        }
        return WithdrawSystem._instance;
    }

    private vo: WithdrawSystemVO = new WithdrawSystemVO();

    public init() {

    }

    public async syncData(callback?: Function) {
        return new Promise((resolve) => {
            this.vo.goodsData = null;
            callback && callback(null);
            resolve(null);
        })
    }

    public async platform() {
        let result = await NetworkSystem.withdrawPlatform();
        if (result.error) {
            Toast.show(result.data);
        } else {
            this.vo.rateInfo = result.data.MjPwr;
            this.vo.platformData = result.data.MjPwwf;
            this.vo.canWithdrawCash = result.data.MjPuso.MjPewl;
            this.vo.adCount = result.data.MjPuso.MjPlgd;
            this.vo.msgState = !!result.data.MjPuso.MjPimg;
        }
        this.vo.userInfo = result.data.MjPuso;
    }

    public async info() {
        let result = await NetworkSystem.withdrawInfo();
        if (result.error) {
            Toast.show(result.data);
        } else {
            this.vo.withdrawInfo = result.data;
        }
    }

    public async record() {
        let result = await NetworkSystem.withdrawRecord();
        if (result.error) {
            Toast.show(result.data);
        } else {
            this.vo.record = result.data || [];
        }
    }

    public levelWithdrawInfo() {
        this.vo.rankWithdrawState = StorageBox.load("LEVEL_WITHDRAW_STATE", `[{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0},{"isClaim":0}]`).object();
    }

    public getLevelWithdrawInfo() {
        switch (Language.currency) {
            case CurrencyType.ID:
                return this.vo.LevelWithdrawInfo_id;
            case CurrencyType.BR:
                return this.vo.LevelWithdrawInfo_br;
            case CurrencyType.US:
                return this.vo.LevelWithdrawInfo_us;
        }
    }

    public getLevelWithdrawState() {
        return this.vo.rankWithdrawState;
    }

    public getMaxLevelWithdrawInfo() {
        let index = this.getLevelWithdrawInfo().findIndex((value: RankGoodsData) => {
            return LevelSystem.I.getCurrPass() < value.condition;
            // return GameDataSystem.I.get2048Count() < value.condition;
        })
        if (index == -1) {
            index = this.getLevelWithdrawInfo().length;
        }
        index = index ? index - 1 : index;
        return this.getLevelWithdrawInfo()[index];
    }

    public claimLevelWithdrawInfo(index: number) {
        this.vo.rankWithdrawState[index].isClaim = 1;
        StorageBox.save("LEVEL_WITHDRAW_STATE", JSON.stringify(this.vo.rankWithdrawState));
    }

    public getGoodsData() {
        return this.vo.goodsData || this.getDefaultData();
    }

    public getDefaultData() {
        switch (Language.currency) {
            case CurrencyType.ID:
                return this.vo.WithdrawInfo_id;
            case CurrencyType.BR:
                return this.vo.WithdrawInfo_br;
            case CurrencyType.US:
                return this.vo.WithdrawInfo_us;
        }
    }

    public getRateInfo() {
        return this.vo.rateInfo || [];
    }

    public getPlatformData() {
        return this.vo.platformData || [];
    }

    public getInfo() {
        return this.vo.withdrawInfo || {};
    }

    public getUserInfo() {
        return this.vo.userInfo;
    }

    public isShowWithdrawRate(level: number) {
        if (level == 1) {
            return false;
        }
        let item = this.vo.rateInfo.find((value: any) => {
            return level == value.MjPbe;
        })
        if (item) {
            return true
        }
        return false;
    }

    public getCanWithdrawCash() {
        return this.vo.canWithdrawCash;
    }

    public getAdCount() {
        return this.vo.adCount;
    }

    public addAdCount() {
        this.vo.adCount += 1;
    }

    public getRecord(): any[] {
        return this.vo.record;
    }

    public hasFeedbackMsg() {
        return this.vo.msgState;
    }
}

export class WithdrawSystemVO {

    // 现金提现档位
    public readonly WithdrawInfo_us: GoodsData[] = [
        {
            FtEgAd: 0, // 视频数量
            FtEgDl: 0, // 每日关卡
            FtEgId: 0, // 
            FtEgLg: 0, // 累计登录
            FtEgMl: 0, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 0.01 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 1, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 200, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 800 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 2, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 300, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 1000 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 3, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 400, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 2000 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 4, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 500, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 3000  // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 5, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 600, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 5000  // 提现金额
        }
    ];
    public readonly WithdrawInfo_br: GoodsData[] = [
        {
            FtEgAd: 0, // 视频数量
            FtEgDl: 0, // 每日关卡
            FtEgId: 0, // 
            FtEgLg: 0, // 累计登录
            FtEgMl: 0, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 0.01 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 1, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 200, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 800 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 2, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 300, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 1000 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 3, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 400, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 2000 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 4, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 500, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 3000  // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 5, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 600, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 5000  // 提现金额
        }
    ];
    public readonly WithdrawInfo_id: GoodsData[] = [
        {
            FtEgAd: 0, // 视频数量
            FtEgDl: 0, // 每日关卡
            FtEgId: 0, // 
            FtEgLg: 0, // 累计登录
            FtEgMl: 0, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 20 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 1, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 200, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 88000 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 2, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 300, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 150000 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 3, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 400, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 300000  // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 4, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 500, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 500000 // 提现金额
        },
        {
            FtEgAd: 200000, // 视频数量
            FtEgDl: 10, // 每日关卡
            FtEgId: 5, // 
            FtEgLg: 50, // 累计登录
            FtEgMl: 600, // 已通过关卡数
            FtEgNp: 0, // 提现原因
            FtEgPri: 1000000 // 提现金额
        }
    ];
    // 段位奖励档位
    public readonly LevelWithdrawInfo_us: RankGoodsData[] = [
        {
            id: 0,
            name: "l_bronze", // 名称
            condition: 5, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 1,
            name: "l_silver", // 视频数量
            condition: 15, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 2,
            name: "l_gold", // 视频数量
            condition: 30, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 3,
            name: "l_platinum", // 视频数量
            condition: 50, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 4,
            name: "l_diamond", // 视频数量
            condition: 80, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 5,
            name: "l_master", // 视频数量
            condition: 150, // 关卡条件
            reward: 400, // 奖励金额
        },
        {
            id: 6,
            name: "l_king", // 视频数量
            condition: 250, // 关卡条件
            reward: 1000, // 奖励金额
        },
    ];
    public readonly LevelWithdrawInfo_br: RankGoodsData[] = [
        {
            id: 0,
            name: "l_bronze", // 名称
            condition: 5, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 1,
            name: "l_silver", // 视频数量
            condition: 15, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 2,
            name: "l_gold", // 视频数量
            condition: 30, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 3,
            name: "l_platinum", // 视频数量
            condition: 50, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 4,
            name: "l_diamond", // 视频数量
            condition: 80, // 关卡条件
            reward: 300, // 奖励金额
        },
        {
            id: 5,
            name: "l_master", // 视频数量
            condition: 150, // 关卡条件
            reward: 400, // 奖励金额
        },
        {
            id: 6,
            name: "l_king", // 视频数量
            condition: 250, // 关卡条件
            reward: 1000, // 奖励金额
        },
    ];
    public readonly LevelWithdrawInfo_id: RankGoodsData[] = [
        {
            id: 0,
            name: "l_bronze", // 名称
            condition: 5, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 1,
            name: "l_silver", // 视频数量
            condition: 15, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 2,
            name: "l_gold", // 视频数量
            condition: 30, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 3,
            name: "l_platinum", // 视频数量
            condition: 50, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 4,
            name: "l_diamond", // 视频数量
            condition: 80, // 关卡条件
            reward: 15000, // 奖励金额
        },
        {
            id: 5,
            name: "l_master", // 视频数量
            condition: 150, // 关卡条件
            reward: 20000, // 奖励金额
        },
        {
            id: 6,
            name: "l_king", // 视频数量
            condition: 250, // 关卡条件
            reward: 50000, // 奖励金额
        },
    ];

    private _goodsData: GoodsData[] = null;
    public get goodsData(): GoodsData[] {
        return this._goodsData;
    }
    public set goodsData(value: GoodsData[]) {
        this._goodsData = value;
    }

    private _rateInfo: any[] = [];
    public get rateInfo(): any[] {
        return this._rateInfo;
    }
    public set rateInfo(value: any[]) {
        this._rateInfo = value;
    }

    private _platformData: any[] = [];
    public get platformData(): any[] {
        return this._platformData;
    }
    public set platformData(value: any[]) {
        this._platformData = value;
    }

    private _record: any[] = [];
    public get record(): any[] {
        return this._record;
    }
    public set record(value: any[]) {
        this._record = value;
    }

    private _rankWithdrawState: RankState[] = null;
    public get rankWithdrawState(): RankState[] {
        return this._rankWithdrawState;
    }
    public set rankWithdrawState(value: RankState[]) {
        this._rankWithdrawState = value;
    }

    private _withdrawInfo: any = null;
    public get withdrawInfo(): any {
        return this._withdrawInfo;
    }
    public set withdrawInfo(value: any) {
        this._withdrawInfo = value;
    }

    private _canWithdrawCash = 0;
    public get canWithdrawCash() {
        return this._canWithdrawCash;
    }
    public set canWithdrawCash(value) {
        this._canWithdrawCash = value;
    }

    private _adCount: number = 0;
    public get adCount(): number {
        return this._adCount;
    }
    public set adCount(value: number) {
        this._adCount = value;
    }

    private _userInfo: any = null;
    public get userInfo(): any {
        return this._userInfo;
    }
    public set userInfo(value: any) {
        this._userInfo = value;
    }

    // feedback Msg 是否未读
    private _msgState: boolean = false;
    public get msgState(): boolean {
        return this._msgState;
    }
    public set msgState(value: boolean) {
        this._msgState = value;
    }
}

