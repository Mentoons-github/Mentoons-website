import axiosInstance from "@/api/axios";
import FounderNote from "@/components/common/founderNote";
import useInView from "@/hooks/useInView";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { motion } from "framer-motion";

import { toast } from "sonner";
import * as Yup from "yup";

interface ApiResponse {
  success: boolean;
  data?: unknown; // You can replace 'any' with the actual data type you expect
  message?: string; // Optional error or success message
}

interface FormValues {
  email: string;
}
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
const NewsAndMentor = () => {
  const { ref: sectionRef, isInView } = useInView(0.3, false);
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await axiosInstance.post<ApiResponse>(
        "email/subscribeToNewsletter",
        {
          email: values.email,
        }
      );

      // The data from the response is in response.data
      const res: ApiResponse = response.data;
      if (res.success) {
        toast(`✅ ${res.message}`);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      toast(` ${err}`);
    } finally {
      resetForm();
      setSubmitting(false);
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      className="w-full flex flex-col lg:flex-row justify-between lg:justify-start items-center gap-10 py-10 px-5 lg:px-0 bg-[#F2C6DE]"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div
        className="flex justify-start items-start"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 1 }}
      >
        <div className="lg:hidden">
          <FounderNote />
        </div>
        <div className="hidden px-10 lg:block">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <FounderNote scroll={true} />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="relative flex flex-col justify-center items-center gap-5 w-full lg:w-[750px] px-4 sm:px-8 lg:pr-10 space-y-4"
        initial={{ y: 100, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-2xl font-semibold leading-tight text-center text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl">
          Guidance for tomorrow, balance for today
        </h1>
        <div className="absolute top-0 left-0 w-16 sm:top-10 md:top-20 lg:top-0 sm:w-20 sm:h-20">
          <img
            src="/assets/home/newsAndMentor/folded newspaper.png"
            alt="newspaper"
            className="object-cover w-auto"
          />
        </div>
        <div className="absolute top-0 right-0 w-20 sm:w-32">
          <img
            src="/assets/home/newsAndMentor/Messaging with paper airplanes, envelope and speech bubble.png"
            alt="newspaper"
            className="object-cover w-auto"
          />
        </div>

        {/* <input
            type="text"
            placeholder="Enter your email"
            className="flex-grow px-3 py-2 text-sm rounded-l-full border outline-none md:text-base"
          />
          <button className="flex justify-center items-center gap-2 sm:gap-3 bg-[#EC9600] cursor-pointer py-2 px-4 sm:px-5 rounded-r-full text-white h-full text-sm md:text-base">
            <FaTelegram /> Subscribe
          </button> */}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="w-[80%]">
              <div className="flex relative items-center">
                <Field
                  name="email"
                  type="email"
                  className="p-3 pr-40 pl-5 w-full text-gray-700 rounded-full focus:outline-none focus:border-orange-400"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="flex absolute right-1 gap-2 items-center px-6 py-2 font-medium text-white bg-orange-500 rounded-full rounded-tl-none rounded-bl-none transition-all duration-300 hover:bg-orange-600"
                >
                  <span>Subscribe</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14v-4H8l4-6 4 6h-3v4h-2z"
                      transform="rotate(90 12 12)"
                    />
                  </svg>
                </button>
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 ml-2 text-sm text-red-600"
              />
            </Form>
          )}
        </Formik>

        <iframe
          src="https://mentoonsnews.com/"
          title="Mentoon News"
          width="100%"
          height="400"
          sandbox="allow-same-origin allow-scripts allow-popups"
          className="pt-5 rounded-xl border-none shadow-xl"
        />
      </motion.div>
    </motion.section>
  );
};

export default NewsAndMentor;
