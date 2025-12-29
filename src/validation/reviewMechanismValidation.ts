import * as Yup from "yup";

const progressValue = Yup.mixed<
  "" | "Positive Change" | "No Change" | "Negative Change"
>()
  .oneOf(["", "Positive Change", "No Change", "Negative Change"])
  .required("Required");

export const reviewMechanismSchema = Yup.object({
  stepsTaken: Yup.string().trim().required("Steps taken is required"),

  progressEffectivenessRating: Yup.string().required(
    "Progress effectiveness rating is required"
  ),

  observableProgressIndicators: Yup.object({
    emotionalRegulation: progressValue,
    behaviourAtHome: progressValue,
    behaviourAtSchool: progressValue,
    attentionAndFocus: progressValue,
    socialInteraction: progressValue,

    notes: Yup.string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .required("Notes is required"),
  }),

  whyInventionsWorking: Yup.object({
    relatedToMentoonsProvider: Yup.object({
      reasons: Yup.array()
        .of(Yup.string().trim())
        .min(1, "Select at least one reason")
        .required(),

      remarks: Yup.string()
        .trim()
        .max(500, "Remarks cannot exceed 500 characters")
        .required("Remarks is required"),
    }),

    relatedToChild: Yup.object({
      reasons: Yup.array()
        .of(Yup.string().trim())
        .min(1, "Select at least one reason")
        .required(),

      remarks: Yup.string()
        .trim()
        .max(500, "Remarks cannot exceed 500 characters")
        .required("Remarks is required"),
    }),
  }),

  actionPlanOrNextSteps: Yup.array()
    .of(Yup.string().trim())
    .min(1, "Add at least one action plan")
    .required(),

  plannedChangesOrRecommendations: Yup.string()
    .trim()
    .required("Planned changes or recommendations are required"),

  evaluationSummary: Yup.string()
    .trim()
    .required("Evaluation summary is required"),
});
