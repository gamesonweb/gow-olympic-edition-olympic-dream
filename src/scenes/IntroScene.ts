import {Scene, Engine, Mesh, StandardMaterial, VideoTexture, Color3,  PointerEventTypes ,FreeCamera, Vector3, HemisphericLight, MeshBuilder, DeviceType, DeviceSourceManager} from "@babylonjs/core";
import "@babylonjs/loaders";

import { Inspector } from '@babylonjs/inspector';
import { GameScene } from "@/interfaces/GameScene";

export class IntroScene implements GameScene {
    scene!: Scene;
    engine!: Engine;

    Init(engine: Engine): void {
        this.engine = engine;
        this.scene = this.CreateScene();
    }

    Update(eventManage: DeviceSourceManager): void {
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

        const planeOpts = {
			height: 5.4762, 
			width: 7.3967, 
			sideOrientation: Mesh.DOUBLESIDE
        };
        const ANote0Video = MeshBuilder.CreatePlane("plane", planeOpts, scene);
        const vidPos = (new Vector3(0,0,0.1))
        ANote0Video.position = vidPos;
        const ANote0VideoMat = new StandardMaterial("m", scene);
        const ANote0VideoVidTex = new VideoTexture("vidtex","./videos/Illustration_sans_titre.mp4", scene);
        ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
        ANote0VideoMat.roughness = 1;
        ANote0VideoMat.emissiveColor = Color3.White();
        ANote0Video.material = ANote0VideoMat;
        scene.onPointerObservable.add(function(evt){
            if(evt.pickInfo){
        if(evt.pickInfo.pickedMesh === ANote0Video){
                //console.log("picked");
                if(ANote0VideoVidTex.video.paused)
                    ANote0VideoVidTex.video.play();
                else
                    ANote0VideoVidTex.video.pause();
                console.log(ANote0VideoVidTex.video.paused?"paused":"playing");
			}
        }
	}, PointerEventTypes.POINTERPICK);

        return scene;
    }
}