import { AMeshModel } from 'src/anigraph/amvc/node/mesh/AMeshModel';
import * as THREE from 'three';
import { Vector3, Vector4 } from 'three';
import { ALoadedModel, ATexture, Color, V3, Vec3, Vec4, VertexArray3D } from '../../../anigraph';
import { ExampleNodeModel } from '../Example/ExampleNodeModel';

export class WaterNodeModel extends ExampleNodeModel {
	size: number = 1;

	constructor() {
		super();
		this.verts = VertexArray3D.FromThreeJS(new THREE.BoxBufferGeometry(70, 50, 5));
		//this.color = new Color(255, 80, 80, 0.5);
		this.setMaterial('water');
	}
}
