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

const ImageUploadFormSubmit = () => {
  const { showStatus } = useStatusModal();
  const { showModal } = useSubmissionModal();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const passKey = searchParams.get("PASS_KEY");
  const QR_PASSKEY = import.meta.env.VITE_QR_PASSKEY;

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
  }, []);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];

    for (const f of files) {
      const res = await dispatch(uploadFile({ file: f, contestUpload: true }));
      if (uploadFile.fulfilled.match(res)) {
        const url = res.payload.data.fileDetails?.url;
        if (url) urls.push(url);
      }
    }

    return urls;
  };

  const handleFileSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!e.target.files) return;

    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    setFieldValue("fileUrl", urls);
  };

  const handleSubmit = async (
    values: ContestUpload,
    actions: FormikHelpers<ContestUpload>
  ) => {
    console.log("submitting");
    try {
      if (!selectedFiles.length) {
        showStatus("error", "Please select at least one image");
        return;
      }

      showModal({
        currentStep: "uploading",
        isSubmitting: true,
        message: "Uploading your pictures, please wait...",
      });

      const uploadedUrls = await uploadImages(selectedFiles);

      showModal({
        currentStep: "uploading",
        isSubmitting: true,
        message: "Submitting your form, please wait...",
      });

      const payload = {
        ...values,
        fileUrl: uploadedUrls,
      };

      await axios.post(
        `${import.meta.env.VITE_PROD_URL}/contest/submit`,
        payload
      );

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
    } catch (err) {
      console.log(err);
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
    <div className="h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md h-full flex flex-col py-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-200 flex flex-col max-h-full">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-center flex-shrink-0">
            <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-lg">
              Image Submission
            </h1>
            <p className="text-blue-50 mt-1 text-sm">
              Share your amazing pictures with us
            </p>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <Formik
              initialValues={uploadInitialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue }) => (
                <Form className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-blue-600">Name</span>
                    </label>
                    <Field
                      name="name"
                      className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl w-full transition-all duration-200 outline-none"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-blue-600">Age</span>
                    </label>
                    <Field
                      name="age"
                      className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl w-full transition-all duration-200 outline-none"
                      placeholder="Enter your age"
                    />
                    <ErrorMessage
                      name="age"
                      component="div"
                      className="text-red-500 text-sm mt-1 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-blue-600">Mobile</span>
                    </label>
                    <Field
                      name="mobile"
                      className="border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-xl w-full transition-all duration-200 outline-none"
                      placeholder="Enter your mobile number"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-sm mt-1 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-blue-600">Upload Images</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        value=""
                        onChange={(e) => handleFileSelection(e, setFieldValue)}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer file:transition-all file:duration-200 cursor-pointer border-2 border-dashed border-blue-300 rounded-xl p-4 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
                      />
                    </div>
                    {selectedFiles.length > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        ✓ {selectedFiles.length} file(s) selected
                      </p>
                    )}
                    <ErrorMessage
                      name="fileUrl"
                      component="div"
                      className="text-red-500 text-sm mt-1 font-medium"
                    />
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Preview
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-blue-200 shadow-sm"
                            />
                            <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 bg-blue-600 px-2 py-1 rounded">
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
                    className="mt-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                  >
                    Submit Entry
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadFormSubmit;
