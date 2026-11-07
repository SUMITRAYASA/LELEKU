import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Area utama */}
      <main className="ml-64 min-h-screen">

        {/* Header */}
        <Header />

        {/* Konten halaman */}
        <div className="p-8">
          <Outlet />
        </div>

      </main>

    </div>
  );
}

export default DashboardLayout;
