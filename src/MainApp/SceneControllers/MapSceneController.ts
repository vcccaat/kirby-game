import {
    AMVCSpec,
    ASceneModel,
    ASceneNodeModel,
    Base2DAppSceneController,
    BasicSceneNodeController
} from "../../anigraph";
import {BasicMapSceneControllerSpecs} from "./SceneControllerSpecs";
import {folder} from "leva";
import {ExampleNodeModel} from "../Nodes/Example/ExampleNodeModel";
import {ExampleNodeView} from "../Nodes/Example/ExampleNodeView";
import {ExampleNodeController} from "../Nodes/Example/ExampleNodeController";

export class MapSceneController extends Base2DAppSceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>>{
    initClassSpec() {
        super.initClassSpec();
        this.addClassSpecs(BasicMapSceneControllerSpecs());
        this.addClassSpec(new AMVCSpec(ExampleNodeModel, ExampleNodeView, ExampleNodeController));
        // add additional specs here
    }

    /**
     * You can add control specs for the map scene here.
     * you can look at leva (https://github.com/pmndrs/leva) for more details on defining specs.
     * @returns {any}
     */
    getControlPanelSpecs(){
        const self = this;
        let controlSpecs:any = {};
        return folder({
                ...controlSpecs
            },
            {collapsed: true}
        );
        return controlSpecs;
    }


}
