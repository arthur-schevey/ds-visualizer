import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import TreeFlow from "./apps/tree/TreeFlow";
import GraphFlow from "./apps/graph/GraphFlow";
import Layout from "@shared/components/Layout";
import NotFoundPage from "./NotFoundPage";
import MobileUnsupportedPage from "./MobileUnsupportedPage";

export default function App() {
  
  if (/Mobi|Android/i.test(navigator.userAgent)) return <MobileUnsupportedPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/tree" replace />} />
          <Route path="/tree" element={<TreeFlow />} />
          <Route path="/graph" element={<GraphFlow />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}