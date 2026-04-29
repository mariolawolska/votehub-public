import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import MobileNav from "./MobileNav.jsx";

export default function Navbar({ products }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 
  bg-black md:bg-black/40 md:backdrop-blur-xl
  border-b border-white/10 
  shadow-[0_0_40px_rgba(0,0,0,0.6)]
  text-white"
    >
      <div
        className="max-w-6xl mx-auto px-6 py-4 
    flex justify-between items-center"
      >
        {/* Logo */}
        <Link
          to="/"
          className="
    text-5xl font-light tracking-[0.25em]
    text-[var(--primary)]
    drop-shadow-[0_0_18px_var(--primary)]
    hover:drop-shadow-[0_0_28px_var(--primary)]
    transition-all duration-300
  "
        >
          VoteHub
        </Link>

        {/* Desktop Menu */}
        <div
          className="hidden md:flex items-center gap-10 
      text-sm uppercase tracking-widest"
        >
          <Link
            to="/"
            className="hover:text-[var(--primary)] transition-all duration-300"
          >
            Home
          </Link>

          <Link
            to="/categories"
            className="hover:text-[var(--primary)] transition-all duration-300"
          >
            Movie Category
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="
              px-5 py-2 rounded-md
              bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/40
              transition-all duration-300
              backdrop-blur-sm
            "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
              px-5 py-2 rounded-md
              bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/40
              transition-all duration-300
              backdrop-blur-sm
            "
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="opacity-80 tracking-wide">Hi, {user.name}</span>

              <button
                onClick={logout}
                className="
              px-5 py-2 rounded-md
              bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/40
              transition-all duration-300
              backdrop-blur-sm
            "
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(true)}>
          ☰
        </button>
      </div>

      <MobileNav open={open} setOpen={setOpen} products={products} />
    </nav>
  );
}
