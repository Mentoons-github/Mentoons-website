import { Details } from "@/types/employee/dataCaptureTypes";
import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";
import * as XLSX from "xlsx";

const InfoBlock = ({ label, value }: { label: string; value?: string }) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500 print-label">{label}</p>
    <div className="border rounded-md bg-gray-50 p-3 text-sm text-gray-800 print-box">
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

const ShowDemographicDetails = ({
  singleData,
}: {
  singleData: Details | null;
}) => {
  const handlePrint = () => {
    const content = document.getElementById("print-demographic");
    if (!content) return;

    const printWindow = window.open("", "", "width=800,height=1000");

    printWindow!.document.write(`
<html>
<head>
<title>Demographic Details</title>

<style>
@page {
  size: A4;
  margin: 10mm;
}

body {
  font-family: Arial, sans-serif;
  font-size: 12px;
  color: #000;
}

/* Headings */
h2 {
  color: #ea580c;
  text-align: center;
  margin-bottom: 12px;
}
h3 {
  color: #ea580c;
  margin-top: 16px;
  
}

/* Label */
.print-label {
  font-size: 11px;
  color: #555;
  margin-bottom: 4px;
}

/* Value box (THIS FIXES BORDERS) */
.print-box {
  border: 1px solid #999;
  padding: 8px;
  border-radius: 4px;
  background: #f9fafb;
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.radio-circle {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #000;
  position: relative;
  flex-shrink: 0;
}

.print-radio-selected .radio-circle::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 6px;
  height: 6px;
  background: #000;
  border-radius: 50%;
}

.radio-dot {
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
}

.print-radio-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}


/* Radio option (PRINT ONLY) */
.print-radio {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  border: 2px solid #666;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 11px;
  background: #fff;
}

/* Selected option */
.print-radio-selected {
  border: 3px solid #000;
  background: #e6e6e6;
  font-weight: 700;
  color: #000;
}


/* Avoid cut */
.section {
  page-break-inside: avoid;
}

.page-break {
  page-break-before: always;
}

@media print {
  .no-print {
    display: none !important;
  }

  /* Optional: remove background for better black/white print */
  body * {
    background: none !important;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
}

@media print {
  .print-underline {
    text-decoration: underline;
    margin-bottom: 4px;
  }
}


</style>
</head>

<body>
${content.innerHTML}
</body>
</html>
`);

    printWindow!.document.close();
    printWindow!.focus();

    setTimeout(() => {
      printWindow!.print();
      printWindow!.close();
    }, 500);
  };

  const handleExportExcel = () => {
    if (!singleData) return;

    const { child, guardians } = singleData.demographic;

    const excelData = [
      { Section: "Child", Field: "Name", Value: child.name },
      { Section: "Child", Field: "Age", Value: child.age },
      { Section: "Child", Field: "Gender", Value: child.gender },
      { Section: "Child", Field: "DOB", Value: child.dateOfBirth },
      { Section: "Child", Field: "Class", Value: child.class },
      { Section: "Child", Field: "School", Value: child.school },
      {
        Section: "Child",
        Field: "Languages",
        Value: child.languages?.join(", "),
      },
      {
        Section: "Child",
        Field: "Economic Status",
        Value: child.economicStatus,
      },
      { Section: "Child", Field: "Address", Value: child.adress },

      {
        Section: "Guardian",
        Field: "Father Name",
        Value: guardians.fathersName,
      },
      {
        Section: "Guardian",
        Field: "Father Occupation",
        Value: guardians.fathersOccupation,
      },
      {
        Section: "Guardian",
        Field: "Father Income",
        Value: guardians.fatherIncome,
      },
      {
        Section: "Guardian",
        Field: "Mother Name",
        Value: guardians.mothersName,
      },
      {
        Section: "Guardian",
        Field: "Mother Occupation",
        Value: guardians.mothersOccupation,
      },
      {
        Section: "Guardian",
        Field: "Family Structure",
        Value: guardians.familyStructure,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Demographic Details");

    XLSX.writeFile(workbook, "Demographic_Details.xlsx");
  };
  if (!singleData || !singleData.demographic) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading demographic details...
      </div>
    );
  }

  const { child, guardians } = singleData.demographic;

  const economicOptions = [
    "Lower",
    "Upper Lower",
    "Lower Middle",
    "Upper Middle",
    "Upper",
  ];
  const povertyOptions = [
    "Below Poverty Line",
    "Low Income Group",
    "Middle Poverty Line",
    "High Poverty Line",
  ];
  const familyStructureOptions = ["Nuclear", "Joint", "Single Parent", "Other"];

  return (
    <div
      id="print-demographic"
      className="border rounded-xl mt-5 p-5 space-y-8 print-area"
    >
      {/* <div className="flex justify-end gap-3 mb-4 no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
        >
          Print (A4)
        </button>

        <button
          onClick={handleExportExcel}
          className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700"
        >
          Export Excel
        </button>
      </div> */}

      <h2 className="text-xl text-center font-bold text-orange-600">
        DEMOGRAPHIC DETAILS
      </h2>

      {/* ================= CHILD DETAILS ================= */}
      <div className="space-y-4">
        <h3 className="font-semibold text-orange-500 text-lg print-underline">
          Child Details:
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Name" value={child.name} />
            <InfoBlock label="Age" value={child.age} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Address" value={child.adress} />
            <InfoBlock
              label="Date of Birth"
              value={
                child.dateOfBirth
                  ? new Date(child.dateOfBirth).toLocaleDateString()
                  : "-"
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Gender" value={child.gender} />
            <InfoBlock label="Class" value={child.class} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="School" value={child.school} />
            <InfoBlock label="Religion" value={child.religion} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Culture" value={child.culture} />
            <InfoBlock
              label="Languages"
              value={child.languages?.length ? child.languages.join(", ") : "-"}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock
              label="Siblings"
              value={child.sibilings?.length ? child.sibilings.join(", ") : "-"}
            />
            <InfoBlock
              label="Sibiling Types"
              value={child.sibilingType?.length ? child.sibilingType : "-"}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 print-label">Economic Status</p>
            <OptionBadge
              options={economicOptions}
              value={child.economicStatus}
            />
          </div>
        </div>
      </div>

      {/* ================= GUARDIAN DETAILS ================= */}
      <div className="space-y-4">
        <h3 className="font-semibold text-orange-500 text-lg print-underline">
          Guardian Details:
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Father's Name" value={guardians.fathersName} />
            <InfoBlock
              label="Father's Occupation"
              value={guardians.fathersOccupation}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock
              label="Father Contact"
              value={guardians.fatherscontact}
            />
            <InfoBlock label="Father Income" value={guardians.fatherIncome} />
          </div>
          <div>
            <p className="text-sm text-gray-500 print-label">
              Father Poverty Line
            </p>
            <OptionBadge
              options={povertyOptions}
              value={guardians.fatherPovertyLine}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Mother's Name" value={guardians.mothersName} />
            <InfoBlock
              label="Mother's Occupation"
              value={guardians.mothersOccupation}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock label="Mother Contact" value={guardians.mothercontact} />
            <InfoBlock label="Mother Income" value={guardians.motherIncome} />
          </div>
          <div>
            <p className="text-sm text-gray-500 print-label">
              Mother Poverty Line
            </p>
            <OptionBadge
              options={povertyOptions}
              value={guardians.motherPovertyLine}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoBlock
              label="Primary Care Giver"
              value={guardians.primaryCareGiver}
            />
            <InfoBlock
              label="MAP (Money / Authority / Power)"
              value={guardians.map}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500 print-label">
              Family Structure
            </p>
            <OptionBadge
              options={familyStructureOptions}
              value={guardians.familyStructure}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDemographicDetails;
