import {Engine, DeviceSourceManager} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';

import { GameScene } from '../interfaces/GameScene';
import HavokPhysics from "@babylonjs/havok";
import { HavokPhysicsWithBindings } from "@babylonjs/havok";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";

export class SceneManager {
    currentSceneId: string;
    lastCurrentSceneId: string;
    scenes: Map<string, GameScene>;
    engine: Engine;
    abstractDeviceSourceManager: AbstractInputManager;
    hk!: HavokPhysicsWithBindings;
    

    constructor(private canvas: HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scenes = new Map<string, GameScene>();

        this.currentSceneId = "";
        this.lastCurrentSceneId = "";

        this.abstractDeviceSourceManager = new AbstractInputManager(this.engine);

        this.engine.runRenderLoop(() => {
            /*if (this.deviceSourceManager.getDeviceSource(DeviceType.Keyboard)) {
                console.log("keyboard");
            }*/
            if(this.currentSceneId !== ""){
                if(this.scenes.has(this.currentSceneId)){
                    if(this.scenes.has(this.lastCurrentSceneId) && this.currentSceneId != this.lastCurrentSceneId){
                        const lastScene = this.scenes.get(this.lastCurrentSceneId);
                        lastScene?.Revoke();
                        this.lastCurrentSceneId = "";
                    }
                    const currentScene = this.scenes.get(this.currentSceneId);
                    this.lastCurrentSceneId = this.currentSceneId;
                    currentScene?.Invoke();
                    currentScene?.Update(this.abstractDeviceSourceManager);
                }else{
                    console.error("Scene Not Found : " + this.currentSceneId);
                }
            }
        });
    }

    async InitPhysic(): Promise<void> {
        this.hk = await HavokPhysics();
    }

    RegisterScene(id: string, scene: GameScene): void {
        scene.Init(this);
        this.scenes.set(id, scene);
    }

    Jump(id: string): void{
        this.currentSceneId = id;
    }

    GetEngine(): Engine{
        return this.engine;
    }

    GetPhysic(): HavokPhysicsWithBindings{
        return this.hk;
    }
}