
import React, { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Pencil,
  Save,
  X,
} from "lucide-react";

const BASE_URL = "http://localhost:8080";

function AdminProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    location: "",
  });

  useEffect(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("petilio_user")
      );

      if (savedUser) {
        setUser(savedUser);

        setFormData({
          fullName: savedUser.fullName || savedUser.name || "",
          email: savedUser.email || "",
          phoneNo: savedUser.phoneNo || "",
          location: savedUser.location || "",
        });
      }
    } catch {
      setError("Could not load admin profile.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!user?.id || !user?.token) {
      setError("Admin information or login token is missing.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const updatedUser = await response.json();

      const newUser = {
        ...user,
        ...updatedUser,
        token: user.token,
      };

      localStorage.setItem(
        "petilio_user",
        JSON.stringify(newUser)
      );

      setUser(newUser);
      setFormData({
        fullName: newUser.fullName || "",
        email: newUser.email || "",
        phoneNo: newUser.phoneNo || "",
        location: newUser.location || "",
      });

      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center">
        Loading admin profile...
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-[#4a2a35]/15 bg-[#fffaf4] px-4 py-3 text-sm outline-none transition focus:border-[#b47c43] focus:ring-2 focus:ring-[#b47c43]/20";

  return (
    <div>
      {/* Page Heading */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-['Lora',serif] text-4xl font-medium">
            My Profile
          </h1>
          <p className="mt-2 text-[#4a2a35]/70">
            Manage your personal information and account details.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => {
              setEditing(true);
              setMessage("");
              setError("");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#4a2a35] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#b47c43]"
          >
            <Pencil size={17} />
            Edit profile
          </button>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-5 rounded-2xl bg-green-100 px-5 py-4 text-sm text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div role="alert" className="mb-5 rounded-2xl bg-red-100 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Profile Banner */}
      <section className="overflow-hidden rounded-3xl bg-[#4a2a35] text-white">
        <div className="bg-gradient-to-r from-[#4a2a35] via-[#704451] to-[#b47c43] p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-[#ffe44d] text-[#4a2a35]">
              <UserRound size={45} />
            </div>

            <div>
              <p className="text-sm text-white/70">
                Administrator account
              </p>
              <h2 className="mt-1 font-['Lora',serif] text-3xl font-medium">
                {formData.fullName || "Admin"}
              </h2>
              <p className="mt-1 text-sm text-white/80">
                {formData.email}
              </p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium">
                <ShieldCheck size={15} />
                ADMIN
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details */}
      <section className="mt-7 rounded-3xl bg-white p-6 sm:p-8">
        <div className="mb-7">
          <h2 className="font-['Lora',serif] text-2xl">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-[#4a2a35]/60">
            Your account information and contact details.
          </p>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="grid gap-6 sm:grid-cols-2">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-3.5 text-[#4a2a35]/40"
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!editing}
                  required
                  className={`${inputClass} pl-11`}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-3.5 text-[#4a2a35]/40"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={`${inputClass} cursor-not-allowed pl-11 opacity-70`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-3.5 text-[#4a2a35]/40"
                />
                <input
                  type="tel"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-3.5 text-[#4a2a35]/40"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your location"
                />
              </div>
            </div>
          </div>

          {/* Account Role */}
          <div className="mt-6 rounded-2xl bg-[#faeee9] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#b47c43]" size={22} />
              <div>
                <p className="text-sm font-medium">Account Role</p>
                <p className="mt-1 text-sm text-[#4a2a35]/65">
                  Administrator – Full access to manage Petilio.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          {editing && (
            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    fullName: user.fullName || user.name || "",
                    email: user.email || "",
                    phoneNo: user.phoneNo || "",
                    location: user.location || "",
                  });
                  setEditing(false);
                  setError("");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#4a2a35]/20 px-6 py-3 text-sm font-medium transition hover:bg-[#faeee9]"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-[#4a2a35] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#b47c43] disabled:opacity-60"
              >
                <Save size={17} />
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default AdminProfile;
