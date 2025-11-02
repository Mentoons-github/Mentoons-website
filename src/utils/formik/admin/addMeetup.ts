import * as Yup from "yup";

export interface MeetupFormValues {
  title: string;
  date: string;
  time: string;
  duration: string;
  maxCapacity: number;
  isOnline: boolean;
  platform: string;
  meetingLink: string;
  place: string;
  description: string;
  detailedDescription: string;
  speakerName: string;
  speakerImage: File | null;
  speakerImageUrl: string | null;
  topics: string;
  tags: string;
}

export const MeetupInitialValues: MeetupFormValues = {
  title: "",
  date: "",
  time: "",
  duration: "1 hour",
  maxCapacity: 0,
  isOnline: false,
  platform: "",
  meetingLink: "",
  place: "",
  description: "",
  detailedDescription: "",
  speakerName: "",
  speakerImage: null,
  speakerImageUrl: null,
  topics: "",
  tags: "",
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
    .min(new Date().toISOString().split("T")[0], "Cannot select past date"),

  time: Yup.string()
    .required("Time is required")
    .test("valid-time", "Time must be between 7:00 AM and 7:00 PM", (value) => {
      if (!value) return false;
      const [h, m] = value.split(":").map(Number);
      const mins = h * 60 + m;
      return mins >= 420 && mins <= 1140;
    }),

  duration: Yup.string().required("Duration is required"),
  maxCapacity: Yup.number()
    .required("Max capacity is required")
    .positive()
    .max(10)
    .integer(),

  isOnline: Yup.boolean(),

  platform: Yup.string().when("isOnline", {
    is: true,
    then: (s) =>
      s.required("Platform is required").oneOf(Object.keys(platformDomains)),
    otherwise: (s) => s.notRequired(),
  }),

  meetingLink: Yup.string().when("isOnline", {
    is: true,
    then: (s) =>
      s
        .required("Meeting link is required")
        .test("valid-link", "Invalid link for platform", function (value) {
          const { platform } = this.parent;
          if (!value || !platform) return false;
          return value.includes(platformDomains[platform]);
        }),
    otherwise: (s) => s.notRequired(),
  }),

  place: Yup.string().when("isOnline", {
    is: false,
    then: (s) => s.required("Place is required"),
    otherwise: (s) => s.notRequired(),
  }),

  description: Yup.string().required("Description is required"),
  detailedDescription: Yup.string().required(
    "Detailed description is required"
  ),
  speakerName: Yup.string().required("Speaker name is required"),

  speakerImage: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "Max 5MB",
      (v) => !v || (v instanceof File && v.size <= FILE_SIZE)
    )
    .test(
      "fileType",
      "Invalid format",
      (v) => !v || (v instanceof File && SUPPORTED_FORMATS.includes(v.type))
    ),

  topics: Yup.string()
    .required("Topics are required")
    .test("has-topics", "Enter at least one topic", (v) =>
      v ? v.split(",").some((t) => t.trim()) : false
    ),

  tags: Yup.string()
    .required("Tags are required")
    .test("has-tags", "Enter at least one tag", (v) =>
      v ? v.split(",").some((t) => t.trim()) : false
    ),
});
