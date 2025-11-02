import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import {
  MeetupInitialValues,
  MeetupValidationSchema,
  MeetupFormValues,
} from "@/utils/formik/admin/addMeetup";
import axios from "axios";
import { ChangeEvent, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "@/redux/fileUploadSlice";
import { AppDispatch } from "@/redux/store";
import { useAuth } from "@clerk/clerk-react";
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

  // Fetch data for edit mode
  useEffect(() => {
    const fetchMeetupData = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/meetup/${id}`,
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
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
            ? `${dateTime.getUTCHours().toString().padStart(2, "0")}:${dateTime
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
          speakerImage: null,
          speakerImageUrl: meetupData.speakerImage || "",
          topics: meetupData.topics?.join(", ") || "",
          tags: meetupData.tags?.join(", ") || "",
        };

        setInitialValues(updatedInitialValues);
        if (meetupData.speakerImage) {
          setImagePreview(meetupData.speakerImage);
        }
      } catch (error: any) {
        setModalOpen(true);
        setModalMessage(
          error.response?.data?.message || "Failed to load meetup data."
        );
        setIsError(true);
      }
    };

    fetchMeetupData();
  }, [id, getToken]);

  // Handle image upload
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
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFieldValue("speakerImage", null);
      setFieldValue("speakerImageUrl", null);
      setImagePreview(null);
    }
  };

  // Remove image
  const removeImage = async (
    setFieldValue: (field: string, value: any) => void,
    values: MeetupFormValues
  ) => {
    setModalOpen(true);
    setModalMessage("Removing image...");
    setIsError(false);

    try {
      if (!values.speakerImage && id && initialValues.speakerImageUrl) {
        await axios.delete(
          `${import.meta.env.VITE_PROD_URL}/meetup/${id}/image`,
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
          }
        );
        setModalMessage("Image deleted successfully!");
      } else {
        setModalMessage("Image removed from input.");
      }

      setFieldValue("speakerImage", null);
      setFieldValue("speakerImageUrl", null);
      setImagePreview(null);
      setTimeout(() => setModalOpen(false), 1500);
    } catch (error: any) {
      setModalMessage(
        error.response?.data?.message || "Failed to delete image."
      );
      setIsError(true);
    }
  };

  // Submit handler
  const handleSubmit = async (
    values: MeetupFormValues,
    { setSubmitting, resetForm }: FormikHelpers<MeetupFormValues>
  ) => {
    setModalOpen(true);
    setModalMessage("Processing...");
    setIsError(false);

    try {
      const updatedValues: any = { ...values };

      // Convert comma-separated strings to arrays
      const parseList = (str: string) =>
        str
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

      updatedValues.topics = parseList(values.topics);
      updatedValues.tags = parseList(values.tags);

      // Upload image if new
      if (values.speakerImage instanceof File) {
        setModalMessage("Uploading image...");
        const resultAction = await dispatch(
          uploadFile({ file: values.speakerImage, getToken })
        );

        if (uploadFile.fulfilled.match(resultAction)) {
          const uploadedUrl = resultAction.payload.data.fileDetails?.url;
          if (!uploadedUrl) throw new Error("Image upload failed");
          updatedValues.speakerImageUrl = uploadedUrl;
          updatedValues.speakerImage = null;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // Combine date + time
      const dateTime =
        values.date && values.time
          ? new Date(`${values.date}T${values.time}:00.000Z`).toISOString()
          : null;

      const submitData = {
        ...updatedValues,
        dateTime,
        date: undefined,
        time: undefined,
        // Ensure platform/meetingLink are undefined if offline
        ...(values.isOnline
          ? {}
          : { platform: undefined, meetingLink: undefined }),
      };

      setModalMessage(id ? "Updating meetup..." : "Creating meetup...");

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

      setModalMessage(
        response.data.message || (id ? "Meetup updated!" : "Meetup created!")
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
      console.error("Submit error:", error);
      setModalMessage(
        error.response?.data?.message ||
          (id ? "Failed to update meetup." : "Failed to create meetup.")
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
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Title, Date, Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <ErrorMessage
                  name="time"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>

            {/* Duration, Capacity, Online/Offline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <Field
                  as="select"
                  name="duration"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const isOnline = e.target.value === "true";
                    setFieldValue("isOnline", isOnline);
                    if (!isOnline) {
                      setFieldValue("platform", undefined);
                      setFieldValue("meetingLink", undefined);
                    }
                    setFieldValue("place", "");
                  }}
                >
                  <option value="true">Online</option>
                  <option value="false">Offline</option>
                </Field>
              </div>
            </div>

            {/* Platform / Meeting Link / Place */}
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
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      placeholder={`https://${
                        values.platform === "Google Meet"
                          ? "meet.google.com"
                          : values.platform === "Zoom"
                          ? "zoom.us"
                          : values.platform === "Microsoft Teams"
                          ? "teams.microsoft.com"
                          : values.platform === "Cisco Webex"
                          ? "webex.com"
                          : "discord.gg"
                      }/...`}
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
              <ErrorMessage
                name="detailedDescription"
                component="p"
                className="mt-1 text-sm text-red-500"
              />
            </div>

            {/* Speaker */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Speaker Name
                </label>
                <Field
                  type="text"
                  name="speakerName"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaker Image Preview
                </label>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Speaker"
                    className="w-32 h-32 object-cover rounded-lg border"
                    onError={() => setImagePreview(null)}
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

            {/* Topics & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Topics (comma-separated)
                </label>
                <Field
                  type="text"
                  name="topics"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Art, Music, Creativity"
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
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Kids, Parenting, Learning"
                />
                <ErrorMessage
                  name="tags"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting
                ? "Submitting..."
                : id
                ? "Update Meetup"
                : "Create Meetup"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Modal */}
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
                onClick={() => setModalOpen(false)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
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
