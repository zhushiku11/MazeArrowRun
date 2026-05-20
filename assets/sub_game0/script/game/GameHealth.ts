import { _decorator, Component, Node } from 'cc';
import { PanelCreator } from '../component/creator/PanelCreator';
const { ccclass, property } = _decorator;

@ccclass('GameHealth')
export class GameHealth extends Component {

    @property([Node])
    private hp: Node[] = [];

    private health: number = 0;

    init() {
        this.setHealth(3);
    }

    reduce() {
        this.setHealth(this.health - 1);
    }

    add() {
        this.setHealth(this.health + 1);
    }

    setHealth(num: number) {
        this.health = num;

        for (let i = 0; i < this.hp.length; i++) {
            const item = this.hp[i];
            item.active = (i < this.health);
        }

        if (this.health <= 0) {
            // 失败
            PanelCreator.failed();
        }
    }
}


