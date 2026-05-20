import { _decorator, Component, Node, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { GameMap } from './GameMap';
import { ArrowDirection, UNIT_HEIGHT, UNIT_WIDTH } from '../system/MapSystem';
import { Wait } from 'db://assets/doge/framework/common/Utils';
const { ccclass, property } = _decorator;

@ccclass('GameGridLayer')
export class GameGridLayer extends Component {

    @property(SpriteFrame)
    private gridDotSpf: SpriteFrame = null;

    private dotMap: Node[][] = null;

    async init(w: number, h: number) {
        let width = w * UNIT_WIDTH;
        let height = h * UNIT_HEIGHT;

        this.dotMap = new Array(w);
        for (let x = 0; x < w; x++) {
            this.dotMap[x] = new Array(h);
            for (let y = 0; y < h; y++) {
                const position = GameMap.toPosition(x, y, width, height);
                let dot = this.createDot();
                dot.position = v3(position.x, position.y, 0);
                this.dotMap[x][y] = dot;
            }
            await new Wait().second(0.01);
        }
    }

    clear() {
        this.node.removeAllChildren();
    }

    createDot() {
        let templateNode = new Node();
        let sp = templateNode.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.TRIMMED;
        sp.type = Sprite.Type.SIMPLE;
        sp.spriteFrame = this.gridDotSpf;
        templateNode.parent = this.node;
        return templateNode;
    }

    get(x: number, y: number) {
        return this.dotMap[x][y];
    }

    bounce(points0: { x: number, y: number }[]) {
        if (!this.dotMap || this.dotMap.length == 0) {
            return;
        }
        for (let i = 0; i < points0.length; i++) {
            const point = points0[i];
            let node = this.get(point.x, point.y);
            tween(node)
                .delay(0.01 + i * 0.03)
                .to(0.15, { scales: 2.0 })
                .to(0.15, { scales: 1.0 })
                .start();
        }
    }
}


