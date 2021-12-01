import {V3, Vec3} from "../amath/Vec3";
import {
    VertexAttributeArray,
    VertexAttributeArray2D,
    VertexAttributeArray3D,
    VertexAttributeArrayFromThreeJS, VertexPositionArray3DH
} from "./VertexAttributeArray";
import {ASerializable} from "../aserial";
import {VertexArray} from "./VertexArray";
import {V2} from "../amath/Vec2";
import {VertexIndexArray} from "./VertexIndexArray";
import {BoundingBox3D} from "../amath/BoundingBox3D";
import {Color} from "../amath/Color";
import {ATexture} from "../arender/ATexture";
import {VertexArray2D} from "./VertexArray2D";
import {Mat4} from "../amath/Mat4";
import {V4, Vec4} from "../amath";


@ASerializable("VertexArray3D")
export class VertexArray3D extends VertexArray<Vec3>{
    constructor() {
        super();
        this.position = new VertexAttributeArray3D();
    }

    getBounds():BoundingBox3D{
        let b = new BoundingBox3D();
        b.boundVertexPositionArrray(this.position);
        return b;
    }

    /** Get set position */
    set position(value:VertexAttributeArray3D){this.attributes['position'] = value;}
    get position(){return this.attributes['position'] as VertexAttributeArray3D;}

    setAttributeArray(name:string, attributeArray:VertexAttributeArray<any>){
        this.attributes[name]=attributeArray;
    }


    static FromThreeJS(buffergeo:THREE.BufferGeometry){
        let varray = new VertexArray3D();
        varray.indices = VertexIndexArray.FromThreeJS(buffergeo.index);
        for(let atrname in buffergeo.attributes){
            varray.attributes[atrname] = VertexAttributeArrayFromThreeJS(buffergeo.attributes[atrname]);
        }
        return varray;
    }

    // static FromVertexArray2D(v2:VertexArray2D, transform:Mat4){
    //     let v3=new VertexArray3D();
    // }


    addTriangleCCW(A:Vec3, B:Vec3, C:Vec3){
        let i = this.nVerts;
        let AB = B.minus(A);
        let AC = C.minus(A)
        let N= AB.getNormalized().cross(AC.getNormalized());
        this.addVertex(A,N);
        this.addVertex(B,N);
        this.addVertex(C,N);
        this.indices.push([i,i+1,i+2]);
    }

    static FrustumFromProjectionMatrix(P:Mat4, imagePlaneDepth=100){
        let imagePlaneNDC = 0.0;
        let baseNDC = [
            V4(-1,-1,imagePlaneNDC, 1),
            V4(1,-1,imagePlaneNDC, 1),
            V4(1,1,imagePlaneNDC, 1),
            V4(-1,1, imagePlaneNDC, 1),
        ]

        let PInv = P.getInverse();
        let baseV = baseNDC.map((v:Vec4)=>{
            return PInv.times(v);
        })

        let verts = new VertexArray3D();
        verts.normal = new VertexAttributeArray3D();
        verts.indices = new VertexIndexArray(3);

        for(let i=0;i<3;i++){
            verts.addTriangleCCW(
                V3(0,0,0),
                baseV[i].Point3D.getHomogenized().times(-imagePlaneDepth),
                baseV[i+1].Point3D.getHomogenized().times(-imagePlaneDepth)
            );
        }
        verts.addTriangleCCW(
            V3(0,0,0),
            baseV[3].Point3D.getHomogenized().times(-imagePlaneDepth),
            baseV[0].Point3D.getHomogenized().times(-imagePlaneDepth)
        );
        return verts;
    }


    static SquareXYUV(scale:number=1, wraps:number=1){
        let verts = new VertexArray3D();
        verts.position= new VertexAttributeArray3D();
        verts.position.push(V3(-0.5,-0.5,0.0).times(scale))
        verts.position.push(V3(0.5,-0.5,0.0).times(scale))
        verts.position.push(V3(0.5,0.5,0.0).times(scale))
        verts.position.push(V3(-0.5,0.5,0.0).times(scale))
        verts.uv = new VertexAttributeArray2D()
        verts.uv.push(V2(0,0).times(wraps));
        verts.uv.push(V2(1,0).times(wraps));
        verts.uv.push(V2(1,1).times(wraps));
        verts.uv.push(V2(0,1).times(wraps));

        verts.normal = new VertexAttributeArray3D();
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))

        verts.indices = new VertexIndexArray(3);
        verts.indices.push([0,1,2]);
        verts.indices.push([0,2,3]);
        return verts;
    }

    // static VertsForBounds2D(bound:BoundingBox3D){
    //     let verts = new VertexArray3D();
    //     verts.position= new VertexAttributeArray3D();
    //     verts.position.push(V3(-0.5*aspect,-0.5,0.0).times(scale))
    //     verts.position.push(V3(0.5*aspect,-0.5,0.0).times(scale))
    //     verts.position.push(V3(0.5*aspect,0.5,0.0).times(scale))
    //     verts.position.push(V3(-0.5*aspect,0.5,0.0).times(scale))
    //     verts.uv = new VertexAttributeArray2D()
    //     verts.uv.push(V2(0,0));
    //     verts.uv.push(V2(1,0));
    //     verts.uv.push(V2(1,1));
    //     verts.uv.push(V2(0,1));
    //
    //     verts.normal = new VertexAttributeArray3D();
    //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
    //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
    //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
    //     verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
    //
    //     verts.indices = new VertexIndexArray(3);
    //     verts.indices.push([0,1,2]);
    //     verts.indices.push([0,2,3]);
    //     return verts;
    // }

    static MeshVertsForBoundingBox3D(bounds:BoundingBox3D){
        return bounds.GetBoxTriangleMeshVerts();
    }

    static BoundingBoxMeshVertsForObject3D(obj:THREE.Object3D){
        return BoundingBox3D.FromTHREEJSObject(obj).GetBoxTriangleMeshVerts();
    }


    static SpriteGeometry(texture:ATexture, scale:number=100){
        let verts = new VertexArray3D();
        let aspect = texture.width/texture.height;
        verts.position= new VertexAttributeArray3D();
        verts.position.push(V3(-0.5*aspect,-0.5,0.0).times(scale))
        verts.position.push(V3(0.5*aspect,-0.5,0.0).times(scale))
        verts.position.push(V3(0.5*aspect,0.5,0.0).times(scale))
        verts.position.push(V3(-0.5*aspect,0.5,0.0).times(scale))
        verts.uv = new VertexAttributeArray2D()
        verts.uv.push(V2(0,0));
        verts.uv.push(V2(1,0));
        verts.uv.push(V2(1,1));
        verts.uv.push(V2(0,1));

        verts.normal = new VertexAttributeArray3D();
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))
        verts.normal.push(V3(0.0,0.0,-1.0).times(scale))

        verts.indices = new VertexIndexArray(3);
        verts.indices.push([0,1,2]);
        verts.indices.push([0,2,3]);
        return verts;
    }


    addVertex(v:Vec3, normal?:Vec3, color?:Color|Vec3){
        this.position.push(v);
        if(color){
            this.color?.push(V3(...color.elements));
        }
        if(normal){
            this.normal?.push(V3(...normal.elements));
        }
    }

    static FromVec3List(verts:Vec3[]){
        let va = new VertexArray3D();
        for(let v of verts){
            va.addVertex(v);
        }
        return va;
    }

}
