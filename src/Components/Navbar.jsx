
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    ShoppingCart,
    PawPrint,
    UserRound,
    ChevronDown,
    Package,
    LogOut,
} from "lucide-react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const navLinks = [
        { name: "Home", link: "/" },
        { name: "Shop", link: "/shop" },
        { name: "About", link: "/about" },
        { name: "Blog", link: "/blog" },
        { name: "Contact", link: "/contact" },
    ];

    useEffect(() => {
        const updateUser = () => {
            try {
                const savedUser = JSON.parse(
                    localStorage.getItem("petilio_user") || "null"
                );

                setUser(savedUser);
            } catch {
                setUser(null);
            }
        };

        const updateCartCount = () => {
            // Do not show cart items when the user is logged out
            const savedUser = localStorage.getItem("petilio_user");

            if (!savedUser) {
                setCartCount(0);
                return;
            }

            try {
                const savedCart = JSON.parse(
                    localStorage.getItem("petilio_cart") || "[]"
                );

                const count = savedCart.reduce(
                    (total, item) => total + Number(item.quantity || 0),
                    0
                );

                setCartCount(count);
            } catch {
                setCartCount(0);
            }
        };

        updateUser();
        updateCartCount();

        window.addEventListener("authUpdated", updateUser);
        window.addEventListener("authUpdated", updateCartCount);
        window.addEventListener("cartUpdated", updateCartCount);

        return () => {
            window.removeEventListener("authUpdated", updateUser);
            window.removeEventListener("authUpdated", updateCartCount);
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    const closeMenu = () => {
        setMenuOpen(false);
        setProfileOpen(false);
    };

    const handleLogout = () => {
        // Remove user information
        localStorage.removeItem("petilio_user");
        localStorage.removeItem("petilio_token");

        // Clear all cart products
        localStorage.removeItem("petilio_cart");

        // Update Navbar immediately
        setUser(null);
        setCartCount(0);
        setProfileOpen(false);
        setMenuOpen(false);

        // Notify other components
        window.dispatchEvent(new Event("authUpdated"));
        window.dispatchEvent(new Event("cartUpdated"));

        // Go to Home page
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/15 bg-[#4a2a35] text-white">

            {/* Main Navbar */}
            <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center px-5 py-4 md:grid-cols-[1fr_auto_1fr]">

                {/* Logo */}
                <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
                    <PawPrint size={28} className="text-[#ffe44d]" />
                    <span className="font-['Lora',serif] text-2xl font-medium">
                        PETILIO
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-10 md:flex">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            to={item.link}
                            className="text-sm font-medium uppercase tracking-widest transition hover:text-[#ffe44d]"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden items-center justify-end gap-6 md:flex">

                    {/* Login and Signup - Logged Out */}
                    {!user && (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium uppercase tracking-widest transition hover:text-[#ffe44d]"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-full bg-[#ffe44d] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#4a2a35] transition hover:bg-white"
                            >
                                Sign up
                            </Link>
                        </>
                    )}

                    {/* Profile - Logged In */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 transition hover:text-[#ffe44d]"
                            >
                                <UserRound size={23} />
                                <span className="max-w-24 truncate text-sm">
                                    {user.name || "My Account"}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`transition ${profileOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-xl bg-white py-2 text-[#38251f] shadow-xl">

                                    <Link
                                        to="/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#faeee9]"
                                    >
                                        <UserRound size={17} />
                                        My Profile
                                    </Link>

                                    <Link
                                        to="/my-orders"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#faeee9]"
                                    >
                                        <Package size={17} />
                                        My Orders
                                    </Link>

                                    <div className="my-1 border-t border-gray-100" />

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={17} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cart */}
                    <Link
                        to="/cart"
                        aria-label="Shopping cart"
                        className="relative hover:text-[#ffe44d]"
                    >
                        <ShoppingCart size={24} strokeWidth={1.6} />

                        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffe44d] text-[10px] font-bold text-[#4a2a35]">
                            {cartCount}
                        </span>
                    </Link>
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center justify-end gap-5 md:hidden">

                    <Link to="/cart" className="relative" onClick={closeMenu}>
                        <ShoppingCart size={24} />

                        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffe44d] text-[10px] font-bold text-[#4a2a35]">
                            {cartCount}
                        </span>
                    </Link>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="border-t border-white/15 px-5 py-6 md:hidden">
                    <div className="flex flex-col gap-5">

                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                to={item.link}
                                onClick={closeMenu}
                                className="text-sm font-medium uppercase tracking-widest hover:text-[#ffe44d]"
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="mt-2 border-t border-white/15 pt-4">

                            {!user ? (
                                <div className="flex gap-3">
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        className="flex-1 rounded-full border border-white px-6 py-2.5 text-center text-xs font-bold uppercase tracking-widest"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        onClick={closeMenu}
                                        className="flex-1 rounded-full bg-[#ffe44d] px-6 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-[#4a2a35]"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <p className="mb-2 text-sm font-semibold text-[#ffe44d]">
                                        Hello, {user.name || "User"}
                                    </p>

                                    <Link
                                        to="/profile"
                                        onClick={closeMenu}
                                        className="flex items-center gap-3 py-3 text-sm hover:text-[#ffe44d]"
                                    >
                                        <UserRound size={19} />
                                        My Profile
                                    </Link>

                                    <Link
                                        to="/my-orders"
                                        onClick={closeMenu}
                                        className="flex items-center gap-3 py-3 text-sm hover:text-[#ffe44d]"
                                    >
                                        <Package size={19} />
                                        My Orders
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 py-3 text-sm text-[#ffe44d]"
                                    >
                                        <LogOut size={19} />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
