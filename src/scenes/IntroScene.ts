import {Scene, Sound, Engine, Mesh, StandardMaterial, VideoTexture, Color3, FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button} from "@babylonjs/gui";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";
import { SceneManager } from "./SceneManager";
import { AbstractInputManager } from "@/inputs/AbstractInputManager";

export class IntroScene implements GameScene {
    scene!: Scene;
    engine!: Engine;
    sceneManager!: SceneManager;

    Init(sceneManager: SceneManager): void {
        this.sceneManager = sceneManager;
        this.engine = sceneManager.GetEngine();
        this.scene = this.CreateScene();
    }

    Update(eventManager: AbstractInputManager): void {
        /*if (eventManager.getDeviceSource(DeviceType.Keyboard)) {
            if(eventManager.getDeviceSource(DeviceType.Keyboard)?.getInput(90) == 1){
                
            }
        }*/

        this.scene.render();
    }

    GetScene(): Scene {
        return this.scene;
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        const camera = new FreeCamera("camera", new Vector3(0, 0, -5.5), this.scene);
        //camera.attachControl();

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        hemiLight.intensity = 0.5;

        const planeOpts = {
			height: 5.4762, 
			width: 7.3967, 
			sideOrientation: Mesh.DOUBLESIDE
        };
        const ANote0Video = MeshBuilder.CreatePlane("plane", planeOpts, scene);
        const vidPos = (new Vector3(0,0,0.1))
        ANote0Video.position = vidPos;
        const ANote0VideoMat = new StandardMaterial("m", scene);
        const ANote0VideoVidTex = new VideoTexture("vidtex","./videos/AE33CA75-8EE6-439F-8EF8-3EB03C6F225E.mp4", scene);
        const VidElement = ANote0VideoVidTex.video;

        const music = new Sound("Music", "./videos/AE33CA75-8EE6-439F-8EF8-3EB03C6F225E.mp3", scene, null, {loop: false, autoplay: false});

        VidElement.loop = false;
        VidElement.addEventListener('ended', () => {
            music.stop();
            this.sceneManager.Jump("main");
        });

        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        const button1 = Button.CreateSimpleButton("but1", "Démarrer");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            if (Engine.audioEngine?.audioContext?.state === 'suspended') {
                Engine.audioEngine.audioContext.resume().then(() => {
                    music.play();
                    ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
                    //ANote0VideoMat.roughness = 1;
                    ANote0VideoMat.emissiveColor = Color3.White();
                    ANote0Video.material = ANote0VideoMat;
                    button1.isEnabled = false;
                    button1.isVisible = false;
                });
            } else {
                ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
                //ANote0VideoMat.roughness = 1;
                ANote0VideoMat.emissiveColor = Color3.White();
                ANote0Video.material = ANote0VideoMat;
                music.play();
                button1.isEnabled = false;
                button1.isVisible = false;
            }
            music.play();
        });
        advancedTexture.addControl(button1);

        return scene;
    }
}