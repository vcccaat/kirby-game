import {ARenderElement} from "../ARenderElement";
import * as THREE from "three";
import {VertexArray3D} from "../../ageometry/VertexArray3D";
import {ASerializable} from "../../aserial";

@ASerializable("ATriangleMeshElement")
export class ATriangleMeshElement extends ARenderElement{
    protected verts!:VertexArray3D;

    get mesh(){
        return this._element;
    }

    initGeometry(verts?:VertexArray3D){
        if(!this._geometry){
            if(verts){
                this.verts = verts;
            }
            this.setGeometry(this.verts);
        }else{
            throw new Error("Tried to re-init geometry in ATriangleMeshElements")
        }
    }

    _createDefaultMaterial(){
        return new THREE.MeshBasicMaterial({
            color: 0x22aa22,
            transparent: false,
            side: THREE.DoubleSide
        })
    }

    // init(verts?:VertexArray3D){
    //     // this.objectNode = NewObject3D();
    //     this.initGeometry(verts);
    //     if(this._element === undefined){
    //         this._element = new THREE.Mesh(
    //             this.geometry,
    //             this._createDefaultMaterial()
    //         );
    //         this._element.matrixAutoUpdate=false;
    //     }
    // }

    setVerts(verts:VertexArray3D){
        this.verts = verts;
        this.setGeometry(this.verts);
    }

    // updateGeometry(){
    //     this._geometry.setIndex(this.verts.indices.elements);
    //     for(let attribute in this.verts.attributes){
    //         this._geometry.setAttribute(attribute, this.verts.getAttributeArray(attribute).BufferAttribute());
    //     }
    // }

}


// this._geometry.setIndex(this.verts.indices.elements);
// for(let attribute in this.verts.attributes){
//     this._geometry.setAttribute(attribute, this.verts.getAttributeArray(attribute).BufferAttribute());
// }
