
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Buy", path: "/properties?type=For Sale" },
    { name: "Rent", path: "/properties?type=For Rent" },
    { name: "Properties", path: "/properties" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-emerald-900">
          Estate<span className="text-amber-600">Hub</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-stone-600 transition hover:text-emerald-800"
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
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
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-stone-700 hover:text-emerald-800"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex gap-3 border-t border-stone-100 pt-4">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg border border-emerald-900 px-4 py-2 text-center text-emerald-900"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg bg-emerald-900 px-4 py-2 text-center text-white"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
