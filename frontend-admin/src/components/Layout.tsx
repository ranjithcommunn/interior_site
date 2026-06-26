import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/banners", label: "Banners" },
  { to: "/interior-slides", label: "Interior Slides" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
  { to: "/enquiries", label: "Enquiries" },
];

export const Layout: React.FC = () => {
  const { admin, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-56 bg-black text-white flex flex-col">
        <div className="p-5 font-bold text-lg border-b border-gray-800">Vibrer Admin</div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-white text-black font-semibold" : "hover:bg-gray-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800 text-sm">
          <p className="truncate mb-2">{admin?.email}</p>
          <button onClick={logout} className="text-red-400 hover:text-red-300">
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
