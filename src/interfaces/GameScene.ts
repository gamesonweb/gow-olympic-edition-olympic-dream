import { DeviceSourceManager, Engine, Scene } from "@babylonjs/core"

export interface GameScene {
    Init(engine: Engine): void
    Update(eventManage: DeviceSourceManager): void
    GetScene(): Scene
}