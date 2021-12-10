import * as THREE from 'three';
import { TexturedMaterialModel } from './Materials/TexturedMaterialModel';
import { ATexture } from '../anigraph/arender/ATexture';
import { GroundMaterialModel } from './Materials/GroundMaterialModel';
import { StarterAppState } from './StarterAppState/StarterAppState';
import { KirbyGameAppState } from './StarterAppState/KirbyGameAppState';

export class MainAppState extends KirbyGameAppState {
	// export class MainAppState extends StarterAppState{
	/**
	 * Load any assets you want to use (e.g., custom textures, shaders, etc)
	 * @returns {Promise<void>}
	 * @constructor
	 */
	async PrepAssets() {
		// you can delete or replace setting the textures and shaders below if you don't want to use them.
		let kirbyTexture = await ATexture.LoadAsync('./images/kirby2.png');
		let trippyTexture = await ATexture.LoadAsync('./images/trippy.jpeg');
		let marbleTexture = await ATexture.LoadAsync('./images/marble.jpg');
		let pinkTexture = await ATexture.LoadAsync('./images/pink.jpg');
		let grassTexture = await ATexture.LoadAsync('./images/grass1.png');
		let pepperTexture = await ATexture.LoadAsync('./images/pepper.png');
		let bombTexture = await ATexture.LoadAsync('./images/bomb.png');
		// let plantTexture = await ATexture.LoadAsync('./images/plants.jpeg');
		// await this.materials.setMaterialModel('plants', new TexturedMaterialModel(plantTexture));
		await this.materials.setMaterialModel('kirby', new TexturedMaterialModel(kirbyTexture));
		await this.materials.setMaterialModel('trippy', new TexturedMaterialModel(trippyTexture));
		await this.materials.setMaterialModel('marble', new TexturedMaterialModel(marbleTexture));
		await this.materials.setMaterialModel('grass', new TexturedMaterialModel(grassTexture));
		await this.materials.setMaterialModel('ground', new GroundMaterialModel(marbleTexture));
		await this.materials.setMaterialModel('pepper', new TexturedMaterialModel(pepperTexture));
		await this.materials.setMaterialModel('bomb', new TexturedMaterialModel(bombTexture));
		await this.materials.setMaterialModel('pink', new TexturedMaterialModel(pinkTexture));
	}

	/**
	 * We will add the custom parameters to the gui controls with leva...
	 * @returns {{enemySpeed: {min: number, max: number, step: number, value: number}}}
	 */
	getControlPanelStandardSpec(): {} {
		const self = this;
		return {
			...super.getControlPanelStandardSpec(),
			// other custom app-level specs
		};
	}

	// For debugging, you can customize what happens when you select a model in the SceneGraph view (Menu->Show Scene Graph)
	handleSceneGraphSelection(m: any) {
		this.selectionModel.selectModel(m);
		console.log(`Model: ${m.name}: ${m.uid}`);
		console.log(m);
		console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`);
	}

	/**
	 * Initialize the scene model
	 * @returns {Promise<void>}
	 */
	async initSceneModel() {
		// delete this and replace with your own code
		super.initSceneModel();
		// this.initDebug();
	}

	/**
	 * Basic animation loop
	 */
	onAnimationFrameCallback() {
		// delete this and replace with your own code
		super.onAnimationFrameCallback();
	}
}
