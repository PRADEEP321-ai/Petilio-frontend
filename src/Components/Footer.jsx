
import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-[#38251f] px-5 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <PawPrint className="text-[#f5c65d]" size={28} />

            <h2 className="text-2xl font-bold">
              Petilio<span className="text-[#f5c65d]">.</span>
            </h2>
          </div>

          <p className="leading-7 text-gray-300">
            Making pet parenting easier with quality products,
            love and care.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Quick Links</h3>

          <div className="flex flex-col gap-3 text-gray-300">
            <Link to="/" className="hover:text-[#f5c65d]">Home</Link>
            <Link to="/shop" className="hover:text-[#f5c65d]">Shop</Link>
            <Link to="/about" className="hover:text-[#f5c65d]">About Us</Link>
            <Link to="/contact" className="hover:text-[#f5c65d]">Contact</Link>
          </div>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Customer Care</h3>

          <div className="flex flex-col gap-3 text-gray-300">
            <a href="/contact" className="hover:text-[#f5c65d]">Help Center</a>
            <a href="/contact" className="hover:text-[#f5c65d]">Shipping Policy</a>
            <a href="/contact" className="hover:text-[#f5c65d]">Returns</a>
            <a href="/contact" className="hover:text-[#f5c65d]">Privacy Policy</a>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-5 text-lg font-bold">Follow Us</h3>

          <div className="flex flex-col gap-3 text-gray-300">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#f5c65d]">
              Facebook
            </a>

            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#f5c65d]">
              Twitter
            </a>

            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#f5c65d]">
              Instagram
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/20 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Petilio. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
