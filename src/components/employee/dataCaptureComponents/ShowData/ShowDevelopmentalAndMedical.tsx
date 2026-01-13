import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";
import ShowAcademicAndSocialHistory from "./ShowAcademicAndSocialHistory";
import ShowFamilyAndEnvironmentalObservation from "./ShowFamilyAndEnvironmentalObservation";

const InfoBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500 print-label">{label}</p>
    <div className="border rounded-md p-3 text-sm text-gray-800 bg-gray-50 print-box">
      {value || "-"}
    </div>
  </div>
);

const OptionBadge = ({
  options,
  value,
}: {
  options: string[];
  value?: string;
}) => (
  <div className="flex flex-wrap gap-2 mt-1 print-radio-wrapper">
    {options.map((opt) => {
      const selected = value === opt;

      return (
        <div
          key={opt}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm print-badge print-radio
            ${
              selected
                ? "border-orange-600 bg-orange-50 text-orange-700 font-medium print-radio-selected"
                : "border-gray-300 text-gray-500"
            }`}
        >
          {/* Icon instead of custom circle */}
          {selected ? (
            <FaRegSquareCheck className="text-orange-600" size={16} />
          ) : (
            <FaRegSquare className="text-gray-400" size={16} />
          )}

          <span className="print-badge">{opt}</span>
        </div>
      );
    })}
  </div>
);

const ShowDevelopmentalAndMedicalDetails = ({
  singleData,
}: {
  singleData: Details | null;
}) => {
  if (!singleData || !singleData.developmental) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading developmental details...
      </div>
    );
  }
  const dev = singleData.developmental;

  const developmentalOptions = ["On-time", "Delayed"];

  return (
    <div
      id="print-demographic"
      className="border rounded-xl mt-5 p-5 space-y-8 print-area"
    >
      <h2 className="text-xl text-center font-bold text-orange-600">
        DEVELOPMENTAL & MEDICAL DETAILS
      </h2>

      {/* Developmental Status as Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1 print-label">
            Speech Development
          </p>
          <OptionBadge options={developmentalOptions} value={dev.speech} />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1 print-label">Motor Skills</p>
          <OptionBadge options={developmentalOptions} value={dev.motorSkills} />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1 print-label">
            Social Interaction
          </p>
          <OptionBadge
            options={developmentalOptions}
            value={dev.socialInteraction}
          />
        </div>
      </div>

      {/* Medical Text Sections */}
      <div className="grid grid-cols-1 gap-4">
        <InfoBlock
          label="Previous Medical Illness / Ongoing Treatment"
          value={dev.medicalIllness}
        />

        <InfoBlock
          label="Learning Disability Diagnosed / Noticed"
          value={dev.learningDisability}
        />

        <InfoBlock label="Current Medications" value={dev.currentMedication} />

        <InfoBlock label="Sleep Pattern" value={dev.sleepPattenrn} />
      </div>
      <ShowAcademicAndSocialHistory singleData={singleData} />
      <ShowFamilyAndEnvironmentalObservation singleData={singleData} />
    </div>
  );
};

export default ShowDevelopmentalAndMedicalDetails;
