import { notify } from "@shared/notify";
import { Button } from "antd";
import { MdOutlineFileDownload } from "react-icons/md";

const saveTextAsFile = (content: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.txt";
  link.click();
  URL.revokeObjectURL(link.href); // Clean up
};

const ButtonDownload = ({ text }: { text: string }) => {
  return (
    <Button
      type="primary"
      size="large"
      onClick={() => {saveTextAsFile(text); notify.download()}}
      icon={<MdOutlineFileDownload fontSize={"24px"} />}
      aria-label="Download tool output"
    />
  );
};

export default ButtonDownload;
