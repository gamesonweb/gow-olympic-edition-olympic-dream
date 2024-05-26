import { SceneManager } from "@/scenes/SceneManager"
import { DeviceSourceManager, Engine, Scene } from "@babylonjs/core"
import { AbstractInputManager } from "@/inputs/AbstractInputManager"

export interface GameScene {
    Init(sceneManage: SceneManager): void
    Update(eventManage: AbstractInputManager): void
    GetScene(): Scene
}