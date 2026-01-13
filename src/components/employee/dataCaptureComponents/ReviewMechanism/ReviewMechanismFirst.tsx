import { Details } from "@/types/employee/dataCaptureTypes";

const ReviewMechanismFirst = ({ singleData }: { singleData: Details }) => {
  return (
    <div className="flex justify-center bg-gray-100 print:bg-white p-2 print:p-0">
      {/* PAGE CONTAINER */}
      <div
        className="
          w-full max-w-[1100px]
          print:w-[210mm]
          bg-white
          px-4 sm:px-8 lg:px-16 print:px-[20mm]
          py-6 sm:py-8 print:py-[10mm]
          flex flex-col
          shadow-lg print:shadow-none
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4 print:mb-0">
          <img
            src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
            alt="Mentoons Logo"
            className="
              w-24 sm:w-32 lg:w-36
              object-contain
              transition-all
              duration-300
            "
          />
        </div>

        {/* TITLE */}
        <div className="text-center">
          <h1
            className="
              text-4xl sm:text-6xl lg:text-7xl
              print:text-[70pt]
              font-bold tracking-wider leading-tight
            "
          >
            REVIEW
          </h1>
          <h1
            className="
              text-4xl sm:text-6xl lg:text-7xl
              print:text-[70pt]
              font-bold tracking-wider leading-tight
              -mt-1 sm:-mt-2 print:-mt-3
            "
          >
            MECHANISM
          </h1>

          <h5
            className="
              mt-2
              text-sm sm:text-base
              print:text-[14pt]
              font-mono font-bold
            "
          >
            CHILD INTERVENTION REVIEW & PROGRESS CHART
          </h5>
        </div>

        {/* IMAGE */}
        <div className="flex-grow flex items-center justify-center my-6">
          <img
            src="/assets/dataCapture/reviewPage.png"
            alt="Review Mechanism"
            className="
              w-full max-w-[800px]
              print:w-[165mm]
              h-auto object-contain
            "
          />
        </div>

        {/* FOOTER */}
        <div className="text-center mb-6 print:mb-[15mm]">
          <div className="mb-6 print:mb-[15mm]">
            <h3
              className="
                text-base sm:text-lg
                print:text-[16pt]
                font-bold
              "
            >
              BY {singleData.psychologist?.user.name.toUpperCase()}
            </h3>
            <p
              className="
                text-sm sm:text-base
                print:text-[12pt]
                font-bold
              "
            >
              MOB: {singleData.psychologist?.user.phoneNumber}
            </p>
          </div>

          <div>
            <h3 className="text-sm sm:text-base print:text-[12pt] font-bold tracking-wide">
              THE BIGGEST SECRET
            </h3>
            <h3 className="text-sm sm:text-base print:text-[12pt] font-bold tracking-wide">
              IS YOUR MIND.
            </h3>
            <h3 className="text-sm sm:text-base print:text-[12pt] font-bold tracking-wide">
              OPEN IT.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewMechanismFirst;
