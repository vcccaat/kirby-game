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




export function CommonSpecs(){
    return [
            new AMVCSpec(APointLightModel, APointLightView, APointLightController),
            new AMVCSpec(A2DPolygonModel,A2DPolygonView, BasicSceneNodeController),
            new AMVCSpec(CubicBezierModel,CubicBezierView, CubicBezierController),
            new AMVCSpec(EditVertsModel, EditVertsView, EditVertsController),
            new AMVCSpec(ASpriteModel, ASpriteView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
            new AMVCSpec(ACameraNodeModel, ACameraNodeView, ACameraNodeController, {canCreateDefault:true, isGUIOption:true})
    ];
}

export function BasicMapSceneControllerSpecs(){
    return [
        ...CommonSpecs(),
        new AMVCSpec(AExtrudedShapeModel,CubicBezierView, CubicBezierController),
        new AMVCSpec(FlameModel, A2DPolygonView, ASceneNodeController),
        new AMVCSpec(ALoadedModel, ALoadedBoundsView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(AGroundModel, A2DPolygonView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        ];
}

export function BasicGameSceneControllerSpecs(){
    return [
        ...CommonSpecs(),
        new AMVCSpec(AExtrudedShapeModel,AExtrudedShapeView, CubicBezierController),
        new AMVCSpec(ALoadedModel, ALoadedView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),
        new AMVCSpec(AGroundModel, AGroundView, BasicSceneNodeController, {canCreateDefault:false, isGUIOption:false}),

    ]
}
