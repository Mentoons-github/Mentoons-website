import { Details } from "@/types/employee/dataCaptureTypes";
import { CheckboxGroup, RadioGroup, TextArea } from "./FormInputs";
import { useState } from "react";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
  handlePrevious: () => void;
};

const ScreenAndDigitalAddictionAssessment = ({
  details,
  setDetails,
  handleNext,
  handlePrevious,
}: Props) => {
  const screen = details.ScreenAndDigitalAddication;
  const [otherImpact, setOtherImpact] = useState("");

  const handleImpactObservedChange = (val: string[]) => {
    setDetails((prev) => ({
      ...prev,
      ScreenAndDigitalAddication: {
        ...prev.ScreenAndDigitalAddication,
        parentPerspective: {
          ...prev.ScreenAndDigitalAddication.parentPerspective,
          impactObserved: val,
        },
      },
    }));
  };

  // ✅ PARENT HANDLER
  const handleParentChange = (field: string, value: string | string[]) => {
    setDetails((prev: Details) => ({
      ...prev,
      ScreenAndDigitalAddication: {
        ...prev.ScreenAndDigitalAddication,
        parentPerspective: {
          ...prev.ScreenAndDigitalAddication.parentPerspective,
          [field]: value,
        },
      },
    }));
  };

  // ✅ CHILD HANDLER
  const handleChildChange = (field: string, value: string | string[]) => {
    setDetails((prev: Details) => ({
      ...prev,
      ScreenAndDigitalAddication: {
        ...prev.ScreenAndDigitalAddication,
        childPerspective: {
          ...prev.ScreenAndDigitalAddication.childPerspective,
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className="py-6 px-6 space-y-8">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        SCREEN & DIGITAL ADDICTION ASSESSMENT
      </h1>

      {/* ================== I. PARENT PERSPECTIVE ================== */}
      <div className="space-y-4 border rounded-xl p-4">
        <h2 className="font-bold text-lg text-orange-600">
          I. Parent Perspective
        </h2>

        <TextArea
          label="Daily screen time (in hours) *"
          value={screen.parentPerspective.screenTime}
          onChange={(val) => handleParentChange("screenTime", val)}
        />

        <CheckboxGroup
          label="Type of major screen usage *"
          value={screen.parentPerspective.typeOfScreenUsage}
          options={["Games", "YouTube", "Social Media", "Cartoons", "Others"]}
          onChange={(val) => handleParentChange("typeOfScreenUsage", val)}
        />

        <RadioGroup
          label="Does the child get irritated if device is taken away? *"
          value={screen.parentPerspective.irritatedIfDiviceTakenAway}
          options={["Yes", "No"]}
          onChange={(val) =>
            handleParentChange("irritatedIfDiviceTakenAway", val)
          }
        />

        <RadioGroup
          label="Has there been sneaking phone use at night/secretly? *"
          value={screen.parentPerspective.sneakingPhoneUseSecretly}
          options={["Yes", "No"]}
          onChange={(val) =>
            handleParentChange("sneakingPhoneUseSecretly", val)
          }
        />

        <CheckboxGroup
          label="Impact observed *"
          value={screen.parentPerspective.impactObserved}
          options={[
            "Sleep disturbance",
            "Grades drop",
            "Social withdrawal",
            "Aggression",
            "Loss of interest in hobbies",
            "Others",
          ]}
          onChange={(val) => handleParentChange("impactObserved", val)}
        />
        {screen.parentPerspective.impactObserved.includes("Others") && (
          <TextArea
            label="Please specify Others (comma separated) *"
            value={otherImpact}
            onChange={(val) => {
              setOtherImpact(val);

              const customValues = val
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);

              const filtered = screen.parentPerspective.impactObserved.filter(
                (item) => item !== "Others"
              );

              handleImpactObservedChange([...filtered, ...customValues]);
            }}
          />
        )}
      </div>

      {/* ================== II. CHILD PERSPECTIVE ================== */}
      <div className="space-y-4 border rounded-xl p-4">
        <h2 className="font-bold text-lg text-orange-600">
          II. Child Perspective
        </h2>

        <TextArea
          label="What shows do you enjoy the most on mobile / TV? *"
          value={screen.childPerspective.enjoyMost}
          onChange={(val) => handleChildChange("enjoyMost", val)}
        />

        <TextArea
          label="How much time do you spend on screens daily? *"
          value={screen.childPerspective.dailyScreenSpend}
          onChange={(val) => handleChildChange("dailyScreenSpend", val)}
        />

        <RadioGroup
          label="How do you feel when someone takes the device away? *"
          value={screen.childPerspective.fellDeviceTakeAway}
          options={["Sad", "Angry", "Calm", "Neutral"]}
          onChange={(val) => handleChildChange("fellDeviceTakeAway", val)}
        />

        <TextArea
          label="Can you spend a day without your device? Why / Why not? *"
          value={screen.childPerspective.canSpendDayWithoutMobile}
          onChange={(val) => handleChildChange("canSpendDayWithoutMobile", val)}
        />

        <TextArea
          label="Hobbies apart from screens *"
          value={screen.childPerspective.hobbiesAppartFromScreens}
          onChange={(val) => handleChildChange("hobbiesAppartFromScreens", val)}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="py-2 px-3 bg-orange-600 rounded-md"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <button
          type="button"
          className="py-2 px-3 bg-orange-600 rounded-md"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ScreenAndDigitalAddictionAssessment;
