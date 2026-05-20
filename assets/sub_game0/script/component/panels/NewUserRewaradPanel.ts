import { _decorator, Component, director, easing, find, instantiate, Label, Node, Prefab, Sprite, tween, v3 } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { CurrencyType, Language } from 'db://assets/doge/framework/language/Language';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AMoney, BMoney } from 'db://assets/doge/framework/common/Currency';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { AUDIOS, SUBGAME } from '../../../constant/Constant';
import UIHelper from 'db://assets/main/script/common/UIHelper';
import { GuideSystem } from '../../system/GuideSystem';
import { LevelSystem } from '../../system/LevelSystem';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { UserSystem } from '../../system/UserSystem';
const { ccclass, property } = _decorator;

@ccclass('NewUserRewaradPanel')
export class NewUserRewaradPanel extends Component implements IPanel {

    @property(Prefab)
    private moneyAnim: Prefab = null;

    @property(Node)
    private rewardA: Node = null;
    @property(Node)
    private rewardB: Node = null;
    @property(Node)
    private amoneyIcon: Node = null;
    @property(Node)
    private bmoneyIcon: Node = null;
    @property(Node)
    private finger: Node = null;

    private rewardANum: number = 0;
    private rewardBNum: number = 0;

    onInit(rewardA: number, rewardB: number) {
        PlayerSystem.I.notNewUser();

        UserSystem.I.addSlotGameTimes();

        this.rewardANum = rewardA;
        this.rewardBNum = rewardB;
        if (rewardA) {
            this.rewardA.getComponent(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), AMoney.string(rewardA));
        } else {
            this.rewardA.parent.active = false;
        }
        if (rewardB) {
            this.rewardB.getComponent(Label).string = Language.getWordByCurrency("l_money", Language.getCurrSym(), BMoney.string(rewardB));
        } else {
            this.rewardB.parent.active = false;
        }

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
    };

    onKill() {
    }

    afterCloseEffect() {
        if (GuideSystem.I.getStep() == 3) {
            // 下一关
            LevelSystem.I.passed();
            LevelSystem.I.next();

            director.getScheduler().schedule(() => {
                GuideSystem.I.nextShow();
            }, director.getScheduler(), 0, 0, 0.5, false);
        }
    }

    onWithdrawBtnClick() {
        this.node && PanelFactory.close(NewUserRewaradPanel);
        if (this.rewardANum > 0) {
            let target = find("Canvas/Scene/Topbar/AMoney");
            let icon = find("Icon", target);
            let moneyAnim = this.moneyAnim;
            UIHelper.showAMoneyFly(find("Canvas/Popup"), this.amoneyIcon.worldPosition, icon, (idx: number, last: number) => {
                if (idx == last) {
                    AMoney.refresh();
                }
                if (idx == 0) {
                    let num = find("Num", target);
                    let anim = instantiate(moneyAnim);
                    anim.parent = target;
                    anim.position = v3(num.position);
                    anim.getComponentInChildren(Sprite).spriteFrame = icon.getComponent(Sprite).spriteFrame;
                    tween(anim)
                        .by(1.0, { position: v3(0, 50, 0) }, { easing: easing.cubicOut })
                        .to(0.2, { alpha: 0 })
                        .removeSelf()
                        .start();
                    anim.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money1", "+", Language.getCurrSym(), AMoney.string(this.rewardANum))
                }
            })
        }
        if (this.rewardBNum > 0) {
            let target = find("Canvas/Scene/Topbar/BMoney");
            let icon = find("Icon", target);
            let moneyAnim = this.moneyAnim;
            UIHelper.showBMoneyFly(find("Canvas/Popup"), this.bmoneyIcon.worldPosition, icon, (idx: number, last: number) => {
                if (idx == last) {
                    BMoney.refresh();
                }
                if (idx == 0) {
                    let num = find("Num", target);
                    let anim = instantiate(moneyAnim);
                    anim.parent = target;
                    anim.position = v3(num.position);
                    anim.getComponentInChildren(Sprite).spriteFrame = icon.getComponent(Sprite).spriteFrame;
                    tween(anim)
                        .by(1.0, { position: v3(0, 50, 0) }, { easing: easing.cubicOut })
                        .to(0.2, { alpha: 0 })
                        .removeSelf()
                        .start();
                    anim.getComponentInChildren(Label).string = Language.getWordByCurrency("l_money1", "+", Language.getCurrSym(), BMoney.string(this.rewardBNum))
                }
            })
        }
    }
}


