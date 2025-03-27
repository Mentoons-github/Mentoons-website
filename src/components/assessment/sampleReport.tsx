import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { REPORTS } from "@/constant/constants";
import { FaEnvelope, FaPhone, FaTimes } from "react-icons/fa";
import { ASSESSMENT_RESULTS } from "@/pages/AssesmentQuestions";
import { useUser } from "@clerk/clerk-react";

const Report = ({
  onClose,
  result,
}: {
  onClose: (val: boolean) => void;
  result?: ASSESSMENT_RESULTS;
}) => {
  const reportRef = useRef(null);
  const { user } = useUser();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generatePDF = async () => {
    if (!reportRef.current) return;

    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 1.5 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth() * 0.9;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      const scaleFactor = pageHeight / imgHeight;
      imgWidth *= scaleFactor;
      imgHeight = pageHeight;
    }

    pdf.addImage(
      imgData,
      "PNG",
      (pdf.internal.pageSize.getWidth() - imgWidth) / 2,
      0,
      imgWidth,
      imgHeight
    );
    pdf.save("Emotions_Assessment_Report.pdf");
  };

  const clampedScore = Math.min(Math.max(result?.score.correct ?? 1, 1), 10);

  const progressWidth = `${(clampedScore / 10) * 100}%`;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(false);
      }}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900"
        >
          <FaTimes size={24} />
        </button>
        <div ref={reportRef} className="p-6">
          <h1 className="text-xl font-semibold text-center border-b border-black pb-2">
            {result
              ? `${result.assessmentName} Report`
              : "Emotions Assessment Report"}
          </h1>
          <p className="text-center text-gray-400 mt-2">{formattedDate}</p>

          <div className="flex justify-between items-start">
            <div className="w-1/2 space-y-3 mt-3">
              <div className="bg-gray-200 p-2 rounded">
                <span className="font-semibold">Name:</span>{" "}
                {result ? user?.fullName : "John Doe"}
              </div>
              <div className="bg-gray-200 p-2 rounded">
                <span className="font-semibold">Age:</span> 27
              </div>
              <div className="bg-gray-200 p-2 rounded">
                <span className="font-semibold">Gender:</span> Male
              </div>
            </div>
            <div className="w-1/2 p-4">
              <h1 className="text-start">
                Your Score : {result?.score.correct}
              </h1>
              <div className="relative w-full h-10 flex items-center bg-[#3D3D3D] rounded-full mt-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full ml-2">
                  1
                </div>
                <div className="flex-1 mx-2 relative h-4 bg-gray-500 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-4 bg-yellow-500 rounded-full"
                    style={{ width: result ? progressWidth : "40%" }}
                  ></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center 
                       bg-blue-500 text-white font-bold rounded-full"
                    style={{
                      left: result ? progressWidth : "40%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {result ? clampedScore : "4"}
                  </div>
                </div>
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full mr-2">
                  10
                </div>
              </div>
              <p className="font-semibold text-sm mt-3">
                Verdict: Good, Can improve further to score a 10
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-lg font-bold mb-2">Overall Emotional Health</h1>
            <div className="flex items-center space-x-4">
              <div className="px-10 py-4 bg-green-600 text-white rounded-xl font-medium text-sm tracking-[0.35px]">
                GOOD
              </div>
              <div className="bg-gray-200 p-2 rounded text-sm">
                <span className="font-semibold">Name:</span> Your emotions are
                in good condition. This assessment provides a snapshot of your
                emotional state based on your answers. You are healthy, add
                other dummy text here.
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-md font-semibold">
              Emotional Health Breakdown
            </h3>
            <table className="w-full mt-2 border-collapse">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="p-2 text-left">Element</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Responsibility</th>
                  <th className="p-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Anxiety",
                    status: "Attention",
                    responsibility: "You",
                    note: "Signs of worry were observed.",
                  },
                  {
                    name: "Stress",
                    status: "Attention",
                    responsibility: "You",
                    note: "Some stress detected.",
                  },
                  {
                    name: "Mood Stability",
                    status: "On track",
                    responsibility: "You",
                    note: "Mostly stable mood.",
                  },
                  {
                    name: "Friendships",
                    status: "On track",
                    responsibility: "Peers/Friends",
                    note: "Good social interaction.",
                  },
                  {
                    name: "Relationships",
                    status: "On track",
                    responsibility: "Peers",
                    note: "You have a stable social circle, maintaining good personal and professional relationships.",
                  },
                  {
                    name: "Social Impact",
                    status: "On track",
                    responsibility: "Society",
                    note: "Your interactions positively influence your surroundings, contributing to a supportive environment.",
                  },
                ].map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 text-center">{item.name}</td>
                    <td
                      className={`p-2 text-white w-40 text-center ${
                        item.status === "Attention"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="p-5">{item.responsibility}</td>
                    <td className="p-2 text-gray-600">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-start w-full space-x-10 mt-6">
            <div className="w-1/2 flex flex-col space-y-5">
              <h2 className="text-xl font-bold text-gray-700">Reports</h2>
              {REPORTS.map((data, index) => (
                <div
                  key={index}
                  className="flex space-x-3 items-center p-3 rounded-lg"
                >
                  <div className="w-14 h-14 flex-shrink-0">
                    <img
                      src={data.icon}
                      alt={data.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 bg-gray-100">
                    <h1 className="text-lg font-semibold text-sm">
                      {data.title}:
                    </h1>
                    <p className="text-gray-600 text-sm">{data.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-100 p-5 rounded-lg mt-20">
              <img
                src="/assets/assesments/text contact us.png"
                alt="contact-us"
                className="w-1/2 mb-4"
              />
              <div className="w-full text-center space-y-8 mt-5">
                <a
                  href="tel:+919036033300"
                  className="flex items-center justify-center space-x-3 bg-yellow-500 text-white px-4 py-4 rounded-full mb-2"
                >
                  <FaPhone />
                  <span>+91 9036033300</span>
                </a>

                <a
                  href="mailto:metalmahesh@gmail.com"
                  className="flex items-center justify-center space-x-3 bg-yellow-500 text-white px-4 py-4 rounded-full"
                >
                  <FaEnvelope />
                  <span>metalmahesh@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={generatePDF}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg"
            >
              Generate PDF Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
