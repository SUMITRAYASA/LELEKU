import { Bell, ChevronDown, UserRound } from "lucide-react";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const pageTitles = {
    "/kolam": "Kolam",
    "/pakan": "Pakan",
    "/pertumbuhan": "Pertumbuhan",
  };

  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8">

      {/* Judul halaman */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          Kelola dan pantau aktivitas peternakan lele.
        </p>
      </div>

      {/* Profil pengguna */}
      <div className="flex items-center gap-5">

        <button className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100">
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex cursor-pointer items-center gap-3 border-l border-gray-200 pl-5">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <UserRound size={21} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Admin Leleku
            </p>

            <p className="text-xs text-gray-400">
              Administrator
            </p>
          </div>

          <ChevronDown size={16} className="text-gray-400" />

        </div>

      </div>
    </header>
  );
}

export default Header;
