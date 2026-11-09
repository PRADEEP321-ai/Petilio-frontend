
import React, { useState } from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  PawPrint,
  Menu,
  X,
  LogOut,
} from "lucide-react";

// Admin navigation links
const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Manage Products" },
  { to: "/admin/users", label: "Manage Users" },
  { to: "/admin/profile", label: "My Profile" },
];

function AdminLayout() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  // Get logged-in user from localStorage
  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("petilio_user")
    );
  } catch {
    user = null;
  }

  // Check admin authentication
  if (!user?.token || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  // Logout function
  const handleLogout = () => {

    localStorage.removeItem("petilio_user");

    // Notify other components about logout
    window.dispatchEvent(new Event("authUpdated"));

    // Close confirmation
    setConfirmLogout(false);

    // Redirect to login
    navigate("/login", { replace: true });
  };

  // Navigation link styling
  const linkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-[#ffe44d]
    ${
      isActive
        ? "bg-[#ffe44d] text-[#4a2a35]"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;

  return (

    <div className="min-h-screen bg-[#faeee9] font-['DM_Sans',sans-serif] text-[#4a2a35]">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-30 bg-[#4a2a35] text-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          {/* Logo */}
          <NavLink
            to="/admin"
            className="flex items-center gap-2 font-['Lora',serif] text-2xl"
          >
            <PawPrint
              size={22}
              className="text-[#ffe44d]"
            />

            Petilio Admin
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">

            {LINKS.map((link) => (

              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
              >
                {link.label}
              </NavLink>

            ))}

          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            <span className="hidden max-w-[160px] truncate text-sm text-white/70 xl:block">
              {user.email}
            </span>

            {/* Desktop Logout */}
            <button
              onClick={() => setConfirmLogout(true)}
              className="hidden items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-medium transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe44d] lg:flex"
            >
              <LogOut size={16} />
              Log out
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="rounded-lg p-1 lg:hidden"
            >
              {menuOpen ? (
                <X size={26} />
              ) : (
                <Menu size={26} />
              )}
            </button>

          </div>

        </div>

        {/* ================= MOBILE MENU ================= */}

        {menuOpen && (

          <nav className="flex flex-col gap-1 border-t border-white/15 px-5 pb-4 pt-3 lg:hidden">

            {LINKS.map((link) => (

              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>

            ))}

            <button
              onClick={() => {
                setMenuOpen(false);
                setConfirmLogout(true);
              }}
              className="mt-1 flex items-center gap-2 rounded-full px-4 py-2 text-left text-sm font-medium text-white/80 hover:bg-white/10"
            >
              <LogOut size={16} />
              Log out
            </button>

          </nav>

        )}

      </header>

      {/* ================= PAGE CONTENT ================= */}

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">

        <Outlet />

      </main>

      {/* ================= LOGOUT CONFIRMATION ================= */}

      {confirmLogout && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl"
          >

            <h2
              id="logout-title"
              className="font-['Lora',serif] text-2xl"
            >
              Log out?
            </h2>

            <p className="mt-2 text-sm text-[#4a2a35]/70">
              You will need to log in again to open the admin pages.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setConfirmLogout(false)}
                className="rounded-full border border-[#4a2a35] px-6 py-2.5 text-sm font-medium transition hover:bg-[#4a2a35]/10"
              >
                Stay logged in
              </button>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#4a2a35] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#b47c43]"
              >
                Log out
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default AdminLayout;
