import { _decorator, Component, Label, Node } from 'cc';
import { WithdrawSystem } from '../../system/WithdrawSystem';
import FloatCalc from 'db://assets/doge/framework/common/FloatCalc';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { PanelCreator } from '../creator/PanelCreator';
const { ccclass, property } = _decorator;

@ccclass('WithdrawRatePanel')
export class WithdrawRatePanel extends Component implements IPanel {

    @property(Node)
    private beforeRate: Node = null;
    @property(Node)
    private nowRate: Node = null;

    onInit(count: number) {
        let data = WithdrawSystem.I.getRateInfo();
        let index = data.findIndex((value: any) => {
            return count >= value.MjPbe && count <= value.MjPen;
        })
        let lastIndex = index - 1;
        console.log("count", count);
        console.log("lastindex", lastIndex);
        console.log("index", index);

        if (lastIndex >= 0) {
            this.beforeRate.active = true;
            let item = data[lastIndex];
            this.beforeRate.getComponent(Label).string = `${FloatCalc.div(item.MjPwr, data[0].MjPwr)}x`;
        } else {
            this.beforeRate.active = false;
            this.beforeRate.getComponent(Label).string = `1x`;
        }

        if (index >= 0) {
            this.nowRate.active = true;
            let item = data[index];
            this.nowRate.getComponent(Label).string = `${FloatCalc.div(item.MjPwr, data[0].MjPwr)}x`;
        }
    };

    onCheckBtnClick() {
        this.node && PanelFactory.close(WithdrawRatePanel);
        PanelCreator.WithdrawB();
    }

    onCloseClick() {
        this.node && PanelFactory.close(WithdrawRatePanel);
    }
}


