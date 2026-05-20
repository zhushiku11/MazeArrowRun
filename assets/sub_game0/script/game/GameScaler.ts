import { _decorator, Component, game, lerp, Node, size, Slider, v3 } from 'cc';
import { GameMap } from './GameMap';
import { PinchZoomEventData } from '../component/PinchZoom';
import { GuideSystem } from '../system/GuideSystem';
const { ccclass, property } = _decorator;

@ccclass('GameScaler')
export class GameScaler extends Component {

    @property(Slider)
    private slider: Slider = null;
    @property(Node)
    private gameLayer: Node = null;

    private gameMap: GameMap = null;

    start() {

    }

    update(deltaTime: number) {

    }

    init(gameMap: GameMap) {
        this.gameMap = gameMap;
        this.node.active = true;
        this.changeProgress(0);
    }

    onProgress(slider: Slider) {
        let progress = slider.progress;
        this.changeProgress(progress);
    }

    changeProgress(progress: number) {
        // 设置进度
        this.slider.progress = progress;
        // 设置地图缩放
        let scales = lerp(GameMap.minScale, GameMap.maxScale, progress);
        // 设置地图Wrap大小
        let width = this.gameMap.node.widths * scales + 750;
        let height = this.gameMap.node.heights * scales + 750;

        this.gameMap.node.scales = scales;
        this.gameLayer.transform.contentSize = size(width, height);
        this.gameLayer.position = v3(0, 0, 0);
    }

    onZoom(data: PinchZoomEventData) {
        console.log('Zoom Callback', data.progress);
        this.changeProgress(data.progress);
    }

    onZoomEnd() {
        if (GuideSystem.I.getStep() == 1) {
            GuideSystem.I.nextShow();
        }
    }

    onPlusClick() {

    }

    onReduceClick() {

    }
}


