import * as THREE from 'three';
import { APointLightModel, V3, Vec3, ALoadedModel, Color, Quaternion } from '../../../anigraph';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { ATexture } from '../../../anigraph/arender/ATexture';

// const loader = new OBJLoader();
// const plantGeometry  =
// loader.loadAsync("./models/plants.obj");

const loader = new PLYLoader();
const starGeometry = loader.loadAsync('./models/star.ply');

export class StarNodeModel extends ALoadedModel {
	static StarObject3D: THREE.Object3D;
	constructor() {
		super(StarNodeModel.StarObject3D);
	}

	/**
	 * Define this to customize what gets created when you click the create default button in the GUI
	 * @constructor
	 */
	static async CreateDefaultNode() {
		if (!StarNodeModel.StarObject3D) {
			const geometry = await starGeometry;
			StarNodeModel.StarObject3D = new THREE.Mesh(geometry);
		}

		let star = new StarNodeModel();
		star.transform.scale = V3(1, 1, 1).times(3);
		star.transform.rotation = Quaternion.RotationZ(Math.PI * 0.5).times(Quaternion.RotationX(Math.PI * 0.5));
		star.color = Color.FromString('#FFFF00');
		return star;
	}
}
