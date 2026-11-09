
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  Package,
  ShoppingBag,
  LogOut,
  PawPrint,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  // Load logged-in user information
  useEffect(() => {
    const savedUser = localStorage.getItem("petilio_user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(savedUser);

      setUser(userData);

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
      });
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Save updated profile information
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    const updatedUser = {
      ...user,
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
    };

    localStorage.setItem(
      "petilio_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditMode(false);

    window.dispatchEvent(new Event("authUpdated"));

    alert("Profile updated successfully!");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("petilio_user");
    localStorage.removeItem("petilio_token");
    localStorage.removeItem("petilio_cart");

    window.dispatchEvent(new Event("authUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffaf4] px-4 py-10 text-[#38251f] sm:px-8 lg:py-14">

      <div className="mx-auto max-w-6xl">

        {/* PAGE HEADING */}
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#b47c43]">
            My Account
          </p>

          <h1 className="font-['Playfair_Display',serif] text-4xl font-semibold sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-[#967b72]">
            Manage your personal information and account details.
          </p>
        </div>

        {/* PROFILE SECTION */}
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

          {/* LEFT PROFILE CARD */}
          <div className="h-fit rounded-3xl border border-[#efdfd3] bg-white p-7 text-center shadow-sm">

            <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#faeee9] bg-[#f7e8d9]">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={48} className="text-[#b47c43]" />
              )}
            </div>

            <h2 className="mt-5 font-['Playfair_Display',serif] text-2xl font-semibold">
              {user.name || "Petilio User"}
            </h2>

            <p className="mt-2 break-all text-sm text-[#967b72]">
              {user.email}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#faeee9] px-5 py-2 text-xs font-semibold text-[#9a6545]">
              <PawPrint size={15} />
              Petilio Member
            </div>

            <div className="mt-7 border-t border-[#f0e4dc] pt-6 text-left">

              <Link
                to="/my-orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-[#faeee9]"
              >
                <Package size={19} className="text-[#b47c43]" />
                My Orders
              </Link>

              <Link
                to="/cart"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-[#faeee9]"
              >
                <ShoppingBag size={19} className="text-[#b47c43]" />
                My Cart
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>

            </div>
          </div>

          {/* RIGHT PROFILE INFORMATION */}
          <div className="rounded-3xl border border-[#efdfd3] bg-white p-6 shadow-sm sm:p-9">

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#f0e4dc] pb-6">

              <div>
                <h2 className="font-['Playfair_Display',serif] text-2xl font-semibold">
                  Personal Information
                </h2>

                <p className="mt-2 text-sm text-[#967b72]">
                  Your personal details and contact information.
                </p>
              </div>

              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 rounded-full bg-[#4a2a35] px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#b47c43]"
                >
                  <Edit size={15} />
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      location: user.location || "",
                    });
                    setEditMode(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-[#eadbd2] px-5 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-[#faeee9]"
                >
                  <X size={15} />
                  Cancel
                </button>
              )}

            </div>

            <div className="grid gap-7 sm:grid-cols-2">

              {/* FULL NAME */}
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#967b72]">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-[#efdfd3] bg-[#fffaf4] py-4 pl-12 pr-4 text-sm outline-none transition focus:border-[#b47c43] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#967b72]">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-[#efdfd3] bg-[#f7eee8] py-4 pl-12 pr-4 text-sm text-[#967b72] outline-none"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#967b72]">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-[#efdfd3] bg-[#fffaf4] py-4 pl-12 pr-4 text-sm outline-none transition focus:border-[#b47c43] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-widest text-[#967b72]">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b47c43]"
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="Enter your city"
                    className="w-full rounded-xl border border-[#efdfd3] bg-[#fffaf4] py-4 pl-12 pr-4 text-sm outline-none transition focus:border-[#b47c43] disabled:cursor-not-allowed"
                  />
                </div>
              </div>

            </div>

            {/* SAVE BUTTON */}
            {editMode && (
              <div className="mt-9 border-t border-[#f0e4dc] pt-7">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex w-full items-center justify-center gap-3 rounded-full bg-[#4a2a35] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#b47c43] sm:w-auto"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM MESSAGE */}
        <div className="mt-8 rounded-2xl border border-[#efdfd3] bg-[#f7e8d9] p-6 text-center">
          <PawPrint size={25} className="mx-auto text-[#b47c43]" />

          <p className="mt-3 font-['Playfair_Display',serif] text-xl font-semibold">
            We are happy to have you at Petilio!
          </p>

          <p className="mt-2 text-sm text-[#967b72]">
            Your pets deserve the best care and love.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Profile;
