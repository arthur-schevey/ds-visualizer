import { useEffect, useState } from "react";
import { useTreeStore } from "../store";
import { deserializeLeetcode, serializeToLeetcode } from "../utils/helpers";

export const TreeInput = () => {
  const { nodes, rootId, setTree } = useTreeStore();
  const [inputValue, setInputValue] = useState('');

  // Update input whenever the tree changes
  useEffect(() => {
    const leetcodeStr = serializeToLeetcode(nodes, rootId);
    setInputValue(leetcodeStr);
  }, [nodes, rootId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    const { nodes: newNodes, rootId: newRootId } = deserializeLeetcode(inputValue);
    setTree(newNodes, newRootId);
  };

  return (
    <>
      <input
        value={inputValue}
        style={{width: 900}}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>
        Update Tree
      </button>
    </>
  );
};
