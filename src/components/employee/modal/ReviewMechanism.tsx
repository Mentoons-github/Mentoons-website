import { X } from "lucide-react";
import ReviewMechanismFirst from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismFirst";
import {
  Details,
  ReviewMechanismFormValues,
} from "@/types/employee/dataCaptureTypes";
import ReviewMechanismSecond from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismSecond";
import ReviewMechanismThird from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismThird";
import ReviewMechanismFourth from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismFourth";
import { Form, Formik } from "formik";
import { reviewMechanismSchema } from "@/validation/reviewMechanismValidation";
import { addDataCaptureReviewThunk } from "@/redux/employee/dataCaptureRedux/dataCaptureThunk";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useEffect } from "react";
import { toast } from "sonner";
import { ReviewMecahinsmInitialValues } from "@/constant/employee/reviewMechanismValues";
import axios from "axios";

const ReviewMechanism = ({
  onClose,
  singleData,
}: {
  onClose: () => void;
  singleData: Details;
}) => {
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const { message, error, success } = useAppSelector(
    (state) => state.data_capture
  );

  const uploadMediaFile = async (file: File) => {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/upload/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data.fileDetails.url;
    } catch (error) {
      console.error("Failed to upload media:", error);
      toast.error("Failed to upload media file");
      return null;
    }
  };

  const handleSubmit = async (values: ReviewMechanismFormValues) => {
    const token = await getToken();
    dispatch(
      addDataCaptureReviewThunk({
        token: token as string,
        dataCaptureId: singleData._id as string,
        reviewMechanism: values,
      })
    );
  };

  useEffect(() => {
    if (success) {
      toast.success(message);
      onClose();
    }
    if (error) {
      toast.error(error);
    }
  }, [error, message, onClose, success]);

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 bg-black/70 flex justify-center backdrop:blur-md items-center p-4 z-50 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white h-[650px] rounded-lg relative shadow-xl w-full max-w-3xl transform transition-all duration-300 ease-in-out overflow-auto"
      >
        <div className=" absolute top-3 right-3 flex justify-end mb-2 z-50">
          <button className="text-sm text-gray-500" onClick={() => onClose()}>
            <X className="text-orange-500 hover:text-orange-300" />
          </button>
        </div>
        <Formik
          initialValues={{
            ...ReviewMecahinsmInitialValues,
            psychologist: singleData.psychologist?.user.name ?? "",
            childName: singleData.demographic.child.name,
            age: singleData.demographic.child.age,
            signature: "",
          }}
          validationSchema={reviewMechanismSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6 p-2 md:p-4">
              <ReviewMechanismFirst singleData={singleData} />
              <ReviewMechanismSecond singleData={singleData} />
              <ReviewMechanismThird />
              <ReviewMechanismFourth
                uploadFile={async (file: File) => {
                  const url = await uploadMediaFile(file);
                  if (url) setFieldValue("signature", url);
                  return url;
                }}
              />

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded"
                >
                  Submit Review
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReviewMechanism;
