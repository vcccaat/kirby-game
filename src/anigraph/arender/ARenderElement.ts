import * as THREE from "three";
import {Color} from "../amath";
import {VertexArray, VertexArray2D, VertexArray3D} from "../ageometry"
import {ARenderObject} from "./ARenderObject";
import {AMaterial} from "../amvc/material/AMaterial";
import {ASerializable} from "../aserial";


@ASerializable("ARenderElementBase")
export abstract class ARenderElementBase extends ARenderObject{
    dispose(){
        super.dispose();
        if(this.geometry){
            this.geometry.dispose();
        }
    }
    abstract get geometry():THREE.BufferGeometry;
    abstract get material():THREE.Material|THREE.Material[];
}

@ASerializable("ARenderElement")
export class ARenderElement extends ARenderElementBase{
    _geometry!:THREE.BufferGeometry;
    _material!:THREE.Material|THREE.Material[];
    _element!:THREE.Mesh;
    get geometry(): THREE.BufferGeometry {
        return this._geometry;
    }
    get material(): THREE.Material|THREE.Material[]{
        return this._material;
    }
    get threejs(){
        return this._element;
    }

    // dispose() {
    //     super.dispose();
    //     if(this._element){
    //         this._element.dispose();
    //     }
    // }

    onMaterialChange(newMaterial:AMaterial){
        this.setMaterial(newMaterial.threejs);
    }
    // onMaterialUpdate(newMaterial:AMaterial){
    //     this.material.setValues(newMaterial.)
    // }


    /**
     * Use to create and immediately init
     * @param geometry
     * @param material
     * @param args
     * @returns {ARenderElement}
     * @constructor
     */
    static Create(
        geometry?:THREE.BufferGeometry|VertexArray<any>,
        material?:Color|THREE.Color|THREE.Material|THREE.Material[],
        ...args:any[]){
        let newElement = new this(geometry, material, ...args);
        newElement.init();
        return newElement;
    }


    setMaterialAttribute(name:string, value:any){
        if(name in this.material){
            if(value instanceof THREE.Color || value instanceof THREE.Vector2||value instanceof THREE.Vector3||value instanceof THREE.Vector4){
                // @ts-ignore
                this.material[name].set(value);
            }else if (typeof value === 'number' || typeof value === 'string'){
                // @ts-ignore
                this.material[name]=value;
            }else{
                throw new Error(`Not sure how to set "${name}" attribute on material: ${this.material}`);
            }
        }else{
            throw new Error(`tried to set "${name}" attribute on material with no such attribute: ${this.material}`);
        }
    }

    setColor(color:Color|THREE.Color){
        if('color' in this.material) {
            this.setMaterialAttribute('color', (color instanceof Color) ? color.asThreeJS() : color);
        }
        if(color instanceof Color) {
            this.setMaterialAttribute('opacity', color.a);
        }
    }

    setOpacity(opacity:number) {
        this.setMaterialAttribute('opacity', opacity);
    }

    /**
     * For some subclasses this will be different from setGeometry, because some subclasses will compute procedural
     * geometry based on verts and then set the geometry to the output of that procedure
     * @param verts
     */
    setVerts(verts:VertexArray<any>){
        if(verts instanceof VertexArray2D && 'setVerts2D' in this){
            // @ts-ignore
            this.setVerts2D(verts);
        }else{
            this.setGeometry(verts);
        }
    }

    _setBufferGeometry(verts:VertexArray<any>){
        if(verts.nVerts==0){
            return;
        }
        this._geometry.setIndex(verts.indices.elements);
        for (let attribute in verts.attributes) {
            this._geometry.setAttribute(attribute, verts.getAttributeArray(attribute).BufferAttribute());
        }
    }

    setGeometry(geometry:THREE.BufferGeometry|VertexArray<any>){
        if(geometry instanceof THREE.BufferGeometry){
            if(this._geometry) {
                throw new Error(`called setGeometry with THREE.BufferGeometry when _geometry is already set...`);
            }else{
                this._geometry = geometry;
            }
        }else{
            if(!(geometry instanceof VertexArray3D)){
                // throw new Error(`cannot set geometry with non-VertexArray3D VertexArray... ${geometry}`);
                // @ts-ignore
                this.setVerts2D(geometry);
                return;
            }else {
                if (!this._geometry) {
                    this._geometry = new THREE.BufferGeometry();
                }
                this._setBufferGeometry(geometry);
            }
        }
    }

    static _GetMaterialFromParam(material:Color|THREE.Color|THREE.Material|THREE.Material[]){
        if(material instanceof Color || material instanceof THREE.Color){
            let threecolor = (material instanceof Color)?material.asThreeJS():material;
            let opacity = (material instanceof Color)?material.a:1.0;
            return new THREE.MeshBasicMaterial(
                {
                    color: threecolor,
                    transparent:true,
                    opacity:opacity,
                    side: THREE.DoubleSide,
                    depthWrite: true
                });
            // return new THREE.MeshStandardMaterial(
            //     {
            //         color: (material instanceof Color)?material.asThreeJS():material,
            //         transparent:false,
            //         opacity:1,
            //         side: THREE.DoubleSide,
            //         depthWrite: true
            //     });


        }else{
            return material;
        }
    }

    setMaterial(material:Color|THREE.Color|THREE.Material|THREE.Material[]){
        this._material = ARenderElement._GetMaterialFromParam(material);
        if(this._element){
            this._element.material=this._material;
        }
    }


    /**
     * If you provide just geometry, it will create the geometry but not the element
     * if you provide geometry and material, it will create the element
     * @param geometry
     * @param material
     */
    constructor(
        geometry?:THREE.BufferGeometry|VertexArray<any>,
        material?:Color|THREE.Color|THREE.Material|THREE.Material[],
        ...args:any[])
    {
        super();
        if(geometry){
            this.setGeometry(geometry);
        }
        if(material){
            this.setMaterial(material);
        }
        if(this.threejs){
            if(this.threejs.name ==""){
                this.setObject3DName(this.serializationLabel);
            }
        }
    }

    init(geometry?:THREE.BufferGeometry|VertexArray<any>, material?:Color|THREE.Color|THREE.Material|THREE.Material[]) {
        if(this._element){
            throw new Error(`Tried to call init on RenderElement that already has _element ${this._element}`);
        }
        this._initIfNotAlready(geometry, material);
    }

    _initIfNotAlready(geometry?:THREE.BufferGeometry|VertexArray<any>, material?:Color|THREE.Color|THREE.Material|THREE.Material[]) {
        if(geometry){
            this.setGeometry(geometry);
        }
        if(material){
            this.setMaterial(material);
        }
        if(this.material && this.geometry) {
            this._element = new THREE.Mesh(this.geometry, this.material);
            this._element.matrixAutoUpdate=false;
        }else{
            throw new Error(`Was unable to initialize render element:\ngeometry:${this.geometry}\nmaterial:${this.material}`)
        }
    }
}
