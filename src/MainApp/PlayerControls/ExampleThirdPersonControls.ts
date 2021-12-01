/***
 * Check out the parent class APointerDragPlayerControls for more implementation details.
 * This is an example of how to implement draggin-based controls like orbit.
 */
import {
    ADragInteraction,
    AInteractionEvent, AKeyboardInteraction, ASceneNodeModel, GetAppState, NodeTransform3D, Quaternion, V3, V4, Vec3,
} from "../../anigraph";
import {APointerDragPlayerControls} from "../../anigraph/aplayercontrols/APointerDragPlayerControls";
import {AWheelInteraction} from "../../anigraph/ainteraction/AWheelInteraction";
import {FilteredVector} from "../../anigraph/amvc/FilteredVector";

export class ExampleThirdPersonControls extends APointerDragPlayerControls{
    // we will filter the player's position
    cameraFilter!:FilteredVector<Vec3>;
    selectedModel!:ASceneNodeModel|undefined;
    camOffset:number=200;

    beforeActivate(...args:any[]) {
        super.beforeActivate(...args);
        GetAppState().freezeSelection();
        let selectedModel = GetAppState().selectionModel.singleSelectedModel;
        const self = this;
        if(selectedModel){
            this.selectedModel = selectedModel;
            this.cameraFilter = new FilteredVector<Vec3>(
                selectedModel.transform.position.plus(V3(0,0,self.camOffset)),
                0.2,
                (filteredValue:FilteredVector<Vec3>)=>{
                    // @ts-ignore
                    self.camera.setPosition(self.cameraFilter.value);
                });
        }
    }

    afterDeactivate(...args:any[]) {
        super.afterDeactivate(...args);
        this.cameraFilter.dispose();
        this.selectedModel = undefined;
        GetAppState().unfreezeSelection();
    }

    dragStartCallback(interaction:ADragInteraction, event:AInteractionEvent){
        interaction.dragStartPosition = event.cursorPosition;
        interaction.setInteractionState('lastCursor', event.cursorPosition);
    }

    dragMoveCallback(interaction:ADragInteraction, event:AInteractionEvent){
        let mouseMovement = event.cursorPosition.minus(interaction.getInteractionState('lastCursor'));
        interaction.setInteractionState('lastCursor', event.cursorPosition);

        let translate = V3(mouseMovement.x,-mouseMovement.y,0).times(1);
        if(this.selectedModel){
            this.selectedModel.transform.position = this.selectedModel.transform.position.plus(translate);
            this.cameraFilter.target=this.selectedModel.transform.position.plus(V3(0,0,this.camOffset));
        }

    }

    wheelCallback(interaction:AWheelInteraction, event:AInteractionEvent){
        let zoom= (event.DOMEvent as WheelEvent).deltaY;
        this.camOffset = this.camOffset+zoom;
        if(this.selectedModel) {
            this.cameraFilter.target = this.selectedModel.transform.position.plus(V3(0, 0, this.camOffset));
        }
    }

    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
        super.onKeyDown(interaction, event);
        if(interaction.keysDownState[' ']){
            if(this.selectedModel){
                // @ts-ignore
                this.selectedModel.spin();
            }
        }
    }

    dragEndCallback(interaction:ADragInteraction, event?:AInteractionEvent){
    }
}
