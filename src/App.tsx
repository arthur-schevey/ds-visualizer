import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Layout from "@shared/components/Layout";
import NotFoundPage from "./NotFoundPage";
import MobileUnsupportedPage from "./MobileUnsupportedPage";
import TreePage from "@tree/TreePage";
import GraphPage from "@graph/GraphPage";

export default function App() {
  
  if (/Mobi|Android/i.test(navigator.userAgent)) return <MobileUnsupportedPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/tree" replace />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}