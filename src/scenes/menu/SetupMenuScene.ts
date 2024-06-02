import {ActionManager, AnimationGroup, ExecuteCodeAction, Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, Mesh, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "../SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";
import {AdvancedDynamicTexture, StackPanel, TextBlock, Button, Control, InputText} from "@babylonjs/gui";

export class SetupMenuScene extends GameScene {
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

        const input = new InputText();
        input.width = 0.2;
        input.maxWidth = 0.2;
        input.height = "40px";
        input.text = "Your username";
        input.color = "white";
        input.background = "green";

        const button1 = Button.CreateSimpleButton("but1", "Jouer");
        button1.width = 0.2;
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.color = "Orange";
        button1.thickness = 4;
        button1.background = "green";
        button1.onPointerUpObservable.add(() => {
            if(this.isInvoke){
                if(input.text == ""){
                    alert("Empty username !");
                }else{
                    console.log("Username: " + input.text);
                    localStorage.setItem('USERNAME', input.text);
                    this.sceneManager.Jump('intro');
                }
            }
        });

        panel.addControl(input);
        panel.addControl(button1);
        advancedTexture.addControl(buttonRet);

        return scene;
    }
}