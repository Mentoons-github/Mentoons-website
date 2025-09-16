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
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-[9999]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50, rotateX: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`relative text-gray-800 ${
          page === "freedownload"
            ? "w-[90%] md:max-w-lg py-12 px-10"
            : "w-full h-full"
        } space-y-6 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-2xl border-2 border-orange-200/50 overflow-hidden`}
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl"
        />

        <motion.button
          onClick={() => setShowFreeDownloadForm(false)}
          className="absolute z-10 top-4 right-4 p-3 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 hover:from-red-100 hover:to-orange-100 transition-all duration-300 group shadow-lg"
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <IoMdClose className="text-xl text-orange-600 group-hover:text-red-500 transition-colors duration-200" />
        </motion.button>

        {page === "freedownload" ? (
          <>
            {/* Enhanced Success State */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-white z-20 rounded-3xl"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.7,
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                  }}
                  className="flex flex-col items-center space-y-8"
                >
                  <motion.div
                    initial={{ rotate: 0, scale: 0 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{
                      delay: 0.5,
                      duration: 1,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full blur-2xl"
                    />
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full blur-lg opacity-50"
                    />
                    <IoMdCheckmarkCircle className="text-8xl text-orange-500 relative z-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-center space-y-4"
                  >
                    <motion.h2
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent bg-300% animate-pulse"
                    >
                      Success!
                    </motion.h2>
                    <p className="text-orange-700 text-center max-w-xs leading-relaxed text-lg">
                      {successMessage}
                    </p>
                  </motion.div>

                  {/* Spectacular Confetti Animation */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          y: -60,
                          x: Math.random() * 500 - 250,
                          rotate: 0,
                          scale: 0,
                        }}
                        animate={{
                          opacity: [0, 1, 0.8, 0],
                          y: [0, 200, 400, 500],
                          rotate: [0, 180, 360, 540],
                          scale: [0, 1, 1.2, 0],
                        }}
                        transition={{
                          delay: 1.2 + Math.random() * 0.8,
                          duration: 3,
                          ease: "easeOut",
                        }}
                        className={`absolute w-4 h-4 ${
                          i % 4 === 0
                            ? "bg-gradient-to-br from-orange-400 to-yellow-400"
                            : i % 4 === 1
                            ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                            : i % 4 === 2
                            ? "bg-gradient-to-br from-orange-500 to-red-400"
                            : "bg-gradient-to-br from-yellow-500 to-orange-400"
                        } rounded-full shadow-lg`}
                        style={{
                          left: "50%",
                          top: "15%",
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Enhanced Form State */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: showSuccess ? 0 : 1 }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-10"
              >
                <motion.h1
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="flex justify-center items-center gap-4 text-3xl font-bold mb-3"
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent bg-300%"
                  >
                    Free
                  </motion.span>
                  <motion.img
                    className="w-20 h-auto drop-shadow-lg"
                    src={MiniLogo}
                    alt="mentoons logo"
                    whileHover={{
                      scale: 1.2,
                      rotate: 360,
                      filter: "drop-shadow(0 0 20px rgba(251, 146, 60, 0.5))",
                    }}
                    transition={{ duration: 0.6 }}
                    animate={{
                      y: [0, -5, 0],
                    }}
                    style={{
                      animation: "float 3s ease-in-out infinite",
                    }}
                  />
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent bg-300%"
                  >
                    Gifts
                  </motion.span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-orange-700 text-base font-medium"
                >
                  ✨ Get your free comic delivered to your email instantly ✨
                </motion.p>
              </motion.div>

              <Formik<FormType>
                initialValues={initialState}
                validationSchema={validationSchema}
                onSubmit={(values) => sendEmail(values)}
              >
                <Form className="flex flex-col w-full space-y-6">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Field
                        type="text"
                        placeholder="Your Name"
                        name="name"
                        className="w-full px-5 py-4 text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 transition-all duration-300 placeholder:text-orange-400 shadow-lg hover:shadow-xl hover:border-orange-300 text-lg"
                        disabled={isSubmitting}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-2xl -z-10"
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="mt-2 ml-2 text-sm text-red-500 flex items-center gap-1 font-medium"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Field
                        type="email"
                        placeholder="Your Email"
                        name="email"
                        className="w-full px-5 py-4 text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 transition-all duration-300 placeholder:text-orange-400 shadow-lg hover:shadow-xl hover:border-orange-300 text-lg"
                        disabled={isSubmitting}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-2xl -z-10"
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-2 ml-2 text-sm text-red-500 flex items-center gap-1 font-medium"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileFocus={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Field
                        type="tel"
                        placeholder="Your Phone"
                        name="phone"
                        className="w-full px-5 py-4 text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 transition-all duration-300 placeholder:text-orange-400 shadow-lg hover:shadow-xl hover:border-orange-300 text-lg"
                        disabled={isSubmitting}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-yellow-200/20 rounded-2xl -z-10"
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="mt-2 ml-2 text-sm text-red-500 flex items-center gap-1 font-medium"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="pt-2"
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-8 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-lg transform hover:from-orange-600 hover:via-yellow-600 hover:to-orange-600 bg-300%"
                      whileHover={{
                        scale: isSubmitting ? 1 : 1.05,
                        y: -3,
                        boxShadow: "0 20px 40px rgba(251, 146, 60, 0.4)",
                      }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        backgroundPosition: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="flex items-center justify-center gap-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <span className="text-lg">Sending Magic...</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          className="flex items-center justify-center gap-3"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span>🎁 Get My Free Comic</span>
                          <motion.span
                            initial={{ x: 0 }}
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="text-xl"
                          >
                            →
                          </motion.span>
                        </motion.span>
                      )}
                    </motion.button>
                  </motion.div>
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
