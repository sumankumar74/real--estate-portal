
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("estatehubToken") ||
      sessionStorage.getItem("estatehubToken");

    fetch("http://localhost:5000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load users.");
        }
        return data;
      })
      .then((data) => setUsers(data.users || []))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-emerald-950">Manage Users</h2>
        <p className="mt-2 text-stone-500">
          View registered users in EstateHub.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Registered Users</p>
          <p className="mt-2 text-3xl font-bold text-emerald-950">
            {loading ? "..." : users.length}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Administrators</p>
          <p className="mt-2 text-3xl font-bold text-emerald-950">
            {loading ? "..." : users.filter((user) => user.role === "admin").length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
        <table className="w-full min-w-[600px] text-left">
          <thead className="bg-stone-50 text-sm text-stone-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              users.map((user) => (
                <tr key={user._id} className="border-t border-stone-100">
                  <td className="p-4 font-medium text-stone-800">{user.name}</td>
                  <td className="p-4 text-stone-600">{user.email}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-stone-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                </tr>
              ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-stone-500">
                  No users found.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-stone-500">
                  Loading users...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
