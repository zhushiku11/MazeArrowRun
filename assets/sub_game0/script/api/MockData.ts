import MOCK_DATA from 'db://assets/doge/framework/network/MockHelper';
import { api } from './api';


Object.defineProperty(MOCK_DATA, api.newUserReward, {
    value: {
        MjPacg: {
            MjPrnw: 0.9,
        },
        MjPuso: {
            MjPmy: 1.5,
            SdegEwl: 0.55,
            SdegBaci: 2.0,
            SdegBac: 2.0,
        }
    }
})

Object.defineProperty(MOCK_DATA, api.withdrawPlatform, {
    value: {
        MjPwr: [
            {
                MjPwr: 0.00025,
                MjPad: 0,
                MjPbe: 0,
                MjPen: 10,
            },
            {
                MjPwr: 0.0003,
                MjPad: 1,
                MjPbe: 11,
                MjPen: 50,
            },
            {
                MjPwr: 0.00035,
                MjPad: 2,
                MjPbe: 51,
                MjPen: 150,
            },
            {
                MjPwr: 0.0004,
                MjPad: 3,
                MjPbe: 151,
                MjPen: 99999999,
            },
        ],
        MjPwwf: [
            {
                MjPme: "paypal",
                MjPmlt: 0.1,
            }
        ],
        MjPuso: {
            MjPewl: 0.55,
            MjPlgd: 10,
            MjPbaci: 2.0,
            MjPmy: 2.0,
            MjPrts: 0,
            MjPimg: 1,
        }
    }

})

Object.defineProperty(MOCK_DATA, api.record, {
    value: [
        {
            MjPrva: "email:abcd1@gmail.com",
            MjPrve: "",
            MjPrvm: "",
            MjPrvn: "jones daniel1",
            MjPdat: "2024.10.10 10:10",
            MjPprc: "0.3",
            MjPpym: "paypal",
            MjPrrm: "Due to your withdrawal failure, the money has been exchanged for 100 crop coupons",
            MjPsts: 4,
        },
        {
            MjPrva: "email:abcd2@gmail.com",
            MjPrve: "",
            MjPrvm: "",
            MjPrvn: "jones daniel2",
            MjPdat: "2024.10.10 10:10",
            MjPprc: "0.3",
            MjPpym: "paypal",
            MjPrrm: "Due to your withdrawal failure, the money has been exchanged for 100 crop coupons",
            MjPsts: 4,
        }
    ]
})

Object.defineProperty(MOCK_DATA, api.withdrawTask, {
    value: [
        {
            MjPan: 5, // 条件
            MjPln: 1, // 完成数
            MjPmy: 1.23, // 奖励
            MjPss: 1, // 领取状态
            MjPtid: 18, // 任务ID
        }
    ]
})

Object.defineProperty(MOCK_DATA, api.withdrawInfo, {
    value: {
        mj_one: 10,
        mj_one_rate: 5,
        mj_two: 30,
        mj_two_rate: 10,
        mj_three: 50,
        mj_three_rate: 20,
        next_day: 86459
    }
})

Object.defineProperty(MOCK_DATA, api.withdrawCash, {
    value: {
        MjPorn: "123123123",
    },
})

Object.defineProperty(MOCK_DATA, api.withdrawCoins, {
    value: {
        MjPorn: "123123123",
    },
})

Object.defineProperty(MOCK_DATA, api.uploadLevel, {
    value: {}
})