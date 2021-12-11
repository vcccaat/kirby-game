import { ARenderGroup, ASceneNodeView, GetAppState } from '../../../anigraph';
import { KirbyNodeModel } from './KirbyNodeModel';
import { KirbyElement } from './KirbyElement';
import { KirbyNodeController } from './KirbyNodeController';
import { v3 } from 'uuid';
import { Material, Color } from 'three';

export class KirbyNodeView extends ASceneNodeView<KirbyNodeModel> {
	controller!: KirbyNodeController;
	ringElements: KirbyElement[] = [];
	element!: ARenderGroup;
    count: number = 0;

	initGraphics() {
        console.log("init");
		super.initGraphics();
		this.element = new ARenderGroup();
		this.addElement(this.element);
		const self = this;
		this.controller.subscribe(
			this.model.addStateKeyListener('updateHands', () => {
				this.updateSegments();
			})
		);
        this.controller.subscribe(
			this.model.addStateKeyListener('updateFeet', () => {
				this.updateFeet();
			})
		);
		this.updateSegments();
	}

	disposeElements() {
		super.disposeElements();
		this.ringElements = [];
	}

	dispose() {
		this.disposeElements();
	}

	updateSegments() {
		// this.disposeElements();
		// this.element = new ARenderGroup();
		// this.addElement(this.element);
        for (let i = 0; i < this.model.segments.length; i ++) {
            if (i !== 0 && i !== 2 && this.ringElements[i]) continue;
            let s = this.model.segments[i];
            if (this.ringElements[i]) this.element.remove(this.ringElements[i]);
            let seg = KirbyElement.CreateSegment(s, this.model.material);
            this.ringElements[i] = seg;
            // this.element.remove();
			this.element.add(seg);
            if (s.material) {
                let material = GetAppState().materials.getMaterialModel(s.material).CreateMaterial().threejs;
                seg.setMaterial(material);
            }
        }
	}

    updateFeet() {
        for (let i = 0; i < this.model.segments.length; i ++) {
            if (i !== 3 && i !== 4 && this.ringElements[i]) continue;
            let s = this.model.segments[i];
            if (this.ringElements[i]) this.element.remove(this.ringElements[i]);
            let seg = KirbyElement.CreateSegment(s, this.model.material);
            this.ringElements[i] = seg;
			this.element.add(seg);
            if (s.material) {
                let material = GetAppState().materials.getMaterialModel(s.material).CreateMaterial().threejs;
                seg.setMaterial(material);
            }
        }
	}
}
