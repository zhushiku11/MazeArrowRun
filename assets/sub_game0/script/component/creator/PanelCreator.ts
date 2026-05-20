

import { _decorator, Component, find, Prefab, Node } from 'cc';
import { CongratulationsPanel } from 'db://assets/main/script/component/panels/CongratulationsPanel';
import { NewUserRewaradPanel } from 'db://assets/sub_game0/script/component/panels/NewUserRewaradPanel';
import { NormalRewardPanel } from 'db://assets/sub_game0/script/component/panels/NormalRewardPanel';
import { PassRewardPanel } from 'db://assets/sub_game0/script/component/panels/PassRewardPanel';
import { FailedPanel } from 'db://assets/sub_game0/script/component/panels/FailedPanel';
import { TimeoutPanel } from 'db://assets/sub_game0/script/component/panels/TimeoutPanel';
import { WithdrawGuidePanel } from 'db://assets/sub_game0/script/component/panels/WithdrawGuidePanel';
import { SettingPanel } from 'db://assets/sub_game0/script/component/panels/SettingPanel';
import { WithdrawRatePanel } from 'db://assets/sub_game0/script/component/panels/WithdrawRatePanel';
import { WithdrawTaskPanel } from 'db://assets/sub_game0/script/component/panels/WithdrawTaskPanel';
import { SlotGamePanel } from 'db://assets/sub_game0/script/component/panels/SlotGamePanel';
import { PropBuyPanel } from 'db://assets/sub_game0/script/component/panels/PropBuyPanel';
import { WithdrawAPanel } from 'db://assets/sub_game0/script/component/panels/WithdrawAPanel';
import { WithdrawBPanel } from 'db://assets/sub_game0/script/component/panels/WithdrawBPanel';
import { LevelWithdrawPanel } from 'db://assets/sub_game0/script/component/panels/LevelWithdrawPanel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { UserSystem } from '../../system/UserSystem';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { PropType } from '../../system/PropSystem';
import { GuideSystem } from '../../system/GuideSystem';
import { Panel } from 'db://assets/doge/framework/panel/Panel';
import { LevelSystem } from '../../system/LevelSystem';
import { GameDataSystem } from '../../system/GameDataSystem';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import { CheckinPanel } from '../panels/CheckinPanel';
import { NI } from 'db://assets/native_interface/NI';
import { SlotRewardPanel } from '../panels/SlotRewardPanel';
import { ReplayPanel } from '../panels/ReplayPanel';
import { WinPanel } from '../panels/WinPanel';
const { ccclass, property } = _decorator;

@ccclass('PanelCreator')
export class PanelCreator extends Component {

    @property(Prefab)
    private congratulationsPanel: Prefab = null;
    @property(Prefab)
    private propBuyPanel: Prefab = null;
    @property(Prefab)
    private failedPanel: Prefab = null;
    @property(Prefab)
    private winPanel: Prefab = null;
    @property(Prefab)
    private timeoutPanel: Prefab = null;
    @property(Prefab)
    private withdrawAPanel: Prefab = null;
    @property(Prefab)
    private withdrawBPanel: Prefab = null;
    @property(Prefab)
    private newUserRewardPanel: Prefab = null;
    @property(Prefab)
    private normalRewardPanel: Prefab = null;
    @property(Prefab)
    private passRewardPanel: Prefab = null;
    @property(Prefab)
    private withdrawGuidePanel: Prefab = null;
    @property(Prefab)
    private withdrawRatePanel: Prefab = null;
    @property(Prefab)
    private levelWithdrawPanel: Prefab = null;
    @property(Prefab)
    private withdrawTaskPanel: Prefab = null;
    @property(Prefab)
    private slotGamePanel: Prefab = null;
    @property(Prefab)
    private slotRewardPanel: Prefab = null;
    @property(Prefab)
    private settingPanel: Prefab = null;
    @property(Prefab)
    private replayPanel: Prefab = null;

    private static pusher: Function[] = [];
    private static pushing: Function = null;

    start() {
        PanelFactory.init([
            [CongratulationsPanel, this.congratulationsPanel],
            [PropBuyPanel, this.propBuyPanel],
            [FailedPanel, this.failedPanel],
            [WinPanel, this.winPanel],
            [TimeoutPanel, this.timeoutPanel],
            [WithdrawAPanel, this.withdrawAPanel],
            [WithdrawBPanel, this.withdrawBPanel],
            [NewUserRewaradPanel, this.newUserRewardPanel],
            [NormalRewardPanel, this.normalRewardPanel],
            [PassRewardPanel, this.passRewardPanel],
            [WithdrawGuidePanel, this.withdrawGuidePanel],
            [WithdrawRatePanel, this.withdrawRatePanel],
            [LevelWithdrawPanel, this.levelWithdrawPanel],
            [WithdrawTaskPanel, this.withdrawTaskPanel],
            [SlotGamePanel, this.slotGamePanel],
            [SlotRewardPanel, this.slotRewardPanel],
            [SettingPanel, this.settingPanel],
            [ReplayPanel, this.replayPanel],
        ], this.node);
    }

    protected update(dt: number): void {
        PanelCreator.pollingPush();
    }

    public static congratulations(amoney: number, bmoney: number, cmoney: number, acoins: number) {
        PanelFactory.I.createPanel(CongratulationsPanel, find("Canvas/Popup"), amoney, bmoney, cmoney, acoins);
    }

    public static propBuy(type: PropType) {
        PanelFactory.open(PropBuyPanel, type);
    }

    public static failed() {
        PanelFactory.open(FailedPanel);
    }

    public static win() {
        PanelFactory.open(WinPanel);
    }

    public static timeout(percent: number) {
        PanelFactory.open(TimeoutPanel, percent)
    }

    public static WithdrawA() {
        PanelFactory.open(WithdrawAPanel);
    }

    public static WithdrawB() {
        PanelFactory.open(WithdrawBPanel);
    }

    public static checkin() {
        // PanelFactory.open(CheckinPanel);
    }

    public static newUserRewarad() {
        // 新手奖励
        UserSystem.I.getNewUserReward((rewardA: number, rewardB: number) => {
            console.log("getNewUserReward", rewardA, rewardB);
            if (rewardA > 0 || rewardB > 0) {
                PanelFactory.open(NewUserRewaradPanel, rewardA, rewardB);
            } else {
                PlayerSystem.I.notNewUser();
            }
        })
    }

    public static normalReward() {
        let rewardA = UserSystem.I.getCashReward();
        PanelFactory.open(NormalRewardPanel, rewardA);
    }

    public static passReward() {
        if (GuideSystem.I.isEnd()) {
            // 通关奖励
            let rewardA = UserSystem.I.getCashReward();
            PanelFactory.open(PassRewardPanel, LevelSystem.I.getRunningPass() + 1, rewardA);
        }
    }

    public static withdrawGuide() {

    }

    public static pushWithdrawGuide() {
        PanelCreator.inPusher(WithdrawGuidePanel);
    }

    public static withdrawRate() {
        let count = LevelSystem.I.getCurrLevel();
        // let count = GameDataSystem.I.get2048Count();
        if (GuideSystem.I.isEnd() && WithdrawSystem.I.isShowWithdrawRate(count)) {
            PanelFactory.open(WithdrawRatePanel, count);
        }
    }

    public static levelWithdraw() {
        PanelFactory.open(LevelWithdrawPanel);
    }

    public static withdrawTask() {
        PanelFactory.open(WithdrawTaskPanel);
    }

    public static withdrawRecord() {
        // PanelFactory.open(WithdrawRecord);
        NI.playWithdrawRecord();
    }

    public static withdrawFAQ() {
        // PanelFactory.open(WithdrawFAQPanel);
        NI.playWithdrawFAQ();
    }

    public static withdrawInfo(type: number, amount: number, endCb: Function) {
        // PanelFactory.open(InformationInputPanel, type, amount, endCb);
    }

    public static slotGamePanel() {
        PanelFactory.open(SlotGamePanel);
    }

    public static slotReward(slotgameNode: Node, rewardType: number, rewardA: number, rewardB: number) {
        PanelFactory.open(SlotRewardPanel, slotgameNode, rewardType, rewardA, rewardB);
    }

    public static settingPanel() {
        PanelFactory.open(SettingPanel);
    }

    public static replayPanel() {
        PanelFactory.open(ReplayPanel);
    }

    public static inPusher(cls: typeof Component, ...args: any[]) {
        this.pusher.push(() => {
            const panel: any = PanelFactory.open(cls, ...args);
            const func = panel.afterCloseEffect;
            panel.afterCloseEffect = (target: Node) => {
                panel.afterCloseEffect = func;
                func && func(target);
                this.pusher.shift();
            }
        });
    }

    private static pollingPush() {
        let head = this.pusher[0];
        if (head && head != this.pushing) {
            this.pushing = head;
            head();
        }
    }
}