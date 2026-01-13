import { Details } from "@/types/employee/dataCaptureTypes";
import { Input, Select } from "./FormInputs";

type Props = {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  handleNext: () => void;
};

const povertyOptions = [
  "Below Poverty Line",
  "Low Income Group",
  "Middle Poverty Line",
  "High Poverty Line",
];

const DemographicDetails = ({ details, setDetails, handleNext }: Props) => {
  const child = details.demographic.child;
  const guardians = details.demographic.guardians;

  // ✅ SINGLE CHANGE HANDLER
  const handleChange = (
    section: "child" | "guardians",
    field: string,
    value: string | string[]
  ) => {
    setDetails((prev: Details) => ({
      ...prev,
      demographic: {
        ...prev.demographic,
        [section]: {
          ...prev.demographic[section],
          [field]: value,
        },
      },
    }));
  };

  const handleNextClick = () => {
    handleNext();
  };

  return (
    <div className="py-6 px-6">
      <h1 className="text-center font-bold text-xl mb-6 text-orange-500">
        DEMOGRAPHIC DETAILS
      </h1>

      <form className="space-y-6">
        <div className="space-y-4 border rounded-xl p-4">
          <h2 className="font-bold text-lg text-orange-600">Child Details</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                required
                label="Name *"
                value={child.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "name", e.target.value)
                }
              />

              <Input
                required
                label="Age *"
                type="number"
                value={child.age}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "age", e.target.value)
                }
              />

              <Input
                required
                label="Date of Birth *"
                type="date"
                max={
                  new Date(new Date().setFullYear(new Date().getFullYear() - 6))
                    .toISOString()
                    .split("T")[0]
                }
                value={child.dateOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "dateOfBirth", e.target.value)
                }
              />

              <Select
                required
                label="Gender *"
                value={child.gender}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleChange("child", "gender", e.target.value)
                }
                options={["Male", "Female", "Other"]}
              />

              <Input
                required
                label="Languages (comma separated) *"
                value={child.languages.join(",")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "languages", e.target.value.split(","))
                }
              />

              <Input
                required
                label="Address *"
                value={child.adress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "adress", e.target.value)
                }
              />

              <Input
                required
                label="Class *"
                type="number"
                value={child.class}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "class", e.target.value)
                }
              />

              <Input
                required
                label="School *"
                value={child.school}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "school", e.target.value)
                }
              />

              <Input
                label="Religion"
                value={child.religion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "religion", e.target.value)
                }
              />

              <Input
                label="Culture"
                value={child.culture}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "culture", e.target.value)
                }
              />

              <Input
                label="Siblings (comma separated)"
                value={child.sibilings.join(",")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "sibilings", e.target.value.split(","))
                }
              />

              <Input
                label="If Twins / Triplets / Others, Specify:"
                value={child.sibilingType}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("child", "sibilingType", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold">
                Economic Status *
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Lower",
                  "Upper Lower",
                  "Lower Middle",
                  "Upper Middle",
                  "Upper",
                ].map((status) => (
                  <label
                    key={status}
                    className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer
          ${
            child.economicStatus === status
              ? "border-orange-600 bg-orange-50 text-orange-700"
              : "border-gray-300"
          }`}
                  >
                    <input
                      required
                      type="radio"
                      name="economicStatus"
                      value={status}
                      checked={child.economicStatus === status}
                      onChange={(e) =>
                        handleChange("child", "economicStatus", e.target.value)
                      }
                      className="accent-orange-600"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= GUARDIAN DETAILS ================= */}
        <div className="space-y-4 border rounded-xl p-4">
          <h2 className="font-bold text-lg mt- text-orange-600">
            Guardian Details
          </h2>

          <div className="space-y-6">
            {/* -------- BASIC DETAILS -------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                required
                label="Father's Name *"
                value={guardians.fathersName}
                onChange={(e) =>
                  handleChange("guardians", "fathersName", e.target.value)
                }
              />

              <Input
                required
                label="Father's Occupation *"
                value={guardians.fathersOccupation}
                onChange={(e) =>
                  handleChange("guardians", "fathersOccupation", e.target.value)
                }
              />

              <Input
                required
                label="Father's Contact *"
                type="number"
                value={guardians.fatherscontact}
                onChange={(e) =>
                  handleChange("guardians", "fatherscontact", e.target.value)
                }
              />

              <Input
                required
                label="Father's Income *"
                type="number"
                value={guardians.fatherIncome}
                onChange={(e) =>
                  handleChange("guardians", "fatherIncome", e.target.value)
                }
              />
            </div>

            {/* -------- FATHER POVERTY LINE -------- */}
            <div>
              <label className="block mb-2 font-semibold">
                Father Poverty Line Status *
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {povertyOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer
            ${
              guardians.fatherPovertyLine === opt
                ? "border-orange-600 bg-orange-50 text-orange-700"
                : "border-gray-300"
            }`}
                  >
                    <input
                      required
                      type="radio"
                      name="fatherPovertyLine"
                      value={opt}
                      checked={guardians.fatherPovertyLine === opt}
                      onChange={(e) =>
                        handleChange(
                          "guardians",
                          "fatherPovertyLine",
                          e.target.value
                        )
                      }
                      className="accent-orange-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* -------- MOTHER DETAILS -------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                required
                label="Mother's Name *"
                value={guardians.mothersName}
                onChange={(e) =>
                  handleChange("guardians", "mothersName", e.target.value)
                }
              />

              <Input
                required
                label="Mother's Occupation *"
                value={guardians.mothersOccupation}
                onChange={(e) =>
                  handleChange("guardians", "mothersOccupation", e.target.value)
                }
              />

              <Input
                required
                label="Mother's Contact *"
                type="number"
                value={guardians.mothercontact}
                onChange={(e) =>
                  handleChange("guardians", "mothercontact", e.target.value)
                }
              />

              <Input
                required
                label="Mother's Income *"
                type="number"
                value={guardians.motherIncome}
                onChange={(e) =>
                  handleChange("guardians", "motherIncome", e.target.value)
                }
              />
            </div>

            {/* -------- MOTHER POVERTY LINE -------- */}
            <div>
              <label className="block mb-2 font-semibold">
                Mother Poverty Line Status *
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {povertyOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer
            ${
              guardians.motherPovertyLine === opt
                ? "border-orange-600 bg-orange-50 text-orange-700"
                : "border-gray-300"
            }`}
                  >
                    <input
                      required
                      type="radio"
                      name="motherPovertyLine"
                      value={opt}
                      checked={guardians.motherPovertyLine === opt}
                      onChange={(e) =>
                        handleChange(
                          "guardians",
                          "motherPovertyLine",
                          e.target.value
                        )
                      }
                      className="accent-orange-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                required
                label="Primary caregiver (If different)"
                value={guardians.primaryCareGiver}
                onChange={(e) =>
                  handleChange("guardians", "primaryCareGiver", e.target.value)
                }
              />
              <Input
                required
                label="MAP (Money, Authority, Power)"
                value={guardians.map}
                onChange={(e) =>
                  handleChange("guardians", "map", e.target.value)
                }
              />
            </div>

            {/* -------- FAMILY STRUCTURE -------- */}
            <div>
              <label className="block mb-2 font-semibold">
                Family Structure *
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Nuclear", "Joint", "Single Parent", "Other"].map(
                  (structure) => (
                    <label
                      key={structure}
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer
            ${
              guardians.familyStructure === structure
                ? "border-orange-600 bg-orange-50 text-orange-700"
                : "border-gray-300"
            }`}
                    >
                      <input
                        required
                        type="radio"
                        name="familyStructure"
                        value={structure}
                        checked={guardians.familyStructure === structure}
                        onChange={(e) =>
                          handleChange(
                            "guardians",
                            "familyStructure",
                            e.target.value
                          )
                        }
                        className="accent-orange-600"
                      />
                      {structure}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="py-2 px-3 bg-orange-600 rounded-md"
            onClick={handleNextClick}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemographicDetails;
