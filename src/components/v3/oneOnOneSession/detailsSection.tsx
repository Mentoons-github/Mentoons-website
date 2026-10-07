import { INDIAN_STATES } from "@/constant/constants";
import { useSessionForm } from "@/utils/formik/sessionForm";
import { ReactNode, useState } from "react";
import { AGE_OPTIONS } from "@/config/sessionConfig";

type SessionFormik = ReturnType<typeof useSessionForm>;
type FormField = "name" | "email" | "phone" | "state" | "description";

interface DetailsSectionProps {
  formik: SessionFormik;
  child: { name: string; age: string };
  childErrors: { name?: string; age?: string };
  onChildChange: (field: "name" | "age", value: string) => void;
}

const REASON_OPTIONS = [
  "Relationship",
  "Substance Abuse",
  "Career",
  "Family",
  "Performance Addiction",
  "Entertainment Addiction",
  "Other",
];

const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

const controlClass = (hasError: boolean) =>
  `w-full rounded-lg border px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none ${
    hasError
      ? "border-red-400 focus:border-red-500"
      : "border-stone-200 focus:border-stone-400"
  }`;

const Field = ({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={className}>
    <label htmlFor={htmlFor} className={labelClass}>
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

const DetailsSection = ({
  formik,
  child,
  childErrors,
  onChildChange,
}: DetailsSectionProps) => {
  const fieldError = (field: FormField) =>
    formik.touched[field] && formik.errors[field]
      ? String(formik.errors[field])
      : undefined;

  // Tracks which UI is shown: a preset reason, "Other" (free text), or unselected.
  const [reasonType, setReasonType] = useState<string>(() => {
    const val = formik.values.description;
    if (!val) return "";
    return REASON_OPTIONS.includes(val) ? val : "Other";
  });

  const handleReasonSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setReasonType(value);

    if (value === "Other") {
      // Clear so the free-text box starts fresh instead of carrying a preset label
      formik.setFieldValue("description", "", true);
    } else {
      formik.setFieldValue("description", value, true);
    }
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    formik.setFieldValue("description", e.target.value, true);
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
          2
        </span>
        <h2 className="text-base font-semibold text-stone-900">
          Enter Your Details
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <Field
          label="Child's Name"
          htmlFor="childName"
          error={childErrors.name}
        >
          <input
            id="childName"
            type="text"
            value={child.name}
            onChange={(e) => onChildChange("name", e.target.value)}
            placeholder="Enter child's name"
            className={controlClass(!!childErrors.name)}
          />
        </Field>

        <Field label="Age" htmlFor="childAge" error={childErrors.age}>
          <select
            id="childAge"
            value={child.age}
            onChange={(e) => onChildChange("age", e.target.value)}
            className={`${controlClass(!!childErrors.age)} ${
              child.age ? "text-stone-900" : "text-stone-500"
            }`}
          >
            <option value="">Select age</option>
            {AGE_OPTIONS.map((age) => (
              <option key={age} value={age}>
                {age} years
              </option>
            ))}
          </select>
        </Field>

        <Field label="Parent's Name" htmlFor="name" error={fieldError("name")}>
          <input
            id="name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter parent's name"
            className={controlClass(!!fieldError("name"))}
          />
        </Field>

        <Field
          label="Email Address"
          htmlFor="email"
          error={fieldError("email")}
        >
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
            className={controlClass(!!fieldError("email"))}
          />
        </Field>

        <Field label="Phone Number" htmlFor="phone" error={fieldError("phone")}>
          <div className="flex gap-2">
            <span className="flex w-16 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 text-sm text-stone-700">
              +91
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter phone number"
              className={controlClass(!!fieldError("phone"))}
            />
          </div>
        </Field>

        <Field label="State" htmlFor="state" error={fieldError("state")}>
          <select
            id="state"
            name="state"
            value={formik.values.state || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`${controlClass(!!fieldError("state"))} ${
              formik.values.state ? "text-stone-900" : "text-stone-500"
            }`}
          >
            <option value="" disabled>
              Select your state
            </option>
            {INDIAN_STATES.map((state) => (
              <option key={state.state_code} value={state.state_code}>
                {state.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Reason for Session (Optional)"
          htmlFor="reasonType"
          error={fieldError("description")}
          className="sm:col-span-2"
        >
          <select
            id="reasonType"
            value={reasonType}
            onChange={handleReasonSelect}
            onBlur={formik.handleBlur}
            className={`${controlClass(!!fieldError("description"))} ${
              reasonType ? "text-stone-900" : "text-stone-500"
            }`}
          >
            <option value="" disabled>
              Select a reason
            </option>
            {REASON_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {reasonType === "Other" && (
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formik.values.description}
              onChange={handleOtherChange}
              onBlur={formik.handleBlur}
              placeholder="Please describe your reason"
              className={`${controlClass(
                !!fieldError("description"),
              )} mt-2 resize-none`}
            />
          )}
        </Field>
      </div>
    </div>
  );
};

export default DetailsSection;
