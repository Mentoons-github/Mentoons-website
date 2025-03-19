import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type FormValues = {
  fullName: string;
  email: string;
  contactNumber: string;
  whatsappNumber: string;
  useWhatsappNumber: boolean;
  country: string;
  state: string;
  age: string;
  gender: string;
  idea: string;
};

const GroupInfoForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const useWhatsappNumber = watch("useWhatsappNumber")
    ? watch("whatsappNumber")
    : watch("contactNumber");

  const onSubmit = (data: FormValues) => {
    console.log(data);
    //Send data to the Database
    alert(
      "Form submitted successfully! We will get back to you within 48 hours."
    );
  };

  return (
    <div className="p-6 mx-auto w-full max-w-2xl bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Create Group Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name<span className="text-red-500">*</span>
          </label>
          <Input
            id="fullName"
            placeholder="Enter here"
            {...register("fullName", { required: "Name is required" })}
            className={`w-full ${errors.fullName ? "border-red-500" : ""}`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email<span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter here"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`w-full ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number<span className="text-red-500">*</span>
          </label>
          <Input
            id="contactNumber"
            placeholder="Enter here"
            {...register("contactNumber", {
              required: "Contact number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            })}
            className={`w-full ${errors.contactNumber ? "border-red-500" : ""}`}
          />
          {errors.contactNumber && (
            <p className="mt-1 text-xs text-red-500">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        {/* Use as WhatsApp Number Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useWhatsappNumber"
            {...register("useWhatsappNumber")}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="useWhatsappNumber" className="text-sm text-gray-700">
            Use this as my WhatsApp Number
          </label>
        </div>

        {/* WhatsApp Number (conditional) */}
        {!useWhatsappNumber && (
          <div className="space-y-2">
            <label
              htmlFor="whatsappNumber"
              className="block text-sm font-medium text-gray-700"
            >
              WhatsApp Number
            </label>
            <Input
              id="whatsappNumber"
              placeholder="Enter here"
              {...register("whatsappNumber", {
                pattern: {
                  value: /^\d{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              className={`w-full ${
                errors.whatsappNumber ? "border-red-500" : ""
              }`}
            />
            {errors.whatsappNumber && (
              <p className="mt-1 text-xs text-red-500">
                {errors.whatsappNumber.message}
              </p>
            )}
          </div>
        )}

        {/* Country and State */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <div className="relative">
              <select
                id="country"
                {...register("country")}
                className="block px-3 py-2 w-full bg-white rounded-md border border-gray-300 shadow-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
              <div className="flex absolute inset-y-0 right-0 items-center px-2 text-gray-700 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <div className="relative">
              <select
                id="state"
                {...register("state")}
                className="block px-3 py-2 w-full bg-white rounded-md border border-gray-300 shadow-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">City/Area</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
              </select>
              <div className="flex absolute inset-y-0 right-0 items-center px-2 text-gray-700 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <div className="relative">
              <select
                id="age"
                {...register("age")}
                className="block px-3 py-2 w-full bg-white rounded-md border border-gray-300 shadow-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Options</option>
                <option value="under18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
              </select>
              <div className="flex absolute inset-y-0 right-0 items-center px-2 text-gray-700 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                {...register("gender")}
                className="block px-3 py-2 w-full bg-white rounded-md border border-gray-300 shadow-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Options</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              <div className="flex absolute inset-y-0 right-0 items-center px-2 text-gray-700 pointer-events-none">
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-red-400">
              *Identity protection guaranteed
            </p>
          </div>
        </div>

        {/* Idea Description */}
        <div className="pt-4 space-y-2 border-t border-gray-200">
          <label
            htmlFor="idea"
            className="block text-sm font-medium text-gray-700"
          >
            Briefly describe your idea
          </label>
          <textarea
            id="idea"
            {...register("idea", { required: "Please describe your idea" })}
            rows={5}
            placeholder="Answer here"
            className={`block w-full rounded-md border ${
              errors.idea ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
          />
          {errors.idea && (
            <p className="mt-1 text-xs text-red-500">{errors.idea.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="px-4 py-2 w-full font-medium text-white bg-gray-400 rounded-md transition-colors hover:bg-gray-500"
          >
            Submit
          </Button>
          <p className="mt-4 text-sm text-center text-gray-500">
            We will get back to you within 48 hours
          </p>
        </div>
      </form>
    </div>
  );
};

export default GroupInfoForm;
