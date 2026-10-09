
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AppProvider } from "./context/AppContext";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import PertumbuhanPage from "./pages/admin/PertumbuhanPage";

function PlaceholderPage({ title }) {
  return (
    <div className="rounded-2xl bg-white p-6">
      <h2 className="text-xl font-bold text-[#092328]">
        {title}
      </h2>

      <p className="mt-2 text-sm text-[#718780]">
        Halaman ini akan kita kembangkan nanti.
      </p>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/admin" replace />}
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />

          <Route
            path="pertumbuhan"
            element={<PertumbuhanPage />}
          />

          <Route
            path="pakan"
            element={<PlaceholderPage title="Pakan" />}
          />

          <Route
            path="settings"
            element={<PlaceholderPage title="Settings" />}
          />

          <Route
            path="bantuan"
            element={<PlaceholderPage title="Bantuan" />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/admin" replace />}
        />
      </Routes>
    </AppProvider>
  );
}

export default App;
