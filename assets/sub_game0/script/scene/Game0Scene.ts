import { _decorator, Button, Component, director, EventTouch, find, instantiate, Label, macro, Node, Prefab, Sprite, tween, v3 } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { LoadingPanel } from '../component/panels/LoadingPanel';
import { SCENES_NAME, SLOT_CONDITION, SUBGAME } from '../../constant/Constant';
import { Panel } from 'db://assets/doge/framework/panel/Panel';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import { WithdrawSystem } from '../system/WithdrawSystem';
import { AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { Clock } from 'db://assets/doge/framework/common/Clock';
import { StorageBox } from 'db://assets/doge/framework/common/StorageBox';
import { CheckinSystem } from '../system/CheckinSystem';
import { SpriteSwitcher } from 'db://assets/main/script/component/SpriteSwitcher';
import { PropSystem, PropType } from '../system/PropSystem';
import { GameDataSystem } from '../system/GameDataSystem';
import { GuideSystem } from '../system/GuideSystem';
import { GuidePanel } from '../component/panels/GuidePanel';
import { UserSystem } from '../system/UserSystem';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { Toast } from 'db://assets/doge/framework/init';
import { GiftBoxPanel } from '../component/panels/GiftBoxPanel';
import { GameLogic } from '../game/GameLogic';
import { LevelSystem } from '../system/LevelSystem';
import { GameMap } from '../game/GameMap';
import { PanelCreator } from '../component/creator/PanelCreator';
import { CheckinPanel } from '../component/panels/CheckinPanel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { GameLayer } from '../component/panels/GameLayer';
const { ccclass, property } = _decorator;

@ccclass('Game0Scene')
export class Game0Scene extends Component {
    @property(Prefab)
    private tipsFrame: Prefab = null;

    @property(Node)
    private gameLogic: Node = null;
    @property(Node)
    private guidePanl: Node = null;
    @property(Node)
    private amoney: Node = null;
    @property(Node)
    private bmoney: Node = null;
    @property(Node)
    private levelWithdraw: Node = null;
    @property(Node)
    private withdrawTask: Node = null;
    @property(Node)
    private slotEntrance: Node = null;

    @property(Node)
    private withdrawTips: Node = null;
    @property(Node)
    private onlineReward: Node = null;
    @property(Node)
    private giftBox: Node = null;


    private onlineTime: number = 0;
    private onlineRewardNum: number = 0;
    private frame: Node = null;

    public static showLoading() {
        find("Canvas/Loading").getComponent(LoadingPanel).showLoading();
    }

    public static hideLoading() {
        find("Canvas/Loading").getComponent(LoadingPanel).hideLoading();
    }

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.SCENE.MAIN, this.toMainScene, this);
        getEventEmiter().on(SUBGAME.SCENE.GAME, this.restartGame, this);

        Language.on("@AMoney", this.onAMoneyChange, this);
        Language.on("@BMoney", this.onBMoneyChange, this);
        Language.on("@count2048", this.onCount2048Change, this)
        Language.on("@slotgame", this.onSlotGameTimesChange, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.SCENE.MAIN, this.toMainScene, this);
        getEventEmiter().off(SUBGAME.SCENE.GAME, this.restartGame, this);

        Language.off("@AMoney", this.onAMoneyChange, this);
        Language.off("@BMoney", this.onBMoneyChange, this);
        Language.off("@count2048", this.onCount2048Change, this)
        Language.off("@slotgame", this.onSlotGameTimesChange, this);
    }

    protected onLoad() {
        let gameLogic = this.gameLogic.getComponent(GameLogic);
        gameLogic.startGame(gameLogic.initGame());

        PanelFactory.openWithInstance(gameLogic.node.parent.getComponent(GameLayer), GameLayer)

        if (!PlayerSystem.I.isNewUser() && CheckinSystem.I.canPopup(new Date())) {
            // 弹出签到
            // PanelCreator.inPusher(CheckinPanel);
            CheckinSystem.I.setPopupTime(new Date());
        }

        this.onAMoneyChange();
        this.onBMoneyChange();
        this.onSlotGameTimesChange();

        tween(this.amoney.getComponentInChildren(Button).node)
            .to(1, { scales: 1.1 })
            .to(1, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();
        tween(this.bmoney.getComponentInChildren(Button).node)
            .to(1, { scales: 1.1 })
            .to(1, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();
        switch (Language.currency) {
            case CurrencyType.US:
            case CurrencyType.ID:
                this.levelWithdraw.active = false;
                this.withdrawTask.active = false;
                tween(this.levelWithdraw)
                    .to(1, { scales: 1.1 })
                    .to(1, { scales: 1.0 })
                    .union()
                    .repeatForever()
                    .start();
                break;
            case CurrencyType.BR:
                this.levelWithdraw.active = false;
                this.withdrawTask.active = true;
                tween(this.withdrawTask)
                    .to(1, { scales: 1.1 })
                    .to(1, { scales: 1.0 })
                    .union()
                    .repeatForever()
                    .start();
                break;
        }

        this.scheduleOnce(() => {
            Panel.init(this.guidePanl, GuidePanel);
            GuideSystem.I.show();
        }, 0.1);

        // 刷新段位信息
        let info = WithdrawSystem.I.getMaxLevelWithdrawInfo();
        this.levelWithdraw.getComponentInChildren(SpriteSwitcher).index(info.id);
        Language.updVariable("rankWithdraw", info.reward.toString());

        // 在线奖励
        this.openOnlineReward();

        Panel.init(this.giftBox, GiftBoxPanel);
    }

    async restartGame(level: number, preLevel: number) {
        let gameLogic = this.gameLogic.getComponent(GameLogic);
        gameLogic.startGame(gameLogic.initGame());

        // 显示提现比率
        if (level != preLevel) {
            PanelCreator.withdrawRate();
            // 刷新段位信息
            let info = WithdrawSystem.I.getMaxLevelWithdrawInfo();
            this.levelWithdraw.getComponentInChildren(SpriteSwitcher).index(info.id);
            Language.updVariable("rankWithdraw", info.reward.toString());
        }
    }

    onAMoneyChange() {
        // let label = this.withdrawTips.getComponentInChildren(Label);
        // let goodsData = WithdrawSystem.I.getGoodsData();
        // let goodsItem = goodsData.find((value) => {
        //     return AMoney.value() < value.FtEgPri;
        // })
        // if (goodsItem) {
        //     this.withdrawTips.active = true;
        //     let num = goodsItem.FtEgPri - AMoney.value();
        //     label.string = Language.getWord("l_withdrawTips", Language.getCurrSym(), AMoney.string(num), Language.getCurrSym(), AMoney.string(goodsItem.FtEgPri));
        // } else {
        //     this.withdrawTips.active = false;
        // }
    }

    onBMoneyChange() {
        if (PlayerSystem.I.isNewUser()) {
            return;
        }

        let current = BMoney.value1();
        let target = 0;
        switch (Language.currency) {
            case CurrencyType.US:
                target = 0.2;
                break;
            case CurrencyType.BR:
                target = 0.3;
                break;
            case CurrencyType.ID:
                target = 50;
                break;
        }

        let currTime = Clock.zero(new Date()).getTime();
        let time = StorageBox.load("WITHDRAW_GUIDE", "0").int();

        if (time != currTime && current >= target) {
            PanelCreator.pushWithdrawGuide();
            StorageBox.save("WITHDRAW_GUIDE", currTime.toString())
        }
    }

    onCount2048Change() {
        PanelCreator.withdrawRate();
        // 刷新段位信息
        let info = WithdrawSystem.I.getMaxLevelWithdrawInfo();
        this.levelWithdraw.getComponentInChildren(SpriteSwitcher).index(info.id);
        Language.updVariable("rankWithdraw", info.reward.toString());
    }

    onSlotGameTimesChange() {
        if (UserSystem.I.getSlotGameTimes() >= SLOT_CONDITION) {
            // find("Tips", this.slotEntrance).getComponent(Label).string = Language.getWord("l_millionaireJackpot");
            find("Progress", this.slotEntrance).getComponentInChildren(Sprite).fillRange = UserSystem.I.getSlotGameTimes() / SLOT_CONDITION;
            // 特效
            if (!this.frame) {
                let speed = 350;
                this.frame = instantiate(this.tipsFrame);
                this.frame.parent = this.slotEntrance;
                this.frame.position = v3(-275, 50, 0);
                tween(this.frame)
                    .by(540 / speed, { x: 550 })
                    .by(136 / speed, { y: -100 })
                    .by(540 / speed, { x: -550 })
                    .by(136 / speed, { y: 100 })
                    .union()
                    .repeatForever()
                    .start()
            }
        } else {
            // find("Tips", this.slotEntrance).getComponent(Label).string = Language.getWord("l_slotEntranceTips", UserSystem.I.getSlotGameTimes().toString(), SLOT_CONDITION.toString());
            find("Progress", this.slotEntrance).getComponentInChildren(Sprite).fillRange = UserSystem.I.getSlotGameTimes() / SLOT_CONDITION;
            // find("Bg", this.slotEntrance).getComponent(SpriteSwitcher).index(0);
            if (this.frame) {
                this.frame.destroy();
                this.frame = null;
            }
        }
    }

    openOnlineReward() {
        switch (Language.currency) {
            case CurrencyType.US:
                this.onlineReward.getComponentInChildren(SpriteSwitcher).index(0);
                break;
            case CurrencyType.BR:
                this.onlineReward.getComponentInChildren(SpriteSwitcher).index(1);
                break;
            case CurrencyType.ID:
                this.onlineReward.getComponentInChildren(SpriteSwitcher).index(2);
                break;
        }
        this.onlineTime = 60;
        let callback = (dt: number) => {
            this.onlineTime -= dt;
            let time = find("Time", this.onlineReward);
            let num = find("NumBg", this.onlineReward);
            let mask = find("Mask", this.onlineReward);
            let finger = find("Finger", this.onlineReward);
            if (this.onlineTime < 0) {
                this.onlineTime = 0;
            }
            if (this.onlineTime == 0) {
                num.active = true;
                time.active = false;
                finger.active = true;
                this.onlineReward.getComponent(Button).interactable = true;
                this.onlineRewardNum = UserSystem.I.getGiftCashReward();
                num.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(this.onlineRewardNum));
                this.unschedule(callback);
            } else {
                num.active = false;
                time.active = true;
                finger.active = false;
                this.onlineReward.getComponent(Button).interactable = false;
            }
            mask.getComponent(Sprite).fillRange = this.onlineTime / 60;
            time.getComponent(Label).string = `${Math.ceil(this.onlineTime)}s`;
        };
        this.schedule(callback, 0, macro.REPEAT_FOREVER, 0);
    }

    onOnlineRewardClick() {
        AMoney.set(AMoney.value() + this.onlineRewardNum);
        UserSystem.I.congratulationsMoney(this.onlineRewardNum, 0, 0);
        this.openOnlineReward();
    }

    onTargetBallClick() {
        Toast.show(Language.getWord("l_myWatermelon", GameDataSystem.I.get2048Count().toString()));
    }

    onRestartBtnClick() {
        LevelSystem.I.replay();
    }

    onSlotEntranceClick() {
        PanelCreator.slotGamePanel();
    }

    onSettingClick() {
        PanelCreator.settingPanel();
    }

    onBackBtnClick() {
        getEventEmiter().emit(SUBGAME.SCENE.MAIN);
    }

    onProp0BtnClick() {
        if (PropSystem.I.isEnough(PropType.PROP0)) {
            // 使用道具
            if (this.gameLogic.getComponent(GameLogic).onProp0Use()) {
                PropSystem.I.use(PropType.PROP0);
            }
        } else {
            // 弹出购买道具
            PanelCreator.propBuy(PropType.PROP0);
        }
    }

    onReplayClick() {
        if (GameMap.isReadyed()) {
            PanelCreator.replayPanel();
        }
    }

    onCheckinBtnClick() {
        PanelCreator.checkin();
    }

    onLevelWithdrawBtnClick() {
        PanelCreator.levelWithdraw();
    }

    onWithdrawTaskBtnClick() {
        PanelCreator.withdrawTask();
    }

    onAMoneyWithdraw() {
        PanelCreator.WithdrawA();
    }

    onBMoneyWithdraw() {
        PanelCreator.WithdrawB();
    }

    toMainScene() {
        Game0Scene.showLoading();
        // 场景预加载
        director.preloadScene(SCENES_NAME.Main, () => {
            director.loadScene(SCENES_NAME.Main, () => {
                Game0Scene.hideLoading();
            });
        });
    }
}


