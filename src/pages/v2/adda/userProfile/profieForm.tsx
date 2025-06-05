import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FiCheck } from "react-icons/fi";
import { memo, useState, useMemo, useCallback } from "react";
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
}

const profileFields: ProfileField[] = [
  { field: "name", label: "Name", required: true, type: "text" },
  { field: "email", label: "Email", required: true, type: "email" },
  { field: "phoneNumber", label: "Phone Number", type: "tel" },
  { field: "location", label: "Location", type: "text" },
  { field: "dateOfBirth", label: "Date of Birth", type: "date" },
  { field: "gender", label: "Gender", type: "select" },
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

const ProfileForm = memo(
  ({
    userDetails,
    setUserDetails,
    setShowCompletionForm,
    handleProfileSubmit,
    removeInterest,
    updateInterests,
  }: ProfileFormProps) => {
    const [formData, setFormData] = useState<UserDetails>(userDetails);
    const [newSocialLink, setNewSocialLink] = useState({ label: "", url: "" });
    const [newInterest, setNewInterest] = useState("");
    const [errors, setErrors] = useState<
      Partial<Record<keyof UserDetails, string>>
    >({});
    const [socialLinkError, setSocialLinkError] = useState("");

    const validateField = useCallback(
      (field: ProfileField, value: any): string | null => {
        if (field.required && (!value || String(value).trim() === "")) {
          return `${field.label} is required`;
        }
        if (
          field.field === "bio" &&
          field.minLength &&
          (value?.length || 0) < field.minLength
        ) {
          return `${field.label} must be at least ${field.minLength} characters`;
        }
        if (
          field.field === "interests" &&
          field.minLength &&
          (value?.length || 0) < field.minLength
        ) {
          return `Please add at least ${field.minLength} interests`;
        }
        if (
          field.field === "socialLinks" &&
          field.minLength &&
          (value?.length || 0) < field.minLength
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
        return null;
      },
      []
    );

    const validateSocialLink = useCallback((url: string): string | null => {
      try {
        new URL(url);
        return null;
      } catch {
        return "Invalid URL format";
      }
    }, []);

    const profileCompletionPercentage = useMemo(() => {
      const completedFields = profileFields.reduce((acc, field) => {
        const value = formData[field.field];
        if (field.field === "interests") {
          return (
            acc +
            ((value as string[])?.length >= (field.minLength || 1) ? 1 : 0)
          );
        }
        if (field.field === "socialLinks") {
          return (
            acc +
            ((value as Array<{ label: string; url: string }>)?.length >=
            (field.minLength || 1)
              ? 1
              : 0)
          );
        }
        if (field.field === "bio") {
          return (
            acc + ((value as string)?.length >= (field.minLength || 1) ? 1 : 0)
          );
        }
        return acc + (value && String(value).trim() !== "" ? 1 : 0);
      }, 0);
      return Math.round((completedFields / profileFields.length) * 100);
    }, [formData]);

    const handleInputChange = (field: keyof UserDetails, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(
          profileFields.find((f) => f.field === field)!,
          value
        ),
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
      setFormData((prev) => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), newSocialLink],
      }));
      setUserDetails((prev) => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), newSocialLink],
      }));
      setNewSocialLink({ label: "", url: "" });
      setSocialLinkError("");
    };

    const handleAddInterest = () => {
      if (!newInterest.trim()) return;
      setFormData((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()],
      }));
      setUserDetails((prev) => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest.trim()],
      }));
      setNewInterest("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const newErrors: Partial<Record<keyof UserDetails, string>> = {};
      profileFields.forEach((field) => {
        const error = validateField(field, formData[field.field]);
        if (error) newErrors[field.field] = error;
      });
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        await handleProfileSubmit(e);
      }
    };

    return (
      <Card className="p-6 border border-orange-200 shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {profileCompletionPercentage}%
            </span>
          </div>
        </div>
        <form id="profile-edit-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {profileFields.map(
              (field) =>
                field.field !== "interests" &&
                field.field !== "socialLinks" &&
                field.field !== "bio" && (
                  <div key={field.field} className="space-y-2">
                    <label
                      htmlFor={field.field}
                      className="flex items-center text-sm font-medium text-gray-700"
                    >
                      {field.label}
                      {field.required && !formData[field.field] && (
                        <span className="ml-2 text-xs text-red-500">
                          (Required)
                        </span>
                      )}
                    </label>
                    {field.type === "select" ? (
                      <select
                        id={field.field}
                        name={field.field}
                        value={formData[field.field] || ""}
                        onChange={(e) =>
                          handleInputChange(field.field, e.target.value)
                        }
                        className="w-full p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        value={String(formData[field.field] || "")}
                        onChange={(e) =>
                          handleInputChange(field.field, e.target.value)
                        }
                        readOnly={field.field === "email"}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
                      <FiCheck className="inline ml-2 text-green-500" />
                    )}
                  </div>
                )
            )}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="bio"
                className="flex items-center text-sm font-medium text-gray-700"
              >
                Bio
                {!formData.bio && (
                  <span className="ml-2 text-xs text-red-500">(Missing)</span>
                )}
              </label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.bio ? "border-red-500" : "border-orange-200"
                }`}
              />
              {errors.bio && (
                <p className="text-xs text-red-500">{errors.bio}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Social Links
                {(!formData.socialLinks ||
                  formData.socialLinks.length === 0) && (
                  <span className="ml-2 text-xs text-red-500">(Missing)</span>
                )}
              </label>
              <div className="p-3 border border-orange-200 rounded-md">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.socialLinks?.map(({ label, url }, index) => (
                    <span
                      key={index}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full"
                    >
                      <strong>{label}:</strong> {url.substring(0, 20)}
                      {url.length > 20 ? "..." : ""}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedLinks = [
                            ...(formData.socialLinks || []),
                          ];
                          updatedLinks.splice(index, 1);
                          handleInputChange("socialLinks", updatedLinks);
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Platform (e.g., Facebook, Instagram)"
                    value={newSocialLink.label}
                    onChange={(e) =>
                      setNewSocialLink((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    className="p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                {socialLinkError && (
                  <p className="text-xs text-red-500 mt-2">{socialLinkError}</p>
                )}
                <Button
                  type="button"
                  className="mt-3 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleAddSocialLink}
                >
                  Add Link
                </Button>
              </div>
              {errors.socialLinks && (
                <p className="text-xs text-red-500">{errors.socialLinks}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                Interests
                {formData.interests && formData.interests.length < 3 && (
                  <span className="ml-2 text-xs text-red-500">
                    (Add at least 3)
                  </span>
                )}
              </label>
              <div className="p-3 border border-orange-200 rounded-md">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.interests?.map((interest, index) => (
                    <span
                      key={index}
                      className="flex items-center px-3 py-1 text-sm text-orange-600 bg-orange-100 rounded-full"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add an interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest();
                      }
                    }}
                    className="flex-1 p-3 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Button
                    type="button"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleAddInterest}
                  >
                    Add
                  </Button>
                </div>
                <Button
                  type="button"
                  className="mt-3 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={updateInterests}
                >
                  Save Interests
                </Button>
              </div>
              {errors.interests && (
                <p className="text-xs text-red-500">{errors.interests}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="text-orange-500 border-orange-500 hover:bg-orange-50"
              onClick={() => setShowCompletionForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={Object.keys(errors).length > 0}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    );
  }
);

export default ProfileForm;
