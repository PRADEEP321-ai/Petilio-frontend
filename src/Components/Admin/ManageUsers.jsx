import React, { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";

const BASE_URL = "http://localhost:8080";

// read the logged-in admin straight from localStorage
const getLoggedInUser = () => {
  try {
    return JSON.parse(localStorage.getItem("petilio_user"));
  } catch {
    return null;
  }
};

// turn a failed response into a readable message
const readError = async (res) => {
  if (res.status === 401) return "Your session has expired. Log in again.";
  if (res.status === 403) return "Only an admin can do this.";
  try {
    const data = await res.json();
    return data.message || Object.values(data).join(", ");
  } catch {
    return `Request failed (${res.status})`;
  }
};

function ManageUsers() {
  const admin = getLoggedInUser();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const [target, setTarget] = useState(null); // user waiting for delete confirmation
  const [deleting, setDeleting] = useState(false);

  // load all users when the page opens
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/getAllUsers`, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });

        if (!res.ok) throw new Error(await readError(res));

        setUsers(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // search by name or email
  const q = query.trim().toLowerCase();
  const visibleUsers = users.filter(
    (u) =>
      !q ||
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
  );

  // an admin account (or yourself) can not be deleted from here
  const canDelete = (u) => u.role !== "ADMIN" && u.id !== admin?.id;

  const confirmDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/api/users/Id/${target.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${admin?.token}` },
      });

      if (!res.ok) throw new Error(await readError(res));

      // remove the user from the table without reloading
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setTarget(null);
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-['Lora',serif] text-4xl font-medium">Manage users</h1>
      <p className="mt-2 text-[#4a2a35]/70">
        You can view and delete customer accounts. Admin accounts are protected.
      </p>

      {error && (
        <p role="alert" className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Search */}
      <div className="relative mt-8 max-w-md">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4a2a35]/50"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          aria-label="Search users"
          className="w-full rounded-full border border-[#4a2a35]/20 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#b47c43]"
        />
      </div>

      {/* Users table */}
      <section className="mt-6 overflow-x-auto rounded-3xl bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#4a2a35]/10 text-[#4a2a35]/70">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#4a2a35]/10">
            {visibleUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-medium">{u.fullName}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      u.role === "ADMIN" ? "bg-[#ffe44d]" : "bg-[#faeee9]"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-IN")
                    : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  {canDelete(u) && (
                    <button
                      onClick={() => setTarget(u)}
                      aria-label={`Delete ${u.fullName}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-red-700 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <p className="px-6 py-8 text-center text-sm">Loading users...</p>
        )}
        {!loading && visibleUsers.length === 0 && (
          <p className="px-6 py-8 text-center text-sm text-[#4a2a35]/70">
            {q ? "No users match your search." : "No users have signed up yet."}
          </p>
        )}
      </section>

      {/* Delete confirmation */}
      {target && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl"
          >
            <h2 className="font-['Lora',serif] text-2xl">Delete this user?</h2>
            <p className="mt-2 text-sm text-[#4a2a35]/70">
              {target.fullName} ({target.email}) will lose access to their
              account. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setTarget(null)}
                className="rounded-full border border-[#4a2a35] px-6 py-2.5 text-sm font-medium transition hover:bg-[#4a2a35]/10"
              >
                Keep user
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-full bg-red-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-800 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;