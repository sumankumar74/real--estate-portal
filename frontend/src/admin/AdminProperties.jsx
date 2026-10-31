
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  RefreshCw,
  Trash2,
  Building2,
  MapPin,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/properties";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const token =
    localStorage.getItem("estatehubToken") ||
    sessionStorage.getItem("estatehubToken");

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch properties.");
      }

      setProperties(
        Array.isArray(data)
          ? data
          : data.properties || data.data || []
      );
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed.");
      }

      setProperties((previous) =>
        previous.map((property) =>
          property._id === id
            ? { ...property, status }
            : property
        )
      );

      toast.success(`Property marked as ${status}.`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteProperty = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete property.");
      }

      setProperties((previous) =>
        previous.filter((property) => property._id !== id)
      );

      toast.success("Property deleted successfully.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const statusStyle = {
    Available: "bg-emerald-100 text-emerald-700",
    Sold: "bg-amber-100 text-amber-700",
    Rented: "bg-blue-100 text-blue-700",
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
            Manage Properties
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage listings and update their availability.
          </p>
        </div>

        <button
          onClick={fetchProperties}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {["Available", "Sold", "Rented"].map((status) => (
          <div key={status} className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">{status} Properties</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {
                properties.filter(
                  (property) =>
                    (property.status || "Available") === status
                ).length
              }
            </h2>
          </div>
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <Building2 className="mx-auto mb-3 text-gray-400" size={40} />
          <h2 className="text-lg font-semibold text-gray-800">
            No properties found
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a property to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const status = property.status || "Available";

            return (
              <div
                key={property._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={
                      property.images?.[0] ||
                      "https://placehold.co/600x400?text=Property"
                    }
                    alt={property.title}
                    className="h-52 w-full object-cover md:h-auto md:w-64"
                  />

                  <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h2 className="text-lg font-bold text-gray-900">
                          {property.title}
                        </h2>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusStyle[status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <p className="mt-2 text-xl font-bold text-emerald-700">
                        {formatPrice(property.price)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={15} />
                          {property.location}
                        </span>

                        <span>{property.propertyType}</span>
                        <span>{property.listingType}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {["Available", "Sold", "Rented"]
                        .filter((item) => item !== status)
                        .map((item) => (
                          <button
                            key={item}
                            onClick={() =>
                              updateStatus(property._id, item)
                            }
                            disabled={
                              updatingId === property._id ||
                              deletingId === property._id
                            }
                            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-100 hover:text-emerald-700 disabled:opacity-50"
                          >
                            {updatingId === property._id
                              ? "Updating..."
                              : `Mark as ${item}`}
                          </button>
                        ))}

                      <button
                        onClick={() => deleteProperty(property._id)}
                        disabled={
                          deletingId === property._id ||
                          updatingId === property._id
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        {deletingId === property._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
