import { _decorator, Component } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { LevelSystem } from '../../system/LevelSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { ACoins } from 'db://assets/doge/framework/common/Currency';
const { ccclass, property } = _decorator;

@ccclass('WinPanel')
export class WinPanel extends Component implements IPanel {

    onInit() {
        ACoins.give(100);
    }

    onNextBtnClick() {
        this.node && PanelFactory.close(WinPanel);
    }

    afterCloseEffect() {
        LevelSystem.I.passed();
        LevelSystem.I.next();
    }
}