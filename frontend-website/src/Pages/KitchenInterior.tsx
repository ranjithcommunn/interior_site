import React from "react";
import { motion } from "framer-motion";
import KitchenImage01 from "../assets/kitchen_image01.png";
import TagIcon from "../assets/tag_icon.svg";
import GurdIcon from "../assets/gurd_icon.svg";
import VanIcon from "../assets/van_icon.svg";
import StafIcon from "../assets/staf_icon.svg";
import SpaceIcon from "../assets/space_icon.svg";
import BreshIcon from "../assets/bresh_icon.svg";
import KitchenTypeImage01 from "../assets/kitchen_Type_image01.png";
import KitchenTypeImage02 from "../assets/kitchen_Type_image02.png";
import KitchenTypeImage03 from "../assets/kitchen_Type_image03.png";
import HappyKitchensimage01 from '../assets/Happy_Kitchens_image01.png';
import HappyKitchensimage02 from '../assets/Happy_Kitchens_image02.png';
import HappyKitchensimage03 from '../assets/Happy_Kitchens_image03.png';
import HappyKitchensimage04 from '../assets/Happy_Kitchens_image04.png';
import HappyKitchensimage05 from '../assets/Happy_Kitchens_image05.png';

interface WhyChooseUsItem {
  id: number;
  name: string;
  icon: string;
}

interface KitchenType {
  id: number;
  name: string;
  discription: string;
  imageUrl: string;
}

const WhyChooseUsList: WhyChooseUsItem[] = [
  { id: 1, name: "No hidden charges", icon: TagIcon },
  { id: 2, name: "Flat 5 to 10 years warranty", icon: GurdIcon },
  { id: 3, name: "Delivery in 50 days", icon: VanIcon },
  { id: 4, name: "30+ inhouse designers", icon: StafIcon },
  { id: 5, name: "Space saving", icon: SpaceIcon },
  { id: 6, name: "Personalized", icon: BreshIcon },
];

const typesOfKitchen: KitchenType[] = [
  {
    id: 1,
    name: "L - Shaped Kitchen",
    discription: `An L-shaped kitchen is ideal for compact and medium Indian homes, featuring countertops along two adjoining walls to form a functional "work triangle" between the stove, sink, and refrigerator. The design maximizes corner spaces with pull-out trays or carousel units and creates an open feel, perfect for integrating dining or living areas. Cabinets and drawers offer ample storage, while countertops provide workspace. Additions like under-cabinet lighting or wall shelves enhance usability and style. Efficient and elegant, it suits urban and larger homes alike.`,
    imageUrl: KitchenTypeImage01,
  },
  {
    id: 2,
    name: "Parallel - Shaped Kitchen",
    discription: `A parallel kitchen, or galley kitchen, features two parallel countertops with a central walkway, ideal for compact Indian homes. This layout ensures a functional workflow by keeping the stove, sink, and refrigerator within easy reach, forming an efficient "work triangle." With ample countertop space, one side can be used for cooking and the other for cleaning or dining. Storage is maximized with overhead cabinets, drawers, or shelves. Modern finishes, integrated appliances, and good ventilation make this layout both practical and stylish.`,
    imageUrl: KitchenTypeImage02,
  },
  {
    id: 3,
    name: "U - Shaped Kitchen",
    discription: `A U-shaped kitchen features countertops and cabinets along three walls, ideal for spacious Indian homes. This layout ensures an ergonomic "work  triangle" between the stove, sink, and refrigerator, offering efficiency and  ease of use.  With abundant storage in cabinets, drawers, and shelves, it keeps utensils  and groceries organized. The generous countertop space supports meal  prep, cooking, and even hosting. Adaptable for a breakfast counter or small island, this design suits closed or semi-open layouts, prioritizing  functionality, storage, and a premium cooking experience.`,
    imageUrl: KitchenTypeImage03,
  },
];


const KitchenInterior: React.FC = () => {
  return (
    <main className="font-Poppins">
      {/* Kitchen Image Section */}
      <motion.section
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src={KitchenImage01}
          alt="kitchen image"
          className="object-cover w-full"
        />
        <h3 className="absolute inset-0 flex items-center justify-center text-white md:text-[48px] md:leading-[72px] font-bold">
          Welcome to VIBER Kitchen Interior
        </h3>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        className="py-6 flex flex-col items-center px-5 md:px-10 bg-[#F7F7F7]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-2xl font-bold text-center">Why Choose Us</h3>
        <div className="grid md:grid-cols-3 grid-cols-1 w-full gap-5 mt-5">
          {WhyChooseUsList.map((item, index) => (
            <motion.div
              key={index}
              className="bg-[#D3D3D3] p-6 rounded-lg flex flex-col items-center gap-2 shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img src={item.icon} alt={item.name} className="h-5 w-5" />
              <p>{item.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Types of Kitchen Section */}
      <motion.section
        className="text-center my-6 px-5 md:px-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="font-bold text-2xl mt-16 mb-12 md:text-[30px] md:leading-[45px]">Types of Kitchen</h3>
        <div className="flex flex-col items-center my-6 gap-16">
          {typesOfKitchen.map((item, index) => (
            <motion.div
              className="flex items-center gap-1 md:gap-14 md:flex-row flex-col md:even:flex-row-reverse"
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <img
                src={item.imageUrl}
                className="w-full h-80"
                alt={item.name}
              />
              <div className="flex flex-col items-start">
                <h4 className="text-xl font-bold my-4 md:text-heading1 md:leading-heading1">{item.name}</h4>
                <p className="text-left md:text-base">{item.discription}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Happy Kitchens Section */}
      <motion.section
        className="text-center my-6 px-5 md:px-20 mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h3 className="font-bold text-2xl mt-16 mb-12">
          Happy Kitchens / Designed Kitchens
        </h3>
        <div className="flex flex-col items-center md:gap-12 gap-6">
          <motion.div
            className="flex md:flex-row flex-col items-center md:gap-12 gap-6"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div><img src={HappyKitchensimage01} alt="happy kitchen Image" className="w-full h-full" /></div>
            <div><img src={HappyKitchensimage02} alt="happy kitchen Image" className="w-full h-full" /></div>
          </motion.div>
          <motion.div
            className="flex md:flex-row flex-col items-center justify-between md:gap-12 gap-6"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div><img src={HappyKitchensimage03} alt="happy kitchen Image" className="w-full h-full" /></div>
            <div><img src={HappyKitchensimage04} alt="happy kitchen Image" className="w-full h-full" /></div>
          </motion.div>
          <div><img src={HappyKitchensimage05} alt="happy kitchen Image" className="w-full h-full" /></div>
        </div>
      </motion.section>
    </main>
  );
};

export default KitchenInterior;
