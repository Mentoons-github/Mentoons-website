export const EXCLUDE_USER_ITEMS = [
  "_id",
  "clerkId",
  "coverImage",
  "socialLinks",
  "subscription",
  "posts",
  "friends",
  "assignedCalls",
  "followers",
  "following",
  "bio",
  "dateOfBirth",
  "lastActive",
  "isBlocked",
];

export const EXCLUDE_PRODUCT_ITEMS = [
  "tags",
  "productImages",
  "productVideos",
  "isFeatured",
  "_id",
  "isNew",
  "updatedAt",
  "createdAt",
  "product_type",
  "orignalProductSrc",
];

export const EXCLUDE_ENQUIRY_ITEMS = ["lastName", "email", "_id"];

export const EXCLUDE_EMPLOYEE_DATA = ["profileEditRequest"];

export const EXCLUDE_JOBS = [
  "createdAt",
  "jobDescription",
  "requirements",
  "responsibilities",
  "skillsRequired",
  "whatWeOffer",
  "_id",
  "updatedAt",
];

export const EXCLUDE_MEETUPS = [
  "detailedDescription",
  "description",
  "isOnline",
  "speakerImage",
  "tags",
  "topics",
  "_id",
  "updatedAt",
  "createdAt",
  "__v",
  "meetingLink",
];
