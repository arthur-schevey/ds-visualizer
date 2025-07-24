import {
  Divider,
  Segmented,
  Tooltip,
} from "antd";
import styles from "./GraphHeader.module.css";
import { LuMove } from "react-icons/lu";
import { TbPencilUp } from "react-icons/tb";
import { graphAPI } from "./stores/graphAPI";
import type { GraphUiMode } from "./types";
import { useGraphStore, type GraphStore } from "./stores/graphStore";
import { useShallow } from "zustand/shallow";

const selector = (state: GraphStore) => ({
  directed: state.directed,
  weighted: state.weighted,
  uiMode: state.uiMode,
});

export const GraphHeader = () => {
  const { directed, weighted, uiMode } = useGraphStore(useShallow(selector));

  return (
    <div className={styles.header}>
      <Segmented
        value={directed}
        size="large"
        onChange={(val) => graphAPI.setDirected(val)}
        options={[
          { value: true, label: "Directed" },
          { value: false, label: "Undirected" },
        ]}
      />

      <Segmented
        value={weighted ? 'true' : 'false'}
        size="large"
        onChange={(val) => graphAPI.setWeighted(val === 'true')}
        options={[
          { value: 'true', label: "Weighted" },
          { value: 'false', label: "Unweighted" },
        ]}
      />

      <Divider type="vertical" />

      <Segmented
        value={uiMode}
        size="large"
        onChange={(val: GraphUiMode) => graphAPI.setUiMode(val)}
        options={[
          {
            value: "move",
            icon: (
              <Tooltip title="Move Nodes" mouseEnterDelay={0}>
                <div>
                  <LuMove />
                </div>
              </Tooltip>
            ),
          },
          {
            value: "draw",
            icon: (
              <Tooltip title="Draw Edges" mouseEnterDelay={0}>
                <div>
                  <TbPencilUp />
                </div>
              </Tooltip>
            ),
          },
        ]}
      />
    </div>
  );
};
