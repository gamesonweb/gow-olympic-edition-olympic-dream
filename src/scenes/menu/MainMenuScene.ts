import {ActionManager, AnimationGroup, ExecuteCodeAction, Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, Mesh, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "../SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";

import {AdvancedDynamicTexture, StackPanel, TextBlock, Button} from "@babylonjs/gui";
import { MenuOptions } from "@/utils/MenuOption";

export class MainMenuScene implements GameScene {
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

        const panel = new StackPanel(); 
        panel.spacing = 50;   
        advancedTexture.addControl(panel); 

        const textblock = new TextBlock();
        textblock.text = "Olympic Dream";
        textblock.fontSize = 24;
        textblock.color = "white";

        const button1 = Button.CreateSimpleButton("but1", "Jouer");
        button1.width = 0.2;
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.color = "Orange";
        button1.thickness = 4;
        button1.background = "green";
        button1.onPointerUpObservable.add(() => {
            this.sceneManager.Jump('intro');
        });

        const button2 = Button.CreateSimpleButton("but2", "Paramètres");
        button2.width = 0.2;
        button2.height = "40px";
        button2.color = "white";
        button2.cornerRadius = 20;
        button2.color = "Orange";
        button2.thickness = 4;
        button2.background = "green";
        button2.onPointerUpObservable.add(() => {
            this.sceneManager.Jump('menu_setting');
        });

        const button3 = Button.CreateSimpleButton("but3", "Aides");
        button3.width = 0.2;
        button3.height = "40px";
        button3.color = "white";
        button3.color = "Orange";
        button3.thickness = 4;
        button3.cornerRadius = 20;
        button3.background = "green";
        button3.onPointerUpObservable.add(() => {
            this.sceneManager.Jump('menu_help');
        });

        const button4 = Button.CreateSimpleButton("but1", "Crédits");
        button4.width = 0.2;
        button4.height = "40px";
        button4.color = "white";
        button4.color = "Orange";
        button4.thickness = 4;
        button4.cornerRadius = 20;
        button4.background = "green";
        button4.onPointerUpObservable.add(() => {
            this.sceneManager.Jump('menu_credit');
        });

        panel.addControl(textblock);
        panel.addControl(button1);
        panel.addControl(button2);
        panel.addControl(button3);
        panel.addControl(button4);


        return scene;
    }
}