import { ReviewMechanismFormValues } from "@/types/employee/dataCaptureTypes";

const today = new Date().toLocaleDateString("en-GB");

export const ReviewMecahinsmInitialValues: ReviewMechanismFormValues = {
  psychologist: "",
  childName: "",
  age: "",
  date: today,
  stepsTaken: "",
  progressEffectivenessRating: "",
  observableProgressIndicators: {
    emotionalRegulation: "",
    behaviourAtHome: "",
    behaviourAtSchool: "",
    attentionAndFocus: "",
    socialInteraction: "",
    notes: "",
  },
  whyInventionsWorking: {
    relatedToMentoonsProvider: {
      reasons: [] as string[],
      otherReason: "",
      remarks: "",
    },
    relatedToChild: {
      reasons: [] as string[],
      otherReason: "",
      remarks: "",
    },
  },
  evaluationSummary: "",
  actionPlanOrNextSteps: [] as string[],
  plannedChangesOrRecommendations: "",
  signature: "",
};
