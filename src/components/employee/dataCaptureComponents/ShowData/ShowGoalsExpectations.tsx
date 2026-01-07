import { Details } from "@/types/employee/dataCaptureTypes";

type Props = {
  singleData: Details | null;
};

const ValueBox = ({ value }: { value?: string }) => (
  <div className="border rounded-md bg-gray-50 px-3 py-2 text-sm print-box">
    {value || "-"}
  </div>
);

const ShowGoalsExpectations = ({ singleData }: Props) => {
  if (!singleData?.goalsAndExpectations) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading goals & expectations...
      </div>
    );
  }

  const goals = singleData.goalsAndExpectations;

  return (
    <div className=" space-y-6">
      <h2 className="text-xl font-bold text-center text-orange-600">
        GOALS & EXPECTATIONS
      </h2>

      {/* Parent's Goals */}
      <section className="space-y-3">
        <p className="font-semibold text-orange-500 print-label">
          PARENT’S GOALS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print-grid-3">
          {goals.parentsGoals.map((val, i) => (
            <ValueBox key={i} value={val} />
          ))}
        </div>
      </section>

      {/* Child's Goals */}
      <section className="space-y-3">
        <p className="font-semibold text-orange-500 print-label">
          CHILD’S GOALS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print-grid-3">
          {goals.childsGoals.map((val, i) => (
            <ValueBox key={i} value={val} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShowGoalsExpectations;
