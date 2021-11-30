import * as THREE from "three";
import {IUniform} from "three";
import {ATexture} from "../../arender/ATexture";
import {ShaderManager, ShaderProgramSource} from "./AShaderManager";
import {AMaterialModelBase} from "./AMaterialModel";
import {AShaderMaterial} from "./AShaderMaterial";
import {ShaderMaterialParameters} from "three/src/materials/ShaderMaterial";
import {Color} from "../../amath";


export type ShaderUniformDict = {[name:string]:IUniform<any>};

export abstract class AShaderModelBase<ParamInterface extends {[name:string]:any}> extends AMaterialModelBase<ParamInterface>{
    uniforms!:ShaderUniformDict;
    public textures:{[name:string]:ATexture}={};
    public sharedUniforms:ShaderUniformDict;

    protected _shaderSource!:ShaderProgramSource;
    get vertexSource(){return this._shaderSource.vertexSource;}
    get fragSource(){return this._shaderSource.fragSource;}

    protected _shaderSettings:ShaderMaterialParameters;
    get settingArgs(){return this._shaderSettings;}
    get usesLights(){return this.settingArgs['lights'];}
    get supportsTransparency(){return this.settingArgs['transparent'];}
    get usesVertexColors(){return this.settingArgs['vertexColors'];}
    get rendersWireframe(){return this.settingArgs['wireframe'];}

    public shaderSourcesLoadedPromise!:Promise<ShaderProgramSource>;


    get sourcesLoadedPromise(){
        // if(this._shaderSource instanceof Promise<ShaderProgramSource>){
        //     return this._shaderSource;
        // }else{
            return this._shaderSource.sourcesLoadedPromise;
        // }

    }

    constructor(shaderName?:string, shaderSettings?:ShaderMaterialParameters, uniforms?:ShaderUniformDict, sharedUniforms?:ShaderUniformDict, ...args:any[]) {
        super(shaderName, THREE.ShaderMaterial, ...args);
        this._shaderSettings = shaderSettings??{lights:true};
        this.uniforms=uniforms??{};
        this.sharedUniforms=sharedUniforms??{};
        if(shaderName) {
            this.setShader(shaderName);
        }
    }


    static ShaderUniformGUIColorControl(material:AShaderMaterial, paramKey?:string){
        const paramName = paramKey?paramKey:'color';
        let rval:{[name:string]:any} = {};
        rval[paramName] = {
            value: material.getUniformValue(paramName)?Color.FromTHREEVector4(material.getUniformValue(paramName)).toHexString():"#aaaaaa",
            onChange: (v: string) => {
                let selectedColor = Color.FromString(v);
                material.setUniformColor(paramName, selectedColor);
            },
        }
        return rval;
    }

    static ShaderUniformGUIControl(material:AShaderMaterial, paramName:string, defaultValue:any, otherSpecs:{[name:string]:any}){
        let rval:{[name:string]:any} = {};
        rval[paramName] = {
            value: material.getUniformValue(paramName)?material.getUniformValue(paramName):defaultValue,
            onChange: (v: string) => {
                material.setUniform(paramName, v, 'float');
            },
            ...otherSpecs
        }
        return rval;
    }



    // async _setShader(shaderName:string){
    //     const self = this;
    //     self._shaderSource= await ShaderManager.GetShaderSource(shaderName);
    //     return self._shaderSource;
    // }

    setShader(shaderName:string){
        // this.shaderSourcesLoadedPromise = this._setShader(shaderName);
        this._shaderSource= ShaderManager.GetShaderSource(shaderName);
    }

    setUniformsDict(uniforms:ShaderUniformDict){
        this.uniforms = uniforms;
    }
    setTexture(name:string, texture:ATexture|string){
        if(texture instanceof ATexture){
            this.textures[name]=texture;
        }else{
            this.textures[name]=new ATexture(texture);
        }
        this.setUniform(name, this.getTexture(name).threejs, 't');
    }

    getTexture(name:string){
        return this.textures[name];
    }

    setUniform(name:string, value:any, type?:string) {
        let uval: { [name: string]: any } = {value:value};
        if (type !== undefined) {
            uval['type'] = type;
        }
        // @ts-ignore
        this.uniforms[name] = uval;
    }

    getUniformValue(name:string) {
        let uniform = this.uniforms[name];
        return uniform?.value;
    }

    _CreateTHREEJS(){
        let uniforms = {uniforms:THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                {...this.uniforms}
            ])};
        return new this.materialClass({
            vertexShader: this.vertexSource,
            fragmentShader: this.fragSource,
            ...this.settingArgs,
            ...this.defaults,
            ...uniforms,
            ...this.sharedParameters,
        });
    }

    CreateMaterial(){
        let material =  new AShaderMaterial();
        material.init(this);
        return material;
    }

}

export class AShaderModel extends AShaderModelBase<{[name:string]:any}>{
}


