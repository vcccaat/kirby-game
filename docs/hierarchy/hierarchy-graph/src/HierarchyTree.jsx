import "antd/dist/antd.css";
import { Tree } from "antd";
import { Box } from "@chakra-ui/react";
const HierarchyTree = ({ treeData }) => {
  const onSelect = (keys, info) => {
    window.open(info.node.link);
  };

  return (
    <Box
      boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;"
      padding={5}
      borderRadius={5}
    >
      <Tree
        multiple
        defaultExpandAll
        showLine={{ showLeafIcon: false }}
        onSelect={onSelect}
        treeData={treeData}
      />
    </Box>
  );
};

export default HierarchyTree;
