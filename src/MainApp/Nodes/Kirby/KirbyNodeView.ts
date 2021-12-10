import { ARenderGroup, ASceneNodeView, GetAppState } from '../../../anigraph';
import { KirbyNodeModel } from './KirbyNodeModel';
import { KirbyElement } from './KirbyElement';
import { KirbyNodeController } from './KirbyNodeController';
import { v3 } from 'uuid';

export class KirbyNodeView extends ASceneNodeView<KirbyNodeModel> {
	controller!: KirbyNodeController;
	ringElements: KirbyElement[] = [];
	element!: ARenderGroup;

	initGraphics() {
		super.initGraphics();
		this.element = new ARenderGroup();
		this.addElement(this.element);
		const self = this;
		this.controller.subscribe(
			this.model.addStateKeyListener('segments', () => {
				this.updateSegments();
			})
		);
	}

	disposeElements() {
		super.disposeElements();
		this.ringElements = [];
	}

	dispose() {
		this.disposeElements();
	}

	updateSegments() {
		this.disposeElements();
		this.element = new ARenderGroup();
		this.addElement(this.element);
		for (let s of this.model.segments) {
			let seg = KirbyElement.CreateSegment(s, this.model.material);
			this.ringElements.push(seg);
			this.element.add(seg);
			if (s.material) {
				seg.setMaterial(GetAppState().materials.getMaterialModel(s.material).CreateMaterial().threejs);
			}
		}
	}
}
