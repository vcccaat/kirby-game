import * as THREE from "three";
import {
    AMaterialManager,
    AniGraphEnums,
    AObjectState,
    ASceneNodeModel,
    ASerializable,
    BezierTween,
    BoundingBox3D,
    Color,
    GetAppState,
    V3,
    Vec3,
    VertexArray3D,
} from "../../../anigraph";
import {bezier} from "@leva-ui/plugin-bezier";
import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {button} from "leva";
export enum ExampleEnums{
    maxElements=3000
}

const DEFAULT_DURATION = 1.5;

@ASerializable("ExampleNodeModel")
export class ExampleNodeModel extends AMeshModel{
    static SpinEventHandle:string = "MODEL_SPIN_EVENT";
    @AObjectState tween:BezierTween;
    @AObjectState spinDuration:number;
    @AObjectState nSpins:number;

    constructor() {
        super();
        this.tween= new BezierTween(0.33, -0.6, 0.66, 1.6);
        this.spinDuration = DEFAULT_DURATION;
        this.nSpins = 3;
    }

    /**
     * Define this to customize what gets created when you click the create default button in the GUI
     * @constructor
     */
    static async CreateDefaultNode(radius:number=50, widthSegments:number=50, heightSegments:number=50, ...args:any[]){
        let bodyNode = new ExampleNodeModel();
        bodyNode.verts = VertexArray3D.FromThreeJS(new THREE.SphereBufferGeometry(radius, 50,50, ...args));
        bodyNode.color = Color.Random();
        bodyNode.color.a = 0.5;
        // const bodyNodeGeo = new THREE.SphereBufferGeometry(radius, 50,50, ...args)
        // const bodyMesh = new THREE.Mesh(bodyNodeGeo)
        // bodyNode.setMaterial(AMaterialManager.DefaultMaterials.Standard);
        // bodyNode.setMaterial('trippy');
        // bodyNode.color = Color.Random();
        // bodyNode.color.a = 0.5;

        // const handNodeGeo = new THREE.SphereBufferGeometry(0.2875*radius, 50,50, ...args);
        // const handMesh = new THREE.Mesh(handNodeGeo)
        // const group = new THREE.Group()
        // group.add(bodyMesh)
        // group.add(handMesh)
        // overallNode.verts = VertexArray3D.FromThreeJS(group)
        
        return bodyNode;
    }

    getBounds(): BoundingBox3D {
        let b = new BoundingBox3D();
        b.boundBounds(BoundingBox3D.BoxAtLocationWithSize(this.transform.position, AniGraphEnums.BlockSize));
        b.transform = this.transform;
        return b;
    }

    onSpacebar(){
        this.signalEvent(ExampleNodeModel.SpinEventHandle);
    }

    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        const specs = {
            SPIN: button(() => {
                // @ts-ignore
                self.onSpacebar();
            }),
            spinDuration: {
                value: self.spinDuration,
                min: 0.5,
                max: 10,
                step: 0.1,
                onChange(v:any){
                    self.spinDuration=v;
                }
            },
            nSpins: {
                value: self.nSpins,
                min: 1,
                max: 10,
                step:1,
                onChange(v:any){
                    self.nSpins=v;
                }
            },
            curve: bezier({
                handles: self.tween.x1y1x2y2,
                graph: true,
                onChange:(v:any)=>{
                    self.tween.x1y1x2y2=[v[0],v[1],v[2],v[3]];
                }
            }),
            looking: {
                value: {x: self.transform.anchor.x, y:self.transform.anchor.y},
                joystick: "invertY",
                step: 5,
                onChange:(v: any)=>{
                    self.transform.anchor = new Vec3(v.x, v.y, 0);
                }
            }
        }
        return {...super.getModelGUIControlSpec(),...specs};
    }

}
