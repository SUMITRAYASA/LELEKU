import { NavLink } from "react-router-dom";
import { Waves, Wheat, TrendingUp } from "lucide-react";

function Sidebar() {
  const menus = [
    {
      name: "Kolam",
      path: "/kolam",
      icon: Waves,
    },
    {
      name: "Pakan",
      path: "/pakan",
      icon: Wheat,
    },
    {
      name: "Pertumbuhan",
      path: "/pertumbuhan",
      icon: TrendingUp,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-gray-200 bg-white px-5 py-7">

      {/* Nama aplikasi */}
      <div className="mb-12 px-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Leleku
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Fish Farming Management
        </p>
      </div>

      {/* Navigasi */}
      <nav className="flex flex-col gap-2">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu Utama
        </p>

        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              {menu.name}
            </NavLink>
          );
        })}

      </nav>

      <div className="mt-auto border-t border-gray-100 pt-5 px-2">
        <p className="text-xs text-gray-400">
          LELEKU Management System
        </p>
        <p className="mt-1 text-xs text-gray-300">
          Version 1.0.0
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;
