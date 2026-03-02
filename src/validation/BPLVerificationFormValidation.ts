import * as Yup from "yup";

export const BplVerificationSchema = Yup.object({
  rationCardNumber: Yup.string()
    .matches(/^[A-Z0-9]{8,20}$/i, "Invalid Ration Card Number")
    .required("Ration card number required"),

  state: Yup.string().required("State required"),

  district: Yup.string().required("District required"),

  headOfFamilyName: Yup.string().required("Head of family name required"),

  mobileNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number")
    .required("Mobile number required"),

  document: Yup.mixed<File>()
    .required("PDF required")
    .test(
      "fileType",
      "Only PDF allowed",
      (value?: File | null) => !value || value.type === "application/pdf",
    )
    .test(
      "fileSize",
      "File must be under 2MB",
      (value?: File | null) => !value || value.size <= 2 * 1024 * 1024,
    ),
});
