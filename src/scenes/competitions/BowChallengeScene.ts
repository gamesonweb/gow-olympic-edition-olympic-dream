import {Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, AssetsManager} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "../SceneManager";
import { PhysicsEngine, HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core/Physics";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";

export class BowChallengeScene implements GameScene {
    sceneManager!: SceneManager;
    scene!: Scene;
    engine!: Engine;

    Init(sceneManager: SceneManager): void {
        this.engine = sceneManager.GetEngine();
        this.sceneManager = sceneManager;
        this.scene = this.CreateScene();
    }

    Update(eventManage: AbstractInputManager): void {
        this.scene.render();
    }

    GetScene(): Scene {
        return this.scene;
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 1, -5), this.scene);
        camera.attachControl();

        const assetsManager = new AssetsManager(scene);

        const havokPlugin = new HavokPlugin(true, this.sceneManager.GetPhysic());

        scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        hemiLight.intensity = 0.5;

        const arrowTeacher = assetsManager.addMeshTask("arrow", "", "./models/", "untitled.glb");
        //assetsManager.addMeshTask("target", "", "./models/", "Archer_Target.glb");

        assetsManager.load();

        assetsManager.onFinish = (tasks) => {
            const arrowMesh = arrowTeacher.loadedMeshes[0];

            arrowMesh.scaling.scaleInPlace(0.01);

           /* const sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

            sphere.position.y = 4;*/

            const ground = MeshBuilder.CreateGround("ground", {
                width:10,
                height:10
            },this.scene);

            camera.target = arrowMesh.position;

            //const sphereAggregate = new PhysicsAggregate(sphere, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, scene);

            const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
        };

        return scene;
    }
}