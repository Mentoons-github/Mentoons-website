import * as Yup from "yup";

export const MeetupInitialValues = {
  title: "",
  date: "",
  time: "",
  duration: "",
  maxCapacity: 0,
  platform: "",
  meetingLink: "",
  place: "",
  description: "",
  detailedDescription: "",
  speakerName: "",
  speakerImage: null as File | null,
  speakerImageUrl: null as string | null,
  topics: "",
  tags: "",
  isOnline: false,
};

const platformDomains: Record<string, string> = {
  "Google Meet": "meet.google.com",
  Zoom: "zoom.us",
  "Microsoft Teams": "teams.microsoft.com",
  "Cisco Webex": "webex.com",
  Discord: "discord.gg",
};

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
const FILE_SIZE = 5 * 1024 * 1024;

export const MeetupValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  date: Yup.date()
    .required("Date is required")
    .min(new Date("2025-09-23"), "Date must be today or in the future"),
  time: Yup.string().required("Time is required"),
  duration: Yup.string().required("Duration is required"),
  maxCapacity: Yup.number()
    .required("Max capacity is required")
    .positive("Max capacity must be a positive number")
    .max(10, "Max capacity cannot exceed 10")
    .integer("Max capacity must be an integer"),
  platform: Yup.string().when("isOnline", (isOnline, schema) =>
    isOnline ? schema.required("Platform is required") : schema
  ),
  meetingLink: Yup.string().when("isOnline", (isOnline, schema) =>
    isOnline
      ? schema
          .required("Meeting link is required")
          .test(
            "valid-platform-link",
            "Invalid platform URL",
            function (value) {
              const platform = this.parent.platform;
              return (
                value &&
                platform &&
                platform in platformDomains &&
                value.includes(
                  platformDomains[platform as keyof typeof platformDomains]
                )
              );
            }
          )
      : schema
  ),
  place: Yup.string().when("isOnline", (isOnline, schema) =>
    !isOnline ? schema.required("Place is required") : schema
  ),
  description: Yup.string().required("Description is required"),
  detailedDescription: Yup.string().required(
    "Detailed description is required"
  ),
  speakerName: Yup.string().required("Speaker name is required"),
  speakerImage: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large (max 5MB)", function (value) {
      if (!value) return true;
      return value instanceof File ? value.size <= FILE_SIZE : true;
    })
    .test(
      "fileFormat",
      "Unsupported file format. Please upload JPG, PNG, or GIF",
      function (value) {
        if (!value) return true;
        return value instanceof File
          ? SUPPORTED_FORMATS.includes(value.type)
          : true;
      }
    ),
  speakerImageUrl: Yup.string().nullable(),
  topics: Yup.string().required("Topics are required"),
  tags: Yup.string().required("Tags are required"),
});
