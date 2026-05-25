import { _decorator, Component, find, Label, Node, RichText, Sprite, tween } from 'cc';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { UserSystem } from '../../system/UserSystem';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { SUBGAME } from '../../../constant/Constant';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
const { ccclass, property } = _decorator;

@ccclass('NormalRewardPanel')
export class NormalRewardPanel extends Component implements IPanel {

    @property(Node)
    private rewardA: Node = null;
    @property(Node)
    private highest: Node = null;
    @property(Node)
    private claimBtn: Node = null;
    @property(Node)
    private noNeed: Node = null;
    @property(Node)
    private upItem: Node = null;
    @property(Node)
    private withdrawTips: Node = null;

    private rewardANum: number = 0;
    private lock: boolean = false;

    onInit(rewardA: number) {
        //BMoney.string(bmoneyReward)
        this.rewardANum = rewardA;
        console.log('=== NormalRewardPanel rewardANum ===', this.rewardANum);
        if (this.rewardANum) {
            this.rewardA.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(this.rewardANum));
        } else {
            this.rewardA.active = false;
        }
        this.highest.active = true;

        this.noNeed.active = false;
        tween(this.noNeed)
            .delay(2.0)
            .call(() => {
                this.noNeed.active = true;
            })
            .set({ alpha: 0 })
            .to(0.2, { alpha: 255 })
            .start();

        tween(this.claimBtn)
            .to(1, { scales: 1.2 })
            .to(1, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();


        let info = WithdrawSystem.I.getInfo();
        let adCount = WithdrawSystem.I.getAdCount();
        let startRate = UserSystem.I.getRate();
        let endRate = 0;
        let limit = 0;
        if (startRate == info.mj_one_rate / 100) {
            endRate = info.mj_two_rate / 100;
            limit = info.mj_two;
        } else if (startRate == info.mj_two_rate / 100) {
            endRate = info.mj_three_rate / 100;
            limit = info.mj_three;
        } else if (startRate == info.mj_three_rate / 100) {
            endRate = info.mj_three_rate / 100;
            limit = info.mj_three;
        } else {
            endRate = info.mj_one_rate / 100;
            limit = info.mj_one;
        }
        find("Title", this.upItem).getComponent(Label).string = Language.getWord("l_upTips");
        find("Progress/Fg", this.upItem).getComponent(Sprite).fillRange = adCount / limit;
        find("Progress/Txt", this.upItem).getComponent(Label).string = Language.getWord("l_text5", `${adCount}`, `${limit}`);
        find("LeftTxt", this.upItem).getComponent(Label).string = Language.getWord("l_text1", `+${startRate * 100}%`);
        find("RightTxt", this.upItem).getComponent(Label).string = Language.getWord("l_text1", `+${endRate * 100}%`);

        limit = 0;
        let data = [WithdrawSystem.I.getGoodsData()[1]];
        let cmoney = AMoney.value();
        switch (Language.currency) {
            case CurrencyType.US:
                find("Platform", this.withdrawTips).getComponent(SpriteSwitcher).index(0);
                limit = data.find((value) => {
                    return cmoney < value.FtEgPri;
                })?.FtEgPri;
                break;
            case CurrencyType.ID:
                find("Platform", this.withdrawTips).getComponent(SpriteSwitcher).index(2);
                limit = data.find((value) => {
                    return cmoney < value.FtEgPri;
                })?.FtEgPri;
                break;
            case CurrencyType.BR:
            default:
                find("Platform", this.withdrawTips).getComponent(SpriteSwitcher).index(1);
                limit = data.find((value) => {
                    return cmoney < value.FtEgPri;
                })?.FtEgPri;
                break;
        }

        if (limit) {
            find("Progress/Fg", this.withdrawTips).getComponent(Sprite).fillRange = cmoney / limit;
            find("Progress/Txt", this.withdrawTips).getComponent(RichText).string = Language.getWord("l_withdrawPercentTips", Language.getCurrSym(), AMoney.string(limit - cmoney), Language.getCurrSym(), AMoney.string(limit));
        } else {
            this.withdrawTips.active = false;
        }
    };

    async onClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        // 领取单倍奖励
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, this.rewardANum, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
            }
        })
        this.node && PanelFactory.close(NormalRewardPanel);
    }

    async onNoClaimBtnClick() {
        if (this.lock) {
            return;
        }
        this.lock = true;
        UserSystem.I.noClaimUp();
        if (UserSystem.I.isNoClaimAchieve()) {
            // 领取单倍奖励
            UserSystem.I.getAdReward(AD_TYPE.INTER, REWARD_TYPE.REWARD, this.rewardANum, (isErr: boolean, rewardA: number, rewardB: number) => {
                this.node && PanelFactory.close(NormalRewardPanel);
                if (isErr) {
                    return;
                }
                if (rewardA > 0 || rewardB > 0) {
                    // 广告奖励
                    UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
                }
            })
        } else {
            this.node && PanelFactory.close(NormalRewardPanel);
        }

    }

    afterCloseEffect() {
    }
}


