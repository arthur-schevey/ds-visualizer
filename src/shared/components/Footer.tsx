import { APP_VERSION } from "@shared/version";
import { Button, Modal, Tag, Tooltip } from "antd";
import { useEffect, useState, type JSX } from "react";
import { AiOutlineGithub } from "react-icons/ai";
import { IoMdHelp } from "react-icons/io";
import { Typography } from "antd";

type Route = "graph" | "tree" | "default";

const { Title, Paragraph, Text } = Typography;

const HELP_TEXT: Record<Route, JSX.Element> = {
  graph: (
    <>
      <Title>🌌 Graph Editor</Title>
      <Paragraph>
        <ul>
          <li>🖱️ <strong>Double-click canvas:</strong> Create a node</li>
          <li>✏️ <strong>Double-click node/edge:</strong> Edit label or weight</li>
          <li>🧲 <strong>Press <kbd>Space</kbd>:</strong> Toggle between edge-drawing and node-dragging</li>
          <li>🧼 <strong>Press <kbd>Del</kbd>:</strong> Delete node/edge</li>
        </ul>
      </Paragraph>
    </>
  ),
  tree: (
    <>
      <Title>🌌 Binary Tree Editor</Title>
      <Paragraph>
        <ul>
          <li>➕ <strong>Select node:</strong> Create child</li>
          <li>✏️ <strong>Double-click node:</strong> Edit node</li>
          <li>🧼 <strong>Press <kbd>Del</kbd>:</strong> Delete node and its children </li>
        </ul>
      </Paragraph>
    </>
  ),
  default: <></>,
};

const Footer = ({ route }: { route: Route }) => {
  const [showHelp, setShowHelp] = useState(false);

  // On component mount or route change, check if user has viewed app instructions yet
  useEffect(() => {
    const key = `help_shown_${route}`;
    if (!localStorage.getItem(key)) {
      setShowHelp(true);
      localStorage.setItem(key, "true");
    }
  }, [route]);

  return (
    <div className="floating-footer">
      <Tag>v{APP_VERSION}</Tag>

      <Tooltip title="View on GitHub">
        <Button
          style={{ marginRight: 6 }}
          shape="circle"
          href="https://github.com/arthur-schevey/ds-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
        >
          <AiOutlineGithub style={{ fontSize: "20px" }} />
        </Button>
      </Tooltip>

      <Tooltip title="View Instructions">
        <Button
          shape="circle"
          onClick={() => setShowHelp(true)}
          aria-label="View Instructions"
        >
          <IoMdHelp style={{ fontSize: "20px" }} />
        </Button>
      </Tooltip>

      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        title={<Text type="secondary" italic>First time? </Text>}
        open={showHelp}
        footer={<></>}
        style={{ top: 150 }}
        onOk={() => setShowHelp(false)}
        onCancel={() => setShowHelp(false)}
      >
        {HELP_TEXT[route]}
      </Modal>
    </div>
  );
};

export default Footer;
