import { _decorator, Component, easing, instantiate, Node, Prefab, size, Tween, tween, v2, v3, Vec2 } from 'cc';
import { IMapData, MapSystem, UNIT_HEIGHT, UNIT_WIDTH } from '../system/MapSystem';
import { LevelSystem } from '../system/LevelSystem';
import { GameArrowLayer } from './GameArrowLayer';
import { GameCombo } from './GameCombo';
import { GameScaler } from './GameScaler';
import { GameGridLayer } from './GameGridLayer';
import { GameHealth } from './GameHealth';
import { StorageBox } from 'db://assets/doge/framework/common/StorageBox';
import { GameHintLayer } from './GameHintLayer';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { SUBGAME } from '../../constant/Constant';
import { Wait } from 'db://assets/doge/framework/common/Utils';
const { ccclass, property } = _decorator;

@ccclass('GameMap')
export class GameMap extends Component {

    @property(Prefab)
    private arrowLayerPrefab: Prefab = null;
    @property(Node)
    private gameCombo: Node = null;
    @property(Node)
    private gameScaler: Node = null;
    @property(Node)
    private gameGridLayer: Node = null;
    @property(Node)
    private gameHintLayer: Node = null;
    @property(Node)
    private gameHealth: Node = null;

    // 地图数据
    private mapData: IMapData = null;
    // 箭头层
    private static arrowLayers: GameArrowLayer[] = null;
    // 最小缩放值
    public static minScale: number = 0;
    // 最大缩放值
    public static maxScale: number = 0;
    // 彩色开关
    public static colorSwitch: boolean = false;
    // 箭头总数
    public static totalCount: number = 0;
    public static currTotalCount: number = 0;

    // 是否Ready状态数量
    public static readyNum: number = 0;

    private hintCallback: Function = null;

    public static toPosition(mapX: number, mapY: number, width: number, height: number) {
        let x = mapX * UNIT_WIDTH - width * 0.5 + UNIT_WIDTH * 0.5;
        let y = mapY * UNIT_HEIGHT - height * 0.5 + UNIT_HEIGHT * 0.5;
        return { x: x, y: y };
    }

    public static getCollisionArrows(currArrowLayer: GameArrowLayer, others: GameArrowLayer[] = null): GameArrowLayer[] {
        let collisionArrows = [];

        others = others || GameMap.arrowLayers;
        if (others.length <= 0) {
            return collisionArrows;
        }

        for (let i = 0; i < others.length; i++) {
            const arrowLayer = others[i];
            if (currArrowLayer.getId() != arrowLayer.getId() && !arrowLayer.isEliminated()) {
                // 判断
                if (currArrowLayer.isCollision(arrowLayer)) {
                    collisionArrows.push(arrowLayer);
                }
            }
        }
        return collisionArrows;
    }

    public static isReadyed() {
        if (GameMap.readyNum == 0) {
            return true;
        } else {
            return false;
        }
    }

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.FUNC.GAME_PAUSE, this.onPause, this);
        getEventEmiter().on(SUBGAME.FUNC.GAME_RESUME, this.onResume, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.FUNC.GAME_PAUSE, this.onPause, this);
        getEventEmiter().off(SUBGAME.FUNC.GAME_RESUME, this.onResume, this);
    }


    create() {
        this.clear();
        // 老用户 正常关卡
        let level = LevelSystem.I.getRunningPass();
        let mapData = MapSystem.getMapData(level);
        this.createGameByMapData(mapData);
        this.createGrid(mapData);
        // 启动定时提示
        this.restartHint();
    }

    clear() {
        console.log("Clear Map");
        this.mapData = null;
        GameMap.arrowLayers = null;
        let children = this.node.children;
        for (const item of children) {
            if (item != this.gameGridLayer && item != this.gameHintLayer) {
                item.destroy();
            }
        }
        this.gameGridLayer.getComponent(GameGridLayer).clear();
        this.gameCombo.getComponent(GameCombo).init();
        this.gameHealth.getComponent(GameHealth).init();
    }

    getGameComo() {
        return this.gameCombo;
    }

    getGameGridLayer() {
        return this.gameGridLayer;
    }

    getGameHealth() {
        return this.gameHealth;
    }

    public async createGameByMapData(mapData: IMapData) {
        this.mapData = mapData;
        // 创建地图
        await this.createMap(this.mapData);
        this.gameHintLayer.setSiblingIndex(this.node.children.length - 1);
        console.log(this.node.children);
    }

    public createGrid(mapData: IMapData) {
        this.gameGridLayer.getComponent(GameGridLayer).init(mapData.width, mapData.height);
    }

    public async createMap(mapData: IMapData) {
        GameMap.arrowLayers = [];

        let width = mapData.width * UNIT_WIDTH;
        let height = mapData.height * UNIT_HEIGHT;

        this.node.widths = width;
        this.node.heights = height;
        console.log("GameMap", "width", width, "height", height);

        // GameMap.minScale = 700 / width;
        GameMap.minScale = Math.min(700 / width, 1039 / height);
        if (GameMap.minScale > 1) {
            GameMap.minScale = 1;
        }
        GameMap.maxScale = GameMap.minScale * 2;
        this.gameScaler.getComponent(GameScaler).init(this);

        GameMap.colorSwitch = !!StorageBox.load("ARROW_COLOR_SWITCH", "0").int();

        let setLength = 5;
        let len = mapData.arrows.length;
        let len0 = Math.floor(mapData.arrows.length / setLength);
        let len1 = mapData.arrows.length % setLength;
        GameMap.readyNum = len;

        for (let i = 0; i < len0; i++) {
            for (let j = 0; j < setLength; j++) {
                let idx = i * setLength + j;
                const arrowData = mapData.arrows[idx];
                let node = this.createArrowLayer(idx + 1, arrowData, width, height);
                node.parent = this.node;
                node.position = v3(0, 0, 0);
            }
            await new Wait().second(0.01);
        }

        for (let j = 0; j < len1; j++) {
            let idx = len0 * setLength + j;
            const arrowData = mapData.arrows[idx];
            let node = this.createArrowLayer(idx + 1, arrowData, width, height);
            node.parent = this.node;
            node.position = v3(0, 0, 0);
        }

        GameMap.currTotalCount = len;
        GameMap.totalCount = GameMap.currTotalCount;
        console.log(GameMap.totalCount);
    }

    public createArrowLayer(arrowId: number, arrowData: { dir: number, color: number, points: { x: number, y: number }[] }, width: number, height: number) {
        let arrowLayerNode = instantiate(this.arrowLayerPrefab);
        arrowLayerNode.widths = width;
        arrowLayerNode.heights = height;
        let arrowLayer = arrowLayerNode.getComponent(GameArrowLayer);
        arrowLayer.init(this, arrowId, arrowData, this.mapData.width, this.mapData.height);
        GameMap.arrowLayers.push(arrowLayer);
        return arrowLayerNode;
    }

    getGameTime() {
        return this.mapData.time;
    }

    getArrowLayerById(id: number) {
        return GameMap.arrowLayers[id - 1];
    }

    random5Eliminate() {
        // 随机删除5个
        let total: 0;
        for (let i = 0; i < 5; i++) {
            if (this.randomEliminate()) {
                total += 1;
            }
        }
        if (total <= 0) {
            return false;
        }
        this.restartHint();
        return true;
    }

    randomEliminate() {
        for (let i = 0; i < GameMap.arrowLayers.length; i++) {
            const arrowLayer = GameMap.arrowLayers[i];
            if (!arrowLayer.isEliminated() && GameMap.isReadyed()) {
                let result = arrowLayer.arrowPlay(false);
                if (result) {
                    return true;
                }
            }
        }
        return false;
    }

    public restartHint() {
        if (PlayerSystem.I.isNewUser()) {
            return;
        }

        this.stopHint();
        this.hintCallback = () => {
            for (let i = 0; i < GameMap.arrowLayers.length; i++) {
                const arrowLayer = GameMap.arrowLayers[i];
                if (!arrowLayer.isEliminated()) {
                    let isCollision = arrowLayer.getCollisionArrow();
                    if (!isCollision) {
                        console.log("fint can Hint");
                        this.gameHintLayer.getComponent(GameHintLayer).show(arrowLayer);
                        return;
                    }
                }
            }
        };
        this.scheduleOnce(this.hintCallback, 6.0);
        this.gameHintLayer.getComponent(GameHintLayer).hide();
    }

    public stopHint() {
        this.unschedule(this.hintCallback);
    }

    onPause() {
        this.stopHint();
    }

    onResume() {
        this.restartHint();
    }
}


