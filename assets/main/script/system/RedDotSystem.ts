import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";

// 红点系统
export class RedDotSystem {

    private static _instance = null;
    public static get I(): RedDotSystem {
        if (!RedDotSystem._instance) {
            RedDotSystem._instance = new RedDotSystem();
        }
        return RedDotSystem._instance;
    }

    private vo: RedDotSystemVO = new RedDotSystemVO();

    public init() { }

    public update(tag: string, state: boolean) {
        if (!this.vo.states.has(tag)) {
            this.vo.states.set(tag, false);
        }
        if (this.vo.states.get(tag) != state) {
            this.vo.states.set(tag, state);
            console.log("RedDotSystem update RedDotComp", tag, state);
            // 更新红点脚本
            this.getEventEmiter().emit(tag, state);
        }
    }

    // public updatedMultiple(tagArr: string[], states: boolean[]) {
    //     for (let i = 0; i < tagArr.length; i++) {
    //         const tag = tagArr[i];
    //         const state = states[i];
    //         this.vo.states.set(tag, state);
    //         console.log("RedDotSystem updatedMultiple", this.vo.states);
    //         this.getEventEmiter().emit(tag, state);
    //     }
    // }

    public getState(tag: string): boolean {
        console.log("RedDot", tag, "State", this.vo.states.get(tag), this.vo.states);
        return this.vo.states.get(tag) || false;
    }

    // public getStates(tagArr: string[]): boolean[] {
    //     let result = [];
    //     for (let i = 0; i < tagArr.length; i++) {
    //         console.log("RedDot", tagArr[i], "State", this.vo.states.get(tagArr[i]));
    //         result.push(this.vo.states.get(tagArr[i]) || false);
    //     }
    //     return result;
    // }

    // public getStatesByTag(tag: string): boolean[] {
    //     return this.getStates(tag.split("|"));
    // }

    public getEventEmiter() {
        return getEventEmiter("RED_DOT");
    }
}

export class RedDotSystemVO {

    // 红点状态
    private _states: Map<string, boolean> = new Map<string, boolean>();

    public get states(): Map<string, boolean> {
        return this._states;
    }
    public set states(value: Map<string, boolean>) {
        this._states = value;
    }
}


