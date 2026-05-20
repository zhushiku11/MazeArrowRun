import { _decorator, Component } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { LevelSystem } from '../../system/LevelSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
const { ccclass, property } = _decorator;

@ccclass('ReplayPanel')
export class ReplayPanel extends Component implements IPanel {

    onInit() {

    }

    close() {
        this.node && PanelFactory.close(ReplayPanel);
    }

    onCloseClick() {
        this.close();
    }

    onRestartBtnClick() {
        LevelSystem.I.replay();
        this.node && PanelFactory.close(ReplayPanel);
    }
}