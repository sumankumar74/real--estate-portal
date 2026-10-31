
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProperties, formatPrice } from "../services/propertyService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("estatehubUser") ||
      sessionStorage.getItem("estatehubUser");

    const token =
      localStorage.getItem("estatehubToken") ||
      sessionStorage.getItem("estatehubToken");

    if (!savedUser || !token) {
      toast.info("Please log in to access your dashboard.");
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      toast.error("Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setFavorites(
        JSON.parse(localStorage.getItem("estatehub-favourites") || "[]")
      );
    } catch {
      setFavorites([]);
    }

    getProperties()
      .then(setProperties)
      .catch(() => toast.error("Unable to load properties."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const favoriteProperties = properties.filter((property) =>
    favorites.includes(property.id)
  );

  const handleLogout = () => {
    localStorage.removeItem("estatehubToken");
    localStorage.removeItem("estatehubUser");
    sessionStorage.removeItem("estatehubToken");
    sessionStorage.removeItem("estatehubUser");
    toast.success("Logged out successfully.");
    navigate("/");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-emerald-950 p-8 text-white sm:p-10">
          <p className="text-sm font-medium text-emerald-200">
            YOUR ESTATEHUB ACCOUNT
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-3 text-emerald-100">
            Manage your account and explore your favorite properties.
          </p>
          <Link
            to="/properties"
            className="mt-6 inline-block rounded-xl bg-amber-500 px-5 py-3 font-semibold text-emerald-950 transition hover:bg-amber-400"
          >
            Explore Properties
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">Saved Properties</p>
            <p className="mt-3 text-3xl font-bold text-emerald-950">
              {favorites.length}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Properties added to your favorites
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">Account Status</p>
            <p className="mt-3 text-2xl font-bold text-emerald-700">
              Active
            </p>
            <p className="mt-2 text-sm text-stone-500">
              Your account is ready to use
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-stone-500">Property Inquiries</p>
            <p className="mt-3 text-3xl font-bold text-emerald-950">0</p>
            <p className="mt-2 text-sm text-stone-500">
              Inquiry tracking can be added next
            </p>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                My Favorite Properties
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Your personally saved property listings
              </p>
            </div>
            <Link
              to="/properties"
              className="text-sm font-semibold text-emerald-800 hover:text-emerald-600"
            >
              Browse all
            </Link>
          </div>

          {loading ? (
            <p className="py-10 text-center text-stone-500">
              Loading your favorites...
            </p>
          ) : favoriteProperties.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-12 text-center">
              <h3 className="text-lg font-semibold text-stone-800">
                No favorite properties yet
              </h3>
              <p className="mt-2 text-stone-500">
                Save properties you like, and they will appear here.
              </p>
              <Link
                to="/properties"
                className="mt-5 inline-block rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
              >
                Find a Property
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteProperties.map((property) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={
                      property.image ||
                      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                    }
                    alt={property.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xl font-bold text-emerald-950">
                      {formatPrice(property.price, property.type)}
                    </p>
                    <h3 className="mt-2 font-semibold text-stone-900">
                      {property.name}
                    </h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {property.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-stone-900">Account Details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-stone-500">Full Name</p>
              <p className="mt-1 font-semibold text-stone-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Email Address</p>
              <p className="mt-1 break-all font-semibold text-stone-900">
                {user.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-7 rounded-lg border border-red-200 px-5 py-2.5 font-semibold text-red-700 transition hover:bg-red-50"
          >
            Log Out
          </button>
        </section>
      </div>
    </main>
  );
}
