import React from "react";
import logo from "../assets/logo.png";
import InstagramIcon from "../assets/InstagramIcon.png";
import LinkedinIcon from "../assets/LinkedInIcon.png";
import FooterImage from "../assets/footer_image01.png";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // Import Link for navigation

interface Category {
  id: number;
  name: string;
  handle: string | null;
  parent_category_id: string | null; // Corrected type to allow null
  category_children: Category[];
}

const fetchProductCategories = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/store/product-categories`, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch product categories:", response.status);
    throw new Error("Failed to fetch product categories.");
  }
  return response.json();
};

const Footer: React.FC = () => {
  const { data: menuData, error: menuError } = useQuery<{
    product_categories: Category[];
  }>(["productCategories"], fetchProductCategories);

  if (menuError) {
    return <p>Error loading category menu.</p>;
  }

  console.log(menuData);
  const menuList = menuData?.product_categories.filter(
    (cat) =>
      cat.category_children?.length > 0 || cat.parent_category_id === null
  );

  console.log(menuList);

  console.log(menuList, "menulist");

  return (
    <footer className="bg-black text-white p-5 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-80 mt-10">
        {/* Left Section */}
        <div>
          <img src={logo} alt="Company Logo" width={95} height={95} />
          <p className="text-sm mt-4 font-DMSans md:text-text1">
            Your dream space deserves the best execution, and that’s where
            United Buildpro Pvt Ltd excels. Our construction services encompass
            everything from foundational work to structural builds, tailored to
            residential, commercial, and industrial needs. We pride ourselves on
            using high-quality materials and advanced techniques to ensure
            durability and efficiency in every project we undertake.
          </p>
          <div className="flex items-center mt-4 gap-5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={InstagramIcon} alt="Instagram Icon" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={LinkedinIcon} alt="LinkedIn Icon" />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col h-[340px] flex-wrap mt-10 md:mt-0">
          {menuList?.map((item) => (
            <Link
              key={item.id}
              to={
                item.category_children?.length > 0
                  ? `/${item.handle}/${item.category_children[0].handle}/${item.category_children[0].id}`
                  : `/${item.handle}/${item.id}`
              }
              className="py-2 text-sm hover:text-gray-400 transition-colors font-DMSans"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/contact-us"
            className="py-2 text-sm hover:text-gray-400 transition-colors font-DMSans"
          >
            Contact Us
          </Link>
        </div>
      </div>
      <hr />
      <div className="flex items-center flex-col">
        <p className="text-xs py-3">
          2024 © All rights reserved - Cozy Comfort
        </p>
        <img src={FooterImage} alt="Footer Decorative" />
      </div>
    </footer>
  );
};

export default Footer;
