import {A3DSceneController, ASceneModel, ASceneNodeModel, V3} from "../../anigraph";
import {BasicGameSceneControllerSpecs} from "./SceneControllerSpecs";
import {APointerLockPlayerControls} from "../../anigraph/aplayercontrols";
import {ExampleFlyingCameraControls} from "../PlayerControls/ExampleFlyingPlayerControls";
import {folder} from "leva";
import {ExampleDragOrbitControls} from "../PlayerControls/ExampleDragOrbitControls";

export class GameSceneController extends A3DSceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>>{
    initClassSpec() {
        super.initClassSpec();
        this.addClassSpecs(BasicGameSceneControllerSpecs());
        // add additional specs here
    }

    initCameraControls() {
        let FlyControls = ExampleFlyingCameraControls.Create(this);
        this.defineInteractionMode('FlyControls', FlyControls);

        let OrbitControls = ExampleDragOrbitControls.Create(this);
        this.defineInteractionMode('OrbitControls', OrbitControls);

        this.setCurrentInteractionMode('OrbitControls');

    }

    initSceneCamera() {
        super.initSceneCamera();
        this.camera.setPosition(V3(0,0,100)); // V3() is shorthand for new Vec3()
    }

    /**
     * We will add a dropdown box that lets us switch between different interactionModes
     * @returns {any}
     */
    getControlPanelSpecs(){
        const self = this;
        let controlSpecs:any = {};
        controlSpecs['InteractionMode:']={
            value: self._currentInteractionModeName,
            options: self._interactions.getGUISelectableModesList(),
            onChange: (v: any) => {
                self.setCurrentInteractionMode(v);
            }
        }
        return folder({
                ...controlSpecs
            },
            {collapsed: false}
        );
        return controlSpecs;
    }


}
