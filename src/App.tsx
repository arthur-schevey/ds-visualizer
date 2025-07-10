import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import TreeFlow from "./flows/TreeFlow";
import GraphFlow from "./flows/GraphFlow";
import Layout from "./Layout";

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