/**
 * `Layout` is the main container component for the application.
 * It provides a navigation menu for switching between the Binary Tree Editor and Graph Editor,
 * renders shared SVG definitions, and displays the current app version and a link to the GitHub repository
 * in a floating footer. Most importantly, it has an <Outlet/> where the app will be rendered.
 *
 * @returns The layout structure for the app, including navigation, content outlet, and footer.
 */
import "@xyflow/react/dist/style.css";
import { Menu, Tag, Tooltip, type MenuProps } from "antd";
import { AiOutlineGithub } from "react-icons/ai";
import { APP_VERSION } from "./version";
import { PiGraph } from "react-icons/pi";
import { TbBinaryTree } from "react-icons/tb";
import { Link, Outlet } from "react-router";
import { SVGDefs } from "./SVGDefs";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link to="/tree">Binary Tree Editor</Link>,
    key: "tree",
    icon: <TbBinaryTree />,
  },
  {
    label: <Link to="/graph">Graph Editor</Link>,
    key: "graph",
    icon: <PiGraph />,
  },
];


function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Menu mode="horizontal" items={items} />
      <SVGDefs />
      <Outlet />

      {/* Version and GitHub link */}
      <div className="floating-footer">
        <Tag>v{APP_VERSION}</Tag>

        <Tooltip title="View on GitHub">
          <a
            href="https://github.com/arthur-schevey/ds-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <Tag icon={<AiOutlineGithub style={{ fontSize: "20px" }} />} />
          </a>
        </Tooltip>
      </div>
    </div>
  );
}

export default Layout;
