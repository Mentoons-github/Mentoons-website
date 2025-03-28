import * as Yup from "yup";
import { useFormik, FormikHelpers } from "formik";

interface SessionFormValues {
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  description: string;
}

type OnSubmitFunction = (
  values: SessionFormValues,
  formikHelpers: FormikHelpers<SessionFormValues>
) => void;

export const useSessionForm = (onSubmit: OnSubmitFunction) => {
  return useFormik<SessionFormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      selectedDate: "",
      selectedTime: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, "Too short").required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      selectedDate: Yup.string()
        .required("Date is required")
        .test(
          "is-weekday",
          "Bookings are not available on Saturdays and Sundays",
          (value) => {
            if (!value) return false;
            const date = new Date(value);
            const day = date.getDay();
            return day !== 0 && day !== 6;
          }
        ),
      selectedTime: Yup.string()
        .required("Time is required")
        .test(
          "is-valid-time",
          "Please select a time between 10:00 AM and 8:00 PM",
          (value) => {
            if (!value) return false;
            const [hours] = value.split(":").map(Number);
            return hours >= 10 && hours < 20;
          }
        ),
      description: Yup.string().max(200, "Max 200 characters"),
    }),
    onSubmit: async (values, formikHelpers) => {
      await onSubmit(values, formikHelpers);
      formikHelpers.resetForm();
    },
  });
};
