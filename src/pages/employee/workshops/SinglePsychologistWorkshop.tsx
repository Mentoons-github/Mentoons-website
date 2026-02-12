import WorkshopCandidateDetailsModal from "@/components/employee/modal/WorkshopCandidateDetailsModal";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, Users, Clock, SquareCheck, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  assignWorkshopBatchThunk,
  getSingleWorkshopBatchThunk,
} from "@/redux/workshop/workshopBatches/workshopBatchThunk";
import { useAuth } from "@clerk/clerk-react";
import WorkshopAssignBatchModal from "@/components/admin/workshop/WorkshopAssignBatchModal";
import { getEmployees } from "@/redux/admin/employee/api";
import { toast } from "sonner";
import { resetWorkshopBatchReducer } from "@/redux/workshop/workshopBatches/workshopBatchSlice";
import { WorkshopBatchDates } from "@/utils/formateDate";

const statusColor = {
  ongoing: "bg-green-200 text-green-700",
  completed: "bg-gray-200 text-gray-700",
  upcoming: "bg-yellow-200 text-yellow-700",
  draft: "bg-blue-200 text-blue-700",
};

const SinglePsychologistWorkshop = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message, assignSuccess, error, assignLoading, singleWorkshopBatch } =
    useAppSelector((state) => state.workshop_batch);
  const { employees } = useAppSelector((state) => state.employee);
  const { workshopId } = useParams();
  const { getToken } = useAuth();

  const [currentCandidateId, setCurrentCandidateId] = useState<string | null>(
    null,
  );

  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [values, setValues] = useState({
    psychologist: "",
    startDate: "",
  });

  const currentCandidate = singleWorkshopBatch?.students.find(
    (s) => s._id === currentCandidateId,
  );

  const psychologists = employees.filter(
    (emp) => emp.department === "psychologist",
  );

  useEffect(() => {
    if (assignSuccess) {
      toast.success(message);
      dispatch(resetWorkshopBatchReducer());
      setAssignModalOpen(false);
    }
    if (error) {
      toast.error(error);
      dispatch(resetWorkshopBatchReducer());
    }
  }, [assignSuccess, dispatch, error, message]);

  useEffect(() => {
    const fetchBatch = async () => {
      const token = await getToken();
      dispatch(
        getSingleWorkshopBatchThunk({
          token: token as string,
          workshopBatchId: workshopId as string,
        }),
      );
    };

    fetchBatch();
  }, [dispatch, getToken, workshopId]);

  useEffect(() => {
    if (singleWorkshopBatch?.status === "draft" && assignModalOpen) {
      dispatch(
        getEmployees({
          sortOrder: "asc",
          searchTerm: "",
          page: 1,
          limit: 10,
        }),
      );
    }
  }, [assignModalOpen, dispatch, singleWorkshopBatch?.status]);

  if (!singleWorkshopBatch) {
    return (
      <div className="w-full py-20 text-center text-gray-400">
        Workshop not found
      </div>
    );
  }

  const handleAssign = async () => {
    const token = await getToken();
    dispatch(
      assignWorkshopBatchThunk({
        token: token as string,
        data: {
          psychologistId: values.psychologist,
          startDate: values.startDate,
          workshopBatchId: workshopId as string,
        },
      }),
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ">
      <div className="ml-5 pt-5" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-5 space-y-10">
        <div className="flex justify-between items-start gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight">
              {singleWorkshopBatch?.workshopId.name}
            </h1>
            {/* <p className="text-lg text-orange-600 font-medium">
              {workshop.title}
            </p> */}

            <span
              className={`px-2 py-0.5 rounded text-xs ${statusColor[singleWorkshopBatch?.status]}`}
            >
              {singleWorkshopBatch?.status}
            </span>
          </div>

          {singleWorkshopBatch?.status === "draft" &&
            !singleWorkshopBatch?.psychologist && (
              <div className="relative">
                <button
                  className="px-3 py-2 bg-orange-500 text-white rounded-md"
                  onClick={() => setAssignModalOpen(true)}
                >
                  Assign Workshop
                </button>

                {assignModalOpen && (
                  <>
                    <div
                      className="fixed inset-0 bg-black/40 z-40"
                      onClick={() => setAssignModalOpen(false)}
                    />

                    <div className="absolute right-0 mt-2 z-50">
                      <WorkshopAssignBatchModal
                        submit={handleAssign}
                        values={values}
                        onChange={setValues}
                        psychologists={psychologists}
                        onClose={() => setAssignModalOpen(false)}
                        assignLoading={assignLoading}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-10">
          {/* Left */}
          <div className="col-span-8 space-y-8">
            {/* Meta Cards */}
            <div className="grid grid-cols-3 gap-4">
              <MetaCard
                icon={<Clock size={18} />}
                label="Duration"
                value={singleWorkshopBatch?.workshopId.duration}
              />
              <MetaCard
                icon={<Users size={18} />}
                label="Age Group"
                value={singleWorkshopBatch?.workshopId.age}
              />
              <MetaCard
                icon={<Calendar size={18} />}
                label="Start Date"
                value={
                  singleWorkshopBatch?.startDate
                    ? WorkshopBatchDates(singleWorkshopBatch?.startDate)
                    : "--"
                }
              />
              <MetaCard
                icon={<Calendar size={18} />}
                label="End Date"
                value={
                  singleWorkshopBatch?.endDate
                    ? WorkshopBatchDates(singleWorkshopBatch?.endDate)
                    : "--"
                }
              />
              <MetaCard
                icon={<Clock size={18} />}
                label="Total Sessions"
                value={singleWorkshopBatch?.workshopId.totalSession ?? "--"}
              />
              <MetaCard
                highlight
                icon={<SquareCheck size={18} />}
                label="Current Sessions"
                value={singleWorkshopBatch?.currentSession ?? 0}
              />
            </div>

            {/* Candidates */}
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="text-lg font-semibold mb-5">
                Candidates ({singleWorkshopBatch?.students.length})
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {singleWorkshopBatch?.students.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentCandidateId(c._id)}
                    className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 text-left hover:bg-orange-50 transition"
                  >
                    <span className="font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-4">
            <div className="sticky top-8 rounded-2xl overflow-hidden shadow-md">
              <img
                src={singleWorkshopBatch?.workshopId.image}
                alt={singleWorkshopBatch?.workshopId.name}
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Modal */}
      {currentCandidate && (
        <WorkshopCandidateDetailsModal
          candidate={currentCandidate}
          currentSession={singleWorkshopBatch.currentSession}
          onClose={() => setCurrentCandidateId(null)}
        />
      )}
    </div>
  );
};

const MetaCard = ({
  icon,
  label,
  value,
  highlight,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-2xl p-4 border bg-white flex items-start gap-3
      ${highlight ? "border-green-200 bg-green-50" : ""}
    `}
  >
    {icon && (
      <div
        className={`${highlight ? "text-green-500" : "text-orange-500"}  mt-1`}
      >
        {icon}
      </div>
    )}
    <div>
      <p
        className={`text-sm ${highlight ? "text-green-500" : "text-gray-500"} `}
      >
        {label}
      </p>
      <p className={`font-semibold`}>{value}</p>
    </div>
  </div>
);

export default SinglePsychologistWorkshop;
