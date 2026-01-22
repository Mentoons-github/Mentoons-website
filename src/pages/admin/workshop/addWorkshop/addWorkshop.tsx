import {
  Formik,
  Field,
  ErrorMessage,
  Form,
  FieldArray,
  FormikHelpers,
} from "formik";
import {
  AddWorkshopFormConfig,
  IndividualWorkshop,
  WorkshopFormValues,
} from "@/utils/formik/admin/addWorkshopForm";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FaTrash } from "react-icons/fa";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "react-router-dom";
import { AgeGroupDetails } from "@/types";
import { useSubmissionModal } from "@/context/adda/commonModalContext";

const AddWorkshop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const workshopId = searchParams.get("workshopId");
  const { initialValues, validationSchema } = AddWorkshopFormConfig();
  const dispatch = useDispatch<AppDispatch>();
  const [imageFiles, setImageFiles] = useState<Map<string, File | null>>(
    new Map()
  );
  const { showModal, hideModal } = useSubmissionModal();
  const { getToken } = useAuth();

  const [formInitialValues, setFormInitialValues] =
    useState<WorkshopFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (workshopId) {
        try {
          const token = await getToken();
          if (!token) {
            throw new Error("Authentication token not found");
          }

          const response = await axios.get(
            `${
              import.meta.env.VITE_PROD_URL
            }/workshop/workshop-data/${workshopId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const workshopData = response.data.workshop;
          setFormInitialValues({
            categoryName: workshopData.categoryName || "",
            subtitle: workshopData.subtitle || "",
            description: workshopData.description || "",
            workshops: workshopData.workshops || [
              {
                workshopName: "",
                whyChooseUs: [{ heading: "", description: "" }],
                ageGroups: [],
              },
            ],
          });

          const newImageFiles = new Map<string, File | null>();
          workshopData.workshops.forEach(
            (workshop: IndividualWorkshop, workshopIndex: number) => {
              workshop.ageGroups.forEach(
                (group: AgeGroupDetails, ageGroupIndex: number) => {
                  if (group.image) {
                    newImageFiles.set(
                      `${workshopIndex}-${ageGroupIndex}-${group.ageRange}`,
                      null
                    );
                  }
                }
              );
            }
          );
          setImageFiles(newImageFiles);
        } catch (error) {
          console.error("Failed to fetch workshop:", error);
          toast.error("Failed to load workshop data. Please try again.");
        }
      }
    };

    fetchWorkshop();
  }, [workshopId, getToken]);

  const handleImageDelete = async (
    workshopId: string,
    workshopIndex: number,
    ageRange: string,
    setFieldValue: (field: string, value: string | null) => void,
    ageGroupIndex: number
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      showModal({
        isSubmitting: true,
        currentStep: "uploading",
        message: `Deleting image for ${ageRange}...`,
      });

      await axios.delete(
        `${
          import.meta.env.VITE_PROD_URL
        }/workshop/${workshopId}/image/${ageRange}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setImageFiles((prev) => {
        const newMap = new Map(prev);
        newMap.delete(`${workshopIndex}-${ageGroupIndex}-${ageRange}`);
        return newMap;
      });
      setFieldValue(
        `workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].image`,
        null
      );

      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: `Image for ${ageRange} deleted successfully!`,
      });

      toast.success(`Image for ${ageRange} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete image:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: `Failed to delete image for ${ageRange}`,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      toast.error("Failed to delete image. Please try again.");
    }
  };

  const handleSubmit = async (
    values: WorkshopFormValues,
    { resetForm }: FormikHelpers<WorkshopFormValues>
  ) => {
    try {
      setIsSubmitting(true);
      showModal({
        isSubmitting: true,
        currentStep: "uploading",
        message: "Getting authentication...",
      });

      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const updatedWorkshops = await Promise.all(
        values.workshops.map(async (workshop, workshopIndex) => {
          const updatedAgeGroups = await Promise.all(
            workshop.ageGroups.map(async (group, ageGroupIndex) => {
              const imageFile = imageFiles.get(
                `${workshopIndex}-${ageGroupIndex}-${group.ageRange}`
              );
              let imageUrl = group.image;

              if (imageFile) {
                showModal({
                  isSubmitting: true,
                  currentStep: "uploading",
                  message: `Uploading image for ${group.ageRange}...`,
                });

                const uploadResult = await dispatch(
                  uploadFile({
                    file: imageFile,
                    getToken: () => Promise.resolve(token),
                  })
                ).unwrap();

                imageUrl = uploadResult.data.fileDetails.url;
              } else if (!imageUrl && !workshopId) {
                throw new Error(
                  `Image is required for age group ${group.ageRange}`
                );
              }

              return {
                ...group,
                image: imageUrl,
              };
            })
          );

          return {
            ...workshop,
            ageGroups: updatedAgeGroups,
          };
        })
      );

      const updatedValues = {
        ...values,
        workshops: updatedWorkshops,
      };

      showModal({
        isSubmitting: true,
        currentStep: "saving",
        message: workshopId ? "Updating workshop..." : "Creating workshop...",
      });

      if (workshopId) {
        await axios.put(
          `${import.meta.env.VITE_PROD_URL}/workshop/edit/${workshopId}`,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_PROD_URL}/workshop/add-workshop`,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      showModal({
        isSubmitting: false,
        currentStep: "success",
        message: workshopId
          ? "Workshop updated successfully!"
          : "Workshop created successfully!",
      });

      toast.success(
        workshopId
          ? "Workshop updated successfully!"
          : "Workshop created successfully!"
      );

      setTimeout(() => {
        resetForm();
        setImageFiles(new Map());
        hideModal();
        setIsSubmitting(false);
      }, 2000);
    } catch (error: unknown) {
      console.error("Submission failed:", error);
      showModal({
        isSubmitting: false,
        currentStep: "error",
        message: workshopId
          ? "Failed to update workshop"
          : "Failed to create workshop",
        error:
          error instanceof AxiosError
            ? error.response?.data?.error
            : "An unknown error occurred",
      });
      toast.error(
        workshopId
          ? "Failed to update workshop. Please try again."
          : "Failed to create workshop. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string | null) => void,
    workshopIndex: number,
    ageGroupIndex: number,
    ageRange: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFiles((prev) =>
        new Map(prev).set(`${workshopIndex}-${ageGroupIndex}-${ageRange}`, file)
      );
      const reader = new FileReader();
      reader.onload = (e) => {
        setFieldValue(
          `workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].image`,
          e.target?.result as string
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (
    setFieldValue: (field: string, value: string | null) => void,
    workshopIndex: number,
    ageGroupIndex: number,
    ageRange: string
  ) => {
    if (workshopId) {
      handleImageDelete(
        workshopId,
        workshopIndex,
        ageRange,
        setFieldValue,
        ageGroupIndex
      );
    } else {
      setImageFiles((prev) => {
        const newMap = new Map(prev);
        newMap.delete(`${workshopIndex}-${ageGroupIndex}-${ageRange}`);
        return newMap;
      });
      setFieldValue(
        `workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].image`,
        null
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div>
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {workshopId ? "Edit" : "Add New"} Workshop Category
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Workshop Category Details
            </h2>
            <p className="text-green-100 mt-1 text-sm sm:text-base">
              Fill in the information below to {workshopId ? "edit" : "create"}{" "}
              your workshop category
            </p>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <Formik
              initialValues={formInitialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={handleSubmit}
            >
              {({
                values,
                setFieldValue,
                errors,
                touched,
              }: {
                values: WorkshopFormValues;
                setFieldValue: (field: string, value: any) => void;
                errors: any;
                touched: any;
              }) => (
                <Form className="space-y-6 sm:space-y-8">
                  {/* Category Name */}
                  <div className="space-y-3">
                    <label
                      htmlFor="categoryName"
                      className="block text-base sm:text-lg font-semibold text-gray-900"
                    >
                      Category Name
                    </label>
                    <Field
                      id="categoryName"
                      name="categoryName"
                      type="text"
                      placeholder="Enter category name"
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <ErrorMessage
                      name="categoryName"
                      component="div"
                      className="text-red-500 text-sm font-medium flex items-center gap-1"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-3">
                    <label
                      htmlFor="subtitle"
                      className="block text-base sm:text-lg font-semibold text-gray-900"
                    >
                      Subtitle
                    </label>
                    <Field
                      id="subtitle"
                      name="subtitle"
                      type="text"
                      placeholder="Enter category subtitle"
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <ErrorMessage
                      name="subtitle"
                      component="div"
                      className="text-red-500 text-sm font-medium flex items-center gap-1"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3 mb-4 sm:mb-6">
                    <label
                      htmlFor={`description`}
                      className="block text-base sm:text-lg font-semibold text-gray-900"
                    >
                      Desctiption
                    </label>
                    <Field
                      name={`description`}
                      as="textarea"
                      rows={3}
                      placeholder={`Enter Description `}
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <ErrorMessage
                      name={`description`}
                      component="div"
                      className="text-red-500 text-sm font-medium"
                    />
                  </div>

                  {/* Workshops */}
                  <div className="space-y-3">
                    <label className="block text-base sm:text-lg font-semibold text-gray-900">
                      Workshops
                    </label>
                    <FieldArray name="workshops">
                      {({
                        push,
                        remove,
                      }: {
                        push: (value: {
                          workshopName: string;
                          overview: string;
                          whyChooseUs: {
                            heading: string;
                            description: string;
                          }[];
                          ageGroups: AgeGroupDetails[];
                        }) => void;
                        remove: (index: number) => void;
                      }) => (
                        <div className="space-y-4 sm:space-y-6">
                          {values.workshops.map((workshop, workshopIndex) => (
                            <div
                              key={workshopIndex}
                              className="border p-4 sm:p-6 rounded-xl bg-gray-50"
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                                  Workshop {workshopIndex + 1}
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => remove(workshopIndex)}
                                  disabled={isSubmitting}
                                  className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <FaTrash className="w-4 h-4" />
                                  Remove Workshop
                                </button>
                              </div>

                              {/* Workshop Name */}
                              <div className="space-y-3 mb-4 sm:mb-6">
                                <label
                                  htmlFor={`workshops[${workshopIndex}].workshopName`}
                                  className="block text-base sm:text-lg font-semibold text-gray-900"
                                >
                                  Workshop Name
                                </label>
                                <Field
                                  id={`workshops[${workshopIndex}].workshopName`}
                                  name={`workshops[${workshopIndex}].workshopName`}
                                  type="text"
                                  placeholder="Enter an engaging workshop name"
                                  disabled={isSubmitting}
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage
                                  name={`workshops[${workshopIndex}].workshopName`}
                                  component="div"
                                  className="text-red-500 text-sm font-medium flex items-center gap-1"
                                />
                              </div>

                              {/* workshop overview */}
                              <div className="space-y-3 mb-4 sm:mb-6">
                                <label
                                  htmlFor={`workshops[${workshopIndex}].overview`}
                                  className="block text-base sm:text-lg font-semibold text-gray-900"
                                >
                                  Workshop Overview
                                </label>
                                <Field
                                  name={`workshops[${workshopIndex}].overview`}
                                  as="textarea"
                                  rows={3}
                                  placeholder={`Enter Workshop Overview `}
                                  disabled={isSubmitting}
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <ErrorMessage
                                  name={`workshops[${workshopIndex}].overview`}
                                  component="div"
                                  className="text-red-500 text-sm font-medium"
                                />
                              </div>

                              {/* Why Choose Us */}
                              <div className="space-y-3 mb-4 sm:mb-6">
                                <label className="block text-base sm:text-lg font-semibold text-gray-900">
                                  Why Choose Us
                                </label>
                                <FieldArray
                                  name={`workshops[${workshopIndex}].whyChooseUs`}
                                >
                                  {({
                                    push,
                                    remove,
                                  }: {
                                    push: (value: {
                                      heading: string;
                                      description: string;
                                    }) => void;
                                    remove: (index: number) => void;
                                  }) => (
                                    <div className="space-y-4">
                                      {workshop.whyChooseUs.map(
                                        (_, whyIndex) => (
                                          <div
                                            key={whyIndex}
                                            className="flex flex-col gap-3 border p-4 rounded-xl bg-gray-50"
                                          >
                                            <div className="space-y-2">
                                              <label
                                                htmlFor={`workshops[${workshopIndex}].whyChooseUs[${whyIndex}].heading`}
                                                className="block text-sm font-medium text-gray-700"
                                              >
                                                Heading
                                              </label>
                                              <Field
                                                name={`workshops[${workshopIndex}].whyChooseUs[${whyIndex}].heading`}
                                                type="text"
                                                placeholder={`Why Choose Us heading ${
                                                  whyIndex + 1
                                                }`}
                                                disabled={isSubmitting}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                              />
                                              <ErrorMessage
                                                name={`workshops[${workshopIndex}].whyChooseUs[${whyIndex}].heading`}
                                                component="div"
                                                className="text-red-500 text-sm font-medium"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <label
                                                htmlFor={`workshops[${workshopIndex}].whyChooseUs[${whyIndex}].description`}
                                                className="block text-sm font-medium text-gray-700"
                                              >
                                                Description
                                              </label>
                                              <Field
                                                name={`workshops[${workshopIndex}].whyChooseUs[${whyIndex}].description`}
                                                as="textarea"
                                                rows={3}
                                                placeholder={`Why Choose Us description ${
                                                  whyIndex + 1
                                                }`}
                                                disabled={isSubmitting}
                                                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                              />
                                              <ErrorMessage
                                                name={`workshops[${workshopIndex}].whyChooseUs[${whyIndex}].description`}
                                                component="div"
                                                className="text-red-500 text-sm font-medium"
                                              />
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => remove(whyIndex)}
                                              disabled={isSubmitting}
                                              className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              <FaTrash className="w-4 h-4" />
                                              Remove Why Choose Us
                                            </button>
                                          </div>
                                        )
                                      )}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          push({ heading: "", description: "" })
                                        }
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <PlusIcon className="w-5 h-5" />
                                        Add Why Choose Us
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
                                {touched.workshops &&
                                  errors.workshops &&
                                  errors.workshops[workshopIndex] &&
                                  typeof errors.workshops[workshopIndex]
                                    .whyChooseUs === "string" && (
                                    <div className="text-red-500 text-sm font-medium">
                                      {
                                        errors.workshops[workshopIndex]
                                          .whyChooseUs
                                      }
                                    </div>
                                  )}
                              </div>

                              {/* Age Groups */}
                              <div className="space-y-3">
                                <label className="block text-base sm:text-lg font-semibold text-gray-900">
                                  Target Age Group
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                  {["6-12", "13-19", "20+"].map((age) => (
                                    <label
                                      key={age}
                                      className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-green-50 group ${
                                        isSubmitting
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                    >
                                      <Field
                                        type="checkbox"
                                        name={`workshops[${workshopIndex}].ageGroups`}
                                        value={age}
                                        checked={workshop.ageGroups.some(
                                          (group) => group.ageRange === age
                                        )}
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          const isChecked = e.target.checked;
                                          if (isChecked) {
                                            setFieldValue(
                                              `workshops[${workshopIndex}].ageGroups`,
                                              [
                                                ...workshop.ageGroups,
                                                {
                                                  ageRange: age,
                                                  serviceOverview: "",
                                                  benefits: [
                                                    {
                                                      title: "",
                                                      description: "",
                                                    },
                                                  ],
                                                  image: null,
                                                },
                                              ]
                                            );
                                          } else {
                                            setFieldValue(
                                              `workshops[${workshopIndex}].ageGroups`,
                                              workshop.ageGroups.filter(
                                                (group) =>
                                                  group.ageRange !== age
                                              )
                                            );
                                            setImageFiles((prev) => {
                                              const newMap = new Map(prev);
                                              newMap.delete(
                                                `${workshopIndex}-${workshop.ageGroups.findIndex(
                                                  (g) => g.ageRange === age
                                                )}-${age}`
                                              );
                                              return newMap;
                                            });
                                          }
                                        }}
                                        disabled={isSubmitting}
                                        className="w-4 sm:w-5 h-4 sm:h-5 rounded text-green-600 border-2 border-gray-300 focus:ring-green-500 focus:ring-2"
                                      />
                                      <span className="text-gray-900 font-medium group-hover:text-green-700 text-sm sm:text-base">
                                        {age} years old
                                      </span>
                                    </label>
                                  ))}
                                </div>
                                {touched.workshops &&
                                  errors.workshops &&
                                  errors.workshops[workshopIndex] &&
                                  typeof errors.workshops[workshopIndex]
                                    .ageGroups === "string" && (
                                    <div className="text-red-500 text-sm font-medium">
                                      {
                                        errors.workshops[workshopIndex]
                                          .ageGroups
                                      }
                                    </div>
                                  )}
                              </div>

                              {/* Age Group Details */}
                              {workshop.ageGroups.map(
                                (group, ageGroupIndex) => (
                                  <div
                                    key={ageGroupIndex}
                                    className="space-y-4 sm:space-y-6 border-t pt-4 sm:pt-6 mt-4 sm:mt-6"
                                  >
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                      Details for Age Group: {group.ageRange}
                                    </h3>

                                    {/* Service Overview */}
                                    <div className="space-y-3">
                                      <label
                                        htmlFor={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].serviceOverview`}
                                        className="block text-base sm:text-lg font-semibold text-gray-900"
                                      >
                                        Service Overview
                                      </label>
                                      <Field
                                        id={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].serviceOverview`}
                                        name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].serviceOverview`}
                                        as="textarea"
                                        rows={4}
                                        placeholder={`Service overview for ${group.ageRange}`}
                                        disabled={isSubmitting}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                      />
                                      <ErrorMessage
                                        name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].serviceOverview`}
                                        component="div"
                                        className="text-red-500 text-sm font-medium"
                                      />
                                    </div>

                                    {/* Benefits */}
                                    <div className="space-y-3">
                                      <label className="block text-base sm:text-lg font-semibold text-gray-900">
                                        Benefits
                                      </label>
                                      <FieldArray
                                        name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].benefits`}
                                      >
                                        {({
                                          push,
                                          remove,
                                        }: {
                                          push: (value: {
                                            title: string;
                                            description: string;
                                          }) => void;
                                          remove: (index: number) => void;
                                        }) => (
                                          <div className="space-y-4">
                                            {group.benefits.map(
                                              (_, benefitIndex) => (
                                                <div
                                                  key={benefitIndex}
                                                  className="flex flex-col gap-3 border p-4 rounded-xl bg-gray-50"
                                                >
                                                  <div className="space-y-2">
                                                    <label
                                                      htmlFor={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].benefits[${benefitIndex}].title`}
                                                      className="block text-sm font-medium text-gray-700"
                                                    >
                                                      Benefit Title
                                                    </label>
                                                    <Field
                                                      name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].benefits[${benefitIndex}].title`}
                                                      type="text"
                                                      placeholder={`Benefit title ${
                                                        benefitIndex + 1
                                                      }`}
                                                      disabled={isSubmitting}
                                                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                    <ErrorMessage
                                                      name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].benefits[${benefitIndex}].title`}
                                                      component="div"
                                                      className="text-red-500 text-sm font-medium"
                                                    />
                                                  </div>
                                                  <div className="space-y-2">
                                                    <label
                                                      htmlFor={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].benefits[${benefitIndex}].description`}
                                                      className="block text-sm font-medium text-gray-700"
                                                    >
                                                      Benefit Description
                                                    </label>
                                                    <Field
                                                      name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].benefits[${benefitIndex}].description`}
                                                      as="textarea"
                                                      rows={3}
                                                      placeholder={`Benefit description ${
                                                        benefitIndex + 1
                                                      }`}
                                                      disabled={isSubmitting}
                                                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    />
                                                    <ErrorMessage
                                                      name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].benefits[${benefitIndex}].description`}
                                                      component="div"
                                                      className="text-red-500 text-sm font-medium"
                                                    />
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      remove(benefitIndex)
                                                    }
                                                    disabled={isSubmitting}
                                                    className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                  >
                                                    <FaTrash className="w-4 h-4" />
                                                    Remove Benefit
                                                  </button>
                                                </div>
                                              )
                                            )}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                push({
                                                  title: "",
                                                  description: "",
                                                })
                                              }
                                              disabled={isSubmitting}
                                              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              <PlusIcon className="w-5 h-5" />
                                              Add Benefit for {group.ageRange}
                                            </button>
                                          </div>
                                        )}
                                      </FieldArray>
                                      {touched.workshops &&
                                        errors.workshops &&
                                        errors.workshops[workshopIndex] &&
                                        errors.workshops[workshopIndex]
                                          .ageGroups &&
                                        errors.workshops[workshopIndex]
                                          .ageGroups[ageGroupIndex] &&
                                        typeof errors.workshops[workshopIndex]
                                          .ageGroups[ageGroupIndex].benefits ===
                                          "string" && (
                                          <div className="text-red-500 text-sm font-medium">
                                            {
                                              errors.workshops[workshopIndex]
                                                .ageGroups[ageGroupIndex]
                                                .benefits
                                            }
                                          </div>
                                        )}
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-3">
                                      <label
                                        htmlFor={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].image`}
                                        className="block text-base sm:text-lg font-semibold text-gray-900"
                                      >
                                        Workshop Image for {group.ageRange}
                                      </label>
                                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                        <div
                                          className={`relative flex items-center justify-center w-full sm:w-40 md:w-48 h-40 md:h-48 border-3 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-all duration-200 bg-gray-50 hover:bg-green-50 group cursor-pointer ${
                                            isSubmitting
                                              ? "opacity-50 cursor-not-allowed"
                                              : ""
                                          }`}
                                        >
                                          <input
                                            id={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].image`}
                                            name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].image`}
                                            type="file"
                                            accept="image/*"
                                            disabled={isSubmitting}
                                            onChange={(
                                              event: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                              handleImageChange(
                                                event,
                                                setFieldValue,
                                                workshopIndex,
                                                ageGroupIndex,
                                                group.ageRange
                                              )
                                            }
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                          />
                                          <div className="text-center">
                                            <PlusIcon className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 group-hover:text-green-500 mx-auto mb-2 transition-colors duration-200" />
                                            <p className="text-gray-600 font-medium group-hover:text-green-600 text-sm sm:text-base">
                                              Click to upload image
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                              PNG, JPG, GIF up to 10MB
                                            </p>
                                          </div>
                                        </div>
                                        {group.image && (
                                          <div className="relative group">
                                            <img
                                              src={group.image}
                                              alt={`Workshop preview for ${group.ageRange}`}
                                              className="w-full sm:w-40 md:w-48 h-40 md:h-48 object-cover rounded-xl shadow-lg"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleImageRemove(
                                                  setFieldValue,
                                                  workshopIndex,
                                                  ageGroupIndex,
                                                  group.ageRange
                                                )
                                              }
                                              disabled={isSubmitting}
                                              className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              <FaTrash className="w-4 h-4" />
                                            </button>
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200"></div>
                                          </div>
                                        )}
                                      </div>
                                      <ErrorMessage
                                        name={`workshops[${workshopIndex}].ageGroups[${ageGroupIndex}].image`}
                                        component="div"
                                        className="text-red-500 text-sm font-medium"
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              push({
                                workshopName: "",
                                overview: "",
                                whyChooseUs: [{ heading: "", description: "" }],
                                ageGroups: [],
                              })
                            }
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="w-5 h-5" />
                            Add Workshop
                          </button>
                        </div>
                      )}
                    </FieldArray>
                    {touched.workshops &&
                      errors.workshops &&
                      typeof errors.workshops === "string" && (
                        <div className="text-red-500 text-sm font-medium">
                          {errors.workshops}
                        </div>
                      )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 sm:pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-4 text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl transition-all duration-300 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <FaTrash className="w-5 h-5 animate-spin" />
                          Processing...
                        </div>
                      ) : workshopId ? (
                        "Update Workshop Category"
                      ) : (
                        "Create Workshop Category"
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorkshop;
