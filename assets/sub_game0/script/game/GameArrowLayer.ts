import { _decorator, Component, instantiate, lerp, Node, Prefab, tween, v2, v3, view } from 'cc';
import { GameArrowBody as GameArrowBody } from './GameArrowBody';
import { ARROW_EXTENSION, ArrowDirection, UNIT_HEIGHT, UNIT_WIDTH } from '../system/MapSystem';
import { GameArrowHead } from './GameArrowHead';
import { GameMap } from './GameMap';
import { GameCombo } from './GameCombo';
import { GameGridLayer } from './GameGridLayer';
import { GameHealth } from './GameHealth';
import { PanelCreator } from '../component/creator/PanelCreator';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS } from '../../constant/Constant';
import { GuideSystem } from '../system/GuideSystem';
const { ccclass, property } = _decorator;

export const SPEED = 2000;
// export const SPEED = 200;

@ccclass('GameArrowLayer')
export class GameArrowLayer extends Component {

    @property(Prefab)
    private arrowHeadPrefab: Prefab = null;
    @property(Prefab)
    private arrowBodyPrefab: Prefab = null;

    private gameMap: GameMap = null;
    private id: number = 0;
    // 地图数据
    private arrowData: { dir: number, color: number, points: { x: number, y: number }[] } = null;
    // 地图 w & h
    private w: number = 0;
    private h: number = 0;
    // 箭头头部
    private arrowHead: GameArrowHead = null;
    // 箭头箭身
    private arrowBodys: GameArrowBody[] = null;
    // 箭头长度
    private length: number = 0;
    // 箭头颜色
    private color: number = 0;
    // 箭头方向
    private dir: number = 0;
    // 是否已消除
    private eliminated: boolean = false;

    private touchLock: boolean = false;

    init(map: GameMap, arrowId: number, arrowData: { dir: number, color: number, points: { x: number, y: number }[] }, w: number, h: number) {
        this.gameMap = map;
        this.id = arrowId;
        this.arrowData = arrowData;
        this.w = w;
        this.h = h;
        this.arrowBodys = [];
        this.length = 0;
        this.color = arrowData.color;
        this.dir = arrowData.dir;

        let points = arrowData.points;

        let startIndex = 0;
        let endIndex = 0;
        let length = 0;
        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];
            if (prev.x != next.x && prev.y != next.y) {
                // 当前点为拐点
                endIndex = i;
                // 创建一个箭身
                let len = this.createArrowBody(this.color, points.slice(startIndex, endIndex + 1));
                length += len;
                startIndex = endIndex;
            }
        }
        endIndex = points.length - 1;
        // 创建一个箭身
        let len = this.createArrowBody(this.color, points.slice(startIndex, endIndex + 1));
        this.length = length + len;
        // 创建一个箭头
        this.createArrowHead(this.dir, this.color, points[1]);
        // ready动画
        this.ready()
    }

    ready() {
        // 调整arrowHead
        this.arrowHead.node.active = false;
        // 调整arrowBody
        for (const body of this.arrowBodys) {
            let imgNode = body.getImg();
            imgNode.transform.anchorPoint = v2(1, 0.5);
            imgNode.x += imgNode.transform.width;
            imgNode.transform.width = ARROW_EXTENSION;
            // tween(imgNode)
            //     .to(0.3, { widths: body.getLength() + ARROW_EXTENSION })
            //     .start();
        }

        let moveDis = this.length;
        let moveTime = this.length / SPEED;
        let moveObj = { length: 0 };
        tween(moveObj)
            .to(moveTime * 0.5, { length: moveDis }, {
                onUpdate: (target: any, ratio: number) => {
                    let curr = lerp(0, moveDis, ratio);
                    for (let i = this.arrowBodys.length - 1; i >= 0; i--) {
                        const arrowBody = this.arrowBodys[i];
                        if (curr <= 0) {
                            arrowBody.getImg().widths = 0;
                        } else {
                            curr -= arrowBody.getMaxLength();
                            if (curr >= 0) {
                                arrowBody.getImg().widths = arrowBody.getMaxLength() + ARROW_EXTENSION;
                            } else {
                                arrowBody.getImg().widths = curr + arrowBody.getMaxLength() + ARROW_EXTENSION;
                            }
                        }
                    }
                },
            })
            .call(() => {
                GameMap.readyNum -= 1;
                this.arrowHead.node.active = true;
                for (const body of this.arrowBodys) {
                    let imgNode = body.getImg();
                    imgNode.transform.anchorPoint = v2(0, 0.5);
                    imgNode.x -= imgNode.transform.width;
                }
            })
            .start();
    }

    createArrowHead(dir: ArrowDirection, color: number, point: { x: number, y: number }) {
        let arrowHeadNode = instantiate(this.arrowHeadPrefab);
        arrowHeadNode.parent = this.node;
        let arrowHead = arrowHeadNode.getComponent(GameArrowHead);
        arrowHead.init(this.id, dir, point, this.node.widths, this.node.heights);
        arrowHead.setColor(this.color);
        this.arrowHead = arrowHead;
    }

    createArrowBody(color: number, points: { x: number, y: number }[]): number {
        let arrowBodyNode = instantiate(this.arrowBodyPrefab);
        arrowBodyNode.parent = this.node;
        let arrowBody = arrowBodyNode.getComponent(GameArrowBody);
        arrowBody.init(this.id, points, this.node.widths, this.node.heights);
        arrowBody.setColor(this.color);
        this.arrowBodys.push(arrowBody);
        return arrowBody.getLength();
    }

    getId() {
        return this.id;
    }

    getFirstPoint() {
        return this.arrowData.points[0];
    }

    isEliminated() {
        return this.eliminated;
    }

    onArrowClick() {
        if (this.touchLock) {
            return;
        }
        if (!GameMap.isReadyed()) {
            return;
        }
        this.touchLock = true;
        console.log("Move Arrow Layer:", this.id);
        let result = this.arrowPlay();
        if (result) {
            // this.gameMap.getGameComo().getComponent(GameCombo).playSound();
        } else {
            AudioTools.sound(AUDIOS.error);
        }
        this.gameMap.restartHint();
    }

    arrowPlay(errorPlay: boolean = true): boolean {
        let collisionInfo = this.getCollisionArrow();
        if (collisionInfo) {
            // this.arrowData.points[0].
            let dis = 0;
            switch (this.dir) {
                case ArrowDirection.UP:
                    // 向上
                    dis = (collisionInfo.point.y - this.arrowData.points[0].y) * UNIT_WIDTH;
                    break;
                case ArrowDirection.Down:
                    // 向下
                    dis = (this.arrowData.points[0].y - collisionInfo.point.y) * UNIT_WIDTH;
                    break;
                case ArrowDirection.LEFT:
                    // 向左  
                    dis = (this.arrowData.points[0].x - collisionInfo.point.x) * UNIT_WIDTH;
                    break;
                case ArrowDirection.RIGHT:
                    // 向右  
                    dis = (collisionInfo.point.x - this.arrowData.points[0].x) * UNIT_WIDTH;
                    break;
            }
            if (errorPlay) {
                // 移动到碰撞点
                this.move(dis - 20, () => {
                    this.error();
                    // 扣除血量
                    this.gameMap.getGameHealth().getComponent(GameHealth).reduce();
                    // 从碰撞点返回
                    this.reverseMove(dis - 20, () => {
                        this.touchLock = false;
                    });
                });
            } else {
                this.touchLock = false;
            }
            return false;
        } else {
            this.eliminated = true;
            let dis = this.length;
            let xy = GameMap.toPosition(this.arrowData.points[0].x, this.arrowData.points[0].y, this.node.widths, this.node.heights);
            let otherPoints: { x: number, y: number }[] = [];
            switch (this.dir) {
                case ArrowDirection.UP:
                    // 向上
                    dis += (view.getVisibleSize().height / this.gameMap.node.scales * 0.5 - xy.y);
                    for (let i = this.arrowData.points[0].y + 1; i < this.h; i++) {
                        otherPoints.push({ x: this.arrowData.points[0].x, y: i });
                    }
                    break;
                case ArrowDirection.Down:
                    // 向下
                    dis += (view.getVisibleSize().height / this.gameMap.node.scales * 0.5 + xy.y);
                    for (let i = this.arrowData.points[0].y - 1; i >= 0; i--) {
                        otherPoints.push({ x: this.arrowData.points[0].x, y: i });
                    }
                    break;
                case ArrowDirection.LEFT:
                    // 向左  
                    dis += (view.getVisibleSize().width / this.gameMap.node.scales * 0.5 + xy.x);
                    for (let i = this.arrowData.points[0].x - 1; i >= 0; i--) {
                        otherPoints.push({ x: i, y: this.arrowData.points[0].y });
                    }
                    break;
                case ArrowDirection.RIGHT:
                    // 向右  
                    dis += (view.getVisibleSize().width / this.gameMap.node.scales * 0.5 - xy.x);
                    for (let i = this.arrowData.points[0].x + 1; i < this.w; i++) {
                        otherPoints.push({ x: i, y: this.arrowData.points[0].y });
                    }
                    break;
            }
            // 移动到碰撞点
            this.move(dis, () => {
                // 直接消除
                if (this.isEliminated()) {
                    this.touchLock = false;
                    this.node.destroy();
                    GameMap.currTotalCount -= 1;
                    if (GameMap.currTotalCount <= 0) {
                        console.log("Win");
                        if (GuideSystem.I.getStep() == 2) {
                            GuideSystem.I.nextShow();
                        } else {
                            PanelCreator.passReward();
                        }
                    } else {
                        let eliminateCount = GameMap.totalCount - GameMap.currTotalCount;
                        if (eliminateCount % 20 == 0) {
                            // 奖励弹窗
                            PanelCreator.normalReward();
                        }
                    }

                }
            });

            // GridLayer 动画
            let points = this.arrowData.points.reverse().concat(otherPoints);
            this.gameMap.getGameGridLayer().getComponent(GameGridLayer).bounce(points);
            this.gameMap.getGameComo().getComponent(GameCombo).addComboTimes(1);

            return true;
        }
    }

    error() {
        this.arrowHead.error();
        for (let i = 0; i < this.arrowBodys.length; i++) {
            const arrowBody = this.arrowBodys[i];
            arrowBody.error();
        }
        this.gameMap.getGameComo().getComponent(GameCombo).clearComboTimes();
    }

    move(moveDis: number, callback?: Function) {
        let moveTime = moveDis / SPEED;
        let moveObj = { length: moveDis };
        tween(moveObj)
            .to(moveTime, { length: 0 }, {
                onUpdate: (target: any, ratio: number) => {
                    this.setArrowRatio(ratio, moveDis);
                    if (ratio >= 1) {
                        callback && callback();
                    }
                },
            })
            .start();
    }

    reverseMove(moveDis: number, callback?: Function) {
        let moveTime = moveDis / SPEED;
        let moveObj = { length: moveDis };
        tween(moveObj)
            .to(moveTime, { length: 0 }, {
                onUpdate: (target: any, ratio: number) => {
                    ratio = 1 - ratio;
                    this.setArrowRatio(ratio, moveDis);
                    if (ratio <= 0) {
                        callback && callback();
                    }
                },
            })
            .start();
    }

    setArrowRatio(ratio: number, moveDis: number) {
        // 箭头移动
        this.arrowHead.move(ratio, moveDis, this.length);
        // 箭身移动
        let curr = lerp(0, moveDis, ratio);
        for (let i = this.arrowBodys.length - 1; i >= 0; i--) {
            const arrowBody = this.arrowBodys[i];
            curr -= arrowBody.getMaxLength();
            arrowBody.setLength(0 - curr);
        }
    }

    // 碰撞
    getCollisionArrow(): { arrow: GameArrowLayer, point: { x: number, y: number } } {
        // 获取所有可碰撞的Arrow
        let arrowLayers = GameMap.getCollisionArrows(this);
        if (arrowLayers.length <= 0) {
            // 未找到
            return null;
        }
        let dir = this.dir;
        let firstPoint = this.arrowData.points[0];
        let collisionPoint: { x: number, y: number } = null;
        let collisionArrow: GameArrowLayer = null;

        if (dir == ArrowDirection.UP) {
            // 向上 筛选一个最近的Arrow
            for (let i = 0; i < arrowLayers.length; i++) {
                const arrowLayer = arrowLayers[i];
                if (!collisionPoint) {
                    collisionArrow = arrowLayer;
                    collisionPoint = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                } else {
                    let point = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                    if (point.y < collisionPoint.y) {
                        collisionArrow = arrowLayer;
                        collisionPoint = point;
                    }
                }
            }
        } else if (dir == ArrowDirection.Down) {
            // 向下 筛选一个最近的Arrow
            for (let i = 0; i < arrowLayers.length; i++) {
                const arrowLayer = arrowLayers[i];
                if (!collisionPoint) {
                    collisionArrow = arrowLayer;
                    collisionPoint = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                } else {
                    let point = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                    if (point.y > collisionPoint.y) {
                        collisionArrow = arrowLayer;
                        collisionPoint = point;
                    }
                }
            }
        } else if (dir == ArrowDirection.LEFT) {
            // 向左 筛选一个最近的Arrow
            for (let i = 0; i < arrowLayers.length; i++) {
                const arrowLayer = arrowLayers[i];
                if (!collisionPoint) {
                    collisionArrow = arrowLayer;
                    collisionPoint = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                } else {
                    let point = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                    if (point.x > collisionPoint.x) {
                        collisionArrow = arrowLayer;
                        collisionPoint = point;
                    }
                }
            }
        } else if (dir == ArrowDirection.RIGHT) {
            // 向右 筛选一个最近的Arrow
            for (let i = 0; i < arrowLayers.length; i++) {
                const arrowLayer = arrowLayers[i];
                if (!collisionPoint) {
                    collisionArrow = arrowLayer;
                    collisionPoint = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                } else {
                    let point = arrowLayer.getPointsByDirection(dir, firstPoint, true)[0];
                    if (point.x < collisionPoint.x) {
                        collisionArrow = arrowLayer;
                        collisionPoint = point;
                    }
                }
            }
        }

        return { arrow: collisionArrow, point: collisionPoint }
    }

    isCollision(arrowLayer: GameArrowLayer): boolean {
        let dir = this.dir;
        let firstPoint = this.arrowData.points[0];
        let points = arrowLayer.getPointsByDirection(dir, firstPoint);
        if (points.length > 0) {
            return true;
        }
    }

    getPointsByDirection(dir: ArrowDirection, point: { x: number, y: number }, isSort: boolean = false): { x: number, y: number }[] {
        if (dir == ArrowDirection.UP) {
            // 向上
            let points = this.arrowData.points;
            points = points.filter((value: { x: number, y: number }) => {
                return point.x == value.x && value.y > point.y;
            })
            if (isSort) {
                points.sort((a: { x: number, y: number }, b: { x: number, y: number }) => {
                    return a.y - b.y;
                })
            }
            return points;
        } else if (dir == ArrowDirection.Down) {
            // 向下
            let points = this.arrowData.points;
            points = points.filter((value: { x: number, y: number }) => {
                return point.x == value.x && value.y < point.y;
            })
            if (isSort) {
                points.sort((a: { x: number, y: number }, b: { x: number, y: number }) => {
                    return b.y - a.y;
                })
            }
            return points;
        } else if (dir == ArrowDirection.LEFT) {
            // 向左  
            let points = this.arrowData.points;
            points = points.filter((value: { x: number, y: number }) => {
                return point.y == value.y && value.x < point.x;
            })
            if (isSort) {
                points.sort((a: { x: number, y: number }, b: { x: number, y: number }) => {
                    return b.x - a.x;
                })
            }
            return points;
        } else if (dir == ArrowDirection.RIGHT) {
            // 向右  
            let points = this.arrowData.points;
            points = points.filter((value: { x: number, y: number }) => {
                return point.y == value.y && value.x > point.x;
            })
            if (isSort) {
                points.sort((a: { x: number, y: number }, b: { x: number, y: number }) => {
                    return a.x - b.x;
                })
            }
            return points;
        }
    }
}


