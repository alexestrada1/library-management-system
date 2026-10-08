import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Highlights the link for the page you're on
function linkClass({ isActive }: { isActive: boolean }) {
  return isActive ? "font-semibold underline" : "hover:underline";
}

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // is the mobile menu open?
  const navigate = useNavigate();

  // No navbar on the login/register pages
  if (!user) return null;

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className="bg-indigo-700 text-white">
      <div className="mx-auto max-w-5xl px-4 py-3 md:flex md:items-center md:justify-between">
        {/* Top row: logo + hamburger button (button only shows on small screens) */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">Library</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="rounded px-2 py-1 text-2xl md:hidden"
          >
            ☰
          </button>
        </div>

        {/* Links: hidden on mobile until the menu is open, always visible on md+ */}
        <div
          className={
            (menuOpen ? "flex" : "hidden") +
            " mt-3 flex-col gap-2 md:mt-0 md:flex md:flex-row md:items-center md:gap-5"
          }
        >
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>
            Books
          </NavLink>
          <NavLink to="/my-books" className={linkClass} onClick={closeMenu}>
            My Books
          </NavLink>

          {/* Admin-only links */}
          {user.role === "admin" && (
            <>
              <NavLink
                to="/admin/books/new"
                className={linkClass}
                onClick={closeMenu}
              >
                Add Book
              </NavLink>
              <NavLink
                to="/admin/borrows"
                className={linkClass}
                onClick={closeMenu}
              >
                All Borrows
              </NavLink>
            </>
          )}

          <span className="text-sm text-indigo-200">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="rounded bg-indigo-900 px-3 py-1 text-left text-sm hover:bg-indigo-800"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
