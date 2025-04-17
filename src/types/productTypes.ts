export enum AgeCategory {
  CHILD = "6-12",
  TEEN = "13-16",
  YOUNG_ADULT = "17-19",
  ADULT = "20+",
  PARENTS = "parents",
}

export enum ProductType {
  COMIC = "comic",
  AUDIO_COMIC = "audio comic",
  PODCAST = "podcast",
  WORKSHOP = "workshop",
  ASSESSMENT = "assessment",
  MERCHANDISE = "merchandise",
  MENTOONS_CARDS = "mentoons cards",
  MENTOONS_BOOKS = "mentoons books",
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
  orignalProductSrc?: string;
  ageCategory: AgeCategory;
  type: ProductType;
  product_type?: "Free" | "Prime" | "Platinum";
  tags?: string[];
  rating: number;
  productImages?: {
    _id: string;
    imageUrl: string;
  }[];
  productVideos?: {
    _id: string;
    videoUrl: string;
  }[];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  details:
    | ComicProduct["details"]
    | AudioComicProduct["details"]
    | PodcastProduct["details"]
    | WorkshopProduct["details"]
    | AssessmentProduct["details"]
    | MerchandiseProduct["details"]
    | MentoonsCardProduct["details"]
    | MentoonsBookProduct["details"];
}

// Discriminator interfaces for specific product types:
export interface ComicProduct extends ProductBase {
  type: ProductType.COMIC;
  details: {
    pages?: number;
    author?: string;
    publisher?: string;
    language?: string;
    sampleUrl?: string | undefined; // URL to a sample comic page
    releaseDate?: string;
    series?: string;
  };
}

export interface AudioComicProduct extends ProductBase {
  type: ProductType.AUDIO_COMIC;
  details: {
    duration?: number; // in seconds
    narrator?: string;
    language?: string;
    format: string;
    sampleDuration?: string;
    sampleUrl?: string | undefined;
    releaseDate?: string; // ISO date string
  };
}

export interface PodcastProduct extends ProductBase {
  type: ProductType.PODCAST;
  details: {
    category?: string;
    episodeNumber?: number;
    host?: string;
    language?: string;
    releaseDate?: string; // ISO date string
    duration?: number; // Duration of the episode in minutes
    sampleUrl?: string | undefined; // URL to a sample audio clip
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
    color: string;
    duration: number;
    difficulty: string;
    credits: string;
    questionGallery: [
      {
        _id: string;
        imageUrl: string;
        options: string[];
        correctAnswer: string;
      }
    ];
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

export interface MentoonsCardProduct {
  type: ProductType.MENTOONS_CARDS; // Updated to reflect the self-help card type
  details: {
    cardType:
      | "conversation starter cards"
      | "story re-teller cards"
      | "silent stories"
      | "conversation story cards"; // Types of self-help cards
    accentColor?: string; // Color theme for the card
    addressedIssues: {
      title: string;
      description: string;
      issueIllustrationUrl: string;
    }[];
    productDescription: {
      label: string;
      descriptionList: { _id: string; description: string }[];
    }[];
  }[];
}

export interface MentoonsBookProduct {
  type: ProductType.MENTOONS_BOOKS;
  details: {
    pages: number;
    author: string;
    publisher?: string;
    language: string;
    releaseDate?: string;
    series?: string;
    bookType?: string;
    isbn?: string;
    edition?: string;
  };
}

// Union type representing any product.
export type Product =
  | ComicProduct
  | AudioComicProduct
  | PodcastProduct
  | WorkshopProduct
  | AssessmentProduct
  | MerchandiseProduct
  | MentoonsCardProduct
  | MentoonsBookProduct;
