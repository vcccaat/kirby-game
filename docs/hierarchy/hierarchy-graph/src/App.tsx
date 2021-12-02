import "antd/dist/antd.css";

import { Container } from "@chakra-ui/react";
import HierarchyTree from "./HierarchyTree";
import StackGrid from "react-stack-grid";
import treeData from "./data/hierarchy.json";
import { CustomizedRenderNode } from "../../generator/generateHierarchyData";

const data = treeData as CustomizedRenderNode[];
const App = () => {
  return (
    <Container height="100vh" maxW="100vw" padding={6}>
      <StackGrid columnWidth={400}>
        {data.map((root) => (
          <HierarchyTree key={root.title} treeData={[root]} />
        ))}
      </StackGrid>
    </Container>
  );
};

export default App;
