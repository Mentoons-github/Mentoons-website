import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import Loader from "@/components/common/admin/loader";
import Pagination from "@/components/admin/pagination";
import DynamicTable from "@/components/admin/dynamicTable";
import { getJobs, deleteJob } from "../../../redux/admin/job/jobSlice";
import { JobData } from "@/types/admin";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { AppDispatch, RootState } from "../../../redux/store";
import { EXCLUDE_JOBS } from "@/constant/admin";

const AllJobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, error } = useSelector(
    (state: RootState) => state.careerAdmin
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobData | null>(null);

  useEffect(() => {
    dispatch(
      getJobs({
        sortOrder,
        searchTerm: debouncedSearchTerm,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, sortOrder, debouncedSearchTerm, currentPage, limit]);

  const handleEdit = (job: JobData) => {
    navigate("/hiring-form", { state: { id: job._id } });
  };

  const handleDelete = (job: JobData) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete) {
      try {
        await dispatch(deleteJob(jobToDelete._id)).unwrap();
        successToast("Job deleted successfully");
      } catch (error: any) {
        errorToast(error || "Failed to delete job");
      }
    }
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const handleView = (job: JobData) => {
    navigate(`/job-details/${job._id}`);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    debouncedSearch(event.target.value);
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const formatCell = (
    value: any,
    key: string,
    item: JobData
  ): React.ReactNode => {
    if (key === "thumbnail" && typeof value === "string" && value) {
      return (
        <img
          src={value}
          alt={item.jobTitle || "Job Thumbnail"}
          className="w-12 h-12 object-cover rounded"
          onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")} // Fallback image
        />
      );
    }
   
    if (value === null || value === undefined) return "-";
    if (
      value instanceof Date ||
      (typeof value === "string" && !isNaN(Date.parse(value)))
    ) {
      return new Date(value).toLocaleDateString();
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} items` : "None";
    }
    if (typeof value === "object") {
      return "Object";
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    const stringValue = String(value);
    return stringValue.length > 50
      ? `${stringValue.substring(0, 50)}...`
      : stringValue;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!jobs || !jobs.data || !jobs.data.jobs)
    return (
      <div className="flex items-center justify-center h-screen">
        No data available
      </div>
    );

  const { jobs: jobList, totalPages, totalJobs } = jobs.data;

  return (
    <div className="h-full p-4">
      <h1 className="mb-4 text-2xl font-bold">All Jobs</h1>
      <DynamicTable
        excludeColumns={EXCLUDE_JOBS}
        data={jobList}
        sortField="createdAt"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onSort={handleSort}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        itemType="job"
        formatCell={formatCell}
      />
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalJobs}
          limit={limit}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
        />
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={jobToDelete ? jobToDelete.jobTitle || "this job" : ""}
      />
    </div>
  );
};

export default AllJobs;
