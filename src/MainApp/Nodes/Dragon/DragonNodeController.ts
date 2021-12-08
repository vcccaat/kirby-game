import {
  AInteractionEvent,
  AKeyboardInteraction,
  ASceneNodeController,
  Quaternion,
} from "../../../anigraph";
import { DragonNodeModel } from "./DragonNodeModel";
import { Mat4 } from "src/anigraph/amath";
import { Vec3 } from "src/anigraph/amath";
import { FilteredVector } from "../../../anigraph/amvc/FilteredVector";
import { MainAppState } from "../../MainAppState";
import { AWheelInteraction } from "../../../anigraph/ainteraction/AWheelInteraction";

export class DragonNodeController extends ASceneNodeController<DragonNodeModel> {
  cameraFilter!: FilteredVector<Vec3>;
  camOffset: number = 1;
  startOffset!: Vec3;
  onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    // if (interaction.keysDownState[" "]) {
    //   this.jump();
    // }
    if (interaction.keysDownState["]"]) {
      this.model.transform.rotation = this.model.transform.rotation.times(
        Quaternion.RotationZ(Math.PI * 0.1)
      );
    }
    if (interaction.keysDownState["["]) {
      this.model.transform.rotation = this.model.transform.rotation.times(
        Quaternion.RotationZ(-Math.PI * 0.1)
      );
    }
  }

  onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {}

  jumpUp: Vec3 = new Vec3(0, 0, 0.02);
  gravity: Vec3 = new Vec3(0, 0, -0.01);
  jump(updateCamera: Function, duration?: number) {
    let initV = new Vec3(0, 0, 0);
    duration = duration ?? 15;
    // if (this.model.isJumping) {
    //   return;
    // }
    const self = this;
    self.model.currentFrame += 1;
    let currentFrame = self.model.currentFrame;
    let upCount = 0;

    this.addTimedAction(
      (actionProgress) => {
        if (currentFrame !== self.model.currentFrame) return;
        self.model.isJumping = true;

        initV.addVector(this.gravity);
        if (upCount < 100) initV.addVector(this.jumpUp);
        upCount++;
        if (self.model.transform.position.z + initV.z < 0) {
          self.model.transform.position.z = 0;
          updateCamera();
          return;
        }
        if (initV.z < -1.5) initV.z = -1.5;
        self.model.transform.position.addVector(initV);
        console.log(initV.z);
        updateCamera();
      },
      duration,
      () => {
        self.model.isJumping = false;
        // self.model.transform.rotation = rotationStart;
      },
      this.model.tween
    );
  }

  applyGravity(updateCamera: Function) {
    let gravity = new Vec3(0, 0, -0.01);
    let initV = new Vec3(0, 0, 0);
    let duration = 10000;

    const self = this;
    self.model.gravityFrame += 1;
    let gravityFrame = self.model.gravityFrame;

    this.addTimedAction(
      (actionProgress) => {
        if (gravityFrame !== self.model.gravityFrame) return;

        if (self.model.transform.position.z <= 0) {
          self.model.transform.position.z = 0;
          return;
        }

        initV.addVector(gravity);
        // if (initV.z < -2) initV.z = -2;
        self.model.transform.position.addVector(initV);

        console.log(initV.z);
        updateCamera();
      },
      duration,
      () => {
        // self.model.isJumping = false;
        // self.model.transform.rotation = rotationStart;
      },
      this.model.tween
    );
  }

  move(updateCamera: Function, keysDownState: { [name: string]: boolean }) {
    let unitV = 0.5;
    let leftV = new Vec3(-unitV, 0, 0);
    let rightV = new Vec3(unitV, 0, 0);
    let forwardV = new Vec3(0, unitV, 0);
    let backwardV = new Vec3(0, -unitV, 0);

    let duration = 2;

    // if (this.model.isMoving) {
    //   return;
    // }
    const self = this;
    self.model.movingFrame++;
    let movingFrame = self.model.movingFrame;

    this.addTimedAction(
      (actionProgress) => {
        self.model.isMoving = true;
        if (movingFrame !== self.model.movingFrame) return;

        let v = new Vec3(0, 0, 0);
        if (keysDownState["ArrowUp"]) v.addVector(forwardV);
        if (keysDownState["ArrowDown"]) v.addVector(backwardV);
        if (keysDownState["ArrowLeft"]) v.addVector(leftV);
        if (keysDownState["ArrowRight"]) v.addVector(rightV);
        self.model.transform.position.addVector(v);
        updateCamera();
      },
      duration,
      () => {
        self.model.isMoving = false;
        // self.model.transform.rotation = rotationStart;
      },
      this.model.tween
    );
  }

  spin(duration?: number) {
    duration = duration ?? this.model.spinDuration;
    if (this.model.isSpinning) {
      return;
    }
    const self = this;
    const rotationStart = this.model.transform.rotation;
    this.addTimedAction(
      (actionProgress) => {
        self.model.isSpinning = true;
        self.model.transform.rotation = rotationStart.times(
          Quaternion.FromAxisAngle(
            self.model.transform.rotation.Mat3().c2,
            actionProgress * self.model.nSpins * Math.PI * 2
          )
        );
      },
      duration,
      () => {
        self.model.isSpinning = false;
        self.model.transform.rotation = rotationStart;
      },
      this.model.tween
    );
  }
}
