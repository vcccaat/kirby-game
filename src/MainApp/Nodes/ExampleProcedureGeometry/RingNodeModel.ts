import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {AObjectState, Color, V2, V3, Vec2, Vec3, VertexArray3D} from "../../../anigraph";

export class RingNodeModel extends AMeshModel{
    @AObjectState radius:number;
    @AObjectState height:number;
    @AObjectState nSamples:number;
    @AObjectState isSmooth:boolean;

    constructor(radius:number=100, height=10, samples:number=50, isSmooth:boolean=true, ...args:any[]) {
        super();
        this.radius=radius;
        this.height = height;
        this.nSamples = samples;
        this.isSmooth=isSmooth;

        this.generateGeometry();
    }

    static async CreateDefaultNode(radius:number=50, height=10, samples:number=50, isSmooth:boolean=true, ...args:any[]) {
        let newNode = new this(radius, height, samples, isSmooth, ...args);
        newNode.transform.position = V3(0,0,100);
        newNode.color = Color.Random();
        newNode.color.a = 0.5; // we can even make it semi-transparent
        return newNode;
    }

    generateGeometry(){
        // Let's define some geometry. We will create a VertexArray3D with normals and texture coordinates
        let verts = VertexArray3D.CreateForRendering(true, true);


        //Now, lets assign it geometry for a ring.
        //Specifically, we will sample a bunch of points along a circle, and at each point we will
        //add two vertices offset perpendicular to that circle.

        // let's first compute a circle of nSamples vertices in the XY plane
        // we will also calculate their texture coordinates, which we will map to the bottom of our image (v=1, in uv coordinates)
        let samplesXY0:Vec3[] = [];
        let uv0:Vec2[]=[];
        let dtheta = Math.PI*2/(this.nSamples);

        for(let s=0;s<this.nSamples;s++){
            let theta = s*dtheta;
            samplesXY0.push(V3(Math.cos(theta),Math.sin(theta), 0));
            uv0.push(V2(s/this.nSamples, 1));
        }

        // now we'll compute another circle translated in z
        let samplesXYh = samplesXY0.map((v)=>{
            return v.plus(V3(0,0,this.height));
        })
        // and we'll map its texture coordinates to the bottom of our image (v=0).
        let uvh = uv0.map((v)=>{
            return V2(v.x,0);
        })

        // Now we will calculate normals and assign indices.
        // This will work a bit differently depending on whether we want a smooth ring or one with flat faces.
        if(!this.isSmooth) {
            // First, let's consider the flat case, which is a bit simpler...
            // Here we are just going to add the vertices three at a time as triangles
            // In this case, the normal will be calculated automatically as the normal to
            // the specified triangle.
            for (let s = 0; s < this.nSamples; s++) {
                // first let's get the 4 vertices and texture coordinates in one segment of our ring in zig-zag order
                let v0 = samplesXY0[s];
                let t0 = uv0[s];
                let v1 = samplesXYh[s];
                let t1 = uvh[s];
                let v2 = samplesXY0[(s + 1) % this.nSamples];
                let t2 = uv0[(s + 1) % this.nSamples];
                let v3 = samplesXYh[(s + 1) % this.nSamples];
                let t3 = uvh[(s + 1) % this.nSamples];

                // Now let's add twp triangles to make a square
                verts.addTriangleCCW(v0, v1, v2, [t0, t1, t2]);
                verts.addTriangleCCW(v1, v2, v3, [t1, t2, t3]);
            }

        }else{
            // Now, let's consider the smooth case.
            // Here, we are going to use indexed per-vertex normals.
            // We'll start by adding our vertices to the VertexArray
            // with their corresponding normals and texture coordinates.
            // Note that the normals for both ring of vertices are the same
            // and are equal to the values we calculated in samplesXY0

            for (let s = 0; s < this.nSamples; s++) {
                verts.addVertex(
                    samplesXY0[s],
                    samplesXY0[s],
                    uv0[s]
                );
                verts.addVertex(
                    samplesXYh[s],
                    samplesXY0[s],
                    uvh[s]
                );
            }

            // Of, now we need to specify our triangles by providing indices.
            // Each triplet of integers specifies a triangle that should be drawn to connect
            // the corresponding vertices. Note that the order you specify the vertices in will
            // determine which side of the triangle is front-facing. You should specify verts
            // in counter-clockwise order relative to the front of the triangle, or they may be
            // culled (not show up) when you render.

            for (let s = 0; s < this.nSamples; s++) {
                // first let's get the 4 vertices in one segment of our ring
                let v0 = (s * 2);
                let v1 = (s * 2 + 1) % this.nSamples;
                let v2 = (s * 2 + 2) % this.nSamples;
                let v3 = (s * 2 + 3) % this.nSamples;

                //now let's add two triangles to make a square
                verts.indices.push([v0, v1, v2]);
                verts.indices.push([v1, v2, v3]);
            }
        }

        // now lets assign this.verts to what we've calculated.
        // You should only do this at the end, or AniGraph will try to update anything listening to this
        // model EVERY TIME you change any part of verts above...
        this.verts = verts;

    }
}
