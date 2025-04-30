import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Edit,
  Calendar,
  Image,
  Video,
  FileText,
  MapPin,
  Info,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface PostUploadProps {
  isOpen: boolean;
  onClose: (val: boolean) => void;
  postType: "photo" | "video" | "event" | "article";
}

interface FormValues {
  postText: string;
  eventDate: string;
  location: string;
  additionalInfo: string;
  mediaFile: File | null;
}

const PostUpload = ({ isOpen, onClose, postType }: PostUploadProps) => {
  const formikRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const getValidationSchema = () => {
    const baseSchema = {
      postText: Yup.string().required("Content is required"),
    };

    switch (postType) {
      case "event":
        return Yup.object({
          ...baseSchema,
          eventDate: Yup.date().required("Event date is required"),
          location: Yup.string().required("Location is required"),
          additionalInfo: Yup.string(),
        });
      case "photo":
      case "video":
        return Yup.object({
          ...baseSchema,
          mediaFile: Yup.mixed().test(
            "fileRequired",
            `${postType} file is required for tab 3`,
            function (value) {
              if (activeTab === 3 && !value && !mediaPreview) {
                return false;
              }
              return true;
            }
          ),
        });
      default:
        return Yup.object({
          ...baseSchema,
        });
    }
  };

  const getInitialValues = () => {
    return {
      postText: "",
      eventDate: "",
      location: "",
      additionalInfo: "",
      mediaFile: null,
    };
  };

  useEffect(() => {
    setActiveTab(1);
    setMediaPreview(null);
  }, [postType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose(false);
        formikRef.current?.resetForm();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("mediaFile", file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    onClose(false);
  };

  const handleNextTab = (isValid: boolean) => {
    if (!isValid) return;

    if (
      (postType === "article" && activeTab < 2) ||
      (postType !== "article" && activeTab < 3)
    ) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevTab = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1);
    }
  };

  const getPostTypeIcon = () => {
    switch (postType) {
      case "photo":
        return <Image className="text-blue-500" size={24} />;
      case "video":
        return <Video className="text-purple-500" size={24} />;
      case "event":
        return <Calendar className="text-green-500" size={24} />;
      case "article":
        return <FileText className="text-orange-500" size={24} />;
      default:
        return <Edit className="text-gray-500" size={24} />;
    }
  };

  const tabLabels = ["Write", "Upload", "Preview"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 p-5 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Formik
            innerRef={formikRef}
            initialValues={getInitialValues()}
            validationSchema={getValidationSchema()}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isValid, setFieldValue }) => (
              <motion.div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 p-6 w-full max-w-lg rounded-2xl shadow-xl flex flex-col items-center relative overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="w-full flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {getPostTypeIcon()}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {`Create ${postType} Post`}
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onClose(false)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition rounded-full p-1 bg-gray-100 dark:bg-gray-700"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {postType !== "article" && postType !== "event" && (
                  <div className="flex justify-between w-full pb-4 border-b dark:border-gray-700 mb-4">
                    {tabLabels.map((label, index) => (
                      <motion.div
                        key={index + 1}
                        className={`flex items-center gap-3 cursor-pointer transition relative`}
                        onClick={() => setActiveTab(index + 1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className={`w-8 h-8 flex justify-center items-center rounded-full text-white text-sm font-semibold`}
                          animate={{
                            backgroundColor:
                              activeTab === index + 1 ? "#3b82f6" : "#9ca3af",
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {index + 1}
                        </motion.span>
                        <span
                          className={
                            activeTab === index + 1
                              ? "text-blue-500 font-bold"
                              : "text-gray-600 dark:text-gray-400"
                          }
                        >
                          {label}
                        </span>
                        {activeTab === index + 1 && (
                          <motion.div
                            className="absolute -bottom-4 left-0 right-0 h-0.5 bg-blue-500"
                            layoutId="activeTab"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                <Form className="w-full">
                  <div
                    className="py-4 w-full flex flex-col items-center mb-4"
                    style={{ minHeight: "300px" }}
                  >
                    <AnimatePresence mode="wait">
                      {activeTab === 1 && (
                        <motion.div
                          key="tab1"
                          className="w-full h-full"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {postType !== "event" && postType !== "article" && (
                            <div className="w-full">
                              <Field
                                as="textarea"
                                name="postText"
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder={`Write about your ${postType.toLowerCase()}...`}
                              />
                              <ErrorMessage
                                name="postText"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          )}

                          {postType === "event" && (
                            <div className="w-full flex flex-col gap-4">
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="relative"
                              >
                                <Calendar
                                  className="absolute left-3 top-3 text-gray-500 dark:text-gray-400"
                                  size={18}
                                />
                                <Field
                                  type="date"
                                  name="eventDate"
                                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <ErrorMessage
                                  name="eventDate"
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </motion.div>

                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative"
                              >
                                <MapPin
                                  className="absolute left-3 top-3 text-gray-500 dark:text-gray-400"
                                  size={18}
                                />
                                <Field
                                  type="text"
                                  name="location"
                                  placeholder="Event location"
                                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <ErrorMessage
                                  name="location"
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </motion.div>

                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="relative"
                              >
                                <Info
                                  className="absolute left-3 top-3 text-gray-500 dark:text-gray-400"
                                  size={18}
                                />
                                <Field
                                  as="textarea"
                                  name="additionalInfo"
                                  placeholder="Additional information (optional)"
                                  className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                              </motion.div>

                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="w-full"
                              >
                                <Field
                                  as="textarea"
                                  name="postText"
                                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-36 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  placeholder="Description of your event..."
                                />
                                <ErrorMessage
                                  name="postText"
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </motion.div>
                            </div>
                          )}

                          {postType === "article" && (
                            <div className="w-full">
                              <Field
                                as="textarea"
                                name="postText"
                                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="Write your article..."
                              />
                              <ErrorMessage
                                name="postText"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 2 &&
                        (postType === "photo" || postType === "video") && (
                          <motion.div
                            key="tab2"
                            className="w-full h-full flex flex-col gap-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept={
                                postType === "video" ? "video/*" : "image/*"
                              }
                              id="mediaUpload"
                              className="hidden"
                              onChange={(e) =>
                                handleMediaUpload(e, setFieldValue)
                              }
                            />

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <label
                                htmlFor="mediaUpload"
                                className="cursor-pointer border-2 border-dashed w-full h-64 flex flex-col items-center justify-center border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                              >
                                {mediaPreview ? (
                                  <motion.img
                                    src={mediaPreview}
                                    alt="Preview"
                                    className="max-h-56 max-w-full object-contain rounded-md"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 25,
                                    }}
                                  />
                                ) : (
                                  <motion.div
                                    className="flex flex-col items-center gap-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <Upload
                                      size={40}
                                      className="text-blue-500 mb-2"
                                    />
                                    <p className="font-medium text-center">
                                      Click to upload {postType}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {postType === "photo"
                                        ? "JPG, PNG, GIF up to 10MB"
                                        : "MP4, MOV up to 50MB"}
                                    </p>
                                  </motion.div>
                                )}
                              </label>
                            </motion.div>

                            {mediaPreview && (
                              <motion.button
                                type="button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="self-center text-red-500 flex items-center gap-1 hover:text-red-600"
                                onClick={() => {
                                  setMediaPreview(null);
                                  setFieldValue("mediaFile", null);
                                  if (fileInputRef.current)
                                    fileInputRef.current.value = "";
                                }}
                              >
                                <X size={16} /> Remove {postType}
                              </motion.button>
                            )}

                            {activeTab === 2 &&
                              (postType === "photo" || postType === "video") &&
                              !mediaPreview &&
                              touched.mediaFile &&
                              errors.mediaFile && (
                                <div className="text-red-500 text-sm mt-1 text-center">
                                  {errors.mediaFile}
                                </div>
                              )}
                          </motion.div>
                        )}

                      {activeTab === 2 &&
                        postType !== "photo" &&
                        postType !== "video" && (
                          <motion.div
                            key="preview"
                            className="w-full flex flex-col items-center gap-6 p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
                              Preview
                            </h2>

                            {postType === "event" && values.eventDate && (
                              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-md flex flex-col gap-2 w-full">
                                <div className="flex items-center gap-2">
                                  <Calendar size={16} />
                                  <span className="font-medium">
                                    {new Date(
                                      values.eventDate
                                    ).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>

                                {values.location && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <MapPin size={16} />
                                    <span>{values.location}</span>
                                  </div>
                                )}

                                {values.additionalInfo && (
                                  <div className="flex items-start gap-2 mt-1">
                                    <Info
                                      size={16}
                                      className="mt-1 flex-shrink-0"
                                    />
                                    <span className="text-sm">
                                      {values.additionalInfo}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="text-gray-700 dark:text-gray-300 max-h-36 overflow-y-auto w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                              {values.postText ? (
                                <p className="whitespace-pre-wrap">
                                  {values.postText}
                                </p>
                              ) : (
                                <p className="text-gray-400 dark:text-gray-500 italic text-center">
                                  No content added
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}

                      {activeTab === 3 && (
                        <motion.div
                          key="tab3"
                          className="w-full flex flex-col items-center gap-6"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                              Preview Your {postType}
                            </h3>

                            {mediaPreview && (
                              <div className="mb-4 flex justify-center">
                                <img
                                  src={mediaPreview}
                                  alt="Preview"
                                  className="max-h-48 rounded-lg shadow-md"
                                />
                              </div>
                            )}

                            {values.postText && (
                              <div className="bg-white dark:bg-gray-700 rounded-md p-4 shadow-sm mb-4">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {values.postText}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs mr-2">
                                {postType}
                              </span>
                              Ready to post
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="flex gap-4 mt-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {activeTab > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevTab}
                        className="bg-gray-500 dark:bg-gray-600 text-white px-5 py-2 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 transition duration-200 flex items-center gap-2"
                      >
                        <motion.div
                          initial={{ x: 0 }}
                          animate={{ x: [-5, 0] }}
                          transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 0.6,
                          }}
                        >
                          ←
                        </motion.div>
                        Previous
                      </motion.button>
                    )}

                    {activeTab < (postType === "article" ? 2 : 3) && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNextTab(isValid)}
                        className="bg-blue-500 dark:bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                        disabled={
                          activeTab === 2 &&
                          (postType === "photo" || postType === "video") &&
                          !mediaPreview
                        }
                      >
                        Next
                        <motion.div
                          initial={{ x: 0 }}
                          animate={{ x: [0, 5] }}
                          transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 0.6,
                          }}
                        >
                          →
                        </motion.div>
                      </motion.button>
                    )}

                    {((postType === "article" && activeTab === 2) ||
                      (postType !== "article" && activeTab === 3) ||
                      (postType === "event" && activeTab === 2)) && (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-500 dark:bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition duration-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Submit Post
                      </motion.button>
                    )}
                  </motion.div>
                </Form>
              </motion.div>
            )}
          </Formik>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostUpload;
