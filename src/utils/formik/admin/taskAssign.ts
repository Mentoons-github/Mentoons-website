import { NewTask } from "@/redux/admin/task/taskApi";
import * as Yup from "yup";

export const taskInitialValues: NewTask = {
  title: "",
  deadline: "",
  description: "",
  assignedTo: "",
  priority: "low",
};

export const taskValidationSchema = Yup.object({
  title: Yup.string().required("Task title required"),
  deadline: Yup.date()
    .required("Deadline for the task is required")
    .min(new Date(), "Deadline cannot be in the past"),
  description: Yup.string().required("Task description required"),
  assignedTo: Yup.string().required(
    "Please assign the task to one of the employee"
  ),
  priority: Yup.string()
    .required("Please select the priority of the task")
    .oneOf(["high", "low", "medium"], "Priority must be High, Medium, or Low"),
});
