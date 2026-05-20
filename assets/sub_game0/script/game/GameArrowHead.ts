import { _decorator, color, Component, lerp, Node, size, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { ARROW_EXTENSION, ArrowDirection, UNIT_HEIGHT, UNIT_WIDTH } from '../system/MapSystem';
import { GameArrowLayer, SPEED } from './GameArrowLayer';
import { GameMap } from './GameMap';
import { AssetsDB } from 'db://assets/doge/framework/common/AssetsDB';
import { PRELOAD, RES_NAME } from '../../constant/Constant';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
const { ccclass, property } = _decorator;

@ccclass('GameArrowHead')
export class GameArrowHead extends Component {

    @property(Node)
    private img: Node = null;

    private id: number = 0;
    private dir: ArrowDirection = 0;
    private length: number = 0;
    private color: number = 0;

    private originPosition: Vec3 = null;

    protected onEnable(): void {
        getEventEmiter().on("ON_ARROW_COLOR_CHANGE", this.onColorChange, this)
    }

    protected onDisable(): void {
        getEventEmiter().off("ON_ARROW_COLOR_CHANGE", this.onColorChange, this)
    }

    init(arrowId: number, dir: ArrowDirection, point: { x: number, y: number }, width: number, height: number) {
        this.id = arrowId;
        this.dir = dir;
        let start = point;
        let xy = GameMap.toPosition(start.x, start.y, width, height);

        switch (dir) {
            case ArrowDirection.Down:
                // 向下
                this.setParam(xy.x, xy.y, 90);
                break;
            case ArrowDirection.UP:
                // 向上
                this.setParam(xy.x, xy.y, 270);
                break;
            case ArrowDirection.LEFT:
                // 向左
                this.setParam(xy.x, xy.y, 0);
                break;
            case ArrowDirection.RIGHT:
                // 向右
                this.setParam(xy.x, xy.y, 180);
                break;
        }
    }

    setParam(x: number, y: number, angle: number) {
        this.length = UNIT_WIDTH;
        this.node.position = v3(x, y, 0);
        this.originPosition = v3(this.node.position);
        this.node.angle = angle;
        this.node.widths = this.length;
        this.node.heights = UNIT_HEIGHT;
        this.img.widths = this.length + 30;
    }

    setColor(color: number) {
        this.color = color;
        if (GameMap.colorSwitch) {
            this.img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`arrow${this.color}`], RES_NAME);
        } else {
            this.img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`arrow${0}`], RES_NAME);
        }
    }

    error() {
        this.img.getComponent(Sprite).spriteFrame = AssetsDB.get<SpriteFrame>(PRELOAD.SPFRAME_FRAMES.COMMON[`arrow${100}`], RES_NAME);
    }

    move(ratio: number, distance: number, arrowLen: number) {
        let curr = lerp(0, distance, ratio);
        let move = 0;
        let width = 0;
        if (curr <= UNIT_WIDTH) {
            // 箭头移动
            move = curr;
            width = 0;
        } else if (curr <= arrowLen) {
            // 箭头拉长
            move = UNIT_WIDTH;
            width = curr - UNIT_WIDTH;
        } else {
            move = curr - arrowLen + UNIT_WIDTH;
            width = arrowLen - UNIT_WIDTH;
        }

        switch (this.dir) {
            case ArrowDirection.UP:
                // 向上  
                this.node.position = v3(this.originPosition.x, this.originPosition.y + move, this.originPosition.z);
                break;
            case ArrowDirection.Down:
                // 向下
                this.node.position = v3(this.originPosition.x, this.originPosition.y - move, this.originPosition.z);
                break;
            case ArrowDirection.LEFT:
                // 向左  
                this.node.position = v3(this.originPosition.x - move, this.originPosition.y, this.originPosition.z);
                break;
            case ArrowDirection.RIGHT:
                // 向右  
                this.node.position = v3(this.originPosition.x + move, this.originPosition.y, this.originPosition.z);
                break;
        }
        this.node.widths = this.length + width;
        this.img.widths = this.length + 30 + width;
    }

    onColorChange() {
        this.setColor(this.color);
    }

    onClick() {
        console.log("Click Arrow Head:", this.id);
        this.node.parent.getComponent(GameArrowLayer).onArrowClick();
    }
}


