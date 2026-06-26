import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface EnquireNowBtnProps {
  productId?: string;
}

const EnquireNowBtn: React.FC<EnquireNowBtnProps> = ({ productId }) => {
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleDialogClose = () => {
    setOpen(false);
    setFormData({ name: "", phone: "", email: "", message: "" });
    setErrors({ name: "", phone: "", email: "" });
    setSubmitError("");
    setSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          source: "product_enquiry",
          product_id: productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p onClick={() => setOpen(true)} className="min-w-fit text-[9px] md:text-[12px]">Enquire Now</p>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <h4 className="font-bold text-xl">Request a Call Back</h4>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {submitted ? (
                <div className="px-2 py-4 flex flex-col items-center gap-3 text-center">
                  <p className="text-black">Thanks! We've received your enquiry and will get back to you soon.</p>
                  <button
                    type="button"
                    onClick={handleDialogClose}
                    className="bg-black text-white p-2 px-6 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              ) : (
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
                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
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
                    disabled={submitting}
                    className="bg-black text-white p-2 px-6 rounded-lg mt-3 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnquireNowBtn;
