import { AssetManager, assetManager, JsonAsset, log, Size, TERRAIN_MAX_LAYER_COUNT, v2, v3 } from "cc";
import { RES_NAME } from "../../constant/Constant";
import { AssetsDB } from "db://assets/doge/framework/common/AssetsDB";
import { LevelSystem } from "./LevelSystem";

export type IMapData = {
    width: number, // 地图宽度
    height: number, // 地图高度
    time: number, // 游戏时间
    arrows: { dir: ArrowDirection, color: number, points: { x: number, y: number }[] }[],
}

export enum ArrowDirection {
    LEFT = 0,
    Down = 1,
    RIGHT = 2,
    UP = 3,
}

export const UNIT_WIDTH = 50;
export const UNIT_HEIGHT = 50;
export const ARROW_EXTENSION = 16;

export class MapSystem {

    public static readonly maxTileWidth = 81;
    public static readonly maxTileHeight = 111;
    public static readonly maxTileIconWidth = 81;
    public static readonly maxTileIconHeight = 111;
    public static readonly maxTileTypeCount = 10;
    public static readonly eliminateLimit = 2;
    public static tileWidth = 0;
    public static tileHeight = 0;
    public static tileScale = 0;
    private static maxMapWidth = 718;
    private static maxMapHeight = 305;

    // 地图配置信息
    private static mapConfig = null;

    public static async init() {
        await MapSystem.loadAllMapData();
    }

    public static setMaxRect(width: number, height: number) {
        this.maxMapWidth = width;
        this.maxMapHeight = height;
    }

    public static getTileIconSize(scale: number) {
        return new Size(this.maxTileIconWidth * scale, this.maxTileIconHeight * scale);
    }

    // 栅格地图大小 转 像素大小
    public static toMapSize(mapW: number, mapH: number) {
        return new Size(mapW * MapSystem.tileWidth, mapH * MapSystem.tileHeight);
    }

    // 栅格坐标 转 像素坐标
    public static toPosition(mapX: number, mapY: number) {
        let posX = mapX * 91 - this.maxMapWidth * 0.5 + MapSystem.tileWidth * 0.5;
        let posY = mapY * 55 - 140;
        return v3(posX, posY, 0);
    }

    // 像素坐标 转 地图坐标
    public static toMapXYByWH(posX: number, posY: number, mapW: number, mapH: number) {
        return v2(Math.floor((posX + 0.5 * mapW * MapSystem.tileWidth) / MapSystem.tileWidth), Math.floor((posY + 0.5 * mapH * MapSystem.tileHeight) / MapSystem.tileHeight));
    }

    // 像素坐标 转 地图坐标
    public static toMapXY(posX: number, posY: number, mapWidht: number, mapHeight: number) {
        return v2(Math.floor((posX + 0.5 * mapWidht) / MapSystem.tileWidth), Math.floor((posY + 0.5 * mapHeight) / MapSystem.tileHeight));
    }

    // 本地获取关卡数据
    public static async loadAllMapData() {
        // let url = `data/allLevel${1}`;
        // console.log("Load map :", url);
        // await AssetsDB.load([url], JsonAsset, null, RES_NAME);
        // let data = AssetsDB.get<JsonAsset>(url, RES_NAME);
        // MapSystem.mapConfig = data.json;
        // console.log("MapSystem.mapConfig", MapSystem.mapConfig);
        let mapConfig = [
            { id: 70001, name: "07-07_[8x10]_[6]_[Loopy, Country]", sortId: 1 },
            { id: 70002, name: "06-30_[25x38]_[69]_[Spaghetti, Aztec]", sortId: 2 },
            { id: 70003, name: "06-30_[31x44]_[121]_[Loopy, Snake]", sortId: 3 },
            { id: 70004, name: "07-02_[20x21]_[47]_[Snake, Basic]", sortId: 4 },
            { id: 70005, name: "06-30_[30x50]_[119]_[Spaghetti, Aztec]", sortId: 5 },
            { id: 70006, name: "07-02_[20x22]_[36]_[Loopy]", sortId: 6 },
            { id: 70007, name: "06-30_[25x38]_[101]_[Spaghetti, Aztec]", sortId: 7 },
            { id: 70008, name: "06-30_[31x47]_[129]_[Loopy, Snake]", sortId: 8 },
            { id: 70009, name: "06-30_[25x38]_[66]_[Aztec]", sortId: 9 },
            { id: 70010, name: "06-30_[38x63]_[196]_[Loopy, Snake]", sortId: 10 },
            { id: 70011, name: "07-02_[20x24]_[46]_[Snake, Aztec]", sortId: 11 },
            { id: 70012, name: "07-02_[20x25]_[24]_[Aztec]", sortId: 12 },
            { id: 70013, name: "06-30_[39x57]_[176]_[Spaghetti, Aztec]", sortId: 13 },
            { id: 70014, name: "07-02_[27x37]_[128]_[Spaghetti, Spaghetti]", sortId: 14 },
            { id: 70015, name: "06-30_[25x38]_[77]_[Spaghetti, Aztec]", sortId: 15 },
            { id: 70016, name: "07-02_[25x40]_[120]_[Basic, Snake]", sortId: 16 },
            { id: 70017, name: "06-30_[25x38]_[72]_[Spaghetti, Aztec]", sortId: 17 },
            { id: 70018, name: "06-30_[37x48]_[184]_[Loopy, Snake]", sortId: 18 },
            { id: 70019, name: "06-30_[25x38]_[73]_[Spaghetti, Aztec]", sortId: 19 },
            { id: 70020, name: "06-30_[25x38]_[80]_[Spaghetti, Aztec]", sortId: 20 },
            { id: 70021, name: "06-30_[41x53]_[158]_[Loopy, Snake]", sortId: 21 },
            { id: 70022, name: "07-02_[20x27]_[47]_[Aztec, Basic]", sortId: 22 },
            { id: 70023, name: "07-02_[27x41]_[132]_[Basic, Snake]", sortId: 23 },
            { id: 70024, name: "06-30_[25x38]_[90]_[Spaghetti, Aztec]", sortId: 24 },
            { id: 70025, name: "07-02_[27x43]_[115]_[Aztec, Basic]", sortId: 25 },
            { id: 70026, name: "06-30_[25x38]_[88]_[Spaghetti, Aztec]", sortId: 26 },
            { id: 70027, name: "07-02_[27x43]_[122]_[Loopy, Country]", sortId: 27 },
            { id: 70028, name: "07-02_[20x26]_[39]_[Country]", sortId: 28 },
            { id: 70029, name: "07-02_[28x46]_[134]_[Snake, Basic]", sortId: 29 },
            { id: 70030, name: "07-02_[28x46]_[122]_[Aztec, Basic]", sortId: 30 },
            { id: 70031, name: "06-30_[27x28]_[70]_[Spaghetti, Aztec]", sortId: 31 },
            { id: 70032, name: "06-30_[27x28]_[58]_[Loopy, Snake]", sortId: 32 },
            { id: 70033, name: "07-02_[20x28]_[49]_[Aztec]", sortId: 33 },
            { id: 70034, name: "06-30_[27x28]_[57]_[Loopy, Snake]", sortId: 34 },
            { id: 70035, name: "07-02_[20x27]_[53]_[Basic, Aztec, Aztec]", sortId: 35 },
            { id: 70036, name: "07-02_[28x45]_[136]_[Spaghetti, Aztec]", sortId: 36 },
            { id: 70037, name: "06-30_[42x45]_[167]_[Loopy, Snake]", sortId: 37 },
            { id: 70038, name: "07-02_[20x31]_[42]_[Basic]", sortId: 38 },
            { id: 70039, name: "07-02_[29x37]_[111]_[Basic, Snake]", sortId: 39 },
            { id: 70040, name: "07-02_[29x44]_[125]_[Loopy, Country]", sortId: 40 },
            { id: 70041, name: "07-02_[29x46]_[146]_[Aztec, Basic]", sortId: 41 },
            { id: 70042, name: "07-02_[20x31]_[47]_[Spaghetti, Aztec]", sortId: 42 },
            { id: 70043, name: "06-30_[30x34]_[82]_[Spaghetti, Aztec]", sortId: 43 },
            { id: 70044, name: "07-02_[32x42]_[182]_[Basic, Aztec]", sortId: 44 },
            { id: 70045, name: "07-02_[20x31]_[68]_[Basic, Snake]", sortId: 45 },
            { id: 70046, name: "07-02_[20x31]_[66]_[Basic, Snake]", sortId: 46 },
            { id: 70047, name: "07-02_[20x32]_[52]_[Aztec, Spaghetti]", sortId: 47 },
            { id: 70048, name: "07-02_[21x24]_[39]_[Aztec]", sortId: 48 },
            { id: 70049, name: "07-02_[30x41]_[112]_[Snake, Basic]", sortId: 49 },
            { id: 70050, name: "07-02_[20x32]_[60]_[Basic, Snake]", sortId: 50 },
            { id: 70051, name: "07-02_[20x32]_[61]_[Basic, Aztec, Aztec]", sortId: 51 },
            { id: 70052, name: "07-02_[20x32]_[63]_[Basic, Snake]", sortId: 52 },
            { id: 70053, name: "07-02_[32x47]_[166]_[Basic, Snake]", sortId: 53 },
            { id: 70054, name: "07-02_[29x48]_[129]_[Aztec, Basic]", sortId: 54 },
            { id: 70055, name: "07-02_[30x35]_[126]_[Basic, Aztec]", sortId: 55 },
            { id: 70056, name: "07-02_[22x23]_[52]_[Aztec, Spaghetti]", sortId: 56 },
            { id: 70057, name: "07-02_[30x41]_[126]_[Snake, Basic]", sortId: 57 },
            { id: 70058, name: "07-02_[32x47]_[187]_[Basic, Snake]", sortId: 58 },
            { id: 70059, name: "07-02_[20x32]_[75]_[Basic, Snake]", sortId: 59 },
            { id: 70060, name: "07-02_[20x32]_[71]_[Basic, Snake]", sortId: 60 },
            { id: 70061, name: "07-02_[22x26]_[49]_[Aztec, Basic]", sortId: 61 },
            { id: 70062, name: "07-02_[20x32]_[69]_[Basic, Snake]", sortId: 62 },
            { id: 70063, name: "07-02_[30x41]_[113]_[Snake, Basic]", sortId: 63 },
            { id: 70064, name: "07-02_[30x41]_[133]_[Basic, Snake]", sortId: 64 },
            { id: 70065, name: "07-02_[30x41]_[148]_[Snake, Basic]", sortId: 65 },
            { id: 70066, name: "07-02_[30x41]_[143]_[Snake, Basic]", sortId: 66 },
            { id: 70067, name: "07-02_[22x26]_[64]_[Aztec, Spaghetti]", sortId: 67 },
            { id: 70068, name: "07-02_[22x29]_[55]_[Aztec, Basic]", sortId: 68 },
            { id: 70069, name: "07-02_[30x41]_[136]_[Basic, Snake]", sortId: 69 },
            { id: 70070, name: "07-02_[20x32]_[84]_[Basic, Snake]", sortId: 70 },
            { id: 70071, name: "07-02_[21x29]_[71]_[Aztec, Spaghetti]", sortId: 71 },
            { id: 70072, name: "07-02_[32x49]_[186]_[Basic, Snake]", sortId: 72 },
            { id: 70073, name: "07-02_[20x33]_[80]_[Basic, Aztec, Basic]", sortId: 73 },
            { id: 70074, name: "07-02_[23x23]_[48]_[Country, Loopy]", sortId: 74 },
            { id: 70075, name: "07-02_[30x42]_[109]_[Basic, Snake]", sortId: 75 },
            { id: 70076, name: "07-02_[21x34]_[66]_[Loopy]", sortId: 76 },
            { id: 70077, name: "07-02_[30x47]_[117]_[Loopy]", sortId: 77 },
            { id: 70078, name: "07-02_[21x34]_[65]_[Loopy]", sortId: 78 },
            { id: 70079, name: "07-02_[30x49]_[157]_[Aztec, Spaghetti]", sortId: 79 },
            { id: 70080, name: "07-02_[33x50]_[187]_[Basic, Snake]", sortId: 80 },
            { id: 70081, name: "07-02_[23x23]_[55]_[Country, Loopy]", sortId: 81 },
            { id: 70082, name: "07-02_[21x30]_[79]_[Basic, Basic]", sortId: 82 },
            { id: 70083, name: "07-02_[31x31]_[130]_[Basic, Snake]", sortId: 83 },
            { id: 70084, name: "07-02_[21x34]_[72]_[Loopy]", sortId: 84 },
            { id: 70085, name: "07-02_[21x34]_[67]_[Loopy]", sortId: 85 },
            { id: 70086, name: "07-02_[23x29]_[39]_[Loopy]", sortId: 86 },
            { id: 70087, name: "07-02_[31x31]_[126]_[Basic, Snake]", sortId: 87 },
            { id: 70088, name: "07-02_[22x23]_[53]_[Snake, Spaghetti]", sortId: 88 },
            { id: 70089, name: "07-02_[23x23]_[60]_[Country, Loopy]", sortId: 89 },
            { id: 70090, name: "07-02_[30x50]_[110]_[Snake, Aztec]", sortId: 90 },
            { id: 70091, name: "07-02_[33x53]_[182]_[Spaghetti, Spaghetti]", sortId: 91 },
            { id: 70092, name: "07-02_[31x40]_[132]_[Aztec, Spaghetti]", sortId: 92 },
            { id: 70093, name: "07-02_[34x52]_[188]_[Basic]", sortId: 93 },
            { id: 70094, name: "07-02_[22x26]_[70]_[Basic, Snake]", sortId: 94 },
            { id: 70095, name: "07-02_[22x27]_[66]_[Basic]", sortId: 95 },
            { id: 70096, name: "07-02_[31x31]_[139]_[Basic, Snake]", sortId: 96 },
            { id: 70097, name: "07-02_[31x39]_[151]_[Basic, Aztec]", sortId: 97 },
            { id: 70098, name: "07-02_[23x29]_[43]_[Loopy]", sortId: 98 },
            { id: 70099, name: "07-02_[22x27]_[72]_[Aztec, Basic]", sortId: 99 },
            { id: 70100, name: "07-02_[23x29]_[54]_[Basic, Aztec]", sortId: 100 },
        ]
        console.log("MapSystem.mapConfig", mapConfig);
        MapSystem.mapConfig = mapConfig;

        this.loadMapData(LevelSystem.I.getCurrPass());
    }

    // 缓存获取单关数据
    // public static async getMapData(levelId: number): Promise<IMapData> {
    //     console.log("Load level :", levelId);
    //     let mapId = levelId;
    //     if (mapId >= 100) {
    //         mapId = 99;
    //     }
    //     console.log("Load Map :", mapId);
    //     let mapData = MapSystem.mapConfig[mapId];
    //     console.log("Load Map :", mapData);

    //     let url = `data/${mapData.name}`;
    //     console.log("Load map :", url);
    //     await AssetsDB.load([url], JsonAsset, null, RES_NAME);
    //     let data = AssetsDB.get<JsonAsset>(url, RES_NAME).json;
    //     console.log("MapData", data);

    //     let arrows = [];
    //     for (let i = 0; i < data.Arrows.length; i++) {
    //         const arrow = data.Arrows[i];
    //         const item = { dir: null, color: 0, points: [] };
    //         if (arrow.Dx == -1 && arrow.Dy == 0) {
    //             // 左
    //             item.dir == ArrowDirection.LEFT;
    //         } else if (arrow.Dx == 0 && arrow.Dy == -1) {
    //             // 下
    //             item.dir == ArrowDirection.Down;
    //         } else if (arrow.Dx == 1 && arrow.Dy == 0) {
    //             // 右
    //             item.dir == ArrowDirection.RIGHT;
    //         } else if (arrow.Dx == 0 && arrow.Dy == 1) {
    //             // 上
    //             item.dir == ArrowDirection.UP;
    //         }
    //         item.color = (i % 8) + 1;
    //         for (let j = 0; j < arrow.Indices.length; j++) {
    //             const x = arrow.Indices[j] % data.XSize;
    //             const y = Math.floor(arrow.Indices[j] / data.XSize);
    //             item.points.push({ x: x, y: y });
    //         }
    //         arrows.push(item);
    //     }
    //     return {
    //         width: data.XSize, // 地图宽度
    //         height: data.YSize, // 地图高度
    //         time: 480, // 游戏时间
    //         arrows: arrows,
    //     }
    // }

    public static loadMapData(levelId: number) {
        console.log("Load level :", levelId);
        // let url = `data/${"test"}`;
        let url = `data/${MapSystem.mapConfig[levelId].name}`;
        console.log("Load map :", url);
        AssetsDB.load([url], JsonAsset, null, RES_NAME);
    }

    public static getMapData(levelId: number): IMapData {
        console.log("Load level :", levelId);

        // let url = `data/${"test"}`;
        let url = `data/${MapSystem.mapConfig[levelId].name}`;
        console.log("Load map :", url);
        let data = AssetsDB.get<JsonAsset>(url, RES_NAME).json;
        console.log("MapData", data);

        let arrows = [];
        for (let i = 0; i < data.Arrows.length; i++) {
            const arrow = data.Arrows[i];
            const item = { dir: null, color: 0, points: [] };
            if (arrow.Dx == -1 && arrow.Dy == 0) {
                // 左
                item.dir = ArrowDirection.LEFT;
            } else if (arrow.Dx == 0 && arrow.Dy == -1) {
                // 下
                item.dir = ArrowDirection.Down;
            } else if (arrow.Dx == 1 && arrow.Dy == 0) {
                // 右
                item.dir = ArrowDirection.RIGHT;
            } else if (arrow.Dx == 0 && arrow.Dy == 1) {
                // 上
                item.dir = ArrowDirection.UP;
            }
            item.color = (i % 7) + 1;
            for (let j = 0; j < arrow.Indices.length; j++) {
                const x = arrow.Indices[j] % data.XSize;
                const y = Math.floor(arrow.Indices[j] / data.XSize);
                item.points.push({ x: x, y: y });
            }
            arrows.push(item);
        }
        return {
            width: data.XSize, // 地图宽度
            height: data.YSize, // 地图高度
            time: 480, // 游戏时间
            arrows: arrows,
        }
    }
}


