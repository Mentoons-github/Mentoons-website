import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import {
  MeetupInitialValues,
  MeetupValidationSchema,
} from "@/utils/formik/admin/addMeetup";
import axios from "axios";
import { ChangeEvent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "@/redux/fileUploadSlice";
import { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
import { MeetupFormValues } from "@/types";
import { useParams, useNavigate } from "react-router-dom";

const AddMeetup = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [initialValues, setInitialValues] =
    useState<MeetupFormValues>(MeetupInitialValues);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMeetupData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_PROD_URL}/meetup/${id}`,
            {
              headers: {
                Authorization: `Bearer ${await getToken()}`,
              },
            }
          );
          const meetupData = response.data.data;
          const dateTime = meetupData.dateTime
            ? new Date(meetupData.dateTime)
            : null;
          const updatedInitialValues: MeetupFormValues = {
            title: meetupData.title || "",
            date: dateTime ? dateTime.toISOString().split("T")[0] : "",
            time: dateTime
              ? `${dateTime
                  .getUTCHours()
                  .toString()
                  .padStart(2, "0")}:${dateTime
                  .getUTCMinutes()
                  .toString()
                  .padStart(2, "0")}`
              : "",
            duration: meetupData.duration || "1 hour",
            maxCapacity: meetupData.maxCapacity || 0,
            isOnline: meetupData.isOnline || false,
            platform: meetupData.platform || "",
            meetingLink: meetupData.meetingLink || "",
            place: meetupData.place || "",
            description: meetupData.description || "",
            detailedDescription: meetupData.detailedDescription || "",
            speakerName: meetupData.speakerName || "",
            speakerImage: meetupData.speakerImage,
            speakerImageUrl: meetupData.speakerImage || "",
            topics: meetupData.topics?.join(", ") || "",
            tags: meetupData.tags?.join(", ") || "",
          };
          setInitialValues(updatedInitialValues);
          if (meetupData.speakerImage) {
            console.log("Setting image preview to:", meetupData.speakerImage);
            setImagePreview(meetupData.speakerImage);
          } else {
            setImagePreview(null);
          }
        } catch (error: any) {
          console.error("Error fetching meetup data:", error);
          setModalOpen(true);
          setModalMessage(
            error.response?.data?.message ||
              "Failed to load meetup data. Please try again."
          );
          setIsError(true);
        }
      }
    };

    fetchMeetupData();
  }, [id, getToken]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("speakerImage", file);
      setFieldValue("speakerImageUrl", null);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("New image selected for preview:", file.name);
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFieldValue("speakerImage", null);
      setFieldValue("speakerImageUrl", null);
      setImagePreview(null);
    }
  };

  const removeImage = async (
    setFieldValue: (field: string, value: any) => void,
    values: MeetupFormValues
  ) => {
    setModalOpen(true);
    setModalMessage("Processing image removal...");
    setIsError(false);

    try {
      console.log(values.speakerImage, initialValues.speakerImageUrl);
      if (!values.speakerImage && id && initialValues.speakerImage) {
        console.log("Calling DELETE API for meetup image:", id);
        const response = await axios.delete(
          `${import.meta.env.VITE_PROD_URL}/meetup/${id}/image`,
          {
            headers: {
              Authorization: `Bearer ${await getToken()}`,
            },
          }
        );
        console.log("Delete image response:", response.data);
        setModalMessage(response.data.message || "Image deleted successfully!");
      } else {
        setModalMessage("Image removed from input!");
      }
      setFieldValue("speakerImage", null);
      setFieldValue("speakerImageUrl", null);
      setImagePreview(null);
      setTimeout(() => {
        setModalOpen(false);
      }, 1500);
    } catch (error: any) {
      console.error("Error deleting image:", error);
      setModalMessage(
        error.response?.data?.message ||
          "Failed to delete image. Please try again."
      );
      setIsError(true);
    }
  };

  const handleSubmit = async (
    values: MeetupFormValues,
    { setSubmitting, resetForm }: FormikHelpers<MeetupFormValues>
  ) => {
    setModalOpen(true);
    setModalMessage("Processing...");
    setIsError(false);

    try {
      let updatedValues: MeetupFormValues = { ...values };

      if (values.speakerImage instanceof File) {
        setModalMessage("Uploading speaker image...");
        console.log(values.speakerImage);
        const resultAction = await dispatch(
          uploadFile({ file: values.speakerImage, getToken })
        );

        if (uploadFile.fulfilled.match(resultAction)) {
          const uploadedUrl = resultAction.payload.data.fileDetails?.url;
          if (!uploadedUrl) {
            throw new Error("Failed to get uploaded image URL");
          }
          updatedValues = {
            ...values,
            speakerImage: null,
            speakerImageUrl: uploadedUrl,
          };
        } else {
          throw new Error("Image upload failed");
        }
      }

      const dateTime =
        values.date && values.time
          ? new Date(`${values.date}T${values.time}:00.000Z`).toISOString()
          : null;

      const submitData = {
        ...updatedValues,
        dateTime,
        date: undefined,
        time: undefined,
      };

      setModalMessage(id ? "Updating meetup..." : "Submitting meetup...");
      const url = id
        ? `${import.meta.env.VITE_PROD_URL}/meetup/edit/${id}`
        : `${import.meta.env.VITE_PROD_URL}/meetup/add`;
      const method = id ? "patch" : "post";

      const response = await axios({
        method,
        url,
        data: submitData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      console.log(
        id ? "Meetup updated successfully:" : "Meetup created successfully:",
        response.data
      );
      setModalMessage(
        response.data.message ||
          (id ? "Meetup updated successfully!" : "Meetup created successfully!")
      );
      setTimeout(() => {
        setModalOpen(false);
        if (!id) {
          resetForm();
          setImagePreview(null);
        } else {
          navigate("/admin/meetups");
        }
      }, 1500);
    } catch (error: any) {
      console.error("Error processing meetup:", error);
      setModalMessage(
        error.response?.data?.message ||
          (id
            ? "Failed to update meetup. Please try again."
            : "Failed to create meetup. Please try again.")
      );
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        {id ? "Edit" : "Add"} Meetup
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={MeetupValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Child Creativity & Fun Learning"
                />
                <ErrorMessage
                  name="title"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <Field
                  type="date"
                  name="date"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="date"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <Field
                  type="time"
                  name="time"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="time"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <Field
                  as="select"
                  name="duration"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1/2 hour">1/2 hour</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="5 hours">5 hours</option>
                </Field>
                <ErrorMessage
                  name="duration"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Max Capacity
                </label>
                <Field
                  type="number"
                  name="maxCapacity"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="maxCapacity"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Online/Offline
                </label>
                <Field
                  as="select"
                  name="isOnline"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setFieldValue("isOnline", e.target.value === "true");
                    setFieldValue("meetingLink", "");
                    setFieldValue("place", "");
                  }}
                >
                  <option value="true">Online</option>
                  <option value="false">Offline</option>
                </Field>
                <ErrorMessage
                  name="isOnline"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {values.isOnline ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <Field
                      as="select"
                      name="platform"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setFieldValue("platform", e.target.value);
                        setFieldValue("meetingLink", "");
                      }}
                    >
                      <option value="Google Meet">Google Meet</option>
                      <option value="Zoom">Zoom</option>
                      <option value="Microsoft Teams">Microsoft Teams</option>
                      <option value="Cisco Webex">Cisco Webex</option>
                      <option value="Discord">Discord</option>
                    </Field>
                    <ErrorMessage
                      name="platform"
                      component="p"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Meeting Link
                    </label>
                    <Field
                      type="url"
                      name="meetingLink"
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`e.g., https://${
                        values.platform === "Google Meet"
                          ? "meet.google.com"
                          : values.platform === "Zoom"
                          ? "zoom.us"
                          : values.platform === "Microsoft Teams"
                          ? "teams.microsoft.com"
                          : values.platform === "Cisco Webex"
                          ? "webex.com"
                          : "discord.gg"
                      }/abc-123`}
                    />
                    <ErrorMessage
                      name="meetingLink"
                      component="p"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>
                  <div></div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Place
                  </label>
                  <Field
                    type="text"
                    name="place"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Community Center, Mumbai"
                  />
                  <ErrorMessage
                    name="place"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Engage children in creative problem-solving activities"
              />
              <ErrorMessage
                name="description"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Detailed Description
              </label>
              <Field
                as="textarea"
                name="detailedDescription"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Online interactive session..."
              />
              <ErrorMessage
                name="detailedDescription"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Speaker Name
                </label>
                <Field
                  type="text"
                  name="speakerName"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Ms. Priya Sharma"
                />
                <ErrorMessage
                  name="speakerName"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Speaker Image (Optional)
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                <ErrorMessage
                  name="speakerImage"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>
            {imagePreview && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker Image Preview
                </label>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Speaker preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    onError={() => {
                      console.error(
                        "Failed to load image preview:",
                        imagePreview
                      );
                      setImagePreview(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(setFieldValue, values)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Topics (comma-separated)
                </label>
                <Field
                  type="text"
                  name="topics"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Creative Thinking, Problem Solving"
                />
                <ErrorMessage
                  name="topics"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma-separated)
                </label>
                <Field
                  type="text"
                  name="tags"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Parenting, Child Learning"
                />
                <ErrorMessage
                  name="tags"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting
                ? "Submitting..."
                : id
                ? "Update Meetup"
                : "Submit Meetup"}
            </button>
          </Form>
        )}
      </Formik>
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <p
              className={`text-center text-lg font-medium ${
                isError ? "text-red-500" : "text-gray-700"
              }`}
            >
              {modalMessage}
            </p>
            {isError && (
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMeetup;
