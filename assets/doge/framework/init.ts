import { Asset } from "cc";
import { LoadCallback } from "./loader/DogeAssetsLoader";
import { PRE_PREFABS } from "./constant/Constant";
import { AssetsDB } from "./common/AssetsDB";

export { DogeToast as Toast } from "./ui/DogeToast";
export { DogeAssetsLoader as Loader } from "./loader/DogeAssetsLoader";
export { default as SceneLoader } from "./loader/DogeSceneLoader";

export class DogeFrawmwork {
    public static async init(callback?: LoadCallback) {
        // 加载prefabs
        await AssetsDB.load(Object.values(PRE_PREFABS), Asset, callback);
    }
}


