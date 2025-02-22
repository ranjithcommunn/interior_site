import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.png";
import SearchIcon from "../assets/search_icon.svg";
import UserIcon from "../assets/user_icon.svg";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  handle: string;
  category_children?: Category[];
}

const fetchProducts = async () => {
  const response = await fetch("http://localhost:9000/store/product-categories", {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY, // ✅ Use environment variable
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

const NavBar = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const dropdownMobRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading } = useQuery<{ product_categories: Category[] }>(["products"], fetchProducts);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) &&
        (dropdownMobRef.current && !dropdownMobRef.current.contains(event.target as Node))
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

  const menuList = data?.product_categories.filter((category) => category.category_children?.length);

  return (
    <nav className="bg-black flex items-center h-[72px] md:h-[115px] px-5 md:px-20 gap-10 justify-between">
      <div className="flex items-center gap-10 box-border">
        <Link to="/" className="flex items-center justify-center">
          <img src={Logo} className="md:mt-4 mt-2 h-20 md:h-full md:w-full" alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        {
          !isLoading ? (<ul className="bg-black hidden md:flex gap-9" ref={dropdownRef}>
            {menuList?.map((item) => (
              <li key={item.id} className="group relative">
                <button className="flex items-center gap-2 text-white text-base font-bold" onClick={() => toggleDropdown(item.id)}>
                  {item.name}
                  {activeDropdown === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
  
                {activeDropdown === item.id && (
                  <div className="absolute left-0 bg-white w-40 min-w-fit mt-2 rounded-md shadow-lg z-10">
                    <ul className="space-y-1 p-2">
                      {item.category_children?.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            to={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                            className="block px-4 py-1 text-sm hover:bg-gray-200 rounded-md"
                            onClick={handleLinkClick}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>) : (
            <p>
              loading..
            </p>
          )
        }
      </div>

      <div className="flex items-center gap-5 md:gap-10">
        <Link to="/search" className="flex items-center">
          <button>
            <img src={SearchIcon} width={18} height={18} alt="Search Icon" />
          </button>
        </Link>
        <button>
          <img src={UserIcon} width={16} height={16} alt="User Icon" />
        </button>

        {/* Mobile Menu Icon */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu color="#ffffff" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black text-white md:hidden z-10" ref={dropdownMobRef}>
          <ul className="space-y-4 p-5">
            {menuList?.map((item) => (
              <li key={item.id} className="group relative">
                <button
                  className="flex items-center gap-2 text-white text-sm w-full justify-between font-bold"
                  onClick={() => toggleDropdown(item.id)}
                >
                  {item.name}
                  {activeDropdown === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {activeDropdown === item.id && (
                  <div className="bg-black text-white mt-2 rounded-md shadow-lg">
                    <ul className="space-y-2 p-2">
                      {item.category_children?.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            to={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                            className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
                            onClick={handleLinkClick}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
