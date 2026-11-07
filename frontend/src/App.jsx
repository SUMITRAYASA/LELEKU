import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Kolam from "./pages/Kolam";
import Pakan from "./pages/Pakan";
import Pertumbuhan from "./pages/Pertumbuhan";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/kolam" replace />} />
          <Route path="kolam" element={<Kolam />} />
          <Route path="pakan" element={<Pakan />} />
          <Route path="pertumbuhan" element={<Pertumbuhan />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
