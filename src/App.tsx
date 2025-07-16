import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import TreeFlow from "./apps/tree/TreeFlow";
import GraphFlow from "./apps/graph/GraphFlow";
import Layout from "./shared/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/tree" replace />} />
          <Route path="/tree" element={<TreeFlow />} />
          <Route path="/graph" element={<GraphFlow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}