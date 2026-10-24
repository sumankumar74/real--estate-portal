
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buy", path: "/properties?type=For Sale" },
    { name: "Rent", path: "/properties?type=For Rent" },
    { name: "Properties", path: "/properties" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  useEffect(() => {
    const loadUser = () => {
      const savedUser =
        localStorage.getItem("estatehubUser") ||
        sessionStorage.getItem("estatehubUser");

      const token =
        localStorage.getItem("estatehubToken") ||
        sessionStorage.getItem("estatehubToken");

      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("estatehubToken");
    localStorage.removeItem("estatehubUser");
    sessionStorage.removeItem("estatehubToken");
    sessionStorage.removeItem("estatehubUser");

    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-emerald-900"
        : "text-stone-600 hover:text-emerald-800"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-emerald-900"
        >
          Estate<span className="text-amber-600">Hub</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="max-w-32 truncate text-sm font-semibold text-emerald-950">
                  {user.name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-stone-200 px-4 py-2 font-medium text-stone-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 font-medium text-emerald-900 hover:bg-emerald-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-emerald-900 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-stone-200 px-3 py-2 text-emerald-900 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={linkClass}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="border-t border-stone-100 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-emerald-950">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-stone-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-red-200 px-4 py-3 font-medium text-red-700 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg border border-emerald-900 px-4 py-2 text-center text-emerald-900"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg bg-emerald-900 px-4 py-2 text-center text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
