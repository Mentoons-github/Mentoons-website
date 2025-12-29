import { X } from "lucide-react";
import ReviewMechanismFirst from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismFirst";
import {
  Details,
  ReviewMechanismFormValues,
} from "@/types/employee/dataCaptureTypes";
import ShowReviewMechanismSecond from "../dataCaptureComponents/ReviewMechanism/ShowReviewMechanism/ShowReviewMechanismSecond";
import ShowReviewMechanismThird from "../dataCaptureComponents/ReviewMechanism/ShowReviewMechanism/ShowReviewMechanismThird";
import ShowReviewMechanismFourth from "../dataCaptureComponents/ReviewMechanism/ShowReviewMechanism/ShowReviewMechanismFourth";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { ReviewMecahinsmInitialValues } from "@/constant/employee/reviewMechanismValues";
import { reviewMechanismSchema } from "@/validation/reviewMechanismValidation";
import ReviewMechanismSecond from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismSecond";
import ReviewMechanismThird from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismThird";
import ReviewMechanismFourth from "../dataCaptureComponents/ReviewMechanism/ReviewMechanismFourth";
import { addDataCaptureReviewThunk } from "@/redux/employee/dataCaptureRedux/dataCaptureThunk";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";
import { resetDataCaptureSlice } from "@/redux/employee/dataCaptureRedux/dataCaptureSlice";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableReview from "../dataCaptureComponents/ReviewMechanism/ShowReviewMechanism/PrintableReview";
import axios from "axios";

const ShowReviewMechanism = ({
  onClose,
  singleData,
}: {
  onClose: () => void;
  singleData: Details;
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const { message, error, success } = useAppSelector(
    (state) => state.data_capture
  );

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${singleData.demographic.child.name}-Review`,
  });

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
      toast.success("Review Edit successfull");
      dispatch(resetDataCaptureSlice());
      setIsEdit(false);
    }
    if (error) {
      toast.error(error);
    }
  }, [dispatch, error, message, onClose, success]);

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

  return (
    <div
      onClick={() => onClose()}
      className="fixed inset-0 bg-black/70 flex justify-center backdrop:blur-md items-center p-4 z-50 transition-opacity duration-300"
    >
      <style>
        {`
@page {
  size: A4;
  margin: 5mm;
    @bottom-right {
    margin: 0mm;
    content: "Page " counter(page) " / " counter(pages);
  }
}

@media print {
  body {
    background: white !important;
  }

  .print-root {
    width: 210mm;
  }

  .a4-page {
    width: 210mm;
    height: 297mm; 
    padding: ;
    box-sizing: border-box;
    page-break-after: always;
    background: white;
    overflow: hidden;
    
  }

  .a4-page:last-child {
    page-break-after: auto;
  }
}

 @media print {
  .a4-page {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
}


@media screen {
  .a4-page {
    width: 210mm;
    height: 297mm;
    padding: 15mm;
    box-sizing: border-box;
    margin:  auto;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
  }
}
`}
      </style>

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white h-[650px] rounded-lg relative shadow-xl w-full max-w-3xl transform transition-all duration-300 ease-in-out overflow-auto"
      >
        <div className=" absolute top-3 right-3 flex justify-end mb-2 z-50">
          <button className="text-sm text-gray-500" onClick={() => onClose()}>
            <X className="text-orange-500 hover:text-orange-300" />
          </button>
        </div>
        {!isEdit && (
          <div className="mt-5 flex justify-end gap-3 p-5">
            <button
              className="py-2 px-3 bg-orange-500 rounded-md"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
            <button
              className="py-2 px-3 bg-orange-500 rounded-md"
              onClick={handlePrint}
            >
              Print Details
            </button>
          </div>
        )}
        {isEdit ? (
          <Formik
            enableReinitialize
            initialValues={{
              ...ReviewMecahinsmInitialValues,

              stepsTaken: singleData.reviewMechanism?.stepsTaken ?? "",

              progressEffectivenessRating:
                singleData.reviewMechanism?.progressEffectivenessRating ?? "",

              observableProgressIndicators: {
                emotionalRegulation:
                  singleData.reviewMechanism?.observableProgressIndicators
                    ?.emotionalRegulation ?? "",
                behaviourAtHome:
                  singleData.reviewMechanism?.observableProgressIndicators
                    ?.behaviourAtHome ?? "",
                behaviourAtSchool:
                  singleData.reviewMechanism?.observableProgressIndicators
                    ?.behaviourAtSchool ?? "",
                attentionAndFocus:
                  singleData.reviewMechanism?.observableProgressIndicators
                    ?.attentionAndFocus ?? "",
                socialInteraction:
                  singleData.reviewMechanism?.observableProgressIndicators
                    ?.socialInteraction ?? "",
                notes:
                  singleData.reviewMechanism?.observableProgressIndicators
                    ?.notes ?? "",
              },
              whyInventionsWorking: {
                relatedToMentoonsProvider: {
                  reasons:
                    singleData.reviewMechanism?.whyInventionsWorking
                      .relatedToMentoonsProvider.reasons ?? [],
                  otherReason:
                    singleData.reviewMechanism?.whyInventionsWorking
                      .relatedToMentoonsProvider.otherReason ?? "",
                  remarks:
                    singleData.reviewMechanism?.whyInventionsWorking
                      .relatedToMentoonsProvider.remarks ?? "",
                },
                relatedToChild: {
                  reasons:
                    singleData.reviewMechanism?.whyInventionsWorking
                      .relatedToChild.reasons ?? [],
                  otherReason:
                    singleData.reviewMechanism?.whyInventionsWorking
                      .relatedToChild.otherReason ?? "",
                  remarks:
                    singleData.reviewMechanism?.whyInventionsWorking
                      .relatedToChild.remarks ?? "",
                },
              },
              evaluationSummary:
                singleData.reviewMechanism?.evaluationSummary ?? "",
              actionPlanOrNextSteps:
                singleData.reviewMechanism?.actionPlanOrNextSteps ?? [],
              plannedChangesOrRecommendations:
                singleData.reviewMechanism?.plannedChangesOrRecommendations ??
                "",
              psychologist: singleData.psychologist?.user.name ?? "",
              childName: singleData.demographic.child.name,
              age: singleData.demographic.child.age,
              signature: singleData.reviewMechanism?.signature ?? "",
            }}
            validationSchema={reviewMechanismSchema}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-6 p-4">
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
                    onClick={() => setIsEdit(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <ReviewMechanismFirst singleData={singleData} />
            <ShowReviewMechanismSecond singleData={singleData} />
            <ShowReviewMechanismThird singleData={singleData} />
            <ShowReviewMechanismFourth singleData={singleData} />
          </div>
        )}
        <div style={{ display: "none" }}>
          <PrintableReview ref={printRef} singleData={singleData} />
        </div>
      </div>
    </div>
  );
};

export default ShowReviewMechanism;
