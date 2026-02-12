import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { applyForJob } from "@/redux/careerSlice";
import { uploadFile } from "@/redux/fileUploadSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import React, { FormEvent, useState } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

export type TWORKSHOPFAQ = {
  id: string;
  question: string;
  answer: string;
};

const FAQCard = ({
  faq,
  isExpanded,
  color = "#E39712",
  onClick,
}: {
  faq: TWORKSHOPFAQ;
  isExpanded: boolean;
  color?: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      style={
        {
          borderColor: isExpanded ? `${color}80` : "",
          "--hover-border-color": `${color}80`,
        } as React.CSSProperties
      }
      className={`overflow-hidden transition-all duration-300 border-4 cursor-pointer rounded-xl hover:border-[var(--hover-border-color)] bg-white ${
        isExpanded ? "" : "border-neutral-200"
      }`}
    >
      <div className="flex items-center justify-between w-full p-4 text-neutral-700">
        <span className="text-xl font-semibold transition-colors duration-300">
          {faq.question}
        </span>
        <span
          style={
            {
              backgroundColor: isExpanded ? `${color}1A` : "",
              borderColor: isExpanded ? color : "",
              "--hover-bg-color": `${color}1A`,
              "--hover-border-color": color,
            } as React.CSSProperties
          }
          className={`p-1 rounded-full border-2 flex items-center transition-all duration-300 ease-in-out transform ${
            isExpanded
              ? "rotate-45"
              : "hover:bg-[var(--hover-bg-color)] hover:border-[var(--hover-border-color)]"
          }`}
        >
          <IoAdd
            style={{ color: isExpanded ? color : "" }}
            className={`text-xl transition-colors duration-300 ${
              isExpanded ? "" : "text-neutral-800"
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
          <div className="p-4 pt-0 text-neutral-600">{faq.answer}</div>
        </div>
      </div>
    </div>
  );
};

export default FAQCard;

export const JobApplicationForm = ({
  id,
  setIsFormOpen,
  onSuccess,
  applicationSource,
}: {
  id: string;
  setIsFormOpen: (value: boolean) => void;
  onSuccess?: () => void;
  applicationSource?: string;
}) => {
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
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        resume: file,
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
      errors.resume = "Resume (PDF) is required";
    } else {
      const fileType = formData.resume.type;
      if (fileType !== "application/pdf") {
        errors.resume = "Only PDF files are allowed";
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
        }),
      );

      const fileUrl = fileAction.payload?.data?.fileDetails.url;
      if (!fileUrl) {
        return toast.error("Failed to upload resume");
      }

      const res = await dispatch(
        applyForJob({
          jobId: id,
          formData: { ...formData, resume: fileUrl },
          source: applicationSource ? applicationSource : "INTERNAL",
        }),
      );

      if (res.payload?.success) {
        toast.success("Application submitted successfully");
        setIsFormOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(res.payload?.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error during job application:", error);
      toast.error("An error occurred while submitting your application");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-2xl shadow-2xl sm:max-w-xl">
        <button
          onClick={() => setIsFormOpen(false)}
          className="absolute p-2 text-gray-500 transition-colors duration-200 rounded-full top-4 right-4 hover:text-gray-800 hover:bg-gray-100"
        >
          <IoClose className="text-2xl" />
        </button>
        <h2 className="mb-4 text-xl font-semibold text-gray-800 md:text-2xl">
          Apply for the Position
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="p-2 text-base text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C6E6] focus:border-transparent"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="p-2 text-base text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C6E6] focus:border-transparent"
                />
                {formErrors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="p-2 text-base text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C6E6] focus:border-transparent"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="p-2 text-base text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C6E6] focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {formErrors.gender && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.gender}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Portfolio Link
              </label>
              <input
                type="url"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                placeholder="Enter your portfolio link"
                className="p-2 text-base text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C6E6] focus:border-transparent"
              />
              {formErrors.portfolioLink && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.portfolioLink}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Cover Note
              </label>
              <textarea
                name="coverNote"
                value={formData.coverNote}
                onChange={handleChange}
                placeholder="Write your cover note (max 500 characters)"
                className="p-2 text-base text-gray-800 transition-all duration-200 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60C6E6] focus:border-transparent min-h-[80px]"
              />
              {formErrors.coverNote && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.coverNote}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">
                Resume (PDF only)
              </label>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />
              <label htmlFor="resume">
                <Button
                  type="button"
                  onClick={() => document.getElementById("resume")?.click()}
                  className="w-full p-2 text-base text-white transition-all duration-300 bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  {formData.resume ? formData.resume.name : "Upload PDF Resume"}
                </Button>
              </label>
              {formErrors.resume && (
                <p className="mt-1 text-xs text-red-500">{formErrors.resume}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Only PDF files are accepted (max 5MB)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full p-2 mt-4 text-base text-white transition-all duration-300 bg-gradient-to-b from-[#60C6E6] to-[#3D8196] rounded-lg hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
