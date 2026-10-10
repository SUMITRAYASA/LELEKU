
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Icon } from "@iconify/react";

import Sidebar from "../components/Sidebar";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen((previous) => !previous);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#F3F7F5]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Area konten di sebelah sidebar */}
      <div className="min-h-screen md:ml-[260px]">
        {/* Header */}
        <header className="flex h-[78px] items-center gap-4 border-b border-[#E2EBE5] bg-white px-5 md:px-8">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Buka atau tutup menu"
            className="rounded-lg p-2 text-[#12544F] hover:bg-[#EAF2ED] md:hidden"
          >
            <Icon
              icon="lucide:menu"
              width="24"
            />
          </button>

          <div>
            <h1 className="text-lg font-bold text-[#092328]">
              LELEKU
            </h1>

            <p className="text-xs text-[#718780]">
              Pencatatan Ternak Lele
            </p>
          </div>
        </header>

        {/* Konten sesuai route */}
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
