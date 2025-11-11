import { useAuth } from "@clerk/clerk-react";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
} from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Loader from "@/components/common/admin/loader";
import LoadingModal from "@/components/common/loginModal";
import {
  createJob,
  getJobById,
  updateJob,
} from "../../../redux/admin/job/jobSlice";
import { JobData } from "@/types/admin";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { AppDispatch, RootState } from "../../../redux/store";
import axios from "axios";

interface JobFormValues {
  jobTitle: string;
  jobDescription: string;
  skillsRequired: string[];
  responsibilities: string[];
  requirements: string[];
  whatWeOffer: string[];
  thumbnail: File | string | null;
  location: string;
  jobType: string;
  status?: string;
  applicationCount?: number;
}

interface ApiError {
  data?: { message?: string };
  message?: string;
}

const JOB_TYPES = [
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];

const CreateJob: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const {
    job: jobData,
    loading: isLoadingJob,
    error,
  } = useSelector((state: RootState) => state.careerAdmin);
  const jobId = location.state?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [indianStates, setIndianStates] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const loadingSteps = [
    "Analyzing submission data",
    "Uploading image",
    "Saving job information",
    "Finalizing Process",
  ];

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/admin/location/states`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const stateNames = response.data.states
          .map((s: { state_name: string }) => s.state_name)
          .sort();
        setIndianStates(stateNames);
      } catch {
        setIndianStates([
          "Andhra Pradesh",
          "Arunachal Pradesh",
          "Assam",
          "Bihar",
          "Chhattisgarh",
          "Goa",
          "Gujarat",
          "Haryana",
          "Himachal Pradesh",
          "Jharkhand",
          "Karnataka",
          "Kerala",
          "Madhya Pradesh",
          "Maharashtra",
          "Manipur",
          "Meghalaya",
          "Mizoram",
          "Nagaland",
          "Odisha",
          "Punjab",
          "Rajasthan",
          "Sikkim",
          "Tamil Nadu",
          "Telangana",
          "Tripura",
          "Uttar Pradesh",
          "Uttarakhand",
          "West Bengal",
          "Andaman and Nicobar Islands",
          "Chandigarh",
          "Dadra and Nagar Haveli and Daman and Diu",
          "Delhi",
          "Jammu and Kashmir",
          "Ladakh",
          "Lakshadweep",
          "Puducherry",
        ]);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, [getToken]);

  useEffect(() => {
    if (jobId) dispatch(getJobById(jobId));
  }, [dispatch, jobId]);

  const uploadFile = async (file: File): Promise<string> => {
    setCurrentLoadingStep(1);
    const token = await getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await axios.post(
      `${import.meta.env.VITE_PROD_URL}/upload/file`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data.data.fileDetails.url;
  };

  const handleFormSubmit = async (
    values: JobFormValues,
    { setSubmitting }: FormikHelpers<JobFormValues>
  ) => {
    setIsSubmitting(true);
    setIsLoadingModalOpen(true);
    setCurrentLoadingStep(0);
    try {
      let thumbnailUrl: string | null = null;
      if (values.thumbnail instanceof File) {
        thumbnailUrl = await uploadFile(values.thumbnail);
      } else if (typeof values.thumbnail === "string") {
        thumbnailUrl = values.thumbnail;
        setCurrentLoadingStep(1);
      }
      setCurrentLoadingStep(2);
      const payload = { ...values, thumbnail: thumbnailUrl } as JobData;
      if (jobId) {
        const r = await dispatch(
          updateJob({ ...payload, _id: jobId })
        ).unwrap();
        successToast(r.data.message || "Job updated");
      } else {
        const r = await dispatch(createJob(payload)).unwrap();
        successToast(r.data.message || "Job created");
      }
      setCurrentLoadingStep(3);
      setTimeout(() => navigate("/admin/all-jobs"), 2000);
    } catch (e: unknown) {
      const err = e as ApiError;
      errorToast(err?.data?.message || err?.message || "Failed to save job");
      setIsLoadingModalOpen(false);
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob && jobId) return <Loader />;
  if (error && jobId) return <div>Error: {error}</div>;

  const job = jobData?.data;
  const initialValues: JobFormValues = {
    jobTitle: job?.jobTitle || "",
    jobDescription: job?.jobDescription || "",
    skillsRequired: Array.isArray(job?.skillsRequired)
      ? job.skillsRequired
      : [],
    responsibilities: Array.isArray(job?.responsibilities)
      ? job.responsibilities
      : [],
    requirements: Array.isArray(job?.requirements) ? job.requirements : [],
    whatWeOffer: Array.isArray(job?.whatWeOffer) ? job.whatWeOffer : [],
    thumbnail: job?.thumbnail || null,
    location: job?.location || "",
    jobType: job?.jobType || "",
    status: job?.status || "open",
    applicationCount: job?.applicationCount || 0,
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.string().required("Job title is required"),
    jobDescription: Yup.string().required("Job description is required"),
    skillsRequired: Yup.array()
      .of(Yup.string())
      .min(1, "At least one skill required"),
    responsibilities: Yup.array().of(Yup.string()),
    requirements: Yup.array().of(Yup.string()),
    whatWeOffer: Yup.array().of(Yup.string()),
    thumbnail: Yup.mixed().required("Thumbnail is required"),
    location: Yup.string().required("Location is required"),
    jobType: Yup.string().required("Job type is required"),
  });

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        {jobId ? "Edit Job" : "Create Job"}
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid, dirty, errors, touched }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="jobTitle"
                label="Job Title"
                placeholder="e.g., Senior Software Engineer"
              />
              <div className="space-y-2">
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Type <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  id="jobType"
                  name="jobType"
                  className={`w-full p-3 border ${
                    errors.jobType && touched.jobType
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select Job Type</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="jobType"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <label
                    htmlFor="location"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  {isLoadingStates ? (
                    <div className="w-full p-3 text-gray-500 border border-gray-300 rounded-md bg-gray-50">
                      Loading states...
                    </div>
                  ) : (
                    <Field
                      as="select"
                      id="location"
                      name="location"
                      className={`w-full p-3 border ${
                        errors.location && touched.location
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value="Remote">Remote</option>
                      <option value="Multiple Locations">
                        Multiple Locations
                      </option>
                      <option value="Other">Other</option>
                    </Field>
                  )}
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                <div className="relative w-1/2">
                  <label
                    htmlFor="status"
                    className="block mb-1 font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <Field
                    as="select"
                    id="status"
                    name="status"
                    className={`w-full p-3 border ${
                      errors.status && touched.status
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10`}
                  >
                    <option value="">Select Status</option>
                    <option value="open">Open</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </Field>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <ErrorMessage
                  name="location"
                  component="div"
                  className="w-1/2 text-sm text-red-500"
                />
                <ErrorMessage
                  name="status"
                  component="div"
                  className="w-1/2 text-sm text-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="jobDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                rows={6}
                id="jobDescription"
                name="jobDescription"
                placeholder="Provide a detailed description..."
                className={`w-full p-3 border ${
                  errors.jobDescription && touched.jobDescription
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="jobDescription"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            {[
              {
                key: "skillsRequired",
                title: "Skills Required",
                required: true,
              },
              { key: "responsibilities", title: "Responsibilities" },
              { key: "requirements", title: "Requirements" },
              { key: "whatWeOffer", title: "What We Offer" },
            ].map(({ key, title, required }) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {title} {required && <span className="text-red-500">*</span>}
                </label>
                <FieldArray name={key}>
                  {({ push, remove }) => (
                    <div>
                      {(values[key as keyof JobFormValues] as string[]).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="flex items-center mb-2 space-x-2"
                          >
                            <Field
                              name={`${key}.${i}`}
                              className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`e.g., ${
                                key === "skillsRequired"
                                  ? "JavaScript"
                                  : key === "responsibilities"
                                  ? "Develop apps"
                                  : key === "requirements"
                                  ? "Bachelor's degree"
                                  : "Competitive salary"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => remove(i)}
                              className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => push("")}
                        className="p-2 mt-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                      >
                        Add {title.split(" ")[0]}
                      </button>
                    </div>
                  )}
                </FieldArray>
                {required && (
                  <ErrorMessage
                    name={key}
                    component="div"
                    className="text-sm text-red-500"
                  />
                )}
              </div>
            ))}

            <div className="space-y-2">
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium text-gray-700"
              >
                Thumbnail (Image) <span className="text-red-500">*</span>
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFieldValue("thumbnail", e.currentTarget.files?.[0] ?? null)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {typeof values.thumbnail === "string" && values.thumbnail && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                  <img
                    src={values.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full max-w-xs h-48 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
              <ErrorMessage
                name="thumbnail"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty}
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3 animate-spin"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {jobId ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <>{jobId ? "Update Job" : "Create Job"}</>
              )}
            </button>
          </Form>
        )}
      </Formik>

      <LoadingModal
        currentStep={currentLoadingStep}
        isOpen={isLoadingModalOpen}
        onClose={() => setIsLoadingModalOpen(false)}
        steps={loadingSteps}
        title={jobId ? "Updating Job" : "Creating New Job"}
      />
    </div>
  );
};

const FormField: React.FC<{
  name: string;
  label: string;
  placeholder?: string;
}> = ({ name, label, placeholder }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <Field
      id={name}
      name={name}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-sm text-red-500"
    />
  </div>
);

export default CreateJob;
