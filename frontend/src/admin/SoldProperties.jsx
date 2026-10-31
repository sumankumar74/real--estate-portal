
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RefreshCw, BadgeCheck, MapPin, RotateCcw } from "lucide-react";
import API_URL from "../src/service/api";

const API_URL = `${API_URL}/api/properties`;

export default function SoldProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token =
    localStorage.getItem("estatehubToken") ||
    sessionStorage.getItem("estatehubToken");

  const fetchSoldProperties = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load sold properties.");
      }

      const allProperties = Array.isArray(data)
        ? data
        : data.properties || data.data || [];

      setProperties(
        allProperties.filter((property) => property.status === "Sold")
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldProperties();
  }, []);

  const restoreProperty = async (id) => {
    try {
      setUpdatingId(id);

      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Available" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to restore property.");
      }

      setProperties((previous) =>
        previous.filter((property) => property._id !== id)
      );

      toast.success("Property restored successfully.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

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
            Sold Properties
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage properties that have been sold.
          </p>
        </div>

        <button
          onClick={fetchSoldProperties}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <p className="text-sm text-gray-500">Total Sold Properties</p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          {properties.length}
        </h2>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <BadgeCheck className="mx-auto mb-3 text-gray-400" size={42} />
          <h2 className="text-lg font-semibold text-gray-800">
            No sold properties yet
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Properties marked as sold will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {properties.map((property) => (
            <div
              key={property._id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <img
                src={
                  property.images?.[0] ||
                  "https://placehold.co/600x400?text=Property"
                }
                alt={property.title}
                className="h-52 w-full object-cover"
              />

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-bold text-gray-900">
                    {property.title}
                  </h2>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Sold
                  </span>
                </div>

                <p className="text-xl font-bold text-emerald-700">
                  ₹{Number(property.price || 0).toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {property.location}
                </div>

                <button
                  onClick={() => restoreProperty(property._id)}
                  disabled={updatingId === property._id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <RotateCcw size={16} />
                  {updatingId === property._id
                    ? "Restoring..."
                    : "Restore to Available"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
