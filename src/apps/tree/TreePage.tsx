import TreeFlow from "./components/TreeFlow";

const TreePage = () => {
  return (
    <>
      <title>Binary Tree Builder — DS Chef</title>
      <meta name="description" content={"DS Chef’s Binary Tree Builder lets you create trees visually and export them in LeetCode format for algorithm practice, debugging, or teaching."} />
      <meta property="og:title" content={"Binary Tree Builder — DS Chef"} />
      <meta property="og:image" content={"/public/images/tree-demo.png"} />
      <TreeFlow />
    </>
  );
};

export default TreePage;
