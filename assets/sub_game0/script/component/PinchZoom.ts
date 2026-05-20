import { _decorator, Component, Node, EventTouch, Touch, Vec2, input, Input, EventKeyboard, KeyCode } from 'cc';
const { ccclass, property } = _decorator;

export interface PinchZoomEventData {
    progress: number;      // 当前进度值 (0-1)
    delta: number;         // 进度变化量
    touchCenter?: Vec2;    // 双指中心点
}

@ccclass('PinchZoom')
export class PinchZoom extends Component {
    @property({ tooltip: '灵敏度（进度变化速度）' })
    sensitivity: number = 0.5;

    @property({ tooltip: '最小进度值' })
    minProgress: number = 0;

    @property({ tooltip: '最大进度值' })
    maxProgress: number = 1;

    @property({ tooltip: '当前进度（0-1）' })
    currentProgress: number = 0;

    // Lambda 回调
    public onProgressStart: ((data: PinchZoomEventData) => void) | null = null;
    public onProgressChange: ((data: PinchZoomEventData) => void) | null = null;
    public onProgressEnd: ((data: PinchZoomEventData) => void) | null = null;

    @property({ type: Node, tooltip: '回调接收节点' })
    callbackNode: Node | null = null;
    @property({ tooltip: '进度开始回调方法名' })
    callbackStartMethod: string = '';
    @property({ tooltip: '进度变化回调方法名' })
    callbackMoveMethod: string = '';
    @property({ tooltip: '进度结束回调方法名' })
    callbackEndMethod: string = '';

    public isProgressing: boolean = false;

    private initialDistance: number = 0;
    private initialProgress: number = 0;

    // 录制模式相关（PC调试用）
    private isRecording: boolean = false;
    private recordedTouch: Touch | null = null;
    private isSimulating: boolean = false;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    private getTouchDistance(touch1: Touch, touch2: Touch): number {
        const pos1 = touch1.getUILocation();
        const pos2 = touch2.getUILocation();
        return Vec2.distance(pos1, pos2);
    }

    private getTouchCenter(touch1: Touch, touch2: Touch): Vec2 {
        const pos1 = touch1.getUILocation();
        const pos2 = touch2.getUILocation();
        return new Vec2((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
    }

    private setProgress(progress: number) {
        this.currentProgress = Math.min(this.maxProgress, Math.max(this.minProgress, progress));
        // 可以在这里添加实际的进度控制逻辑
        // 例如：控制视频播放进度、音频播放进度等
    }

    private invokeCallback(type: 'start' | 'move' | 'end', data: PinchZoomEventData) {
        if (type === 'start' && this.onProgressStart) {
            this.onProgressStart(data);
        }
        if (type === 'move' && this.onProgressChange) {
            this.onProgressChange(data);
        }
        if (type === 'end' && this.onProgressEnd) {
            this.onProgressEnd(data);
        }

        if (this.callbackNode) {
            const scripts = this.callbackNode.getComponents(Component);
            const methodName = type === 'start' ? this.callbackStartMethod :
                type === 'move' ? this.callbackMoveMethod :
                    this.callbackEndMethod;
            for (const script of scripts) {
                if (methodName && typeof (script as any)[methodName] === 'function') {
                    (script as any)[methodName](data);
                }
            }
        }
    }

    // ==================== 键盘事件（PC调试用） ====================

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                console.log('按下 A 键，进入录制模式');
                this.isRecording = true;
                this.recordedTouch = null;
                break;
            case KeyCode.KEY_S:
                if (this.recordedTouch) {
                    console.log('按下 S 键，进入模拟双指模式');
                    this.isSimulating = true;
                } else {
                    console.log('没有录制的触摸点，请先按 A 键录制');
                }
                break;
        }
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                console.log('抬起 A 键，退出录制模式');
                this.isRecording = false;
                break;
            case KeyCode.KEY_S:
                console.log('抬起 S 键，退出模拟双指模式');
                this.isSimulating = false;
                if (this.isProgressing) {
                    this.isProgressing = false;
                    this.initialDistance = 0;
                    this.invokeCallback('end', { progress: this.currentProgress, delta: 0 });
                }
                break;
        }
    }

    /**
     * 获取当前所有活跃的触摸点
     */
    getActiveTouches(event: EventTouch, allTouches: boolean = true): Touch[] {
        let touches = [...(allTouches ? event.getAllTouches() : event.getTouches())];

        if (this.isSimulating && this.recordedTouch && touches.length <= 1) {
            touches.push(this.recordedTouch);
        }

        return touches;
    }

    // ==================== 触摸事件 ====================

    private onTouchStart(event: EventTouch) {
        // 录制模式：保存触摸点
        if (this.isRecording && !this.recordedTouch) {
            const touches = event.getTouches();
            if (touches.length > 0) {
                this.recordedTouch = touches[0].clone();
                console.log('录制触摸点完成');
            }
        }

        const touches = this.getActiveTouches(event);

        // 单指：穿透给下层
        if (touches.length <= 1 && !this.isSimulating) {
            event.preventSwallow = true;
        }
        // 双指：开始控制进度
        else if (touches.length === 2 && !this.isProgressing) {
            event.preventSwallow = false;
            this.isProgressing = true;
            this.initialDistance = this.getTouchDistance(touches[0], touches[1]);
            this.initialProgress = this.currentProgress;

            const center = this.getTouchCenter(touches[0], touches[1]);
            this.invokeCallback('start', {
                progress: this.currentProgress,
                delta: 0,
                touchCenter: center
            });
        }
    }

    private onTouchMove(event: EventTouch) {
        const touches = this.getActiveTouches(event);
        if (this.isProgressing && touches.length === 2 && this.initialDistance > 0) {
            event.preventSwallow = false;

            const newDistance = this.getTouchDistance(touches[0], touches[1]);

            // 计算距离变化
            let distanceDelta = newDistance - this.initialDistance;

            // 向外滑动（正）增加进度，向内滑动（负）减少进度
            let progressDelta = distanceDelta * this.sensitivity / 100;

            let newProgress = this.initialProgress + progressDelta;
            newProgress = Math.min(this.maxProgress, Math.max(this.minProgress, newProgress));
            console.log("newProgress ", newProgress);

            const actualDelta = newProgress - this.initialProgress;

            if (actualDelta !== 0) {
                this.setProgress(newProgress);
                const center = this.getTouchCenter(touches[0], touches[1]);
                this.invokeCallback('move', {
                    progress: this.currentProgress,
                    delta: actualDelta,
                    touchCenter: center
                });
            }
        }
        else if (this.isProgressing && touches.length !== 2) {
            // 双指中断
            this.isProgressing = false;
            this.initialDistance = 0;
            this.invokeCallback('end', { progress: this.currentProgress, delta: 0 });
        }
        // 非进度控制状态下的单指移动，让事件穿透
        else if (!this.isProgressing && touches.length <= 1 && !this.isSimulating) {
            event.preventSwallow = true;
        }
    }

    private onTouchEnd(event: EventTouch) {
        const touches = this.getActiveTouches(event, false);

        if (this.isProgressing && !this.isSimulating) {
            this.isProgressing = false;
            this.initialDistance = 0;
            this.invokeCallback('end', { progress: this.currentProgress, delta: 0 });
            event.preventSwallow = true;
        }
        else if (touches.length <= 1 && !this.isSimulating) {
            event.preventSwallow = true;
        }
    }

    private onTouchCancel(event: EventTouch) {
        const touches = this.getActiveTouches(event, false);

        if (this.isProgressing) {
            this.isProgressing = false;
            this.initialDistance = 0;
            this.invokeCallback('end', { progress: this.currentProgress, delta: 0 });
            event.preventSwallow = true;
        }
        else if (touches.length <= 1 && !this.isSimulating) {
            event.preventSwallow = true;
        }
    }

    // ==================== 公共方法 ====================

    /**
     * 设置进度值
     * @param progress 进度值 (0-1)
     * @param notify 是否触发回调
     */
    public setProgressValue(progress: number, notify: boolean = true) {
        const newProgress = Math.min(this.maxProgress, Math.max(this.minProgress, progress));
        if (newProgress !== this.currentProgress) {
            const delta = newProgress - this.currentProgress;
            this.setProgress(newProgress);
            if (notify) {
                this.invokeCallback('move', { progress: this.currentProgress, delta: delta });
            }
        }
    }

    public getProgress(): number {
        return this.currentProgress;
    }

    public resetProgress(notify: boolean = true) {
        this.setProgressValue(0, notify);
    }

    public isProgressingNow(): boolean {
        return this.isProgressing;
    }
}