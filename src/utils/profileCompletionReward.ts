import { RewardEventType } from '@/types/rewards';
import { triggerReward } from './rewardMiddleware';

/**
 * Constants for profile completion tracking
 */
export const PROFILE_FIELDS = [
  'name',
  'bio',
  'avatar',
  'location',
  'interests',
  'education',
  'work',
  'socialLinks',
];

const PROFILE_COMPLETION_KEY = 'profileCompletionRewarded';

/**
 * Checks if a user's profile is considered complete based on minimum required fields
 * @param profile User profile object
 * @param requiredFields Array of required fields (default: 5 fields minimum)
 * @returns boolean
 */
export const isProfileComplete = (
  profile: Record<string, any>,
  requiredFieldsCount: number = 5
): boolean => {
  // Count how many profile fields are filled
  const filledFields = PROFILE_FIELDS.filter(field => {
    const value = profile[field];
    
    // Check if the field exists and is not empty
    if (value === undefined || value === null) return false;
    
    // For strings, check if it's not an empty string
    if (typeof value === 'string' && value.trim() === '') return false;
    
    // For arrays, check if not empty
    if (Array.isArray(value) && value.length === 0) return false;
    
    // For objects, check if it has properties
    if (typeof value === 'object' && Object.keys(value).length === 0) return false;
    
    return true;
  });
  
  // Profile is complete if at least the required number of fields are filled
  return filledFields.length >= requiredFieldsCount;
};

/**
 * Checks and rewards a user for completing their profile
 * (only rewards once per user)
 * @param profile User profile object
 */
export const checkAndRewardProfileCompletion = (profile: Record<string, any>): void => {
  // Check if we've already rewarded for profile completion
  const hasBeenRewarded = localStorage.getItem(PROFILE_COMPLETION_KEY) === 'true';
  
  // If already rewarded, do nothing
  if (hasBeenRewarded) return;
  
  // Check if profile is complete
  if (isProfileComplete(profile)) {
    // Trigger reward for profile completion
    triggerReward(RewardEventType.PROFILE_COMPLETION);
    
    // Mark as rewarded to avoid duplicate rewards
    localStorage.setItem(PROFILE_COMPLETION_KEY, 'true');
  }
}; 