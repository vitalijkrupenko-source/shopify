import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BuilderPage from "./pages/BuilderPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<BuilderPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}
