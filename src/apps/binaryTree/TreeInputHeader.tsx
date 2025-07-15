import { useEffect, useState } from "react";
import { useTreeStore } from "@stores/treeStore";
import { deserialize, serialize } from "./utils/tree";
import {
  Button,
  Input,
  notification,
  Popconfirm,
  Select,
} from "antd";
import { MdClear, MdOutlineContentCopy } from "react-icons/md";
import type { TreeFormat } from "@shared/types/serialization";
import { IoEnterOutline } from "react-icons/io5";
import styles from "./TreeInputHeader.module.css"

export const TreeInput = () => {
  const { nodes, rootId } = useTreeStore();
  const [inputValue, setInputValue] = useState("");
  const [inputIsValid, setInputIsValid] = useState(true);
  const [format, setFormat] = useState<TreeFormat>("leetcode-strict");
  const { setTree, resetTree } = useTreeStore();

  // Update input whenever the tree or format changes
  useEffect(() => {
    switch (format) {
      case "leetcode-strict":
        try {
          setInputValue(serialize("leetcode-strict", nodes, rootId));
        } catch (error) {
          setInputValue(serialize("leetcode", nodes, rootId));
          setFormat("leetcode");
          leetcodeWarnNotification();
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
      setTree(result.nodes, result.rootId);
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

  const copyNotification = () => {
    notification.success({
      message: "Copied to clipboard",
      duration: 1.5,
    });
  };

  const copyErrNotification = (err: Error) => {
    notification.success({
      message: "Error copying to clipboard",
      description: "Error:" + err.message,
      showProgress: true,
      duration: 4,
    });
  };

  const leetcodeWarnNotification = () => {
    notification.warning({
      message: "Format changed",
      description:
        "LeetCode strings do not support non-numeric node values so your format has been automatically switched to allow quotes. If you want to return to the standard LeetCode format, remove any non-numeric values.",
      showProgress: true,
      duration: 9,
    });
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
      <Button
        type="primary"
        size="large"
        onClick={() =>
          navigator.clipboard
            .writeText(inputValue)
            .then(copyNotification)
            .catch((err) => copyErrNotification(err))
        }
        icon={<MdOutlineContentCopy fontSize={"24px"} />}
      />

      <Popconfirm title="Reset tree?" onConfirm={resetTree} okText="Yes">
        <Button
          danger
          type="default"
          size="large"
          icon={<MdClear fontSize={"24px"} />}
        />
      </Popconfirm>
    </div>
  );
};
