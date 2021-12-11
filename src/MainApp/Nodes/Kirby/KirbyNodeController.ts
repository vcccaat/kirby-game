import {
  AInteractionEvent,
  AKeyboardInteraction,
  ASceneNodeController,
  Quaternion,
} from "../../../anigraph";
import { KirbyNodeModel } from "./KirbyNodeModel";
import { Mat4 } from "src/anigraph/amath";
import { Vec3 } from "src/anigraph/amath";
import { FilteredVector } from "../../../anigraph/amvc/FilteredVector";
import { MainAppState } from "../../MainAppState";
import { AWheelInteraction } from "../../../anigraph/ainteraction/AWheelInteraction";

export class KirbyNodeController extends ASceneNodeController<KirbyNodeModel> {
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
    if (interaction.keysDownState["q"]) {
      this.model.isPulling = true;
    }

    // if(interaction.keysDownState["8"]) {
    //   console.log(this.model.segments[0].transform);
    //   let leftHand = this.model.segments[2];
    //   let rightHand = this.model.segments[0];

    //   leftHand.transform.position.addVector(new Vec3(0,0,-1));
    // }

  }

  onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    if (!interaction.keysDownState["q"]) {
      this.model.isPulling = false;
    }
  }

  upAcceleration: Vec3 = new Vec3(0, 0, 0.01);
  gravity: Vec3 = new Vec3(0, 0, -0.01);
  jump(updateCamera: Function, duration?: number) {
    // let initV = new Vec3(0, 0, 0);
    duration = duration ?? 1;
    // if (this.model.isJumping) {
    //   return;
    // }
    const self = this;
    self.model.currentFrame += 1;
    let currentFrame = self.model.currentFrame;
    let upCount = 0;

    self.model.isJumping = true;
    self.model.isUp = true;
    self.model.upV = new Vec3(0, 0, 2);

    // this.addTimedAction(
    //   (actionProgress) => {
    //     // if (!this.model.isJumping) return;
    //     if (currentFrame !== self.model.currentFrame) return;

    //     // initV.addVector(this.gravity);
    //     this.model.upV.minus(this.upAcceleration);

    //     // if (self.model.transform.position.z + initV.z < 0) {
    //     //   self.model.transform.position.z = 0;
    //     //   this.model.isJumping = false;
    //     //   updateCamera();
    //     //   return;
    //     // }
    //     // if (initV.z < -1.5) initV.z = -1.5;
    //     self.model.transform.position.addVector(this.model.upV);
    //     console.log(this.model.upV.z);
    //     updateCamera();
    //   },
    //   duration,
    //   () => {
    //     if (currentFrame !== self.model.currentFrame) return;
    //     self.model.upV = new Vec3(0, 0, 2);
    //     self.model.isUp = false;
    //     // self.model.transform.rotation = rotationStart;
    //   },
    //   this.model.tween
    // );
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
    let unitV = 1;
    let leftV = new Vec3(-unitV, 0, 0);
    let rightV = new Vec3(unitV, 0, 0);
    let forwardV = new Vec3(0, unitV, 0);
    let backwardV = new Vec3(0, -unitV, 0);

    let duration = 1;

    // if (this.model.isMoving) {
    //   return;
    // }
    const self = this;
    self.model.movingFrame++;
    let movingFrame = self.model.movingFrame;

    let leftHand = self.model.segments[0];
    let rightHand = self.model.segments[2];

    if (leftHand.transform.position.x > -10) leftHand.transform.position.addVector(new Vec3(-10,0,0));
    if (rightHand.transform.position.x > -10) rightHand.transform.position.addVector(new Vec3(-10,0,0));

    self.model.updateHands ++;

    this.addTimedAction(
      (actionProgress) => {
        self.model.isMoving = true;
        if (movingFrame !== self.model.movingFrame) return;

        let v = new Vec3(0, 0, 0);
        if (keysDownState["ArrowUp"]) v.addVector(forwardV);
        if (keysDownState["ArrowDown"]) v.addVector(backwardV);
        if (keysDownState["ArrowLeft"]) v.addVector(leftV);
        if (keysDownState["ArrowRight"]) v.addVector(rightV);

        let directV = new Vec3(1, 0, 0);
        let normalizedV = v.clone();
        normalizedV.normalize();
        let cos = directV.dot(normalizedV);
        let sin = normalizedV.cross(directV);
        let angle = Math.acos(cos);

        if (sin.z < 0) {
          angle = 2 * Math.PI - angle;
        }
        if (v.L2() !== 0)
          self.model.transform.rotation = Quaternion.RotationZ(angle);

        self.model.transform.position.addVector(v);
        updateCamera();
      },
      duration,
      () => {
        self.model.isMoving = false;
        let xL = leftHand.transform.position.x;
        let xR = rightHand.transform.position.x;
        leftHand.transform.position.addVector(new Vec3(-xL,0,0));
        rightHand.transform.position.addVector(new Vec3(-xR,0,0));
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
