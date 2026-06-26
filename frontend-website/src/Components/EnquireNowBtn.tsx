import React, { useState } from "react";
import { CheckCircle2, MessageSquarePlus, X } from "lucide-react";
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
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 text-sm md:text-base font-medium"
      >
        <MessageSquarePlus size={16} />
        Enquire Now
      </button>

      <AlertDialog open={open} onOpenChange={(next) => (next ? setOpen(true) : handleDialogClose())}>
        <AlertDialogContent className="max-w-md p-0 gap-0 overflow-hidden rounded-2xl">
          <button
            type="button"
            onClick={handleDialogClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
          >
            <X size={18} />
          </button>

          <AlertDialogHeader className="px-6 pt-6 pb-1">
            <AlertDialogTitle>
              <h4 className="font-bold text-xl font-Poppins">Request a Call Back</h4>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Share your details and our team will get in touch to help customise this piece for you.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {submitted ? (
            <div className="px-6 py-10 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={28} className="text-emerald-500" />
              </div>
              <p className="font-semibold text-gray-800">Enquiry sent!</p>
              <p className="text-sm text-gray-500">
                We've received your enquiry and will get back to you soon.
              </p>
              <button
                type="button"
                onClick={handleDialogClose}
                className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-lg mt-2 hover:bg-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form className="px-6 pb-6 pt-3 space-y-3" onSubmit={handleSubmit}>
              <div>
                <input
                  name="name"
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`p-3 w-full rounded-lg border text-sm outline-none transition-colors ${
                    errors.name ? "border-red-400" : "border-gray-200 focus:border-black"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  name="phone"
                  placeholder="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`p-3 w-full rounded-lg border text-sm outline-none transition-colors ${
                    errors.phone ? "border-red-400" : "border-gray-200 focus:border-black"
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`p-3 w-full rounded-lg border text-sm outline-none transition-colors ${
                    errors.email ? "border-red-400" : "border-gray-200 focus:border-black"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <textarea
                name="message"
                rows={4}
                placeholder="Message (optional)"
                value={formData.message}
                onChange={handleChange}
                className="p-3 w-full rounded-lg border border-gray-200 text-sm outline-none focus:border-black transition-colors resize-none"
              />
              {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDialogClose}
                  className="px-5 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnquireNowBtn;
