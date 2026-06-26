import React, { useState } from "react";
import { motion } from "framer-motion";
import phoneIcon from "../assets/phone_icon.svg";
import EmailIcon from "../assets/mail_icon.svg";
import LocationIcon from "../assets/location_icon.svg";

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: false }));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/store/enquiries`, {
        method: "POST",
        headers: {
          "x-publishable-api-key": import.meta.env.VITE_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          source: "contact_page",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setFormData({ name: "", phone: "", email: "", message: "" });
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="font-Poppins bg-white">
      {/* Header */}
      <section className="flex items-center justify-center text-center flex-col gap-3 pt-16 pb-12 px-5 md:px-20 bg-[#FAFAFA]">
        <motion.span
          className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          We're Here To Help
        </motion.span>
        <motion.h1
          className="font-bold text-3xl md:text-heading1 md:leading-heading1"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Contact Us
        </motion.h1>
        <motion.p
          className="md:w-[55%] text-gray-600 md:text-heading3 md:leading-heading3"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          We'd love to hear from you! Whether you have questions about our
          luxury furniture pieces or need assistance with customization
          options, our team is here to help.
        </motion.p>
      </section>

      {/* Content */}
      <section className="grid md:grid-cols-2 px-5 md:px-20 py-14 md:py-16 gap-10 md:gap-14">
        {/* Left: Contact info + map */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="font-bold text-xl md:text-heading2 md:leading-heading2 mb-6">
            Get In Touch
          </h2>
          <div className="flex flex-col gap-4 mb-8">
            {contactData.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="w-11 h-11 rounded-full bg-[#f5f5f5] flex items-center justify-center shrink-0">
                  <img src={item.icon} alt={item.title} className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.discription.split("\n").map((line, index, array) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < array.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-xl overflow-hidden shadow-sm">
            <iframe
              title="Vibrer location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15554.169803816076!2d77.56556620025746!3d12.937102761135698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae159fe6a38b53%3A0x308f136a25add36d!2sPhilips%20Arena%20(Dilip%20Electronics)!5e0!3m2!1sen!2sin!4v1744635975571!5m2!1sen!2sin"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.form
          className="bg-[#FAFAFA] rounded-2xl p-6 md:p-10 h-fit"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
        >
          <h2 className="font-bold text-xl md:text-heading2 md:leading-heading2 mb-1">
            Request a Call Back
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Fill in your details and we'll get back to you shortly.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input
              name="name"
              placeholder="Your name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`p-3 w-full rounded-lg bg-white border outline-none transition-colors ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-200 focus:border-black"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">Name is required.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">Phone Number</label>
            <input
              name="phone"
              placeholder="Your phone number"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`p-3 w-full rounded-lg bg-white border outline-none transition-colors ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-200 focus:border-black"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">Phone number is required.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              name="email"
              placeholder="you@example.com"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`p-3 w-full rounded-lg bg-white border outline-none transition-colors ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-200 focus:border-black"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required.</p>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1.5">Message</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className="p-3 w-full rounded-lg bg-white border border-gray-200 outline-none focus:border-black transition-colors"
              placeholder="Tell us what you're looking for..."
            />
          </div>

          {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
          {submitted && (
            <p className="text-green-700 text-sm mt-2">
              Thanks! We've received your message and will get back to you soon.
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            className="bg-black text-white p-3 rounded-lg w-full mt-4 md:text-button1 md:leading-button1 disabled:opacity-60 hover:bg-gray-900 transition-colors"
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {submitting ? "Submitting..." : "Submit"}
          </motion.button>
        </motion.form>
      </section>
    </main>
  );
};

export default ContactUs;
