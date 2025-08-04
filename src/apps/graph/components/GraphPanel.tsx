import { useEffect, useState } from "react";
import { useGraphStore, type GraphStore } from "../stores/graphStore";
import { useShallow } from "zustand/shallow";
import { serialize } from "../utils/serialize";
import TextArea from "antd/es/input/TextArea";
import type { GraphFormat } from "../types";
import { Divider, Select, Typography } from "antd";
import styles from "./GraphPanel.module.css";
import { graphAPI } from "../stores/graphAPI";
import ButtonCopy from "@shared/components/ButtonCopy";
import ButtonDownload from "@shared/components/ButtonDownload";
import ButtonReset from "@shared/components/ButtonReset";

const { Text } = Typography;

const selector = (state: GraphStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  weighted: state.weighted,
});

const GraphPanel = () => {
  const { nodes, edges, weighted } = useGraphStore(useShallow(selector));
  const [headerValue, setHeaderValue] = useState("");
  const [dataValue, setDataValue] = useState("");
  const [format, setFormat] = useState<GraphFormat>("edge-list");

  useEffect(() => {
    const graphData = serialize(format, weighted, nodes, edges);
    setHeaderValue(graphData.header ?? "");
    setDataValue(graphData.body);
  }, [nodes, edges, weighted, format]);

  return (
    <>
      <div className={styles.panel}>
        <div style={{ display: "flex", gap: 12 }}>
          <Select<GraphFormat>
            size="large"
            value={format}
            options={[
              { value: "edge-list", label: "Edge List" },
              { value: "node-edge-list", label: "Node + Edge List" },
              { value: "json", label: "JSON" },
            ]}
            onChange={(format) => setFormat(format)}
            style={{ width: 180 }}
          />
          <ButtonCopy text={dataValue}/>
          <ButtonDownload text={dataValue}/>
          <ButtonReset onClick={graphAPI.resetGraph} popMessage="Reset graph?"/>
        </div>

        <Divider size="middle" />
        <Text className={styles.label}>Node & Edge Count</Text>
        <TextArea
          size="large"
          autoSize={{ minRows: 1, maxRows: 6 }}
          placeholder="Nodes #, Edges #"
          value={headerValue}
        />
        <Divider size="middle" />
        <Text className={styles.label}>Graph Output</Text>
        <TextArea
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
          size="large"
          autoSize={{ minRows: 6, maxRows: 18 }}
          placeholder="Graph output here"
          value={dataValue}
        />
      </div>
    </>
  );
};

export default GraphPanel;
