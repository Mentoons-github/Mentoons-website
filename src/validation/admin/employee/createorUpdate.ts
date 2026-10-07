import * as Yup from "yup";

export const EmployeeValidationSchema = Yup.object({
  department: Yup.string().required("Department is required"),
  employmentType: Yup.string()
    .oneOf(["full-time", "part-time", "intern", "contract", "freelance"])
    .required("Employment type is required"),
  salary: Yup.number()
    .typeError("Salary must be a number")
    .positive("Salary must be positive")
    .required("Salary is required"),
  active: Yup.boolean(),
  jobRole: Yup.string().required("Role is required"),
  user: Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    gender: Yup.string()
      .oneOf(["male", "female", "other"])
      .required("Gender is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("is-valid-phone", "Invalid phone number", (value) => {
        if (!value) return false;
        return /^\+?[1-9]\d{1,14}$/.test(value);
      }),
  }),
});
