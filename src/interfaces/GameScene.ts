import { SceneManager } from "@/scenes/SceneManager"
import { DeviceSourceManager, Engine, Scene } from "@babylonjs/core"

export interface GameScene {
    Init(sceneManage: SceneManager): void
    Update(eventManage: DeviceSourceManager): void
    GetScene(): Scene
}