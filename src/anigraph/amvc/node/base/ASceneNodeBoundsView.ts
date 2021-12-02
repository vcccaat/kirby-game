import {ASceneNodeView} from "./ASceneNodeView";
import {ATriangleMeshElement} from "../../../arender/basic/ATriangleMeshElement";
import {VertexArray3D} from "../../../ageometry";
import {ASceneNodeController} from "./ASceneNodeController";

export class ASceneNodeBoundsView extends ASceneNodeView<any>{
    controller!:ASceneNodeController<any>
    // element!:ATriangleMeshElement;

    onGeometryUpdate(){
        super.onGeometryUpdate();
        // this.element.setVerts(VertexArray3D.MeshVertsForBoundingBox3D(this.model.getBounds()));
    }

    initGraphics() {
        super.initGraphics();
        // this.element = new ATriangleMeshElement();
        // this.element.init(VertexArray3D.MeshVertsForBoundingBox3D(this.model.getBounds()), this.model.color);
        // this.addElement(this.element);
    }

}
