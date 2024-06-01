import {Scene,AnimationGroup, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, AssetsManager, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "../SceneManager";
import { PhysicsEngine, HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core/Physics";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";
import {AdvancedDynamicTexture, StackPanel, TextBlock, Button, Control} from "@babylonjs/gui";

export class BowChallengeScene implements GameScene {
    sceneManager!: SceneManager;
    scene!: Scene;
    engine!: Engine;

    heroMesh!: AbstractMesh;

    walkingAnim!: AnimationGroup;
    idleAnim!: AnimationGroup;
    jumpAnim!: AnimationGroup;
    animating!: boolean;

    loaded!: boolean;

    camera!: FreeCamera;

    end: Vector3;

    constructor() {
        this.loaded = false;
        this.end = new Vector3(-1.2459694038785414,0, -9.979610320998791);
    }

    Init(sceneManager: SceneManager): void {
        this.engine = sceneManager.GetEngine();
        this.sceneManager = sceneManager;
        this.scene = this.CreateScene();
    }

    Update(eventManage: AbstractInputManager): void {
        if(this.loaded){
            const heroSpeed = 0.04;
            const heroRotationSpeed = 0.1;

            let keydown = false;
            let jump = false;

            if (eventManage.GetUp()) {
                if(eventManage.CheckDelta()){
                    this.heroMesh.moveWithCollisions(this.heroMesh.forward.scaleInPlace(heroSpeed));
                    eventManage.ActionDelta();
                }
                keydown = true;
            }
            if (eventManage.GetLeft()) {
                if(eventManage.CheckDelta()){
                    this.heroMesh.rotate(Vector3.Up(), -heroRotationSpeed);
                    eventManage.ActionDelta();
                }
                keydown = true;
            }
            if (eventManage.GetRight()) {
                if(eventManage.CheckDelta()){
                    this.heroMesh.rotate(Vector3.Up(), heroRotationSpeed);
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
                    console.log(this.heroMesh.position);
                    eventManage.ActionDelta();
                }
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
                if(this.heroMesh.position.subtract(this.end).length() < 0.8){
                    this.sceneManager.Jump('end');
                }
                this.camera.target = this.heroMesh.position;
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
        this.camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
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

        const mapTask = assetsManager.addMeshTask("target", "", "./models/", "map_game_1.glb");
        const heroTask = assetsManager.addMeshTask("bow", "", "./models/", "main.glb");

        assetsManager.load();

        assetsManager.onFinish = (tasks) => {
            const mapMesh = mapTask.loadedMeshes[0];
            this.heroMesh = heroTask.loadedMeshes[0];

            this.heroMesh.scaling.scaleInPlace(0.05);
            mapMesh.scaling.scaleInPlace(50);

            this.idleAnim = scene.getAnimationGroupByName("Idle")!;
            this.walkingAnim = scene.getAnimationGroupByName("Run")!;
            this.jumpAnim = scene.getAnimationGroupByName("Jump")!;

           /* const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

            sphere.position.y = 4;*/

            /*const ground = MeshBuilder.CreateGround("ground", {
                width:10,
                height:10
            },this.scene);*/

            this.camera.target = this.heroMesh.position;

            this.loaded = true;

            //const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);

           // const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
        };

        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const textblock = new TextBlock();
        textblock.text = "Courez jusqu'à la cible !";
        textblock.fontSize = 24;
        textblock.color = "white";

        advancedTexture.addControl(textblock);

        return scene;
    }
}