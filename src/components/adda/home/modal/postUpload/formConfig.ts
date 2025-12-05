import * as Yup from "yup";
import { FormValues, PostUploadProps } from "./types";

export const getValidationSchema = (
  postType: PostUploadProps["postType"],
  activeTab: number
) => {
  const baseSchema = {
    content: Yup.string().when("postType", {
      is: (type: string) => type !== "photo" && type !== "video",
      then: () => Yup.string().required("Content is required"),
      otherwise: () => Yup.string(),
    }),
    visibility: Yup.string().oneOf(["public", "friends", "private"]),
    tags: Yup.array().of(Yup.string()),
  };

  switch (postType) {
    case "event":
      return Yup.object({
        ...baseSchema,
        title: Yup.string().required("Event title is required"),
        eventStartDate: Yup.date().required("Event start date is required"),
        eventEndDate: Yup.date(),
        venue: Yup.string().required("Venue is required"),
        location: Yup.string(),
        description: Yup.string(), 
      });

    case "article":
      return Yup.object({
        ...baseSchema,
        title: Yup.string().required("Article title is required"),
        articleBody: Yup.string().required("Article body is required"),
        media: Yup.array().of(
          Yup.object({
            file: Yup.mixed(),
            caption: Yup.string(),
            type: Yup.string().oneOf(["image", "video"]),
            url: Yup.string(),
          })
        ),
      });

    case "photo":
    case "video":
      return Yup.object({
        ...baseSchema,
        media: Yup.array()
          .of(
            Yup.object({
              file: Yup.mixed(),
              caption: Yup.string(),
              type: Yup.string().oneOf(["image", "video"]),
            })
          )
          .test(
            "fileRequired",
            `At least one ${postType} file is required`,
            function (value) {
              if (
                activeTab === 2 &&
                (!value ||
                  value.length === 0 ||
                  !value.some((item) => item.file))
              ) {
                return false;
              }
              return true;
            }
          ),
      });

    case "mixed":
      return Yup.object({
        ...baseSchema,
        media: Yup.array().of(
          Yup.object({
            file: Yup.mixed(),
            caption: Yup.string(),
            type: Yup.string().oneOf(["image", "video"]),
          })
        ),
      });

    default:
      return Yup.object({
        ...baseSchema,
      });
  }
};

export const getInitialValues = (
  postType: PostUploadProps["postType"],
  postedImage?: File | null
): FormValues => {
  return {
    title: "",
    content: "",
    eventStartDate: "",
    eventEndDate: "",
    venue: "",
    location: "",
    description: "",
    articleBody: "",
    tags: "",
    visibility: "public",
    media:
      postType === "photo" || postType === "video" || postType === "article"
        ? [
            {
              file: postType === "photo" && postedImage ? postedImage : null,
              type: postType === "video" ? "video" : "image",
              caption: "",
              url: undefined,
            },
          ]
        : [],
  };
};
