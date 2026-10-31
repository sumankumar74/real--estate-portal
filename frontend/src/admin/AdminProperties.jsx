
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("estatehubToken") ||
      sessionStorage.getItem("estatehubToken");

    fetch("http://localhost:5000/api/properties", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load properties");
        return response.json();
      })
      .then((data) => setProperties(data.properties || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  const deleteProperty = async (id) => {
    toast.info("Property deletion will be enabled after we add the backend delete route.");
  };

  if (loading) return <p className="text-stone-600">Loading properties...</p>;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-emerald-950">Manage Properties</h2>
        <p className="mt-2 text-stone-500">View and manage your property listings.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[700px] text-left">
          <thead className="bg-stone-50 text-sm text-stone-500">
            <tr>
              <th className="p-4">Property</th>
              <th className="p-4">Location</th>
              <th className="p-4">Price</th>
              <th className="p-4">Listing</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id} className="border-t border-stone-100">
                <td className="p-4 font-semibold text-stone-800">{property.title}</td>
                <td className="p-4 text-stone-600">{property.location}</td>
                <td className="p-4 text-stone-700">
                  ₹{Number(property.price).toLocaleString("en-IN")}
                </td>
                <td className="p-4">{property.listingType}</td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => deleteProperty(property._id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-stone-500">
                  No properties found. Add your first property.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
