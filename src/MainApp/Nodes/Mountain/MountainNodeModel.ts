import * as THREE from 'three';
import { Vector3, Vector4 } from 'three';
import { ATexture, Color, V3, Vec3, Vec4, VertexArray3D } from '../../../anigraph';
import { ExampleNodeModel } from '../Example/ExampleNodeModel';

export class MountainNodeModel extends ExampleNodeModel {
	size: number = 1;

	constructor() {
		super();
		this.verts = VertexArray3D.FromThreeJS(new THREE.BoxBufferGeometry(50, 50, 50));
		//this.color = new Color(255, 80, 80, 0.5);
		this.setMaterial('mountain');
	}
}
