import {ActionManager, AnimationGroup, ExecuteCodeAction, Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, Mesh, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "./SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";

export class BasicScene implements GameScene {
    scene!: Scene;
    engine!: Engine;

    hero!: AbstractMesh;

    walkingAnim!: AnimationGroup;
    idleAnim!: AnimationGroup;
    jumpAnim!: AnimationGroup;
    animating!: boolean;

    loaded!: boolean;

    constructor(){
        this.loaded = false;
    }

    Init(sceneManager: SceneManager): void {
        this.engine = sceneManager.GetEngine();
        this.scene = this.CreateScene();

        this.animating = true;
    }

    Update(eventManage: AbstractInputManager): void {
        if(this.loaded){
            const heroSpeed = 0.04;
            const heroRotationSpeed = 0.1;

            let keydown = false;
            let jump = false;

            if (eventManage.GetUp()) {
                if(eventManage.CheckDelta()){
                    this.hero.moveWithCollisions(this.hero.forward.scaleInPlace(heroSpeed));
                    eventManage.ActionDelta();
                }
                keydown = true;
            }
            if (eventManage.GetLeft()) {
                if(eventManage.CheckDelta()){
                    this.hero.rotate(Vector3.Up(), -heroRotationSpeed);
                    eventManage.ActionDelta();
                }
                keydown = true;
            }
            if (eventManage.GetRight()) {
                if(eventManage.CheckDelta()){
                    this.hero.rotate(Vector3.Up(), heroRotationSpeed);
                    eventManage.ActionDelta();
                }
                keydown = true;
            }
            if (eventManage.GetJump()) {
                if(eventManage.CheckDelta()){
                    eventManage.ActionDelta();
                }
                jump = true;
            }

            if(jump){
                if (!this.animating) {
                    this.animating = true;
                    this.jumpAnim.start(false, 1.0, this.jumpAnim.from, this.jumpAnim.to, false);
                    this.jumpAnim.onAnimationGroupEndObservable.addOnce(() => {
                        this.animating = false;
                        jump = false;
                    });
                }
            }

            if (keydown) {
                if (!this.animating) {
                    this.animating = true;
                    this.walkingAnim.start(true, 1.0, this.walkingAnim.from, this.walkingAnim.to, false);
                }
            }
            else {
                if (this.animating) {    
                    this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
                    this.walkingAnim.stop();
                    this.animating = false;
                }
            }
        }
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

        SceneLoader.ImportMesh("", "./models/", "main.glb", scene,  (newMeshes, particleSystems, skeletons, animationGroups) => {
            this.hero = newMeshes[0];

            //Scale the model down
            this.hero.scaling.scaleInPlace(0.1);

            //Lock camera on the character
            camera.target = this.hero.position;

            //Get the Samba animation Group
            this.idleAnim = scene.getAnimationGroupByName("Idle")!;
            this.walkingAnim = scene.getAnimationGroupByName("Walking")!;
            this.jumpAnim = scene.getAnimationGroupByName("Jump")!;
            this.loaded = true;
        });

        return scene;
    }
}