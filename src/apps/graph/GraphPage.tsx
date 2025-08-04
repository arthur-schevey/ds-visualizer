import GraphFlow from "./components/GraphFlow"

const GraphPage = () => {
  return (
    <>
      <title>Graph Builder — DS Chef</title>
      <meta name="description" content={"Build and explore graphs interactively with DS Chef. Export test cases as JSON or edge lists and use them to develop or debug your algorithms."} />
      <meta property="og:title" content={"Graph Builder — DS Chef"} />
      <meta property="og:image" content={"https://dschef.com/images/graph-demo.png"} />
      <GraphFlow/>
    </>
  )
}

export default GraphPage