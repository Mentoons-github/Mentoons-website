export type BehaviourWithNote = {
  value: string;
  note: string;
};

export type AddictionPatternItem = {
  present: boolean;
  frequency: string;
  duration: string;
  observations: string;
};

interface ChildDemographic {
  name: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  languages: string[];
  adress: string;
  economicStatus: string;
  class: string;
  school: string;
  religion: string;
  culture: string;
  sibilings: string[];
  sibilingType: string;
}

interface GuardianDemographic {
  fathersName: string;
  fathersOccupation: string;
  fatherscontact: string;
  fatherIncome: string;
  fatherPovertyLine: string;

  mothersName: string;
  mothersOccupation: string;
  mothercontact: string;
  motherIncome: string;
  motherPovertyLine: string;

  primaryCareGiver: string;
  familyStructure: string;
  familyStructureOther: string;
  map: string;
}

interface DemographicDetails {
  child: ChildDemographic;
  guardians: GuardianDemographic;
}

interface DevelopmentalDetails {
  speech: string;
  motorSkills: string;
  socialInteraction: string;
  medicalIllness: string;
  learningDisability: string;
  currentMedication: string;
  sleepPattenrn: string;
}

interface AcademicDetails {
  performance: string;
  strugglesIn: string;
  attentionIssues: string;
  relationship: string;
  participation: string;
  behaviouralConcerns: string;
}

interface FamilyEnvironmental {
  parentingStyle: string;
  screenExposure: string;
  socialInteraction: string;
  recentLifeEvents: string;
  fightsAtHome: string;
}

export interface BehaviouralEmotional {
  aggressionOrTemper: BehaviourWithNote;
  anxietyOrWorry: BehaviourWithNote;
  moodSwings: BehaviourWithNote;
  withdrawalOrIsolation: BehaviourWithNote;
  hyperactivityOrRestlessness: BehaviourWithNote;
  lyingOrStealing: BehaviourWithNote;
  bullyingOrGetsBullied: BehaviourWithNote;
}

interface ScreenParentPerspective {
  screenTime: string;
  typeOfScreenUsage: string[];
  irritatedIfDiviceTakenAway: string;
  sneakingPhoneUseSecretly: string;
  impactObserved: string[];
}

interface ScreenChildPerspective {
  enjoyMost: string;
  dailyScreenSpend: string;
  fellDeviceTakeAway: string;
  canSpendDayWithoutMobile: string;
  hobbiesAppartFromScreens: string;
}

interface ScreenAndDigitalAddiction {
  parentPerspective: ScreenParentPerspective;
  childPerspective: ScreenChildPerspective;
}

export interface OtherAddictionPatternTypes {
  gamingAddiction: AddictionPatternItem;
  youtubeOrOttBinge: AddictionPatternItem;
  sugarOrJunkFoodCravings: AddictionPatternItem;
  nailBaitingOrHairPulling: AddictionPatternItem;
  socialMediaScrolling: AddictionPatternItem;
  pornExposure: AddictionPatternItem;
}

interface ChildSelfPerception {
  likesThemselves: string[];
  wantToImprove: string[];
  makeThemHappy: string;
  fearOrWorries: string;
}

interface GoalsAndExpectations {
  parentsGoals: string[];
  childsGoals: string[];
}

interface TherapistInitialObservation {
  childBehaviourDuringSession: string;
  reportBuildingLevel: string;
  initialImpressionRisks: string;
  recomentedInventionPlan: string;
  sessionRequired: string;
  activitiesOrModulesSuggested: string;
  parentalGuidanceOrBoundariesNeeded: string;
}

export interface Details {
  _id?: string;
  createdAt?: string;
  psychologist?: {
    user: {
      name: string;
      email: string;
      phoneNumber:string
    };
  };
  demographic: DemographicDetails;
  developmental: DevelopmentalDetails;
  academic: AcademicDetails;
  familyEnvironmental: FamilyEnvironmental;
  behaviouralEmotional: BehaviouralEmotional;
  ScreenAndDigitalAddication: ScreenAndDigitalAddiction;
  otherAddictionPattern: OtherAddictionPatternTypes;
  childsSelfPerception: ChildSelfPerception;
  goalsAndExpectations: GoalsAndExpectations;
  therapistInitialObservation: TherapistInitialObservation;
  reviewMechanism?: ReviewMechanismFormValues;
}

export type ReviewMechanismFormValues = {
  psychologist: string;
  childName: string;
  age: number | string;
  date: string;
  stepsTaken: string;
  progressEffectivenessRating: string;
  observableProgressIndicators: {
    emotionalRegulation:
      | ""
      | "Positive Change"
      | "No Change"
      | "Negative Change";
    behaviourAtHome: "" | "Positive Change" | "No Change" | "Negative Change";
    behaviourAtSchool: "" | "Positive Change" | "No Change" | "Negative Change";
    attentionAndFocus: "" | "Positive Change" | "No Change" | "Negative Change";
    socialInteraction: "" | "Positive Change" | "No Change" | "Negative Change";
    notes: string;
  };
  whyInventionsWorking: {
    relatedToMentoonsProvider: {
      reasons: string[];
      otherReason: string;
      remarks: string;
    };
    relatedToChild: {
      reasons: string[];
      otherReason: string;
      remarks: string;
    };
  };
  actionPlanOrNextSteps: string[];
  plannedChangesOrRecommendations: string;
  signature?:string;
  evaluationSummary: string;
};
