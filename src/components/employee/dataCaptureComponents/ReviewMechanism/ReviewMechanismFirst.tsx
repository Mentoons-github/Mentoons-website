import { Details } from "@/types/employee/dataCaptureTypes";

const ReviewMechanismFirst = ({ singleData }: { singleData: Details }) => {
  return (
    <div className="flex justify-center bg-gray-100 print:bg-white border print:border-0 p-2 print:!p-0">
      {/* A4 PAGE */}
      <div
        className="
          w-[210mm] 
          bg-white
          px-[20mm] py-[10mm] print:py-[3mm]
          flex flex-col
          shadow-lg
          print:shadow-none
        "
      >
        <div className="text-center ">
          <h1 className="text-[70pt] font-bold tracking-wider leading-tight">
            REVIEW
          </h1>
          <h1 className="text-[70pt] font-bold tracking-wider leading-tight -mt-3">
            MECHANISM
          </h1>

          <h5 className="text-[14pt] font-mono font-bold ">
            CHILD INTERVENTION REVIEW & PROGRESS CHART
          </h5>
        </div>

        <div className="flex-grow flex items-center justify-center overflow-hidden">
          <img
            src="/assets/dataCapture/reviewPage.png"
            alt="Review Mechanism"
            className="w-[165mm] h-auto object-contain"
          />
        </div>

        <div className="text-center mb-[15mm]">
          <div className="mb-[15mm]">
            <h3 className="text-[16pt] font-bold ">
              BY {singleData.psychologist?.user.name.toUpperCase()}
            </h3>
            <p className="text-[12pt] font-bold">
              MOB: {singleData.psychologist?.user.phoneNumber}
            </p>
          </div>

          <div className="">
            <h3 className="text-[12pt] font-bold tracking-wide">
              THE BIGGEST SECRET
            </h3>
            <h3 className="text-[12pt] font-bold tracking-wide">
              IS YOUR MIND.
            </h3>
            <h3 className="text-[12pt] font-bold tracking-wide">OPEN IT.</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewMechanismFirst;
