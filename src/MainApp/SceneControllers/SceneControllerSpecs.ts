import {
    A2DPolygonModel, A2DPolygonView, ACameraNodeController, ACameraNodeModel, ACameraNodeView,
    AExtrudedShapeModel, AExtrudedShapeView, ALoadedBoundsView, ALoadedModel, ALoadedView,
    AMVCSpec,
    APointLightController,
    APointLightModel,
    APointLightView, ASceneNodeController, BasicSceneNodeController
} from "../../anigraph";
import {
    AGroundModel,
    AGroundView,
    ASpriteModel, ASpriteView,
    CubicBezierController,
    CubicBezierModel,
    CubicBezierView, EditVertsController, EditVertsModel, EditVertsView, PyramidController,
} from "../../anigraph/amvc/derived";
import {FlameModel} from "../../anigraph/effects/particle/flame/FlameModel";
import {FlameView} from "../../anigraph/effects/particle/flame/FlameView";
import {DragonNodeModel} from "../Nodes/Dragon/DragonNodeModel";
import {DragonNodeController} from "../Nodes/Dragon/DragonNodeController";
import {ASceneNodeBoundsView} from "../../anigraph/amvc/node/base/ASceneNodeBoundsView";
import {DragonNodeView} from "../Nodes/Dragon/DragonNodeView";
import {EnemyNodeModel} from "../Nodes/Enemy/EnemyNodeModel";
import {RingNodeModel} from "../Nodes/ExampleProcedureGeometry/RingNodeModel";
import {AMeshView} from "../../anigraph/amvc/node/mesh/AMeshView";
import GroundView from "../Nodes/Ground/GroundView";
import {GroundController} from "../Nodes/Ground/GroundController";
import {GroundModel} from "../Nodes/Ground/GroundModel";




export function CommonSpecs(){
    return [
            new AMVCSpec(APointLightModel, APointLightView, APointLightController),
            new AMVCSpec(A2DPolygonModel,A2DPolygonView, BasicSceneNodeController),
            new AMVCSpec(CubicBezierModel,CubicBezierView, CubicBezierController),
            new AMVCSpec(EditVertsModel, EditVertsView, EditVertsController),
            new AMVCSpec(ASpriteModel, ASpriteView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
            new AMVCSpec(ACameraNodeModel, ACameraNodeView, ACameraNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(EnemyNodeModel, APointLightView, APointLightController),
        new AMVCSpec(RingNodeModel, ASceneNodeBoundsView, BasicSceneNodeController, {canCreateDefault:true, isGUIOption:true}),

    ];
}

export function BasicMapSceneControllerSpecs(){
    return [
        ...CommonSpecs(),
        new AMVCSpec(AExtrudedShapeModel,CubicBezierView, CubicBezierController),
        new AMVCSpec(FlameModel, A2DPolygonView, ASceneNodeController),
        new AMVCSpec(ALoadedModel, ALoadedBoundsView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(GroundModel, GroundView, GroundController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(DragonNodeModel, ALoadedBoundsView, DragonNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(AGroundModel, A2DPolygonView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        ];
}

export function BasicGameSceneControllerSpecs(){
    return [
        ...CommonSpecs(),
        new AMVCSpec(AExtrudedShapeModel,AExtrudedShapeView, CubicBezierController),
        new AMVCSpec(ALoadedModel, ALoadedView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(AGroundModel, AGroundView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(FlameModel, FlameView, ASceneNodeController),
        new AMVCSpec(DragonNodeModel, DragonNodeView, DragonNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(RingNodeModel, AMeshView, BasicSceneNodeController, {canCreateDefault:true, isGUIOption:true}),
        new AMVCSpec(GroundModel, GroundView, GroundController, {canCreateDefault:false, isGUIOption:false}),

    ]
}
