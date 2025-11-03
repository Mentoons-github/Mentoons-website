import * as Yup from "yup";
import { Admin } from "@/types/admin";

export const initialValue: Partial<Admin> = {
  clerkId: "",
  role: "",
  name: "",
  email: "",
  phoneNumber: "",
  picture: "",
  joinDate: "",
};

export const adminValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});
