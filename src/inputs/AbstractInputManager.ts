import { DeviceSourceManager, DeviceType, Engine } from "@babylonjs/core";
import { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager";

export class AbstractInputManager{
    engine: Engine;
    dsm: DeviceSourceManager;
    applicableSource: DeviceSourceType[];
    index_source: number;
    last_time_event: number;
    delay_input: number;

    constructor(engine: Engine, delay_input = 50){
        this.engine = engine;
        this.dsm = new DeviceSourceManager(engine);
        this.applicableSource = [];
        this.index_source = -1;
        this.last_time_event = -1;
        this.delay_input = delay_input;

        this.dsm.onDeviceConnectedObservable.add((device) => {
            this.applicableSource.push(device);

            this.applicableSource.forEach((value, number) => {
                if(value.deviceType == DeviceType.Keyboard){
                    this.index_source = number;
                }
            });
        });

        this.dsm.onDeviceDisconnectedObservable.add((device) => {
            this.applicableSource = this.applicableSource.filter((e) => {
                return e.deviceType != device.deviceType && e.deviceSlot != device.deviceSlot 
            });
        });
    }

    GetUp(){
        if(this.index_source >= 0){
            const detect = this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(90) == 1;
            return detect;
        }

        return false;
    }

    GetDown(){
        if(this.index_source >= 0){
            const detect = this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(83) == 1;
            return detect;
        }

        return false;
    }

    GetLeft(){
        if(this.index_source >= 0){
            const detect = this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(81) == 1;
            return detect;
        }

        return false;
    }

    GetRight(){
        if(this.index_source >= 0){
            const detect = this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(68) == 1;
            return detect;
        }

        return false;
    }

    GetJump(){
        if(this.index_source >= 0){
            const detect = this.dsm.getDeviceSource(DeviceType.Keyboard)?.getInput(32) == 1;
            return detect;
        }

        return false;
    }

    ActionDelta(){
        this.last_time_event = this.GetTime();
    }

    CheckDelta(){
        return (this.last_time_event == -1 || this.GetTime() - this.last_time_event > this.delay_input);
    }

    GetTime(){
        return new Date().getTime();
    }
}