import * as THREE from 'three';
import { APointLightModel, V3, Vec3, ALoadedModel, Color } from '../../../anigraph';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { ATexture } from '../../../anigraph/arender/ATexture';

// const loader = new OBJLoader();
// const plantGeometry  =
// loader.loadAsync("./models/plants.obj");

const loader = new PLYLoader();
const plantGeometry = loader.loadAsync('./models/ply/binary/tree.ply');

export class PlantNodeModel extends ALoadedModel {
	static PlantObject3D: THREE.Object3D;
	constructor() {
		super(PlantNodeModel.PlantObject3D);
	}

	/**
	 * Define this to customize what gets created when you click the create default button in the GUI
	 * @constructor
	 */
	static async CreateDefaultNode() {
		if (!PlantNodeModel.PlantObject3D) {
			const geometry = await plantGeometry;
			PlantNodeModel.PlantObject3D = new THREE.Mesh(geometry);
		}

		let plants = new PlantNodeModel();
		plants.transform.scale = V3(1, 1, 1).times(20);
		plants.color = Color.FromString('#00603C');
		return plants;
	}
}
