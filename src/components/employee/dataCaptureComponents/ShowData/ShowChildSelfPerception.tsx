import { Details } from "@/types/employee/dataCaptureTypes";

type Props = {
  singleData: Details | null;
};

const ValueBox = ({ value }: { value?: string }) => (
  <div className="border rounded-md bg-gray-50 px-3 py-2 text-sm print-box">
    {value || "-"}
  </div>
);

const ShowChildsSelfPerception = ({ singleData }: Props) => {
  if (!singleData?.childsSelfPerception) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading child's self-perception...
      </div>
    );
  }

  const self = singleData.childsSelfPerception;

  return (
    <div className=" space-y-6">
      <h2 className="text-xl font-bold text-center text-orange-600">
        CHILD'S SELF-PERCEPTION
      </h2>

      {/* Likes Themselves */}
      <section className="space-y-3">
        <p className="text-sm text-gray-500">
          Three things the child likes about themselves
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print-grid-3">
          {self.likesThemselves.map((val, i) => (
            <ValueBox key={i} value={val} />
          ))}
        </div>
      </section>

      {/* Want To Improve */}
      <section className="space-y-3">
        <p className="text-sm text-gray-500 print-label">
          Three things they want to improve
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print-grid-3">
          {self.wantToImprove.map((val, i) => (
            <ValueBox key={i} value={val} />
          ))}
        </div>
      </section>

      {/* Happy / Relaxed */}
      <section className="space-y-1">
        <p className="text-sm text-gray-500 print-label">
          What makes them happy / relaxed?
        </p>
        <ValueBox value={self.makeThemHappy} />
      </section>

      {/* Fears / Worries */}
      <section className="space-y-1">
        <p className="text-sm text-gray-500 print-label">Any fears or worries?</p>
        <ValueBox value={self.fearOrWorries} />
      </section>
    </div>
  );
};

export default ShowChildsSelfPerception;
