import * as Yup from "yup";

const getLeaveFormConfig = () => {
  const initialVlues = {
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  };

  const validationSchema = Yup.object({
    leaveType: Yup.string().required("Leave type is required"),
    startDate: Yup.date()
      .required("Start date is required")
      .typeError("Start date must be a valid date")
      .max(Yup.ref("endDate"), "Start date cannot be after end date"),
    endDate: Yup.date()
      .required("End date is required")
      .typeError("End date must be a valid date")
      .min(Yup.ref("startDate"), "End date can't be lesser than start date"),
    reason: Yup.string()
      .min(5, "5 character atleast required")
      .required("Reason for leave is required"),
  });

  return {
    initialVlues,
    validationSchema,
  };
};

export default getLeaveFormConfig;
