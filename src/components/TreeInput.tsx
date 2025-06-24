import { useEffect, useState } from "react";
import { useTreeStore } from "../store";
import { serialize } from "../utils/helpers";
import {
  Button,
  Cascader,
  Input,
  message,
  notification,
  Select,
  type CascaderProps,
  type SelectProps,
} from "antd";
import { MdOutlineContentCopy } from "react-icons/md";
import type { TreeFormat } from "../types/serialization";
import { IoEnterOutline } from "react-icons/io5";

interface Option {
  value: TreeFormat;
  label: string;
}

const options: Option[] = [
  {
    value: "leetcode-strict",
    label: "LeetCode",
  },
  {
    value: "leetcode",
    label: "LeetCode (allow non-numeric)",
  },
];

export const TreeInput = () => {
  const { nodes, rootId } = useTreeStore();
  const [inputValue, setInputValue] = useState("");
  const [format, setFormat] = useState<TreeFormat>("leetcode-strict");

  // Update input whenever the tree changes
  useEffect(() => {
    switch (format) {
      case "leetcode-strict":
        try {
          setInputValue(serialize("leetcode-strict", nodes, rootId));
        } catch (err) {
          setInputValue(serialize("leetcode", nodes, rootId));
          setFormat("leetcode")
          message.warning(
            "LeetCode strings do not support non-numeric node values so your format has been automatically switched to allow quotes. If you want to return to the standard LeetCode format, remove any non-numeric values.",
            8 // seconds
          );
        }
        break;
      case "leetcode":
        setInputValue(serialize("leetcode", nodes, rootId));
        break;
    }
  }, [nodes, rootId, format]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // const handleSubmit = () => {
  //   const { nodes: newNodes, rootId: newRootId } = deserializeLeetcode(inputValue);
  //   setTree(newNodes, newRootId);
  // };

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

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
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
        suffix={
          <IoEnterOutline fontSize={"24px"} />
          // <Button icon={} type="text" variant="text" size="small"/>
        }
        size="large"
        variant="outlined"
        value={inputValue}
        style={{ width: 900 }}
        onChange={handleChange}
        defaultValue="mysite"
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
    </div>
  );
};
