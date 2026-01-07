import { useEffect, useState } from "react";
import DemographicDetails from "../dataCaptureComponents/DemographicDetails";
import DevelopmentalAndMedical from "../dataCaptureComponents/DevelopmentalAndMedical";
import AcademicAndSocialHistory from "../dataCaptureComponents/AcademicAndSocialHistory";
import FamilyAndEnvironmentalObservation from "../dataCaptureComponents/FamilyAndEnvironmentalObservation";
import BehaviouralAndEmotional from "../dataCaptureComponents/BehaviouralAndEmotional";
import ScreenAndDigitalAddictionAssessment from "../dataCaptureComponents/ScreenAndDigitalAddictionAssessment";
import ChildsSelfPerception from "../dataCaptureComponents/ChildsSelfPerception";
import GoalsExpectations from "../dataCaptureComponents/GoalsExpectations";
import TherapistInitialObservation from "../dataCaptureComponents/TherapistInitialObservation";
import OtherAddictionPattern from "../dataCaptureComponents/OtherAddictionPattern";
import { Details } from "@/types/employee/dataCaptureTypes";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  createDataCaptureThunk,
  editDataCaptureThunk,
} from "@/redux/employee/dataCaptureRedux/dataCaptureThunk";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { resetDataCaptureSlice } from "@/redux/employee/dataCaptureRedux/dataCaptureSlice";
import { Menu, X } from "lucide-react";
import * as Yup from "yup";
import {
  academicSchema,
  behaviouralSchema,
  demographicSchema,
  developmentalSchema,
  familyEnvironmentalSchema,
  getEmptyDetails,
  goalsSchema,
  otherAddictionSchema,
  screenAddictionSchema,
  selfPerceptionSchema,
  therapistSchema,
} from "@/validation/dataCaptureValidationSchema";

const sidebarTabs = [
  {
    title: "Data Capture",
    items: [
      { label: "Demographic Details", tab: 1 },
      { label: "Developmental & Medical", tab: 2 },
      { label: "Academic & Social History", tab: 3 },
    ],
  },
  {
    title: "Psychologist Observations",
    items: [
      { label: "Family & Environment", tab: 4 },
      { label: "Behavioural & Emotional", tab: 5 },
      { label: "Screen & Digital Addiction", tab: 6 },
      { label: "Other Addiction Pattern", tab: 7 },
      { label: "Child’s Self Perception", tab: 8 },
      { label: "Goals & Expectations", tab: 9 },
      { label: "Therapist Observation", tab: 10 },
    ],
  },
];

const CreateDataCaptureModal = ({
  from,
  onClose,
  singleData,
}: {
  from?: string;
  onClose: () => void;
  singleData: Details;
}) => {
  const dispatch = useAppDispatch();
  const { error, loading, message, success } = useAppSelector(
    (state) => state.data_capture
  );
  const { getToken } = useAuth();
  const [tab, setTab] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);

  const [details, setDetails] = useState<Details>(getEmptyDetails());

  const fullSchema = Yup.object({
    ...demographicSchema.fields,
    ...developmentalSchema.fields,
    ...academicSchema.fields,
    ...familyEnvironmentalSchema.fields,
    ...behaviouralSchema.fields,
    ...screenAddictionSchema.fields,
    ...otherAddictionSchema.fields,
    ...selfPerceptionSchema.fields,
    ...goalsSchema.fields,
    ...therapistSchema.fields,
  });

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(resetDataCaptureSlice());
      onClose();
    }
    if (error) {
      toast.error(error);
      dispatch(resetDataCaptureSlice());
    }
  }, [dispatch, error, message, onClose, success]);

  useEffect(() => {
    if (from && singleData) {
      // EDIT MODE
      setDetails(singleData);
    } else {
      // CREATE MODE
      setDetails(getEmptyDetails());
    }
  }, [from, singleData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fullSchema.validate(details, { abortEarly: false });

      const token = await getToken();
      if (from) {
        dispatch(
          editDataCaptureThunk({
            data: details,
            token: token as string,
            dataCaptureId: singleData._id as string,
          })
        );
      } else {
        dispatch(
          createDataCaptureThunk({ data: details, token: token as string })
        );
      }
    } catch (err: any) {
      if (err.inner) {
        const errorMessages = err.inner
          .map((e: { message: string }) => `-> ${e.message}`)
          .join("\n ");
        toast.error(`Please fix the following errors:\n ${errorMessages}`, {
          style: { whiteSpace: "pre-line" },
        });
      } else {
        toast.error(err.message);
      }
    }
  };

  const handleNextTab = () => {
    setTab((prev) => Math.min(prev + 1, 10));
  };

  const handlePreviousTab = () => {
    setTab((prev) => Math.min(prev - 1, 10));
  };

  return (
    <div
      onClick={() => onClose()}
      className={`fixed ${
        !from && " bg-black/70"
      } inset-0 flex justify-center backdrop:blur-md items-center p-4 z-50 transition-opacity duration-300`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white h-[650px] rounded-lg relative shadow-xl w-full max-w-7xl transform transition-all duration-300 ease-in-out overflow-auto"
      >
        <div className=" absolute top-3 right-3 flex justify-end mb-2 z-50">
          <button
            className="text-sm text-gray-500"
            onClick={() => {
              onClose();
            }}
          >
            <X className="text-orange-500 hover:text-orange-300" />
          </button>
        </div>

        <div
          className="lg:hidden flex justify-between items-center absolute top-1 left-1  z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar(true);
            }}
            className=" p-1 rounded bg-orange-500 text-white"
          >
            <Menu />
          </button>
        </div>

        <div className="flex h-full relative">
          {showSidebar && (
            <div
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
          )}

          {/* Sidebar */}
          <div
            className={`
              fixed lg:static z-50 lg:z-auto
              top-0 left-0 h-full lg:h-auto
              w-72 bg-gray-50 border-r p-4 space-y-2 lg:space-y-4
              transform transition-transform duration-300
              ${showSidebar ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0
            `}
          >
            {/* Close button (mobile) */}
            <div className="lg:hidden flex justify-end mb-2">
              <button
                onClick={() => setShowSidebar(false)}
                className="text-sm text-gray-500"
              >
                <X className="text-orange-500" />
              </button>
            </div>

            <div className="  flex justify-center flex-shrink-0 ">
              <img
                src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
                alt="Mentoons Logo"
                className={`object-contain transition-all duration-300 w-36`}
              />
            </div>
            {sidebarTabs.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  {section.title}
                </h3>

                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.tab}
                      onClick={() => {
                        setTab(item.tab);
                        setShowSidebar(false); // ✅ auto-close on mobile
                      }}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-all
              ${
                tab === item.tab
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-auto md:pl-0">
            {tab === 1 && (
              <DemographicDetails
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
              />
            )}
            {tab === 2 && (
              <DevelopmentalAndMedical
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 3 && (
              <AcademicAndSocialHistory
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 4 && (
              <FamilyAndEnvironmentalObservation
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 5 && (
              <BehaviouralAndEmotional
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 6 && (
              <ScreenAndDigitalAddictionAssessment
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 7 && (
              <OtherAddictionPattern
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 8 && (
              <ChildsSelfPerception
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 9 && (
              <GoalsExpectations
                details={details}
                setDetails={setDetails}
                handleNext={handleNextTab}
                handlePrevious={handlePreviousTab}
              />
            )}
            {tab === 10 && (
              <TherapistInitialObservation
                from={from}
                details={details}
                setDetails={setDetails}
                handleSubmit={handleSubmit}
                handlePrevious={handlePreviousTab}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDataCaptureModal;
