import {APointLightModel, V3, Vec3} from "../../../anigraph";
import {Color} from "../../../anigraph/amath";

export class LightNodeModel extends APointLightModel{
    size:number=1;

    constructor() {
        super();
        this.intensity = 1
        this.color = Color.FromString("#fff")
    }
}
