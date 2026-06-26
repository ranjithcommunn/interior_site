import React from "react";
import logo from "../assets/logo.png";
import InstagramIcon from "../assets/InstagramIcon.png";
import LinkedinIcon from "../assets/LinkedInIcon.png";
import { Phone, Mail, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

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

  const menuList = menuData?.product_categories.filter(
    (cat) =>
      cat.category_children?.length > 0 || cat.parent_category_id === null
  );

  return (
    <footer className="bg-black text-white px-5 md:px-12 lg:px-20 py-12 md:py-16 font-Poppins border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {/* Brand */}
        <div>
          <img src={logo} alt="Vibrer Logo" className="h-24 w-auto object-contain" />
          <p className="text-sm leading-6 text-gray-400 mt-4 max-w-sm font-DMSans">
            Vibrer, a premium brand from SREGA Electronics & Furniture LLP, is
            your one-stop solution for all kinds of furniture needs &mdash;
            from contemporary sofas to smart storage solutions, crafted with
            quality and modern design.
          </p>
          <div className="flex items-center mt-5 gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <img src={InstagramIcon} alt="Instagram" className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <img src={LinkedinIcon} alt="LinkedIn" className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-base mb-5">Quick Links</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {menuList?.map((item) => (
              <Link
                key={item.id}
                to={`/${item.handle}/${item.id}`}
                className="text-sm text-gray-400 hover:text-white transition-colors font-DMSans"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/contact-us"
              className="text-sm text-gray-400 hover:text-white transition-colors font-DMSans"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Get In Touch */}
        <div>
          <h3 className="font-semibold text-base mb-5">Get In Touch</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-gray-400" />
              <span className="text-sm text-gray-400 font-DMSans">+91 95357 11662</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-gray-400" />
              <span className="text-sm text-gray-400 font-DMSans">
                info@vibrer.co.in
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
              <span className="text-sm text-gray-400 font-DMSans leading-6">
                M/s SREGA Electronics &amp; Furniture LLP,
                <br />
                #3, Ground Floor, 5th Block, 10th F Main Rd,
                <br />
                Jayanagar, 5th Block,
                <br />
                Bengaluru - 560 041
              </span>
            </li>
          </ul>
        </div>
      </div>

      <hr className="border-white/10 my-10" />

      <div className="flex items-center justify-center">
        <p className="text-xs text-gray-500">
          {new Date().getFullYear()} &copy; All rights reserved - Vibrer
        </p>
      </div>
    </footer>
  );
};

export default Footer;
