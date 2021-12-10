import * as THREE from 'three';
import { APointLightModel, V3, Vec3, ALoadedModel, Color, Quaternion } from '../../../anigraph';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { ATexture } from '../../../anigraph/arender/ATexture';

// const loader = new OBJLoader();
// const plantGeometry  =
// loader.loadAsync("./models/plants.obj");

const loader = new PLYLoader();
const starGeometry = loader.loadAsync('./models/star.ply');
const vrt = `in vec2 a_position;
in vec2 a_tex_coord;
in vec4 a_colour;

uniform mat4 matrix;

out vec4 v_colour;
out vec2 tex_coord;

void main() {
   v_colour = a_colour;
   tex_coord = a_tex_coord;
   gl_Position = matrix * vec4(a_position, 0, 1);
}`;
const frag = `in vec4 v_colour;
in vec2 tex_coord;
out vec4 pixel;

uniform sampler2D t0;
uniform float glow_size = .5;
uniform vec3 glow_colour = vec3(0, 0, 0);
uniform float glow_intensity = 1;
uniform float glow_threshold = .5;

void main() {
    pixel = texture(t0, tex_coord);
    if (pixel.a <= glow_threshold) {
        ivec2 size = textureSize(t0, 0);
	
        float uv_x = tex_coord.x * size.x;
        float uv_y = tex_coord.y * size.y;

        float sum = 0.0;
        for (int n = 0; n < 9; ++n) {
            uv_y = (tex_coord.y * size.y) + (glow_size * float(n - 4.5));
            float h_sum = 0.0;
            h_sum += texelFetch(t0, ivec2(uv_x - (4.0 * glow_size), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x - (3.0 * glow_size), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x - (2.0 * glow_size), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x - glow_size, uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x, uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + glow_size, uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + (2.0 * glow_size), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + (3.0 * glow_size), uv_y), 0).a;
            h_sum += texelFetch(t0, ivec2(uv_x + (4.0 * glow_size), uv_y), 0).a;
            sum += h_sum / 9.0;
        }

        pixel = vec4(glow_colour, (sum / 9.0) * glow_intensity);
    }
}`;
export class StarNodeModel extends ALoadedModel {
	static StarObject3D: THREE.Object3D;
	constructor() {
		super(StarNodeModel.StarObject3D);
	}

	/**
	 * Define this to customize what gets created when you click the create default button in the GUI
	 * @constructor
	 */
	static async CreateDefaultNode() {
		if (!StarNodeModel.StarObject3D) {
			// let shaderLoader = new THREE.FileLoader();
			// var material = new THREE.ShaderMaterial({
			// 	vertexShader: vrt,
			// 	fragmentShader: frag,
			// 	// vertexShader: shaderLoader.load('./shaders/glow/vertex.glsl'),
			// 	// fragmentShader: shaderLoader.load('./shaders/glow/fragment.glsl'),
			// });

			const geometry = await starGeometry;
			StarNodeModel.StarObject3D = new THREE.Mesh(geometry);
		}

		let star = new StarNodeModel();
		star.transform.scale = V3(1, 1, 1).times(3);
		star.transform.rotation = Quaternion.RotationZ(Math.PI * 0.5).times(Quaternion.RotationX(Math.PI * 0.5));
		star.color = Color.FromString('#FFFF00');
		return star;
	}
}
