import { useEffect, useState } from "react";
import { useTreeStore } from "@tree/stores/treeStore";
import { deserialize, serialize } from "./utils/tree";
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Select,
} from "antd";
import { MdClear, MdOutlineContentCopy } from "react-icons/md";
import type { TreeFormat } from "./types";
import { IoEnterOutline } from "react-icons/io5";
import styles from "./TreeHeader.module.css"
import { treeAPI } from "./stores/treeAPI";
import { notify } from "@shared/notify";
import ButtonDownload from "@shared/components/ButtonDownload";
import ButtonReset from "@shared/components/ButtonReset";
import ButtonCopy from "@shared/components/ButtonCopy";

export const TreeInput = () => {
  const { nodes, rootId } = useTreeStore();
  const [inputValue, setInputValue] = useState("");
  const [inputIsValid, setInputIsValid] = useState(true);
  const [format, setFormat] = useState<TreeFormat>("leetcode-strict");

  // Update input whenever the tree or format changes
  useEffect(() => {
    switch (format) {
      case "leetcode-strict":
        try {
          setInputValue(serialize("leetcode-strict", nodes, rootId));
        } catch (error) {
          setInputValue(serialize("leetcode", nodes, rootId));
          setFormat("leetcode");
          notify.leetcodeWarn();
          console.error(error);
        }
        break;
      case "leetcode":
        setInputValue(serialize("leetcode", nodes, rootId));
        break;
    }
  }, [nodes, rootId, format]);

  const applyDeserialization = () => {
    try {
      const result = deserialize(format, inputValue);
      treeAPI.setTree(result.nodes, result.rootId);
      setInputIsValid(true);
    } catch (error) {
      console.error(error);
      setInputIsValid(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    applyDeserialization();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyDeserialization();
    }
  };

  return (
    <div
      className={styles.header}
    >
      <Input
        addonBefore={
          <Select<TreeFormat>
            value={format}
            options={[
              { value: "leetcode-strict", label: "Leetcode" },
              { value: "leetcode", label: "Leetcode + Quotes" },
            ]}
            onChange={(format) => setFormat(format)}
            style={{ width: 180 }}
          />
        }
        status={!inputIsValid ? "warning" : undefined}
        suffix={<IoEnterOutline fontSize={"24px"} />}
        size="large"
        variant="outlined"
        value={inputValue}
        style={{ width: 900 }}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <ButtonCopy text={inputValue}/>
      <ButtonDownload text={inputValue}/>
      <ButtonReset onClick={treeAPI.resetTree} popMessage="Reset tree?"/>
    </div>
  );
};
