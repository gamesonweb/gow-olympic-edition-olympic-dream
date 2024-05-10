import { DeviceSourceManager, DeviceType, Engine } from "@babylonjs/core";
import { DeviceSourceType } from "@babylonjs/core/DeviceInput/internalDeviceSourceManager";

export class AbstractInputManager{
    engine: Engine;
    dsm: DeviceSourceManager;
    applicableSource: DeviceSourceType[];

    constructor(engine: Engine){
        this.engine = engine;
        this.dsm = new DeviceSourceManager(engine);
        this.applicableSource = [];

        this.dsm.onDeviceConnectedObservable.add((device) => {
            this.applicableSource.push(device);
        });

        this.dsm.onDeviceDisconnectedObservable.add((device) => {
            this.applicableSource = this.applicableSource.filter((e) => {
                return e.deviceType != device.deviceType && e.deviceSlot != device.deviceSlot 
            });
        });
    }
}