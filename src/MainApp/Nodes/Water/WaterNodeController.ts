
import { ASceneNodeController } from "src/anigraph";
import { ExampleNodeController } from "../Example/ExampleNodeController";
import { ExampleNodeModel } from "../Example/ExampleNodeModel";
import {WaterNodeModel} from "./WaterNodeModel";

export class WaterNodeController extends ExampleNodeController{
    _model!:WaterNodeModel;
}
