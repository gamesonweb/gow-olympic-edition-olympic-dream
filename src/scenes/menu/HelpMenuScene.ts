import {ActionManager, AnimationGroup, ExecuteCodeAction, Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, Mesh, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "../SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";


import {AdvancedDynamicTexture, StackPanel, TextBlock, Button, Control} from "@babylonjs/gui";

export class HelpMenuScene implements GameScene {
    scene!: Scene;
    engine!: Engine;
    sceneManager!: SceneManager;

    Init(sceneManager: SceneManager): void {
        this.sceneManager = sceneManager;
        this.engine = sceneManager.GetEngine();
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
        //camera.attachControl();

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        hemiLight.intensity = 0.5;

        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const textblock = new TextBlock();
        textblock.text = "Olympic Dream - Aide\n\nClavier / Keyboard : \n\nAvancer / Forward : Z / W\nTourner à gauche / Turn Left : Q / A\nTourner à droite / Turn Right : d\nSauter / Jump : Espace / Space\nIntéragir / Interact : E";
        textblock.fontSize = 24;
        textblock.color = "white";

        const buttonRet = Button.CreateSimpleButton("butRet", "Retour");
        buttonRet.width = 0.2;
        buttonRet.height = "40px";
        buttonRet.color = "white";
        buttonRet.cornerRadius = 20;
        buttonRet.color = "Orange";
        buttonRet.thickness = 4;
        buttonRet.background = "green";
        buttonRet.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        buttonRet.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        buttonRet.onPointerUpObservable.add(() => {
            this.sceneManager.Jump('menu_main');
        });

        advancedTexture.addControl(textblock);
        advancedTexture.addControl(buttonRet);

        return scene;
    }
}