import { Menu, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/logo.png";
import UserIcon from "../assets/user_icon.svg";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  handle: string | null;
  parent_category_id: string | null; // Corrected type to allow null
  category_children: Category[];
}

const fetchProducts = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/store/product-categories`, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";

const NavBar = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const dropdownMobRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading } = useQuery<{ product_categories: Category[] }>(
    ["products"],
    fetchProducts
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownMobRef.current &&
        !dropdownMobRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleDropdown = (index: number): void => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const handleLinkClick = (): void => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const menuList = data?.product_categories.filter(
    (cat) =>
      cat.category_children?.length > 0 || cat.parent_category_id === null
  );

  return (
    <nav className="bg-black grid grid-cols-[auto_1fr_auto] items-center h-20 md:h-28 px-5 md:px-12 lg:px-20 gap-6 min-w-full font-Poppins sticky top-0 z-50">
      {/* Column 1: Logo */}
      <Link to="/" className="flex items-center justify-center shrink-0 self-center">
        <img
          src={Logo}
          className="h-16 md:h-24 w-auto object-contain"
          alt="Logo"
        />
      </Link>

      {/* Column 2: Desktop Menu (centered) */}
      <div className="hidden md:flex items-center justify-center">
        {!isLoading ? (
          <ul className="bg-black flex items-center gap-5 lg:gap-7 whitespace-nowrap" ref={dropdownRef}>
            {menuList?.map((item) => (
              <li key={item.id} className="group relative">
                {item.category_children?.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/${item.handle}/${item.id}`}
                      className="py-2 text-white text-button2 leading-button2 font-medium tracking-wide hover:text-gray-300 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <button
                      aria-label={`Toggle ${item.name} submenu`}
                      className="py-2 px-1 text-white hover:text-gray-300 transition-colors"
                      onClick={() => toggleDropdown(item.id)}
                    >
                      <motion.span
                        className="flex"
                        animate={{ rotate: activeDropdown === item.id ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to={`/${item.handle}/${item.id}`}
                    className="flex items-center gap-1.5 py-2 text-white text-button2 leading-button2 font-medium tracking-wide hover:text-gray-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}

                <AnimatePresence>
                  {activeDropdown === item.id && item.category_children?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 bg-white min-w-[200px] mt-3 rounded-xl shadow-2xl ring-1 ring-black/5 z-10 overflow-hidden origin-top"
                    >
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white rotate-45" />
                      <ul className="relative py-2 bg-white">
                        {item.category_children?.map((subItem, subIndex) => (
                          <motion.li
                            key={subItem.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, delay: subIndex * 0.03 }}
                          >
                            <Link
                              to={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                              className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black hover:pl-6 transition-all"
                              onClick={handleLinkClick}
                            >
                              {subItem.name}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
            <li>
              <Link
                to={"/contact-us"}
                className="flex items-center gap-1.5 py-2 text-white text-button2 leading-button2 font-medium tracking-wide hover:text-gray-300 transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        ) : (
          <p className="text-white text-sm">Loading...</p>
        )}
      </div>

      {/* Column 3: Admin login icon + mobile menu */}
      <div className="flex items-center justify-end gap-3 md:gap-5">
        <a
          href={ADMIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Admin Login"
          title="Admin Login"
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <img src={UserIcon} width={18} height={18} alt="Admin Login" />
        </a>

        {/* Mobile Menu Icon */}
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu color="#ffffff" size={22} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-20 left-0 right-0 bg-black text-white md:hidden z-10 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto"
            ref={dropdownMobRef}
          >
          <ul className="divide-y divide-white/10 px-5">
            {menuList?.map((item) => (
              <li key={item.id} className="group relative py-1">
                {item.category_children?.length > 0 ? (
                  <div className="flex items-center justify-between w-full py-3">
                    <Link
                      to={`/${item.handle}/${item.id}`}
                      className="text-white text-base font-medium"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                    <button
                      aria-label={`Toggle ${item.name} submenu`}
                      className="p-1 text-white"
                      onClick={() => toggleDropdown(item.id)}
                    >
                      <motion.span
                        className="flex"
                        animate={{ rotate: activeDropdown === item.id ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to={`/${item.handle}/${item.id}`}
                    className="flex items-center gap-2 text-white text-base font-medium w-full justify-between py-3"
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </Link>
                )}

                <AnimatePresence>
                  {activeDropdown === item.id && item.category_children?.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="bg-white/5 rounded-lg mb-2 overflow-hidden"
                    >
                      <ul className="py-1">
                        {item.category_children?.map((subItem) => (
                          <li key={subItem.id}>
                            <Link
                              to={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                              className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                              onClick={handleLinkClick}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
            <li className="py-1">
              <Link
                to={"/contact-us"}
                className="flex items-center gap-2 text-white text-base font-medium w-full py-3"
                onClick={handleLinkClick}
              >
                Contact Us
              </Link>
            </li>
          </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
