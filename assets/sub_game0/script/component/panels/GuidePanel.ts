import { _decorator, Button, Component, director, find, Label, Node, Prefab, size, Sprite, SpriteFrame, tween, Tween, v3 } from 'cc';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { GuideSystem } from '../../system/GuideSystem';
import { Utils } from 'db://assets/doge/framework/common/Utils';
import { PRELOAD, RES_NAME, SUBGAME } from '../../../constant/Constant';
import { NewUserRewaradPanel } from './NewUserRewaradPanel';
import { CheckinSystem } from '../../system/CheckinSystem';
import { GameLogic } from '../../game/GameLogic';
import { MapSystem } from '../../system/MapSystem';
import { Language } from 'db://assets/doge/framework/language/Language';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { UserSystem } from '../../system/UserSystem';
import { AssetsDB } from 'db://assets/doge/framework/common/AssetsDB';
import { GameMap } from '../../game/GameMap';
import { PanelCreator } from '../creator/PanelCreator';
import { PinchZoom } from '../PinchZoom';
const { ccclass, property } = _decorator;

@ccclass('GuidePanel')
export class GuidePanel extends Component implements IPanel {
    @property([Node])
    private steps: Node[] = [];
    @property(Node)
    private mask: Node = null;
    @property(Node)
    private gameLogic: Node = null;
    @property(Node)
    private amoney: Node = null;
    @property(Node)
    private bmoney: Node = null;
    @property(Node)
    private guidePinch: Node = null;
    @property(Node)
    private gamePinch: Node = null;

    private tmpParent: Node = null;

    protected onEnable(): void {
        getEventEmiter().on("GuideShow", this.show, this);
    }

    protected onDisable(): void {
        getEventEmiter().off("GuideShow", this.show, this);
    }

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };

    onInit() {
    }

    show() {
        this.mask.active = false;
        this.getComponent(Button).enabled = false;
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            step.active = false;
        }
        this.guidePinch.active = false;

        let step = GuideSystem.I.getStep();
        let slot: Node = null;
        let finger: Node = null;
        let tipsTxt: Label = null;
        let stepItem: Node = null;
        let tile = null;
        let tileWorldPos = null;
        switch (step) {
            case 0:
                getEventEmiter().emit(SUBGAME.FUNC.GAME_PAUSE);
                stepItem = this.steps[step];
                stepItem.active = true;
                this.getComponent(Button).enabled = true;
                break;
            case 1:
                stepItem = this.steps[step];
                stepItem.active = true;

                let finger0 = find("Finger0", stepItem);
                let finger1 = find("Finger1", stepItem);
                tween(finger0)
                    .by(1.2, { x: -50 })
                    .by(0, { x: 50 })
                    .union()
                    .repeatForever()
                    .start();
                tween(finger1)
                    .by(1.2, { x: 50 })
                    .by(0, { x: -50 })
                    .union()
                    .repeatForever()
                    .start();

                this.getComponent(Button).enabled = true;
                this.guidePinch.active = true;
                break;
            case 2:
                let progress = this.guidePinch.getComponent(PinchZoom).getProgress();
                this.gamePinch.getComponent(PinchZoom).setProgressValue(progress, false);
                break;
            case 3:
                console.log("step 3");  
                PanelCreator.newUserRewarad();
                break;
            case 4:
                GuideSystem.I.nextStep();
                this.show();
                // this.mask.active = true;
                // stepItem = this.steps[step];
                // stepItem.active = true;
                // slot = find("Slot", stepItem);
                // finger = find("Finger", stepItem);
                // this.tmpParent = this.amoney.parent;
                // Utils.changeParent(this.amoney, slot);
                // this.getComponent(Button).enabled = true;
                // tween(finger)
                //     .delay(0.15)
                //     .set({ angle: 30 })
                //     .delay(0.15)
                //     .set({ angle: 0 })
                //     .delay(0.15)
                //     .set({ angle: 30 })
                //     .delay(0.15)
                //     .set({ angle: 0 })
                //     .delay(0.8)
                //     .union()
                //     .repeatForever()
                //     .start();
                break;
            case 5:
                Utils.changeParent(this.amoney, this.tmpParent);
                GuideSystem.I.nextStep();
                this.show();
                break;
            case 6:
                this.mask.active = true;
                stepItem = this.steps[step];
                stepItem.active = true;
                slot = find("Slot", stepItem);
                finger = find("Finger", stepItem);
                this.tmpParent = this.bmoney.parent;
                Utils.changeParent(this.bmoney, slot);
                this.getComponent(Button).enabled = true;
                tween(finger)
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
                break;
            case 7:
                Utils.changeParent(this.bmoney, this.tmpParent);
                break;
            case 8:
                getEventEmiter().emit(SUBGAME.FUNC.GAME_RESUME);
                GuideSystem.I.nextStep();
                this.show();
                break;
        }
    }


    onNextBtnClick() {
        let step = GuideSystem.I.getStep();
        switch (step) {
            case 0:
                GuideSystem.I.nextStep();
                this.show();
                let arrowLayer = this.gameLogic.getComponent(GameMap).getArrowLayerById(1);
                arrowLayer.onArrowClick();
                break;
            case 4:
                GuideSystem.I.nextStep();
                this.show();
                GuideSystem.I.nextStep();
                this.show();
                break;
            case 6:
                GuideSystem.I.nextStep();
                this.show();
                GuideSystem.I.nextStep();
                this.show();
                break;
        }
    }
}


