import { _decorator, Component, game, Sprite } from 'cc';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { EDITOR } from 'cc/env';
import { Language } from 'db://assets/doge/framework/language/Language';
import { StorageBox } from 'db://assets/doge/framework/common/StorageBox';
import { AUDIOS, PRELOAD, RES_NAME, SCENES_NAME, STORAGE } from '../../constant/Constant';
import { NI } from 'db://assets/native_interface/NI';
import { UserSystem } from '../system/UserSystem';
import { Loader, SceneLoader } from 'db://assets/doge/framework/init';
import { PlayerSystem } from 'db://assets/main/script/system/PlayerSystem';
import { PropSystem } from '../system/PropSystem';
import { CheckinSystem } from '../system/CheckinSystem';
import { WithdrawSystem } from '../system/WithdrawSystem';
import { NetworkSystem } from '../system/NetworkSystem';
import { PACKAGE_NAME } from 'db://assets/main/constant/Constant';
import { GuideSystem } from '../system/GuideSystem';
import { GameMode, LevelSystem } from '../system/LevelSystem';
import { MapSystem } from '../system/MapSystem';
const { ccclass, property } = _decorator;

export const Variables = {
    currLv: "0",
    runningLv: "0",
    targetball: "1",
    count2048: "0",
    count1024: "0",
    currScore: "0",
    higherScore: "0",
    prop0Num: "0",
    prop1Num: "0",
    prop2Num: "0",
    prop3Num: "0",
    propPrice: "0",
    rankWithdraw: "0",
    rate: "0",
}

const defineVariable = () => {
    for (const key in Variables) {
        Language.defVariable(key, Variables[key]);
    }
}

if (EDITOR) {
    defineVariable();
}

@ccclass('Loading0Scene')
export class Loading0Scene extends Component {

    @property(Sprite)
    public progress: Sprite = null;

    private loadingState: number = 0;

    protected onLoad(): void {
        NI.currentPage(0);
        this.progress.fillRange = 0;
    }

    protected start(): void {
        defineVariable();
        this.init();
    }

    public async init() {
        // 初始化存储器
        StorageBox.init(`${RES_NAME}`);
        NetworkSystem.init(PACKAGE_NAME);
        let gameData: GameDataResult = NI.syncGameData();
        // 用户系统初始化
        UserSystem.I.init(gameData.m0, gameData.rate);
        // 道具初始化
        PropSystem.I.init();
        // 签到初始化
        CheckinSystem.I.init();
        // 关卡初始化
        LevelSystem.I.init(gameData.m3 - 1);
        // 数据初始化
        // GameDataSystem.I.init(parseInt(StorageBox.load(STORAGE.COUNT_2048, "0")));
        // GameDataSystem.I.init(WithdrawSystem.I.getUserInfo().MjPrts - 1);
        // 引导初始化
        GuideSystem.I.init();
        // 资源预加载
        Loader.init().bundle(RES_NAME).preLoad(PRELOAD.SPFRAME_FRAMES);
        // 加载全部地图配置
        await MapSystem.init();
        // 预加载音乐音效
        await AudioTools.loadAudioRes(Object.values(AUDIOS), RES_NAME);
        // 玩家上线
        PlayerSystem.I.goOnline();
        // 加载数据
        // WithdrawTaskSystem.I.sync();
        await Promise.all([WithdrawSystem.I.info(), WithdrawSystem.I.syncData()]);
        let info = WithdrawSystem.I.getInfo();
        if (WithdrawSystem.I.getAdCount() >= info.mj_three) {
            UserSystem.I.setRate(info.mj_three_rate / 100);
        } else if (WithdrawSystem.I.getAdCount() >= info.mj_two) {
            UserSystem.I.setRate(info.mj_two_rate / 100);
        } else if (WithdrawSystem.I.getAdCount() >= info.mj_one) {
            UserSystem.I.setRate(info.mj_one_rate / 100);
        }
        WithdrawSystem.I.levelWithdrawInfo();
        // 场景预加载
        SceneLoader.preloadScene(SCENES_NAME.Game);
    }

    public toNextScene() {
        LevelSystem.I.setRunningPass(LevelSystem.I.getCurrPass(), GameMode.PASS_0);
        // 切换游戏场景
        SceneLoader.changeScene(SCENES_NAME.Game, () => {
            AudioTools.playBgm(AUDIOS.bgm);
        });
    }

    public async update() {
        let percent = 0;
        switch (this.loadingState) {
            case 0:
                percent = Loader.percent * 0.4 * 0.7 + 0.3;
                this.loadingState = Loader.isComplete() ? 1 : 0;
                break;
            case 1:
                percent = (SceneLoader.progress(SCENES_NAME.Game) * 0.6 + 0.4) * 0.7 + 0.3;
                this.loadingState = SceneLoader.isComplete(SCENES_NAME.Game) ? 2 : 1;
                break;
            case 2:
                this.toNextScene();
                this.loadingState = 3;
                break;
            default:
                return;
        }
        if (percent > this.progress.fillRange) {
            this.progress.fillRange = percent;
            Language.updVariable("loadingPercent", (percent * 100).toFixed(0));
        }
    }
}