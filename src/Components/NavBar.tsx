import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.png";
import SearchIcon from "../assets/search_icon.svg";
import UserIcon from "../assets/user_icon.svg";
import { Link } from "react-router-dom";

interface MenuSubItem {
  name: string;
  link: string;
}

interface MenuItem {
  name: string;
  link: string;
  menuSubList: MenuSubItem[];
}

const NavBar = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const dropdownMobRef = useRef<HTMLDivElement | null>(null)

  const menuList: MenuItem[] = [
    {
      name: "Living",
      link: "/",
      menuSubList: [
        { name: "Sofas", link: "/" },
        { name: "Sofa Cum Bed", link: "/" },
        { name: "Recliners", link: "/" },
        { name: "Chairs", link: "/" },
        { name: "Tables", link: "/" },
        { name: "Bean Bags", link: "/" },
        { name: "Pouffes", link: "/" },
      ],
    },
    {
      name: "Storage",
      link: "/",
      menuSubList: [
        { name: "TV Units", link: "/" },
        { name: "Box Shelves", link: "/" },
        { name: "Shoe Rack", link: "/" },
        { name: "Dressing Table", link: "/" },
        { name: "Wardrobes", link: "/" },
      ],
    },
    {
      name: "Dining",
      link: "/",
      menuSubList: [
        { name: "Dining Tables", link: "/" },
        { name: "Dining Chairs", link: "/" },
        { name: "Crockery Units", link: "/" },
      ],
    },
    {
      name: "Bedroom",
      link: "/",
      menuSubList: [
        { name: "Bed Cots", link: "/" },
        { name: "Head Boards", link: "/" },
        { name: "Bed Room Tables", link: "/" },
        { name: "Bunker Beds", link: "/" },
      ],
    },
    {
      name: "Matress",
      link: "/",
      menuSubList: [
        { name: "King Size", link: "/" },
        { name: "Queen Size", link: "/" },
        { name: "Single Bed", link: "/" },
        { name: "Double Bed", link: "/" },
      ],
    },
    {
      name: "Study",
      link: "/",
      menuSubList: [
        { name: "Study Tables", link: "/" },
        { name: "Chairs", link: "/" },
      ],
    },
    {
      name: "Office",
      link: "/",
      menuSubList: [
        { name: "Cabin Tables", link: "/" },
        { name: "Work Station Tables", link: "/" },
        { name: "Office Boss Chairs", link: "/" },
        { name: "Office Visitors chair", link: "/" },
        { name: "Office Waiting chairs", link: "/" },
      ],
    },
    {
      name: "Outdoor",
      link: "/",
      menuSubList: [
        { name: "Outdoor dining", link: "/" },
        { name: "Outdoor Seating & Chairs", link: "/" },
        { name: "Outdoor SOdas", link: "/" },
        { name: "Sun Loungers", link: "/" },
      ],
    },
    // Add other menu items here...
  ];

  // Toggle dropdown visibility
  const toggleDropdown = (index: number): void => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        (dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)) ||
        (dropdownMobRef.current &&
          !dropdownMobRef.current.contains(event.target as Node))
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close mobile menu when a link is clicked
  const handleLinkClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black flex items-center h-16 md:h-20 px-5 md:px-20 gap-10 justify-between">
      <div className="flex items-center gap-10">
        <Link to={"/"} className="flex items-center justify-center">
          <img src={Logo} width={95} height={95} className="mt-2" alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <ul
          className="bg-black hidden md:flex gap-10"
          ref={dropdownRef}
        >
          {menuList.map((item, index) => (
            <li key={index} className="group relative">
              <button
                className="flex items-center gap-2 text-white text-sm"
                onClick={() => toggleDropdown(index)}
              >
                {item.name}
                {activeDropdown === index ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {/* Dropdown menu */}
              {activeDropdown === index && (
                <div className="absolute left-0 bg-white w-48 mt-2 rounded-md shadow-lg z-10">
                  <ul className="space-y-2 p-2">
                    {item.menuSubList.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          to={subItem.link}
                          className="block px-4 py-2 text-sm hover:bg-gray-200 rounded-md"
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

      <div className="flex items-center gap-5 md:gap-10">
        <Link to={"/search"} className="flex items-center">
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
        <div
          className="absolute top-16 left-0 right-0 bg-black text-white md:hidden z-10"
          ref={dropdownMobRef}
        >
          <ul className="space-y-4 p-5">
            {menuList.map((item, index) => (
              <li key={index} className="group relative">
                <button
                  className="flex items-center gap-2 text-white text-sm w-full justify-between"
                  onClick={() => toggleDropdown(index)}
                >
                  {item.name}
                  {activeDropdown === index ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                {/* Mobile Dropdown menu */}
                {activeDropdown === index && (
                  <div className="bg-black text-white mt-2 rounded-md shadow-lg">
                    <ul className="space-y-2 p-2">
                      {item.menuSubList.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.link}
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
