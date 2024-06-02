import { SceneManager } from "@/scenes/SceneManager"
import { DeviceSourceManager, Engine, Scene } from "@babylonjs/core"
import { AbstractInputManager } from "@/inputs/AbstractInputManager"

export abstract class GameScene {
    scene!: Scene;
    isInvoke: boolean

    constructor(){
        this.isInvoke = false;
    }

    abstract Init(sceneManage: SceneManager): void
    abstract Update(eventManage: AbstractInputManager): void
    
    GetScene(): Scene {
        return this.scene;
    }

    Invoke(): void {
        this.isInvoke = true;
    }

    Revoke(): void {
        this.isInvoke = false;
    }
}