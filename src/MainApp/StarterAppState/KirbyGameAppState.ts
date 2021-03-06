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
import { WaterNodeModel } from '../Nodes/Water/WaterNodeModel';
import { LightNodeModel } from '../Nodes/LightSource/LightNodeModel';
import { MountainNodeModel } from '../Nodes/Mountain/MountainNodeModel';
import { VertexArray2D } from 'src/anigraph/ageometry';
import { V2 } from 'src/anigraph/amath';
import { Vec2 } from 'src/anigraph/amath';

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
  countBomb: number=0;
  flame!: FlameModel;

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

   CreateTestSquare(color?: Color, position?: Vec2, isFire?: boolean, additionalHeight?: boolean) {
    position = position ? position : V2();
    // color = color?color:Color.FromString('#55aa55');
    color = color ? color : Color.FromString('#888888');
    let newShape = new FlameModel(isFire,additionalHeight);
    let sz = 25;
    let verts = new VertexArray2D();
    verts.position.push(V2(sz, -sz));
    verts.position.push(V2(-sz, -sz));
    verts.position.push(V2(-sz, sz));
    verts.position.push(V2(sz, sz));
    
    newShape.color = color;
    newShape.verts = verts;
    // newShape.recenterAnchor();
    // newShape.verts = verts;
    // this.sceneController.model.addNode(newShape);
    return newShape;
  }

  addBomb() {
    let kirbyGameControls = this.gameSceneController.getInteractionMode("KirbyGame") as KirbyGameControls;
    // let flame = this.CreateTestSquare(Color.FromString('yellow'), new Vec2(0,0), true);
    // flameModel.color = Color.FromString('#ff0000');
    this.flame.transform.position.addVector(new Vec3(200,-600,0));
    // this.flame.transform.rotation = Quaternion.RotationZ(Math.PI * 0.5);
    this.flame.name = "xxx"
    
    // this.sceneModel.removeNode(flame);
    // let startOffset = this.gameSceneController.camera.pose.position.clone();
    // let camOffset = 1;

    // this.gameSceneController.camera.setPosition(new Vec3(0,0,100))
    kirbyGameControls.updateCamera();
    this.sceneModel.addNode(this.flame);
  }

	async initKirbyGame(startInGameMode: boolean = true) {
		const self = this;
		this.enemySpeed = 1;
		this.enemyRange = 100;

		// add a ground plane
		self._addGroundPlane();

    let lightSource = new LightNodeModel()
    this.sceneModel.addNode(lightSource);
    lightSource.transform.position = new Vec3(-500, -1050, 50);
    // let lightSource2 = new LightNodeModel()
    // this.sceneModel.addNode(lightSource2);
    // lightSource2.transform.position = new Vec3(650, -1000, 500);
    // let lightSource3 = new LightNodeModel()
    // this.sceneModel.addNode(lightSource3);
    // lightSource3.transform.position = new Vec3(600, 600, 500);
    // let lightSource4 = new LightNodeModel()
    // this.sceneModel.addNode(lightSource4);
    // lightSource4.transform.position = new Vec3(-600, 500, 500);

		let orbitEnemy = new EnemyNodeModel();
		this.sceneModel.addNode(orbitEnemy);
		orbitEnemy.transform.position = new Vec3(0, -700, -50);
		orbitEnemy.orbitRate = 0;
		orbitEnemy.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());
		orbitEnemy.color = Color.FromString('#fff200');

		let star = await StarNodeModel.CreateDefaultNode();
		let star2 = await StarNodeModel.CreateDefaultNode();
		star.transform.position = new Vec3(-80, -700, 50);
		star2.transform.position = new Vec3(80, -700, 50);
		star.setMaterial('Toon');
		star2.setMaterial('Toon');
		// star2.setMaterial(this.materials.getMaterialModel('Glow').CreateMaterial());
		this.sceneModel.addNode(star);
		this.sceneModel.addNode(star2);


    const numOfItem = 10
    for(let i = 0; i<numOfItem; i++){
     
      let pepper = new PepperNodeModel();
      pepper.transform.position = new Vec3(800*Math.random()-400, 800*Math.random()-975, 20);
      this.sceneModel.addNode(pepper);

      let bomb = new BombNodeModel();
      bomb.transform.position = new Vec3(800*Math.random()-400, 800*Math.random()-975, 20);
      this.sceneModel.addNode(bomb);
    }
		this.generateScene(40, 200, 500);
		this.generateRiver(200);
		this.generateMountain(4,4,2);

    // let flame = new FlameModel(100);
    let waterFall = this.CreateTestSquare(Color.FromString('#00a2ff'), new Vec2(0,0), false, true);
    // flameModel.color = Color.FromString('#00a2ff');
    waterFall.transform.position.addVector(new Vec3(0,-176,0));
    waterFall.transform.rotation = Quaternion.RotationZ(-Math.PI * 0.5).times(Quaternion.RotationX(-Math.PI * 0.5));
    this.sceneModel.addNode(waterFall);

    // let pond = this.CreateTestSquare(Color.FromString('#00a2ff'), new Vec2(0,0), false, false);
    // pond.transform.position.addVector(new Vec3(0,-230,0));
    // this.sceneModel.addNode(pond);

    // let flame1 = this.CreateTestSquare(Color.FromString('yellow'), new Vec2(0,0), true);
    // flame1.transform.position.addVector(new Vec3(-150,-375,0));
    // this.sceneModel.addNode(flame1);


		this.kirby = await KirbyNodeModel.CreateDefaultNode();
		this.sceneModel.addNode(this.kirby);
		this.kirby.transform.rotation = Quaternion.RotationZ(Math.PI * 0.5);
		// this.kirby.setMaterial('pink');

		this.kirby.transform.position.addVector(new Vec3(0, -830, KIRBY_INIT_HEIGHT));
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

		// let arm = this.addArmModel();
		// arm.transform.position = V3(-200, 200, 0);
    let display = document.createElement("div");
    display.className = 'bomb'
    document.getElementsByTagName("body")[0].appendChild(display);
    display.innerHTML = 'Bomb Counts: ' + this.countBomb + '/10'
    display.setAttribute("style", "position: absolute; top: 180px; right: 700px; font-weight: bold;");

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
		for(let tree of trees){
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

            if (block instanceof BombNodeModel){
              this.countBomb += 1
              
              let display = document.getElementsByClassName('bomb')[0]
              display.innerHTML = 'Bomb Counts: ' + this.countBomb + '/10'
            }
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

		// you can also get time since last frame with this.timeSinceLastFrame
		// this.updateSpinningArms(this.appClock.time);
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
		let start = -850;
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
			tree.transform.position = V3(anchor.x + playgroundRadius*Math.sin(angle), anchor.y + playgroundRadius * Math.cos(angle), 50 );
			this.sceneModel.addNode(tree);
			angle += 2 * Math.PI / numOfTrees;
		}

	}

	generateRiver(laneLength:number){
		let start = 0;
		let now = start;
		while(now< start + laneLength){
			let water = new WaterNodeModel();
			water.transform.position = V3(0, now-175, 100);
			this.sceneModel.addNode(water);
			now += 50;
		}
	}

	generateMountain(width:number,height:number,depth:number){

		let x = -210;
		let y = -175;
		let z = 25;
		let size = 50;
		for(let i  = 0;i<width;i++){
			for(let j = 0;j<height;j++){
				for(let k = 0;k<depth;k++){
					if((i === 0 && k === (depth-1))){
						continue;
					}
					let soil = new MountainNodeModel();
					soil.transform.position = V3(x, y ,z);
					this.sceneModel.addNode(soil);
					z += size;
				}
				z = 20;
				y += size;
			}
			y = -175;
			x += size;
		}

		x = 60;
		y = -175;
		z = 25;
		size = 50;
		for(let i  = 0;i<width;i++){
			for(let j = 0;j<height;j++){
				for(let k = 0;k<depth;k++){
					if((i === width-1 && k === (depth-1))){
						continue;
					}
					let soil = new MountainNodeModel();
					soil.transform.position = V3(x, y ,z);
					this.sceneModel.addNode(soil);
					z += size;
				}
				z = 20;
				y += size;
			}
			y = -175;
			x += size;
		}
		
		

	}
}
