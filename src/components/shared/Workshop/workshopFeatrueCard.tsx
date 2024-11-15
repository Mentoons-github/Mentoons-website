import axiosInstance from "@/api/axios";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Define the type for feature items
interface FeatureItem {
  id: string; // or number, depending on your data structure
  label: string;
  description: string;
}

import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  interestedTopic: Yup.array().required("Interested topic is required"),
});
interface ApiResponse {
  success: boolean;
  data?: unknown; // You can replace 'any' with the actual data type you expect
  message?: string; // Optional error or success message
}
interface WorkshopFeatureCard2Props {
  featureData: {
    id: string;
    heading: string;
    subHeading: string;
    color: string;
    textColor: string;
    features: { id: string; label: string; description: string }[];
  };
  selectedFeature: string[];
  handleChange: (feature: string) => void;

  // setShowFeatureCard: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkshopFeatureCard = ({
  featureData,
  selectedFeature,
}: // setShowFeatureCard,
WorkshopFeatureCard2Props) => {
  interface REQUEST_CALL_DATA {
    name: string;
    phone: string;
    email: string;
    interestedTopic: string[];
  }

  const handleSubmit = async (
    values: REQUEST_CALL_DATA,
    { setSubmitting }: FormikHelpers<REQUEST_CALL_DATA>
  ) => {
    try {
      const WorkshopFeatureCardFormData = {
        ...values,
        interestedTopic: selectedFeature,
      };

      const response = await axiosInstance.post<ApiResponse>(
        "https://mentoons-backend-zlx3.onrender.com/api/v1/call-requests",
        JSON.stringify(WorkshopFeatureCardFormData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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
    <div className="w-full">
      <div
        className={`text-center rounded-t-lg py-4`}
        style={{
          backgroundColor: `${featureData.color}`,
          color: `${featureData.textColor}`,
        }}
      >
        <p className="text-2xl font-bold p-1">{featureData.heading}</p>
        <p className="p-1 te">{featureData.subHeading}</p>

        {/* <div className="absolute top-2 right-2 text-3xl text-purple-950">
          <IoIosClose />
        </div> */}
      </div>
      <div className="p-4">
        {featureData.features?.map((item: FeatureItem) => (
          <div key={item.id} style={{ color: `${featureData.textColor}` }}>
            <p className="text-xl font-bold">{item.label} : </p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <div
        className={`m-4 mt-0 p-4 
          
         rounded-2xl`}
        style={{ backgroundColor: `${featureData.color}` }}
      >
        <Formik
          initialValues={{
            name: "",
            phone: "",
            email: "",
            interestedTopic: [] as string[],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          className=""
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form>
              <div className="w-full flex flex-col items-start  gap-4  ">
                <div className="flex flex-wrap whitespace-nowrap items-center gap-4">
                  <h2
                    className="text-xl font-bold "
                    style={{ color: `${featureData.textColor}` }}
                  >
                    Interested Topic:{" "}
                  </h2>
                  {selectedFeature.length > 0 &&
                    selectedFeature.map((item) => (
                      <div
                        key={item}
                        className="bg-white  flex gap-4 items-center  px-4 p-1 rounded-full"
                        style={{ color: `${featureData.textColor}` }}
                      >
                        <p className="text-sm">{item}</p>
                      </div>
                    ))}
                </div>
                <div className="w-full flex gap-4 items-center justify-center">
                  <label
                    htmlFor="name"
                    className="text-xl font-bold flex flex-[0.5]"
                    style={{ color: `${featureData.textColor}` }}
                  >
                    Name
                  </label>
                  <div className="w-full flex flex-[1.05] flex-col">
                    <Field
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      className=" border box-border  flex-1 p-2 rounded-lg"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className=" text-black text-sm"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-4 items-center justify-center">
                  <label
                    htmlFor="phone"
                    className="text-xl font-bold flex flex-[0.5]"
                    style={{ color: `${featureData.textColor}` }}
                  >
                    Mobile Number
                  </label>
                  <div className="w-full flex flex-[1.05] flex-col">
                    <Field
                      name="phone"
                      type="text"
                      placeholder="Enter your mobile number"
                      className=" border box-border  flex-1 p-2 rounded-lg"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-black text-sm"
                    />
                  </div>
                </div>
                <div className="w-full flex gap-4 items-center justify-center">
                  <label
                    htmlFor="email"
                    className="text-xl font-bold flex flex-[0.5]"
                    style={{ color: `${featureData.textColor}` }}
                  >
                    Email
                  </label>
                  <div className="w-full flex flex-[1.05] flex-col">
                    <Field
                      name="email"
                      type="text"
                      placeholder="Enter your Email"
                      className=" border box-border  flex-1 p-2 rounded-lg"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-black text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty} // Enable only if valid and dirty
                className=" text-white w-full p-2 rounded-full  transition-all duration-300 cursor-pointer whitespace-nowrap text-ellipsis mt-4 group hover:opacity-85"
                style={{ backgroundColor: `${featureData.textColor}` }}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <Link
                to={"https://wa.me/+919036033300"}
                className="p-2 rounded-full text-white text-center font-bold mt-4 border-none flex items-center justify-center gap-4  group hover:bg-green-400 "
                style={{ backgroundColor: `${featureData.textColor}` }}
              >
                <SiWhatsapp className="group-hover:scale-125 transition-all duration-300 text-xl" />
                <span className="group-hover:scale-110 transition-all  duration-300">
                  Join our WhatsApp Community
                </span>
              </Link>
            </Form>
          )}
        </Formik>
      </div>

      <div className="p-4 text-sm text-center">
        Click 'Request Call' to schedule your free{" "}
        <span className="font-bold">10-minute Complementary call</span>
        <span className="font-bold"> *Available</span> : Monday To Friday,
        Business Hours : 10.00 Am To 6.00 Pm
      </div>
    </div>
  );
};

export default WorkshopFeatureCard;
