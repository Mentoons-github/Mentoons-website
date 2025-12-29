import * as Yup from "yup";

/* =========================
   TAB 1 – Demographic
========================= */
export const demographicSchema = Yup.object({
  demographic: Yup.object({
    child: Yup.object({
      name: Yup.string().required(
        "Child name is required in DEMOGRAPHIC DETAILS "
      ),
      age: Yup.string().required("Age is required in DEMOGRAPHIC DETAILS"),
      dateOfBirth: Yup.string().required(
        "Date of birth is required in DEMOGRAPHIC DETAILS"
      ),
      gender: Yup.string().required(
        "Gender is required in DEMOGRAPHIC DETAILS"
      ),
      school: Yup.string().required(
        "School name is required in DEMOGRAPHIC DETAILS"
      ),
      class: Yup.string().required("Class is required in DEMOGRAPHIC DETAILS"),
      adress: Yup.string().required(
        "Address is required in DEMOGRAPHIC DETAILS"
      ),
      economicStatus: Yup.string().required(
        "Economic status is required in DEMOGRAPHIC DETAILS"
      ),
      languages: Yup.array().required(
        "Languages know is required in DEMOGRAPHIC DETAILS"
      ),
    }),
    guardians: Yup.object({
      fathersName: Yup.string().required(
        "Father's name is required in DEMOGRAPHIC DETAILS"
      ),
      fathersOccupation: Yup.string().required(
        "Father's occupation is required in DEMOGRAPHIC DETAILS"
      ),
      fatherscontact: Yup.string().required(
        "Father's contact is required in DEMOGRAPHIC DETAILS"
      ),
      fatherIncome: Yup.string().required(
        "Father's income is required in DEMOGRAPHIC DETAILS"
      ),
      fatherPovertyLine: Yup.string().required(
        "Father's poverty line is required in DEMOGRAPHIC DETAILS"
      ),
      mothersName: Yup.string().required(
        "Mother's name is required in DEMOGRAPHIC DETAILS"
      ),
      mothersOccupation: Yup.string().required(
        "Mother's occupation is required in DEMOGRAPHIC DETAILS"
      ),
      mothercontact: Yup.string().required(
        "Mother's Contact is required in DEMOGRAPHIC DETAILS"
      ),
      motherIncome: Yup.string().required(
        "Mother's income is required in DEMOGRAPHIC DETAILS"
      ),
      motherPovertyLine: Yup.string().required(
        "Mother's poverty line is required in DEMOGRAPHIC DETAILS"
      ),
      //   primaryCareGiver: Yup.string().required("Primary caregiver is required"),
      familyStructure: Yup.string().required(
        "Family structure is required in DEMOGRAPHIC DETAILS"
      ),
    }),
  }),
});

/* =========================
   TAB 2 – Developmental & Medical
========================= */
export const developmentalSchema = Yup.object({
  developmental: Yup.object({
    speech: Yup.string().required(
      "Speech development is required in DEVELOPMENTAL & MEDICAL DETAILS"
    ),
    motorSkills: Yup.string().required(
      "Motor skills info is required in DEVELOPMENTAL & MEDICAL DETAILS"
    ),
    socialInteraction: Yup.string().required(
      "Social interaction is required in DEVELOPMENTAL & MEDICAL DETAILS"
    ),
    medicalIllness: Yup.string().required(
      "Medical illness field is required in DEVELOPMENTAL & MEDICAL DETAILS"
    ),
    learningDisability: Yup.string().required(
      "Learning disability field is required in DEVELOPMENTAL & MEDICAL DETAILS"
    ),
    sleepPattenrn: Yup.string().required(
      "Sleep pattern is required in DEVELOPMENTAL & MEDICAL DETAILS"
    ),
  }),
});

/* =========================
   TAB 3 – Academic & Social
========================= */
export const academicSchema = Yup.object({
  academic: Yup.object({
    performance: Yup.string().required(
      "Academic performance is required in ACADEMIC & SOCIAL HISTORY"
    ),
    strugglesIn: Yup.string().required(
      "Struggles field is required in ACADEMIC & SOCIAL HISTORY"
    ),
    attentionIssues: Yup.string().required(
      "Attention issue field is required in ACADEMIC & SOCIAL HISTORY"
    ),
    relationship: Yup.string().required(
      "Relationship field is required in ACADEMIC & SOCIAL HISTORY"
    ),
    participation: Yup.string().required(
      "Participation field is required in ACADEMIC & SOCIAL HISTORY"
    ),
    behaviouralConcerns: Yup.string().required(
      "Behavioural concern field is required in ACADEMIC & SOCIAL HISTORY"
    ),
  }),
});

/* =========================
   TAB 4 – Family & Environment
========================= */
export const familyEnvironmentalSchema = Yup.object({
  familyEnvironmental: Yup.object({
    parentingStyle: Yup.string().required(
      "Parenting style is required in FAMILY & ENVIRONMENTAL OBSERVATION"
    ),
    screenExposure: Yup.string().required(
      "Screen exposure is required in FAMILY & ENVIRONMENTAL OBSERVATION"
    ),
    socialInteraction: Yup.string().required(
      "Social interaction is required in FAMILY & ENVIRONMENTAL OBSERVATION"
    ),
    recentLifeEvents: Yup.string().required(
      "Recent life events is required in FAMILY & ENVIRONMENTAL OBSERVATION"
    ),
    fightsAtHome: Yup.string().required(
      "Quarrels / Fights is required in FAMILY & ENVIRONMENTAL OBSERVATION"
    ),
  }),
});

/* =========================
   TAB 5 – Behavioural & Emotional
========================= */
const emotionalField = (fieldName: string) =>
  Yup.object({
    value: Yup.string().required(
      `${fieldName} → Value is required in BEHAVIOURAL & EMOTIONAL OBSERVATION`
    ),
    note: Yup.string().required(
      `${fieldName} → Note is required in BEHAVIOURAL & EMOTIONAL OBSERVATION`
    ),
  });

export const behaviouralSchema = Yup.object({
  behaviouralEmotional: Yup.object({
    aggressionOrTemper: emotionalField("Aggression or Temper"),
    anxietyOrWorry: emotionalField("Anxiety or Worry"),
    moodSwings: emotionalField("Mood Swings"),
    withdrawalOrIsolation: emotionalField("Withdrawal or Isolation"),
    hyperactivityOrRestlessness: emotionalField(
      "Hyperactivity or Restlessness"
    ),
    lyingOrStealing: emotionalField("Lying or Stealing"),
    bullyingOrGetsBullied: emotionalField("Bullying or Gets Bullied"),
  }),
});

/* =========================
   TAB 6 – Screen & Digital Addiction
========================= */
export const screenAddictionSchema = Yup.object({
  ScreenAndDigitalAddication: Yup.object({
    parentPerspective: Yup.object({
      screenTime: Yup.string().required(
        "Screen time is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      typeOfScreenUsage: Yup.array().required(
        "Type of screen usage is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      irritatedIfDiviceTakenAway: Yup.string().required(
        "This field is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      sneakingPhoneUseSecretly: Yup.string().required(
        "This field is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      impactObserved: Yup.array().required(
        "Impact observed is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
    }),
    childPerspective: Yup.object({
      enjoyMost: Yup.string().required(
        "This field is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      dailyScreenSpend: Yup.string().required(
        "Daily screen time is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      fellDeviceTakeAway: Yup.string().required(
        "Fell device takeawya field is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      canSpendDayWithoutMobile: Yup.string().required(
        "Spend day without mobild field is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
      hobbiesAppartFromScreens: Yup.string().required(
        "Hobbies field is required in SCREEN & DIGITAL ADDICTION ASSESSMENT"
      ),
    }),
  }),
});

/* =========================
   TAB 7 – Other Addiction Pattern
========================= */
const addictionBlock = (fieldName: string) =>
  Yup.object({
    present: Yup.boolean(), // optional
    frequency: Yup.string().required(
      `${fieldName} → Frequency is required in OTHER ADDICTION / BEHAVIOURAL PATTERNS`
    ),
    duration: Yup.string().required(
      `${fieldName} → Duration is required in OTHER ADDICTION / BEHAVIOURAL PATTERNS`
    ),
    observations: Yup.string().required(
      `${fieldName} → Observation is required in OTHER ADDICTION / BEHAVIOURAL PATTERNS`
    ),
  });

export const otherAddictionSchema = Yup.object({
  otherAddictionPattern: Yup.object({
    gamingAddiction: addictionBlock("Gaming addiction "),
    youtubeOrOttBinge: addictionBlock("YouTube / OTT Binge"),
    sugarOrJunkFoodCravings: addictionBlock("Sugar / Junk Food Cravings"),
    nailBaitingOrHairPulling: addictionBlock("Nail Biting / Hair Pulling"),
    socialMediaScrolling: addictionBlock("Social Media Scrolling"),
    pornExposure: addictionBlock("Early signs of porn exposure"),
  }),
});

/* =========================
   TAB 8 – Child Self Perception
========================= */
export const selfPerceptionSchema = Yup.object({
  childsSelfPerception: Yup.object({
    likesThemselves: Yup.array()
      .min(3, "Fill all fields likesThemselves in CHILD'S SELF-PERCEPTION")
      .required(
        "Three things likes themselves is required in CHILD'S SELF-PERCEPTION"
      ),
    wantToImprove: Yup.array()
      .min(3, "Fill all fields wantToImprove in CHILD'S SELF-PERCEPTION")
      .required(
        "Three things they want to improve is required in CHILD'S SELF-PERCEPTION"
      ),
    makeThemHappy: Yup.string().required(
      "Make them happy is required in CHILD'S SELF-PERCEPTION"
    ),
    fearOrWorries: Yup.string().required(
      "Fear or worries is required in CHILD'S SELF-PERCEPTION"
    ),
  }),
});

/* =========================
   TAB 9 – Goals & Expectations
========================= */
export const goalsSchema = Yup.object({
  goalsAndExpectations: Yup.object({
    parentsGoals: Yup.array()
      .min(1, "At least one parent goal is required in GOALS & EXPECTATIONS")
      .required("Parents goals is required in GOALS & EXPECTATIONS"),
    childsGoals: Yup.array()
      .min(1, "At least one child goal is required in GOALS & EXPECTATIONS")
      .required("Child goals is required in GOALS & EXPECTATIONS"),
  }),
});

/* =========================
   TAB 10 – Therapist Observation
========================= */
export const therapistSchema = Yup.object({
  therapistInitialObservation: Yup.object({
    childBehaviourDuringSession: Yup.string().required(
      "Child’s behaviour is required in THERAPIST INITIAL OBSERVATION"
    ),
    reportBuildingLevel: Yup.string().required(
      "Repport building level is required in THERAPIST INITIAL OBSERVATION"
    ),
    initialImpressionRisks: Yup.string().required(
      "Initial impression regarding is required in THERAPIST INITIAL OBSERVATION"
    ),
    recomentedInventionPlan: Yup.string().required(
      "Recommended Intervention Plan is required in THERAPIST INITIAL OBSERVATION"
    ),
    sessionRequired: Yup.string().required(
      "Sessions Required is required in THERAPIST INITIAL OBSERVATION"
    ),
    activitiesOrModulesSuggested: Yup.string().required(
      "Activities/Modules is required in THERAPIST INITIAL OBSERVATION"
    ),
    parentalGuidanceOrBoundariesNeeded: Yup.string().required(
      "Parental Guidance is required in THERAPIST INITIAL OBSERVATION"
    ),
  }),
});

export const tabValidationMap: Record<number, Yup.AnyObjectSchema> = {
  1: demographicSchema,
  2: developmentalSchema,
  3: academicSchema,
  4: familyEnvironmentalSchema,
  5: behaviouralSchema,
  6: screenAddictionSchema,
  7: otherAddictionSchema,
  8: selfPerceptionSchema,
  9: goalsSchema,
  10: therapistSchema,
};
