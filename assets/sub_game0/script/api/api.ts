const domain = "https://arrows.xin";

export const api = {
    newUserReward: `${domain}/Maze/Run/NewEarn`, // 新手奖励
    withdrawPlatform: `${domain}/Maze/Run/PayList`, // 获取提现平台
    record: `${domain}/Maze/Run/Order`, // 订单列表
    withdrawTask: `${domain}/Maze/Run/Task`, // 每日提现任务信息
    withdrawInfo: `${domain}/Maze/Run/BaseList`, // 提现配置信息
    withdrawCoins: `${domain}/Maze/Run/ApplyWage`, // 提现金币
    withdrawCash: `${domain}/Maze/Run/AddTask`, // 提现现金
    uploadLevel: `${domain}/Maze/Run/AddReach`, // 上报关卡
    lotteryInfo: `${domain}/Maze/Run/LotteryInfo`, // 去抽奖
    lotteryList: `${domain}/Maze/Run/LotteryList`, // 抽奖列表信息
    lotteryResult: `${domain}/Maze/Run/AddEarn`, // 发送中奖结果
}