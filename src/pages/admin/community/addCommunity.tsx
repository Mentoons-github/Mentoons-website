import React, { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { uploadFile } from "@/redux/fileUploadSlice";
import {
  createCommunity,
  editCommunity,
  getCommunityById,
} from "@/api/groups/community";

const validationSchema = Yup.object({
  name: Yup.string().required("Group name is required"),
  details: Yup.object({
    subTitle: Yup.string().required("Subtitle is required"),
    description: Yup.string().required("Description is required"),
  }),
  category: Yup.string()
    .oneOf([
      "technology",
      "sports",
      "arts&culture",
      "education",
      "business",
      "health&wellness",
    ])
    .required("Category is required"),
  visibility: Yup.string()
    .oneOf(["public", "private"])
    .required("Visibility is required"),
  profileImage: Yup.string().required("Profile image is required"),
});

interface FormValues {
  name: string;
  details: {
    subTitle: string;
    description: string;
  };
  category: string;
  visibility: "public" | "private";
  profileImage: string;
}

const categoryOptions = [
  { value: "", label: "Select a category" },
  { value: "technology", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "arts&culture", label: "Arts & Culture" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business" },
  { value: "health&wellness", label: "Health & Wellness" },
];

const CreateGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const isEdit = !!id;
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [initialValues, setInitialValues] = useState<FormValues>({
    name: "",
    details: { subTitle: "", description: "" },
    category: "",
    visibility: "public",
    profileImage: "",
  });

  useEffect(() => {
    if (!isEdit) return;

    const fetchGroup = async () => {
      setIsFetching(true);
      try {
        const token = await getToken();
        if (!token) return;

        const response = await getCommunityById({ id, token });

        if (!response.success) {
          toast.error("Failed to load group data");
          navigate("/admin/community");
          return;
        }

        const group = response.data.data;

        setInitialValues({
          name: group.name || "",
          details: {
            subTitle: group.details?.subTitle || "",
            description: group.details?.description || "",
          },
          category: group.category || "",
          visibility: group.visibility || "public",
          profileImage: group.profileImage || "",
        });

        if (group.profileImage) {
          setImagePreview(group.profileImage);
          setUploadedUrl(group.profileImage);
        }
      } catch {
        toast.error("Failed to load group data");
        navigate("/admin/community");
      } finally {
        setIsFetching(false);
      }
    };

    fetchGroup();
  }, [id, isEdit]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    const selectedFile = e.currentTarget.files?.[0];
    if (!selectedFile) return;

    setImagePreview(URL.createObjectURL(selectedFile));
    setIsUploading(true);

    try {
      const resultAction = await dispatch(
        uploadFile({ file: selectedFile, getToken }),
      );

      if (uploadFile.fulfilled.match(resultAction)) {
        const uploadedUrl = resultAction.payload.data.fileDetails?.url;
        setUploadedUrl(uploadedUrl);
        setFieldValue("profileImage", uploadedUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");
        setImagePreview(null);
        setFieldValue("profileImage", "");
      }
    } catch {
      toast.error("Image upload failed");
      setImagePreview(null);
      setFieldValue("profileImage", "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please Login");
        return;
      }

      const data = {
        groupName: values.name,
        subTitle: values.details.subTitle,
        description: values.details.description,
        parentGroup: values.category,
        privacy: values.visibility as "public" | "private",
        image: uploadedUrl,
      };

      if (isEdit) {
        const response = await editCommunity({ id, data, token });
        if (!response.success) {
          toast.error("Couldn't update Community. Please try again");
          return;
        }
        toast.success(response.data?.message || "Group updated!");
      } else {
        const response = await createCommunity({ data, token });

        if (!response.success) {
          toast.error("Couldn't create Community. Please try again");
          return;
        }

        toast.success(response.data?.message || "Group created!");
      }

      navigate("/admin/community");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        `Failed to ${isEdit ? "update" : "create"} group`;
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-10 h-10 text-blue-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="text-gray-500 text-sm">Loading group data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isEdit ? "Edit group" : "Create group"}
            </h2>
            <p className="text-gray-500 mt-2">
              {isEdit
                ? "Update the group details below"
                : "Fill in the group details below"}
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Group information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group name *
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g. Engineering Team"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle *
                      </label>
                      <Field
                        name="details.subTitle"
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="A short tagline"
                      />
                      <ErrorMessage
                        name="details.subTitle"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <Field
                        as="textarea"
                        name="details.description"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        placeholder="What is this group about?"
                      />
                      <ErrorMessage
                        name="details.description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <Field
                        as="select"
                        name="category"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                      >
                        {categoryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibility *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["public", "private"] as const).map((option) => (
                          <label
                            key={option}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                              values.visibility === option
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            }`}
                          >
                            <Field
                              type="radio"
                              name="visibility"
                              value={option}
                              className="hidden"
                            />
                            <span className="text-lg">
                              {option === "public" ? "🌐" : "🔒"}
                            </span>
                            <div>
                              <p className="text-sm font-medium capitalize">
                                {option}
                              </p>
                              <p className="text-xs text-gray-400">
                                {option === "public"
                                  ? "Anyone can join"
                                  : "Invite only"}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="visibility"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Profile image
                  </h3>

                  <label
                    className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-xl p-8 transition-all relative ${
                      isUploading
                        ? "border-blue-300 bg-blue-50 cursor-wait"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-wait"
                      onChange={(e) => handleImageUpload(e, setFieldValue)}
                    />

                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-4 border-blue-500"
                        />
                        {isUploading && (
                          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </div>
                    )}

                    <p className="text-sm font-medium text-gray-700">
                      {isUploading
                        ? "Uploading..."
                        : imagePreview
                          ? uploadedUrl
                            ? "Image ready ✓"
                            : "Upload failed — click to retry"
                          : "Click to upload image"}
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
                  </label>

                  <ErrorMessage
                    name="profileImage"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                  >
                    {isUploading
                      ? "Uploading image..."
                      : isSubmitting
                        ? isEdit
                          ? "Updating group..."
                          : "Creating group..."
                        : isEdit
                          ? "Update group"
                          : "Create group"}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
