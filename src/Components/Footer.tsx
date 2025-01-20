import React from "react";
import logo from "../assets/logo.png";
import InstagramIcon from "../assets/InstagramIcon.png";
import LinkedinIcon from "../assets/LinkedInIcon.png";
import FooterImage from "../assets/footer_image01.png";

// Define a type for footer items
interface FooterItem {
  id: number;
  title: string;
}

// Footer items array
const footerItems: FooterItem[] = [
  { id: 1, title: "Home" },
  { id: 2, title: "Living" },
  { id: 3, title: "Storage" },
  { id: 4, title: "Dining" },
  { id: 5, title: "Bedroom" },
  { id: 6, title: "Mattress" },
  { id: 7, title: "Study" },
  { id: 8, title: "Office" },
  { id: 9, title: "Outdoor" },
  { id: 10, title: "Residential" },
  { id: 11, title: "Institutional" },
  { id: 12, title: "Commercial" },
];

const Footer: React.FC = () => {
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
        <div className="flex flex-col h-80 flex-wrap mt-10 md:mt-0">
          {footerItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.title.toLowerCase()}`}
              className="py-2 text-sm hover:text-gray-400 transition-colors font-DMSans"
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
      <hr />
      <div className="flex items-center flex-col">
        <p className="text-xs py-3">2024 © All rights reserved - Cozy Comfort</p>
        <img src={FooterImage} alt="Footer Decorative" />
      </div>
    </footer>
  );
};

export default Footer;
