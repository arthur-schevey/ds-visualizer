import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { useEffect, useRef, useState } from "react";
import styles from './TreeNode.module.css'
import { useAppContext } from "../../AppContext";
import clsx from "clsx";

type TreeNode = Node<{ label: string; leftId?: string; rightId?: string }, 'random-test-type'>;

const TreeNode = ({ id, selected, data }: NodeProps<TreeNode>) => {

  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // reference to component so it can be immediately focused in handleDoubleClick
  const inputOriginalVal = useRef(data.label)
  const { state, dispatch } = useAppContext();

  // Handles changing editing state
  useEffect(() => {
    if (!inputRef.current) return
    console.log("set");
    
    if (editing) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(
        0,
        inputRef.current.value.length
      );
    }
  }, [editing])

  /**
   * Component lost focus, so we're going to stop editing 
   * and conditionally save the current value based on @param doSave.
   * 
   * @param doSave 
   */
  const handleBlur = (doSave: boolean) => {
    if (doSave && inputRef.current) {
      dispatch({type: 'UPDATE_NODE_LABEL', id: id, label: inputRef.current?.value ?? ''})
      inputOriginalVal.current = inputRef.current.value // Update prevVal for use with `Esc`
    }
    
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch(e.key) {
      case 'Enter': 
        handleBlur(true); break;

      // Resets the value to the original value
      case 'Escape': 
        if (inputRef.current) {
          inputRef.current.value = inputOriginalVal.current; 
        }
        handleBlur(false); break;
    }
  }

  const handleAddNode = (side: "left" | "right") => {
    dispatch({type: 'NODE_ADD_CHILD', parentId: id, side: side})
    console.log("SCREAM!");
    
  }

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      onBlur={() => handleBlur(true)}
      onKeyDown={handleKeyDown}
      className={clsx(styles.treenode, selected && styles.selected)}
    >
      
      {editing ? <input ref={inputRef} defaultValue={data.label} ></input> : data.label}

      {selected && 
        <>
          {!data.leftId &&
            <button 
              className={clsx(styles.addNode, styles.left)}
              onClick={() => handleAddNode("left")}
            >
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          }

          {!data.rightId &&
            <button 
              className={clsx(styles.addNode, styles.right)}
              onClick={() => handleAddNode("right")}
            >
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          }
        </>

      }

      {/* Invisible/uninteractable handles required for edge connections */}
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <Handle type="source" position={Position.Left} isConnectable={false} />
    </div>
  );
};

export default TreeNode;

