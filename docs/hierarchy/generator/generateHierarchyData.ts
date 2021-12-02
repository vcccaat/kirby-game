import { DocReflectionData, ChildrenEntity } from "./DocReflectionData";
import fs from "fs-extra";
const reflectionData: DocReflectionData = require("./input/api_reflection_data.json");

// configs
// const DocURLBase = "http://127.0.0.1:5500/docs/";
const DocURLBase = "https://www.cs.cornell.edu/courses/cs4620/2021fa/anigraph/docs/";
const outputPath = "../hierarchy-graph/src/data/hierarchy.json";

const kindStringToURLMap = {
  Interface: "interfaces",
  Class: "classes",
  Enumeration: "enums",
};

// some extended type has no id, e.g. EventDispatcher. need to handle that seperately!
type Node = {
  id: number;
  name: string;
  children: NodeMap<Node>;
  source: ChildrenEntity;
};

type NodeMap<T> = { [id: string]: T };

function getParent(node: ChildrenEntity) {
  const { extendedTypes } = node;
  return extendedTypes && extendedTypes.length > 0 && extendedTypes[0].id
    ? extendedTypes[0]
    : null;
}

function getChildren(node: ChildrenEntity) {
  const { extendedBy } = node;
  return extendedBy;
}

function shouldBeIncludedInHierarchyTree(node: ChildrenEntity) {
  return getParent(node) || getChildren(node);
}

function generateRenderNode(node: ChildrenEntity) {
  const { id, name } = node;
  return { id, name, source: node, children: {} };
}

const allNodes: NodeMap<Node> = {};
// first round: create a new RenderNode object for each node that should be rendered
reflectionData.children?.forEach((node) => {
  if (shouldBeIncludedInHierarchyTree(node)) {
    allNodes[node.id] = generateRenderNode(node);
  }
});

// second round: link parent and child
Object.values(allNodes).forEach((node) => {
  const parent = getParent(node.source);
  if (parent) {
    allNodes[parent.id!].children[node.id] = node;
  }
});

// third: extract root nodes (can be many root nodes)

function isRootNode(node: Node) {
  return !getParent(node.source);
}

const roots: Node[] = Object.values(allNodes).filter(isRootNode);

// fourth: convert NodeMap (dict) to array
// we were previously using dict for efficiency (since there will
// be many lookups in second round),
// but the object needed for using ant design
// tree component will need children as array

// convert roots to object that can be used in
// ant design's tree component
type AntdRenderNode = {
  title: string;
  key: string;
  children: AntdRenderNode[];
  isLeaf?: boolean;
};

export type CustomizedRenderNode = AntdRenderNode & {
  source: ChildrenEntity;
  link: string;
};
function generateRenderData(root: Node): CustomizedRenderNode {
  const currentNode: CustomizedRenderNode = {
    key: root.id.toString(),
    title: root.name,
    source: root.source,
    children: [],
    link:
      DocURLBase +
      `${
        kindStringToURLMap[
          root.source.kindString as keyof typeof kindStringToURLMap
        ]
      }/${root.name}.html`,
  };
  // traverse tree
  for (let child of Object.values(root.children)) {
    currentNode.children.push(generateRenderData(child));
  }
  return { ...currentNode, isLeaf: currentNode.children.length === 0 };
}

const renderableRoots = roots.map(generateRenderData);

// export hierarchy json file
const json = JSON.stringify(renderableRoots, null, 2);
fs.outputFile(outputPath, json, (err: any) => {
  if (err) throw err;
  console.log(`Hierarchy Data written to file ${outputPath}`);
});
