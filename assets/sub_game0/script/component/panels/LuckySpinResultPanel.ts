import { _decorator, Component, Label, Sprite, SpriteFrame, tween ,Node} from 'cc';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { LuckySpinResult, LuckySpinSystem } from '../../system/LuckySpinSystem';
import { UserSystem } from '../../system/UserSystem';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
const { ccclass, property } = _decorator;

@ccclass('LuckySpinResultPanel')
export class LuckySpinResultPanel extends Component implements IPanel {
    
    @property(Label)
    private resultRateLabel: Label = null;
    @property(Label)
    private resuateLabel: Label = null;
    
    @property(Sprite) private centerBg: Sprite = null;
    @property(Sprite) private bottomBg: Sprite = null;
    @property(Node) private UseBtn: Node = null;
    
    @property(SpriteFrame) bg5: SpriteFrame = null;
    @property(SpriteFrame) bg10: SpriteFrame = null;
    @property(SpriteFrame) bg20: SpriteFrame = null;
    @property(SpriteFrame) bg50: SpriteFrame = null;
    @property(SpriteFrame) bg100: SpriteFrame = null;
    
    @property(SpriteFrame) icon5: SpriteFrame = null;
    @property(SpriteFrame) icon10: SpriteFrame = null;
    @property(SpriteFrame) icon20: SpriteFrame = null;
    @property(SpriteFrame) icon50: SpriteFrame = null;
    @property(SpriteFrame) icon100: SpriteFrame = null;
   
    
    private bgMap = new Map<number, SpriteFrame>();
    private iconMap = new Map<number, SpriteFrame>();
    private lock: boolean = false;
    private currentResult: LuckySpinResult = null;
    
    onInit(result?: LuckySpinResult) {
        this.initMaps();
        result && this.showResult(result);

        tween(this.UseBtn)
        .to(1, { scales: 1.05 })
        .to(1, { scales: 1.0 })
        .union()
        .repeatForever()
        .start();
    }
    
    private initMaps(): void {
        const rates = [5, 10, 20, 50, 100];
        rates.forEach(rate => {
            this.bgMap.set(rate, this[`bg${rate}`]);
            this.iconMap.set(rate, this[`icon${rate}`]);
        });
    }
    
    public showResult(result: LuckySpinResult): void {
        this.currentResult = result;
        if (!this.resultRateLabel) return;
        
        const rate = result.rate;
        this.resultRateLabel.string = `+${rate}%`;
        this.resuateLabel.string = `+${rate}%`;
        
        const bg = this.bgMap.get(rate);
        const icon = this.iconMap.get(rate);
        
        this.setSprite(this.centerBg, bg);
        this.setSprite(this.bottomBg, bg);
    }
    
    private setSprite(sprite: Sprite, frame: SpriteFrame): void {
        if (sprite && frame) sprite.spriteFrame = frame;
    }
    
    onCloseBtnClick(): void {
        PanelFactory.close(LuckySpinResultPanel);
    }

    async onUseBtnClick() {
        if (this.lock) return;
        this.lock = true;
        
        // 发送中奖id到服务器
        if (this.currentResult && this.currentResult.id) {
            LuckySpinSystem.I.sendLotteryResult(this.currentResult.id)
                .then(() => {
                    console.log('Use success, lottery id sent:', this.currentResult.id);
                })
                .catch((err) => {
                    console.error('Failed to send lottery result:', err);
                });
        }
        
        // 广告购买
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.REWARD, 0, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                this.lock = false;
                return;
            }
            if (rewardA > 0 || rewardB > 0) {
                UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
            }
            this.node && PanelFactory.close(LuckySpinResultPanel);
            this.lock = false;
        })
    }
    onShow() {}
    onHide() {}
    onDispose() {}
}