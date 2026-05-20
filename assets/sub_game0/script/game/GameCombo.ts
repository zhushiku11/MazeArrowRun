import { _decorator, Component, director, easing, Label, lerp, Node, Sprite, SpriteFrame, tween, Tween, TweenSystem, v3 } from 'cc';
import AudioTools from 'db://assets/doge/framework/common/AudioTools';
import { AUDIOS, SUBGAME } from '../../constant/Constant';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
const { ccclass, property } = _decorator;

@ccclass('GameCombo')
export class GameCombo extends Component {

    @property(Node)
    private timeLabel: Node = null;
    @property(Sprite)
    private comboProgress: Sprite = null;
    @property(Node)
    private comboProgressFlag: Node = null;

    @property([SpriteFrame])
    private numSp: SpriteFrame[] = [];

    // 连击次数
    private times: number = 0;
    // 进度
    private progress: { value: number } = { value: 5 };
    // 移除
    private isRemoving: boolean = false;

    private progressTween: Tween<{ value: number }> = null;

    protected onEnable(): void {
        getEventEmiter().on(SUBGAME.FUNC.GAME_PAUSE, this.onPause, this);
        getEventEmiter().on(SUBGAME.FUNC.GAME_RESUME, this.onResume, this);
    }

    protected onDisable(): void {
        getEventEmiter().off(SUBGAME.FUNC.GAME_PAUSE, this.onPause, this);
        getEventEmiter().off(SUBGAME.FUNC.GAME_RESUME, this.onResume, this);
    }

    public init() {
        this.node.active = false;
        this.clearComboTimes();
        // this.comboProgressFlag.position = v3(-100, 0, 0);
        Tween.stopAllByTarget(this.progress);
    }

    public addComboTimes(times: number) {
        this.setComboTimes(this.times + times)
        Tween.stopAllByTarget(this.progress);
        this.progressTween = tween(this.progress)
            .to(5.0, { value: 0 }, {
                onUpdate: (target, ratio) => {
                    ratio = 1 - ratio;
                    this.comboProgress.fillRange = ratio;
                    this.comboProgressFlag.x = lerp(-this.comboProgress.node.widths * 0.5, this.comboProgress.node.widths * 0.5, ratio);
                },
            })
            .call(() => {
                this.clearComboTimes();
            })
            .start();
    }

    public getComboTimes() {
        return this.times;
    }

    public clearComboTimes() {
        this.setComboTimes(0);
    }

    private setComboTimes(times: number) {
        this.times = times;
        // this.timeLabel.getComponent(Label).string = `${this.times}`;

        if (times > 0) {
            let numArr = `${this.times}`.split("");
            for (let i = 0; i < this.timeLabel.children.length; i++) {
                let l = this.timeLabel.children[i];
                if (i < numArr.length) {
                    l.active = true;
                    const num = numArr[i];
                    l.getComponent(Sprite).spriteFrame = this.numSp[num];
                } else {
                    l.active = false;
                }
            }
        }

        tween(this.timeLabel.parent)
            .to(0.1, { scales: 1.5 })
            .to(0.1, { scales: 1 })
            .start();

        if (this.times >= 3) {
            Tween.stopAllByTarget(this.node);
            this.isRemoving = false;
            // this.node.position = v3(-210, -180, 0);
            this.node.active = true;
        } else if (this.times >= 0) {
            if (this.times == 0 && this.node.active && !this.isRemoving) {
                this.isRemoving = true;
                Tween.stopAllByTarget(this.progress);
                tween(this.node)
                    .delay(0.5)
                    // .by(0.8, { x: 715 }, { easing: easing.backIn })
                    .call(() => {
                        this.node.active = false;
                        this.isRemoving = false;
                    })
                    .start();
            } else {
                // this.node.active = false;
            }
        }
    }

    public playSound() {
        if (this.times < 12) {
            AudioTools.sound(AUDIOS[`touch${this.times}`]);
        } else {
            AudioTools.sound(AUDIOS[`touch${12}`]);
        }
    }

    onPause() {
        TweenSystem.instance.ActionManager.pauseTarget(this.progress as any);
    }

    onResume() {
        TweenSystem.instance.ActionManager.resumeTarget(this.progress as any);
    }

    testClick() {
        this.onPause()
    }
}


