import { _decorator, Component, Node } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { UserSystem } from '../../system/UserSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { GuideSystem } from '../../system/GuideSystem';
const { ccclass, property } = _decorator;

@ccclass('WithdrawBPanel')
export class WithdrawBPanel extends Component implements IPanel {

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };

    onInit() {

    }

    activate(isNew: boolean) {
        if (isNew) {
            UserSystem.I.openWithdraw((isWithdraw: number) => {
                this.node && PanelFactory.close(WithdrawBPanel);
            });
        }
    }

    afterOpenEffect(target: Node) {
        if (GuideSystem.I.getStep() == 6) {
            GuideSystem.I.nextShow();
        }
    };

    afterCloseEffect() {
        if (GuideSystem.I.getStep() == 7) {
            GuideSystem.I.nextShow();
        }
    }
}


