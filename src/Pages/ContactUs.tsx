import React, { useState } from "react";
import { motion } from "framer-motion";
import phoneIcon from "../assets/phone_icon.svg";
import EmailIcon from "../assets/mail_icon.svg";
import LocationIcon from "../assets/location_icon.svg";
import MapImage from "../assets/map_image.png";

interface ContactData {
  id: number;
  title: string;
  icon: string;
  discription: string;
}

const contactData: ContactData[] = [
  {
    id: 1,
    title: "Phone",
    icon: phoneIcon,
    discription: "+91 95357 11662",
  },
  {
    id: 2,
    title: "Email",
    icon: EmailIcon,
    discription: "info@vibrer.co.in, sales@vibrer.co.in",
  },
  {
    id: 3,
    title: "Location",
    icon: LocationIcon,
    discription: `M/s SREGA Electronics & Furniture LLP ,
#3, Ground Floor, 5th Block, 10th F Main Rd,
Jayanagar, 5th Block,
Bengaluru - 560 041`,
  },
];

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      phone: formData.phone.trim() === "",
      email: formData.email.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Submitted", formData);
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
      alert("Form submitted successfully!");
    }
  };

  return (
    <main className="font-Poppins">
      <section className="flex items-center justify-center text-center flex-col gap-2 my-10 px-5 md:px-20">
        <motion.h2
          className="font-bold text-2xl md:text-[48px] md:leading-[72px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Contact Us
        </motion.h2>
        <motion.p
          className="md:w-[60%] md:text-heading3 md:leading-heading3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          We'd love to hear from you! Whether you have questions about our
          luxury furniture pieces or need assistance with customization options,
          our team is here to help.
        </motion.p>
      </section>
      <section className="grid md:grid-cols-2 grid-cols-1 px-5 md:px-20 mb-10 gap-5 md:gap-0">
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h4 className="font-bold text-lg my-4 md:text-heading2 md:leading-heading2">
            Get In Touch
          </h4>
          <div className="flex flex-col items-center md:items-start md:text-left gap-4 md:gap-3">
            {contactData.map((item) => (
              <motion.div
                key={item.id}
                className="flex flex-col items-center md:items-start"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt={item.title} />
                  <h5 className="text-md font-bold md:text-heading3 md:leading-heading3">
                    {item.title}
                  </h5>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  {item.discription.split("\n").map((line, index, array) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < array.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="my-3 flex justify-center md:justify-start w-full md:w-1/2">
           {/** google map */}
           <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15554.169803816076!2d77.56556620025746!3d12.937102761135698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae159fe6a38b53%3A0x308f136a25add36d!2sPhilips%20Arena%20(Dilip%20Electronics)!5e0!3m2!1sen!2sin!4v1744635975571!5m2!1sen!2sin"
              width="100%" // Make it responsive
              height="300" // Adjust height as needed
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>

        <motion.form
          className="bg-[#D3D3D3] p-5 md:p-10"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          onSubmit={handleSubmit}
        >
          <h4 className="font-bold text-xl md:text-heading2 md:leading-heading2">
            Request a Call Back
          </h4>
          <motion.input
            name="name"
            placeholder="Name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className={`p-3 w-full rounded-lg my-2 ${
              errors.name ? "border-red-500 border" : ""
            }`}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Name is required.</p>
          )}
          <motion.input
            name="phone"
            placeholder="Phone Number"
            type="number"
            value={formData.phone}
            onChange={handleInputChange}
            className={`p-3 w-full rounded-lg my-2 ${
              errors.phone ? "border-red-500 border" : ""
            }`}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">Phone number is required.</p>
          )}
          <motion.input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`p-3 w-full rounded-lg my-2 ${
              errors.email ? "border-red-500 border" : ""
            }`}
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Email is required.</p>
          )}
          <motion.textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className="p-3 w-full rounded-lg my-2"
            placeholder="Message"
            whileFocus={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <motion.button
            type="submit"
            className="bg-black text-white p-2 rounded-lg w-full mt-3 md:text-button1 md:leading-button1"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Submit
          </motion.button>
        </motion.form>
      </section>
    </main>
  );
};

export default ContactUs;
