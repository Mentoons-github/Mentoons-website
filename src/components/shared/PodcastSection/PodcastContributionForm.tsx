import axiosInstance from "@/api/axios";
import { uploadFile } from "@/redux/fileUploadSlice";
import { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import * as Yup from "yup";

interface ApiResponse {
  success: boolean;
  data?: unknown; // You can replace 'any' with the actual data type you expect
  message?: string; // Optional error or success message
}

interface PodcastFormData {
  name: string;
  email: string;
  age: 0;
  location: string;
  topic: string;
  description: string;
  audiofile: File;
  thumbnail?: File;
  category: string;
}

// const validationSchema = Yup.object({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   age: Yup.number()
//     .typeError("Age must be a number")
//     .positive("Age must be a positive number")
//     .required("Age is required"),
//   location: Yup.string().required("Location is required"),
//   topic: Yup.string().required("Topic is required"),
//   description: Yup.string().required("Description is required"),
//   audiofile: Yup.string().required("Audio file is required"),
//   thumbnail: Yup.string(),
//   category: Yup.string().required("Category is required"),
// });
const PodcastContributionForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();

  const handleSubmit = async (
    values: PodcastFormData,
    { setSubmitting }: FormikHelpers<PodcastFormData>,
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        navigate("/sign-in");
        return toast.error("Login first to apply");
      }

      const audioFileAction = await dispatch(
        uploadFile({ file: values.audiofile, getToken: async () => token }),
      );

      let thumbnailUrl;
      if (values.thumbnail) {
        const thumbnailFileAction = await dispatch(
          uploadFile({ file: values.thumbnail, getToken: async () => token }),
        );
        console.log(thumbnailFileAction, "ppp");
        thumbnailUrl = thumbnailFileAction.payload?.data?.imageUrl;
      }

      const audioFileUrl = audioFileAction.payload?.data?.imageUrl;

      if (!audioFileUrl) {
        return toast.error("Failed to upload audio file");
      }
      const podcastContributionFormData = {
        ...values,
        audiofile: audioFileUrl,
        thumbnail: thumbnailUrl,
      };

      const response = await axiosInstance.post<ApiResponse>(
        "/userContribution",
        JSON.stringify(podcastContributionFormData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // The data from the response is in response.data
      const res: ApiResponse = response.data;
      if (res.success) {
        toast(`✅ ${res.message}`);
        window.location.reload();
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      toast(`❌ ${err}`);
    } finally {
      setSubmitting(false); // Stops the loading state after form submission
    }
  };
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        age: 0,
        location: "",
        topic: "",
        description: "",
        audiofile: undefined as unknown as File,
        thumbnail: undefined as unknown as File,
        category: "",
      }} // Must match FormValues type
      // validationSchema={validationSchema}
      onSubmit={handleSubmit}
      // Correctly passing the handleSubmit
      className="w-full"
    >
      {(
        { setFieldValue, isSubmitting, isValid, dirty }, // Added isValid and dirty
      ) => (
        <Form className="w-full flex flex-col gap-2">
          <div className="w-full box-border  flex flex-wrap md:flex-nowrap gap-4 ">
            <div className="w-full">
              <label htmlFor="name" className="text-lg font-bold text-gray-700">
                Name
              </label>
              <Field
                name="name"
                type="text"
                className="w-full p-2 px-4 border rounded-full focus:outline-primary"
                placeholder="Enter your name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-800 text-[14px]"
              />
            </div>
            <div className="w-full">
              <label htmlFor="name" className="text-lg font-bold text-gray-700">
                Email
              </label>
              <Field
                name="email"
                type="email"
                className="w-full p-2 px-4 border rounded-full focus:outline-primary"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-800 text-[14px]"
              />
            </div>
          </div>
          <div className="w-full box-border"></div>
          <div className="w-full box-border flex  flex-wrap md:flex-nowrap items-center gap-4">
            <div className="w-full ">
              <label htmlFor="name" className="text-lg font-bold text-gray-700">
                Age
              </label>
              <Field
                name="age"
                type="text"
                className="w-full p-2 px-4 border rounded-full focus:outline-primary"
                placeholder="Enter your age"
              />
              <ErrorMessage
                name="age"
                component="div"
                className="text-red-800 text-[14px]"
              />
            </div>
            <div className="w-full">
              <label htmlFor="name" className="text-lg font-bold text-gray-700">
                Location
              </label>
              <Field
                name="location"
                type="text"
                className="w-full p-2 px-4 border rounded-full focus:outline-primary"
                placeholder="Enter your city"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-800 text-[14px]"
              />
            </div>
          </div>
          <div className="w-full box-border flex flex-wrap md:flex-nowrap gap-4">
            <div className="w-full">
              <label htmlFor="name" className="text-lg font-bold text-gray-700">
                Topic
              </label>
              <Field
                name="topic"
                type="text"
                className="w-full p-2 px-4 border rounded-full  focus:outline-primary"
                placeholder="Enter the topic"
              />
              <ErrorMessage
                name="topic"
                component="div"
                className="text-red-800 text-[14px]"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="category"
                className="text-lg font-bold text-gray-700"
              >
                Category
              </label>
              <Field
                name="category"
                as="select"
                className="w-full p-2 px-4 border rounded-full focus:outline-primary"
              >
                <option value="">Select a category</option>
                <option value="mobile-de-addiction">Mobile De-Addiction</option>
                <option value="performance-addiction">
                  Performance Addiction
                </option>
                <option value="social-media-de-addiction">
                  Social Media De-Addiction
                </option>
                <option value="entertainment-de-addiction">
                  Entertainment De-Addiction
                </option>
                <option value="whatsapp-etiquette">Whatsapp Etiquette</option>
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-800 text-[14px]"
              />
            </div>
          </div>
          <div className="w-full box-border">
            <label htmlFor="name" className="text-lg font-bold text-gray-700">
              Description
            </label>
            <Field
              name="description"
              as="textarea"
              className="w-full p-2 px-4  border rounded focus:outline-primary"
              placeholder="Enter the description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-800 text-[14px]"
            />
          </div>
          <div className="w-full box-border flex  flex-wrap md:flex-nowrap items-center gap-4">
            <div className="w-full">
              <label htmlFor="productFile">Audio File</label>
              <input
                id="audiofile"
                name="audiofile"
                type="file"
                accept="audio/*"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  setFieldValue("audiofile", files ? files[0] : null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="audiofile"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="w-full">
              <label htmlFor="productThumbnail">Thumbnail (Image)</label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  setFieldValue("thumbnail", files ? files[0] : null);
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="thumbnail"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div className="w-full box-border"></div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || !dirty} // Enable only if valid and dirty
            className="bg-orange-600 text-white w-full p-2 rounded-full hover:bg-orange-700 transition-all duration-300 cursor-pointer whitespace-nowrap text-ellipsis"
          >
            {isSubmitting ? "Submitting..." : "Submit you podcast"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PodcastContributionForm;
