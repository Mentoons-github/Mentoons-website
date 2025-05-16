import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Form, Formik, FormikProps } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Edit, FileText, Image, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import ArticleForm from "./components/ArticleForm";
import EventForm from "./components/EventForm";
import PreviewContent from "./components/PreviewContent";
import TabNavigation from "./components/TabNavigation";
import TextPostForm from "./components/TextPostForm";
import UploadContent from "./components/UploadContent";
import { getInitialValues, getValidationSchema } from "./formConfig";
import { FormValues, PostUploadProps } from "./types";

const PostUpload = ({
  isOpen,
  onClose,
  postType,
  onPostCreated,
}: PostUploadProps) => {
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const [activeTab, setActiveTab] = useState(1);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveTab(1);
    setMediaPreview([]);
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

  const uploadMediaFile = async (file: File) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data.fileDetails.url;
    } catch (error) {
      console.error("Failed to upload media:", error);
      toast.error("Failed to upload media file");
      return null;
    }
  };

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    index: number = 0
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const values = formikRef.current?.values;
      if (!values) return;

      // Show preview immediately
      const newPreviews = [...mediaPreview];
      newPreviews[index] = URL.createObjectURL(file);
      setMediaPreview(newPreviews);

      // Start with file info
      const newMedia = [...values.media];
      newMedia[index] = {
        ...newMedia[index],
        file: file,
        type: file.type.startsWith("image/") ? "image" : "video",
      };

      setFieldValue("media", newMedia);

      // Upload the file to get the URL
      if (
        postType === "photo" ||
        postType === "video" ||
        postType === "article"
      ) {
        const fileUrl = await uploadMediaFile(file);
        if (fileUrl) {
          newMedia[index] = {
            ...newMedia[index],
            url: fileUrl,
          };
          setFieldValue("media", newMedia);
        }
      }
    }
  };

  const addMediaField = (
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const values = formikRef.current?.values;
    if (!values) return;
    const newMedia = [...values.media, { file: null, type: "image" }];
    setFieldValue("media", newMedia);
  };

  const removeMediaField = (
    index: number,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const values = formikRef.current?.values;
    if (!values) return;
    const newMedia = [...values.media];
    newMedia.splice(index, 1);
    setFieldValue("media", newMedia);

    const newPreviews = [...mediaPreview];
    newPreviews.splice(index, 1);
    setMediaPreview(newPreviews);
  };

  const handleSubmit = async (values: FormValues) => {
    console.log("🚨 ARTICLE SUBMISSION FUNCTION TRIGGERED 🚨");
    console.log("Post type:", postType);

    // Prevent double submission
    if (isSubmitting) {
      console.log("Already submitting, skipping duplicate request");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.info("Processing your post...");

      const token = await getToken();
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      console.log("=== ARTICLE POST SUBMISSION DEBUG INFO ===");
      console.log("Form values:", values);
      console.log("Post type:", postType);
      console.log("Media objects:", values.media);

      // Create base post data
      const postData: {
        title: string;
        content: string;
        postType: string;
        location: string;
        tags: string[];
        visibility: string;
        media?: Array<{
          type: string;
          caption: string;
          url: string;
        }>;
        article?: {
          body: string;
          coverImage: string;
        };
        event?: {
          startDate: string | undefined;
          endDate: string | undefined;
          venue: string;
          description: string;
        };
      } = {
        title: values.title || "",
        content: values.content || "",
        postType: postType,
        location: values.location || "",
        tags: values.tags || [],
        visibility: values.visibility || "public",
      };

      // Handle article post type specifically
      if (postType === "article") {
        console.log("Processing ARTICLE post type");
        // Article-specific data
        postData.article = {
          body: values.articleBody || "",
          coverImage: values.media[0]?.url || "",
        };

        // Filter media if any exist (optional for articles)
        if (values.media && values.media.length > 0 && values.media[0]?.url) {
          postData.media = [
            {
              type: "image",
              caption: values.media[0]?.caption || "",
              url: values.media[0]?.url || "",
            },
          ];
        } else {
          // Include empty media array for articles without cover image
          postData.media = [];
        }
      }
      // Handle event post type
      else if (postType === "event") {
        postData.event = {
          startDate: values.eventStartDate,
          endDate: values.eventEndDate || values.eventStartDate,
          venue: values.venue || "",
          description: values.description || "",
        };

        // Include media if available
        postData.media = values.media
          .filter((m) => m.file && m.url)
          .map((m) => ({
            type: m.type,
            caption: m.caption || "",
            url: m.url || "",
          }));
      }
      // Handle other post types (photo, video, mixed)
      else {
        // Include only valid media
        postData.media = values.media
          .filter((m) => m.file && m.url)
          .map((m) => ({
            type: m.type,
            caption: m.caption || "",
            url: m.url || "",
          }));
      }

      console.log(
        "Final post data to be submitted:",
        JSON.stringify(postData, null, 2)
      );

      // API endpoint
      // const apiUrl = "https://mentoons-backend-zlx3.onrender.com/api/v1/posts";

      const apiUrl = `${import.meta.env.VITE_PROD_URL}posts`;

      console.log("Sending request to:", apiUrl);
      console.log("With authorization token:", token.substring(0, 10) + "...");

      const response = await axios.post(apiUrl, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Post creation response:", response);

      if (response.data.success) {
        toast.success("Post created successfully!");
        onClose(false);
        formikRef.current?.resetForm();
        setMediaPreview([]);
        setActiveTab(1);

        // Call the onPostCreated callback if provided with the created post
        if (onPostCreated) {
          onPostCreated(response.data.data.post);
        }
      } else {
        toast.error("Failed to create post: " + response.data.message);
      }
    } catch (error) {
      console.error("Post creation failed:", error);
      let errorMessage = "Unknown error";

      // Type guard for Axios errors
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(`Failed to create post: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextTab = (isValid: boolean, values: FormValues) => {
    console.log("Next button clicked", { isValid, activeTab, postType });

    // For article posts, we'll do our own validation
    if (postType === "article") {
      // Only on the first tab, check for required fields
      if (activeTab === 1 && (!values.title || !values.articleBody)) {
        toast.error("Please fill in the article title and body");
        return;
      }

      // Otherwise, always allow moving to the next tab
      const maxTab = 3;
      if (activeTab < maxTab) {
        setActiveTab(activeTab + 1);
      }
      return;
    }

    // For other post types, still move forward even if validation fails
    // This ensures basic functionality works
    const maxTab = 3;
    if (activeTab < maxTab) {
      setActiveTab(activeTab + 1);
      // If form isn't valid, show a toast but still allow navigation
      if (!isValid) {
        toast.warning("Some fields may need your attention");
      }
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
      case "mixed":
        return <Edit className="text-indigo-500" size={24} />;
      default:
        return <Edit className="text-gray-500" size={24} />;
    }
  };

  // Add a manual form submission handler that uses the formik reference
  const handleManualSubmit = () => {
    console.log("Manual submit triggered");
    if (formikRef.current) {
      console.log("Formik instance found, submitting form");
      formikRef.current.submitForm();
    } else {
      console.error("Formik instance not found");
      toast.error("Error: Form system not initialized");
    }
  };

  // Add a direct submission function that doesn't rely on Formik
  const submitArticleDirectly = async () => {
    try {
      setIsSubmitting(true);
      toast.info("Submitting your article...");

      // Get form values directly from formikRef
      if (!formikRef.current) {
        toast.error("Form reference not available");
        return;
      }

      const values = formikRef.current.values;

      const token = await getToken();
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        return;
      }

      // Prepare article data
      const articleData = {
        title: values.title || "",
        content: values.content || "",
        postType: "article",
        location: values.location || "",
        tags: values.tags || [],
        visibility: values.visibility || "public",
        article: {
          body: values.articleBody || "",
          coverImage: values.media[0]?.url || "",
        },
        media: values.media[0]?.url
          ? [
              {
                type: "image",
                caption: values.media[0]?.caption || "",
                url: values.media[0]?.url,
              },
            ]
          : [],
      };

      // API endpoint
      // const apiUrl = "https://mentoons-backend-zlx3.onrender.com/api/v1/posts";
      const apiUrl = `${import.meta.env.VITE_PROD_URL}/posts`;

      // Make the API call
      const response = await axios.post(apiUrl, articleData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Article posted successfully!");
        onClose(false);
        formikRef.current?.resetForm();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      // Error handling
      if (axios.isAxiosError(error)) {
        toast.error(
          `Submission failed: ${error.response?.data?.message || error.message}`
        );
      } else {
        toast.error("Failed to submit article. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2147483647] flex items-center justify-center p-2 sm:p-3 md:p-5 bg-gray-800 bg-opacity-50 backdrop-blur-sm overflow-y-auto pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            isolation: "isolate",
            contain: "layout paint size",
            transformStyle: "preserve-3d",
            position: "fixed",
            zIndex: 2147483647,
          }}
        >
          <Formik
            innerRef={formikRef}
            initialValues={getInitialValues(postType)}
            validationSchema={getValidationSchema(postType, activeTab)}
            onSubmit={handleSubmit}
            validateOnMount={false}
          >
            {({ values, isValid, setFieldValue }) => (
              <motion.div
                ref={modalRef}
                className="relative flex flex-col items-center w-full max-w-lg p-6 overflow-hidden bg-white shadow-xl dark:bg-gray-800 rounded-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between w-full mb-4">
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
                    className="p-1 text-gray-600 transition bg-gray-100 rounded-full dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:bg-gray-700"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Tab Navigation */}
                <TabNavigation
                  postType={postType}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                <Form className="w-full">
                  {/* Form Content */}
                  <div
                    className="flex flex-col items-center w-full py-4 mb-4"
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
                          {postType === "article" && <ArticleForm />}

                          {postType === "event" && <EventForm />}

                          {postType !== "event" && postType !== "article" && (
                            <TextPostForm postType={postType} />
                          )}
                        </motion.div>
                      )}

                      {activeTab === 2 && (
                        <motion.div
                          key="tab2"
                          className="w-full h-full"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <UploadContent
                            postType={postType}
                            values={values}
                            mediaPreview={mediaPreview}
                            handleMediaUpload={handleMediaUpload}
                            addMediaField={addMediaField}
                            removeMediaField={removeMediaField}
                            setFieldValue={setFieldValue}
                          />
                        </motion.div>
                      )}

                      {activeTab === 3 && (
                        <PreviewContent
                          postType={postType}
                          values={values}
                          mediaPreview={mediaPreview}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-4 mt-auto">
                    {activeTab > 1 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevTab}
                        className="flex items-center gap-2 px-5 py-2 text-white transition duration-200 bg-gray-500 rounded-md dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700"
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

                    {activeTab < 3 && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleNextTab(isValid, values);
                        }}
                        className="flex items-center gap-2 px-5 py-2 text-white transition duration-200 bg-orange-500 rounded-md dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700"
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

                    {activeTab === 3 && (
                      <motion.button
                        type="button"
                        onClick={
                          postType === "article"
                            ? submitArticleDirectly
                            : handleManualSubmit
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 text-white transition duration-200 bg-green-500 rounded-md dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Post"}
                      </motion.button>
                    )}
                  </div>
                </Form>
              </motion.div>
            )}
          </Formik>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PostUpload;
