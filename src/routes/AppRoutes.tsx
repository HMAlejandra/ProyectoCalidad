import { Routes, Route } from "react-router-dom";

// Views
import Pintura3DPage from "../views/Pintura3DPage";
import DigitalSculptureView from "../views/DigitalSculptureView";
import SistemaSolar3DView from "../views/SistemaSolar3DView";




export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/pintura3d" element={<Pintura3DPage />} />
      <Route path="/escultura3d" element={<DigitalSculptureView />} />
      <Route path="/sistema-solar" element={<SistemaSolar3DView />} />
    </Routes>
  );
}