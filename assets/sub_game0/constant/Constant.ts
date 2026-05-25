
export const RES_NAME = "tile";
export const RES_PATH = { tile: "/sub_game0/res" };

/**场景名称 */
export const SCENES_NAME = {
    /** 子游戏 主页面 */
    Main: 'sub_game0/scene/Main',
    /** 子游戏 游戏页面 */
    Game: 'sub_game0/scene/Game',
}

/**预加载资源 */
export const PRELOAD = {
    SPFRAME_FRAMES: {
        COMMON: {
            arrow0: "texture/arrow/arrow0/spriteFrame",
            arrow1: "texture/arrow/arrow1/spriteFrame",
            arrow2: "texture/arrow/arrow2/spriteFrame",
            arrow3: "texture/arrow/arrow3/spriteFrame",
            arrow4: "texture/arrow/arrow4/spriteFrame",
            arrow5: "texture/arrow/arrow5/spriteFrame",
            arrow6: "texture/arrow/arrow6/spriteFrame",
            arrow7: "texture/arrow/arrow7/spriteFrame",
            arrow100: "texture/arrow/arrow100/spriteFrame",

            body0: "texture/arrow/body0/spriteFrame",
            body1: "texture/arrow/body1/spriteFrame",
            body2: "texture/arrow/body2/spriteFrame",
            body3: "texture/arrow/body3/spriteFrame",
            body4: "texture/arrow/body4/spriteFrame",
            body5: "texture/arrow/body5/spriteFrame",
            body6: "texture/arrow/body6/spriteFrame",
            body7: "texture/arrow/body7/spriteFrame",
            body100: "texture/arrow/body100/spriteFrame",
        },
        ID: {
            reward_icon0: 'texture/common/reward_icon0_id/spriteFrame',
            reward_icon1: 'texture/common/reward_icon1_id/spriteFrame',
            reward_icon2: 'texture/common/reward_icon2_id/spriteFrame',
            reward_icon3: 'texture/common/reward_icon3_id/spriteFrame',
            reward_icon4: 'texture/common/reward_icon4_id/spriteFrame',
            reward_icon5: 'texture/common/reward_icon5_id/spriteFrame',
            tip_icon0: 'texture/common/tip_icon0_id/spriteFrame',
            tip_icon1: 'texture/common/tip_icon1_id/spriteFrame',
            tip_icon2: 'texture/common/tip_icon2_id/spriteFrame',
            tip_icon3: 'texture/common/tip_icon3_id/spriteFrame',
            tip_icon4: 'texture/common/tip_icon4_id/spriteFrame',
            tip_icon5: 'texture/common/tip_icon5_id/spriteFrame',
            taskIcon: 'texture/common/task_icon_id/spriteFrame',
        },
        BR: {
            reward_icon0: 'texture/common/reward_icon0_br/spriteFrame',
            reward_icon1: 'texture/common/reward_icon1_br/spriteFrame',
            reward_icon2: 'texture/common/reward_icon2_br/spriteFrame',
            reward_icon3: 'texture/common/reward_icon3_br/spriteFrame',
            reward_icon4: 'texture/common/reward_icon4_br/spriteFrame',
            reward_icon5: 'texture/common/reward_icon5_br/spriteFrame',
            tip_icon0: 'texture/common/tip_icon0_br/spriteFrame',
            tip_icon1: 'texture/common/tip_icon1_br/spriteFrame',
            tip_icon2: 'texture/common/tip_icon2_br/spriteFrame',
            tip_icon3: 'texture/common/tip_icon3_br/spriteFrame',
            tip_icon4: 'texture/common/tip_icon4_br/spriteFrame',
            tip_icon5: 'texture/common/tip_icon5_br/spriteFrame',
            taskIcon: 'texture/common/task_icon_br/spriteFrame',
        },
        US: {
            reward_icon0: 'texture/common/reward_icon0_us/spriteFrame',
            reward_icon1: 'texture/common/reward_icon1_us/spriteFrame',
            reward_icon2: 'texture/common/reward_icon2_us/spriteFrame',
            reward_icon3: 'texture/common/reward_icon3_us/spriteFrame',
            reward_icon4: 'texture/common/reward_icon4_us/spriteFrame',
            reward_icon5: 'texture/common/reward_icon5_us/spriteFrame',
            tip_icon0: 'texture/common/tip_icon0_us/spriteFrame',
            tip_icon1: 'texture/common/tip_icon1_us/spriteFrame',
            tip_icon2: 'texture/common/tip_icon2_us/spriteFrame',
            tip_icon3: 'texture/common/tip_icon3_us/spriteFrame',
            tip_icon4: 'texture/common/tip_icon4_us/spriteFrame',
            tip_icon5: 'texture/common/tip_icon5_us/spriteFrame',
            taskIcon: 'texture/common/task_icon_us/spriteFrame',
        },
    },
}

export const STORAGE = {
    CACHE_BALL: "CACHE_BALL",
    TARGET_BALL: "TARGET_BALL",
    COUNT_1024: "COUNT_1024",
    COUNT_2048: "COUNT_2048",
    CURR_SCORE: "CURR_SCORE",
    HIGHER_SCORE: "HIGHER_SCORE",
    PROP0_COUNT: "PROP0_COUNT", // 道具1数量
    PROP1_COUNT: "PROP1_COUNT", // 道具2数量
    PROP2_COUNT: "PROP2_COUNT", // 道具3数量
    PROP3_COUNT: "PROP3_COUNT", // 道具4数量
    PROP0_CLAIM_COUNT: "PROP0_CLAIM_COUNT", // 道具1数量
    PROP1_CLAIM_COUNT: "PROP1_CLAIM_COUNT", // 道具2数量
    PROP2_CLAIM_COUNT: "PROP2_CLAIM_COUNT", // 道具3数量
    PROP3_CLAIM_COUNT: "PROP3_CLAIM_COUNT", // 道具4数量
    GUIDE_STEP: "GUIDE_STEP",
}

export const SUBGAME = {
    /**功能事件 */
    FUNC: {
        GAME_PAUSE: "GAME_PAUSE",
        GAME_RESUME: "GAME_RESUME",
        GAME_ADD_TIME: "GAME_ADD_TIME",
        GAME_ADD_HP: "GAME_ADD_HP",
    },
    /**面板事件 */
    PANEL: {
    },
    /**弹窗事件 */
    POPUP: {
        A_COINS: "A_COINS",
        B_COINS: "B_COINS",
        MONEY: "MONEY",
        ENERGY: "ENERGY",
    },
    /**场景事件 */
    SCENE: {
        GAME: "GAME",
        MAIN: "MAIN",
    },
    /**事件 */
    EVENT: {
        LEVEL_PASSED: "LEVEL_PASSED",
        SPIN_COUNT_CHANGED: "SPIN_COUNT_CHANGED",
    },
}

/**挑战模式关卡数 */
export const CHALLENGE_PASS = 999;
/**无尽模式关卡数 */
export const ENDLESS_PASS = 100;

export const MAX_BALL_TYPE = 10;

/**slot游戏条件上限 */
export const SLOT_CONDITION = 2;

/**动画时间 */
export const ANIM_TIME = {
    TILE_REMOVE: 0.3,
    TILE_RECREATE: 0.3,
    TILE_SHAKE: 0.1,
    MAP_MOVE: 0.3,
    MAP_REFRESH: 0.3,
}

const AUDIO_PATH_PRE: string = 'sound/';
export const AUDIOS = {
    bgm: `${AUDIO_PATH_PRE}bgm`,
    win: `${AUDIO_PATH_PRE}win`,
    // touch1: `${AUDIO_PATH_PRE}touch1`,
    // touch2: `${AUDIO_PATH_PRE}touch2`,
    // touch3: `${AUDIO_PATH_PRE}touch3`,
    // touch4: `${AUDIO_PATH_PRE}touch4`,
    // touch5: `${AUDIO_PATH_PRE}touch5`,
    // touch6: `${AUDIO_PATH_PRE}touch6`,
    // touch7: `${AUDIO_PATH_PRE}touch7`,
    // touch8: `${AUDIO_PATH_PRE}touch8`,
    // touch9: `${AUDIO_PATH_PRE}touch9`,
    // touch10: `${AUDIO_PATH_PRE}touch10`,
    // touch11: `${AUDIO_PATH_PRE}touch11`,
    // touch12: `${AUDIO_PATH_PRE}touch12`,
    error: `${AUDIO_PATH_PRE}error`,
    slot_bgm: `${AUDIO_PATH_PRE}slot_bgm`,
};