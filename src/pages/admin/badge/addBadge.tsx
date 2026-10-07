import React, { useState } from "react";
import { Formik, Field, ErrorMessage, FormikHelpers, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uploadFile } from "@/redux/fileUploadSlice";
import { createBadge } from "@/api/badge/badge";
import { AppDispatch } from "@/redux/store";
import { Upload } from "lucide-react";

const validationSchema = Yup.object({
  name: Yup.string().required("Badge name is required"),
  description: Yup.string().optional(),
  criteria: Yup.object({
    action: Yup.string().required("Action is required"),
    field: Yup.string().required("Field is required"),
    operator: Yup.string().required("Operator is required"),
    value: Yup.number()
      .min(1, "Value must be at least 1")
      .required("Value is required"),
  }),
  animation: Yup.string().optional(),
  image: Yup.string().required("Badge image is required"),
  xp: Yup.number()
    .min(5, "XP must be at least 5")
    .required("XP reward is required"),
});

interface FormValues {
  name: string;
  description: string;
  criteria: {
    action: string;
    field: "count" | "days" | "pages";
    operator: ">=" | "<=" | ">" | "<" | "==";
    value: number;
  };
  animation: string;
  image: string;
  xp: number;
}

const ACTION_OPTIONS = [
  { value: "", label: "Select Action" },
  { value: "books_read", label: "Books Read" },
  { value: "login_streak", label: "Login Streak" },
  { value: "pages_read", label: "Pages Read" },
  { value: "quiz_completed", label: "Quiz Completed" },
  { value: "course_completed", label: "Course Completed" },
  { value: "comments_posted", label: "Comments Posted" },
  { value: "time_spent", label: "Time Spent (minutes)" },
];

const ALL_FIELD_OPTIONS = [
  { value: "count", label: "Count" },
  { value: "days", label: "Days" },
  { value: "pages", label: "Pages" },
];

const OPERATOR_OPTIONS = [
  { value: ">=", label: "Greater than or Equal to" },
  { value: ">", label: "Greater than" },
  { value: "<=", label: "Less than or Equal to" },
  { value: "<", label: "Less than" },
  { value: "==", label: "Equal to" },
];

const ACTION_CONFIG = {
  books_read: {
    fields: [{ value: "count", label: "Count" }] as const,
    operators: OPERATOR_OPTIONS,
    defaultField: "count" as const,
    defaultOperator: ">=" as const,
    valuePlaceholder: "e.g. 5",
    valueLabel: "Number of books",
  },
  login_streak: {
    fields: [{ value: "days", label: "Days" }] as const,
    operators: [
      { value: ">=", label: "Greater than or Equal to" },
      { value: ">", label: "Greater than" },
      { value: "==", label: "Equal to" },
    ],
    defaultField: "days" as const,
    defaultOperator: ">=" as const,
    valuePlaceholder: "e.g. 7",
    valueLabel: "Number of consecutive days",
  },
  pages_read: {
    fields: [{ value: "pages", label: "Pages" }] as const,
    operators: OPERATOR_OPTIONS,
    defaultField: "pages" as const,
    defaultOperator: ">=" as const,
    valuePlaceholder: "e.g. 100",
    valueLabel: "Number of pages",
  },
  quiz_completed: {
    fields: [{ value: "count", label: "Count" }] as const,
    operators: OPERATOR_OPTIONS,
    defaultField: "count" as const,
    defaultOperator: ">=" as const,
    valuePlaceholder: "e.g. 10",
    valueLabel: "Number of quizzes",
  },
  course_completed: {
    fields: [{ value: "count", label: "Count" }] as const,
    operators: OPERATOR_OPTIONS,
    defaultField: "count" as const,
    defaultOperator: ">=" as const,
    valuePlaceholder: "e.g. 3",
    valueLabel: "Number of courses",
  },
  comments_posted: {
    fields: [{ value: "count", label: "Count" }] as const,
    operators: OPERATOR_OPTIONS,
    defaultField: "count" as const,
    defaultOperator: ">=" as const,
    valuePlaceholder: "e.g. 20",
    valueLabel: "Number of comments",
  },
  time_spent: {
    fields: [{ value: "count", label: "Minutes" }] as const,
    operators: OPERATOR_OPTIONS,
    defaultField: "count" as const,
    defaultOperator: ">=" as const,
    valuePlaceholder: "e.g. 60",
    valueLabel: "Total minutes spent",
  },
} satisfies Record<
  string,
  {
    fields: readonly { value: string; label: string }[];
    operators: { value: string; label: string }[];
    defaultField: "count" | "days" | "pages";
    defaultOperator: ">=" | "<=" | ">" | "<" | "==";
    valuePlaceholder: string;
    valueLabel: string;
  }
>;

const AddNewBadge: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [jsonFileName, setJsonFileName] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingJson, setIsUploadingJson] = useState(false);

  const initialValues: FormValues = {
    name: "",
    description: "",
    criteria: {
      action: "",
      field: "count",
      operator: ">=",
      value: 1,
    },
    animation: "",
    image: "",
    xp: 10,
  };

  const getConfig = (action: string) =>
    ACTION_CONFIG[action as keyof typeof ACTION_CONFIG] ?? {
      fields: ALL_FIELD_OPTIONS,
      operators: OPERATOR_OPTIONS,
      defaultField: "count" as const,
      defaultOperator: ">=" as const,
      valuePlaceholder: "e.g. 10",
      valueLabel: "Value",
    };

  const getFieldLabel = (field: string, action: string): string => {
    if (action === "time_spent") return "minutes";
    switch (field) {
      case "count":
        return "times / items";
      case "days":
        return "days";
      case "pages":
        return "pages";
      default:
        return "units";
    }
  };

  const getActionVerb = (action: string): string => {
    switch (action) {
      case "books_read":
        return "Read";
      case "pages_read":
        return "Read";
      case "login_streak":
        return "Log in for";
      case "quiz_completed":
        return "Complete";
      case "course_completed":
        return "Complete";
      case "comments_posted":
        return "Post";
      case "time_spent":
        return "Spend";
      default:
        return "Complete";
    }
  };

  const getActionNoun = (action: string): string => {
    switch (action) {
      case "books_read":
        return "book(s)";
      case "pages_read":
        return "page(s)";
      case "login_streak":
        return "consecutive day(s)";
      case "quiz_completed":
        return "quiz(zes)";
      case "course_completed":
        return "course(s)";
      case "comments_posted":
        return "comment(s)";
      case "time_spent":
        return "minute(s)";
      default:
        return "item(s)";
    }
  };

  const getOperatorText = (operator: string): string => {
    if (operator === ">=" || operator === ">") return "or more";
    if (operator === "<=" || operator === "<") return "or less";
    return "exactly";
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsUploadingImage(true);

    try {
      const result = await dispatch(uploadFile({ file, getToken }));
      if (uploadFile.fulfilled.match(result)) {
        const url = result.payload.data.fileDetails?.url;
        if (url) {
          setUploadedImageUrl(url);
          setFieldValue("image", url);
          toast.success("Image uploaded successfully");
        }
      } else {
        toast.error("Image upload failed");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleJsonUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string) => void,
  ) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      toast.error("Only .json files are allowed for animation");
      return;
    }

    setJsonFileName(file.name);
    setIsUploadingJson(true);

    try {
      const result = await dispatch(uploadFile({ file, getToken }));
      if (uploadFile.fulfilled.match(result)) {
        const url = result.payload.data.fileDetails?.url;
        if (url) {
          setFieldValue("animation", url);
          toast.success("Animation JSON uploaded successfully");
        }
      } else {
        toast.error("Animation upload failed");
        setJsonFileName("");
      }
    } catch {
      toast.error("Animation upload failed");
      setJsonFileName("");
    } finally {
      setIsUploadingJson(false);
    }
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        return toast.error("Please login to continue");
      }

      const result = await createBadge({
        data: {
          name: values.name,
          description: values.description || undefined,
          criteria: values.criteria,
          animation: values.animation || undefined,
          image: uploadedImageUrl || values.image,
          xp: values.xp,
        },
        token,
      });

      if (result.success) {
        toast.success("🎉 Badge created successfully!");
        setTimeout(() => navigate("/admin/badge"), 1200);
      } else {
        toast.error(result.error || "Failed to create badge");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Create New Badge
            </h2>
            <p className="text-gray-500 mt-2">
              Design a new achievement for your users
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => {
              const config = getConfig(values.criteria.action);

              return (
                <Form className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Badge Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Badge Name *
                        </label>
                        <Field
                          name="name"
                          type="text"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                          placeholder="e.g. Reading Champion"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                          placeholder="What does this badge represent?"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Unlock Criteria
                    </h3>

                    <p className="text-gray-600 text-sm mb-6">
                      Define the condition a user must complete to earn this
                      badge.
                    </p>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What should the user do? *
                        </label>
                        <Field
                          as="select"
                          name="criteria.action"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            const newAction = e.target.value;
                            const newConfig = ACTION_CONFIG[
                              newAction as keyof typeof ACTION_CONFIG
                            ] ?? {
                              defaultField: "count" as const,
                              defaultOperator: ">=" as const,
                            };
                            setFieldValue("criteria.action", newAction);
                            setFieldValue(
                              "criteria.field",
                              newConfig.defaultField,
                            );
                            setFieldValue(
                              "criteria.operator",
                              newConfig.defaultOperator,
                            );
                            setFieldValue("criteria.value", 1);
                          }}
                        >
                          {ACTION_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="criteria.action"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>

                      {values.criteria.action && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Condition to unlock the badge *
                          </label>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Measure by
                              </p>
                              <Field
                                as="select"
                                name="criteria.field"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                disabled={config.fields.length === 1}
                              >
                                {config.fields.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </Field>
                            </div>

                            <div className="md:col-span-4">
                              <p className="text-xs text-gray-500 mb-1">
                                Condition
                              </p>
                              <Field
                                as="select"
                                name="criteria.operator"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                              >
                                {config.operators.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </Field>
                            </div>

                            <div className="md:col-span-5">
                              <p className="text-xs text-gray-500 mb-1">
                                {config.valueLabel} *
                              </p>
                              <Field
                                name="criteria.value"
                                type="number"
                                min="1"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                placeholder={config.valuePlaceholder}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                The total number of{" "}
                                <strong>
                                  {getFieldLabel(
                                    values.criteria.field,
                                    values.criteria.action,
                                  )}
                                </strong>{" "}
                                required
                              </p>
                            </div>
                          </div>

                          <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                            <p className="text-amber-800 text-sm font-medium mb-2">
                              This badge will be awarded when the user:
                            </p>
                            <p className="text-2xl font-bold text-gray-900 leading-tight">
                              {getActionVerb(values.criteria.action)}{" "}
                              <span className="text-amber-600">
                                {values.criteria.value}
                              </span>{" "}
                              {getActionNoun(values.criteria.action)}{" "}
                              {getOperatorText(values.criteria.operator)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      XP Reward *
                    </label>
                    <Field
                      name="xp"
                      type="number"
                      min="5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <ErrorMessage
                      name="xp"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Animation (JSON File)
                    </h3>
                    <label
                      className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-xl p-8 transition-all min-h-[200px] ${
                        isUploadingJson
                          ? "border-amber-400 bg-amber-50"
                          : jsonFileName
                            ? "border-green-300 bg-green-50 hover:border-green-400"
                            : "border-gray-300 hover:border-amber-400 hover:bg-amber-50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => handleJsonUpload(e, setFieldValue)}
                        disabled={isUploadingJson}
                      />

                      {isUploadingJson ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full"></div>
                          <p className="font-medium text-amber-600">
                            Uploading Animation...
                          </p>
                          <p className="text-xs text-gray-500">
                            Please wait, do not close this page
                          </p>
                        </div>
                      ) : jsonFileName ? (
                        <div className="flex flex-col items-center gap-3 text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-9 h-9 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <p className="font-semibold text-green-700 text-lg">
                            Animation Uploaded Successfully
                          </p>
                          <p className="text-sm text-gray-600 mt-1 font-medium break-all px-6">
                            {jsonFileName}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload size={40} className="text-amber-500" />
                          <p className="font-medium text-gray-700 text-center">
                            Click to upload Animation JSON
                          </p>
                          <p className="text-xs text-gray-400">
                            .json file only (Lottie animation supported)
                          </p>
                        </>
                      )}
                    </label>
                    {jsonFileName && !isUploadingJson && (
                      <p className="mt-3 text-green-600 text-sm flex items-center gap-1">
                        ✓ File ready for use
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Badge Image
                    </h3>
                    <label
                      className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-xl p-8 transition-all relative ${
                        isUploadingImage
                          ? "border-amber-300 bg-amber-50"
                          : "border-gray-300 hover:border-amber-400 hover:bg-amber-50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, setFieldValue)}
                      />

                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-500"
                        />
                      ) : (
                        <Upload size={40} className="text-amber-500" />
                      )}

                      <p className="text-sm font-medium text-gray-700">
                        {isUploadingImage
                          ? "Uploading image..."
                          : imagePreview
                            ? "Image Selected - Ready to Upload"
                            : "Click to upload badge image"}
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG or WEBP • Max 5MB
                      </p>
                    </label>
                    <ErrorMessage
                      name="image"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || isUploadingImage || isUploadingJson
                    }
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isUploadingImage || isUploadingJson
                      ? "Uploading Files..."
                      : isSubmitting
                        ? "Creating Badge..."
                        : "Create Badge"}
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddNewBadge;
