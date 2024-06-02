import {ActionManager, TransformNode, AnimationGroup, AssetsManager, Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, Mesh, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "./SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";
import { PhysicsEngine, HavokPlugin, PhysicsAggregate, PhysicsShapeType, PhysicsImpostor } from "@babylonjs/core/Physics";
import {AdvancedDynamicTexture, StackPanel, TextBlock, Button, Control} from "@babylonjs/gui";

export class BasicScene extends GameScene {
    engine!: Engine;

    hero!: AbstractMesh;
    ath!: AbstractMesh;

    walkingAnim!: AnimationGroup;
    idleAnim!: AnimationGroup;
    jumpAnim!: AnimationGroup;
    animating!: boolean;

    loaded!: boolean;

    sceneManager!: SceneManager;
    camera!: FreeCamera;
    textblock!: TextBlock;
    dialog: boolean;

    constructor(){
        super();
        this.loaded = false;
        this.dialog = false;
    }

    Init(sceneManager: SceneManager): void {
        this.sceneManager = sceneManager;
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
            if(eventManage.GetAction()){
                if(eventManage.CheckDelta()){
                    const dist = this.hero.position.subtract(this.ath.position).length();
                    if(dist < 0.7 && this.dialog){
                        this.sceneManager.Jump("challenge_bow");
                    }
                    eventManage.ActionDelta();
                }
            }

            const dist = this.hero.position.subtract(this.ath.position).length();
            if(dist < 0.7){
                this.textblock.text = "Pour que j'accepte de prendre la flamme.\nTu dois d'abord finir mon épreuve de course !\n(Press E to start)";
                this.dialog = true;
            }

            if(dist > 1){
                this.textblock.text = "";
                this.dialog = false;
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
                this.camera.target = this.hero.position;
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
        this.camera = new FreeCamera("camera", new Vector3(6, 4, -2), this.scene);
        this.camera.attachControl();

        const assetsManager = new AssetsManager(scene);

        const havokPlugin = new HavokPlugin(true, this.sceneManager.GetPhysic());

        scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        hemiLight.intensity = 0.5;

        const playerTask = assetsManager.addMeshTask("play", "", "./models/", "main.glb");
        const mapTask = assetsManager.addMeshTask("map", "", "./models/", "map.glb");
        const athTask = assetsManager.addMeshTask("map", "", "./models/", "key_ath.glb");

        assetsManager.onFinish = (tasks) => {
            this.hero = playerTask.loadedMeshes[0];
            const map = mapTask.loadedMeshes[0];
            this.ath = athTask.loadedMeshes[0];


            //Scale the model down
            this.hero.scaling.scaleInPlace(0.05);

            

            this.ath.scaling.scaleInPlace(0.003);
            this.ath.position = new Vector3(-0.74, 0, -8.45);
            

            this.hero.position = new Vector3(0.5,0,6);

            //Lock camera on the character
            this.camera.target = this.hero.position;

            //Get the Samba animation Group
            this.idleAnim = scene.getAnimationGroupByName("Idle")!;
            this.walkingAnim = scene.getAnimationGroupByName("Walking")!;
            this.jumpAnim = scene.getAnimationGroupByName("Jump")!;

            map.scaling.scaleInPlace(60);

            this.loaded = true;
        };

        assetsManager.load();

        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this.textblock = new TextBlock();
        this.textblock.text = "";
        this.textblock.fontSize = 24;
        this.textblock.color = "black";
        this.textblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.textblock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.textblock.resizeToFit = true;

        advancedTexture.addControl(this.textblock);

        return scene;
    }
}