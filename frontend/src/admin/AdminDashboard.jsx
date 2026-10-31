
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Building2,
  CheckCircle,
  BadgeCheck,
  KeyRound,
  Users,
  RefreshCw,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function AdminDashboard() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("estatehubToken") ||
    sessionStorage.getItem("estatehubToken");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [propertyResponse, userResponse] = await Promise.all([
        fetch(`${API_URL}/properties/admin/all`, { headers }),
        fetch(`${API_URL}/auth/users`, { headers }),
      ]);

      const propertyData = await propertyResponse.json();
      const userData = await userResponse.json();

      if (!propertyResponse.ok) {
        throw new Error(
          propertyData.message || "Failed to load properties."
        );
      }

      if (!userResponse.ok) {
        throw new Error(userData.message || "Failed to load users.");
      }

      setProperties(
        Array.isArray(propertyData)
          ? propertyData
          : propertyData.properties || propertyData.data || []
      );

      setUsers(
        Array.isArray(userData)
          ? userData
          : userData.users || userData.data || []
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: Building2,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Available",
      value: properties.filter(
        (property) => !property.status || property.status === "Available"
      ).length,
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Sold",
      value: properties.filter(
        (property) => property.status === "Sold"
      ).length,
      icon: BadgeCheck,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Rented",
      value: properties.filter(
        (property) => property.status === "Rented"
      ).length,
      icon: KeyRound,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Registered Users",
      value: users.length,
      icon: Users,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your EstateHub platform.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
