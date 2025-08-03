import { notify } from "@shared/notify"
import { Button } from "antd"
import { MdOutlineContentCopy } from "react-icons/md"

const ButtonCopy = ({ text }: { text: string }) => {
  return (
    <Button
      type="primary"
      size="large"
      onClick={() =>
        navigator.clipboard
          .writeText(text)
          .then(notify.copy)
          .catch((err) => notify.copyErr(err))
      }
      icon={<MdOutlineContentCopy fontSize={"24px"} />}
    />
  )
}

export default ButtonCopy