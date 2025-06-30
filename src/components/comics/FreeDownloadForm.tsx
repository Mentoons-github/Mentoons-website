import axiosInstance from "@/api/axios";
import MiniLogo from "@/assets/imgs/logo mini.png";
import { SelectedComicType } from "@/pages/FreeDownload";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { IoMdClose, IoMdCheckmarkCircle } from "react-icons/io";
import { toast } from "sonner";
import * as Yup from "yup";
import WorkshopForm from "../common/WorkshopForm";

interface FormType {
  name: string;
  email: string;
  phone: string;
}

interface FreeDownloadFormProps {
  setShowFreeDownloadForm: React.Dispatch<React.SetStateAction<boolean>>;
  selectedComic?: SelectedComicType;
  page: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required!"),
  email: Yup.string()
    .email("Invalid email address!")
    .required("Email is required!"),
  phone: Yup.string()
    .required("Phone number is required!")
    .matches(
      /^\+?\d{10,15}$/,
      "Invalid phone number format (e.g., +918777328451)"
    ),
});

const initialState: FormType = { name: "", email: "", phone: "" };

const FreeDownloadForm: React.FC<FreeDownloadFormProps> = ({
  setShowFreeDownloadForm,
  selectedComic,
  page,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const sendEmail = async (value: FormType) => {
    console.log("sending email");
    setIsSubmitting(true);

    try {
      const userEmail = value.email;

      if (!userEmail) {
        toast.error("User email not found");
        setIsSubmitting(false);
        return;
      }

      const response = await axiosInstance.post("/email/free-downloads", {
        email: userEmail,
        data: {
          pdf: selectedComic?.pdf_url,
          thumbnail: selectedComic?.thumbnail_url,
        },
      });

      console.log("email response :", response);

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          response.data?.message || "Comic sent successfully to your email!"
        );
        setShowSuccess(true);

        setTimeout(() => {
          setShowFreeDownloadForm(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending comic to email");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative text-black ${
          page === "freedownload"
            ? "w-[90%] md:max-w-md py-8 px-10"
            : "w-full h-full"
        } space-y-4 rounded-md bg-white shadow shadow-white overflow-hidden`}
      >
        <button
          onClick={() => setShowFreeDownloadForm(false)}
          className="absolute z-10 top-2 right-2"
        >
          <IoMdClose className="text-2xl transition-all duration-300 ease-in-out hover:text-red-400 active:scale-50" />
        </button>

        {page === "freedownload" ? (
          <>
            {/* Success State */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex flex-col items-center space-y-4"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      delay: 0.5,
                      duration: 0.8,
                      ease: "easeInOut",
                    }}
                  >
                    <IoMdCheckmarkCircle className="text-6xl text-green-500" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                      Success!
                    </h2>
                    <p className="text-gray-700 text-center max-w-xs">
                      {successMessage}
                    </p>
                  </motion.div>

                  {/* Confetti Animation */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          y: -50,
                          x: Math.random() * 400 - 200,
                          rotate: 0,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          y: 400,
                          rotate: 360,
                        }}
                        transition={{
                          delay: 1 + Math.random() * 0.5,
                          duration: 2,
                          ease: "easeOut",
                        }}
                        className={`absolute w-2 h-2 ${
                          i % 4 === 0
                            ? "bg-yellow-400"
                            : i % 4 === 1
                            ? "bg-blue-400"
                            : i % 4 === 2
                            ? "bg-red-400"
                            : "bg-green-400"
                        } rounded-full`}
                        style={{
                          left: "50%",
                          top: "20%",
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Form State */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: showSuccess ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="flex justify-center gap-2 text-xl font-semibold">
                Free <img className="w-20" src={MiniLogo} alt="mentoons logo" />{" "}
                Gifts
              </h1>
              <Formik<FormType>
                initialValues={initialState}
                validationSchema={validationSchema}
                onSubmit={(values) => sendEmail(values)}
              >
                <Form className="flex flex-col w-full space-y-3">
                  <div className="w-full">
                    <Field
                      type="text"
                      placeholder="Your Name"
                      name="name"
                      className="w-full cta-input"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="mt-3 ml-4 text-sm text-red-500"
                    />
                  </div>
                  <div className="w-full">
                    <Field
                      type="email"
                      placeholder="Your Email"
                      name="email"
                      className="w-full cta-input"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-3 ml-4 text-sm text-red-500"
                    />
                  </div>
                  <div className="w-full">
                    <Field
                      type="tel"
                      placeholder="Your Phone"
                      name="phone"
                      className="w-full cta-input"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="mt-3 ml-4 text-sm text-red-500"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="cta-button-footer disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Sending...
                      </motion.div>
                    ) : (
                      "Submit"
                    )}
                  </motion.button>
                </Form>
              </Formik>
            </motion.div>
          </>
        ) : (
          <div className="w-full h-full">
            <WorkshopForm setShowForm={setShowFreeDownloadForm} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FreeDownloadForm;
