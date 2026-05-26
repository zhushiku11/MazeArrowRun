import { StorageBox } from "db://assets/doge/framework/common/StorageBox";
import { NetworkSystem } from "./NetworkSystem";
import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { SUBGAME } from "../../constant/Constant";
import { LevelSystem } from "./LevelSystem";

export interface LuckySpinResult {
    rate: number;
    color: string;
    id: number;
}

export interface LotteryItem {
    AmZid: number;
    AmZlne: string;
    AmZlg: number;
    AmZlvl: number;
}

export interface LotteryUserInfo {
    AmZbac: number;
    AmZbact: number;
    AmZcon: number;
    AmZcrc: string;
    AmZcty: string;
    AmZisn: boolean;
    AmZlg: number;
    AmZti: number;
    AmZrts: number;
    AmZnm: string;
}

export class LuckySpinSystem {
    public static readonly I: LuckySpinSystem = new LuckySpinSystem();
    
    private spinCount: number = 0;
    private rewardList: LotteryItem[] = [];
    private userInfo: LotteryUserInfo = null;
    private passedLevelCount: number = 0; // 累计通关次数
    
    private constructor() {
        this.loadData();
        this.initEventListeners();
    }
    
    private loadData(): void {
        const savedCount = StorageBox.load("LUCKY_SPIN_COUNT", "0").int();
        
        // 从 LevelSystem 获取当前实际通关次数
        const actualPassedLevel = LevelSystem.I.getCurrPass();
        
        // 使用保存的抽奖次数
        this.spinCount = savedCount;
        this.passedLevelCount = actualPassedLevel;
        
        // 如果是第一次进入游戏，根据实际通关次数计算初始抽奖次数（每2关1次）
        if (this.spinCount === 0 && this.passedLevelCount > 0) {
            this.spinCount = Math.floor(this.passedLevelCount / 2);
            this.saveData();
        }
        
    }
    
    private saveData(): void {
        StorageBox.save("LUCKY_SPIN_COUNT", this.spinCount.toString());
        StorageBox.save("LUCKY_SPIN_PASSED_COUNT", this.passedLevelCount.toString());
    }
    
    private initEventListeners(): void {
        // 监听通关事件
        getEventEmiter().on(SUBGAME.EVENT.LEVEL_PASSED, this.onLevelPassed.bind(this));
    }
    
    private onLevelPassed(): void {
        this.passedLevelCount++;
        // console.log(`Level passed! Current level: ${this.passedLevelCount}`);
        // 第2关、第4关、第6关...通过时增加抽奖机会
        if (this.passedLevelCount % 2 === 0) {
            this.spinCount++;
            // console.log(`Spin count increased! Now: ${this.spinCount}`);
        }
        
        this.saveData();
    }
    
    public getSpinCount(): number {
        return this.spinCount;
    }
    
    public addSpinCount(count: number = 1): void {
        this.spinCount += count;
        this.saveData();
    }
    
    public useSpinCount(): boolean {
        if (this.spinCount <= 0) return false;
        this.spinCount -= 1;
        this.saveData();
        return true;
    }
    
    public getRewardList(): LotteryItem[] {
        return this.rewardList;
    }
    
    public getUserInfo(): LotteryUserInfo {
        return this.userInfo;
    }
    
    private getColorByRate(rate: number): string {
        if (rate >= 100) return '#2ecc71';
        if (rate >= 20) return '#e67e22';
        if (rate >= 10) return '#8e44ad';
        return '#9b59b6';
    }
    
    private getLocalSpinResult(): LuckySpinResult {
        const weights = [10, 10, 15, 20, 5, 20, 20, 15];
        const rates = [50, 10, 20, 5, 100, 5, 20, 10];
        
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;
        
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                selectedIndex = i;
                break;
            }
        }
        
        return {
            rate: rates[selectedIndex],
            color: this.getColorByRate(rates[selectedIndex]),
            id: selectedIndex + 1
        };
    }
    
    public spin(callback: (result: LuckySpinResult) => void): void {
        if (!this.useSpinCount()) {
            callback(null);
            return;
        }
        
        NetworkSystem.lotteryInfo()
            .then((result) => {
                if (result && !result.error && result.data) {
                    const data = result.data;
                    const spinResult: LuckySpinResult = {
                        rate: data.AmZrts || data.rate || 0,
                        color: this.getColorByRate(data.AmZrts || data.rate || 0),
                        id: data.AmZid || data.id || 0
                    };
                    callback(spinResult);
                } else {
                    callback(this.getLocalSpinResult());
                }
            })
            .catch(() => {
                callback(this.getLocalSpinResult());
            });
    }
    
    public fetchLotteryList(): Promise<void> {
        return new Promise((resolve, reject) => {
            NetworkSystem.lotteryList()
                .then((result) => {
                    if (result && !result.error && result.data) {
                        const data = result.data;
                        this.rewardList = data.AmZlis || [];
                        this.userInfo = data.AmZuso || null;
                        resolve();
                    } else {
                        reject(new Error('Failed to fetch lottery list'));
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    
    public sendLotteryResult(lotteryId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            NetworkSystem.lotteryResult(lotteryId)
                .then((result) => {
                    if (result && !result.error) {
                        if (result.data) {
                            // console.log('Lottery result sent successfully, server response:', result.data);
                        } else {
                            // console.log('Lottery result sent successfully, lotteryId:', lotteryId);
                        }
                        resolve();
                    } else {
                        // console.error('Failed to send lottery result, server returned error, lotteryId:', lotteryId);
                        reject(new Error('Failed to send lottery result'));
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}