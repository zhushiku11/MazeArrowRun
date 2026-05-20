import { _decorator, Component, lerp, Node, size, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { ARROW_EXTENSION, UNIT_HEIGHT, UNIT_WIDTH } from '../system/MapSystem';
import { GameArrowLayer, SPEED } from './GameArrowLayer';
import { GameMap } from './GameMap';
import { AssetsDB } from 'db://assets/doge/framework/common/AssetsDB';
import { PRELOAD, RES_NAME } from '../../constant/Constant';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
const { ccclass, property } = _decorator;

@ccclass('GameArrowBody')
export class GameArrowBody extends Component {

    @property(Node)
    private img: Node = null;

    private id: number = 0;
    private points: { x: number, y: number }[] = null;
    private length: number = 0;
    private maxLength: number = 0;
    private color: number = 0;

    protected onEnable(): void {
        getEventEmiter().on("ON_ARROW_COLOR_CHANGE", this.onColorChange, this)
    }

    protected onDisable(): void {
        getEventEmiter().off("ON_ARROW_COLOR_CHANGE", this.onColorChange, this)
    }

    init(arrowId: number, points: { x: number, y: number }[], width: number, height: number) {
        this.id = arrowId;
        this.points = points;
        let start = points[0];
        let end = points[points.length - 1];
        let xy = GameMap.toPosition(start.x, start.y, width, height);

        if (start.x == end.x) {
            // 垂直线
            if (end.y - start.y > 0) {
                // 向下
                this.setParam(xy.x, xy.y, 90, Math.abs((end.y - start.y) * UNIT_HEIGHT));
            } else {
                // 向上
                this.setParam(xy.x, xy.y, 270, Math.abs((end.y - start.y) * UNIT_HEIGHT));
            }
        } else if (start.y == end.y) {
            // 水平线
            if (end.x - start.x > 0) {
                // 向左
                this.setParam(xy.x, xy.y, 0, Math.abs((end.x - start.x) * UNIT_WIDTH));
            } else {
                // 向右
                this.setParam(xy.x, xy.y, 180, Math.abs((end.x - start.x) * UNIT_WIDTH));
            }
        } else {
            // 错误
        }
    }

    setParam(x: number, y: number, angle: number, maxLength: number) {
        this.maxLength = maxLength;
        this.node.position = v3(x, y, 0);
        this.node.angle = angle;
        this.setLength(this.maxLength);
        this.node.heights = UNIT_HEIGHT;
        this.img.heights = ARROW_EXTENSION;
    }

    setColor(color: number) {
        this.color = color;
        if (GameMap.colorSwitch) {
            this.img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`body${this.color}`], RES_NAME);
        } else {
            this.img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`body${0}`], RES_NAME);
        }
    }

    error() {
        this.img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`body${100}`], RES_NAME);
    }

    getLength() {
        return this.length;
    }

    getMaxLength() {
        return this.maxLength;
    }

    getImg() {
        return this.img;
    }

    setLength(len: number) {
        if (len > this.maxLength) {
            len = this.maxLength;
        }
        if (len < 0) {
            len = 0;
        }
        this.length = len;
        this.node.widths = this.length;
        this.img.widths = this.length + ARROW_EXTENSION;

        if (len == 0) {
            this.img.active = false;
        } else {
            this.img.active = true;
        }
    }

    onColorChange() {
        this.setColor(this.color);
    }

    onClick() {
        console.log("Click Arrow Body:", this.id);
        this.node.parent.getComponent(GameArrowLayer).onArrowClick();
    }
}


