import { _decorator, CCString, Component, Node } from 'cc';
import { RedDotSystem } from '../system/RedDotSystem';
const { ccclass, property } = _decorator;

@ccclass('ReddotListener')
export class ReddotListener extends Component {

    @property(CCString)
    private flag: string = "";

    protected onLoad(): void {
        let flagArr = this.flag.split("|");
        // 增加监听多个红点标识
        for (let i = 0; i < flagArr.length; i++) {
            RedDotSystem.I.getEventEmiter().on(flagArr[i], this.onRedPointStateChange, this);
        }
        // 初始化红点状态
        this.onRedPointStateChange();
    }

    protected onDestroy(): void {
        let flagArr = this.flag.split("|");
        // 取消监听多个红点标识
        for (let i = 0; i < flagArr.length; i++) {
            RedDotSystem.I.getEventEmiter().off(this.flag, this.onRedPointStateChange, this);
        }
    }

    onRedPointStateChange() {
        let flagArr = this.flag.split("|");
        for (let i = 0; i < flagArr.length; i++) {
            // const element = flagArr[i];
            const state = RedDotSystem.I.getState(flagArr[i]);
            console.log("onRedPointStateChange", flagArr[i], state);
            if (state) {
                this.node.active = true;
                return;
            }
        }
        this.node.active = false;
    }
}


