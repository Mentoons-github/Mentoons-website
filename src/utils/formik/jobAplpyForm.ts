import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";

interface JobFormValues {
  name: string;
  email: string;
  phone: string;
  resume: File | null;
  age: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  age: Yup.number()
    .min(18, "Must be at least 18")
    .max(100, "Must be below 100")
    .required("Age is required"),
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
      age: 18,
    },
    validationSchema,
    onSubmit: async (values, formikHelpers) => {
      await onSubmit(values, formikHelpers);
      formikHelpers.resetForm();
    },
  });
};
