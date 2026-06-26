import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Image as ImageIcon,
  GalleryHorizontal,
  FolderTree,
  Package,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useAuth } from "../store/authStore";
import { ConfirmDialog } from "./ConfirmDialog";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/banners", label: "Banners", icon: ImageIcon },
  { to: "/interior-slides", label: "Interior Slides", icon: GalleryHorizontal },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/products", label: "Products", icon: Package },
  { to: "/enquiries", label: "Enquiries", icon: MessageSquare },
];

export const Layout: React.FC = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const currentLabel =
    navItems.find((item) =>
      item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)
    )?.label ?? "Dashboard";

  return (
    <div className="min-h-screen flex bg-[#F7F8FA]">
      <aside className="w-64 bg-[#0B0B0F] text-white flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
              V
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">Vibrer</p>
              <p className="text-[11px] text-white/40 leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-amber-400" />
                    )}
                    <Icon size={17} strokeWidth={2} />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold uppercase shrink-0">
              {admin?.email?.[0] ?? "A"}
            </div>
            <p className="text-xs text-white/60 truncate">{admin?.email}</p>
          </div>
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-2 text-xs text-white/50 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={logoutOpen}
        title="Log out?"
        description="You'll need to sign in again to access the admin panel."
        confirmLabel="Log out"
        onConfirm={() => {
          setLogoutOpen(false);
          logout();
        }}
        onCancel={() => setLogoutOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 shrink-0">
          <p className="text-xs text-gray-400">
            Admin <span className="mx-1.5">/</span>
            <span className="text-gray-600 font-medium">{currentLabel}</span>
          </p>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
