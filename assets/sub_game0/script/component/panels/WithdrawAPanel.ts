import { _decorator, Button, color, Component, EventTouch, find, Label, Node, Sprite, tween } from 'cc';
import { GoodsData, WithdrawSystem } from '../../system/WithdrawSystem';
import { AMoney } from 'db://assets/doge/framework/common/Currency';
import { Language } from 'db://assets/doge/framework/language/Language';
import { Toast } from 'db://assets/doge/framework/init';
import { UserSystem } from '../../system/UserSystem';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { AD_TYPE, NI, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { MAIN } from 'db://assets/main/constant/Constant';
import { SUBGAME } from '../../../constant/Constant';
import { GuideSystem } from '../../system/GuideSystem';
import { LevelSystem } from '../../system/LevelSystem';
import { StorageBox } from 'db://assets/doge/framework/common/StorageBox';
import { PanelCreator } from '../creator/PanelCreator';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

@ccclass('WithdrawAPanel')
export class WithdrawAPanel extends Component implements IPanel {

    @property([Node])
    private amountItemList: Node[] = [];
    @property(Sprite)
    private progress: Sprite = null;
    @property(Label)
    private percent: Label = null;
    @property(Label)
    private tips: Label = null;
    @property(Node)
    private finger: Node = null;
    @property(Node)
    private withdrawBtn = null;

    private goodsItem: GoodsData = null;
    private withdrawAdState: boolean = false;

    protected onEnable(): void {
        getEventEmiter().on(MAIN.FUNC.MOBILE_BACK, this.onSystemBack, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(MAIN.FUNC.MOBILE_BACK, this.onSystemBack, this);
    }

    onSystemBack() {
        this.onBackBtnClick();
    }

    afterOpenEffect(target: Node) {
        NI.currentPage(0);
        if (GuideSystem.I.getStep() == 4) {
            GuideSystem.I.nextShow();
        }
    };

    afterCloseEffect(target: Node) {
        if (GuideSystem.I.getStep() == 5) {
            GuideSystem.I.nextShow();
        }
    };

    onInit() {
        NI.currentPage(1);
        if (UserSystem.I.isAMoneyWithdrawed()) {
            this.onSelected(1);
        } else {
            this.onSelected(0);
        }
        // this.withdrawAdState = PlayerSystem.I.isReview() || !!StorageBox.load("WITHDRAW_AD", "0").int();
        this.withdrawAdState = true;
        this.withdrawBtn.getComponentInChildren(Sprite).node.active = !this.withdrawAdState;
    };

    onOpenEffect(target: Node, next: () => void) {
        next();
    }

    onCloseEffect(target: Node, next: () => void) {
        next();
    }

    onItemClick(event: EventTouch, arg0: string) {
        this.onSelected(parseInt(arg0));
    }

    initItem() {
        let goods = WithdrawSystem.I.getGoodsData();
        for (let i = 0; i < this.amountItemList.length; i++) {
            const item = this.amountItemList[i];
            if (i == 0 && UserSystem.I.isAMoneyWithdrawed()) {
                item.getComponent(SpriteSwitcher).index(0);
                item.getComponent(Sprite).grayscale = true;
                let label = item.getComponentInChildren(Label);
                label.color = color(169, 169, 169, 255);
                label.string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(goods[0].FtEgPri));
                item.getComponent(Button).interactable = false;
            } else {
                item.getComponent(SpriteSwitcher).index(0);
                item.getComponent(Sprite).grayscale = false;
                let label = item.getComponentInChildren(Label);
                label.color = color(248, 255, 43, 255);
                label.string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(goods[i].FtEgPri));
                item.getComponent(Button).interactable = true;
            }
        }
    }

    onSelected(index: number) {
        this.initItem();

        let goods = WithdrawSystem.I.getGoodsData();
        let goodsItem = goods[index];
        this.goodsItem = goodsItem;

        const item = this.amountItemList[index];
        item.getComponent(SpriteSwitcher).index(1);
        item.getComponent(Sprite).grayscale = false;
        for (const elem of this.amountItemList) {
            find("Check", elem).active = elem == item;
        }
        find("Check", item).active = true;
        let label = item.getComponentInChildren(Label);
        // label.color = color(64, 68, 84, 255);
        label.string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(goods[index].FtEgPri));

        let percent = 0;
        if (!AMoney.isEnough(goodsItem.FtEgPri)) {
            // 金额未达标
            percent = AMoney.value() / goodsItem.FtEgPri;
            this.tips.string = Language.getWord("l_amountCondition", Language.getCurrSym(), AMoney.string(goodsItem.FtEgPri), Language.getCurrSym(), AMoney.string(goodsItem.FtEgPri - AMoney.value()));
        } else if (LevelSystem.I.getCurrPass() < goodsItem.FtEgMl) {
            // } else if (GameDataSystem.I.get2048Count() < goodsItem.FtEgMl) {
            // 关卡未达标
            let passedNum = LevelSystem.I.getCurrPass();
            // let passedNum = GameDataSystem.I.get2048Count();
            percent = passedNum / goodsItem.FtEgMl;
            this.tips.string = Language.getWord("l_levelCondition", `${goodsItem.FtEgMl}`, `${goodsItem.FtEgMl - passedNum}`);
        } else if (PlayerSystem.I.getLoginDay(goodsItem.FtEgDl).length < goodsItem.FtEgLg) {
            let dayInfo = PlayerSystem.I.getLoginDay(goodsItem.FtEgDl);
            // 累计登录天数未达标
            percent = dayInfo.length / goodsItem.FtEgLg;
            this.tips.string = Language.getWord("l_loginCondition", `${goodsItem.FtEgLg - dayInfo.length}`, `${goodsItem.FtEgDl}`);
        } else if (PlayerSystem.I.getTotalAdCount() < goodsItem.FtEgAd) {
            // 视频数量未达标
            percent = PlayerSystem.I.getTotalAdCount() / goodsItem.FtEgAd;
            this.tips.string = Language.getWord("l_adCondition", `${goodsItem.FtEgAd}`, `${goodsItem.FtEgAd - PlayerSystem.I.getTotalAdCount()}`);
        } else {
            percent = 1;
            this.tips.string = Language.getWord("l_completeCondition");
        }
        this.progress.fillRange = percent;
        this.percent.string = Language.getWord("l_text2", (percent * 100).toFixed(2), "%");
    }

    onWithdrawBtnClick() {
        if (this.goodsItem.FtEgId == 0) {
            console.log("go to withdraw");
            if (AMoney.isEnough(this.goodsItem.FtEgPri)) {
                if (this.withdrawAdState) {
                    this.openWithdraInfo();
                } else {
                    UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, UserSystem.I.getCashReward(), (isErr: boolean, rewardA: number, rewardB: number) => {
                        if (isErr) {
                            return;
                        }
                        console.log("Play ad end, to withdraw");
                        StorageBox.save("WITHDRAW_AD", "1");
                        this.withdrawAdState = true;
                        this.withdrawBtn.getComponentInChildren(Sprite).node.active = !this.withdrawAdState;
                        this.openWithdraInfo();
                    });
                }
            }
        } else {
            let str = null;
            if (this.progress.fillRange >= 1) {
                str = Language.getWord("l_completeWithdraw");
            } else {
                str = Language.getWord("l_notWithdraw");
            }
            Toast.show(str);
        }
    }

    openWithdraInfo() {
        UserSystem.I.openWithdrawInput(this.goodsItem.FtEgPri, (isWithdraw: number, amount: number) => {
            if (!!isWithdraw) {
                AMoney.use(amount);
                UserSystem.I.amoneyWithdrawed();
                this.onSelected(1);
                // 提现记录引导
                this.finger.active = true;
                this.finger.angle = 0;
                tween(this.finger)
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.15)
                    .set({ angle: 30 })
                    .delay(0.15)
                    .set({ angle: 0 })
                    .delay(0.8)
                    .union()
                    .repeatForever()
                    .start();
            }
        });
    }

    onBackBtnClick() {
        this.node && PanelFactory.close(WithdrawAPanel);
    }

    onRecordBtnClick() {
        PanelCreator.withdrawRecord();
        this.finger.active = false;
    }

    onFAQBtnClick() {
        PanelCreator.withdrawFAQ();
    }
}


