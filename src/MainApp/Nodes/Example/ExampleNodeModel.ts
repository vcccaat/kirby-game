import {AObjectState,ASceneNodeModel, ASerializable} from "../../../anigraph";
export enum ExampleEnums{
    maxElements=3000
}

@ASerializable("ExampleNodeModel")
export class ExampleNodeModel extends ASceneNodeModel{
}
