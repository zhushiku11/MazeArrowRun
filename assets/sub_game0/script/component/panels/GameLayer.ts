import { _decorator, Component, Node } from 'cc';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { SUBGAME } from '../../../constant/Constant';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
const { ccclass, property } = _decorator;

@ccclass('GameLayer')
export class GameLayer extends Component implements IPanel {

    onInit() {

    }

    activate(isNew: boolean) {
        if (!isNew) {
            getEventEmiter().emit(SUBGAME.FUNC.GAME_RESUME);
            console.log("GameLayer activate");
        }
    };

    deactivate(isRemove: boolean) {
        if (!isRemove) {
            getEventEmiter().emit(SUBGAME.FUNC.GAME_PAUSE);
            console.log("GameLayer deactivate");
        }
    };

    onOpenEffect(target: Node, next: () => void) {
        next();
    };

    onCloseEffect(target: Node, next: () => void) {
        next();
    };
}