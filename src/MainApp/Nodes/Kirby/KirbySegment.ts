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
		let shape = VertexArray3D.Sphere(this.radius);
		shape.ApplyMatrix(new Mat4(this.mat.elements));
		return shape;
	}
}
