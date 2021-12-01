import {AObject, AObjectState} from "../aobject/AObject";
// import {GetAppState} from "../amvc";
import {GetAppState} from "./AAppState";
import {CallbackType} from "../basictypes";
import {BezierTween} from "../amath";
import {v4 as uuidv4} from "uuid";
import {ADragInteraction} from "../ainteraction";

export enum AClockEnums{
    DEFAULT_PERIOD_IN_MILLISECONDS=1000,
    TIME_UPDATE_SUBSCRIPTION_HANDLE="TimeUpdate"
}

/***
 * time passed is tiem-refStart
 * Pausing
 */
export class AClock extends AObject{

    @AObjectState time!:number;
    protected _paused:boolean=false;
    protected _refStart:number=0;
    protected _lastPauseStateChange:number=0;
    protected _lastUpdate:number=0;
    protected _lastClockTimeUpdated:number=0;
    protected _offset:number=0;
    protected _periodInMilliseconds:number=AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS;

    /** Get set paused */
    set paused(value:boolean){this._paused = value;}
    get paused(){return this._paused;}

    get lastTimeUpdated(){
        return this._lastClockTimeUpdated;
    }

    get rate(){
        return AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS/this._periodInMilliseconds;
    }
    set rate(v:number){
        let now = this._getNow();
        this._offset=this.time;
        this._refStart=now;
        this._periodInMilliseconds = AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS/v;
    }

    addTimeListener(callback:(t:number)=>any, handle?:string){
        const self = this;
        return this.addStateKeyListener('time', ()=>{
            callback(self.time);
        }, handle, false);
    }

    constructor() {
        super();
        this.reset(0);
        this.initClockSubscription();
    }

    initClockSubscription(){
        const self = this;
        this.subscribe(GetAppState().addClockListener((t)=>{
            self.update(t);
        }),
            AClockEnums.TIME_UPDATE_SUBSCRIPTION_HANDLE);
    }

    reset(t0:number=0){
        this.time = t0;
        this._refStart= t0;
        this._lastPauseStateChange=t0;
        this._lastUpdate=t0;
        this._offset = 0;
        this._periodInMilliseconds=AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS;
        this._paused=true;
    }

    update(t:number){
        if(this._paused){
            return;
        }
        this.time = this._offset+(t-this._refStart)/this._periodInMilliseconds;
        this._lastUpdate=t;
        this._lastClockTimeUpdated = this.time;
    }

    _getNow(){
        return Date.now();
    }

    play(){
        if(!this.paused){
            return;
        }
        let now = this._getNow();
        this._refStart=this._refStart+(now-this._lastPauseStateChange);
        this._paused=false;
        this._lastPauseStateChange=now;
        this.activateSubscription(AClockEnums.TIME_UPDATE_SUBSCRIPTION_HANDLE);
    }

    pause(){
        let now = this._getNow();
        this._paused=true;
        this._lastPauseStateChange=now;
        this.deactivateSubscription(AClockEnums.TIME_UPDATE_SUBSCRIPTION_HANDLE);
    }

    /**
     * IMPORTANT! If you want to remove the listener at the end of the action
     * you need to do so in the actionOverCallback!
     * @param callback
     * @param duration
     * @param actionOverCallback
     * @param tween
     * @returns {AStateCallbackSwitch}
     * @constructor
     */
    CreateTimedAction(callback:(actionProgress:number)=>any, duration:number, actionOverCallback:CallbackType, tween?:BezierTween,){
        const self = this;
        const startTime = this.time;
        return this.addTimeListener((t:number)=>{
            //calculate how much time has passed
            let timePassed = t-startTime;
            // Check to see if the duration has passed
            if(timePassed>duration){
                if(actionOverCallback){actionOverCallback();}
                return;
            }
            let normalizedTime:number=timePassed/duration;
            if(tween){
                normalizedTime=tween.eval(normalizedTime);
            }
            callback(normalizedTime);
        });
    }


}



