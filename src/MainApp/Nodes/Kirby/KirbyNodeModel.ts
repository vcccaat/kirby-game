import * as THREE from 'three';
import {
	ALoadedModel,
	AMaterialManager,
	AObjectState,
	ASceneNodeModel,
	BoundingBox3D,
	ASerializable,
	BezierTween,
	Color,
	GetAppState,
	Quaternion,
	Vec3,
	V3,
	VertexArray3D,
} from '../../../anigraph';
import { bezier } from '@leva-ui/plugin-bezier';
import { AMeshModel } from '../../../anigraph/amvc/node/mesh/AMeshModel';
import { KirbySegment } from './KirbySegment';
import { Vector3 } from 'three';

const DEFAULT_DURATION = 1.5;

@ASerializable('KirbyModel')
export class KirbyNodeModel extends AMeshModel {
	//Our vertices
	@AObjectState segments: KirbySegment[];
	@AObjectState tween: BezierTween;
	@AObjectState spinDuration: number;
	@AObjectState nSpins: number;
	@AObjectState isSpinning: boolean;
	@AObjectState isJumping: boolean;
	@AObjectState isMoving: boolean;
	@AObjectState currentFrame: number;
	@AObjectState gravityFrame: number;
	@AObjectState movingFrame: number;
	@AObjectState upV: Vec3;
	@AObjectState isUp: boolean;
	@AObjectState isPulling: boolean;

	@AObjectState nSegments: [number, number];
	@AObjectState radius: number;

	constructor(segments?: KirbySegment[], ...args: any[]) {
		super();
		this.tween = new BezierTween(0.33, -0.6, 0.66, 1.6);
		this.spinDuration = DEFAULT_DURATION;
		this.nSpins = 3;
		this.isSpinning = false;
		this.isJumping = false;
		this.isMoving = false;
		this.currentFrame = 0;
		this.gravityFrame = 0;
		this.movingFrame = 0;
		this.upV = new Vec3(0, 0, 0);
		this.isUp = true;
		this.isPulling = false;

		this.nSegments = [50, 50];
		this.radius = 1;

		this.segments = [];
		if (segments) {
			this.segments = segments;
		}

		const self = this;
		// this.subscribe(
		//   this.addStateKeyListener("nSegments", () => {
		//     self.updateGeometry();
		//   })
		// );

		// this.subscribe(
		//   this.addStateKeyListener("radius", () => {
		//     self.updateGeometry();
		//   })
		// );
		this.subscribe(
			this.addStateKeyListener('segments', () => {
				self.geometry.touch();
			})
		);
	}

	//   updateGeometry() {
	//     this.verts = VertexArray3D.Sphere(
	//       this.radius,
	//       this.nSegments[0],
	//       this.nSegments[1]
	//     );
	//   }

	/**
	 * Define this to customize what gets created when you click the create default button in the GUI
	 * @constructor
	 */
	static async CreateDefaultNode(radius: number = 20, height = 10, samples: number = 50, isSmooth: boolean = true, ...args: any[]) {
		let kirbyModel = new this();
		let locations = [
			V3(20, 0, 25), //right hand
			V3(0, 0, 25),
			// V3(new Vector3(0, 0, 25).applyQuaternion(Quaternion.RotationZ(Math.PI * 0.5))), //body
			V3(-20, 0, 25), //left hand
			V3(10, 0, 8), //right leg
			V3(-10, 0, 8), //left leg
		];
		kirbyModel.segments = [
			new KirbySegment(locations[0], 0.3 * radius, new THREE.Matrix4().makeScale(1.0, 1.0, 0.8), [Color.FromString('#FFC0CB'), Color.FromString('#FFC0CB')], 'pink'),
			new KirbySegment(locations[1], radius, new THREE.Matrix4().makeScale(1.0, 1.0, 1.0), [Color.FromString('#FFC0CB'), Color.FromString('#FFC0CB')], 'kirby'),
			new KirbySegment(locations[2], 0.3 * radius, new THREE.Matrix4().makeScale(1.0, 1.0, 0.8), [Color.FromString('#FFC0CB'), Color.FromString('#FFC0CB')], 'pink'),
			new KirbySegment(locations[3], 0.4 * radius, new THREE.Matrix4().makeScale(1.0, 1.0, 0.8), [Color.FromString('#ad1d46'), Color.FromString('#ad1d46')],'kirbyfoot'),
			new KirbySegment(locations[4], 0.4 * radius, new THREE.Matrix4().makeScale(1.0, 1.0, 0.8), [Color.FromString('#ad1d46'), Color.FromString('#ad1d46')],'kirbyfoot'),
		];

		return kirbyModel;
	}

	getModelGUIControlSpec(): { [p: string]: any } {
		const self = this;
		const specs = {
			spinDuration: {
				value: self.spinDuration,
				min: 0.5,
				max: 10,
				step: 0.1,
				onChange(v: any) {
					self.spinDuration = v;
				},
			},
			nSpins: {
				value: self.nSpins,
				min: 1,
				max: 10,
				step: 1,
				onChange(v: any) {
					self.nSpins = v;
				},
			},
			curve: bezier({
				handles: self.tween.x1y1x2y2,
				graph: true,
				onChange: (v: any) => {
					self.tween.x1y1x2y2 = [v[0], v[1], v[2], v[3]];
				},
			}),
			looking: {
				value: { x: self.transform.anchor.x, y: self.transform.anchor.y },
				joystick: 'invertY',
				step: 5,
				onChange: (v: any) => {
					self.transform.anchor = new Vec3(v.x, v.y, 0);
				},
			},
		};
		return { ...super.getModelGUIControlSpec(), ...specs };
	}

	getBoundsForSegments() {
		let b = new BoundingBox3D();
		for (let s of this.segments) {
			b.boundBounds(s.getBounds());
		}
		return b;
	}

	getBounds(): BoundingBox3D {
		let b = this.getBoundsForSegments();
		b.transform = this.getWorldTransform();
		return b;
	}
}
