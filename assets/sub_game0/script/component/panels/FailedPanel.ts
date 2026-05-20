import { _decorator, Component } from 'cc';
import { IPanel, Panel } from 'db://assets/doge/framework/panel/Panel';
import { LevelSystem } from '../../system/LevelSystem';
import { PanelFactory } from 'db://assets/doge/framework/panel/PanelFactory';
import { UserSystem } from '../../system/UserSystem';
import { ACoins } from 'db://assets/doge/framework/common/Currency';
import { getEventEmiter } from 'db://assets/doge/framework/common/EventEmitter';
import { AD_TYPE, REWARD_TYPE } from 'db://assets/native_interface/NI';
import { SUBGAME } from '../../../constant/Constant';
import { TimeoutPanel } from './TimeoutPanel';
import { Toast } from 'db://assets/doge/framework/init';
import { Language } from 'db://assets/doge/framework/language/Language';
const { ccclass, property } = _decorator;

@ccclass('FailedPanel')
export class FailedPanel extends Component implements IPanel {

    onInit() {

    }

    async onFreeBtnClick() {
        // 广告购买
        UserSystem.I.getAdReward(AD_TYPE.VIDEO, REWARD_TYPE.NONE, 0, (isErr: boolean, rewardA: number, rewardB: number) => {
            if (isErr) {
                return;
            }
            this.node && PanelFactory.close(FailedPanel);
            if (rewardA > 0 || rewardB > 0) {
                // 广告奖励
                UserSystem.I.congratulationsMoney(rewardA, rewardB, 0);
            }
            // 增加时间
            getEventEmiter().emit(SUBGAME.FUNC.GAME_ADD_HP);
        })
    }

    async onMoneyBtnClick() {
        if (ACoins.isEnough(100)) {
            this.node && PanelFactory.close(TimeoutPanel);
            // 减少金币
            ACoins.use(100);
            // 增加血量
            getEventEmiter().emit(SUBGAME.FUNC.GAME_ADD_HP);
        } else {
            Toast.show(Language.getWord("l_coinsNotEnough"));
        }
    }

    onRestartBtnClick() {
        this.node && PanelFactory.close(FailedPanel);
        LevelSystem.I.replay();
    }
}