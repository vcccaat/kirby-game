import * as THREE from "three";
import {AInstanceElements} from "../../arender/basic/AInstanceElements";
import {Color} from "../../amath";
import {VertexArray2D} from "../../ageometry";
import {AParticle, AParticleEnums} from "./AParticle";
import {AParticlesElement} from "./AParticlesElement";
import {VertexArray3D} from "../../ageometry/VertexArray3D";

// import

export abstract class AParticleInstancesElement extends AInstanceElements implements AParticlesElement{
    abstract setParticle(index:number, particle:AParticle):void;
    protected _mesh!:THREE.InstancedMesh
    protected _geometry!:THREE.BufferGeometry;
    protected _material!:THREE.Material;
    protected camera!:THREE.Camera;
    get particleTexture(){return "images/gradientParticle.jpg"}

    get threejs(){
        return this.mesh;
    }

    constructor(count?:number, verts?:VertexArray2D) {
        super();
        count = (count!==undefined)?count:AParticleEnums.DEFAULT_MAX_N_PARTICLES;
        this.init(verts, undefined, count);
    }

    setCamera(camera:THREE.Camera){
        this.camera = camera;
    }


    setMaterial(material:THREE.Material){
        if(this._material !== undefined){
            this._material.dispose();
        }
        this._material = material;
    }


    setNeedsUpdate(){
        this.threejs.instanceMatrix.needsUpdate=true;
        // if(this.threejs.instanceColor){
        // @ts-ignore
        this.threejs.instanceColor.needsUpdate=true;
        // }

    }

    setVerts(verts:VertexArray2D|number[]){
        if(this._geometry){
            this._geometry.dispose();
        }
        this._setGeometryPlane();
        if(this._mesh){
            this._mesh.geometry = this._geometry;
        }
    }

    _setGeometryPlane(){
        let geometry = VertexArray3D.SquareXYUV(1);
        this._geometry = new THREE.BufferGeometry();
        this._geometry.setIndex(geometry.indices.elements);
        for(let attribute in geometry.attributes){
            this._geometry.setAttribute(attribute, geometry.getAttributeArray(attribute).BufferAttribute());
        }
    }


    init(verts?:VertexArray2D|number[], material?:THREE.Material, count?:number){
        count = count!==undefined?count:AParticleEnums.DEFAULT_MAX_N_PARTICLES;
        if(verts){
            this.setVerts(verts);
        }else{
            this._setGeometryPlane();
        }
        if(material){
            this.setMaterial(material);
        }else {
            this.setMaterial(
                new THREE.MeshBasicMaterial({
                    depthWrite: false,
                    transparent:true,
                    // alphaTest:0.2,
                    alphaMap: new THREE.TextureLoader().load(this.particleTexture),
                    // alphaMap: new THREE.Texture(particleTex)
                })
            );
        }
        if(this._geometry && this._material){
            this._mesh = new THREE.InstancedMesh(this._geometry, this._material, count);
            // this.threejs.matrixAutoUpdate=false;
            this.mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );
            this.setColorAt(0, Color.FromString("#ff0000"));
            // @ts-ignore
            this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage );
            // this.setUsage()
        }
    }

}
