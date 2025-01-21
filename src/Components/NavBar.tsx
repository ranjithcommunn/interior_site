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
  menuSubList?: MenuSubItem[]; // Optional submenu list
}

const NavBar = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const dropdownMobRef = useRef<HTMLDivElement | null>(null);

  const menuList: MenuItem[] = [
    {
      name: "Home",
      link:"/",
    },
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
        { name: "Outdoor Sofas", link: "/" },
        { name: "Sun Loungers", link: "/" },
      ],
    },
    // Add other menu items here...
  ];

  const toggleDropdown = (index: number): void => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

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

  const handleLinkClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black flex items-center h-[72px] md:h-[115px] px-5 md:px-20 gap-10 justify-between">
      <div className="flex items-center gap-10 box-border">
        <Link to={"/"} className="flex items-center justify-center">
          <img src={Logo} className="md:mt-4 mt-2 h-20 md:h-full md:w-full" alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <ul className="bg-black hidden md:flex gap-9" ref={dropdownRef}>
          {menuList.map((item, index) => (
            <li key={index} className="group relative">
              {item.menuSubList ? (
                <>
                  <button
                    className="flex items-center gap-2 text-white text-base font-Poppins font-bold"
                    onClick={() => toggleDropdown(index)}
                  >
                    {item.name}
                    {activeDropdown === index ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute left-0 bg-white w-40 min-w-fit mt-2 rounded-md shadow-lg z-10 font-Roboto">
                      <ul className="space-y-1 p-2">
                        {item.menuSubList.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.link}
                              className="block px-4 py-1 text-[14px] hover:bg-gray-200 rounded-md font-Roboto"
                              onClick={handleLinkClick}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.link}
                  className="text-white text-base font-Poppins font-bold"
                  onClick={handleLinkClick}
                >
                  {item.name}
                </Link>
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
                {item.menuSubList ? (
                  <>
                    <button
                      className="flex items-center gap-2 text-white text-sm w-full justify-between font-Poppins font-bold"
                      onClick={() => toggleDropdown(index)}
                    >
                      {item.name}
                      {activeDropdown === index ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {activeDropdown === index && (
                      <div className="bg-black text-white mt-2 rounded-md shadow-lg font-Roboto">
                        <ul className="space-y-2 p-2">
                          {item.menuSubList.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.link}
                                className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-md font-Roboto font-normal"
                                onClick={handleLinkClick}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.link}
                    className="block text-white text-sm font-Poppins font-bold"
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </Link>
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
