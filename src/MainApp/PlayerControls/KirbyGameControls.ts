import { APlayerControls } from "../../anigraph/aplayercontrols/APlayerControls";
import {
  A3DSceneController,
  AClickInteraction,
  ADOMPointerMoveInteraction,
  AInteractionEvent,
  AKeyboardInteraction,
  ASceneNodeModel,
  ASerializable,
  CallbackType,
  GetAppState,
  Quaternion,
  V3,
  Vec3,
} from "../../anigraph";
import { APointerLockPlayerControls } from "../../anigraph/aplayercontrols";
import { FilteredVector } from "../../anigraph/amvc/FilteredVector";
import { MainAppState } from "../MainAppState";
import { AWheelInteraction } from "../../anigraph/ainteraction/AWheelInteraction";
import { KirbyGameAppState } from "../StarterAppState/KirbyGameAppState";

@ASerializable("KirbyGameControls")
export class KirbyGameControls extends APointerLockPlayerControls {
  cameraFilter!: FilteredVector<Vec3>;
  selectedModel!: ASceneNodeModel | undefined;
  camOffset: number = 1;
  startOffset!: Vec3;

  // helper function to cast our appstate to the appropriate custom type
  get appState() {
    return GetAppState() as MainAppState;
  }

  // eslint-disable-next-line getter-return
  get kirby() {
    if (this.appState instanceof KirbyGameAppState) {
      return (this.appState as KirbyGameAppState).kirby;
    }
  }

  // eslint-disable-next-line getter-return
  get kirbyController() {
    if (this.appState instanceof KirbyGameAppState) {
      return (this.appState as KirbyGameAppState).kirbyController;
    }
  }

  //A handle for our control mode
  static NameInGUI() {
    // @ts-ignore
    return "KirbyGame";
  }

  //##################//--Set up the camera filter--\\##################
  //<editor-fold desc="Set up the camera filter">
  beforeActivate(...args: any[]) {
    super.beforeActivate();
    this.startOffset = this.camera.pose.position.clone();
    const self = this;
    if (this.kirby) {
      this.cameraFilter = new FilteredVector<Vec3>(
        this.kirby.transform.position.plus(this.startOffset),
        0.2,
        (filteredValue: FilteredVector<Vec3>) => {
          self.camera.setPosition(self.cameraFilter.value);
        }
      );
    }
  }
  afterDeactivate(...args: any[]) {
    super.afterDeactivate(...args);
    if (this.cameraFilter) {
      this.cameraFilter.dispose();
    }
  }
  //</editor-fold>
  //##################\\--Set up the camera filter--//##################

  /**
   * Bind any methods you want to use as callbacks.
   * Doing so will let you refer to "this" inside of the function safely.
   */
  bindMethods() {
    super.bindMethods();
    this.onClick = this.onClick.bind(this);
  }

  /**
   * We will add a custom click function here.
   */
  onClick() {
    this.kirbyController?.spin();
    console.log("Pew Pew Pew!");
  }

  /**
   * We will need to update our init function to add the new click interaction...
   * @param owner
   * @param args
   */
  init(owner: A3DSceneController<any, any>, ...args: any[]) {
    super.init(owner, ...args);

    // initialize the controls
    this.addInteraction(
      AClickInteraction.Create(this.domElement, this.onClick)
    );

    this.addInteraction(
      AWheelInteraction.Create(this.domElement, this.wheelCallback)
    );
  }

  updateCamera() {
    if (this.kirby) {
      this.cameraFilter.target = this.kirby.transform.position.plus(
        this.startOffset.times(this.camOffset)
      );
    }
  }

  //</editor-fold>
  //##################\\--Adding additional types of interactions--//##################

  onMouseMove(
    interaction: ADOMPointerMoveInteraction,
    event: AInteractionEvent
  ) {
    // ignore if we aren't locked
    if (this.isLocked === false) return;

    // convenience function to get mouse movement across different browsers
    let mouseMovement = APlayerControls.GetMouseEventMovement(event);

    let translate = V3(mouseMovement.x, -mouseMovement.y, 0).times(1);
    if (this.kirby) {
      this.kirby.transform.position =
        this.kirby.transform.position.plus(translate);
      this.updateCamera();
    }
  }

  wheelCallback(interaction: AWheelInteraction, event?: AInteractionEvent) {
    if (event) {
      let zoom = (event.DOMEvent as WheelEvent).deltaY;
      this.camOffset = this.camOffset + 0.005 * zoom;
      this.updateCamera();
    }
  }

  dispose() {
    super.dispose();
    // Any cleanup you need to do
  }

  onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    // this.kirbyController?.applyGravity(this.updateCamera.bind(this));
    this.kirbyController?.onKeyDown(interaction, event);
    if (interaction.keysDownState[" "]) {
      this.kirbyController?.jump(this.updateCamera.bind(this));
    }

    this.kirbyController?.move(
      this.updateCamera.bind(this),
      interaction.keysDownState
    );
  }

  onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    this.kirbyController?.onKeyUp(interaction, event);
  }
}
