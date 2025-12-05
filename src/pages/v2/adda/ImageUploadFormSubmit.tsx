import { Form, Field, ErrorMessage, Formik, FormikHelpers } from "formik";
import {
  uploadInitialValues,
  validationSchema,
  ContestUpload,
} from "@/utils/formik/contest/imageUpload";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { useSubmissionModal } from "@/context/adda/commonModalContext";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { compressedImageFile } from "@/services/imageCommpresser";
import ProgressModal from "@/components/common/modal/progressModal";

const ImageUploadFormSubmit = () => {
  const { showStatus } = useStatusModal();
  const { showModal } = useSubmissionModal();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const Category = [
    "social media logos",
    "accessories",
    "daily stationary items",
    "gadgets",
    "musicians",
    "animated movie characters",
  ];

  const [progressModal, setProgressModal] = useState({
    isOpen: false,
    type: "compress" as "compress" | "upload" | "submit" | "progress",
    message: "",
    progress: { current: 0, total: 0 },
  });

  const passKey = searchParams.get("PASS_KEY");
  const QR_PASSKEY = import.meta.env.VITE_QR_PASSKEY;

  const closeProgressModal = () => {
    setProgressModal({
      isOpen: false,
      type: "compress",
      message: "",
      progress: { current: 0, total: 0 },
    });
  };

  useEffect(() => {
    if (passKey !== QR_PASSKEY) {
      showModal({
        currentStep: "error",
        message: "Access denied. You cannot submit without a valid QR code.",
        error: "Please scan the correct QR code to access this page",
        isSubmitting: false,
      });
      navigate("/adda");
    }
  }, [passKey, QR_PASSKEY, showModal, navigate]);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadFiles = files.map((file) =>
      dispatch(uploadFile({ file, contestUpload: true }))
    );
    const results = await Promise.all(uploadFiles);
    const urls = results
      .filter((res) => uploadFile.fulfilled.match(res))
      .map((res) => res.payload.data.fileDetails?.url)
      .filter(Boolean);
    return urls as string[];
  };

  const handleFileSelection = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!e.target.files) return;

    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    const files = Array.from(e.target.files);

    setProgressModal({
      isOpen: true,
      type: "progress",
      message: "Compressing your images for optimal upload...",
      progress: { current: 0, total: files.length },
    });

    const compressedFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const compressed = await compressedImageFile(files[i]);
      compressedFiles.push(compressed);
      setProgressModal((prev) => ({
        ...prev,
        progress: { current: i + 1, total: files.length },
      }));
    }

    closeProgressModal();

    setSelectedFiles(compressedFiles);
    const urls = compressedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setFieldValue("fileUrl", urls);
  };

  const handleSubmit = async (
    values: ContestUpload,
    actions: FormikHelpers<ContestUpload>
  ) => {
    try {
      if (!selectedFiles.length) {
        showStatus("error", "Please select at least one image");
        return;
      }

      setProgressModal({
        isOpen: true,
        type: "upload",
        message: "Uploading your pictures to the server...",
        progress: { current: 0, total: 0 },
      });

      const uploadedUrls = await uploadImages(selectedFiles);

      setProgressModal({
        isOpen: true,
        type: "submit",
        message: "Finalizing your submission...",
        progress: { current: 0, total: 0 },
      });

      const payload = { ...values, fileUrl: uploadedUrls };
      await axios.post(
        `${import.meta.env.VITE_PROD_URL}/contest/submit`,
        payload
      );
      closeProgressModal();

      await new Promise((resolve) => setTimeout(resolve, 300));

      showModal({
        currentStep: "success",
        isSubmitting: false,
        message:
          "Submitted successfully! Visit our showcase page on mentoons.com to see the poll voting of your image.",
      });

      actions.resetForm();
      setSelectedFiles([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);

      setTimeout(() => {
        navigate("/adda");
      }, 2000);
    } catch (err) {
      console.log(err);
      closeProgressModal();
      showStatus("error", "Submission failed");
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (passKey !== QR_PASSKEY) {
    return null;
  }

  return (
    <>
      <ProgressModal
        isOpen={progressModal.isOpen}
        type={progressModal.type}
        message={progressModal.message}
        progress={progressModal.progress}
      />

      <div className="h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl h-full flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center flex-shrink-0">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Image Submission
            </h1>
            <p className="text-blue-100 mt-2 text-lg font-medium">
              Share your amazing pictures with us
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pt-6 pb-12">
            <Formik
              initialValues={uploadInitialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Full Name
                    </label>
                    <Field
                      name="name"
                      placeholder="Enter your name"
                      className="w-full px-5 py-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Age
                    </label>
                    <Field
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      className="w-full px-5 py-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                    <ErrorMessage
                      name="age"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Mobile Number
                    </label>
                    <Field
                      name="mobile"
                      type="tel"
                      placeholder="Enter your mobile number"
                      className="w-full px-5 py-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="category"
                      className="w-full px-5 py-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    >
                      <option value="">Select a category</option>
                      {Category.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-700 mb-2">
                      Upload Images
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileSelection(e, setFieldValue)}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border-4 border-dashed border-blue-300 rounded-3xl bg-blue-50 p-12 hover:border-blue-500 transition-all"
                    />
                    {selectedFiles.length > 0 && (
                      <p className="mt-4 text-green-600 font-bold text-center">
                        ✓ {selectedFiles.length} image
                        {selectedFiles.length > 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>

                  {previewUrls.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-blue-700 mb-6 text-center">
                        Preview
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {previewUrls.map((url, index) => (
                          <div
                            key={index}
                            className="relative group overflow-hidden rounded-2xl shadow-lg"
                          >
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                              <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100">
                                Image {index + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-full shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    Submit Entry
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageUploadFormSubmit;
