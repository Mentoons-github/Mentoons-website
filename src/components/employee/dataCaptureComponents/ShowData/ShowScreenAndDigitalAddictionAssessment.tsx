import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

const IMPACT_OPTIONS = [
  "Sleep disturbance",
  "Grades drop",
  "Social withdrawal",
  "Aggression",
  "Loss of interest in hobbies",
];

const TextBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500 print-label">{label}</p>
    <div className="border rounded-md bg-gray-50 p-3 text-sm print-box">
      {value || "-"}
    </div>
  </div>
);

const ChipGroup = ({
  options,
  selected = [],
}: {
  options: string[];
  selected?: string[];
}) => (
  <div className="flex flex-wrap gap-2 print-radio-wrapper">
    {options.map((opt) => (
      <span
        key={opt}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm print-badge print-radio
           ${
             selected.includes(opt)
               ? "border-orange-600 bg-orange-50 text-orange-700 font-medium print-radio-selected"
               : "border-gray-300 text-gray-500"
           }`}
      >
        {/* Icon instead of custom circle */}
        {selected.includes(opt) ? (
          <FaRegSquareCheck className="text-orange-600" size={16} />
        ) : (
          <FaRegSquare className="text-gray-400" size={16} />
        )}
        {opt}
      </span>
    ))}
  </div>
);

const RadioOptions = ({
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

/* ---------- MAIN COMPONENT ---------- */

const ShowScreenAndDigitalAddictionAssessment = ({
  singleData,
}: {
  singleData: Details | null;
}) => {
  if (!singleData || !singleData.ScreenAndDigitalAddication) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading screen & digital addiction details...
      </div>
    );
  }

  const screen = singleData.ScreenAndDigitalAddication;

  const selectedImpact = screen.parentPerspective.impactObserved || [];

  const predefinedImpact = selectedImpact.filter((item) =>
    IMPACT_OPTIONS.includes(item)
  );

  const otherImpact = selectedImpact.filter(
    (item) => !IMPACT_OPTIONS.includes(item)
  );

  return (
    <div className=" space-y-8">
      {/* HEADER */}
      <h2 className="text-xl font-bold text-center text-orange-600">
        SCREEN & DIGITAL ADDICTION ASSESSMENT
      </h2>

      {/* ================= PARENT ================= */}
      <section className=" space-y-4">
        <h3 className="font-semibold text-lg text-orange-500">
          I. Parent Perspective
        </h3>

        <TextBlock
          label="Daily screen time (in hours)"
          value={screen.parentPerspective.screenTime}
        />

        <div>
          <p className="text-sm text-gray-500 mb-1">
            Type of major screen usage
          </p>
          <ChipGroup
            options={["Games", "YouTube", "Social Media", "Cartoons", "Others"]}
            selected={screen.parentPerspective.typeOfScreenUsage}
          />
        </div>

        <div className="grid grid-cols-2">
          <div>
            <p className="text-sm text-gray-500 mb-1">
              Irritated if device is taken away?
            </p>
            <RadioOptions
              options={["Yes", "No"]}
              value={screen.parentPerspective.irritatedIfDiviceTakenAway}
            />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Sneaking phone use at night / secretly?
            </p>
            <RadioOptions
              options={["Yes", "No"]}
              value={screen.parentPerspective.sneakingPhoneUseSecretly}
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Impact observed</p>

          <ChipGroup options={IMPACT_OPTIONS} selected={predefinedImpact} />
        </div>
        {otherImpact.length > 0 && (
          <TextBlock
            label="Other impacts observed"
            value={otherImpact.join(", ")}
          />
        )}
      </section>

      {/* ================= CHILD ================= */}
      <section className=" space-y-4">
        <h3 className="font-semibold text-lg text-orange-500">
          II. Child Perspective
        </h3>

        <TextBlock
          label="Shows enjoyed most on mobile / TV"
          value={screen.childPerspective.enjoyMost}
        />

        <TextBlock
          label="Daily screen time"
          value={screen.childPerspective.dailyScreenSpend}
        />

        <div>
          <p className="text-sm text-gray-500 mb-1">
            Feeling when device is taken away
          </p>
          <RadioOptions
            options={["Sad", "Angry", "Calm", "Neutral"]}
            value={screen.childPerspective.fellDeviceTakeAway}
          />
        </div>

        <TextBlock
          label="Can spend a day without device? Why / Why not?"
          value={screen.childPerspective.canSpendDayWithoutMobile}
        />

        <TextBlock
          label="Hobbies apart from screens"
          value={screen.childPerspective.hobbiesAppartFromScreens}
        />
      </section>
    </div>
  );
};

export default ShowScreenAndDigitalAddictionAssessment;
