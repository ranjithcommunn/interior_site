import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
const EnquireNowBtn = () => {
    
    const [Open, setOpen] = useState(false);

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted");
  
    // Close the dialog after submission
    handleDialogClose();
  
    // Add API call logic here, for example:
    // const formData = new FormData(e.target);
    // sendFormDataToBackend(formData);
  };
  
  return (
    <div>
      <p
        onClick={() => setOpen(true)}
      >
        Enquire Now
      </p>
      <AlertDialog open={Open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <h4 className="font-bold text-xl">Request a Call Back</h4>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <form className="px-2" onSubmit={(e) => handleSubmit(e)}>
                <input
                  placeholder="Name"
                  type="text"
                  className="p-3 w-full rounded-lg my-2 border border-gray-400 text-black outline-none"
                />
                <input
                  placeholder="Phone Number"
                  type="number"
                  className="p-3 w-full rounded-lg my-2 border border-gray-400 outline-none"
                />
                <input
                  placeholder="Email"
                  type="email"
                  className="p-3 w-full rounded-lg my-2 border border-gray-400 outline-none"
                />
                <textarea
                  rows={5}
                  className="p-3 w-full rounded-lg my-2 border border-gray-400 outline-none"
                  placeholder="Message"
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button" // Change to type="button" to prevent form submission
                    onClick={handleDialogClose}
                    className="bg-red-500 text-white p-2 px-6 rounded-lg  mt-3"
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
