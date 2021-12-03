import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {
    AObjectState,
    ASceneNodeModel,
    ASerializable, BoundingBox3D,
    Color, NodeTransform3D, Quaternion,
    V2,
    V3,
    Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";

import {RingSegment} from "./RingSegment";

@ASerializable("RingNodeModel")
export class RingNodeModel extends ASceneNodeModel{
    @AObjectState segments:RingSegment[];

    constructor(segments?:RingSegment[], ...args:any[]) {
        super();
        this.segments=[];
        if(segments){this.segments=segments;}
        const self=this;

        // To make sure that anything listening to our geometry knows when the segments change,
        // we will trigger a geometry update whenever they change.
        this.subscribe(this.addStateKeyListener('segments', ()=>{
            self.geometry.touch();
        }))
    }

    static async CreateDefaultNode(radius:number=50, height=10, samples:number=50, isSmooth:boolean=true, ...args:any[]) {
        let newNode = new this();
        newNode.transform.position = V3(0,0,100);
        newNode.color = Color.Random();
        newNode.color.a = 0.5; // we can even make it semi-transparent
        return newNode;
    }

    getBoundsForSegments(){
        let b = new BoundingBox3D();
        for (let s of this.segments){
            b.boundBounds(s.getBounds());
        }
        return b;
    }

    getBounds(): BoundingBox3D {
        let b = this.getBoundsForSegments();
        b.transform = this.getWorldTransform();
        return b;
    }

}
