import { ProductBase } from "@/types/productTypes";

export interface UserSubscriptionLimits {
  freeTrialEndDate?: string; // ISO date string when free trial ends
  comicsReadThisMonth: number;
  audioComicsListenedThisMonth: number;
  monthlyReset: string; // ISO date when monthly limits reset
}

export interface SubscriptionPlanLimits {
  maxComics: number;
  maxAudioComics: number;
  hasFreeContent: boolean;
  freeDaysLimit: number;
}

// Define plan limits
export const SUBSCRIPTION_PLAN_LIMITS: Record<string, SubscriptionPlanLimits> =
  {
    free: {
      maxComics: 0,
      maxAudioComics: 0,
      hasFreeContent: true,
      freeDaysLimit: 3,
    },
    prime: {
      maxComics: 5,
      maxAudioComics: 10,
      hasFreeContent: true,
      freeDaysLimit: 0,
    },
    platinum: {
      maxComics: 10,
      maxAudioComics: 15,
      hasFreeContent: true,
      freeDaysLimit: 0,
    },
  };

// Helper function to get user access limits from DB user
export const getUserSubscriptionLimits = (
  dbUser: any
): UserSubscriptionLimits => {
  // If the user has subscription data, use it; otherwise initialize with defaults
  if (dbUser?.subscriptionLimits) {
    return dbUser.subscriptionLimits;
  }

  // Default limits for new users
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  // For free users, set trial end date
  const freeTrialEnd = new Date(now);
  freeTrialEnd.setDate(now.getDate() + 3); // 3-day free trial

  return {
    freeTrialEndDate: freeTrialEnd.toISOString(),
    comicsReadThisMonth: 0,
    audioComicsListenedThisMonth: 0,
    monthlyReset: nextMonth.toISOString(),
  };
};

// Check if a user has exceeded their free trial period
export const hasFreeTrialExpired = (
  subscriptionLimits: UserSubscriptionLimits
): boolean => {
  if (!subscriptionLimits.freeTrialEndDate) return false;

  const freeTrialEnd = new Date(subscriptionLimits.freeTrialEndDate);
  const now = new Date();

  return now > freeTrialEnd;
};

// Check if monthly limits need to be reset
export const shouldResetMonthlyLimits = (
  subscriptionLimits: UserSubscriptionLimits
): boolean => {
  if (!subscriptionLimits.monthlyReset) return true;

  const resetDate = new Date(subscriptionLimits.monthlyReset);
  const now = new Date();

  return now >= resetDate;
};

// Check if user can access specific content based on their subscription
export const canAccessContent = (
  product: ProductBase,
  membershipType: string,
  userLimits: UserSubscriptionLimits
): { canAccess: boolean; message: string; title: string } => {
  const planLimits =
    SUBSCRIPTION_PLAN_LIMITS[membershipType.toLowerCase()] ||
    SUBSCRIPTION_PLAN_LIMITS.free;
  // const now = new Date();

  // Free content access logic
  if (product.product_type === "Free") {
    // If user is on a free plan and free trial has expired
    if (
      membershipType.toLowerCase() === "free" &&
      hasFreeTrialExpired(userLimits)
    ) {
      return {
        canAccess: false,
        message:
          "Your 3-day free trial has expired. Upgrade your plan to continue enjoying our free content and unlock premium features!",
        title: "Free Trial Expired",
      };
    }

    // All plans can access free content within limits
    return { canAccess: true, message: "", title: "" };
  }

  // Premium content access logic
  if (membershipType.toLowerCase() === "free") {
    return {
      canAccess: false,
      message:
        "This content is only available to Prime and Platinum subscribers. Upgrade your plan to access this and more premium content!",
      title: "Premium Content",
    };
  }

  // Check monthly limits for comics
  if (product.type === "comic") {
    if (userLimits.comicsReadThisMonth >= planLimits.maxComics) {
      return {
        canAccess: false,
        message: `You've reached your monthly limit of ${planLimits.maxComics} comics for your ${membershipType} plan. Upgrade to access more content or wait until next month.`,
        title: "Monthly Limit Reached",
      };
    }
  }

  // Check monthly limits for audio comics
  if (product.type === "audio comic") {
    if (userLimits.audioComicsListenedThisMonth >= planLimits.maxAudioComics) {
      return {
        canAccess: false,
        message: `You've reached your monthly limit of ${planLimits.maxAudioComics} audio comics for your ${membershipType} plan. Upgrade to access more content or wait until next month.`,
        title: "Monthly Limit Reached",
      };
    }
  }

  // If all checks pass, allow access
  return { canAccess: true, message: "", title: "" };
};

// Update user limits when content is accessed
export const updateUserContentAccess = (
  product: ProductBase,
  userLimits: UserSubscriptionLimits
): UserSubscriptionLimits => {
  const updatedLimits = { ...userLimits };

  if (shouldResetMonthlyLimits(userLimits)) {
    // Reset monthly limits
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    updatedLimits.comicsReadThisMonth = 0;
    updatedLimits.audioComicsListenedThisMonth = 0;
    updatedLimits.monthlyReset = nextMonth.toISOString();
  }

  // Update content consumption count
  if (product.type === "comic" && product.product_type !== "Free") {
    updatedLimits.comicsReadThisMonth += 1;
  } else if (
    product.type === "audio comic" &&
    product.product_type !== "Free"
  ) {
    updatedLimits.audioComicsListenedThisMonth += 1;
  }

  return updatedLimits;
};
