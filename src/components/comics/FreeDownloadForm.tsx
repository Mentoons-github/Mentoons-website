import axiosInstance from "@/api/axios";
import MiniLogo from "@/assets/imgs/logo mini.png";
import { SelectedComicType } from "@/pages/FreeDownload";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import React from "react";
import { IoMdClose } from "react-icons/io";
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
  // /free-downloads

  const sendEmail = async (value: FormType) => {
    try {
      const userEmail = value.email;

      if (!userEmail) {
        toast.error("User email not found");
        return;
      }

      // Send comic to user's email
      const response = await axiosInstance.post("/email/free-downloads", {
        email: userEmail,
        data: {
          pdf: selectedComic?.pdf_url,
          thumbnail: selectedComic?.thumbnail_url,
        },
      });

      if (response.status === 201) {
        toast.success("Comic sent successfully to your email!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending comic to email");
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-black bg-opacity-50 fixed inset-0 z-[9999]"
      onClick={() => setShowFreeDownloadForm(false)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative text-black ${
          page === "freedownload"
            ? "w-[90%] md:max-w-md py-8 px-10"
            : "w-full h-full"
        } space-y-4 rounded-md bg-white shadow shadow-white`}
      >
        <button
          onClick={() => setShowFreeDownloadForm(false)}
          className="absolute top-2 right-2 z-10"
        >
          <IoMdClose className="text-2xl hover:text-red-400 active:scale-50 transition-all ease-in-out duration-300" />
        </button>

        {page === "freedownload" ? (
          <>
            <h1 className="font-semibold text-xl flex justify-center gap-2">
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
                    className="cta-input w-full "
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-3 ml-4"
                  />
                </div>
                <div className="w-full">
                  <Field
                    type="email"
                    placeholder="Your Email"
                    name="email"
                    className="cta-input w-full"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-3 ml-4"
                  />
                </div>
                <div className="w-full">
                  <Field
                    type="tel"
                    placeholder="Your Phone"
                    name="phone"
                    className="cta-input w-full"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-3 ml-4"
                  />
                </div>
                <button type="submit" className="cta-button-footer">
                  Submit
                </button>
              </Form>
            </Formik>
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
