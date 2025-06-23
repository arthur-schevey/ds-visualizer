import { useEffect, useState } from "react";
import { useTreeStore } from "../store";
import { serializeToLeetcode } from "../utils/helpers";
import { Button, Cascader, Input, notification } from "antd";
import { MdOutlineContentCopy } from "react-icons/md";

interface Option {
  value: string;
  label: string;
}

const options: Option[] = [
  {
    value: "leetcode",
    label: "Leetcode",
  },
];

export const TreeInput = () => {
  const { nodes, rootId } = useTreeStore();
  const [inputValue, setInputValue] = useState("");

  // Update input whenever the tree changes
  useEffect(() => {
    const leetcodeStr = serializeToLeetcode(nodes, rootId);
    setInputValue(leetcodeStr);
  }, [nodes, rootId]);

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
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)", // for frosted effect (some browsers)
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <Input
        addonBefore={
          <Cascader
            placeholder="Leetcode"
            options={options}
            style={{ width: 150 }}
          />
        }
        size="large"
        variant="filled"
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
