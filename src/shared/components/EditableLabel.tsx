import { useEffect, useRef } from "react";

/**
 * Displays a value that can be edited. Losing focus in any way (like `Enter` or clicking out)
 * will trigger onSubmit. Otherwise, `Esc` will cancel the editing and return to previous state.
 *
 * @property initialValue - The initial string value to display and edit.
 * @property editing - Whether the label is currently in editing mode
 * @property setEditing - Callback to toggle the editing state
 * @property onSubmit - Callback invoked with the new value when editing is submitted.
 * @property renderDisplay - Optional custom render function for displaying the value when not editing.
 */
type EditableLabelProps = {
  initialValue: string;
  editing: boolean;
  setEditing: (v: boolean) => void;
  onSubmit: (newVal: string) => void;
  renderDisplay?: (value: string) => React.ReactNode;
};

export const EditableLabel = ({
  initialValue,
  editing,
  setEditing,
  onSubmit,
  renderDisplay,
}: EditableLabelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const originalVal = useRef(initialValue.toString());

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [editing]);

  const handleBlur = (save: boolean) => {
    if (save && inputRef.current) {
      onSubmit(inputRef.current.value);
      originalVal.current = inputRef.current.value;
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        handleBlur(true);
        break;
      case "Escape":
        if (inputRef.current) {
          inputRef.current.value = originalVal.current.toString();
        }
        handleBlur(false);
        break;
    }
  };

  // If editing, display an input. Otherwise, render the label with the
  // provided renderDisplay, or a plain string if no renderDisplay was provided.
  return (
    <>
      {editing ? (
        <input
          ref={inputRef}
          defaultValue={originalVal.current}
          onBlur={() => handleBlur(true)}
          onKeyDown={handleKeyDown}
        />
      ) : renderDisplay ? (
        renderDisplay(originalVal.current)
      ) : (
        originalVal.current
      )}
    </>
  );
};
