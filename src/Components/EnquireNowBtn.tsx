import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const EnquireNowBtn = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [open, setOpen] = useState(false);

  const handleDialogClose = () => {
    setOpen(false);
    setFormData({ name: "", phone: "", email: "", message: "" });
    setErrors({ name: "", phone: "", email: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }))
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const newErrors = {
      name: formData.name ? "" : "Name is required",
      phone: formData.phone ? "" : "Phone number is required",
      email: formData.email ? "" : "Email is required",
    };

    setErrors(newErrors);

  
    if (Object.values(newErrors).some((error) => error !== "")) {
      return; 
    }

    console.log("Form Submitted:", formData);

   
    handleDialogClose();

  };

  return (
    <div>
      <p onClick={() => setOpen(true)}>Enquire Now</p>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <h4 className="font-bold text-xl">Request a Call Back</h4>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <form className="px-2" onSubmit={handleSubmit}>
                <input
                  name="name"
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`p-3 w-full rounded-lg my-2 border ${
                    errors.name ? "border-red-500" : "border-gray-400"
                  } text-black outline-none`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                <input
                  name="phone"
                  placeholder="Phone Number"
                  type="number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`p-3 w-full rounded-lg my-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-400"
                  } outline-none`}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`p-3 w-full rounded-lg my-2 border ${
                    errors.email ? "border-red-500" : "border-gray-400"
                  } outline-none`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="p-3 w-full rounded-lg my-2 border border-gray-400 outline-none"
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleDialogClose}
                    className="bg-red-500 text-white p-2 px-6 rounded-lg mt-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white p-2 px-6 rounded-lg mt-3"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnquireNowBtn;
