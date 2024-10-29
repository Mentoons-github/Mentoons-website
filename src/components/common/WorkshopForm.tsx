import type { AppDispatch, RootState } from "@/redux/store";
import { submitWorkshopForm } from "@/redux/workshopSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import Loader from "./Loader";
import { FaTimes } from "react-icons/fa";

interface FormValues {
  name: string;
  guardianName: string;
  guardianContact: string;
  age: string;
  message: string;
  city: string;
  appliedWorkshop: string;
  guardianEmail: string;
  mobileUsageLevel: string;
  mobileUsageHours: number;
  primaryActivityOnMobile: string;
  isTimeRestricted: boolean;
  restrictionType: string;
  concernsUser: string;
  behavioralChanges: string;
  physicalActivityHours: number;
  physicalActivityFrequency: string;
  confessionFrequency: string;
}

type WorkshopProps = {
  selectedWorkshop?: string;
  setShowForm: (showForm: boolean) => void;
};

const WorkshopForm: React.FC<WorkshopProps> = ({ selectedWorkshop, setShowForm }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loading } = useSelector((state: RootState) => state.workshop);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name can't be longer than 50 characters")
      .required("Name is required"),
    guardianName: Yup.string().required("Guardian name is required"),
    guardianContact: Yup.string()
      .matches(/^\d{10}$/, "Guardian contact must be a 10-digit number")
      .required("Guardian contact is required"),
    age: Yup.number()
      .min(1, "Age must be a positive number")
      .max(100, "Age must be less than 100")
      .required("Age is required")
      .typeError("Age must be a number"),
    message: Yup.string().required("Message is required"),
    city: Yup.string().required("City is required"),
    guardianEmail: Yup.string().email('Invalid email address').required('Guardian email is required'),
    mobileUsageLevel: Yup.string().required('Mobile usage level is required'),
    mobileUsageHours: Yup.number().min(0, 'Must be a positive number').required('Mobile usage hours is required'),
    primaryActivityOnMobile: Yup.string().oneOf(['WATCHING_VIDEOS', 'PLAYING_GAMES', 'CHATTING', 'OTHERS'], 'Invalid primary activity').required('Primary activity on mobile is required'),
    isTimeRestricted: Yup.boolean(),
    restrictionType: Yup.string().oneOf(['TIME_LIMIT', 'SPECIFIC TIME', 'TYPE_OF_ACTIVITY', 'OTHERS'], 'Invalid restriction type'),
    concernsUser: Yup.string().oneOf(['EXCESSIVE_SCREEN_TIME', 'IMPACT_ON_SOCIAL_SKILLS', 'LACK_OF_PHYSICAL_ACTIVITY', 'OTHERS'], 'Invalid user concern').required('User concerns are required'),
    behavioralChanges: Yup.string().oneOf(['CONCENTRATION', 'IRRITABILITY', 'SLEEPING', 'LESS_INTEREST', 'OTHERS'], 'Invalid behavioral change').required('Behavioral changes are required'),
    physicalActivityHours: Yup.number().min(0, 'Must be a positive number').required('Physical activity hours is required'),
    physicalActivityFrequency: Yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH'], 'Invalid physical activity frequency').required('Physical activity frequency is required'),
    confessionFrequency: Yup.string().oneOf(['FREQUENTLY', 'OCCASIONALLY', 'RARELY'], 'Invalid confession frequency').required('Confession frequency is required'),
  });

  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    try {
      const actionResult = await dispatch(submitWorkshopForm(values));
      if (submitWorkshopForm.fulfilled.match(actionResult)) {
        setIsSubmitted(true);
        toast.success("Form submitted successfully");
      } else {
        toast.error("Form submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const rendrWorkshop = (selectedWorkshop: string) => {
    switch (selectedWorkshop) {
      case "6-12":
        return "BUDDY CAMP";
      case "13-19":
        return "TEEN CAMP";
      case "20+":
        return "FAMILY CAMP";
      case "parents":
        return "FAMILY CAMP";
      default:
        return "BUDDY CAMP";
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container  mx-auto px-4 py-8">
        <div
          className={`relative ${
            !isSubmitted ? "bg-white" : "bg-transparent"
          } p-6  rounded-lg max-w-6xl mx-auto shadow-lg`}
        >
          {!isSubmitted ? (
            <div className="h-[80vh]  overflow-auto relative">
                     <FaTimes className="absolute top-0 right-0 text-2xl text-black" onClick={() => setShowForm(false)}/>
              <h2 className='text-3xl font-bold mb-8 text-center text-indigo-600'>
                {selectedWorkshop} Registration
              </h2>
              <Formik<FormValues>
                initialValues={{
                  name: "",
                  guardianName: "",
                  guardianContact: "",
                  age: "",
                  message: "",
                  city: "",
                  appliedWorkshop: rendrWorkshop(selectedWorkshop ?? ""),
                  guardianEmail: "",
                  mobileUsageLevel: "",
                  mobileUsageHours: 0,
                  primaryActivityOnMobile: "",
                  isTimeRestricted: false,
                  restrictionType: "",
                  concernsUser: "",
                  behavioralChanges: "",
                  physicalActivityHours: 0,
                  physicalActivityFrequency: "",
                  confessionFrequency: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <div>
                      <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                        Child's Name
                      </label>
                      <Field
                        id='name'
                        name='name'
                        type='text'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='name' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='guardianName' className='block text-sm font-medium text-gray-700 mb-1'>
                        Guardian's/Parent's Name
                      </label>
                      <Field
                        id='guardianName'
                        name='guardianName'
                        type='text'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='guardianName' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='guardianContact' className='block text-sm font-medium text-gray-700 mb-1'>
                        Guardian's/Parent's Contact
                      </label>
                      <Field
                        id='guardianContact'
                        name='guardianContact'
                        type='text'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='guardianContact' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='age' className='block text-sm font-medium text-gray-700 mb-1'>
                        Child's Age
                      </label>
                      <Field
                        id='age'
                        name='age'
                        type='text'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='age' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-1'>
                        City
                      </label>
                      <Field
                        id='city'
                        name='city'
                        type='text'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='city' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='guardianEmail' className='block text-sm font-medium text-gray-700 mb-1'>
                        Guardian's Email
                      </label>
                      <Field
                        id='guardianEmail'
                        name='guardianEmail'
                        type='email'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='guardianEmail' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='mobileUsageLevel' className='block text-sm font-medium text-gray-700 mb-1'>
                        Mobile Usage Level
                      </label>
                      <Field
                        as='select'
                        id='mobileUsageLevel'
                        name='mobileUsageLevel'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select usage level</option>
                        <option value='LOW'>Low</option>
                        <option value='MEDIUM'>Medium</option>
                        <option value='HIGH'>High</option>
                      </Field>
                      <ErrorMessage name='mobileUsageLevel' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='mobileUsageHours' className='block text-sm font-medium text-gray-700 mb-1'>
                        Mobile Usage Hours (per day)
                      </label>
                      <Field
                        id='mobileUsageHours'
                        name='mobileUsageHours'
                        type='number'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='mobileUsageHours' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='primaryActivityOnMobile' className='block text-sm font-medium text-gray-700 mb-1'>
                        Primary Activity on Mobile
                      </label>
                      <Field
                        as='select'
                        id='primaryActivityOnMobile'
                        name='primaryActivityOnMobile'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select primary activity</option>
                        <option value='WATCHING_VIDEOS'>Watching Videos</option>
                        <option value='PLAYING_GAMES'>Playing Games</option>
                        <option value='CHATTING'>Chatting</option>
                        <option value='OTHERS'>Others</option>
                      </Field>
                      <ErrorMessage name='primaryActivityOnMobile' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div className='flex items-center'>
                      <Field
                        id='isTimeRestricted'
                        name='isTimeRestricted'
                        type='checkbox'
                        className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                      />
                      <label htmlFor='isTimeRestricted' className='ml-2 block text-sm text-gray-900'>
                        Is Time Restricted?
                      </label>
                    </div>
                    <div>
                      <label htmlFor='restrictionType' className='block text-sm font-medium text-gray-700 mb-1'>
                        Restriction Type
                      </label>
                      <Field
                        as='select'
                        id='restrictionType'
                        name='restrictionType'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select restriction type</option>
                        <option value='TIME_LIMIT'>Time Limit</option>
                        <option value='SPECIFIC TIME'>Specific Time</option>
                        <option value='TYPE_OF_ACTIVITY'>Type of Activity</option>
                        <option value='OTHERS'>Others</option>
                      </Field>
                      <ErrorMessage name='restrictionType' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='physicalActivityHours' className='block text-sm font-medium text-gray-700 mb-1'>
                        Physical Activity Hours (per week)
                      </label>
                      <Field
                        id='physicalActivityHours'
                        name='physicalActivityHours'
                        type='number'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      />
                      <ErrorMessage name='physicalActivityHours' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='physicalActivityFrequency' className='block text-sm font-medium text-gray-700 mb-1'>
                        Physical Activity Frequency
                      </label>
                      <Field
                        as='select'
                        id='physicalActivityFrequency'
                        name='physicalActivityFrequency'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select frequency</option>
                        <option value='LOW'>Low</option>
                        <option value='MEDIUM'>Medium</option>
                        <option value='HIGH'>High</option>
                      </Field>
                      <ErrorMessage name='physicalActivityFrequency' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='confessionFrequency' className='block text-sm font-medium text-gray-700 mb-1'>
                        Confession Frequency
                      </label>
                      <Field
                        as='select'
                        id='confessionFrequency'
                        name='confessionFrequency'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select frequency</option>
                        <option value='FREQUENTLY'>Frequently</option>
                        <option value='OCCASIONALLY'>Occasionally</option>
                        <option value='RARELY'>Rarely</option>
                      </Field>
                      <ErrorMessage name='confessionFrequency' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='concernsUser' className='block text-sm font-medium text-gray-700 mb-1'>
                        User Concerns
                      </label>
                      <Field
                        as='select'
                        id='concernsUser'
                        name='concernsUser'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select user concern</option>
                        <option value='EXCESSIVE_SCREEN_TIME'>Excessive Screen Time</option>
                        <option value='IMPACT_ON_SOCIAL_SKILLS'>Impact on Social Skills</option>
                        <option value='LACK_OF_PHYSICAL_ACTIVITY'>Lack of Physical Activity</option>
                        <option value='OTHERS'>Others</option>
                      </Field>
                      <ErrorMessage name='concernsUser' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='behavioralChanges' className='block text-sm font-medium text-gray-700 mb-1'>
                        Behavioral Changes
                      </label>
                      <Field
                        as='select'
                        id='behavioralChanges'
                        name='behavioralChanges'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select behavioral change</option>
                        <option value='CONCENTRATION'>Concentration</option>
                        <option value='IRRITABILITY'>Irritability</option>
                        <option value='SLEEPING'>Sleeping</option>
                        <option value='LESS_INTEREST'>Less Interest</option>
                        <option value='OTHERS'>Others</option>
                      </Field>
                      <ErrorMessage name='behavioralChanges' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                    <div>
                      <label htmlFor='duration' className='block text-sm font-medium text-gray-700 mb-1'>
                        Duration
                      </label>
                      <Field
                        as='select'
                        id='duration'
                        name='duration'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition'
                      >
                        <option value=''>Select duration</option>
                        <option value='2days'>2 days</option>
                        <option value='6months'>6 months</option>
                        <option value='12months'>12 months</option>
                      </Field>
                    </div>
                    <div>
                      <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
                        Message
                      </label>
                      <Field
                        as='textarea'
                        id='message'
                        name='message'
                        className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none'
                        rows={4}
                      />
                      <ErrorMessage name='message' component='div' className='text-red-500 text-sm mt-1' />
                    </div>
                  </div>
                  <div className='text-center mt-8'>
                    <button
                      type='submit'
                      className='bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    >
                      Register
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          ) : (
            <div className='relative overflow-y-scroll text-center'>
              <div className='relative inline-block w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto'>
                <img
                  src='/assets/home/notif.png'
                  alt='Success Image'
                  className='w-full h-full'
                />
                <div className='absolute inset-0 flex flex-col justify-center items-center text-center p-4 sm:p-6'>
                  <h2 className='text-2xl font-bold text-men-blue lg:mb-4'>
                    Success!
                  </h2>
                  <p className='text-lg text-men-blue'>
                    Your form has been successfully submitted.
                  </p>
                  <button
                    className='lg:mt-6 bg-men-blue text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                    onClick={() => navigate("/")}
                  >
                    Go Home
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