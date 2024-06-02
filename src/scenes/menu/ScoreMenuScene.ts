import {ActionManager, AnimationGroup, ExecuteCodeAction, Scene, Engine, SceneLoader, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager, Mesh, AbstractMesh} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "../SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";
import {AdvancedDynamicTexture, StackPanel, TextBlock, Button, Control} from "@babylonjs/gui";

export class ScoreMenuScene extends GameScene {
    engine!: Engine;
    sceneManager!: SceneManager;
    textblock!: TextBlock;

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

        this.textblock = new TextBlock();
        this.textblock.text = "Olympic Dream - Score\n\n";
        this.textblock.fontSize = 24;
        this.textblock.color = "white";
        this.textblock.resizeToFit = true;

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

        const buttonRef = Button.CreateSimpleButton("butRef", "Refresh");
        buttonRef.width = 0.2;
        buttonRef.height = "40px";
        buttonRef.color = "white";
        buttonRef.cornerRadius = 20;
        buttonRef.color = "Orange";
        buttonRef.thickness = 4;
        buttonRef.background = "green";
        buttonRef.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        buttonRef.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        buttonRef.onPointerUpObservable.add(() => {
            this.FetchScore();
        });

        advancedTexture.addControl(this.textblock);
        advancedTexture.addControl(buttonRet);
        advancedTexture.addControl(buttonRef);

        this.FetchScore();

        return scene;
    }

    FetchScore(): void {
        fetch('https://backend.gow.valoriatechnologia.com/records/').then((resp) => {
            resp.json().then((data) => {
                console.log(data);
                let dataStr = "Olympic Dream - Score\n\nUsername - Stage - Score\n";
                data.forEach((element:any) => {
                    dataStr = dataStr + element.username + " - " + element.stage + " - " + element.score + "\n";
                });
                this.textblock.text = dataStr;
            }).catch((err)  => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}