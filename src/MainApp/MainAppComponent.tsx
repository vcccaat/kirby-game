import {useSnapshot} from "valtio";
import {
    ControlPanel,
    AMVCMap,
} from "../anigraph";

import "./MainApp.css"
import {useEffect} from "react";
import {GameSceneController} from "./SceneControllers/GameSceneController";
import {MapSceneController} from "./SceneControllers/MapSceneController";
import {MainAppState} from "./MainAppState";

const appState = MainAppState.SetAppState();


enum AppSubComponents{
    ModelScene='ModelScene',
    ViewScene = 'ViewScene'
}

const ParticleAppModelSceneComponent = appState.AppComponent(
    MapSceneController,
    AppSubComponents.ModelScene,
    new AMVCMap(),
    {usesThreeInteractive:true, sceneNumber:1}
);


const ParticleAppViewSceneComponent = appState.AppComponent(
// @ts-ignore
    GameSceneController,
    AppSubComponents.ViewScene,
    new AMVCMap(),
    {usesThreeInteractive:false, sceneNumber:2}
);

export function MainAppComponent() {
    const state = useSnapshot(appState.state);
    const selectionModel = state.selectionModel;
    useEffect(() => {
        appState.PrepAssets().then(()=>{
            appState.initSceneModel();
        });

    }, []);

    return (
        <div>
            <ControlPanel appState={appState} />
            <div className={"container-fluid"}>
                <div className={"row"}>
                    <div className={"Base2DApp-explanation"}>
                        <h1 className={"App-title"}>AniGraph App</h1>
                        <p className={"credit-text"}>Cornell Intro to Graphics, Fall 2021.</p>
                        <p>
                        </p>
                        <br/>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-5"}>
                        <div className={"row"}>
                            <h2 className={"Base2DApp-label"}>Viewing World Space:</h2>
                        </div>
                        <div className={"row"}>
                            <ParticleAppModelSceneComponent/>
                        </div>
                    </div>
                    <div className={"col-5"}>
                        <div className={"row"}>
                            <h2 className={"Base2DApp-label"}>Viewing Object Space:</h2>
                        </div>
                        <div className={"row"}>
                            <ParticleAppViewSceneComponent/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
