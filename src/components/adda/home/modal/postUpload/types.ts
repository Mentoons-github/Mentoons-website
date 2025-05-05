export interface PostUploadProps {
  isOpen: boolean;
  onClose: (val: boolean) => void;
  postType: "photo" | "video" | "event" | "article" | "text" | "mixed";
  onPostCreated?: (post: any) => void;
}

export interface FormValues {
  title?: string;
  content: string;
  eventStartDate?: string;
  eventEndDate?: string;
  venue?: string;
  location?: string;
  description?: string;
  articleBody?: string;
  tags?: string[];
  visibility?: "public" | "friends" | "private";
  media: {
    file: File | null;
    caption?: string;
    type: "image" | "video";
    url?: string;
  }[];
}

export interface MediaUploadProps {
  mediaPreview: string[];
  handleMediaUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    index?: number
  ) => void;
  setFieldValue: (field: string, value: unknown) => void;
}

export interface UploadContentProps extends MediaUploadProps {
  postType: PostUploadProps["postType"];
  values: FormValues;
  addMediaField: (
    setFieldValue: (field: string, value: unknown) => void
  ) => void;
  removeMediaField: (
    index: number,
    setFieldValue: (field: string, value: unknown) => void
  ) => void;
}

export interface FormActionsProps {
  activeTab: number;
  postType: PostUploadProps["postType"];
  isValid: boolean;
  values: FormValues;
  mediaPreview: string[];
  handlePrevTab: () => void;
  handleNextTab: () => void;
}

export interface TabNavigationProps {
  postType: PostUploadProps["postType"];
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export interface PreviewContentProps {
  postType: PostUploadProps["postType"];
  values: FormValues;
  mediaPreview: string[];
}
