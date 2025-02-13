import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { applyForJob } from "@/redux/careerSlice";
import { uploadFile } from "@/redux/fileUploadSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";

import React, { FormEvent, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export type TWORKSHOPFAQ = {
  id: string;
  question: string;
  answer: string;
};

const FAQCard = ({
  faq,
  isExpanded,
  onClick,
}: {
  faq: TWORKSHOPFAQ;
  isExpanded: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`overflow-hidden transition-all duration-300 border-2 cursor-pointer rounded-xl hover:border-primary/50 ${
        isExpanded ? "border-primary/50" : "border-neutral-200"
      }`}
    >
      <div className="flex items-center justify-between w-full p-4 text-neutral-700">
        <span className="text-xl font-semibold transition-colors duration-300">
          {faq.question}
        </span>
        <span
          className={`p-1 rounded-full border-2 flex items-center transition-all duration-300 ease-in-out transform ${
            isExpanded
              ? "rotate-45 bg-primary/10 border-primary"
              : "hover:bg-primary/10 hover:border-primary"
          }`}
        >
          <IoAdd
            className={`text-xl transition-colors duration-300 ${
              isExpanded ? "text-primary" : "text-neutral-800"
            }`}
          />
        </span>
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 pt-0 text-neutral-600 ">{faq.answer}</div>
        </div>
      </div>
    </div>
  );
};

export default FAQCard;

export interface HiringFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  portfolioLink: string;
  coverNote: string;
  resume: File | null;
}

interface FormError {
  [key: string]: string;
}

export function JobApplicationForm({
  id,
  setIsFormOpen,
}: {
  id: string;
  setIsFormOpen: (value: boolean) => void;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const { loading } = useSelector((state: RootState) => state.career);

  const [formData, setFormData] = useState<HiringFormData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    portfolioLink: "",
    coverNote: "",
    resume: null,
  });

  const [formErrors, setFormErrors] = useState<FormError>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        resume: e.target.files![0],
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormError = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!formData.gender) {
      errors.gender = "Please select a gender";
    }

    if (!formData.portfolioLink.trim()) {
      errors.portfolioLink = "Portfolio link is required";
    } else if (!/^https?:\/\/.+\..+/.test(formData.portfolioLink)) {
      errors.portfolioLink = "Invalid URL";
    }

    if (formData.coverNote.length > 500) {
      errors.coverNote = "Cover note must be 500 characters or less";
    }

    if (!formData.resume) {
      errors.resume = "Resume is required";
    } else {
      const fileType = formData.resume.type;
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(fileType)) {
        errors.resume = "File must be PDF, DOC, or DOCX";
      } else if (formData.resume.size > 5000000) {
        errors.resume = "File size must be less than 5MB";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return toast.error("Please fill all the required fields correctly");
    }

    if (!formData.resume) {
      return toast.error("Resume is required");
    }

    try {
      const token = await getToken();
      if (!token) {
        navigate("/sign-in");
        return toast.error("Login first to apply");
      }

      const fileAction = await dispatch(
        uploadFile({
          file: formData.resume,
          getToken: async () => token,
        })
      );

      const fileUrl = fileAction.payload?.data?.fileDetails.url;
      if (!fileUrl) {
        return toast.error("Failed to upload resume");
      }

      const res = await dispatch(
        applyForJob({
          jobId: id,
          formData: { ...formData, resume: fileUrl },
        })
      );

      if (res.payload?.success) {
        toast.success("Application submitted successfully");
        setIsFormOpen(false);
      } else {
        toast.error(res.payload?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error during job application:", error);
      toast.error("An error occurred while submitting your application");
    }
  };
  if (loading) return <Loader />;
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex flex-col w-full mb-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-3 text-base text-black bg-white border rounded-lg outline-black"
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
        )}
      </div>

      <div className="flex flex-col w-full mb-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-3 text-base text-black bg-white border rounded-lg outline-black"
        />
        {formErrors.email && (
          <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>

      <div className="flex flex-col w-full mb-4">
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-3 text-base text-black bg-white border rounded-lg outline-black"
        />
        {formErrors.phone && (
          <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
        )}
      </div>

      <div className="flex flex-col w-full mb-4">
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="p-3 text-base text-black bg-white border rounded-lg outline-black"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        {formErrors.gender && (
          <p className="mt-1 text-sm text-red-500">{formErrors.gender}</p>
        )}
      </div>

      <div className="flex flex-col w-full mb-4">
        <input
          type="url"
          name="portfolioLink"
          value={formData.portfolioLink}
          onChange={handleChange}
          placeholder="Portfolio Link"
          className="p-3 text-base text-black bg-white border rounded-lg outline-black"
        />
        {formErrors.portfolioLink && (
          <p className="mt-1 text-sm text-red-500">
            {formErrors.portfolioLink}
          </p>
        )}
      </div>

      <div className="flex flex-col w-full mb-4">
        <textarea
          name="coverNote"
          value={formData.coverNote}
          onChange={handleChange}
          placeholder="Cover Note"
          className="p-3 text-base text-black bg-white border rounded-lg outline-black"
        />
        {formErrors.coverNote && (
          <p className="mt-1 text-sm text-red-500">{formErrors.coverNote}</p>
        )}
      </div>

      <div className="flex flex-col w-full mb-4">
        <input
          type="file"
          id="resume"
          name="resume"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
        <label htmlFor="resume">
          <Button
            type="button"
            onClick={() => document.getElementById("resume")?.click()}
            className="w-full p-3 mb-4 text-base text-black transition-all duration-300 rounded-lg bg-slate-200 hover:bg-slate-300"
          >
            {formData.resume ? formData.resume.name : "Upload Resume"}
          </Button>
        </label>
        {formErrors.resume && (
          <p className="mt-1 text-sm text-red-500">{formErrors.resume}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-4 bg-gradient-to-b from-[#60C6E6] to-[#3D8196] text-white hover:opacity-90 snap-center transition-all duration-300"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
