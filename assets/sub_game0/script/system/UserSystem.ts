import { AMoney, BMoney } from "db://assets/doge/framework/common/Currency";
import { CurrencyType, Language } from "db://assets/doge/framework/language/Language";
import { Utils } from "db://assets/doge/framework/common/Utils";
import FloatCalc from "db://assets/doge/framework/common/FloatCalc";
import { AD_RESULT, AD_TYPE, NI, REWARD_TYPE } from "db://assets/native_interface/NI";
import { Panel } from "db://assets/doge/framework/panel/Panel";
import { MAIN } from "db://assets/main/constant/Constant";
import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";
import { NetworkResult, NetworkSystem } from "./NetworkSystem";
import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { SLOT_CONDITION, SUBGAME } from "../../constant/Constant";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { WithdrawSystem } from "./WithdrawSystem";
import { PanelCreator } from "../component/creator/PanelCreator";

export class UserSystem {

    private static _instance = null;
    public static get I(): UserSystem {
        if (!UserSystem._instance) {
            UserSystem._instance = new UserSystem();
        }
        return UserSystem._instance;
    }

    private vo: UserSystemVo = new UserSystemVo();

    init(amoney: number, rate: number) {
        this.vo.isWithdrawAMoney = amoney <= 0;
        this.vo.rate = rate;
        this.vo.slotGameTimes = StorageBox.load("SLOT_GAME_TIEMS", "0").int();
    }

    // 现金奖励
    getCashReward() {
        let money = AMoney.value();
        let cashRewards: AMoneyReward[] = null;
        let cashRate: number = 0;
        switch (Language.currency) {
            case CurrencyType.ID:
                cashRewards = this.vo.cashReward_id;
                cashRate = 1;
                break;
            case CurrencyType.BR:
                cashRewards = this.vo.cashReward_br;
                cashRate = 100;
                break;
            case CurrencyType.US:
                cashRewards = this.vo.cashReward_us;
                cashRate = 100;
                break;
        }
        let cashReward: AMoneyReward = cashRewards.find((value: AMoneyReward) => {
            return money >= value.lowerLimit && money < value.upperLimit;
        })
        return Utils.randomInt(cashReward.rewardLowerLimit * cashRate, cashReward.rewardUpperLimit * cashRate) / cashRate;
    }

    getGiftCashReward() {
        let money = AMoney.value();
        let cashRewards: AMoneyReward[] = null;
        let cashRate: number = 0;
        switch (Language.currency) {
            case CurrencyType.US:
            case CurrencyType.BR:
                cashRewards = [
                    {
                        lowerLimit: 0,
                        upperLimit: 365,
                        rewardLowerLimit: 0.9,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 365,
                        upperLimit: 450,
                        rewardLowerLimit: 0.8,
                        rewardUpperLimit: 1.2,
                    },
                    {
                        lowerLimit: 450,
                        upperLimit: 545,
                        rewardLowerLimit: 0.7,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 545,
                        upperLimit: 590,
                        rewardLowerLimit: 0.5,
                        rewardUpperLimit: 0.7,
                    },
                    {
                        lowerLimit: 590,
                        upperLimit: 636,
                        rewardLowerLimit: 0.4,
                        rewardUpperLimit: 0.6,
                    },
                    {
                        lowerLimit: 636,
                        upperLimit: 681,
                        rewardLowerLimit: 0.3,
                        rewardUpperLimit: 0.4,
                    },
                    {
                        lowerLimit: 681,
                        upperLimit: 727,
                        rewardLowerLimit: 0.2,
                        rewardUpperLimit: 0.3,
                    },
                    {
                        lowerLimit: 727,
                        upperLimit: 736,
                        rewardLowerLimit: 0.1,
                        rewardUpperLimit: 0.2,
                    },
                    {
                        lowerLimit: 736,
                        upperLimit: 745,
                        rewardLowerLimit: 0.07,
                        rewardUpperLimit: 0.1,
                    },
                    {
                        lowerLimit: 745,
                        upperLimit: 754,
                        rewardLowerLimit: 0.05,
                        rewardUpperLimit: 0.07,
                    },
                    {
                        lowerLimit: 754,
                        upperLimit: 763,
                        rewardLowerLimit: 0.03,
                        rewardUpperLimit: 0.05,
                    },
                    {
                        lowerLimit: 763,
                        upperLimit: 772,
                        rewardLowerLimit: 0.2,
                        rewardUpperLimit: 0.3,
                    },
                    {
                        lowerLimit: 772,
                        upperLimit: 781,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 781,
                        upperLimit: 790,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 790,
                        upperLimit: 795,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 795,
                        upperLimit: 796,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 796,
                        upperLimit: 797,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 797,
                        upperLimit: 798,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 798,
                        upperLimit: 799,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 799,
                        upperLimit: 800,
                        rewardLowerLimit: 0.01,
                        rewardUpperLimit: 0.01,
                    },
                    {
                        lowerLimit: 800,
                        upperLimit: 9999999,
                        rewardLowerLimit: 0.9,
                        rewardUpperLimit: 1.3,
                    }
                ];
                cashRate = 100;
                break;
            case CurrencyType.ID:
                cashRewards = [
                    {
                        lowerLimit: 0,
                        upperLimit: 40000,
                        rewardLowerLimit: 100,
                        rewardUpperLimit: 150,
                    },
                    {
                        lowerLimit: 40000,
                        upperLimit: 50000,
                        rewardLowerLimit: 90,
                        rewardUpperLimit: 140,
                    },
                    {
                        lowerLimit: 50000,
                        upperLimit: 60000,
                        rewardLowerLimit: 80,
                        rewardUpperLimit: 120,
                    },
                    {
                        lowerLimit: 60000,
                        upperLimit: 65000,
                        rewardLowerLimit: 60,
                        rewardUpperLimit: 80,
                    },
                    {
                        lowerLimit: 65000,
                        upperLimit: 70000,
                        rewardLowerLimit: 50,
                        rewardUpperLimit: 70,
                    },
                    {
                        lowerLimit: 70000,
                        upperLimit: 75000,
                        rewardLowerLimit: 40,
                        rewardUpperLimit: 50,
                    },
                    {
                        lowerLimit: 75000,
                        upperLimit: 80000,
                        rewardLowerLimit: 25,
                        rewardUpperLimit: 35,
                    },
                    {
                        lowerLimit: 80000,
                        upperLimit: 81000,
                        rewardLowerLimit: 10,
                        rewardUpperLimit: 20,
                    },
                    {
                        lowerLimit: 81000,
                        upperLimit: 82000,
                        rewardLowerLimit: 8,
                        rewardUpperLimit: 12,
                    },
                    {
                        lowerLimit: 82000,
                        upperLimit: 83000,
                        rewardLowerLimit: 6,
                        rewardUpperLimit: 8,
                    },
                    {
                        lowerLimit: 83000,
                        upperLimit: 84000,
                        rewardLowerLimit: 4,
                        rewardUpperLimit: 6,
                    },
                    {
                        lowerLimit: 84000,
                        upperLimit: 85000,
                        rewardLowerLimit: 2,
                        rewardUpperLimit: 4,
                    },
                    {
                        lowerLimit: 85000,
                        upperLimit: 86000,
                        rewardLowerLimit: 2,
                        rewardUpperLimit: 2,
                    },
                    {
                        lowerLimit: 86000,
                        upperLimit: 87000,
                        rewardLowerLimit: 1,
                        rewardUpperLimit: 2,
                    },
                    {
                        lowerLimit: 87000,
                        upperLimit: 87500,
                        rewardLowerLimit: 1,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 87500,
                        upperLimit: 87600,
                        rewardLowerLimit: 1,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 87600,
                        upperLimit: 87700,
                        rewardLowerLimit: 1,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 87700,
                        upperLimit: 87800,
                        rewardLowerLimit: 1,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 87800,
                        upperLimit: 87900,
                        rewardLowerLimit: 1,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 87900,
                        upperLimit: 88000,
                        rewardLowerLimit: 1,
                        rewardUpperLimit: 1,
                    },
                    {
                        lowerLimit: 88000,
                        upperLimit: 9999999999,
                        rewardLowerLimit: 100,
                        rewardUpperLimit: 150,
                    },
                ];
                cashRate = 100;
                break;
        }

        let cashReward: AMoneyReward = cashRewards.find((value: AMoneyReward) => {
            return money >= value.lowerLimit && money < value.upperLimit;
        })
        return Utils.randomInt(cashReward.rewardLowerLimit * cashRate, cashReward.rewardUpperLimit * cashRate) / cashRate;
    }

    // 奖励结算
    getAdReward(adType: AD_TYPE, rewardType: REWARD_TYPE, reward: number, endCb?: (isErr: boolean, rewardA: number, rewardB: number) => void) {
        let rewardA = 0;
        let taskId = 0;
        let isDelayReward = false;
        if (rewardType == REWARD_TYPE.TASK) {
            taskId = reward;
        } else {
            rewardA = reward;
        }
        if (rewardType == REWARD_TYPE.DELAY_REWARD) {
            rewardType = REWARD_TYPE.REWARD;
            isDelayReward = true;
        }
        let func = (resultCode: AD_RESULT, adType: AD_TYPE, result: { rewardB: number, currentB: number, currentB1: number, rate: number }) => {
            getEventEmiter().emit(SUBGAME.FUNC.GAME_RESUME);
            switch (resultCode) {
                case AD_RESULT.SUCCESS:
                case AD_RESULT.CANCEL:
                    console.log("Reward Settlement", REWARD_TYPE[rewardType], AD_TYPE[adType], rewardA, result.rewardB);
                    // A奖励
                    if (rewardA > 0) {
                        // 成功有奖励 更新货币
                        AMoney.set(AMoney.value() + rewardA);
                    }
                    // B奖励
                    if (result.rewardB > 0) {
                        // 成功有奖励 更新货币
                        BMoney.set(result.currentB, result.currentB1);
                    }
                    if (rewardType == REWARD_TYPE.TASK) {
                        result.rewardB = 0;
                    }
                    WithdrawSystem.I.addAdCount();
                    // 奖励提升比率
                    // if (result.rate >= 0) {
                    //     // 奖励提升比率
                    //     UserSystem.I.setRate(result.rate);
                    // }
                    let info = WithdrawSystem.I.getInfo();
                    if (WithdrawSystem.I.getAdCount() >= info.mj_three) {
                        UserSystem.I.setRate(info.mj_three_rate / 100);
                    } else if (WithdrawSystem.I.getAdCount() >= info.mj_two) {
                        UserSystem.I.setRate(info.mj_two_rate / 100);
                    } else if (WithdrawSystem.I.getAdCount() >= info.mj_one) {
                        UserSystem.I.setRate(info.mj_one_rate / 100);
                    }

                    // 恭喜弹窗
                    if (!isDelayReward) {
                        if (rewardA > 0 || result.rewardB > 0) {
                            UserSystem.I.congratulationsMoney(rewardA, result.rewardB);
                        }
                    }
                    PlayerSystem.I.addTotalAdCount();
                    endCb && endCb(false, rewardA, result.rewardB);
                    break;
                case AD_RESULT.FAIL:
                    // 接口调用失败
                    console.log("error:", Language.getWord("l_adErrText"));
                    // Toast.show(Language.getWord("adErrText"))
                    endCb && endCb(true, 0, 0);
                    break;
            }
        }
        getEventEmiter().emit(SUBGAME.FUNC.GAME_PAUSE);
        NI.playAd(func, adType, rewardType, taskId);
        if (adType == AD_TYPE.VIDEO) {
            this.noClaimClear();
        }
    }

    // 恭喜弹窗
    congratulationsMoney(rewardA: number, rewardB: number, rewardC: number = 0) {
        if (rewardA > 0 || rewardB > 0 || rewardC > 0) {
            // 恭喜弹窗
            PanelCreator.congratulations(0, rewardB, rewardC, 0);
        }
    }

    // 金币 恭喜弹窗
    congratulationsCoins(acoins: number) {
        if (acoins > 0) {
            // 恭喜弹窗
            PanelCreator.congratulations(0, 0, 0, acoins);
        }
    }

    // 新手奖励结算
    // getNewUserReward(endCb: (rewardA: number, rewardB: number) => void) {
    //     // 新手奖励
    //     let rewardA = 0;
    //     let rewardB = 0;
    //     if (PlayerSystem.I.isNewUser()) {
    //         NetworkSystem.newUserReward().then((result: NetworkResult) => {
    //             console.log(result);
    //             if (!result.error) {
    //                 // 现金
    //                 switch (Language.currency) {
    //                     case CurrencyType.US:
    //                         // 现金
    //                         rewardA = result.data.MjPacg.MjPrnw;
    //                         if (rewardA > 0) {
    //                             rewardA = 77;
    //                             AMoney.set(AMoney.value() + rewardA);
    //                         }
    //                         break;
    //                     case CurrencyType.BR:
    //                         // 现金
    //                         rewardA = result.data.MjPacg.MjPrnw;
    //                         if (rewardA > 0) {
    //                             rewardA = 51;
    //                             AMoney.set(AMoney.value() + rewardA);
    //                         }
    //                         break;
    //                     case CurrencyType.ID:
    //                         rewardA = result.data.MjPacg.MjPrnw;
    //                         if (rewardA > 0) {
    //                             rewardA = 25000;
    //                             AMoney.set(AMoney.value() + rewardA);
    //                         }
    //                         break;
    //                 }
    //                 this.vo.isWithdrawAMoney = false;
    //             }
    //             endCb && endCb(rewardA, rewardB);
    //         })
    //     } else {
    //         setTimeout(() => {
    //             endCb && endCb(rewardA, rewardB);
    //         }, 500);
    //     }
    // }
    getNewUserReward(endCb: (rewardA: number, rewardB: number) => void) {
        // 新手奖励
        let rewardA = 0;
        let rewardB = 0;
        if (PlayerSystem.I.isNewUser()) {
            NetworkSystem.newUserReward().then((result: NetworkResult) => {
                console.log("******************",result);
                if (!result.error) {
                    rewardB = result.data.MjPacg.MjPrnw;
                    switch (Language.currency) {
                        case CurrencyType.US:
                            if (rewardB > 0) {
                                BMoney.set(result.data.MjPuso.SdegBaci, result.data.MjPuso.SdegEwl);
                            }
                            break;
                        case CurrencyType.BR:
                            if (rewardB > 0) {
                                BMoney.set(result.data.MjPuso.SdegBac, result.data.MjPuso.SdegEwl);
                            }
                            break;
                        case CurrencyType.ID:
                            if (rewardB > 0) {
                                BMoney.set(result.data.MjPuso.SdegBac, result.data.MjPuso.SdegEwl);
                            }
                            break;
                    }
                    this.vo.isWithdrawAMoney = false;
                }
                endCb && endCb(rewardA, rewardB);
            })
        } else {
            setTimeout(() => {
                endCb && endCb(rewardA, rewardB);
            }, 500);
        }
    }
    // openWithdrawInput(type: number, amount: number, endCb?: Function) {
    //     Panel.open(SUBGAME.PANEL.WITHDRAW_INFO_PANEL, type, amount, endCb);
    // }

    // openWithdrawInputTask(amount: number, taskId: number, endCb?: Function) {
    //     NI.playWithdrawInfoTask((isWithdraw: number, amount: number) => {
    //         endCb && endCb(isWithdraw, amount);
    //     }, amount, taskId);
    // }

    openWithdraw(endCb?: WithdrawCallback) {
        NI.playWithdraw((isWithdraw: number) => {
            endCb && endCb(isWithdraw);
        });
    }

    openWithdrawInput(amount: number, endCb?: WithdrawInfoCallback) {
        NI.playWithdrawInfo((isWithdraw: number, amount: number) => {
            endCb && endCb(isWithdraw, amount);
        }, amount);
    }

    openWithdrawInputTask(amount: number, taskId: number, endCb?: WithdrawInfoCallback) {
        NI.playWithdrawInfoTask((isWithdraw: number, amount: number) => {
            endCb && endCb(isWithdraw, amount);
        }, amount, taskId);
    }

    isAMoneyWithdrawed() {
        return this.vo.isWithdrawAMoney;
    }

    amoneyWithdrawed() {
        this.vo.isWithdrawAMoney = true;
    }

    // 合成 个数增加
    mergeCountUp(num: number) {
        this.vo.mergeCount += num;
    }

    // 合成 个数减少
    mergeCountDown(num: number) {
        this.vo.mergeCount -= num;
    }

    // 合成 个数清零
    mergeCountClear() {
        this.vo.mergeCount = 0;
    }

    // 合成 次数增加
    mergeTimesUp(num: number) {
        this.vo.mergeTimes += num;
    }

    // 合成 次数减少
    mergeTimesDown(num: number) {
        this.vo.mergeTimes -= num;
    }

    // 合成 次数清零
    mergeTimesClear() {
        this.vo.mergeTimes = 0;
    }

    // 不领取 次数增加
    noClaimUp() {
        this.vo.noClaimCount += 1;
    }

    // 不领取 次数减少
    noClaimDown() {
        this.vo.noClaimCount -= 1;
    }

    // 不领取 次数清零
    noClaimClear() {
        this.vo.noClaimCount = 0;
    }

    noSmallClaimUp() {
        this.vo.smallClaimCount += 1;
    }

    noSmallClaimDown() {
        this.vo.smallClaimCount -= 1;
    }

    noSmallClaimClear() {
        this.vo.smallClaimCount = 0;
    }

    // 领取 达标
    isSmallClaimAchieve() {
        return this.vo.smallClaimCount % this.vo.smallClaimCondition == 0;
    }

    isNormalRewardAchieve() {
        console.log("MergeTimes", this.vo.mergeTimes);
        let condition = 0;
        let len = this.vo.normalCondition.length;
        if (this.vo.mergeTimes >= len) {
            condition = this.vo.normalCondition[len - 1];
        } else {
            condition = this.vo.normalCondition[this.vo.mergeTimes];
        }
        console.log("condition", this.vo.mergeTimes, condition);
        return this.vo.mergeTimes % condition == 0;
    }

    // 领取 达标
    isSmallRewardAchieve() {
        let condition = this.vo.samllRewardCondition;
        console.log("condition", this.vo.mergeTimes, condition);
        return this.vo.mergeTimes % condition == 0;
    }

    // 关卡Small奖励 达标
    // isSmallClaimAchieve(level: number) {
    //     return (level + 1) % this.vo.noClaimCondition == 0;
    // }

    // 不领取奖励 达标
    isNoClaimAchieve() {
        return this.vo.noClaimCount % this.vo.noClaimCondition == 0;
    }

    // 设置奖励提升比率
    setRate(num: number) {
        this.vo.rate = num;
    }

    getRate() {
        return this.vo.rate;
    }

    getSlotGameTimes() {
        return this.vo.slotGameTimes;
    }

    addSlotGameTimes(times: number = 1) {
        if (this.vo.slotGameTimes >= SLOT_CONDITION) {
            return;
        }
        let value = this.vo.slotGameTimes + times;
        if (value >= SLOT_CONDITION) {
            value = SLOT_CONDITION;
        }
        this.vo.slotGameTimes = value;
    }

    clearSlotGameTimes() {
        this.vo.slotGameTimes = 0;
    }
}


type AMoneyReward = {
    lowerLimit: number,
    upperLimit: number,
    rewardLowerLimit: number,
    rewardUpperLimit: number,
}

export class UserSystemVo {
    // 普通奖励 条件
    public readonly normalCondition: number[] = [4];
    // 小奖励 条件
    public readonly samllRewardCondition: number = 2;
    // public readonly normalCondition: number[] = [1, 1, 1, 1, 1, 9, 9, 9, 9, 9, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7];
    // Slots游戏 条件
    public readonly slotsCondition: number[] = [150];
    // 关卡SmallClaim 条件
    public readonly noClaimCondition: number = 3;
    public readonly smallClaimCondition: number = 3;
    // 现金奖励配置
    public readonly cashReward_us: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 365,
            rewardLowerLimit: 9,
            rewardUpperLimit: 13,
        },
        {
            lowerLimit: 365,
            upperLimit: 450,
            rewardLowerLimit: 8,
            rewardUpperLimit: 12,
        },
        {
            lowerLimit: 450,
            upperLimit: 545,
            rewardLowerLimit: 7,
            rewardUpperLimit: 10,
        },
        {
            lowerLimit: 545,
            upperLimit: 590,
            rewardLowerLimit: 5,
            rewardUpperLimit: 7,
        },
        {
            lowerLimit: 590,
            upperLimit: 636,
            rewardLowerLimit: 4,
            rewardUpperLimit: 6,
        },
        {
            lowerLimit: 636,
            upperLimit: 681,
            rewardLowerLimit: 3,
            rewardUpperLimit: 4,
        },
        {
            lowerLimit: 681,
            upperLimit: 727,
            rewardLowerLimit: 2,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 727,
            upperLimit: 736,
            rewardLowerLimit: 1,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 736,
            upperLimit: 745,
            rewardLowerLimit: 0.7,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 745,
            upperLimit: 754,
            rewardLowerLimit: 0.55,
            rewardUpperLimit: 0.7,
        },
        {
            lowerLimit: 754,
            upperLimit: 763,
            rewardLowerLimit: 0.36,
            rewardUpperLimit: 0.55,
        },
        {
            lowerLimit: 763,
            upperLimit: 772,
            rewardLowerLimit: 0.18,
            rewardUpperLimit: 0.36,
        },
        {
            lowerLimit: 772,
            upperLimit: 781,
            rewardLowerLimit: 0.09,
            rewardUpperLimit: 0.18,
        },
        {
            lowerLimit: 781,
            upperLimit: 790,
            rewardLowerLimit: 0.05,
            rewardUpperLimit: 0.09,
        },
        {
            lowerLimit: 790,
            upperLimit: 795,
            rewardLowerLimit: 0.04,
            rewardUpperLimit: 0.05,
        },
        {
            lowerLimit: 795,
            upperLimit: 796,
            rewardLowerLimit: 0.03,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 796,
            upperLimit: 797,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 797,
            upperLimit: 798,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 798,
            upperLimit: 799,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 799,
            upperLimit: 800,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 800,
            upperLimit: 9999999,
            rewardLowerLimit: 9.0,
            rewardUpperLimit: 13.0,
        },
    ];
    public readonly cashReward_br: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 365,
            rewardLowerLimit: 9,
            rewardUpperLimit: 13,
        },
        {
            lowerLimit: 365,
            upperLimit: 450,
            rewardLowerLimit: 8,
            rewardUpperLimit: 12,
        },
        {
            lowerLimit: 450,
            upperLimit: 545,
            rewardLowerLimit: 7,
            rewardUpperLimit: 10,
        },
        {
            lowerLimit: 545,
            upperLimit: 590,
            rewardLowerLimit: 5,
            rewardUpperLimit: 7,
        },
        {
            lowerLimit: 590,
            upperLimit: 636,
            rewardLowerLimit: 4,
            rewardUpperLimit: 6,
        },
        {
            lowerLimit: 636,
            upperLimit: 681,
            rewardLowerLimit: 3,
            rewardUpperLimit: 4,
        },
        {
            lowerLimit: 681,
            upperLimit: 727,
            rewardLowerLimit: 2,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 727,
            upperLimit: 736,
            rewardLowerLimit: 1,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 736,
            upperLimit: 745,
            rewardLowerLimit: 0.7,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 745,
            upperLimit: 754,
            rewardLowerLimit: 0.55,
            rewardUpperLimit: 0.7,
        },
        {
            lowerLimit: 754,
            upperLimit: 763,
            rewardLowerLimit: 0.36,
            rewardUpperLimit: 0.55,
        },
        {
            lowerLimit: 763,
            upperLimit: 772,
            rewardLowerLimit: 0.18,
            rewardUpperLimit: 0.36,
        },
        {
            lowerLimit: 772,
            upperLimit: 781,
            rewardLowerLimit: 0.09,
            rewardUpperLimit: 0.18,
        },
        {
            lowerLimit: 781,
            upperLimit: 790,
            rewardLowerLimit: 0.05,
            rewardUpperLimit: 0.09,
        },
        {
            lowerLimit: 790,
            upperLimit: 795,
            rewardLowerLimit: 0.04,
            rewardUpperLimit: 0.05,
        },
        {
            lowerLimit: 795,
            upperLimit: 796,
            rewardLowerLimit: 0.03,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 796,
            upperLimit: 797,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.03,
        },
        {
            lowerLimit: 797,
            upperLimit: 798,
            rewardLowerLimit: 0.02,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 798,
            upperLimit: 799,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.02,
        },
        {
            lowerLimit: 799,
            upperLimit: 800,
            rewardLowerLimit: 0.01,
            rewardUpperLimit: 0.01,
        },
        {
            lowerLimit: 800,
            upperLimit: 9999999,
            rewardLowerLimit: 9.0,
            rewardUpperLimit: 13.0,
        },
    ];
    public readonly cashReward_id: AMoneyReward[] = [
        {
            lowerLimit: 0,
            upperLimit: 40000,
            rewardLowerLimit: 1000,
            rewardUpperLimit: 1500,
        },
        {
            lowerLimit: 40000,
            upperLimit: 50000,
            rewardLowerLimit: 900,
            rewardUpperLimit: 1400,
        },
        {
            lowerLimit: 50000,
            upperLimit: 60000,
            rewardLowerLimit: 800,
            rewardUpperLimit: 1200,
        },
        {
            lowerLimit: 60000,
            upperLimit: 65000,
            rewardLowerLimit: 600,
            rewardUpperLimit: 800,
        },
        {
            lowerLimit: 65000,
            upperLimit: 70000,
            rewardLowerLimit: 500,
            rewardUpperLimit: 700,
        },
        {
            lowerLimit: 70000,
            upperLimit: 75000,
            rewardLowerLimit: 400,
            rewardUpperLimit: 500,
        },
        {
            lowerLimit: 75000,
            upperLimit: 80000,
            rewardLowerLimit: 250,
            rewardUpperLimit: 350,
        },
        {
            lowerLimit: 80000,
            upperLimit: 81000,
            rewardLowerLimit: 100,
            rewardUpperLimit: 200,
        },
        {
            lowerLimit: 81000,
            upperLimit: 82000,
            rewardLowerLimit: 80,
            rewardUpperLimit: 120,
        },
        {
            lowerLimit: 82000,
            upperLimit: 83000,
            rewardLowerLimit: 60,
            rewardUpperLimit: 80,
        },
        {
            lowerLimit: 83000,
            upperLimit: 84000,
            rewardLowerLimit: 40,
            rewardUpperLimit: 60,
        },
        {
            lowerLimit: 84000,
            upperLimit: 85000,
            rewardLowerLimit: 20,
            rewardUpperLimit: 40,
        },
        {
            lowerLimit: 85000,
            upperLimit: 86000,
            rewardLowerLimit: 10,
            rewardUpperLimit: 20,
        },
        {
            lowerLimit: 86000,
            upperLimit: 87000,
            rewardLowerLimit: 5,
            rewardUpperLimit: 10,
        },
        {
            lowerLimit: 87000,
            upperLimit: 87500,
            rewardLowerLimit: 4,
            rewardUpperLimit: 5,
        },
        {
            lowerLimit: 87500,
            upperLimit: 87600,
            rewardLowerLimit: 3,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 87600,
            upperLimit: 87700,
            rewardLowerLimit: 2,
            rewardUpperLimit: 3,
        },
        {
            lowerLimit: 87700,
            upperLimit: 87800,
            rewardLowerLimit: 2,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 87800,
            upperLimit: 87900,
            rewardLowerLimit: 1,
            rewardUpperLimit: 2,
        },
        {
            lowerLimit: 87900,
            upperLimit: 88000,
            rewardLowerLimit: 1,
            rewardUpperLimit: 1,
        },
        {
            lowerLimit: 88000,
            upperLimit: 9999999999,
            rewardLowerLimit: 1000,
            rewardUpperLimit: 1500,
        },
    ];

    // 合成个数
    private _mergeCount: number = 0;
    public get mergeCount(): number {
        return this._mergeCount;
    }
    public set mergeCount(value: number) {
        this._mergeCount = value;
    }
    // 合成个数
    private _mergeTimes: number = 0;
    public get mergeTimes(): number {
        return this._mergeTimes;
    }
    public set mergeTimes(value: number) {
        this._mergeTimes = value;
    }
    // SmallClaim 次数
    private _smallClaimCount: number = 0;

    public get smallClaimCount(): number {
        return this._smallClaimCount;
    }
    public set smallClaimCount(value: number) {
        this._smallClaimCount = value;
    }

    private _noClaimCount: number = 0;

    public get noClaimCount(): number {
        return this._noClaimCount;
    }
    public set noClaimCount(value: number) {
        this._noClaimCount = value;
    }
    // 现金是否提现
    private _isWithdrawAMoney: boolean = false;
    public get isWithdrawAMoney(): boolean {
        return this._isWithdrawAMoney;
    }
    public set isWithdrawAMoney(value: boolean) {
        this._isWithdrawAMoney = value;
    }

    // 奖励提升比率
    private _rate: number = 0;
    public get rate(): number {
        return this._rate;
    }
    public set rate(value: number) {
        this._rate = value;
        Language.updVariable("rate", FloatCalc.mul(this._rate, 100).toString());
    }

    // slot游戏次数
    private _slotGameTimes: number = 5;
    public get slotGameTimes(): number {
        return this._slotGameTimes;
    }
    public set slotGameTimes(value: number) {
        this._slotGameTimes = value;
        Language.updVariable("slotgame", this._slotGameTimes.toString());
        StorageBox.save("SLOT_GAME_TIEMS", this._slotGameTimes.toString());
    }
}

