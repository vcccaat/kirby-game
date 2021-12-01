import {
    A3DSceneController,
    AMVCSpec,
    APointLightModel,
    ASceneModel,
    ASceneNodeModel,
    BasicSceneNodeController,
    V3
} from "../../anigraph";
import {BasicGameSceneControllerSpecs} from "./SceneControllerSpecs";
import {APointerLockPlayerControls} from "../../anigraph/aplayercontrols";
import {ExampleFlyingCameraControls} from "../PlayerControls/ExampleFlyingPlayerControls";
import {folder} from "leva";
import {ExampleDragOrbitControls} from "../PlayerControls/ExampleDragOrbitControls";
import {RotateSelectedObject} from "../PlayerControls/RotateSelectedObject";
import {ExampleNodeModel} from "../Nodes/Example/ExampleNodeModel";
import {ExampleNodeView} from "../Nodes/Example/ExampleNodeView";
import {ExampleNodeController} from "../Nodes/Example/ExampleNodeController";
import {ExampleThirdPersonControls} from "../PlayerControls/ExampleThirdPersonControls";

export class GameSceneController extends A3DSceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>>{
    initClassSpec() {
        super.initClassSpec();
        this.addClassSpecs(BasicGameSceneControllerSpecs());
        this.addClassSpec(new AMVCSpec(ExampleNodeModel, ExampleNodeView, BasicSceneNodeController));
        // add additional specs here
    }

    initCameraControls() {
        let FlyControls = ExampleFlyingCameraControls.Create(this);
        this.defineInteractionMode('FlyControls', FlyControls);
        let OrbitControls = ExampleDragOrbitControls.Create(this);
        this.defineInteractionMode('OrbitControls', OrbitControls);
        let ObjectRotate = RotateSelectedObject.Create(this);
        this.defineInteractionMode('ObjectRotate', ObjectRotate);

        let ThirdPerson = ExampleThirdPersonControls.Create(this);
        this.defineInteractionMode('ThirdPerson', ThirdPerson);

        this.setCurrentInteractionMode('OrbitControls');
    }

    initSceneCamera() {
        super.initSceneCamera();
        this.camera.setPosition(V3(0,0,250)); // V3() is shorthand for new Vec3()
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
