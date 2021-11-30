// import {BoundingBox} from "./BoundingBox";
// import {NodeTransform2D} from "./NodeTransform2D";
// import {V2, Vec2} from "./Vec2";
// import {VertexArray2D} from "./VertexArray2D";
// import {VertexPositionArray2DH} from "./VertexAttributeArray";
// import {Vec3} from "./Vec3";

import {BoundingBox2D} from "./BoundingBox2D";
import {BoundingBox} from "./BoundingBox";
import {V3, Vec3} from "./Vec3";
import {NodeTransform3D} from "./NodeTransform3D";
import {VertexArray3D} from "../ageometry/VertexArray3D";
import {VertexAttributeArray} from "../ageometry/VertexAttributeArray";
import {Vec4} from "./Vec4";
import {Vec2} from "./Vec2";
import {VertexArray2D} from "../ageometry/VertexArray2D";
import {VertexIndexArray} from "../ageometry/VertexIndexArray";
import * as THREE from "three";

export class BoundingBox3D extends BoundingBox<Vec3, NodeTransform3D>{
    clone():this{
        let cfunc:any=(this.constructor as any);
        let clone = new cfunc();
        clone.minPoint=this.minPoint?.clone();
        clone.maxPoint=this.maxPoint?.clone();
        clone.transform=this.transform.clone();
        return clone;
    }


    static FromVec3s(verts:Vec3[]){
        let va = VertexArray3D.FromVec3List(verts);
        return BoundingBox3D.FromVertexArray3D(va);
    }

    static BoxAtLocationWithSize(location:Vec3, size:number=100){
        let box = new BoundingBox3D();
        let hsize = size*0.5;
        box.boundPoint(V3(hsize, hsize, hsize));
        box.boundPoint(V3(-hsize, -hsize, -hsize));
        box.transform = new NodeTransform3D(location);
        return box;
    }

    static FromVertexArray3D(verts:VertexArray3D){
        let rval = new BoundingBox3D();
        rval.boundVertexPositionArrray(verts.position);
        return rval;
    }

    boundVertexPositionArrray(va:VertexAttributeArray<any>){
        let nverts = va.nVerts;
        for(let vi=0;vi<nverts;vi++){
            this.boundPoint(va.getAt(vi));
        }
    }

    static FromTHREEJSObject(obj:THREE.Object3D){
        let threebox = new THREE.Box3().setFromObject(obj);
        let bounds = new BoundingBox3D()
        bounds.minPoint=V3(threebox.min.x, threebox.min.y, threebox.min.z);
        bounds.maxPoint=V3(threebox.max.x, threebox.max.y, threebox.max.z);
        return bounds;
    }

    constructor() {
        super();
        this.transform = new NodeTransform3D();
    }

    randomPointObjectSpace(){
        let rand1 = Math.random();
        let rand2 = Math.random();
        let rand3 = Math.random();
        if(!this.minPoint || !this.maxPoint){
            return V3();
        }
        return V3(
            this.minPoint.x*rand1+this.maxPoint.x*(1-rand1),
            this.minPoint.y*rand2+this.maxPoint.y*(1-rand2),
            this.minPoint.z*rand3+this.maxPoint.z*(1-rand3),
        )
    }

    randomTransformedPoint(){
        return this.transform.getMatrix().times(this.randomPointObjectSpace().Point3DH).Point3D;
    }

    get center(){
        if(!this.minPoint || !this.maxPoint){
            return;
        }
        return this.transform.getMatrix().times(this.minPoint.plus(this.maxPoint).times(0.5).Point3DH).Point3D;
    }

    get localWidth(){
        // @ts-ignore
        return this.maxPoint.x-this.minPoint.x;
    }
    get localHeight(){
        // @ts-ignore
        return this.maxPoint.y-this.minPoint.y;
    }

    get localDepth(){
        // @ts-ignore
        return this.maxPoint.z-this.minPoint.z;
    }

    public boundPoint(p:Vec2|Vec3|Vec4):void{
        if(!this.minPoint || !this.maxPoint){
            let pcl = (p instanceof Vec3)?p:((p instanceof Vec4)?p.Point3D:Vec3.From2DHPoint(p));
            this.minPoint = pcl.clone();
            this.maxPoint = pcl.clone();
            return;
        }
        let ndim:number= Math.min(this.minPoint.nDimensions, p.elements.length);
        for(let c=0;c<ndim;c++){
            if(p.elements[c]<this.minPoint.elements[c]){
                this.minPoint.elements[c] = p.elements[c];
            }
            if(p.elements[c]>this.maxPoint.elements[c]){
                this.maxPoint.elements[c] = p.elements[c];
            }
        }
    }


    /**
     * [-1, -1, -1]
     * [1,  -1, -1]
     * [1,   1, -1]
     * [-1,  1, -1]
     * [-1, -1,  1]
     * [1,  -1,  1]
     * [1,   1,  1]
     * [-1,  1,  1]
     *
     * near face far face order
     * @returns {any[] | Vec3[]}
     */
    get corners() {
        let tmat = this.transform.getMatrix();
        if (!this.minPoint || !this.maxPoint) {
            return [];
        }
        return [
            tmat.times(this.minPoint.Point3DH).Point3D,
            tmat.times(V3(this.maxPoint.x, this.minPoint.y, this.minPoint.z).Point3DH).Point3D,
            tmat.times(V3(this.maxPoint.x, this.maxPoint.y, this.minPoint.z).Point3DH).Point3D,
            tmat.times(V3(this.minPoint.x, this.maxPoint.y, this.minPoint.z).Point3DH).Point3D,
            tmat.times(V3(this.minPoint.x, this.minPoint.y, this.maxPoint.z).Point3DH).Point3D,
            tmat.times(V3(this.maxPoint.x, this.minPoint.y, this.maxPoint.z).Point3DH).Point3D,
            tmat.times(this.maxPoint.Point3DH).Point3D,
            tmat.times(V3(this.minPoint.x, this.maxPoint.y, this.maxPoint.z).Point3DH).Point3D,
        ];
    }

    /**
     * gets minpoint, far bottom right, maxpoint, near top left, minpoint
     * @returns {VertexArray2D}
     * @constructor
     */
    GetBoundaryLinesVertexArray2D(){
        let va = new VertexArray2D();
        let corners = this.corners;
        if(!corners.length){
            return va;
        }

        va.addVertex(corners[0].XY);
        va.addVertex(corners[1].XY);
        va.addVertex(corners[2].XY);
        va.addVertex(corners[3].XY);
        va.addVertex(corners[0].XY);
        return va;
    }

    GetBoundaryLinesVertexArray(){
        let va = new VertexArray2D();
        let corners = this.corners;
        if(!corners.length){
            return va;
        }

        va.addVertex(corners[0].Point2D);
        va.addVertex(corners[1].Point2D);
        va.addVertex(corners[2].Point2D);
        va.addVertex(corners[3].Point2D);
        va.addVertex(corners[4].Point2D);
        va.addVertex(corners[5].Point2D);
        va.addVertex(corners[6].Point2D);
        va.addVertex(corners[7].Point2D);
        console.warn('have not specified indices for 3d boundary lines array');
        // indices should be defined.
        return va;
    }

    GetBoxTriangleMeshVerts(){
        let va = new VertexArray3D();
        let corners = this.corners;
        if(!corners.length){
            return va;
        }

        va.addVertex(corners[0]);
        va.addVertex(corners[1]);
        va.addVertex(corners[2]);
        va.addVertex(corners[3]);
        va.addVertex(corners[4]);
        va.addVertex(corners[5]);
        va.addVertex(corners[6]);
        va.addVertex(corners[7]);

        va.indices = new VertexIndexArray(3);
        //front
        va.indices.push([0,1,2]);
        va.indices.push([0,2,3]);

        //back
        va.indices.push([4,6,5]);
        va.indices.push([4,7,6]);

        // left
        va.indices.push([4,0,3]);
        va.indices.push([4,3,7]);

        //right
        va.indices.push([5,2,1]);
        va.indices.push([5,6,2]);

        // top
        va.indices.push([3,2,6]);
        va.indices.push([3,6,7]);

        //bottom
        va.indices.push([0,5,1]);
        va.indices.push([0,4,5]);

        // console.warn('have not specified indices for 3d boundary lines array');
        // indices should be defined.
        return va;
    }


    boundBounds(b:BoundingBox<any,any>){
        let corners = b.corners;
        for(let c of corners){
            this.boundPoint(c);
        }
    }

    // BoundingBox2D(cameraMatrix?:Mat4){
    //     let b = new BoundingBox2D();
    //     let corners = this.corners;
    //     for(let c of corners){
    //         let ct = this.transform.getMatrix().times(c.Point3DH);
    //         let pc = cameraMatrix?cameraMatrix.times(ct).Point3D:ct.Point3D;
    //         b.boundPoint(pc.Point2D);
    //     }
    //     return b;
    // }

    static FromBoundingBox2D(bounds2D:BoundingBox2D){
        let b = new BoundingBox3D();
        let corners = bounds2D.corners;
        for(let c of corners){
            b.boundPoint(Vec3.FromVec2(c));
        }
        return b;
    }

}
