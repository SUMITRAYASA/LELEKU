
import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";

const mainMenus = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "lucide:layout-dashboard",
    end: true,
  },
  {
    label: "Pertumbuhan",
    path: "/admin/pertumbuhan",
    icon: "lucide:chart-no-axes-combined",
  },
  {
    label: "Pakan",
    path: "/admin/pakan",
    icon: "lucide:wheat",
  },
];

const bottomMenus = [
  {
    label: "Settings",
    path: "/admin/settings",
    icon: "lucide:settings",
  },
  {
    label: "Bantuan",
    path: "/admin/bantuan",
    icon: "lucide:circle-help",
  },
];

function Sidebar({ isOpen = true, onClose }) {
  return (
    <>
      {/* Overlay untuk tampilan mobile */}
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[260px] flex-col
          bg-[#092328] text-white
          transition-transform duration-300
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="Sidebar-Header flex h-[78px] items-center gap-3 border-b border-white/10 px-6">
          <div className="logo">

          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              LELEKU
            </h1>

            <p className="text-[10px] font-medium tracking-[2px] text-[#8BBB92]">
              FARM MANAGEMENT
            </p>
          </div>
        </div>

        <div className="Menu-Utama flex-1 px-3 py-7">

          <nav className="space-y-2">
            {mainMenus.map((menu) => (
              <NavLink
                key={menu.path}
                to={menu.path}
                end={menu.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    relative flex items-center gap-3
                    rounded-lg px-4 py-3 text-sm
                    font-medium transition-colors
                    ${
                      isActive
                        ? "bg-[#12544F] text-white"
                        : "text-[#B4CBC4] hover:bg-white/10 hover:text-white"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#8BBB92]" />
                    )}

                    <Icon
                      icon={menu.icon}
                      width="20"
                      className="shrink-0"
                    />

                    <span>{menu.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="Menu space-y-2 border-t border-white/10 px-3 py-5">
          {bottomMenus.map((menu) => (
            <NavLink
              key={menu.path}
              to={menu.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                  flex items-center gap-3 rounded-lg
                  px-4 py-3 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-[#12544F] text-white"
                      : "text-[#B4CBC4] hover:bg-white/10 hover:text-white"
                  }
                `
              }
            >
              <Icon icon={menu.icon} width="20" />
              <span>{menu.label}</span>
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => {
              // Aksi logout akan kita buat nanti.
              console.log("Logout diklik");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#B4CBC4] transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon icon="lucide:log-out" width="20" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
