import { CurrencyType, Language } from "../language/Language";
import FloatCalc from "./FloatCalc";
import { StorageBox } from "./StorageBox";

type CurrencyFormatOpt = {
    separator?: string,
    decimal?: number
    decimalSymbol?: string,
}

// 货币初始化
export class Currency {
    public static init(amoney: number, bmoney: number, bmoney1: number, cmoney: number) {
        AMoney.init(amoney);
        BMoney.init(bmoney, bmoney1);
        CMoney.init(cmoney);
        ACoins.init();
        BCoins.init();
    }
}

// 提现货币1（现金）
export class AMoney {
    public static readonly KEY: string = "AMoney";

    private static _Value: number = 0;

    public static init(amoney: number) {
        AMoney.set(amoney);
        AMoney.refresh();
    }

    public static format(num: number, opt: CurrencyFormatOpt = { separator: "," }): string {
        opt.separator = opt.separator || ",";
        opt.decimalSymbol = opt.decimalSymbol || ".";
        let decimal = opt.decimal || 0;
        // let numStr = num.toFixed(decimal);
        let exponent = Math.pow(10, decimal);
        console.log("format", num * exponent, exponent, Math.floor(num * exponent), Math.floor(num * exponent) / exponent);
        let numStr = (FloatCalc.div(Math.floor(FloatCalc.mul(num, exponent)), exponent)).toString();
        let numArr = numStr.split(".");
        let integerNum = numArr[0];
        let decimalNum = numArr[1];

        if (integerNum) {
            integerNum = `${integerNum}.`.replace(/\d(?=(\d{3})+\.)/g, `$&${opt.separator}`).slice(0, -1);
        }

        if (decimalNum) {
            return `${integerNum}${opt.decimalSymbol}${decimalNum}`;
        } else {
            return integerNum;
        }
    }

    // 设置值
    public static set(num: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        AMoney._Value = count;
        AMoney.save();
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let count = AMoney._Value + num;
        if (count < 0) {
            count = 0;
        }
        this.set(count);
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("AMoney", AMoney.string());
    }

    // 保存
    public static save() {
        StorageBox.save(AMoney.KEY, `${AMoney.value()}`);
    }

    // 字符串值
    public static string(num?: number): string {
        switch (Language.currency) {
            case CurrencyType.JP:
            case CurrencyType.KR:
            case CurrencyType.NG:
                return AMoney.format(num || num == 0 ? num : AMoney.value(), { separator: ",", decimal: 0 });
            case CurrencyType.PH:
            case CurrencyType.IN:
                return AMoney.format(num || num == 0 ? num : AMoney.value(), { separator: ",", decimal: 1 });
            case CurrencyType.US:
            case CurrencyType.GB:
            case CurrencyType.ZA:
            case CurrencyType.MX:
            case CurrencyType.CA:
            case CurrencyType.AU:
                return AMoney.format(num || num == 0 ? num : AMoney.value(), { separator: ",", decimal: 2 });
            case CurrencyType.ID:
            case CurrencyType.AR:
            case CurrencyType.CO:
            case CurrencyType.VN:
                return AMoney.format(num || num == 0 ? num : AMoney.value(), { separator: ".", decimalSymbol: ",", decimal: 0, });
            case CurrencyType.BR:
            case CurrencyType.DE:
                return AMoney.format(num || num == 0 ? num : AMoney.value(), { separator: ".", decimalSymbol: ",", decimal: 2 });
            case CurrencyType.RU:
            case CurrencyType.FR:
                return AMoney.format(num || num == 0 ? num : AMoney.value(), { separator: " ", decimalSymbol: ",", decimal: 2 });
        }
    }

    // 原始值
    public static value(): number {
        return AMoney._Value;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return AMoney.value() >= num;
    }
}

// 提现货币2（金币）
export class BMoney {

    private static _Value: number = 0;
    private static _Value1: number = 0;

    public static init(bmoney: number, bmoney1: number) {
        BMoney.set(bmoney, bmoney1);
        BMoney.refresh();
    }

    public static format(num: number): string {
        return Math.floor(num).toFixed(0);
    }

    // 设置值
    public static set(num: number, num1: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        BMoney._Value = count;
        BMoney._Value1 = num1;
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let count = BMoney._Value + num;
        if (count < 0) {
            count = 0;
        }
        BMoney._Value = count;
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("BMoney", BMoney.string());
        Language.updVariable("BMoney1", AMoney.string(BMoney._Value1));
    }

    public static string(num?: number): string {
        switch (Language.currency) {
            case CurrencyType.JP:
            case CurrencyType.KR:
            case CurrencyType.NG:
            case CurrencyType.PH:
            case CurrencyType.IN:
            case CurrencyType.US:
            case CurrencyType.GB:
            case CurrencyType.ZA:
            case CurrencyType.MX:
            case CurrencyType.CA:
            case CurrencyType.AU:
            case CurrencyType.ID:
            case CurrencyType.AR:
            case CurrencyType.CO:
            case CurrencyType.DE:
            case CurrencyType.RU:
            case CurrencyType.FR:
            case CurrencyType.VN:
                return BMoney.format(num || num == 0 ? num : BMoney.value());
            case CurrencyType.BR:
                return AMoney.string(num || num == 0 ? num : BMoney.value());
        }
    }

    // 原始值
    public static value(): number {
        return BMoney._Value;
    }

    public static value1(): number {
        return BMoney._Value1;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return BMoney.value() >= num;
    }
}

// 提现货币3（兑换卷）
export class CMoney {

    private static _Value: number = 0;

    public static get Value(): number {
        return CMoney._Value;
    }
    public static set Value(value: number) {
        CMoney._Value = value;
    }

    public static init(cmoney: number) {
        CMoney.set(cmoney);
        CMoney.refresh();
    }

    public static format(num: number): string {
        // return Math.floor(num).toFixed(2);
        return num.toFixed(2);
    }

    // 设置值
    public static set(num: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        CMoney._Value = count;
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let count = CMoney._Value + num;
        if (count < 0) {
            count = 0;
        }
        CMoney._Value = count;
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("CMoney", CMoney.string());
    }

    public static string(num?: number): string {
        switch (Language.currency) {
            case CurrencyType.JP:
            case CurrencyType.KR:
            case CurrencyType.NG:
            case CurrencyType.PH:
            case CurrencyType.IN:
            case CurrencyType.US:
            case CurrencyType.GB:
            case CurrencyType.ZA:
            case CurrencyType.MX:
            case CurrencyType.CA:
            case CurrencyType.AU:
            case CurrencyType.ID:
            case CurrencyType.AR:
            case CurrencyType.CO:
            case CurrencyType.BR:
            case CurrencyType.DE:
            case CurrencyType.RU:
            case CurrencyType.FR:
            case CurrencyType.VN:
                return CMoney.format(num || num == 0 ? num : CMoney.value());
        }
    }

    // 原始值
    public static value(): number {
        return CMoney._Value;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return CMoney.value() >= num;
    }
}

// 游戏货币1（游戏金币）
export class ACoins {

    public static readonly KEY: string = "ACoins";

    private static _Value: number = 0;

    public static init() {
        ACoins.set(StorageBox.load(ACoins.KEY, "0").int());
        ACoins.refresh();
    }

    public static format(num: number): string {
        return Math.floor(num).toFixed(0);
    }

    // 设置值
    public static set(num: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        ACoins._Value = count;
        ACoins.save();
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let count = ACoins._Value + num;
        if (count < 0) {
            count = 0;
        }
        ACoins.set(count);
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("ACoins", ACoins.string());
    }

    // 保存
    public static save() {
        StorageBox.save(ACoins.KEY, `${ACoins.value()}`);
    }

    public static string(num?: number): string {
        switch (Language.currency) {
            case CurrencyType.JP:
            case CurrencyType.KR:
            case CurrencyType.NG:
            case CurrencyType.PH:
            case CurrencyType.IN:
            case CurrencyType.US:
            case CurrencyType.GB:
            case CurrencyType.ZA:
            case CurrencyType.MX:
            case CurrencyType.CA:
            case CurrencyType.AU:
            case CurrencyType.ID:
            case CurrencyType.AR:
            case CurrencyType.CO:
            case CurrencyType.BR:
            case CurrencyType.DE:
            case CurrencyType.RU:
            case CurrencyType.FR:
            case CurrencyType.VN:
                return ACoins.format(num || num == 0 ? num : ACoins.value());
        }
    }

    // 原始值
    public static value(): number {
        return ACoins._Value;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return ACoins.value() >= num;
    }
}

// 游戏货币2（体力）
export class BCoins {

    private static readonly KEY: string = "BCoins";

    private static _Value: number = 0;

    public static init() {
        BCoins.set(StorageBox.load(BCoins.KEY, "0").int());
        BCoins.refresh();
    }

    public static format(num: number): string {
        return Math.floor(num).toFixed(0);
    }

    // 设置值
    public static set(num: number) {
        let count = num;
        if (count < 0) {
            count = 0;
        }
        BCoins._Value = count;
        BCoins.save();
    }

    // 增加数量 负数减少
    public static add(num: number) {
        let count = BCoins._Value + num;
        if (count < 0) {
            count = 0;
        }
        BCoins.set(count);
    }

    // 使用
    public static use(num: number) {
        this.add(-Math.abs(num));
        this.refresh();
    }

    // 给予
    public static give(num: number) {
        this.add(Math.abs(num));
        this.refresh();
    }

    // 刷新显示
    public static refresh() {
        Language.updVariable("BCoins", BCoins.string());
    }

    // 保存
    public static save() {
        StorageBox.save(BCoins.KEY, `${BCoins.value()}`);
    }

    public static string(num?: number): string {
        return BCoins.format(num || num == 0 ? num : BCoins.value());
    }

    // 原始值
    public static value(): number {
        return BCoins._Value;
    }

    // 是否足够
    public static isEnough(num: number = 0) {
        return BCoins.value() >= num;
    }

}