import {ASceneNodeModel} from "../base";
import {VertexArray3D} from "../../../ageometry";
import {ATexture} from "../../../arender/ATexture";
import {AObject} from "../../../aobject";
import {ACamera} from "../../camera";


export class AMeshModel extends ASceneNodeModel{
    static TextureKeyForName(name:string){return name+'Map';}
    protected _textures:{[name:string]:ATexture}={};
    get colorTexture(){return this.getTexture('color');}
    set colorTexture(aTexture:ATexture){this.setTexture('color', aTexture);}
    get normalTexture(){return this.getTexture('normal');}
    set normalTexture(aTexture:ATexture){this.setTexture('normal', aTexture);}

    static _TextureEventForName(name:string){return 'TextureSet_'+name;}

    getTexture(name:string){
        return this._textures[AMeshModel.TextureKeyForName(name)];
    }
    setTexture(name:string, texture:ATexture|string){
        if(texture instanceof ATexture){
            this._textures[AMeshModel.TextureKeyForName(name)]=texture;
        }else{
            this._textures[AMeshModel.TextureKeyForName(name)]=new ATexture(texture);
        }
        this.signalTextureSet(name);
    }

    signalTextureSet(name:string){
        this.signalEvent(AMeshModel._TextureEventForName(name));
    }

    addTextureListener(callback:(self:AObject)=>void, handle?:string){
        return this.addEventListener(ACamera.CameraUpdateEvents.POSE_UPDATED, callback,  handle);
    }

    constructor(colorTexture?:string|ATexture, normalTexture?:string|ATexture) {
        super();

        if(colorTexture instanceof ATexture){this.colorTexture=colorTexture;}
        else if(colorTexture){this.colorTexture=new ATexture(colorTexture);}

        if(normalTexture instanceof ATexture){this.normalTexture=normalTexture;}
        else if(normalTexture){this.normalTexture=new ATexture(normalTexture);}

    }

    get verts():VertexArray3D{
        return this.geometry.verts as VertexArray3D;
    }
    set verts(v:VertexArray3D){
        this.geometry.verts = v;
    }

}
