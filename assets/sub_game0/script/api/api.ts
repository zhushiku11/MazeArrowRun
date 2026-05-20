const domain = "https://www.marigold.xin";

export const api = {
    newUserReward: `${domain}/ApiV1/Jackpot/AddNew`, // 新手奖励
    withdrawPlatform: `${domain}/ApiV1/Jackpot/PlatList`, // 获取提现平台
    record: `${domain}/ApiV1/Jackpot/Order`, // 订单列表
    withdrawTask: `${domain}/ApiV1/Jackpot/TaskList`, // 每日提现任务信息
    withdrawInfo: `${domain}/ApiV1/Jackpot/AppBase`, // 提现配置信息
    withdrawCoins: `${domain}/ApiV1/Jackpot/ApplyWage`, // 提现金币
    withdrawCash: `${domain}/ApiV1/Jackpot/ApplyTask`, // 提现现金
    uploadLevel: `${domain}/ApiV1/Jackpot/AddNum`, // 上报关卡
}