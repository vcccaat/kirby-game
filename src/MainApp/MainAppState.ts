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
    AExtrudedShapeModel, VertexArray3D, ATexturedMaterialModel
} from "../anigraph";
import {AGroundModel} from "../anigraph/amvc/derived";
import * as THREE from "three";
import {TexturedMaterialModel} from "./Materials/TexturedMaterialModel";
import {ATexture} from "../anigraph/arender/ATexture";


export class MainAppState extends Base2DAppAppState{

    static SetAppState() {
        const newappState = new this();
        SetAppState(newappState);
        return newappState;
    }

    async PrepAssets(){
        // this.materials.setMaterialModel('trippy', new TexturedMaterialModel('trippy.jpeg'));
        let trippyTexture = await ATexture.LoadAsync('./images/trippy.jpeg');
        this.materials.setMaterialModel('trippy', new TexturedMaterialModel(trippyTexture));
        let marbleTexture = await ATexture.LoadAsync('./images/marble.jpg');
        this.materials.setMaterialModel('marble', new TexturedMaterialModel(marbleTexture));
    }

    async initSceneModel() {
        const self = this;
        self._addGroundPlane();
        self.currentNewModelTypeName = AExtrudedShapeModel.SerializationLabel();

        // You can add more shapes using, e.g.,
        // self.addTestSquare(300);

        self._addStartingPointLight();
        this.addModelAndLights();
        this.addModel('./models/ply/binary/Lucy100k.ply', "Lucy",
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

    _addGroundPlane(wraps:number=4.5) {
        let groundPlane = new AGroundModel();
        let verts = VertexArray3D.SquareXYUV(1000, wraps);
        groundPlane.verts = verts;
        groundPlane.name = 'GroundPlane';
        this.sceneModel.addNode(groundPlane);
        groundPlane.transform.position.z = -0.5;
        this.setNodeMaterial(groundPlane, 'marble');
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

    async addModelAndLights() {
        const self = this;
        await this.loadModelFromURL('./models/ply/dragon_color_onground.ply',
            (obj: THREE.Object3D) => {
                self.modelUploaded('dragon', obj).then((model: ASceneNodeModel) => {
                        let loaded = model as ALoadedModel;
                        loaded.sourceTransform.scale = new Vec3(0.5, 0.5, 0.5)
                        loaded.setMaterial(self.materials.getMaterialModel('Toon').CreateMaterial());
                    }
                );
            });
    }

    async addModel(path:string, name:string, transform:NodeTransform3D, materialName:string='Toon') {
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

    onAnimationFrameCallback(){
    }
}
