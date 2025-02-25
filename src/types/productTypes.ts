export enum AgeCategory {
  CHILD = "6-12",
  TEEN = "13-16",
  YOUNG_ADULT = "17-19",
  ADULT = "20+",
  PARENTS = "parents",
}

export enum ProductType {
  COMIC = "comic",
  AUDIO_COMIC = "audio_comic",
  PODCAST = "podcast",
  WORKSHOP = "workshop",
  ASSESSMENT = "assessment",
  MERCHANDISE = "merchandise",
  SELF_HELP_CARD = "self_help_card",
}

export interface ISSUES {
  _id: string;
  title: string;
  description: string;
  issueIllustrationUrl: string;
}

// Base interface for all products
export interface ProductBase {
  _id: string;
  title: string;
  description?: string;
  price: number;
  ageCategory: AgeCategory;
  type: ProductType;
  tags?: string[];
  rating: number;
  pruductImages?: [
    {
      _id: string;
      imageSrc: string;
    }
  ];
  productVideos?: [
    {
      _id: string;
      videoSrc: string;
    }
  ];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  details:
    | ComicProduct["details"]
    | AudioComicProduct["details"]
    | PodcastProduct["details"]
    | WorkshopProduct["details"]
    | AssessmentProduct["details"]
    | MerchandiseProduct["details"];
}

// Discriminator interfaces for specific product types:
export interface ComicProduct extends ProductBase {
  type: ProductType.COMIC;
  details: {
    pages: number;
    author: string;
    publisher?: string;
    language?: string;
    releaseDate?: string;
    series?: string;
  };
}

export interface AudioComicProduct extends ProductBase {
  type: ProductType.AUDIO_COMIC;
  details: {
    duration: number; // in seconds
    narrator: string;
    language?: string;
    releaseDate?: string; // ISO date string
    sampleUrl?: string; // URL to a sample audio clip
  };
}

export interface PodcastProduct extends ProductBase {
  type: ProductType.PODCAST;
  details: {
    episodeNumber: number;
    host?: string;
    language?: string;
    releaseDate?: string; // ISO date string
    duration?: number; // Duration of the episode in minutes
    sampleUrl?: string; // URL to a sample audio clip
  };
}

export interface WorkshopProduct extends ProductBase {
  type: ProductType.WORKSHOP;
  details: {
    instructor: string;
    location?: string;
    schedule: string; // ISO date string
    duration: number; // in hours
    capacity?: number; // Maximum number of participants
    materials?: string[];
    workshopOffering: {
      title: string;
      description: string;
      imageUrl: string;
      accentColor: string;
    }[];
    addressedIssues: ISSUES[];
  };
}

export interface AssessmentProduct extends ProductBase {
  type: ProductType.ASSESSMENT;
  details: {
    questions: {
      questionText: string;
      options?: string[];
      correctAnswer?: string;
      explanation?: string; // Explanation for the correct answer
    }[];
    passingScore: number;
    duration: number; // in minutes
    difficulty?: "easy" | "medium" | "hard"; // Enum for difficulty levels
    totalQuestions?: number; // Total number of questions in the assessment
    createdBy?: string; // Creator of the assessment
    createdDate?: string; // ISO date string for when the assessment was created
  };
}

export interface MerchandiseProduct extends ProductBase {
  type: ProductType.MERCHANDISE;
  details: {
    sizes?: string[];
    colors?: string[];
    material?: string;
    brand?: string; // Brand of the merchandise
    price?: number; // Price of the merchandise
    stockQuantity?: number; // Available stock quantity
    description?: string; // Description of the merchandise
    careInstructions?: string; // Instructions for care and maintenance
    createdBy?: string; // Creator of the assessment
    createdDate?: string; // ISO date string for when the assessment was created
  };
}

interface ProductImage {
  id: number;
  imageSrc: string;
}

interface ProductVideos {
  id: number;
  videoSrc: string;
}
interface ProductReviews {
  id: string;
  quote: string;
  author: string;
}

interface DescriptionItem {
  _id: string;
  label: string;
  descriptionList: [{ _id: string; description: string }];
}

export interface ProductDetail {
  minAge: number;
  maxAge: number;
  ageFilter: string;
  rating: string;
  paperEditionPrice: string;
  printablePrice: string;
  productImages: ProductImage[];
  productVideos: ProductVideos[];
  productDescription: DescriptionItem[];
  productReview: ProductReviews[];
}

export interface MentoonsCardProduct {
  type: ProductType.SELF_HELP_CARD; // Updated to reflect the self-help card type
  details: {
    cardType:
      | "conversation starter cards"
      | "story re-teller cards"
      | "silent stories"
      | "conversation story cards"; // Types of self-help cards
    accentColor?: string; // Color theme for the card
    addressedIssue: {
      title: string;
      description: string;
      issueIllustrationUrl: string;
    }[];
    productDescription: {label: string;
  descriptionList: [{ _id: string; description: string }]}[];
  }[];
}

// Union type representing any product.
export type Product =
  | ComicProduct
  | AudioComicProduct
  | PodcastProduct
  | WorkshopProduct
  | AssessmentProduct
  | MerchandiseProduct
  | MentoonsCardProduct;
