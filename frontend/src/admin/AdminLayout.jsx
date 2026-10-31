import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BadgeCheck, Users,LayoutDashboard,HousePlus,Building2,MessageSquare  } from "lucide-react";

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [adminName, setAdminName] = useState("Administrator");

  const navigate = useNavigate();

  const navItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Add Property",
    path: "/admin/add-property",
    icon: <HousePlus size={20} />,
  },
  {
    name: "Manage Properties",
    path: "/admin/properties",
    icon: <Building2 size={20} />,
  },
  {
    name: "Sold Properties",
    path: "/admin/sold",
    icon: <BadgeCheck size={20} />,
  },
  {
    name: "Manage Users",
    path: "/admin/users",
    icon: <Users size={20} />,
  },
  {
  name: "Enquiries",
  path: "/admin/enquiries",
  icon: <MessageSquare size={20} />,
}
];

  const handleLogout = () => {
    localStorage.removeItem("estatehubToken");
    localStorage.removeItem("estatehubUser");
    sessionStorage.removeItem("estatehubToken");
    sessionStorage.removeItem("estatehubUser");

    toast.success("Logged out successfully.");
    navigate("/login");
  };

  useEffect(() => {
    const userData =
      localStorage.getItem("estatehubUser") ||
      sessionStorage.getItem("estatehubUser");

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setAdminName(user.name || "Administrator");
      } catch {
        setAdminName("Administrator");
      }
    }

    const updateTimer = () => {
      const token =
        localStorage.getItem("estatehubToken") ||
        sessionStorage.getItem("estatehubToken");

      if (!token) {
        setTimeLeft(null);
        return;
      }

      try {
        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
        );

        if (!payload.exp) {
          setTimeLeft(null);
          return;
        }

        const remaining = payload.exp * 1000 - Date.now();

        if (remaining <= 0) {
          setTimeLeft(0);
          handleLogout();
          return;
        }

        setTimeLeft(Math.floor(remaining / 1000));
      } catch {
        setTimeLeft(null);
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--:--";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-emerald-950 text-white">
      <Link
        to="/"
        className="border-b border-white/10 px-6 py-6 text-2xl font-bold"
      >
        Estate<span className="text-amber-400">Hub</span>
        <p className="mt-1 text-xs font-medium tracking-widest text-emerald-300">
          ADMIN PANEL
        </p>
      </Link>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                isActive
                  ? "bg-amber-400 text-emerald-950 shadow-lg"
                  : "text-emerald-100 hover:bg-white/10"
              }`
            }
          >
            <span className="flex items-center justify-center">
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          to="/"
          className="mb-2 block rounded-xl px-4 py-3 text-emerald-100 hover:bg-white/10"
        >
          ← View Website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-xl px-4 py-3 text-left font-medium text-red-200 transition hover:bg-red-500/15"
        >
          ↪ Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        {sidebar}
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-white shadow-sm">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-xl border border-stone-200 px-3 py-2 text-xl text-emerald-950 lg:hidden"
                aria-label="Toggle admin menu"
              >
                ☰
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  EstateHub Management
                </p>
                <h1 className="text-lg font-bold text-stone-900 sm:text-xl">
                  Admin Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 sm:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-stone-500">
                    Session Remaining
                  </p>
                  <p className="font-mono text-sm font-bold text-emerald-900">
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 border-l border-stone-200 pl-3 sm:pl-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-950 font-bold text-amber-400">
                  {adminName.charAt(0).toUpperCase()}
                </div>

                <div className="hidden sm:block">
                  <p className="max-w-32 truncate text-sm font-semibold text-stone-800">
                    {adminName}
                  </p>
                  <p className="text-xs text-emerald-700">Administrator</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 md:block"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 bg-emerald-50/60 px-5 py-2 sm:hidden">
            <span className="text-xs font-medium text-stone-500">
              Session Remaining
            </span>
            <span className="font-mono text-sm font-bold text-emerald-900">
              {formatTime(timeLeft)}
            </span>
          </div>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
              {sidebar}
            </aside>
          </div>
        )}

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
