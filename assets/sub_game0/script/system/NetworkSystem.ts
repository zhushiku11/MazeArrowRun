import { getEventEmiter } from "db://assets/doge/framework/common/EventEmitter";
import { Language } from "db://assets/doge/framework/language/Language";
import HttpHelper from "db://assets/doge/framework/network/HttpHelper";

import { PlayerSystem } from "db://assets/main/script/system/PlayerSystem";
import { api } from "../api/api";
import { api as apiMain } from "db://assets/main/script/api/api";

export type NetworkResult = {
    error: boolean,
    data: any,
}

const EMITER_NAME = "_NETWORK_SYSTEM_";

export class NetworkSystem {

    // 缓存数据
    private static dataCache: Map<string, any> = new Map<string, any>();

    private static inited: boolean = false;

    public static init(bundle: string) {
        this.inited = true;
        HttpHelper.xBundle = bundle;
    }

    public static getEventEmiter() {
        return getEventEmiter(EMITER_NAME);
    }

    public static getCacheData(url: string): any {
        return NetworkSystem.dataCache.get(url) || null;
    }

    public static on(event: string, callback: (...any: any[]) => void, thisArgs?: any) {
        NetworkSystem.getEventEmiter().on(event, callback, thisArgs);
    }

    public static off(event: string, callback: (...any: any[]) => void, thisArgs?: any) {
        NetworkSystem.getEventEmiter().off(event, callback, thisArgs);
    }

    public static once(event: string, callback: (...any: any[]) => void, thisArgs?: any) {
        NetworkSystem.getEventEmiter().once(event, callback, thisArgs);
    }

    private static send(url: string, sendData: string): Promise<NetworkResult> {
        return new Promise<NetworkResult>((resolve) => {
            if (!this.inited) {
                console.error("NetworkSystem is not init!");
                resolve({ error: true, data: "NetworkSystem is not init!" });
                return
            }
            HttpHelper.post(url, sendData, (isSucess: boolean, res: string, helper: HttpHelper) => {
                if (isSucess) {
                    let result = null;
                    try {
                        result = JSON.parse(res)
                    } catch (error) {
                        let msg = Language.getWord("l_dataError");
                        NetworkSystem.getEventEmiter().emit(url, true, msg);
                        resolve({ error: true, data: msg });
                        return;
                    }
                    console.log(`Network url:[${url}]`);
                    console.log(`Network result:`, result);
                    if (result && result.code == 200) {
                        if (result.data) {
                            let str = HttpHelper.unSignXXTea(result.data);
                            let data = JSON.parse(str);
                            this.dataCache.set(url, data);
                            console.log(`Network unSign result`);
                            console.log(str);
                            console.log(data);
                            NetworkSystem.getEventEmiter().emit(url, { error: false, data: data });
                            resolve({ error: false, data: data });
                        } else {
                            NetworkSystem.getEventEmiter().emit(url, { error: false, data: null });
                            resolve({ error: false, data: null });
                        }
                    } else {
                        let msg = Language.getWord("l_networkError");
                        NetworkSystem.getEventEmiter().emit(url, { error: true, data: msg });
                        resolve({ error: true, data: msg });
                    }
                } else {
                    // 网络问题失败
                    let msg = Language.getWord("l_networkError1");
                    NetworkSystem.getEventEmiter().emit(url, { error: true, data: msg });
                    resolve({ error: true, data: msg });
                }
            });
        })
    }


    public static newUserReward(): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPapid: PlayerSystem.I.getAppID(),
            MjPusid: PlayerSystem.I.getUserID(),
        });
        return NetworkSystem.send(api.newUserReward, jsonStr);
    }

    public static withdrawPlatform(): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPapid: PlayerSystem.I.getAppID(),
            MjPusid: PlayerSystem.I.getUserID(),
            vn: PlayerSystem.I.getVersion(),
        });
        return NetworkSystem.send(api.withdrawPlatform, jsonStr);
    }

    public static withdrawTask(): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPapid: PlayerSystem.I.getAppID(),
            MjPusid: PlayerSystem.I.getUserID(),
            vn: PlayerSystem.I.getVersion(),
        });
        return NetworkSystem.send(api.withdrawTask, jsonStr);
    }

    public static withdrawRecord(): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPapid: PlayerSystem.I.getAppID(),
            MjPusid: PlayerSystem.I.getUserID(),
        });
        return NetworkSystem.send(api.record, jsonStr);
    }

    public static withdrawInfo(): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPapid: PlayerSystem.I.getAppID(),
            MjPcfn: "look_ad_reward_mul",
            vn: PlayerSystem.I.getVersion(),
        });
        return NetworkSystem.send(api.withdrawInfo, jsonStr);
    }

    public static withdrawCash(email: string): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPrae: email,
            MjPapid: PlayerSystem.I.getAppID(),
            MjPmtid: 1036,
            MjPusid: PlayerSystem.I.getUserID(),
            vn: PlayerSystem.I.getVersion(),
        });
        return NetworkSystem.send(api.withdrawCash, jsonStr);
    }

    public static withdrawCoins(email: string): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPrae: email,
            MjPapid: PlayerSystem.I.getAppID(),
            MjPmtid: 1036,
            MjPusid: PlayerSystem.I.getUserID(),
            vn: PlayerSystem.I.getVersion(),
        });
        return NetworkSystem.send(api.withdrawCoins, jsonStr);
    }

    // 上报关卡
    public static uploadLevel(): Promise<NetworkResult> {
        let jsonStr = HttpHelper.signXXTea({
            MjPapid: PlayerSystem.I.getAppID(),
            MjPusid: PlayerSystem.I.getUserID(),
        });
        return NetworkSystem.send(api.uploadLevel, jsonStr);
    }
}