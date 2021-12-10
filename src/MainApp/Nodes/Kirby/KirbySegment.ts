// import THREE, {Matrix4} from "three";
import * as THREE from 'three';
import { Matrix4 } from 'three';
import { BoundingBox3D, Color, Mat3, Mat4, NodeTransform3D, Quaternion, V2, V3, V4, Vec2, Vec3, VertexArray3D, AMaterial } from '../../../anigraph';

export class KirbySegment {
	start: Vec3;
	radius: number;
	colors: Color[] = [];
	mat: Matrix4 = new THREE.Matrix4().makeScale(1.0, 1.0, 1.0);
	transform: NodeTransform3D;
	material: string = '';
	constructor(start: Vec3, radius: number = 10, mat?: Matrix4, colors?: Color[], material?: string) {
		this.start = start;
		this.radius = radius;
		if (mat) {
			this.mat = mat;
		}
		if (colors) {
			this.colors = colors;
		}
		this.transform = new NodeTransform3D(this.start);
		if (material) this.material = material;
	}

	// get vec(){return this.end.minus(this.start);}
	// get direction(){return this.vec.getNormalized();}
	// get length(){return this.vec.L2();}

	getTransform() {
		return new NodeTransform3D(
			this.start
			// Quaternion.FromRotationBetweenTwoVectors(V3(0,0,1), this.direction)
		);
	}
	// Quaternion.FromRotationBetweenTwoVectors(V3(0,0,1), this.direction)

	getBounds() {
		let b = new BoundingBox3D();
		b.boundPoint(V3(this.radius, this.radius, this.radius));
		b.boundPoint(V3(-this.radius, -this.radius, -this.radius));
		b.transform = this.getTransform();
		return b;
	}

	ComputeGeometry() {
		let shape = VertexArray3D.CreateForRendering(true, true);
		let rotMatrix = new THREE.Matrix4();
		rotMatrix.set(
			1, 0, 0, 0,
			0, Math.cos(-Math.PI/2), -Math.sin(-Math.PI/2), 0,
			0, Math.sin(-Math.PI), Math.cos(-Math.PI), 0,
			0, 0, 0, 1
		);
		if(!this.mat.equals(new THREE.Matrix4().makeScale(1.0, 1.0, 1.0))){//hands and legs
			//shape = VertexArray3D.Ellipsoid(30,20,6,7,20, this.radius);
			shape = VertexArray3D.Sphere(this.radius);
		}
		else{//body
			shape = VertexArray3D.Sphere(this.radius);
			shape.ApplyMatrix(new Mat4(rotMatrix.elements));
		}
		// shape.ApplyMatrix(new Mat4(this.mat.elements));
		return shape;
	}
}
