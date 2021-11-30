import {folder} from "leva";
import {ASerializable} from "../../../aserial";
import {AObject, AObjectState, SelectionEvents} from "../../../aobject";
import {BoundingBox3D, Color, Mat4, NodeTransform3D, Quaternion, Vec3} from "../../../amath";
import {GeometrySet, HasBounds, VertexArray} from "../../../ageometry";
import {AModel} from '../../base'
import {ASceneModel} from "../../scene/ASceneModel";
import {AMaterial} from "../../material";

import {bezier} from "@leva-ui/plugin-bezier";
import {ACallbackSwitch} from "../../../aevents";
// import {AModel} from "../../base/AModel";

// import {SVGItem} from "../../amath/svg/SVGItem";


const MATERIAL_UPDATE_SUBSCRIPTION_HANDLE = 'MATERIAL_UPDATE_SUBSCRIPTION_SceneNodeModel';

@ASerializable("ASceneNodeModel")
export class ASceneNodeModel extends AModel implements HasBounds{
    static SupportsUploadedModels=false;
    @AObjectState geometry!:GeometrySet;
    @AObjectState color!:Color;
    @AObjectState _transform!:NodeTransform3D;
    @AObjectState selectable!:boolean;
    protected _material!:AMaterial;

    get transform(){return this._transform;}
    setTransform(t:NodeTransform3D){this._transform=t;}
    protected set transform(t:NodeTransform3D){
        this.setTransform(t);
    }


    get material(){return this._material;}
    get verts():VertexArray<any>{
        return this.geometry.verts;
    }
    set verts(v:VertexArray<any>){
        this.geometry.verts = v;
    }

    getBounds(): BoundingBox3D {
        let b = this.geometry.getBounds();
        // b.transform = this.transform.clone();
            b.transform = this.getWorldTransform();
        return b;
    }

    addEnterSelectionListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(SelectionEvents.SelectionItemEnter, callback, handle);
    }

    addExitSelectionListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(SelectionEvents.SelectionItemExit, callback, handle);
    }

    getModelGUIControlSpec():{[name:string]:any}{
        let self = this;
        return {
            ModelName: {
                value:self.name,
                onChange:(v:any)=>{
                    self.name = v;
                }
            },

            color: {
                value: self.color.RGBuintAfloat,
                onChange: (v:any) => {
                    self.color = Color.FromRGBuintAfloat(v);
                },
            },

            depth: {
                value: self.transform.position.z,
                onChange:(v:any)=>{
                    self.transform.position.z = v;
                },
                min: -500,
                max: 500,
                step:1
            },
            position: {
                value: {x: self.transform.position.x, y:self.transform.position.y},
                joystick: "invertY",
                step: 10,
                onChange:(v: any)=>{
                    self.transform.position = new Vec3(v.x, v.y, self.transform.position.z);
                }
            },
            ...self.material.getMaterialGUIParams(),
            Transform: folder(
                {
                    // rotationX: {
                    //     value: Math.acos(self.transform.rotation.w)*2,
                    //     onChange: (v:number) => {
                    //         // let axisangle = this.transform.rotation.getAxisAndAngle();
                    //         // let axis = axisangle['axis'];
                    //         // if(axis.L2()>0){
                    //         //     this.transform.rotation = Quaternion.FromAxisAngle(axisangle['axis'], v);
                    //         // }else if(v>0){
                    //         this.transform.rotation = Quaternion.FromAxisAngle(new Vec3(0.0,0.0,1.0), v);
                    //         // }
                    //     },
                    //     step: 0.2
                    // },
                    // rotationY: {
                    //     value: Math.acos(self.transform.rotation.w)*2,
                    //     onChange: (v:number) => {
                    //         // let axisangle = this.transform.rotation.getAxisAndAngle();
                    //         // let axis = axisangle['axis'];
                    //         // if(axis.L2()>0){
                    //         //     this.transform.rotation = Quaternion.FromAxisAngle(axisangle['axis'], v);
                    //         // }else if(v>0){
                    //         this.transform.rotation = Quaternion.FromAxisAngle(new Vec3(0.0,1.0,0.0), v);
                    //         // }
                    //     },
                    //     step: 0.2
                    // },
                    // rotationZ: {
                    //     value: Math.acos(self.transform.rotation.w)*2,
                    //     onChange: (v:number) => {
                    //         // let axisangle = this.transform.rotation.getAxisAndAngle();
                    //         // let axis = axisangle['axis'];
                    //         // if(axis.L2()>0){
                    //         //     this.transform.rotation = Quaternion.FromAxisAngle(axisangle['axis'], v);
                    //         // }else if(v>0){
                    //         this.transform.rotation = Quaternion.FromAxisAngle(new Vec3(1.0,0.0,0.0), v);
                    //         // }
                    //     },
                    //     step: 0.2
                    // },
                    scale: {
                        value: self.transform.scale.x,
                        min:0,
                        max:500,
                        step:0.01,
                        onChange:(v: any)=>{
                            self.transform.scale = new Vec3(v,v,v);
                        }
                    },

                    // curve: bezier({ handles: [0.54, 0.05, 0.6, 0.98], graph: true})

                    // anchor: {
                    //     value: {x: self.transform.anchor.x, y:self.transform.anchor.y},
                    //     joystick: "invertY",
                    //     step: 5,
                    //     onChange:(v: any)=>{
                    //         self.transform.anchor = new Vec3(v.x, v.y, 0);
                    //     }
                    // },
                },
                { collapsed: true }
            ),


        }
    }

    constructor() {
        super();
        this.geometry = new GeometrySet();
        this._transform = new NodeTransform3D();
        this.color = Color.Random();
        this.selectable = true;
        // this.initMaterial();
    }

    setMaterial(material:AMaterial){
        if(this.material === material){
            return;
        }else{
            let color = this.color;
            if(this.material){
                this._disposeMaterial()
            }
            this._material = material;
            if(color) {
                this._material.setModelColor(color);
            }
            this.setMaterialUpdateSubscriptions();
        }
        this.signalEvent(AMaterial.Events.CHANGE)

    }

    /**
     * IMPORTANT: There should only be one of these.
     */
    setMaterialUpdateSubscriptions(){
        const self = this;
        this.subscribe(this.material.addEventListener(AMaterial.Events.UPDATE, (...args:any[])=>{
            self.onMaterialUpdate(AMaterial.Events.UPDATE, ...args)
        }), MATERIAL_UPDATE_SUBSCRIPTION_HANDLE);
        this.material.subscribe(this.addStateKeyListener('color', ()=>{
            self.material.setModelColor(self.color);
            if('opacity' in self.material._material) self.material.setValue('opacity', self.color.a);
        }))
    }

    onMaterialUpdate(...args:any[]){
        this.signalEvent(AMaterial.Events.UPDATE, ...args);
    }

    addMaterialUpdateListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(AMaterial.Events.UPDATE, callback, handle);
    }
    addMaterialChangeListener(callback:(...args:any[])=>void, handle?:string){
        return this.addEventListener(AMaterial.Events.CHANGE, callback, handle);
    }

    _disposeMaterial(){
        this.unsubscribe(MATERIAL_UPDATE_SUBSCRIPTION_HANDLE);
        this.material.dispose();
    }


    addTransformListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true):ACallbackSwitch{
        return this.addStateKeyListener('_transform', callback, handle, synchronous);
    }

    addGeometryListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addStateKeyListener('geometry', callback, handle, synchronous);
    }
    addColorListener(callback:(self:AObject)=>void, handle?:string, synchronous:boolean=true){
        return this.addStateKeyListener('color', callback, handle, synchronous);
    }


    getWorldTransform(){
        let parent_ObjToWorld = Mat4.Identity();
        let parent = this.parent;
        while(parent && parent instanceof ASceneNodeModel){
            let parent_Model = parent.transform.getMatrix()
            parent_ObjToWorld = parent_Model.times(parent_ObjToWorld);
            parent = parent.parent;
        }
        let worldmat =  parent_ObjToWorld.times(this.transform.getMatrix());
        let worldpos = parent_ObjToWorld.times(this.transform.position.Point3DH).Point3D;
        return new NodeTransform3D(worldmat, worldpos, this.transform.rotation.clone());
    }

    getWorldPosition(){
        return this.getWorldTransform().position;
    }

    getSceneModel(){
        let scenemodel = this;
        while(!(scenemodel instanceof ASceneModel) && scenemodel.parent){
            // @ts-ignore
            scenemodel = scenemodel.parent;
        }
        return scenemodel;
    }
}

