import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCheck, FaLinkedin, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { FiInstagram, FiYoutube } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import * as Yup from "yup";

const MentoonsInfulencerRequestModal = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const totalSteps = 3;

  const validationSchema = Yup.object({
    // Step 1: Personal Information
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    age: Yup.number()
      .min(13, "You must be at least 13 years old")
      .required("Age is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),

    // Step 2: Social Media Profiles
    instagramHandle: Yup.string().required("Instagram handle is required"),
    instagramFollowers: Yup.number().required(
      "Instagram followers count is required"
    ),
    youtubeChannel: Yup.string(),
    youtubeSubscribers: Yup.number(),
    twitterHandle: Yup.string(),
    twitterFollowers: Yup.number(),
    tiktokHandle: Yup.string(),
    tiktokFollowers: Yup.number(),
    linkedinProfile: Yup.string(),
    linkedinConnections: Yup.number(),

    // Step 3: Experience and Motivation
    niche: Yup.string().required("Content niche is required"),
    experience: Yup.string().required("Experience details are required"),
    motivation: Yup.string()
      .required("Please tell us why you want to join")
      .min(50, "Please provide at least 50 characters"),
    mentorshipInterest: Yup.boolean().required("Please select yes or no"),
    agreeTerms: Yup.boolean()
      .oneOf([true], "You must agree to the terms and conditions")
      .required("You must agree to the terms and conditions"),
  });

  const formik = useFormik({
    initialValues: {
      // Step 1: Personal Information
      fullName: "",
      email: "",
      phone: "",
      age: "",
      city: "",
      state: "",

      // Step 2: Social Media Profiles
      instagramHandle: "",
      instagramFollowers: "",
      youtubeChannel: "",
      youtubeSubscribers: "",
      twitterHandle: "",
      twitterFollowers: "",
      tiktokHandle: "",
      tiktokFollowers: "",
      linkedinProfile: "",
      linkedinConnections: "",

      // Step 3: Experience and Motivation
      niche: "",
      experience: "",
      motivation: "",
      mentorshipInterest: false,
      agreeTerms: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        console.log("Form values:", values);

        const response = await axios.post(
          `${import.meta.env.VITE_PROD_URL}/influencer-requests`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data.data);

        toast.success("Your application has been submitted successfully!");
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to submit your application. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const nextStep = () => {
    if (step === 1) {
      const step1Fields = [
        "fullName",
        "email",
        "phone",
        "age",
        "city",
        "state",
      ];
      const step1Errors = Object.keys(formik.errors).filter(
        (key) =>
          step1Fields.includes(key) &&
          formik.touched[key as keyof typeof formik.touched]
      );

      if (step1Errors.length === 0) {
        setStep(2);
        window.scrollTo(0, 0);
      } else {
        // Highlight errors
        step1Fields.forEach((field) => {
          if (!formik.touched[field as keyof typeof formik.touched]) {
            formik.setFieldTouched(field, true, true);
          }
        });
      }
    } else if (step === 2) {
      const step2Fields = ["instagramHandle", "instagramFollowers"];
      const step2Errors = Object.keys(formik.errors).filter(
        (key) =>
          step2Fields.includes(key) &&
          formik.touched[key as keyof typeof formik.touched]
      );

      if (step2Errors.length === 0) {
        setStep(3);
        window.scrollTo(0, 0);
      } else {
        // Highlight errors
        step2Fields.forEach((field) => {
          if (!formik.touched[field as keyof typeof formik.touched]) {
            formik.setFieldTouched(field, true, true);
          }
        });
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (showSuccessModal) {
    return (
      <DialogContent className="sm:max-w-[500px] bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
            <FaCheck className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Application Submitted!
          </h2>
          <p className="mb-6 text-gray-600">
            Thank you for applying to become a Mentoons Influencer. We've
            received your application and will review it shortly.
          </p>

          <div className="p-4 mb-6 text-left border border-orange-200 rounded-lg bg-orange-50">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              What happens next?
            </h3>
            <ul className="pl-5 text-sm text-gray-600 list-disc">
              <li className="mb-1">
                Our team will review your application within 5-7 business days
              </li>
              <li className="mb-1">
                We'll contact you via email with our decision
              </li>
              <li>
                If selected, you'll receive an invitation to join our influencer
                program
              </li>
            </ul>
          </div>

          <Button
            onClick={onClose}
            className="text-white bg-orange-600 hover:bg-orange-700"
          >
            Close
          </Button>
        </motion.div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white">
      <DialogHeader className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-1 transition-colors duration-200 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <IoClose size={18} />
        </button>
        <DialogTitle className="text-2xl font-bold text-orange-600">
          Become a Mentoons Influencer
        </DialogTitle>
        <div className="mt-2 mb-4 ">
          <div className="flex justify-between mb-2 ">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className="flex items-center "
                style={{ width: `${100 / totalSteps}%` }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > index + 1
                      ? "bg-green-500 text-white"
                      : step === index + 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width: step > index + 1 ? "100%" : "0%",
                        transition: "width 0.3s ease-in-out",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex text-xs text-gray-500">
            <span style={{ width: `${100 / totalSteps}%` }}>Personal Info</span>
            <span style={{ width: `${100 / totalSteps}%` }}>Social Media</span>
            <span style={{ width: `${100 / totalSteps}%` }}>Experience</span>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={formik.handleSubmit}>
        {step === 1 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="fullName"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.fullName && formik.errors.fullName
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.fullName}
                </div>
              )}
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              variants={itemVariants}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="mt-1 text-xs text-red-500">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="mt-1 text-xs text-red-500">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="age"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Age <span className="text-red-500">*</span>
              </label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Your age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.age && formik.errors.age
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.age && formik.errors.age && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.age}
                </div>
              )}
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              variants={itemVariants}
            >
              <div>
                <label
                  htmlFor="city"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Your city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.city && formik.errors.city
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.city && formik.errors.city && (
                  <div className="mt-1 text-xs text-red-500">
                    {formik.errors.city}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <Input
                  id="state"
                  name="state"
                  placeholder="Your state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.touched.state && formik.errors.state
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.state && formik.errors.state && (
                  <div className="mt-1 text-xs text-red-500">
                    {formik.errors.state}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div className="mb-6" variants={itemVariants}>
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Social Media Profiles
              </h3>
              <p className="text-sm text-gray-500">
                Please share your social media handles and follower counts.
                Instagram is required, others are optional.
              </p>
            </motion.div>

            <motion.div className="space-y-6" variants={itemVariants}>
              {/* Instagram (Required) */}
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-center mb-3">
                  <FiInstagram className="mr-2 text-orange-600" size={20} />
                  <h4 className="font-medium text-gray-800">
                    Instagram <span className="text-red-500">*</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="instagramHandle"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <Input
                      id="instagramHandle"
                      name="instagramHandle"
                      placeholder="@username"
                      value={formik.values.instagramHandle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.instagramHandle &&
                        formik.errors.instagramHandle
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {formik.touched.instagramHandle &&
                      formik.errors.instagramHandle && (
                        <div className="mt-1 text-xs text-red-500">
                          {formik.errors.instagramHandle}
                        </div>
                      )}
                  </div>

                  <div>
                    <label
                      htmlFor="instagramFollowers"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Followers
                    </label>
                    <Input
                      id="instagramFollowers"
                      name="instagramFollowers"
                      type="number"
                      placeholder="Number of followers"
                      value={formik.values.instagramFollowers}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={
                        formik.touched.instagramFollowers &&
                        formik.errors.instagramFollowers
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {formik.touched.instagramFollowers &&
                      formik.errors.instagramFollowers && (
                        <div className="mt-1 text-xs text-red-500">
                          {formik.errors.instagramFollowers}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* YouTube (Optional) */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <FiYoutube className="mr-2 text-red-600" size={20} />
                  <h4 className="font-medium text-gray-800">
                    YouTube (Optional)
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="youtubeChannel"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Channel Name
                    </label>
                    <Input
                      id="youtubeChannel"
                      name="youtubeChannel"
                      placeholder="Your channel name"
                      value={formik.values.youtubeChannel}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="youtubeSubscribers"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Subscribers
                    </label>
                    <Input
                      id="youtubeSubscribers"
                      name="youtubeSubscribers"
                      type="number"
                      placeholder="Number of subscribers"
                      value={formik.values.youtubeSubscribers}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>

              {/* Twitter/X (Optional) */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaXTwitter className="mr-2 text-gray-800" size={18} />
                  <h4 className="font-medium text-gray-800">
                    Twitter/X (Optional)
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="twitterHandle"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <Input
                      id="twitterHandle"
                      name="twitterHandle"
                      placeholder="@username"
                      value={formik.values.twitterHandle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="twitterFollowers"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Followers
                    </label>
                    <Input
                      id="twitterFollowers"
                      name="twitterFollowers"
                      type="number"
                      placeholder="Number of followers"
                      value={formik.values.twitterFollowers}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>

              {/* TikTok (Optional) */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaTiktok className="mr-2 text-gray-800" size={18} />
                  <h4 className="font-medium text-gray-800">
                    TikTok (Optional)
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="tiktokHandle"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <Input
                      id="tiktokHandle"
                      name="tiktokHandle"
                      placeholder="@username"
                      value={formik.values.tiktokHandle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tiktokFollowers"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Followers
                    </label>
                    <Input
                      id="tiktokFollowers"
                      name="tiktokFollowers"
                      type="number"
                      placeholder="Number of followers"
                      value={formik.values.tiktokFollowers}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>

              {/* LinkedIn (Optional) */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaLinkedin className="mr-2 text-blue-600" size={18} />
                  <h4 className="font-medium text-gray-800">
                    LinkedIn (Optional)
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="linkedinProfile"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Profile URL
                    </label>
                    <Input
                      id="linkedinProfile"
                      name="linkedinProfile"
                      placeholder="https://linkedin.com/in/username"
                      value={formik.values.linkedinProfile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="linkedinConnections"
                      className="block mb-1 text-sm font-medium text-gray-700"
                    >
                      Connections
                    </label>
                    <Input
                      id="linkedinConnections"
                      name="linkedinConnections"
                      type="number"
                      placeholder="Number of connections"
                      value={formik.values.linkedinConnections}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            <motion.div variants={itemVariants}>
              <label
                htmlFor="niche"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Content Niche <span className="text-red-500">*</span>
              </label>
              <select
                id="niche"
                name="niche"
                value={formik.values.niche}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border ${
                  formik.touched.niche && formik.errors.niche
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="">Select your primary content niche</option>
                <option value="education">Education</option>
                <option value="parenting">Parenting</option>
                <option value="children_entertainment">
                  Children Entertainment
                </option>
                <option value="family_lifestyle">Family Lifestyle</option>
                <option value="mental_health">Mental Health</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.niche && formik.errors.niche && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.niche}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="experience"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Content Creation Experience{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                placeholder="Describe your experience with content creation. How long have you been creating content? What type of content do you create?"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border ${
                  formik.touched.experience && formik.errors.experience
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {formik.touched.experience && formik.errors.experience && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.experience}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="motivation"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Why Mentoons? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={4}
                placeholder="Why do you want to become a Mentoons influencer? How do you think you can contribute to our mission of promoting positive values and mental health awareness among children?"
                value={formik.values.motivation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border ${
                  formik.touched.motivation && formik.errors.motivation
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {formik.touched.motivation && formik.errors.motivation && (
                <div className="mt-1 text-xs text-red-500">
                  {formik.errors.motivation}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="mentorshipInterest"
                    name="mentorshipInterest"
                    type="checkbox"
                    checked={formik.values.mentorshipInterest}
                    onChange={formik.handleChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="mentorshipInterest"
                    className="font-medium text-gray-700"
                  >
                    I am interested in mentoring children through Mentoons
                    programs
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formik.values.agreeTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 ${
                      formik.touched.agreeTerms && formik.errors.agreeTerms
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="agreeTerms"
                    className="font-medium text-gray-700"
                  >
                    I agree to Mentoons' terms and conditions{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    By submitting this form, I agree to Mentoons' privacy policy
                    and allow Mentoons to contact me regarding my application.
                  </p>
                  {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                    <div className="mt-1 text-xs text-red-500">
                      {formik.errors.agreeTerms}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="text-orange-600 border-orange-500 hover:bg-orange-50 hover:text-orange-700"
            >
              Back
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          )}

          {step < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className="text-white bg-orange-600 hover:bg-orange-700"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </Button>
          )}
        </div>
      </form>
    </DialogContent>
  );
};

export default MentoonsInfulencerRequestModal;
