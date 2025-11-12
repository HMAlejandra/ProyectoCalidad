import { Routes, Route } from "react-router-dom";

// Views
import Pintura3DPage from "../views/Pintura3DPage";
import DigitalSculptureView from "../views/DigitalSculptureView";
import SistemaSolar3DView from "../views/SistemaSolar3DView";
import Page from "../views/Page";




export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/pintura3d" element={<Pintura3DPage />} />
      <Route path="/escultura3d" element={<DigitalSculptureView />} />
      <Route path="/sistema-solar" element={<SistemaSolar3DView />} />
      <Route path="*" element={<Page />} />
    </Routes>
  );
}