import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiCheck } from "react-icons/fi";
import { memo, useState, useMemo, useCallback, useEffect } from "react";
import { UserDetails } from "./profile";

interface ProfileField {
  field: keyof UserDetails;
  label: string;
  minLength?: number;
  required?: boolean;
  type?: "text" | "email" | "tel" | "date" | "select";
}

interface ProfileFormProps {
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
  setShowCompletionForm: (value: boolean) => void;
  handleProfileSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  removeInterest: (index: number) => void;
  updateInterests: () => Promise<void>;
  isOpen: boolean;
}

const profileFields: ProfileField[] = [
  { field: "name", label: "Name", required: true, type: "text" },
  { field: "email", label: "Email", required: true, type: "email" },
  { field: "phoneNumber", label: "Phone Number", required: true, type: "tel" },
  { field: "location", label: "Location", required: true, type: "text" },
  {
    field: "dateOfBirth",
    label: "Date of Birth",
    required: true,
    type: "date",
  },
  { field: "gender", label: "Gender", required: true, type: "select" },
  { field: "education", label: "Education", type: "text" },
  { field: "occupation", label: "Occupation", type: "text" },
  { field: "bio", label: "Bio", minLength: 10, type: "text" },
  { field: "interests", label: "Interests", minLength: 3, type: "text" },
  { field: "socialLinks", label: "Social Links", minLength: 1, type: "text" },
];

const genderOptions = [
  { value: "", label: "Select gender", disabled: true },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const mandatoryFields = [
  "name",
  "email",
  "phoneNumber",
  "location",
  "dateOfBirth",
  "gender",
];

const ProfileFormModal = memo(
  ({
    userDetails,
    setUserDetails,
    setShowCompletionForm,
    handleProfileSubmit,
    removeInterest,
    updateInterests,
    isOpen,
  }: ProfileFormProps) => {
    const [formData, setFormData] = useState<UserDetails>({
      ...userDetails,
      gender: userDetails.gender || "prefer-not-to-say",
    });
    const [newSocialLink, setNewSocialLink] = useState({ label: "", url: "" });
    const [newInterest, setNewInterest] = useState("");
    const [errors, setErrors] = useState<
      Partial<Record<keyof UserDetails, string>>
    >({});
    const [socialLinkError, setSocialLinkError] = useState("");
    const [activeTab, setActiveTab] = useState(0);

    const validateField = useCallback(
      (field: ProfileField, value: any): string | undefined => {
        if (!mandatoryFields.includes(field.field) && !value) {
          return undefined;
        }
        if (field.required && (!value || String(value).trim() === "")) {
          return `${field.label} is required`;
        }
        if (
          field.field === "bio" &&
          field.minLength &&
          value &&
          value.length < field.minLength
        ) {
          return `${field.label} must be at least ${field.minLength} characters`;
        }
        if (
          field.field === "interests" &&
          field.minLength &&
          value &&
          value.length < field.minLength
        ) {
          return `Please add at least ${field.minLength} interests`;
        }
        if (
          field.field === "socialLinks" &&
          field.minLength &&
          value &&
          value.length < field.minLength
        ) {
          return `Please add at least ${field.minLength} social link${
            field.minLength > 1 ? "s" : ""
          }`;
        }
        if (
          field.field === "email" &&
          value &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
          return "Invalid email format";
        }
        if (
          field.field === "phoneNumber" &&
          value &&
          !/^\+?[\d\s-]{10,}$/.test(value)
        ) {
          return "Invalid phone number format";
        }
        if (field.field === "gender" && value === "") {
          return "Please select a gender";
        }
        return undefined;
      },
      []
    );

    const validateSocialLink = useCallback(
      (url: string): string | undefined => {
        try {
          new URL(url);
          return undefined;
        } catch {
          return "Invalid URL format";
        }
      },
      []
    );

    useEffect(() => {
      const initialErrors: Partial<Record<keyof UserDetails, string>> = {};
      profileFields
        .filter((field) => mandatoryFields.includes(field.field))
        .forEach((field) => {
          const error = validateField(field, formData[field.field]);
          if (error) {
            initialErrors[field.field] = error;
          }
        });
      setErrors(initialErrors);
    }, [formData, validateField]);

    const profileCompletionPercentage = useMemo(() => {
      const completedFields = profileFields.reduce((acc, field) => {
        const value = formData[field.field];
        if (mandatoryFields.includes(field.field)) {
          return acc + (value && String(value).trim() !== "" ? 1 : 0);
        }
        if (field.field === "interests") {
          return (
            acc +
            (value && (value as string[]).length >= (field.minLength || 1)
              ? 1
              : 0)
          );
        }
        if (field.field === "socialLinks") {
          return (
            acc +
            (value &&
            (value as Array<{ label: string; url: string }>).length >=
              (field.minLength || 1)
              ? 1
              : 0)
          );
        }
        if (field.field === "bio") {
          return (
            acc +
            (value && (value as string).length >= (field.minLength || 1)
              ? 1
              : 0)
          );
        }
        return acc + (value && String(value).trim() !== "" ? 1 : 0);
      }, 0);
      return Math.round((completedFields / profileFields.length) * 100);
    }, [formData]);

    const handleInputChange = (field: keyof UserDetails, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      const fieldDef = profileFields.find((f) => f.field === field)!;
      const error = validateField(fieldDef, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
      setUserDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddSocialLink = () => {
      if (!newSocialLink.label.trim() || !newSocialLink.url.trim()) {
        setSocialLinkError("Both platform and URL are required");
        return;
      }
      const urlError = validateSocialLink(newSocialLink.url);
      if (urlError) {
        setSocialLinkError(urlError);
        return;
      }
      const updatedLinks = [...(formData.socialLinks || []), newSocialLink];
      setFormData((prev) => ({
        ...prev,
        socialLinks: updatedLinks,
      }));
      setUserDetails((prev) => ({
        ...prev,
        socialLinks: updatedLinks,
      }));
      setNewSocialLink({ label: "", url: "" });
      setSocialLinkError("");
      setErrors((prev) => ({
        ...prev,
        socialLinks: validateField(
          profileFields.find((f) => f.field === "socialLinks")!,
          updatedLinks
        ),
      }));
    };

    const handleAddInterest = () => {
      if (!newInterest.trim()) return;
      const updatedInterests = [
        ...(formData.interests || []),
        newInterest.trim(),
      ];
      setFormData((prev) => ({
        ...prev,
        interests: updatedInterests,
      }));
      setUserDetails((prev) => ({
        ...prev,
        interests: updatedInterests,
      }));
      setNewInterest("");
      setErrors((prev) => ({
        ...prev,
        interests: validateField(
          profileFields.find((f) => f.field === "interests")!,
          updatedInterests
        ),
      }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newErrors: Partial<Record<keyof UserDetails, string>> = {};
      profileFields
        .filter((field) => mandatoryFields.includes(field.field))
        .forEach((field) => {
          const error = validateField(field, formData[field.field]);
          if (error) newErrors[field.field] = error;
        });
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        await handleProfileSubmit(e);
        setShowCompletionForm(false);
      }
    };

    const tabs = [
      {
        title: "Personal Details",
        fields: [
          "name",
          "email",
          "phoneNumber",
          "location",
          "dateOfBirth",
          "gender",
        ],
      },
      {
        title: "Work & Bio",
        fields: ["education", "occupation", "bio"],
      },
      {
        title: "Social & Interests",
        fields: ["socialLinks", "interests"],
      },
    ];

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl p-4 sm:p-6 bg-white rounded-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Complete Your Profile
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2 sm:h-2.5">
                <div
                  className="bg-orange-500 h-2 sm:h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletionPercentage}%` }}
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-600">
                {profileCompletionPercentage}%
              </span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-4 sm:mb-6">
            {tabs.map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                    activeTab === index ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                {index < tabs.length - 1 && (
                  <div className="w-8 sm:w-12 h-1 bg-gray-300 mx-1 sm:mx-2" />
                )}
              </div>
            ))}
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap border-b border-orange-200 mb-4 sm:mb-6">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${
                  activeTab === index
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-600 hover:text-orange-500"
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.title}
              </button>
            ))}
          </div>

          <form id="profile-edit-form" onSubmit={handleSubmit}>
            <div className="space-y-4 sm:space-y-6">
              {activeTab === 0 && (
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  {tabs[0].fields.map((fieldName) => {
                    const field = profileFields.find(
                      (f) => f.field === fieldName
                    )!;
                    return (
                      <div key={field.field} className="space-y-1 sm:space-y-2">
                        <label
                          htmlFor={field.field}
                          className="flex items-center text-xs sm:text-sm font-medium text-gray-700"
                        >
                          {field.label}
                          {field.required && !formData[field.field] && (
                            <span className="ml-1 sm:ml-2 text-xs text-red-500">
                              (Required)
                            </span>
                          )}
                        </label>
                        {field.type === "select" ? (
                          <select
                            id={field.field}
                            name={field.field}
                            value={(formData[field.field] as string) || ""}
                            onChange={(e) =>
                              handleInputChange(field.field, e.target.value)
                            }
                            className="w-full p-2 sm:p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                          >
                            {genderOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.field}
                            type={field.type || "text"}
                            name={field.field}
                            value={(formData[field.field] as string) || ""}
                            onChange={(e) =>
                              handleInputChange(field.field, e.target.value)
                            }
                            readOnly={field.field === "email"}
                            className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base ${
                              errors[field.field]
                                ? "border-red-500"
                                : "border-orange-200"
                            } ${field.field === "email" ? "bg-gray-100" : ""}`}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        )}
                        {errors[field.field] && (
                          <p className="text-xs text-red-500">
                            {errors[field.field]}
                          </p>
                        )}
                        {formData[field.field] && !errors[field.field] && (
                          <FiCheck className="inline ml-1 sm:ml-2 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  {tabs[1].fields.map((fieldName) => {
                    const field = profileFields.find(
                      (f) => f.field === fieldName
                    )!;
                    if (field.field === "bio") {
                      return (
                        <div
                          key={field.field}
                          className="space-y-1 sm:space-y-2"
                        >
                          <label
                            htmlFor="bio"
                            className="flex items-center text-xs sm:text-sm font-medium text-gray-700"
                          >
                            Bio
                            <span className="ml-1 sm:ml-2 text-xs text-gray-500">
                              (Optional)
                            </span>
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            placeholder="Tell us about yourself"
                            value={(formData.bio as string) || ""}
                            onChange={(e) =>
                              handleInputChange("bio", e.target.value)
                            }
                            rows={4}
                            className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base ${
                              errors.bio
                                ? "border-red-500"
                                : "border-orange-200"
                            }`}
                          />
                          {errors.bio && (
                            <p className="text-xs text-red-500">{errors.bio}</p>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div key={field.field} className="space-y-1 sm:space-y-2">
                        <label
                          htmlFor={field.field}
                          className="flex items-center text-xs sm:text-sm font-medium text-gray-700"
                        >
                          {field.label}
                          <span className="ml-1 sm:ml-2 text-xs text-gray-500">
                            (Optional)
                          </span>
                        </label>
                        <input
                          id={field.field}
                          type={field.type || "text"}
                          name={field.field}
                          value={(formData[field.field] as string) || ""}
                          onChange={(e) =>
                            handleInputChange(field.field, e.target.value)
                          }
                          className={`w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base ${
                            errors[field.field]
                              ? "border-red-500"
                              : "border-orange-200"
                          }`}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                        {errors[field.field] && (
                          <p className="text-xs text-red-500">
                            {errors[field.field]}
                          </p>
                        )}
                        {formData[field.field] && !errors[field.field] && (
                          <FiCheck className="inline ml-1 sm:ml-2 text-green-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
                      Social Links
                      <span className="ml-1 sm:ml-2 text-xs text-gray-500">
                        (Optional)
                      </span>
                    </label>
                    <div className="p-3 sm:p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {(formData.socialLinks || []).map(
                          ({ label, url }, index) => (
                            <div
                              key={index}
                              className="flex items-center px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-blue-700 bg-blue-100 rounded-full shadow-sm hover:shadow-md transition-shadow"
                            >
                              <span className="font-medium">{label}:</span>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 underline hover:text-blue-900"
                              >
                                {url.length > 20
                                  ? `${url.substring(0, 17)}...`
                                  : url}
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedLinks = [
                                    ...(formData.socialLinks || []),
                                  ];
                                  updatedLinks.splice(index, 1);
                                  handleInputChange(
                                    "socialLinks",
                                    updatedLinks
                                  );
                                }}
                                className="ml-1 sm:ml-2 text-blue-700 hover:text-blue-900"
                              >
                                ×
                              </button>
                            </div>
                          )
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <input
                          type="text"
                          placeholder="Platform (e.g., LinkedIn, Twitter)"
                          value={newSocialLink.label}
                          onChange={(e) =>
                            setNewSocialLink((prev) => ({
                              ...prev,
                              label: e.target.value,
                            }))
                          }
                          className="p-2 sm:p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                        />
                        <input
                          type="text"
                          placeholder="Profile URL"
                          value={newSocialLink.url}
                          onChange={(e) =>
                            setNewSocialLink((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                          className="p-2 sm:p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                        />
                      </div>
                      {socialLinkError && (
                        <p className="text-xs text-red-500 mt-1 sm:mt-2">
                          {socialLinkError}
                        </p>
                      )}
                      <Button
                        type="button"
                        className="mt-3 sm:mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm sm:text-base"
                        onClick={handleAddSocialLink}
                      >
                        елару Add Social Link
                      </Button>
                    </div>
                    {errors.socialLinks && (
                      <p className="text-xs text-red-500 mt-1 sm:mt-2">
                        {errors.socialLinks}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
                      Interests
                      <span className="ml-1 sm:ml-2 text-xs text-gray-500">
                        (Optional)
                      </span>
                    </label>
                    <div className="p-3 sm:p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                        {(formData.interests || []).map((interest, index) => (
                          <div
                            key={index}
                            className="flex items-center px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-orange-700 bg-orange-100 rounded-full shadow-sm hover:shadow-md transition-shadow"
                          >
                            {interest}
                            <button
                              type="button"
                              onClick={() => removeInterest(index)}
                              className="ml-1 sm:ml-2 text-orange-700 hover:text-orange-900"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <input
                          type="text"
                          placeholder="Add an interest (e.g., Hiking, Coding)"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddInterest();
                            }
                          }}
                          className="flex-1 p-2 sm:p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                        />
                        <Button
                          type="button"
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm sm:text-base"
                          onClick={handleAddInterest}
                        >
                          Add
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="mt-3 sm:mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm sm:text-base"
                        onClick={updateInterests}
                      >
                        Save Interests
                      </Button>
                    </div>
                    {errors.interests && (
                      <p className="text-xs text-red-500 mt-1 sm:mt-2">
                        {errors.interests}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                className="text-orange-500 border-orange-500 hover:bg-orange-50 rounded-full text-sm sm:text-base"
                onClick={() => setShowCompletionForm(false)}
              >
                Cancel
              </Button>
              <div className="flex gap-2 sm:gap-3">
                {activeTab > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-orange-500 border-orange-500 hover:bg-orange-50 rounded-full text-sm sm:text-base"
                    onClick={() => setActiveTab(activeTab - 1)}
                  >
                    Previous
                  </Button>
                )}
                {activeTab < tabs.length - 1 && (
                  <Button
                    type="button"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm sm:text-base"
                    onClick={() => setActiveTab(activeTab + 1)}
                  >
                    Next
                  </Button>
                )}
                {activeTab === tabs.length - 1 && (
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm sm:text-base"
                    disabled={Object.keys(errors).some((key) =>
                      mandatoryFields.includes(key)
                    )}
                  >
                    Save Profile
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>
    );
  }
);

export default ProfileFormModal;
