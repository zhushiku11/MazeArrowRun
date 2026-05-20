import { _decorator, Component, Node, tween, v3, v4 } from 'cc';
import { GameArrowLayer } from './GameArrowLayer';
import { GameMap } from './GameMap';
const { ccclass, property } = _decorator;

@ccclass('GameHintLayer')
export class GameHintLayer extends Component {

    @property(Node)
    private finger: Node = null;

    show(arrowLayer: GameArrowLayer) {
        let point = arrowLayer.getFirstPoint();
        let pos = GameMap.toPosition(point.x, point.y, arrowLayer.node.widths, arrowLayer.node.heights);
        this.finger.active = true;
        this.finger.position = v3(pos.x + 35, pos.y - 65, 0);
        tween(this.finger)
            .to(0.7, { scales: 1.1 })
            .to(0.7, { scales: 1.0 })
            .union()
            .repeatForever()
            .start();
    }

    hide() {
        this.finger.active = false;
    }
}


