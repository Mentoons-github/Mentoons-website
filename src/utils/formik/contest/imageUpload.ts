import * as yup from "yup";

export interface ContestUpload {
  name: string;
  mobile: number | null;
  age: number;
  fileUrl: string[];
  category: string;
}

export const uploadInitialValues: ContestUpload = {
  name: "",
  mobile: null,
  age: 18,
  fileUrl: [],
  category: "",
};

const categories = [
  "social media logos",
  "accessories",
  "daily stationary items",
  "gadgets",
  "musicians",
  "animated movie characters",
] as const;

export const validationSchema = yup.object({
  name: yup.string().required("Please enter your name").trim(),
  mobile: yup
    .number()
    .required("Please enter your mobile number")
    .typeError("Mobile must be a number"),
  age: yup.number().required("Please enter your age").min(5),
  fileUrl: yup
    .array()
    .of(yup.string())
    .min(1, "Please upload at least one image"),
  category: yup
    .string()
    .required("Please select a category")
    .oneOf(categories, "Invalid category selected"),
});
