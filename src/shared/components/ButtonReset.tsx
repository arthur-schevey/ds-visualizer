import { Button, Popconfirm } from "antd"
import { IoMdTrash } from "react-icons/io"

const ButtonReset = ({ onClick, popMessage }: { onClick: () => void; popMessage: string }) => {
  return (
    <Popconfirm
      title={popMessage}
      onConfirm={onClick}
      okText="Yes"
    >
      <Button
        danger
        type="default"
        size="large"
        icon={<IoMdTrash fontSize={"24px"} />}
      />
    </Popconfirm>
  )
}

export default ButtonReset