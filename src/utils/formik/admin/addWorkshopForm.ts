import * as Yup from "yup";

export interface WhyChooseUs {
  heading: string;
  description: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface AgeGroupDetails {
  ageRange: string;
  serviceOverview: string;
  benefits: Benefit[];
  image: string | null;
}

export interface IndividualWorkshop {
  workshopName: string;
  whyChooseUs: WhyChooseUs[];
  ageGroups: AgeGroupDetails[];
}

export interface WorkshopFormValues {
  categoryName: string;
  workshops: IndividualWorkshop[];
  subtitle: string;
}

export const AddWorkshopFormConfig = () => {
  const initialValues: WorkshopFormValues = {
    categoryName: "",
    workshops: [
      {
        workshopName: "",
        whyChooseUs: [{ heading: "", description: "" }],
        ageGroups: [],
      },
    ],
    subtitle: "",
  };

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Please type the category name"),
    workshops: Yup.array()
      .of(
        Yup.object({
          workshopName: Yup.string().required("Please type the workshop name"),
          whyChooseUs: Yup.array()
            .of(
              Yup.object({
                heading: Yup.string().required(
                  "Why Choose Us heading is required"
                ),
                description: Yup.string().required(
                  "Why Choose Us description is required"
                ),
              })
            )
            .min(1, "Please enter at least one Why Choose Us entry"),
          ageGroups: Yup.array()
            .of(
              Yup.object({
                ageRange: Yup.string()
                  .oneOf(["6-12", "13-19", "20+"])
                  .required("Age group is required"),
                serviceOverview: Yup.string().required(
                  "Please enter the service overview"
                ),
                benefits: Yup.array()
                  .of(
                    Yup.object({
                      title: Yup.string().required("Benefit title is required"),
                      description: Yup.string().required(
                        "Benefit description is required"
                      ),
                    })
                  )
                  .min(1, "Please enter at least one benefit"),
                image: Yup.mixed().required("Image is required"),
              })
            )
            .min(1, "Please select at least one age group"),
        })
      )
      .min(1, "Please add at least one workshop"),
  });

  return {
    initialValues,
    validationSchema,
  };
};
