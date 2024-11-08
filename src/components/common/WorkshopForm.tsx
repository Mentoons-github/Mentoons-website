import type { AppDispatch, RootState } from "@/redux/store";
import { submitWorkshopForm } from "@/redux/workshopSlice";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import * as Yup from "yup";
import Loader from "./Loader";
import { FaTimes } from "react-icons/fa";
import { errorToast } from "@/utils/toastResposnse";

interface FormValues {
  name: string;
  guardianName: string;
  guardianContact: string;
  age: string;
  message: string;
  city: string;
  guardianEmail: string;
  duration: string;
  workshop: string;
}

type WorkshopProps = {
  selectedWorkshop?: string;
  setShowForm: (showForm: boolean) => void;
};

const WorkshopForm: React.FC<WorkshopProps> = ({ selectedWorkshop, setShowForm }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loading } = useSelector((state: RootState) => state.workshop);

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    try {
      setSubmitting(true);
      const response = await dispatch(submitWorkshopForm(values));
  
      if (response.meta.requestStatus === "fulfilled") {
        setIsSubmitted(true);
        toast.success("Form submitted successfully");
        setIsSubmitted(true);
      } else {
        const errorMessage = 
          (response.payload as { message?: string })?.message || 
          "Something went wrong. Please try again.";
  
        errorToast(errorMessage);
        console.error(response.payload);
      }
    } catch (error: any) {
      errorToast("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderWorkshop = (selectedWorkshop: string | undefined): string => {
    switch (selectedWorkshop) {
      case "6-12":
        return "BUDDY CAMP";
      case "13-19":
        return "TEEN CAMP";
      case "20+":
        return "20+ CAMP";
      case "parents":
        return "FAMILY CAMP";
      default:
        return "BUDDY CAMP";
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div
          className={`relative ${!isSubmitted
            ? "bg-[url('/assets/images/Frame2.png')] bg-cover bg-no-repeat bg-center bg-opacity-25"
            : "bg-transparent"
            } p-3 sm:p-6 rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-hide mx-auto shadow-lg`}
        >
          {!isSubmitted ? (
            <>
              <FaTimes
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-2xl text-black cursor-pointer"
                onClick={() => setShowForm(false)}
              />
              <div className="text-center mb-4 sm:mb-8">
                <div className="flex flex-col sm:flex-row-reverse items-center justify-center gap-2 sm:gap-4">
                  <h2 className="text-xl sm:text-3xl font-bold text-indigo-600">
                    {selectedWorkshop ? renderWorkshop(selectedWorkshop) + " Registration" : "Registration"}
                  </h2>
                  <img
                    src="/assets/cards/klement.png"
                    alt="logo"
                    className="w-16 sm:w-20"
                  />
                </div>
              </div>
              <Formik
                initialValues={{
                  name: "",
                  guardianName: "",
                  guardianContact: "",
                  age: "",
                  message: "",
                  city: "",
                  guardianEmail: "",
                  duration: "",
                  workshop: selectedWorkshop || "BUDDY CAMP",
                }}
                validationSchema={Yup.object({
                  name: Yup.string()
                    .min(2, "Name must be at least 2 characters long")
                    .max(50, "Name can't be longer than 50 characters")
                    .required("Name is required"),
                  guardianName: Yup.string()
                    .min(2, "Guardian name must be at least 2 characters long")
                    .max(50, "Guardian name can't be longer than 50 characters")
                    .required("Guardian name is required"),
                  guardianContact: Yup.string()
                    .matches(/^\d{10}$/, "Guardian contact must be a 10-digit number")
                    .required("Guardian contact is required"),
                  age: Yup.number()
                    .min(1, "Age must be a positive number")
                    .max(100, "Age must be less than 100")
                    .required("Age is required"),
                  message: Yup.string()
                    .min(10, "Message must be at least 10 characters long")
                    .required("Message is required"),
                  city: Yup.string()
                    .min(2, "City must be at least 2 characters long")
                    .required("City is required"),
                  guardianEmail: Yup.string()
                    .email("Invalid email address")
                    .required("Guardian email is required"),
                  duration: Yup.string().required("Duration is required"),
                })}
                onSubmit={handleSubmit}
              >
                <Form className="space-y-4 sm:space-y-6">
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    <div>
                      <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                        Child's Name
                      </label>
                      <Field
                        id='name'
                        name='name'
                        type='text'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='name' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='guardianName' className='block text-sm font-medium text-gray-700 mb-1'>
                        Guardian's/Parent's Name
                      </label>
                      <Field
                        id='guardianName'
                        name='guardianName'
                        type='text'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='guardianName' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='guardianContact' className='block text-sm font-medium text-gray-700 mb-1'>
                        Guardian's/Parent's Contact
                      </label>
                      <Field
                        id='guardianContact'
                        name='guardianContact'
                        type='text'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='guardianContact' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='age' className='block text-sm font-medium text-gray-700 mb-1'>
                        Child's Age
                      </label>
                      <Field
                        id='age'
                        name='age'
                        type='number'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='age' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-1'>
                        City
                      </label>
                      <Field
                        id='city'
                        name='city'
                        type='text'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='city' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='guardianEmail' className='block text-sm font-medium text-gray-700 mb-1'>
                        Guardian's Email
                      </label>
                      <Field
                        id='guardianEmail'
                        name='guardianEmail'
                        type='email'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='guardianEmail' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='duration' className='block text-sm font-medium text-gray-700 mb-1'>
                        Duration
                      </label>
                      <Field
                        as='select'
                        id='duration'
                        name='duration'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select duration</option>
                        <option value='2days'>2 days</option>
                        <option value='6months'>6 months</option>
                        <option value='12months'>12 months</option>
                      </Field>
                      <ErrorMessage name='duration' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='workshop' className='block text-sm font-medium text-gray-700 mb-1'>
                        workshop
                      </label>
                      <Field
                        as='select'
                        id='workshop'
                        name='workshop'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select workshop</option>
                        <option value='6-12'>BUDDY CAMP</option>
                        <option value='13-19'>TEEN CAMP</option>
                        <option value='20+'>20+ CAMP</option>
                        <option value='Parents'>FAMILY CAMP</option>
                      </Field>
                      <ErrorMessage name='workshop' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
                        Message
                      </label>
                      <Field
                        as='textarea'
                        id='message'
                        name='message'
                        className='w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none'
                        rows={4}
                      />
                      <ErrorMessage name='message' component='div' className='text-red-500 text-xs sm:text-sm mt-1' />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-6 max-w-fit mx-auto">
                    <button
                      type='submit'
                      className='bg-indigo-500 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full'
                    >
                      Register
                    </button>
                  </div>
                </Form>
              </Formik>
            </>
          ) : (
            <div className='relative overflow-y-auto scrollbar-hide text-center'>
              <div className='relative inline-block w-full max-w-[250px] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto'>
                <img
                  src='/assets/home/notif.png'
                  alt='Success Image'
                  className='w-full h-full'
                />
                <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-2 sm:p-4 md:p-6'>
                  <h2 className='text-xl sm:text-2xl font-bold text-men-blue sm:mb-2 lg:mb-4'>
                    Success!
                  </h2>
                  <p className='text-sm sm:text-lg text-men-blue'>
                    Your form has been successfully submitted.
                  </p>
                  <button
                    className='mt-2 lg:mt-6 bg-men-blue text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    onClick={() => setShowForm(false)}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkshopForm;