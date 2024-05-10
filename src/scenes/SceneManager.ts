import {Engine, DeviceSourceManager} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';

import { GameScene } from '../interfaces/GameScene';

export class SceneManager {
    currentSceneId: string;
    scenes: Map<string, GameScene>;
    engine: Engine;
    deviceSourceManager: DeviceSourceManager;

    constructor(private canvas: HTMLCanvasElement){
        this.engine = new Engine(this.canvas, true);
        this.scenes = new Map<string, GameScene>();

        this.currentSceneId = "";

        this.deviceSourceManager = new DeviceSourceManager(this.engine);

        this.deviceSourceManager.onDeviceConnectedObservable.add((device) => {
            console.log(device);
        });

        this.engine.runRenderLoop(() => {
            /*if (this.deviceSourceManager.getDeviceSource(DeviceType.Keyboard)) {
                console.log("keyboard");
            }*/
            if(this.currentSceneId !== ""){
                if(this.scenes.has(this.currentSceneId)){
                    const currentScene = this.scenes.get(this.currentSceneId);
                    currentScene?.Update(this.deviceSourceManager);
                }else{
                    console.error("Scene Not Found : " + this.currentSceneId);
                }
            }
        });
    }

    RegisterScene(id: string, scene: GameScene): void {
        scene.Init(this.engine);
        this.scenes.set(id, scene);
    }

    Jump(id: string): void{
        this.currentSceneId = id;
    }
}