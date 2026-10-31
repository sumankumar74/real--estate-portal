
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    forSale: 0,
    forRent: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const token =
        localStorage.getItem("estatehubToken") ||
        sessionStorage.getItem("estatehubToken");

      try {
        const [propertyResponse, userResponse] = await Promise.all([
          fetch("http://localhost:5000/api/properties/admin/all"),
          fetch("http://localhost:5000/api/auth/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!propertyResponse.ok || !userResponse.ok) {
          throw new Error("Unable to load dashboard statistics.");
        }

        const propertyData = await propertyResponse.json();
        const userData = await userResponse.json();

        const properties = propertyData.properties || [];

        setStats({
          totalProperties: propertyData.count ?? properties.length,
          forSale: properties.filter(
            (property) => property.listingType === "For Sale"
          ).length,
          forRent: properties.filter(
            (property) => property.listingType === "For Rent"
          ).length,
          totalUsers: userData.count ?? userData.users?.length ?? 0,
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const cards = [
    {
      title: "Total Properties",
      value: stats.totalProperties,
    },
    {
      title: "For Sale",
      value: stats.forSale,
    },
    {
      title: "For Rent",
      value: stats.forRent,
    },
    {
      title: "Registered Users",
      value: stats.totalUsers,
    },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-emerald-950">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-stone-500">
          Welcome to your EstateHub administration panel.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">
              {card.title}
            </p>
            <p className="mt-3 text-3xl font-bold text-emerald-950">
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/add-property"
          className="rounded-xl bg-emerald-900 px-5 py-3 font-medium text-white hover:bg-emerald-800"
        >
          Add Property
        </Link>

        <Link
          to="/admin/properties"
          className="rounded-xl border border-stone-300 px-5 py-3 font-medium text-stone-700 hover:bg-stone-50"
        >
          Manage Properties
        </Link>

        <Link
          to="/admin/users"
          className="rounded-xl border border-stone-300 px-5 py-3 font-medium text-stone-700 hover:bg-stone-50"
        >
          Manage Users
        </Link>
      </div>
    </section>
  );
}
