import { Employee } from "@/types/employee";

const WorkshopAssignBatchModal = ({
  onClose,
  values,
  onChange,
  psychologists,
  submit,
  assignLoading,
}: {
  onClose: () => void;
  values: { psychologist: string; startDate: string };
  onChange: React.Dispatch<
    React.SetStateAction<{ psychologist: string; startDate: string }>
  >;
  psychologists: Employee[];
  submit: () => void;
  assignLoading: boolean;
}) => {
  return (
    <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-white shadow-lg z-50 p-4 space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">
        Assign Psychologist
      </h4>

      {/* Psychologist select */}
      <select
        value={values.psychologist}
        onChange={(e) =>
          onChange((prev) => ({
            ...prev,
            psychologist: e.target.value,
          }))
        }
        className="w-full rounded-md border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="">Select Psychologist</option>
        {psychologists.map((psych) => (
          <option key={psych._id} value={psych._id}>
            {psych.name}
          </option>
        ))}
      </select>

      {/* Start date */}
      <input
        type="date"
        value={values.startDate}
        onChange={(e) =>
          onChange((prev) => ({
            ...prev,
            startDate: e.target.value,
          }))
        }
        className="w-full rounded-md border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onClose}
          className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={!values.psychologist || !values.startDate}
          className="text-sm px-3 py-1.5 rounded-md bg-orange-500 text-white disabled:opacity-50"
        >
          {assignLoading ? <Spinner /> : "Assign"}
        </button>
      </div>
    </div>
  );
};

const Spinner = () => (
  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

export default WorkshopAssignBatchModal;
