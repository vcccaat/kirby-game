import {
	ALoadedModel,
	AMaterialManager,
	AniGraphEnums,
	AObjectState,
	ASceneNodeModel,
	BoundingBox3D,
	Color,
	NodeTransform3D,
	Quaternion,
	V3,
	Vec3,
	VertexArray3D,
} from '../../anigraph';
import { KirbyNodeModel } from '../Nodes/Kirby/KirbyNodeModel';
import { KirbyNodeController } from '../Nodes/Kirby/KirbyNodeController';
import { EnemyNodeModel } from '../Nodes/Enemy/EnemyNodeModel';
import { ExampleNodeModel } from '../Nodes/Example/ExampleNodeModel';
import { PlantNodeModel } from '../Nodes/Plant/PlantNodeModel';
import { StarNodeModel } from '../Nodes/Star/StarNodeModel';
import { SphereModel } from '../Nodes/BasicGeometry/SphereModel';
import { KirbyGameControls } from '../PlayerControls/KirbyGameControls';
import { ExampleDragOrbitControls } from '../PlayerControls/ExampleDragOrbitControls';
import * as THREE from 'three';
import { FlameModel } from 'src/anigraph/effects/particle/flame/FlameModel';
import { StarterAppState } from './StarterAppState';
import { RingNodeModel } from '../Nodes/ExampleProcedureGeometry/RingNodeModel';
import { RingSegment } from '../Nodes/ExampleProcedureGeometry/RingSegment';
// import {KirbyNodeModel} from "../Nodes/Kirby/KirbyNodeModel";
import { Vector3 } from 'three';
import { PepperNodeModel } from '../Nodes/Pepper/PepperNodeModel';
import { BombNodeModel } from '../Nodes/Bomb/BombNodeModel';
import { v3 } from 'uuid';

const KIRBY_INIT_HEIGHT = 10;
export class KirbyGameAppState extends StarterAppState {
	/**
	 * Enemy's detection range
	 * @type {number}
	 */
	@AObjectState enemyRange!: number;
	/**
	 * Enemy's speed
	 * @type {number}
	 */
	@AObjectState enemySpeed!: number;

	/**
	 * We will control the kirby in our example game
	 * @type {KirbyNodeModel}
	 * @type {KirbyNodeModel}
	 */
	kirby!: KirbyNodeModel;

	/**
	 * A convenient getter for accessing the kirby's scene controller in the game view, which we have customized
	 * in Nodes/Kirby/KirbyNodeController.ts
	 * @returns {ASceneNodeController<ASceneNodeModel> | undefined}
	 */
	get kirbyController(): KirbyNodeController | undefined {
		return this.getGameNodeControllerForModel(this.kirby) as KirbyNodeController | undefined;
	}

	// For debugging, you can customize what happens when you select a model in the SceneGraph view (Menu->Show Scene Graph)
	handleSceneGraphSelection(m: any) {
		this.selectionModel.selectModel(m);
		console.log(`Model: ${m.name}: ${m.uid}`);
		console.log(m);
		console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`);
	}

	// addArmModel(){
	//     let ringModel = new RingNodeModel();
	//     let joints = [
	//         V3(0,0,0),
	//         V3(0,0,50),
	//         V3(0,100,100),
	//         V3(0,-100,150),
	//     ]
	//     let radius = 5;
	//     ringModel.segments = [
	//         new RingSegment(joints[0], joints[1], radius, [Color.FromString('#ff0000'), Color.FromString('#00ff00')]),
	//         new RingSegment(joints[1], joints[2], radius, [Color.FromString('#00ff00'), Color.FromString('#0000ff')]),
	//         new RingSegment(joints[2], joints[3], radius, [Color.FromString('#0000ff'), Color.FromString('#ffffff')]),
	//     ]
	//     this.setNodeMaterial(ringModel, 'Toon');
	//     this.sceneModel.addNode(ringModel);
	//     return ringModel;
	// }
	addArmModel() {
		let ringModel = new RingNodeModel();
		let joints = [V3(0, 0, 0), V3(0, 0, 50), V3(0, 100, 100), V3(0, -100, 150)];
		let radius = 5;
		ringModel.segments = [
			new RingSegment(joints[0], joints[1], radius, [Color.FromString('#ff0000'), Color.FromString('#00ff00')]),
			new RingSegment(joints[1], joints[2], radius, [Color.FromString('#00ff00'), Color.FromString('#0000ff')]),
			new RingSegment(joints[2], joints[3], radius, [Color.FromString('#0000ff'), Color.FromString('#ffffff')]),
		];
		this.setNodeMaterial(ringModel, 'Toon');
		this.sceneModel.addNode(ringModel);
		return ringModel;
	}

	updateSpinningArms(t: number) {
		// lets make arms spin...
		let arms = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
			return node instanceof RingNodeModel;
		}) as RingNodeModel[];
		for (let a of arms) {
			let armlen = 25;
			let sa = 2;
			let sb = 5;
			let v2 = V3(Math.sin(t * sa) * armlen, Math.cos(t * sa) * armlen, 50 + armlen);
			let v3 = V3(Math.sin(t * sb) * armlen, Math.cos(t * sb) * armlen, 0).plus(v2);
			a.segments[1].end = v2;
			a.segments[2].start = v2;
			a.segments[2].end = v3;
		}
	}

	updateStar(t: number) {
		let stars = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
			return node instanceof StarNodeModel;
		}) as StarNodeModel[];
		for (let s of stars) {
			s.transform.rotation = Quaternion.RotationZ(Math.PI * t);
		}
	}
	countFrame: number = -1;
	updateKirby(t: number) {
		// if (this.kirby.isJumping) return;
		if (this.kirby.isMoving) return;
    this.countFrame++;
		if (this.countFrame % 2 === 0) return;
		let countFrame = this.countFrame;

		let floatFreq = 200;
		let floatSpeed = 0.2;
		let direction = countFrame % floatFreq < floatFreq / 2 ? 1 : -1;
		this.kirby.transform.position.addVector(new Vec3(0, 0, direction * floatSpeed));

		let fapFreq = 60;
		let flapSpeed = 0.3;
		let leftHand = this.kirby.segments[2];
		let rightHand = this.kirby.segments[0];
		let flapDirection = countFrame % fapFreq < fapFreq / 2 ? 1 : -1;
		leftHand.transform.position.addVector(new Vec3(0, 0, flapDirection * flapSpeed));
		rightHand.transform.position.addVector(new Vec3(0, 0, flapDirection * flapSpeed));

    // let leftFeet = this.kirby.segments[3];
		// let rightFeet = this.kirby.segments[4];

    // if (leftFeet.transform.position.x >= 4) this.leftDirection = -1;
    // if (leftFeet.transform.position.x <= -4) this.leftDirection = 1;

    // if (rightFeet.transform.position.x >= 4) this.rightDirection = -1;
    // if (rightFeet.transform.position.x <= -4) this.rightDirection = 1;

    // leftFeet.transform.position.addVector(new Vec3(this.leftDirection * flapSpeed, 0, 0));
		// rightFeet.transform.position.addVector(new Vec3(this.rightDirection * flapSpeed, 0, 0));

    // this.kirby.segments[3].transform.position.addVector(new Vec3(0, flapDirection * flapSpeed, 0));

    this.kirby.updateHands ++;
    // this.kirby.updateFeet ++;
		//   // console.log(t);
	}

  leftDirection: number = 1;
  rightDirection: number = -1;
  kirbyWalking(t: number) {
    // add animation of kirby's feet while moving
    if (this.kirby.isJumping) return;
    let flapSpeed = 0.3;
    let leftFeet = this.kirby.segments[3];
		let rightFeet = this.kirby.segments[4];
    if (!this.kirby.isMoving) {
      if (leftFeet.transform.position.x === 0) return;
      leftFeet.transform.position.x = 0;
      rightFeet.transform.position.x = 0;
      this.kirby.updateFeet ++;
      return;
    }
    if (leftFeet.transform.position.x >= 4) this.leftDirection = -1;
    if (leftFeet.transform.position.x <= -4) this.leftDirection = 1;

    if (rightFeet.transform.position.x >= 4) this.rightDirection = -1;
    if (rightFeet.transform.position.x <= -4) this.rightDirection = 1;

    leftFeet.transform.position.addVector(new Vec3(this.leftDirection * flapSpeed, 0, 0));
		rightFeet.transform.position.addVector(new Vec3(this.rightDirection * flapSpeed, 0, 0));
    this.kirby.updateFeet ++;
  }



	gravity: Vec3 = new Vec3(0, 0, -0.05);
	kirbyGravity(t: number) {
		if (!this.kirby.isJumping) return;
		// if (this.kirby.isUp) return;
		// if (this.kirby.transform.position.z === 0) return;
		if (this.kirby.transform.position.z + this.kirby.upV.z <= KIRBY_INIT_HEIGHT) {
			this.kirby.transform.position.z = KIRBY_INIT_HEIGHT;
			this.kirby.upV = new Vec3(0, 0, 0);
			this.kirby.isJumping = false;
			//   this.updateCamera();
			return;
		}

		this.kirby.upV.addVector(this.gravity);
		if (this.kirby.upV.z < -3) this.kirby.upV.z = -3;
		this.kirby.transform.position.addVector(this.kirby.upV);
		// this.updateCamera();
	}

	getControlPanelStandardSpec(): {} {
		const self = this;
		return {
			...super.getControlPanelStandardSpec(),
			enemySpeed: {
				value: self.enemySpeed,
				min: 0,
				max: 50,
				step: 0.1,
			},
		};
	}

	async initKirbyGame(startInGameMode: boolean = true) {
		const self = this;
		this.enemySpeed = 1;
		this.enemyRange = 100;

		// add a ground plane
		self._addGroundPlane();

		let orbitEnemy = new EnemyNodeModel();
		this.sceneModel.addNode(orbitEnemy);
		orbitEnemy.setTransform(new NodeTransform3D(V3(0, 0, 0), new Quaternion(), V3(1, 1, 1), V3(-100, -100, 0)));
		orbitEnemy.orbitRate = 0.1;
		orbitEnemy.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());
		orbitEnemy.color = Color.Random();
		let enemy2 = new EnemyNodeModel();
		this.sceneModel.addNode(enemy2);
		enemy2.setTransform(new NodeTransform3D(V3(300, 200, 150)));
		enemy2.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());
		enemy2.color = Color.Random();
		//Add lucy... so that there is more stuff
		this.addModelFromFile(
			'./models/ply/binary/Lucy100k.ply',
			'Lucy',
			new NodeTransform3D(
				V3(100, 100, 80),
				Quaternion.FromAxisAngle(V3(1, 0, 0), -Math.PI * 0.5).times(Quaternion.FromAxisAngle(V3(0, 0, 1), -Math.PI * 0.5)),
				V3(1, 1, 1).times(0.1)
			)
		);

		let star = await StarNodeModel.CreateDefaultNode();
		let star2 = await StarNodeModel.CreateDefaultNode();
		star.transform.position = new Vec3(-80, 20, 20);
		star2.transform.position = new Vec3(80, 20, 20);
		star.setMaterial('Normals');
		star2.setMaterial('Toon');
		// star2.setMaterial(this.materials.getMaterialModel('Glow').CreateMaterial());
		this.sceneModel.addNode(star);
		this.sceneModel.addNode(star2);

		// let plants = await PlantNodeModel.CreateDefaultNode();
		// plants.transform.position = V3(-150, -150, 30);
		// this.sceneModel.addNode(plants);
		
		this.generateScene(30, 200, 500);
		
		let newNode = new ExampleNodeModel();
		newNode.verts = VertexArray3D.FromThreeJS(new THREE.BoxBufferGeometry(20, 20, 20));
		// newNode.setMaterial(AMaterialManager.DefaultMaterials.Standard);
		// newNode.setMaterial('trippy');
		newNode.color = Color.Random();
		newNode.transform.position = new Vec3(50, 50, 10);
		this.sceneModel.addNode(newNode);

		let pepper = new PepperNodeModel();
		pepper.transform.position = new Vec3(-20, 20, 20);
		this.sceneModel.addNode(pepper);

		let bomb = new BombNodeModel();
		bomb.transform.position = new Vec3(-50, 20, 20);
		this.sceneModel.addNode(bomb);
		// //add an example node model
		// // the CreateDefaultNode methods are asynchronous in case we want to load assets,
		// // this means we should await the promise that they return to use it.
		// let trippyBall = await ExampleNodeModel.CreateDefaultNode(25);
		// trippyBall.transform.position = V3(-100, 300, 10);

		// // see the trippy material for context. it's basically just textured with a colorful pattern
		// trippyBall.setMaterial("trippy");
		// this.sceneModel.addNode(trippyBall);

		// how to add a new node directly to the scene...
		// let newModel = new ExampleNodeModel()
		// let newModel = await ExampleNodeModel.CreateDefaultNode(30);
		// newModel.setMaterial('trippy');
		this.kirby = await KirbyNodeModel.CreateDefaultNode();
		// this.setNodeMaterial(this.kirby, 'pink');
		this.sceneModel.addNode(this.kirby);
		this.kirby.transform.rotation = Quaternion.RotationZ(Math.PI * 0.5);
		// this.kirby.setMaterial('pink');

		this.kirby.transform.position.addVector(new Vec3(0, 0, KIRBY_INIT_HEIGHT));
		// this.kirby.transform.scale = 0.25;
		// this.kirby.setMaterial("pink");

		if (startInGameMode) {
			//now let's activate the example third person controls...
			this.gameSceneController.setCurrentInteractionMode(KirbyGameControls);
		} else {
			// or orbit controls...
			this.gameSceneController.setCurrentInteractionMode(ExampleDragOrbitControls);
		}

		// Pro tip: try pressing 'P' while in orbit mode to print out a camera pose to the console...
		// this will help you set up your camera in your scene...
		this.gameSceneController.camera.setPose(
			new NodeTransform3D(
				V3(2.2623523997293558, -128.47426789504541, 125.05297357609061),
				new Quaternion(-0.48287245789277944, 0.006208070367882366, -0.005940267920390677, 0.8756485382206308)
			)
		);

		let arm = this.addArmModel();
		arm.transform.position = V3(-200, 200, 0);
	}

	exampleKirbyGameCallback() {
		// You can get the current time, and the amount of time that has passed since
		// the last frame was rendered...
		let currentGameTime = this.appClock.time;
		let timeSinceLastFrame = this.timeSinceLastFrame;
		let trees = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
			return node instanceof PlantNodeModel;
		});
		//console.log(trees.length);
		for(let tree of trees)
		{
			
			let boudningBox = tree.getBounds();
			//dectect collision
			if (boudningBox.pointInBounds(this.kirby.transform.position)) {
				let movementVec = this.kirby.transform.position.minus(boudningBox.transform.getObjectSpaceOrigin());
				this.kirby.transform.position = this.kirby.transform.position.plus(new Vec3(movementVec.getNormalized().x, movementVec.getNormalized().y, 0));
			}
		}
		// Note that you can use the same approach to select any subset of the node models in the scene.
		// You can use this, for example, to get all of the models that you want to detect collistions with
		let blocks = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
			return node instanceof ExampleNodeModel;
		});
		//loop through all peppers
		for (let block of blocks) {
			//pull the block if enter key down
			if (this.kirby.isPulling) {
				let vToKirby = this.kirby.transform.position.minus(block.transform.getObjectSpaceOrigin());

				// if the kirby is within the enemy's detection range then somthin's going down...
				if (vToKirby.L2() < this.enemyRange) {
					if (vToKirby.L2() < 1) {
						this.sceneModel.removeNode(block);
					} else {
						let d_rotation = new Vector3(1, 0, 0).applyQuaternion(this.kirby.transform.rotation);
						let d_direction = new Vec3(d_rotation.x, d_rotation.y, d_rotation.z);
						let angle = (Math.acos(d_direction.dot(vToKirby) / (Math.sqrt(d_direction.dot(d_direction)) + Math.sqrt(vToKirby.dot(vToKirby)))) * 180) / Math.PI;

						if (angle < 60) {
							if (!this.kirby.isSpinning) {
								block.transform.position = block.transform.getObjectSpaceOrigin().plus(vToKirby.getNormalized().times(this.enemySpeed));
							}
						}
					}
				} else {
					//if they don't see the kirby they go neutral...
				}
			} else {
				let boudningBox = block.getBounds();
				//dectect collision
				if (boudningBox.pointInBounds(this.kirby.transform.position)) {
					let movementVec = this.kirby.transform.position.minus(boudningBox.transform.getObjectSpaceOrigin());
					this.kirby.transform.position = this.kirby.transform.position.plus(new Vec3(movementVec.getNormalized().x, movementVec.getNormalized().y, 0));
				}
			}
		}

		// // let's get all of the enemy nodes...
		// let enemies = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
		//   return node instanceof EnemyNodeModel;
		// });
		// // let enemies = this.sceneModel.filterNodes((node:ASceneNodeModel)=>{return (typeof node.getBounds === 'function');});
		// for (let l of enemies) {
		//   // let's get the vector from an enemy to the kirby...
		//   let vToKirby = this.kirby.transform.position.minus(
		//     l.transform.getObjectSpaceOrigin()
		//   );

		//   // if the kirby is within the enemy's detection range then somthin's going down...
		//   if (vToKirby.L2() < this.enemyRange) {
		//     if (vToKirby.L2() < 1) {
		//       this.sceneModel.removeNode(l);
		//     } else {
		//       let d_rotation = new Vector3(1, 0, 0).applyQuaternion(
		//         this.kirby.transform.rotation
		//       );
		//       let d_direction = new Vec3(d_rotation.x, d_rotation.y, d_rotation.z);
		//       let angle =
		//         (Math.acos(
		//           d_direction.dot(vToKirby) /
		//             (Math.sqrt(d_direction.dot(d_direction)) +
		//               Math.sqrt(vToKirby.dot(vToKirby)))
		//         ) *
		//           180) /
		//         Math.PI;
		//       // if the kirby isn't spinning, then it's vulnerable and the enemy will chase after it on red alert
		//       if (angle < 60) {
		//         if (!this.kirby.isSpinning) {
		//           l.transform.position = l.transform
		//             .getObjectSpaceOrigin()
		//             .plus(vToKirby.getNormalized().times(this.enemySpeed));
		//         }
		//       } else {
		//         //if the kirby IS spinning, the enemy will turn blue with fear and run away...
		//         l.transform.position = l.transform
		//           .getObjectSpaceOrigin()
		//           .plus(vToKirby.getNormalized().times(-this.enemySpeed));
		//       }
		//       //enemies don't orbit in pursuit...
		//       l.transform.anchor = V3(0, 0, 0);
		//     }
		//   } else {
		//     //if they don't see the kirby they go neutral...
		//   }
		// }

		// you can also get time since last frame with this.timeSinceLastFrame
		this.updateSpinningArms(this.appClock.time);
		this.updateKirby(this.appClock.time);
		this.updateStar(this.appClock.time);
		this.kirbyGravity(this.appClock.time);
    this.kirbyWalking(this.appClock.time);

		// Note that you can get the bounding box of any model by calling
		// e.g., for the kirby, this.kirby.getBounds()
		// or for an enemy model enemy.getBounds()
	}

	async initSceneModel() {
		// this will run the kirby game... replace with another init example to start in orbit view.
		let startInKirbyMode: boolean = true;
		this.gameSceneController.addControlType(KirbyGameControls);
		this.initKirbyGame(startInKirbyMode);
	}

	/**
	 * Basic animation loop
	 */
	onAnimationFrameCallback() {
		super.onAnimationFrameCallback();
		if (this.kirby) {
			this.exampleKirbyGameCallback();
		}
	}
	async generateScene(numOfTrees:number, laneLength:number, playgroundRadius:number){
		let start = -200;
		let now = start;
		let anchor = V3(0,start + laneLength+playgroundRadius,30);
		let angle = 0;
		while(now< start + laneLength){
			let tree1 = await PlantNodeModel.CreateDefaultNode();
			let tree2 = await PlantNodeModel.CreateDefaultNode();
			tree1.transform.position = V3(-150, now, 30);
			tree2.transform.position = V3(150, now, 30);
			this.sceneModel.addNode(tree1);
			this.sceneModel.addNode(tree2);
			now += 50;
		}
		
		for(let i = 0; i<numOfTrees; i++){
			let tree = await PlantNodeModel.CreateDefaultNode();
			tree.transform.position = V3(anchor.x + playgroundRadius*Math.sin(angle), anchor.y + playgroundRadius * Math.cos(angle), 30 );
			this.sceneModel.addNode(tree);
			angle += 2 * Math.PI / numOfTrees;
		}
		// let tree = await PlantNodeModel.CreateDefaultNode();
		// tree.transform.position = V3(-150, -150, 30);
		// this.sceneModel.addNode(plants);

	}
}
