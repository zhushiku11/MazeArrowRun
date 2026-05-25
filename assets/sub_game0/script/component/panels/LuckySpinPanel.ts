import { _decorator, Component, Node, Label, Sprite, tween, v3, Color, Tween, Button } from 'cc';
import { IPanel } from 'db://assets/doge/framework/panel/Panel';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { LuckySpinSystem, LuckySpinResult } from '../../system/LuckySpinSystem';
import { LuckySpinResultPanel } from './LuckySpinResultPanel';
import { Toast } from 'db://assets/doge/framework/init';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { SUBGAME } from 'db://assets/sub_game0/constant/Constant';
const { ccclass, property } = _decorator;

@ccclass('LuckySpinPanel')
export class LuckySpinPanel extends Component implements IPanel {

    
    @property(Node)
    private spinBtn: Node = null;
    
    @property(Label)
    private spinCountLabel: Label = null;
    
    @property(Node)
    private gridNode: Node = null;
    
    @property(Label)
    private resultRateLabel: Label = null;
    
    @property(Node)
    private useBtn: Node = null;
    
    @property(Node)
    private giveUpBtn: Node = null;
    
    @property(Node)
    private resultNode: Node = null;
    
    @property(Sprite)
    private resultBg: Sprite = null;
    
    private cellOrder: number[] = [0, 1, 2, 3, 4, 5, 6, 7]; // 顺时针顺序
    private cells: Node[] = [];
    private currentResult: LuckySpinResult = null;
    private isSpinning: boolean = false;
    private spinAnimationId: number = null;
    
    private rewardConfig = [
        { rate: 50, color: '#9b59b6' },   // cell_0: 50%
        { rate: 10, color: '#8e44ad' },   // cell_1: 10%
        { rate: 20, color: '#e67e22' },   // cell_2: 20%
        { rate: 5, color: '#9b59b6' },    // cell_3: 5%
        { rate: 100, color: '#2ecc71' },  // cell_4: 100%
        { rate: 5, color: '#9b59b6' },    // cell_5: 5%
        { rate: 20, color: '#e67e22' },   // cell_6: 20%
        { rate: 10, color: '#8e44ad' },   // cell_7: 10%
    ];
    
    onLoad() {
        console.log('=== LuckySpinPanel onLoad ===');
        this.initCells();
        this.updateSpinCount();
        this.showSpinPanel();
    }
    
    onInit() {
        console.log('=== LuckySpinPanel onInit ===');
        this.initCells();
        this.updateSpinCount();
        this.showSpinPanel();
    }
    
    
    private initCells(): void {
        this.cells = [];
        console.log('initCells called, gridNode:', this.gridNode);
        
        if (!this.gridNode) {
            console.error('gridNode is null! Please bind gridNode in Inspector.');
            return;
        }
        
        // 列出所有子节点，方便调试
        const children = this.gridNode.children;
        console.log('gridNode children:', children.map(c => c.name));
        
        const cellNames = ['cell_0', 'cell_1', 'cell_2', 'cell_3', 'cell_4', 'cell_5', 'cell_6', 'cell_7'];
        
        cellNames.forEach((name, index) => {
            const cell = this.gridNode.getChildByName(name);
            if (cell) {
                this.cells.push(cell);
                const config = this.rewardConfig[index];
                const sprite = cell.getComponent(Sprite);
                const label = cell.getComponentInChildren(Label);
                
                if (sprite) sprite.color = new Color(config.color);
                if (label) label.string = `+${config.rate}%`;
            } else {
                console.error(`Cell ${name} not found!`);
            }
        });
        
        console.log(`Initialized ${this.cells.length}/8 cells`);
    }
    
    private updateSpinCount(): void {
        const count = LuckySpinSystem.I.getSpinCount();
        this.spinCountLabel.string = count.toString();
    }
    
    private showSpinPanel(): void {
        this.gridNode.active = true;
        // this.resultNode.active = false;
        this.spinBtn.active = true;
        this.useBtn.active = false;
        this.giveUpBtn.active = false;
        
        this.cells.forEach((cell, index) => {
            tween(cell).to(0.2, { scale: v3(1, 1, 1) }).start();
            const sprite = cell.getComponent(Sprite);
            if (sprite) sprite.color = new Color(this.rewardConfig[index].color);
        });
    }
    
    private showResult(result: LuckySpinResult): void {
        if (!result) return;
        console.log('=== LuckySpinPanel showResult ===', result);
        // 发送中奖结果到服务器
        // if (result.id) {
        //     LuckySpinSystem.I.sendLotteryResult(result.id)
        //         .then(() => {
        //             console.log('Lottery result sent to server successfully');
        //         })
        //         .catch((err) => {
        //             console.error('Failed to send lottery result:', err);
        //         });
        // }
        
        // 关闭当前转盘面板，打开新的中奖结果面板
        PanelFactory.close(LuckySpinPanel);
        PanelFactory.open(LuckySpinResultPanel, result);
    }
    
    onCloseBtnClick(): void {
        PanelFactory.close(LuckySpinPanel);
    }
    
    onSpinBtnClick(): void {
        if (this.isSpinning) return;
        const count = LuckySpinSystem.I.getSpinCount();
        if (count <= 0) {
            Toast.show('No spin chances left');
            return;
        }
        
        this.isSpinning = true;
        
        LuckySpinSystem.I.spin((result) => {
            if (!result) {
                Toast.show('Spin failed');
                this.isSpinning = false;
                return;
            }
            
            this.currentResult = result;
            this.updateSpinCount();
            this.playSpinAnimation(result.rate);
            // 发送抽奖次数更新事件
            getEventEmiter().emit(SUBGAME.EVENT.SPIN_COUNT_CHANGED);
        });
    }
    
    private playSpinAnimation(targetRate: number): void {
        if (this.cells.length !== 8) {
            console.error(`Not enough cells! Expected 8, got ${this.cells.length}`);
            this.showResult(this.currentResult);
            this.isSpinning = false;
            return;
        }
        
        // 优先使用服务器返回的 id 来确定目标格子
        let targetIndex = -1;
        if (this.currentResult && this.currentResult.id) {
            targetIndex = this.currentResult.id - 1; // id 从 1 开始，索引从 0 开始
            console.log('Using id:', this.currentResult.id, '-> index:', targetIndex);
            
            // 验证 id 对应的 rate 是否与服务器返回的 rate 一致
            if (targetIndex >= 0 && targetIndex < 8) {
                const expectedRate = this.rewardConfig[targetIndex].rate;
                if (this.currentResult.rate !== expectedRate) {
                    console.warn(`Rate mismatch! Server rate: ${this.currentResult.rate}, Expected rate for id ${this.currentResult.id}: ${expectedRate}`);
                }
            }
        }
        
        // 如果没有 id 或者 id 超出范围，使用 rate 来查找
        if (targetIndex < 0 || targetIndex >= 8) {
            const indicesWithSameRate = this.rewardConfig
                .map((r, i) => r.rate === targetRate ? i : -1)
                .filter(i => i !== -1);
            
            if (indicesWithSameRate.length > 0) {
                // 如果只有一个格子有这个 rate，直接使用
                if (indicesWithSameRate.length === 1) {
                    targetIndex = indicesWithSameRate[0];
                } else {
                    // 如果有多个格子有相同的 rate，随机选择一个
                    targetIndex = indicesWithSameRate[Math.floor(Math.random() * indicesWithSameRate.length)];
                }
                console.log('Using rate:', targetRate, '-> indicesWithSameRate:', indicesWithSameRate, '-> selected:', targetIndex);
            } else {
                // 如果找不到匹配的 rate，随机选择
                targetIndex = Math.floor(Math.random() * 8);
                console.log('No matching rate found, random index:', targetIndex);
            }
        }
        
        const fullCycles = 3;
        // 总步数 = 完整圈数 + 目标索引 + 1（确保最后停在正确位置）
        const totalSteps = fullCycles * 8 + targetIndex + 1;
        console.log('totalSteps:', totalSteps);
        
        let currentStep = 0;
        let currentSpeed = 80;
        const minSpeed = 200;
        const speedIncrease = 8;
        
        const spin = () => {
            // 重置所有格子，隐藏所有 zhong 标签
            this.cells.forEach((cell, index) => {
                if (cell) {
                    const sprite = cell.getComponent(Sprite);
                    const zhongNode = cell.getChildByName('zhong');
                    
                    if (sprite) sprite.color = new Color(this.rewardConfig[index].color);
                    tween(cell).to(0.05, { scale: v3(1, 1, 1) }).start();
                    
                    // 隐藏 zhong 标签
                    if (zhongNode) zhongNode.active = false;
                }
            });
            
            // 高亮当前格子
            const highlightIndex = this.cellOrder[currentStep % 8];
            const highlightCell = this.cells[highlightIndex];
            
            if (highlightCell) {
                tween(highlightCell).to(0.05, { scale: v3(1.05, 1.05, 1) }).start();
                const highlightSprite = highlightCell.getComponent(Sprite);
                if (highlightSprite) highlightSprite.color = new Color('#f1c40f');
            }
            
            currentStep++;
            
            // 减速
            if (currentStep > totalSteps - 10) {
                currentSpeed = Math.min(currentSpeed + speedIncrease, minSpeed);
            }
            
            if (currentStep < totalSteps) {
                this.spinAnimationId = setTimeout(spin, currentSpeed);
            } else {
                this.showWinEffect(targetIndex);
            }
        };
        
        spin();
    }
    
    private showWinEffect(targetIndex: number): void {
        const winCell = this.cells[targetIndex];
        if (!winCell) {
            console.error('winCell is null!');
            this.showResult(this.currentResult);
            this.isSpinning = false;
            return;
        }
        
        // 停止所有正在进行的 tween 动画
        this.cells.forEach(cell => {
            if (cell) Tween.stopAllByTarget(cell);
        });
        
        // 显示中奖 cell 的 zhong 标签
        const zhongNode = winCell.getChildByName('zhong');
        if (zhongNode) {
            console.log('Showing zhong label on winCell');
            // setTimeout(() => {
                zhongNode.active = true;
            // }, 500);
        } else {
        }
        
        // 延迟后显示结果meng
        setTimeout(() => {
            this.showResult(this.currentResult);
            this.isSpinning = false;
        }, 1500);
    } 
    
    onUseBtnClick(): void {}
    
    onGiveUpBtnClick(): void {}
    
    onKill(): void {
        if (this.spinAnimationId) clearTimeout(this.spinAnimationId);
    }
    
    afterCloseEffect(): void {}
}