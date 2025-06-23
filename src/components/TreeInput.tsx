import { useEffect, useState } from "react";
import { useTreeStore } from "../store";
import { serializeToLeetcode } from "../utils/helpers";
import { Button, Cascader, Input } from "antd";
import { MdOutlineContentCopy } from "react-icons/md";


interface Option {
  value: string;
  label: string;
}

const options: Option[] = [
  {
    value: 'Leetcode',
    label: 'leetcode-s',
  },
    {
    value: 'Leetcaode',
    label: 'leetcdode-s',
  },
];

export const TreeInput = () => {
  const { nodes, rootId } = useTreeStore();
  const [inputValue, setInputValue] = useState('');

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
        addonBefore={<Cascader placeholder="Leetcode" options={options} style={{ width: 150 }} />}
        size="large"
        variant="filled"
        value={inputValue}
        style={{width: 900}}
        onChange={handleChange}
        defaultValue="mysite"
      />
      <Button type="primary" icon={<MdOutlineContentCopy/>}/>
    </div>

  );
};
