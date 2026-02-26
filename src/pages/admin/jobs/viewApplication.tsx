import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import Loader from "@/components/common/admin/loader";
import Pagination from "@/components/admin/pagination";
import DynamicTable from "@/components/admin/dynamicTable";
import { getAppliedJobs } from "../../../redux/admin/job/jobSlice";
import { JobApplication } from "@/types/admin";
import JobApplicationModal from "@/components/admin/modal/jobApplication";
import { AppDispatch, RootState } from "../../../redux/store";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import { errorToast, successToast } from "@/utils/toastResposnse";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/api/game/postScore";
import { useStatusModal } from "@/context/adda/statusModalContext";
import ShareModal from "@/components/admin/modal/shareModal";
import SortDropdown from "@/components/admin/job/sortDropDown";

const ViewApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const {
    appliedJobs: data,
    loading: isLoading,
    error,
  } = useSelector((state: RootState) => state.careerAdmin);

  const [sortOrder, setSortOrder] = useState<1 | -1>(-1);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<JobApplication | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(
    new Set(),
  );
  const [shareApplication, setShareApplication] =
    useState<JobApplication | null>(null);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareModalLoader, setShareModalLoader] = useState(false);
  const [shareModalResponse, setShareModalResponse] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { showStatus } = useStatusModal();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const token = await getToken();
      if (token) {
        dispatch(
          getAppliedJobs({
            sortOrder,
            sortField,
            searchTerm: debouncedSearchTerm,
            page: Number(currentPage),
            limit,
          }),
        );
      }
    };
    fetchAppliedJobs();
  }, [
    dispatch,
    sortOrder,
    sortField,
    debouncedSearchTerm,
    currentPage,
    limit,
    getToken,
  ]);

  const fetchAllApplications = async () => {
    const token = await getToken();
    if (!token) {
      showStatus("error", "Authentication token not found.");
      return [];
    }

    const result = await dispatch(
      getAppliedJobs({
        sortOrder,
        sortField,
        searchTerm: debouncedSearchTerm,
        page: 1,
        limit: 1000,
      }),
    ).unwrap();

    return result.data?.jobs || [];
  };

  const exportAllToExcel = async () => {
    setIsExporting(true);
    try {
      const allJobs = await fetchAllApplications();

      if (allJobs.length === 0) {
        alert("No job applications available to export.");
        return;
      }

      const exportData = allJobs.map((job: JobApplication) => ({
        Name: job.name,
        Email: job.email,
        Job: job.jobTitle,
        Phone: job.phone,
        "Portfolio Link": job.portfolioLink,
        Gender: job.gender,
        "Cover Note": job.coverNote,
        "Resume Link": job.resume,
        "Cover Letter Link": job.coverLetterLink,
        "Applied At": new Date(job.createdAt).toLocaleString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet["!cols"] = [
        { wch: 20 },
        { wch: 30 },
        { wch: 25 },
        { wch: 15 },
        { wch: 40 },
        { wch: 10 },
        { wch: 50 },
        { wch: 40 },
        { wch: 40 },
        { wch: 20 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Job Applications");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      XLSX.writeFile(workbook, `Job_Applications_${timestamp}.xlsx`);
    } catch (error) {
      alert("Failed to export applications: " + error);
    } finally {
      setIsExporting(false);
    }
  };

  const onShare = async () => {
    setShareModalLoader(true);
    setShareModalResponse(null);

    if (!shareApplication) {
      setShareModalLoader(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        setShareModalResponse({
          success: false,
          message: "Authentication token not found",
        });
        return;
      }

      const { _id } = shareApplication;

      const response = await axios.post(
        `${BASE_URL}/career/jobs/${_id}/forward-to-super-admin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setShareModalResponse({
        success: response.data.success === true,
        message: response.data.message || "Application forwarded successfully",
      });
    } catch (err) {
      const error = err as AxiosError<{ error?: string; message?: string }>;

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message ||
        "Failed to forward application";

      setShareModalResponse({
        success: false,
        message: errorMessage,
      });
    } finally {
      setShareModalLoader(false);
    }
  };

  const exportSelectedToExcel = () => {
    if (selectedApplications.size === 0) {
      alert("No applications selected.");
      return;
    }

    if (!data?.data?.jobs) {
      alert("No job applications available to export.");
      return;
    }

    const selectedData = data.data.jobs.filter((job: JobApplication) =>
      selectedApplications.has(job._id),
    );

    const exportData = selectedData.map((job: JobApplication) => ({
      Name: job.name,
      Email: job.email,
      Job: job.jobTitle,
      Phone: job.phone,
      "Portfolio Link": job.portfolioLink,
      Gender: job.gender,
      "Cover Note": job.coverNote,
      "Resume Link": job.resume,
      "Cover Letter Link": job.coverLetterLink,
      "Applied At": new Date(job.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 15 },
      { wch: 40 },
      { wch: 10 },
      { wch: 50 },
      { wch: 40 },
      { wch: 40 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Applications");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    XLSX.writeFile(workbook, `Selected_Job_Applications_${timestamp}.xlsx`);
  };

  const handleDelete = (application: JobApplication) => {
    setApplicationToDelete(application);
    setIsDeleteModalOpen(true);
  };

  const handleView = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    [],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedApplications(new Set());
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    setSelectedApplications(new Set());
  };

  const handleSelectApplication = (id: string, isSelected: boolean) => {
    const newSelected = new Set(selectedApplications);
    if (isSelected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedApplications(newSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    const newSelected = new Set<string>();
    if (isSelected && data?.data?.jobs) {
      data.data.jobs.forEach((job: JobApplication) => {
        newSelected.add(job._id);
      });
    }
    setSelectedApplications(newSelected);
  };

  const confirmDelete = async () => {
    if (applicationToDelete) {
      try {
        const token = await getToken();
        if (!token) {
          errorToast("Authentication token not found.");
          return;
        }

        await axios.delete(
          `${import.meta.env.VITE_PROD_URL}/career/applied/${applicationToDelete._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        successToast("Job application deleted successfully");
        dispatch(
          getAppliedJobs({
            sortOrder,
            sortField,
            searchTerm: debouncedSearchTerm,
            page: currentPage,
            limit,
          }),
        );
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete job application";
        errorToast(errorMessage);
      } finally {
        setIsDeleteModalOpen(false);
        setApplicationToDelete(null);
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!data?.data?.jobs)
    return (
      <div className="flex items-center justify-center h-screen">
        No data available
      </div>
    );

  const { totalPages, totalJobs } = data.data;

  const sortOptions = [
    { field: "createdAt", label: "Date Applied" },
    { field: "name", label: "Applicant Name" },
    { field: "email", label: "Email" },
    { field: "phone", label: "Phone" },
  ];

  return (
    <div className="w-full max-w-full p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">View All Job Applications</h1>
        <div className="flex gap-3">
          <SortDropdown
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={(field: string, order: 1 | -1) => {
              setSortField(field);
              setSortOrder(order);
              setCurrentPage(1);
            }}
            options={sortOptions}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportAllToExcel}
            disabled={isExporting}
            className={`px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 ${
              isExporting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
          >
            {isExporting ? (
              <span>Exporting...</span>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download All as Excel
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportSelectedToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Selected to Excel
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden">
        <DynamicTable
          excludeColumns={[
            "_id",
            "portfolioLink",
            "coverNote",
            "resume",
            "gender",
          ]}
          data={data.data.jobs}
          sortField={sortField}
          onDelete={handleDelete}
          onView={handleView}
          onSort={() => {}}
          sortOrder={sortOrder === 1 ? "asc" : "desc"}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          itemType="job"
          selectedItems={selectedApplications}
          onSelectItem={handleSelectApplication}
          onSelectAll={handleSelectAll}
          onShare={(val: JobApplication) => {
            setOpenShareModal(true);
            setShareApplication(val);
          }}
        />
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalJobs}
          limit={limit}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
        />
      </div>

      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        application={selectedApplication}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={
          applicationToDelete
            ? applicationToDelete.name || "this application"
            : ""
        }
      />

      {openShareModal && shareApplication && (
        <ShareModal
          isLoading={shareModalLoader}
          response={shareModalResponse}
          onClose={() => setOpenShareModal(false)}
          onShare={onShare}
        />
      )}
    </div>
  );
};

export default ViewApplications;
