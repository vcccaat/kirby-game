import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import {
    AMaterial,
    AObjectState,
    Color,
    NodeTransform3D,
    Quaternion,
    V2,
    V3,
    V4,
    Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";
import {KirbySegment} from "./KirbySegment";
import * as THREE from "three";


export class KirbyElement extends ATriangleMeshElement{
    protected segment!: KirbySegment;
    nSamples:number=20
    isSmooth:boolean=true;
    colors:Color[]=[];
    get radius(){return this.segment.radius;}
    // get height(){return this.segment.length;}

    static CreateSegment(segment:KirbySegment, material?:AMaterial){
        let element = new KirbyElement();
        element.init(segment.ComputeGeometry(), material?.threejs);
        element.setSegment(segment);
        return element;
    }

    setSegment(segment:KirbySegment){
        this.segment=segment;
        this.setVerts(segment.ComputeGeometry());
        this.setTransform(this.segment.getTransform())
    }

}
