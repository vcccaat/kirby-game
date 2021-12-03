import {
    SetAppState,
    GetAppState,
    Base2DAppAppState,
    APointLightModel,
    NodeTransform3D,
    V3,
    Quaternion,
    AMaterialManager,
    Color,
    VertexArray2D,
    V2,
    Vec2,
    ASceneNodeModel,
    ALoadedModel,
    Vec3,
    VertexArray3D,
    ASceneNodeController,
    ASceneController,
    ASceneModel,
    A3DSceneController,
    AObjectState,
    Mat3,
    AClock
} from "../anigraph";
import {AGroundModel} from "../anigraph/amvc/derived";
import * as THREE from "three";
import {TexturedMaterialModel} from "./Materials/TexturedMaterialModel";
import {ATexture} from "../anigraph/arender/ATexture";
import {ExampleNodeModel} from "./Nodes/Example/ExampleNodeModel";
import {ExampleThirdPersonControls} from "./PlayerControls/ExampleThirdPersonControls";
import {GameSceneController} from "./SceneControllers/GameSceneController";
import {DragonNodeModel} from "./Nodes/Dragon/DragonNodeModel";
import {DragonNodeController} from "./Nodes/Dragon/DragonNodeController";
import {DragonGameControls} from "./PlayerControls/DragonGameControls";
import {EnemyNodeModel} from "./Nodes/Enemy/EnemyNodeModel";
import {ExampleDragOrbitControls} from "./PlayerControls/ExampleDragOrbitControls";
import {GroundModel} from "./Nodes/Ground/GroundModel";
import {GroundMaterialModel} from "./Materials/GroundMaterialModel";


enum SceneControllerNames{
    MapScene='MapScene',
    GameScene = 'GameScene'
}

export class MainAppState extends Base2DAppAppState{

    //##################//--Example Game Attributes--\\##################
    //<editor-fold desc="Example Game Attributes">
    /**
     * We will control the dragon in our example game
     * @type {DragonNodeModel}
     */
    dragon!:DragonNodeModel;

    /**
     * A convenient getter for accessing the dragon's scene controller in the game view, which we have customized
     * in Nodes/Dragon/DragonNodeController.ts
     * @returns {ASceneNodeController<ASceneNodeModel> | undefined}
     */
    get dragonController():DragonNodeController|undefined{return this.getGameNodeControllerForModel(this.dragon) as DragonNodeController|undefined;}

    /**
     * Enemy's detection range
     * @type {number}
     */
    @AObjectState enemyRange!:number;
    /**
     * Enemy's speed
     * @type {number}
     */
    @AObjectState enemySpeed!:number;

    /**
     * We will add the custom parameters to the gui controls with leva...
     * @returns {{enemySpeed: {min: number, max: number, step: number, value: number}}}
     */
    getControlPanelStandardSpec(): {} {
        const self = this;
        return {
            ...super.getControlPanelStandardSpec(),
            enemySpeed:{
                value:self.enemySpeed,
                min:0,
                max:50,
                step:0.1
            }
        }
    };
    //</editor-fold>
    //##################\\--Example Game Attributes--//##################
    static SceneControllerNames=SceneControllerNames;
    static SetAppState() {
        const newappState = new this();
        SetAppState(newappState);
        return newappState;
    }
    async PrepAssets(){
        let trippyTexture = await ATexture.LoadAsync('./images/trippy.jpeg');
        let marbleTexture = await ATexture.LoadAsync('./images/marble.jpg');
        this.materials.setMaterialModel('trippy', new TexturedMaterialModel(trippyTexture));
        await this.materials.setMaterialModel('marble', new TexturedMaterialModel(marbleTexture));
        await this.materials.setMaterialModel('ground', new GroundMaterialModel(marbleTexture));
    }
    get selectedModel(){
        return this.selectionModel.singleSelectedModel;
    }
    get selectedController():ASceneNodeController<ASceneNodeModel>|ASceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>>{
        return this.getGameNodeControllerForModel(this.selectedModel)??this.gameSceneController;
    }
    get gameSceneController():GameSceneController{
        return this.sceneControllers[SceneControllerNames.GameScene] as GameSceneController;
    }
    get threejsSceneRoot(){return this.gameSceneController.view.threejs;}
    get threejsCamera(){return this.gameSceneController.view.threeCamera;}
    getGameNodeControllerForModel(model?:ASceneNodeModel):ASceneNodeController<ASceneNodeModel>|undefined{
        if(model) {
            return this.gameSceneController.getNodeControllerForModel(model) as ASceneNodeController<ASceneNodeModel>;
        }
    }
    get mapSceneController(){
        return this.sceneControllers[SceneControllerNames.MapScene];
    }

    get gameCamera(){
        return this.gameSceneController.camera;
    }

    get gameCameraNode(){
        return this.gameSceneController.cameraNode;
    }

    handleSceneGraphSelection(m:any){
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.name}: ${m.uid}`)
        console.log(m);
        console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`)
        console.log(THREE.RepeatWrapping);
    }

    //##################//--Setting up the scene--\\##################
    //<editor-fold desc="Setting up the scene">

    async initSceneModel() {
        // Replace the provided examples
        // this.initExampleScene1();
        // this.initDragonGame();
        this.initDebug();
    }


    async initDebug(startInGameMode:boolean=false){
        const self = this;
        // add a ground plane
        self._addGroundPlane();
        self._addStartingPointLight();
        let trippyBall = await ExampleNodeModel.CreateDefaultNode(25);
        trippyBall.transform.position = V3(-100, 100,10);
        // see the trippy material for context. it's basically just textured with a colorful pattern
        trippyBall.setMaterial('trippy')
        this.sceneModel.addNode(trippyBall);
        this.gameSceneController.setCurrentInteractionMode(ExampleDragOrbitControls);


        // Pro tip: try pressing 'P' while in orbit mode to print out a camera pose to the console...
        // this will help you set up your camera in your scene...
        this.gameSceneController.camera.setPose(
            new NodeTransform3D(
                V3(2.2623523997293558, -128.47426789504541, 125.05297357609061),
                new Quaternion(-0.48287245789277944, 0.006208070367882366, -0.005940267920390677, 0.8756485382206308)
            )
        )
    }



    async initDragonGame(startInGameMode:boolean=false){
        const self = this;
        this.enemySpeed = 1;
        this.enemyRange = 200;

        // add a ground plane
        self._addGroundPlane();


        let orbitEnemy = new EnemyNodeModel();
        this.sceneModel.addNode(orbitEnemy);
        orbitEnemy.setTransform(new NodeTransform3D(
            V3(0, 0, 150),
            new Quaternion(),
            V3(1, 1, 1),
            V3(-100, -100, 0)
        ));
        orbitEnemy.orbitRate = 0.1;
        orbitEnemy.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());

        let enemy2 = new EnemyNodeModel();
        this.sceneModel.addNode(enemy2);
        enemy2.setTransform(new NodeTransform3D(V3(300, 200, 150)));
        enemy2.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());

        //Add lucy... so that there is more stuff
        this.addModelFromFile('./models/ply/binary/Lucy100k.ply', "Lucy",
            new NodeTransform3D(
                V3(100,100,80),
                Quaternion.FromAxisAngle(V3(1,0,0),-Math.PI*0.5).times(Quaternion.FromAxisAngle(V3(0,0,1),-Math.PI*0.5)),
                V3(1,1,1).times(0.1)
            )
        );

        //add an example node model
        // the CreateDefaultNode methods are asynchronous in case we want to load assets,
        // this means we should await the promise that they return to use it.
        let trippyBall = await ExampleNodeModel.CreateDefaultNode(25);
        trippyBall.transform.position = V3(-100, 300,10);

        // see the trippy material for context. it's basically just textured with a colorful pattern
        trippyBall.setMaterial('trippy')
        this.sceneModel.addNode(trippyBall);

        // how to add a new node directly to the scene...
        // let newModel = new ExampleNodeModel()
        // let newModel = await ExampleNodeModel.CreateDefaultNode(30);
        // newModel.setMaterial('trippy');
        this.dragon = await DragonNodeModel.CreateDefaultNode();
        this.sceneModel.addNode(this.dragon);
        this.dragon.transform.rotation = Quaternion.RotationZ(-Math.PI*0.5);
        this.dragon.transform.scale=0.25;
        this.dragon.setMaterial('Toon');



        if(startInGameMode) {
            //now let's activate the example third person controls...
            this.gameSceneController.setCurrentInteractionMode(DragonGameControls);
        }else{
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
        )

        /***
         * IF YOU WANT A THREEJS PLAYGROUND!
         * You can work directly in threejs using the threejs scene at this.threejsScene, which corresponds to
         * this.gameSceneController.view.threejs
         * You can get the camera with this.threejsCamera
         */
        let threejsRoot = this.threejsSceneRoot;
        const tngeometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
        const tnmaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const torusKnot = new THREE.Mesh( tngeometry, tnmaterial );
        // we will put it in the corner...
        torusKnot.position.set(300,300,200);
        threejsRoot.add(torusKnot);

    }

    async initExampleScene1(){
        const self = this;
        self._addGroundPlane();
        self.currentNewModelTypeName = ExampleNodeModel.SerializationLabel();
        self._addStartingPointLight();
        this.addDragon();

        // add Lucy. We will specify a transform to position and scale her in the scene.
        this.addModelFromFile('./models/ply/binary/Lucy100k.ply', "Lucy",
            new NodeTransform3D(
                V3(100,100,80),
                Quaternion.FromAxisAngle(V3(1,0,0),-Math.PI*0.5).times(Quaternion.FromAxisAngle(V3(0,0,1),-Math.PI*0.5)),
                V3(1,1,1).times(0.1)
            )
        );
    }

    _addStartingPointLight() {
        let pointLight = new APointLightModel();
        this.sceneModel.addNode(pointLight);
        pointLight.setTransform(new NodeTransform3D(
            V3(0, 0, 150),
            new Quaternion(),
            V3(1, 1, 1),
            V3(-100, -100, 0)
        ));
        pointLight.orbitRate = 0.1;
        pointLight.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());

        let pointLight2 = new APointLightModel();
        this.sceneModel.addNode(pointLight2);
        pointLight2.setTransform(new NodeTransform3D(V3(0, 0, 300)));
        pointLight2.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());
    }

    /**
     * add a ground plane
     * @param wraps - how many times the texture repeats
     * @private
     */
    async _addGroundPlane(wraps:number=4.5) {
        let groundPlane = new AGroundModel();
        let verts = VertexArray3D.SquareXYUV(1000, wraps);
        groundPlane.verts = verts;
        groundPlane.name = 'GroundPlane';
        this.sceneModel.addNode(groundPlane);
        groundPlane.transform.position.z = -0.5;
        this.setNodeMaterial(groundPlane, 'marble');


        // let groundPlane = await GroundModel.CreateDefaultNode();
        // groundPlane.name = 'GroundPlane';
        // this.sceneModel.addNode(groundPlane);
        // groundPlane.transform.position.z = -0.5;
        // // this.setNodeMaterial(groundPlane, 'ground');
        // // (this.materials.getMaterialModel('ground') as GroundMaterialModel).setTexture('color', await ATexture.LoadAsync('./images/marble.jpg'))
    }

    addTestSquare(sideLength:number=200, position?:Vec2, color?:Color){
        color = color?color:Color.Random();
        let newShape = this.NewNode();
        let verts = VertexArray3D.SquareXYUV(sideLength);
        newShape.color = color;
        newShape.verts = verts;
        newShape.name = "TestSquare";
        this.sceneModel.addNode(newShape);
    }

    async addDragon(transform?:NodeTransform3D, materialName:string='Toon') {
        const self = this;
        await this.loadModelFromURL('./models/ply/dragon_color_onground.ply',
            (obj: THREE.Object3D) => {
                self.modelUploaded('dragon', obj).then((model: ASceneNodeModel) => {
                        let loaded = model as ALoadedModel;
                        loaded.sourceTransform.scale = new Vec3(0.4, 0.4, 0.4)
                        loaded.setMaterial(self.materials.getMaterialModel(materialName).CreateMaterial());
                    }
                );
            });
    }

    async addModelFromFile(path:string, name:string, transform:NodeTransform3D, materialName:string='Toon') {
        const self = this;
        await this.loadModelFromURL(path,
            (obj: THREE.Object3D) => {
                self.modelUploaded(name, obj).then((model: ASceneNodeModel) => {
                        let loaded = model as ALoadedModel;
                        loaded.sourceTransform = transform??new NodeTransform3D();
                        loaded.setMaterial(self.materials.getMaterialModel(materialName).CreateMaterial());
                    }
                );
            });
    }

    //</editor-fold>
    //##################\\--Setting up the scene--//##################

    onAnimationFrameCallback(){
        super.onAnimationFrameCallback()
        if(this.dragon){
            this.exampleDragonGameCallback();
        }

    }

    exampleDragonGameCallback(){
        // You can get the current time, and the amount of time that has passed since
        // the last frame was rendered...
        let currentGameTime = this.appClock.time;
        let timeSinceLastFrame = this.timeSinceLastFrame;

        // let's get all of the enemy nodes...
        let enemies = this.sceneModel.filterNodes((node:ASceneNodeModel)=>{return node instanceof EnemyNodeModel;});

        // Note that you can use the same approach to select any subset of the node models in the scene.
        // You can use this, for example, to get all of the models that you want to detect collistions with

        for(let l of enemies){
            // let's get the vector from an enemy to the dragon...
            let vToDragon = this.dragon.transform.position.minus(l.transform.getObjectSpaceOrigin());

            // if the dragon is within the enemy's detection range then somthin's going down...
            if(vToDragon.L2()<this.enemyRange){
                // if the dragon isn't spinning, then it's vulnerable and the enemy will chase after it on red alert
                if(!this.dragon.isSpinning){
                    l.color = Color.FromString("#ff0000");
                    l.transform.position = l.transform.getObjectSpaceOrigin().plus(vToDragon.getNormalized().times(this.enemySpeed))
                }else {
                    //if the dragon IS spinning, the enemy will turn blue with fear and run away...
                    l.color= Color.FromString("#0000ff");
                    l.transform.position = l.transform.getObjectSpaceOrigin().plus(vToDragon.getNormalized().times(-this.enemySpeed))
                }
                //enemies don't orbit in pursuit...
                l.transform.anchor = V3(0, 0, 0);
            }else{
                //if they don't see the dragon they go neutral...
                l.color = Color.FromString("#ffffff");
            }
        }

        // Note that you can get the bounding box of any model by calling
        // e.g., for the dragon, this.dragon.getBounds()
        // or for an enemy model enemy.getBounds()

    }



}
