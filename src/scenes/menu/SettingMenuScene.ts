import {ActionManager, AnimationGroup, ExecuteCodeAction, Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, Mesh, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "../SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";

import {AdvancedDynamicTexture, StackPanel, TextBlock, Button, Control} from "@babylonjs/gui";
import { MenuOptions } from "@/utils/MenuOption";

export class SettingMenuScene implements GameScene {
    scene!: Scene;
    engine!: Engine;
    keyboardShape!: string;

    constructor() {
        const ks = localStorage.getItem('KEYBOARD_SHAPE');
        if(ks==null){
            this.keyboardShape = "AZERTY";
        }else{
            this.keyboardShape = ks;
        }
        console.log(this.keyboardShape);
    }

    Init(sceneManager: SceneManager): void {
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

        const dropdownA = new MenuOptions(advancedTexture, "Clavier / Keyboard Shape", 180, 40, "orange", "green", Control.VERTICAL_ALIGNMENT_CENTER, Control.HORIZONTAL_ALIGNMENT_CENTER);
        dropdownA.top = "10px";
        dropdownA.left = "10px";
        dropdownA.addOption("opt1", "AZERTY", () => {
            this.keyboardShape = "AZERTY";
        });
        dropdownA.addOption("opt2","QWERTY", () => {
            this.keyboardShape = "QWERTY";
        });

        const button1 = Button.CreateSimpleButton("but1", "Sauvegarder");
        button1.width = 0.2;
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.color = "Orange";
        button1.thickness = 4;
        button1.background = "green";
        button1.onPointerUpObservable.add(() => {
            console.log(this.keyboardShape);
            localStorage.setItem('KEYBOARD_SHAPE', this.keyboardShape);
        });

        advancedTexture.addControl(button1);

        return scene;
    }
}