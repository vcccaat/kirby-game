import * as THREE from "three";
import type {SvgNode, SVGParsedData} from "./SVGLoader";
import {SVGLoader} from "./SVGLoader";

import {
    createMeshesFromPath,
    makeOriginCenterForGroup,
    makeOriginCenterForMesh,
    moveObjectToWorldCenter,
    setAttributesFromMatrix
} from "../ThreeJs";

function matrix4FromMatrix3(matrix3: THREE.Matrix3): THREE.Matrix4 {
  function from1Dto2DArray(list: number[]) {
    let m:number[][] = [[], [], []];
    let index = 0;
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        m[i].push(list[index]);
        index++;
      }
    }
    return m;
  }
  const m = from1Dto2DArray(matrix3.toArray());
  const m4 = [
    [m[0][0], m[0][1], 0, m[0][2]],
    [m[1][0], m[1][1], 0, m[1][2]],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  return new THREE.Matrix4().fromArray(m4.flat()).transpose();
}


/**
 * @returns a Hierarchical THREE.Group object from
 * svg specified by @param svgUrl
 * @param svgUrl url for the svg file
 * @example
 * loadSVG('./sbsp.svg')
 */
export async function SvgToThreeJsObject(svgUrl: string): Promise<THREE.Object3D> {
  const svgParsedData = await loadSvgData(svgUrl);
  const svgRootThreeJSObject = generateThreeJSGroupForSVG(svgParsedData);
  moveObjectToWorldCenter(svgRootThreeJSObject);
  svgRootThreeJSObject.scale.multiplyScalar(0.3);
  svgRootThreeJSObject.scale.y *= -1;
  return svgRootThreeJSObject;
}

async function loadSvgData(svgUrl: string) {
  const loader = new SVGLoader();
  const svgParsedData: SVGParsedData = await loader.load(svgUrl);
  return svgParsedData;
}

export function SvgTextToThreeJsObject(svgText: string): THREE.Object3D {
  const svgParsedData = parseSVG(svgText);
  const svgRootThreeJSObject = generateThreeJSGroupForSVG(svgParsedData);
  moveObjectToWorldCenter(svgRootThreeJSObject);
  svgRootThreeJSObject.scale.multiplyScalar(1.0);
  svgRootThreeJSObject.scale.y *= -1;
  return svgRootThreeJSObject;
}

export function ThreeJSObjectFromParsedSVG(svgParsedData: SVGParsedData): THREE.Object3D {
  const svgRootThreeJSObject = generateThreeJSGroupForSVG(svgParsedData);
  // moveObjectToWorldCenter(svgRootThreeJSObject);
  // svgRootThreeJSObject.scale.multiplyScalar(1.0);
  svgRootThreeJSObject.scale.y *= -1;
  svgRootThreeJSObject.updateMatrix();
  svgRootThreeJSObject.matrixAutoUpdate=false;
  return svgRootThreeJSObject;
}

export function getSVGTextFromFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result);
    };
    reader.onerror = (err) => {
      alert("failed to upload file with err" + err);
    };
    reader.readAsText(file);
  });
}

function parseSVG(svgText: string) {
  const loader = new SVGLoader();
  const svgParsedData: SVGParsedData = loader.parse(svgText);
  return svgParsedData;
}

function generateThreeJSGroupForSVG(svgData: SVGParsedData): THREE.Object3D {
  const rootSvgNode = svgData.rootSvgNode;
  const svgThreeJsRootObject: THREE.Object3D =
    createThreeJSObject(rootSvgNode)[0];
  return svgThreeJsRootObject;
}

/**
   * create an array of ThreeJS object
   * with root being current SVG node
   * @implements
   * Create mesh for primitive types like path, rect.
   * Create group for g.
   * Convert localTransform into position, scale, rotation
   * attributes of ThreeJS object
   * @param root {SvgNode} tree structure
   * parsed from SVG containing path and svg node information
   * @returns [THREE.Group] or [THREE.Mesh] or []
   */
function createThreeJSObject(root: SvgNode): THREE.Object3D[] {
  // decide if root is a group by seeting whether length > 0
  if (root.children.length > 0) {
    const group = new THREE.Group();
    group.name = root.id ?? root.node.nodeName;
    for (const child of root.children) {
      const childSceneArray = createThreeJSObject(child);
      if (childSceneArray) {
        childSceneArray.forEach((scene) => group.add(scene));
      }
    }
    makeOriginCenterForGroup(group);
    setAttributesFromMatrix(group, matrix4FromMatrix3(root.localTransform));
    return [group];
  } else if (root.originPath) {
    const meshes = createMeshesFromPath(root.originPath);
    meshes.forEach((mesh: THREE.Mesh) => {
      mesh.name = root.id ?? root.node.nodeName;
      makeOriginCenterForMesh(mesh);
      setAttributesFromMatrix(
        mesh,
        matrix4FromMatrix3(root.localTransform)
      );
    });
    return meshes;
  } else return [];
}


