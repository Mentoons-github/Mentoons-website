import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";

interface JobFormValues {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  gender: string;
  portfolioLink: string;
  coverNote: string;
  coverLetterLink: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Select a valid gender")
    .required("Gender is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid phone number")
    .required("Phone number is required"),
  resume: Yup.mixed<File>()
    .required("Resume is required")
    .test("fileType", "Only PDF files are allowed", (value) => {
      return value instanceof File && value.type === "application/pdf";
    })
    .test("fileSize", "File size should be less than 2MB", (value) => {
      return value instanceof File && value.size <= 2 * 1024 * 1024;
    }),
  portfolioLink: Yup.string()
    .url("Must be a valid URL")
    .required("Portfolio link is required"),
  coverNote: Yup.string()
    .min(50, "Cover note must be at least 50 characters")
    .required("Cover note is required"),
  coverLetterLink: Yup.string()
    .url("Must be a valid URL")
    .required("Cover letter link is required"),
});

type OnSubmitFunction = (
  values: JobFormValues,
  formikHelpers: FormikHelpers<JobFormValues>
) => void;

export const useJobForm = (onSubmit: OnSubmitFunction) => {
  return useFormik<JobFormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      resume: null,
      gender: "",
      portfolioLink: "",
      coverNote: "",
      coverLetterLink: "",
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      await onSubmit(values, formikHelpers);
      formikHelpers.resetForm();
    },
  });
};
