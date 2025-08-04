import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Layout from "@shared/components/Layout";
import NotFoundPage from "./NotFoundPage";
import MobileUnsupportedPage from "./MobileUnsupportedPage";
import { Spin } from "antd";
import { lazy, Suspense } from "react";

const TreePage = lazy(() => import('@tree/TreePage'));
const GraphPage = lazy(() => import('@graph/GraphPage'));

const Loading = () => {
  return <Spin tip="Loading" style={{ fontSize: 64 }} fullscreen />
}

export default function App() {
  
  if (/Mobi|Android/i.test(navigator.userAgent)) return <MobileUnsupportedPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/tree" replace />} />
          <Route
            path="/tree"
            element={
              <Suspense fallback={<Loading />}>
                <TreePage />
              </Suspense>
            }
          />
          <Route
            path="/graph"
            element={
              <Suspense fallback={<Loading />}>
                <GraphPage />
              </Suspense>
            }
          />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}