/**
 * `Layout` is the main container component for the application.
 * It provides a navigation menu for switching between the Binary Tree Editor and Graph Editor,
 * renders shared SVG definitions, and displays the current app version and a link to the GitHub repository
 * in a floating footer. Most importantly, it has an <Outlet/> where the app will be rendered.
 *
 * @returns The layout structure for the app, including navigation, content outlet, and footer.
 */
import "@xyflow/react/dist/style.css";
import { Menu, type MenuProps } from "antd";
import { PiGraph } from "react-icons/pi";
import { TbBinaryTree } from "react-icons/tb";
import { Link, Outlet, useLocation } from "react-router";
import { SVGDefs } from "@shared/components/SVGDefs";
import Footer from "./Footer";

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
  const location = useLocation();

  // Extract route identifier based on pathname for footer
  const route = (() => {
    if (location.pathname.startsWith('/graph')) return 'graph';
    if (location.pathname.startsWith('/tree')) return 'tree';
    return 'default';
  })();

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
      
      <Footer route={route}/>
    </div>
  );
}

export default Layout;
