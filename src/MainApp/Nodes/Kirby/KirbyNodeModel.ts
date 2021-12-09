import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {
    AObjectState,
    ASceneNodeModel,
    ASerializable, BezierTween, BoundingBox3D,
    Color, GetAppState, NodeTransform3D, Quaternion,
    V2,
    V3,
    Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";

import {KirbySegment} from "./KirbySegment";
import {Sphere} from "../ProceduralBasicGeometryElements/SphereElement";
import {MainAppState} from "../../MainAppState";
// import {THREE} from "three";
import * as THREE from "three";

const DEFAULT_DURATION = 1.5;

@ASerializable("RingNodeModel")
export class KirbyNodeModel extends ASceneNodeModel{
    @AObjectState segments:KirbySegment[];
    @AObjectState tween: BezierTween;
    @AObjectState spinDuration: number;
    @AObjectState nSpins: number;
    @AObjectState isSpinning: boolean;
    @AObjectState isJumping: boolean;
    @AObjectState isMoving: boolean;
    @AObjectState currentFrame: number;
    @AObjectState gravityFrame: number;
    @AObjectState movingFrame: number;

    constructor(segments?:KirbySegment[], ...args:any[]) {
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

        // these will not be selectable through clicking in map view...
        // you can still select through the scene graph view though
        this.selectable=false;

        this.segments=[];
        if(segments){this.segments=segments;}
        const self=this;

        // To make sure that anything listening to our geometry knows when the segments change,
        // we will trigger a geometry update whenever they change.
        this.subscribe(this.addStateKeyListener('segments', ()=>{
            self.geometry.touch();
        }))


        //How to subscribe to some AppState property:
        // let appState = GetAppState() as MainAppState;
        // self.subscribe(GetAppState().addStateKeyListener('thing', ()=>{
        //     console.log(`thing is: ${appState.thing}`)
        // }))


    }

    static async CreateDefaultNode(radius:number=20, height=10, samples:number=50, isSmooth:boolean=true, ...args:any[]) {
        let kirbyModel = new this();
        let locations = [
            V3(20,0,25),//right hand
            V3(0,0,25),//body
            V3(-20,0,25),//left hand
            V3(10,0,8),//right leg
            V3(-10,0,8)//left leg
        ]
        kirbyModel.segments = [
            new KirbySegment(locations[0], 0.3*radius,  new THREE.Matrix4().makeScale( 1.0, 1.0, 0.8), [Color.FromString('#ff0000'), Color.FromString('#00ff00')]),
            new KirbySegment(locations[1], radius,new THREE.Matrix4().makeScale( 1.0, 1.0, 1.0), [Color.FromString('#00ff00'), Color.FromString('#0000ff')]),
            new KirbySegment(locations[2], 0.3*radius, new THREE.Matrix4().makeScale( 1.0, 1.0, 0.8),  [Color.FromString('#0000ff'), Color.FromString('#ffffff')]),
            new KirbySegment(locations[3], 0.4*radius,new THREE.Matrix4().makeScale( 1.0, 1.0, 0.8), [Color.FromString('#00ff00'), Color.FromString('#0000ff')]),
            new KirbySegment(locations[4], 0.4*radius, new THREE.Matrix4().makeScale( 1.0, 1.0, 0.8),  [Color.FromString('#0000ff'), Color.FromString('#ffffff')]),
        ]
        return kirbyModel;
    }

    getBoundsForSegments(){
        let b = new BoundingBox3D();
        for (let s of this.segments){
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
