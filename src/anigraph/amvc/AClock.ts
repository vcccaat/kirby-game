import {AObject, AObjectState} from "../aobject/AObject";
// import {GetAppState} from "../amvc";
import {GetAppState} from "./AAppState";

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
    protected _offset:number=0;
    protected _periodInMilliseconds:number=AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS;

    /** Get set paused */
    set paused(value:boolean){this._paused = value;}
    get paused(){return this._paused;}

    get lastTimeUpdated(){
        return this._lastUpdate;
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

    addTimeListener(callback:(t:number)=>any){
        const self = this;
        return this.addStateKeyListener('time', ()=>{
            callback(self.time);
        });
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


}



