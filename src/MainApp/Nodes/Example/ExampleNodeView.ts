import {ASceneNodeView} from "../../../anigraph";
import {ExampleNodeModel} from "./ExampleNodeModel";
import {ExampleNodeController} from "./ExampleNodeController";
import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import {ExampleRenderElement} from "./ExampleRenderElement";

export class ExampleNodeView extends ASceneNodeView<ExampleNodeModel>{
    controller!:ExampleNodeController;
    public element!:ExampleRenderElement;
    onGeometryUpdate(){
        super.onGeometryUpdate();
        this.element.setVerts(this.model.verts);
    }
    initGraphics() {
        super.initGraphics();
        this.element = new ATriangleMeshElement();
        this.element.init(this.model.verts, this.model.material.threejs);
        this.addElement(this.element);
    }
}
