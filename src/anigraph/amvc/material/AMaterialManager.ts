import * as THREE from 'three';
import { MeshBasicMaterialParameters } from 'three';
import { AObject } from '../../aobject';
import { AMaterialModelBase } from './AMaterialModel';
import { AMaterial } from './AMaterial';
import { Color } from '../../amath';
import { ASerializable } from '../../aserial';
import { MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial';
import { ExampleShaderModel } from './ExampleShaderModel';
import { ShaderManager } from './AShaderManager';
import { AShaderModel, AShaderModelBase } from './AShaderModel';
import { AShaderMaterial } from './AShaderMaterial';
import { ATexture } from '../../arender/ATexture';

enum DefaultMaterials {
	Basic = 'MeshBasicMaterial',
	Standard = 'MeshStandardMaterial',
	Normal = 'MeshNormalMaterial',
	Depth = 'MeshDepthMaterial',
	Phong = 'MeshPhongMaterial',
}

@ASerializable('ABasicMaterialModel')
export class ABasicMaterialModel extends AMaterialModelBase<MeshBasicMaterialParameters> {
	constructor() {
		super(
			DefaultMaterials.Basic,
			THREE.MeshBasicMaterial,
			{},
			{
				color: undefined,
				transparent: true,
				opacity: 1,
				side: THREE.DoubleSide,
				depthWrite: true,
			}
		);
	}
	get color() {
		return Color.FromThreeJS(this.sharedParameters['color']);
	}
	set color(c: Color) {
		this.sharedParameters['color'] = c.asThreeJS();
	}
	getMaterialGUIParams(material: AMaterial) {
		const self = this;
		return {
			// ...AMaterialModelBase.MaterialGUIColorControl(material),
			...AMaterialModelBase.MaterialGUIControl(material, 'opacity', 1, {
				min: 0,
				max: 1,
				step: 0.01,
			}),
		};
	}
}

@ASerializable('AStandardMaterialModel')
export class AStandardMaterialModel extends AMaterialModelBase<MeshStandardMaterialParameters> {
	constructor() {
		super(
			DefaultMaterials.Standard,
			THREE.MeshStandardMaterial,
			{},
			{
				// color: Color.FromString('#888888').asThreeJS(),
				transparent: true,
				opacity: 1,
				side: THREE.DoubleSide,
				depthWrite: true,
				metalness: 0.0,
				roughness: 1.0,
			}
		);
	}

	getMaterialGUIParams(material: AMaterial) {
		const self = this;
		return {
			// ...AMaterialModelBase.MaterialGUIColorControl(material),
			...AMaterialModelBase.MaterialGUIControl(material, 'opacity', 1, {
				min: 0,
				max: 1,
				step: 0.01,
			}),
			...AMaterialModelBase.MaterialGUIControl(material, 'roughness', 1, {
				min: 0,
				max: 1,
				step: 0.01,
			}),
			...AMaterialModelBase.MaterialGUIControl(material, 'metalness', 0, {
				min: 0,
				max: 1,
				step: 0.01,
			}),
		};
	}
}

// @ASerializable("ATexturedMaterialModel")
// export class  ATexturedMaterialModel extends AMaterialModelBase<MeshStandardMaterialParameters> {
//     constructor(texturePath:string) {
//         super(
//             DefaultMaterials.Standard,
//             THREE.MeshStandardMaterial,
//             {},
//             {
//                 transparent: true,
//                 opacity: 1,
//                 side: THREE.DoubleSide,
//                 depthWrite: true,
//                 metalness: 0.0,
//                 roughness: 1.0,
//                 map:new THREE.TextureLoader().load(texturePath),
//             });
//     }
//
//     getMaterialGUIParams(material:AMaterial){
//         const self = this;
//         return {
//             // ...AMaterialModelBase.MaterialGUIColorControl(material),
//             ...AMaterialModelBase.MaterialGUIControl(material, 'opacity', 1, {
//                 min:0,
//                 max:1,
//                 step:0.01
//             }),
//             ...AMaterialModelBase.MaterialGUIControl(material, 'roughness', 1, {
//                 min:0,
//                 max:1,
//                 step:0.01
//             }),
//             ...AMaterialModelBase.MaterialGUIControl(material, 'metalness', 0, {
//                 min:0,
//                 max:1,
//                 step:0.01
//             })
//         }
//     }
// }

ShaderManager.LoadShader('toon', 'toon/toon.vert.glsl', 'toon/toon.frag.glsl');
@ASerializable('CustomToonShaderModel')
export class CustomToonShaderModel extends AShaderModel {
	constructor() {
		super('toon');
	}

	CreateMaterial() {
		let mat = super.CreateMaterial();
		mat.setUniform('ambient', 0.2);
		mat.setUniform('exposure', 1.0);
		mat.setUniform('specularExp', 10);
		mat.setUniform('specular', 1.0);
		mat.setUniform('diffuse', 2.5);
		mat.setUniform('specularCutoff', 0.95);
		mat.setUniform('inkingCutoff', 0.2);
		mat.setUniform('TOON', 1.0);
		mat.setUniformColor('mainColor', Color.FromString('#aaaaaa'));
		mat.setTexture('color', 'trippy.jpeg');
		return mat;
	}

	getMaterialGUIParams(material: AShaderMaterial) {
		const self = this;
		return {
			...AShaderModelBase.ShaderUniformGUIColorControl(material, 'mainColor'),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'TOON', 0.0, {
				min: 0,
				max: 1,
				step: 0.01,
			}),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'specularExp', 10, {
				min: 0,
				max: 100,
				step: 0.01,
			}),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'specular', 1.0, {
				min: 0,
				max: 5,
				step: 0.01,
			}),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'diffuse', 1.0, {
				min: 0,
				max: 5,
				step: 0.01,
			}),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'ambient', 1.0, {
				min: 0,
				max: 2,
				step: 0.01,
			}),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'exposure', 1, {
				min: 0,
				max: 20,
				step: 0.01,
			}),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'specularCutoff', 0.95, {
				min: 0,
				max: 1,
				step: 0.001,
			}),
			...AShaderModelBase.ShaderUniformGUIControl(material, 'inkingCutoff', 0.95, {
				min: 0,
				max: 1,
				step: 0.001,
			}),
		};
	}

	_CreateTHREEJS() {
		let uniforms = { uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib['lights'], { ...this.uniforms }]) };
		return new this.materialClass({
			vertexShader: this.vertexSource,
			fragmentShader: this.fragSource,
			vertexColors: true,
			...this.settingArgs,
			...this.defaults,
			...uniforms,
			...this.sharedParameters,
		});
	}
}

export class AMaterialManager extends AObject {
	materials: { [name: string]: AMaterialModelBase<any> };
	static DefaultMaterials = DefaultMaterials;
	public materialsLoadedPromise: Promise<void>;

	get ClassConstructor() {
		return this.constructor as typeof AMaterialManager;
	}
	constructor() {
		super();
		this.materials = {};
		this.materialsLoadedPromise = this.initMaterialModels();
	}

	async initMaterialModels() {
		const self = this;

		this.setMaterialModel(DefaultMaterials.Basic, new ABasicMaterialModel());

		this.setMaterialModel(DefaultMaterials.Standard, new AStandardMaterialModel());

		await ShaderManager._shaderPromises['example2'];
		self.setMaterialModel('Example2', new AShaderModel('example2'));

		await ShaderManager._shaderPromises['normal'];
		self.setMaterialModel('Normals', new AShaderModel('normal'));

		await ShaderManager._shaderPromises['example1'];
		self.setMaterialModel('Glow', new ExampleShaderModel());

		await ShaderManager._shaderPromises['toon'];
		self.setMaterialModel('Toon', new CustomToonShaderModel());
	}

	getGUIMaterialOptionsList() {
		// await this.materialsLoadedPromise;
		let rval: { [name: string]: string } = {};
		for (let m in this.materials) {
			rval[m] = m;
		}
		return rval;
	}

	async setMaterialModel(name: string, m: AMaterialModelBase<any>) {
		if (m instanceof AShaderModelBase) {
			await m.sourcesLoadedPromise;
		}
		this.materials[name] = m;
	}

	getMaterialModel(name: string) {
		console.log('get material model', name);
		return this.materials[name];
	}
}
