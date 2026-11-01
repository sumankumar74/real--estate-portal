
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Building2,
  User,
  RefreshCw,
} from "lucide-react";

const API = "https://estatehub-backend-mmms.onrender.com/api/enquiries";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const token = localStorage.getItem("estatehubToken");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load enquiries.");
      }

      setEnquiries(data.enquiries || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API}/admin/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update status.");
      }

      setEnquiries((previous) =>
        previous.map((item) =>
          item._id === id ? data.enquiry : item
        )
      );

      toast.success("Enquiry status updated.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const matchesFilter =
        filter === "All" || item.status === filter;

      const searchText = search.toLowerCase();

      const matchesSearch = [
        item.name,
        item.email,
        item.phone,
        item.property?.title,
        item.property?.location,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchText)
        );

      return matchesFilter && matchesSearch;
    });
  }, [enquiries, filter, search]);

  const counts = {
    total: enquiries.length,
    new: enquiries.filter((item) => item.status === "New").length,
    contacted: enquiries.filter((item) => item.status === "Contacted").length,
    closed: enquiries.filter((item) => item.status === "Closed").length,
  };

  const statusStyle = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-amber-100 text-amber-700",
    Closed: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customer Enquiries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage property enquiries and customer follow-ups.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Enquiries", value: counts.total, color: "text-gray-900" },
          { label: "New", value: counts.new, color: "text-blue-600" },
          { label: "Contacted", value: counts.contacted, color: "text-amber-600" },
          { label: "Closed", value: counts.closed, color: "text-green-600" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search customer or property..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
        >
          <option value="All">All Enquiries</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-gray-500">
          Loading enquiries...
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
          <MessageSquare className="mx-auto mb-3 text-gray-300" size={40} />
          <h3 className="font-semibold text-gray-800">
            No enquiries found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Customer enquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnquiries.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyle[item.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={13} />
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <select
                  value={item.status}
                  onChange={(e) =>
                    updateStatus(item._id, e.target.value)
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={17} className="text-emerald-600" />
                    {item.email}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={17} className="text-emerald-600" />
                    {item.phone}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-gray-600">
                    <Building2 size={17} className="text-emerald-600" />
                    {item.property?.title || "Property unavailable"}
                  </p>

                  <p className="flex items-center gap-3 text-sm text-gray-600">
                    <User size={17} className="text-emerald-600" />
                    Owner: {item.owner?.name || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <MessageSquare size={16} />
                    Customer Message
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {item.message}
                  </p>
                </div>
              </div>

              {item.property?.location && (
                <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                  Property location: {item.property.location}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
