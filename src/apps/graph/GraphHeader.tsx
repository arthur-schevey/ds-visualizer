import {
  Checkbox,
  Divider,
  Segmented,
  Tooltip,
  type CheckboxProps,
} from "antd";
import styles from "./GraphHeader.module.css";
import { LuMove } from "react-icons/lu";
import { TbPencilUp } from "react-icons/tb";
import { graphAPI } from "./stores/graphAPI";
import type { GraphUiMode } from "./types";

export const GraphHeader = () => {
  const handleWeightedChange: CheckboxProps["onChange"] = (e) => {
    console.log("Toggling weighted/unweighted not implemented yet", e);
  };

  const handleDirectedChange: CheckboxProps["onChange"] = (e) => {
    console.log("Toggling directed/undirected not implemented yet", e);
  };

  return (
    <div className={styles.header}>
      <Checkbox onChange={handleWeightedChange} className={styles.checkboxLarge}>Weighted</Checkbox>
      <Checkbox onChange={handleDirectedChange} className={styles.checkboxLarge}>Directed</Checkbox>
      <Divider type="vertical" />
      <Segmented
        size="large"
        onChange={(e: GraphUiMode) => graphAPI.setUiMode(e)}
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
