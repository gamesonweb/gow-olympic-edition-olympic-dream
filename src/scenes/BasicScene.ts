import {Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";

export class BasicScene implements GameScene {
    scene!: Scene;
    engine!: Engine;

    Init(engine: Engine): void {
        this.engine = engine;
        this.scene = this.CreateScene();
    }

    Update(eventManage: DeviceSourceManager): void {
        this.scene.render();
    }

    GetScene(): Scene {
        return this.scene;
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
        //camera.attachControl();

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        hemiLight.intensity = 0.5;

        const ground = MeshBuilder.CreateGround("ground", {
            width:10,
            height:10
        },this.scene);

        SceneLoader.ImportMesh("", "./models/", "main.glb", scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
            const hero = newMeshes[0];

            //Scale the model down
            hero.scaling.scaleInPlace(0.1);

            //Lock camera on the character
            camera.target = hero.position;

            //Get the Samba animation Group
            const idleAnim = scene.getAnimationGroupByName("Idle");

            if(idleAnim){
                //Play the Samba animation
                idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);
            }
        });

        return scene;
    }
}