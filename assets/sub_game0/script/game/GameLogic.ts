import { Component, Node, _decorator } from "cc";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { LevelSystem } from "../system/LevelSystem";
import { GameTimer } from "./GameTimer";
import { SUBGAME } from "../../constant/Constant";
import { GameMap } from "./GameMap";
import { GameHealth } from "./GameHealth";
import { MapSystem } from "../system/MapSystem";
const { ccclass, property } = _decorator;

// type HintInfo = { tile: GameTile, matchTile: GameTile, moveXY: Vec2 }

@ccclass('GameLogic')
export class GameLogic extends Component {

    @property(Node)
    private timer: Node = null;

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.FUNC.GAME_ADD_TIME, this.onAddTime, this);
        getEventEmiter().on(SUBGAME.FUNC.GAME_ADD_HP, this.onAddHealth, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.FUNC.GAME_ADD_TIME, this.onAddTime, this);
        getEventEmiter().off(SUBGAME.FUNC.GAME_ADD_HP, this.onAddHealth, this);
    }

    initGame() {
        let gameMap = this.getComponent(GameMap);
        gameMap.create();
        MapSystem.loadMapData(LevelSystem.I.getRunningPass() + 1);
        return gameMap;
    }

    startGame(gameMap: GameMap) {
        // 开始倒计时
        this.startCountDown(gameMap.getGameTime());
    }

    private startCountDown(time: number) {
        console.log("Time is start :", time);
        let timer = this.timer.getComponent(GameTimer);
        timer.stopTime();
        timer.startTime(time);
    }

    onAddTime() {
        this.addGameTime(LevelSystem.I.getReviveTime());
    }

    onAddHealth() {
        // 扣除血量
        this.getComponent(GameMap).getGameHealth().getComponent(GameHealth).add();
    }

    private addGameTime(time: number) {
        let timer = this.timer.getComponent(GameTimer);
        timer.addTime(time);
    }

    getGamePercent() {
        // let gameMap = this.getComponent(GameMap);
        // return gameMap.getCurrSize() / gameMap.getMaxSize();
    }

    onProp0Use() {
        // 随机删除5个
        return this.getComponent(GameMap).random5Eliminate();
    }
}




