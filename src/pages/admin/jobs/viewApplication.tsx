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
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(
    new Set()
  );
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

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
          })
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
      alert("Authentication token not found.");
      return [];
    }

    const result = await dispatch(
      getAppliedJobs({
        sortOrder,
        sortField,
        searchTerm: debouncedSearchTerm,
        page: 1,
        limit: 1000,
      })
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
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        { wch: 25 }, // Job
        { wch: 15 }, // Phone
        { wch: 40 }, // Portfolio Link
        { wch: 10 }, // Gender
        { wch: 50 }, // Cover Note
        { wch: 40 }, // Resume Link
        { wch: 40 }, // Cover Letter Link
        { wch: 20 }, // Applied At
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
      selectedApplications.has(job._id)
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

  const handleEdit = (application: JobApplication) => {
    console.log("Edit application:", application);
  };

  const handleDelete = (application: JobApplication) => {
    console.log("Delete application:", application);
  };

  const handleView = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === 1 ? -1 : 1));
    } else {
      setSortField(field);
      setSortOrder(-1);
    }
    setCurrentPage(1);
    setIsSortDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const getSortDisplayText = () => {
    const sortOptions = {
      createdAt: "Date",
      name: "Name",
      email: "Email",
      jobTitle: "Job Title",
      phone: "Phone",
      gender: "Gender",
    };

    const displayField =
      sortOptions[sortField as keyof typeof sortOptions] || sortField;
    return `Sort by ${displayField} ${sortOrder === 1 ? "↑" : "↓"}`;
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".sort-dropdown-container")) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSortDropdownOpen]);

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
    { field: "createdAt", label: "Date Applied", icon: "📅" },
    { field: "name", label: "Applicant Name", icon: "👤" },
    { field: "email", label: "Email", icon: "📧" },
    { field: "jobTitle", label: "Job Title", icon: "💼" },
    { field: "phone", label: "Phone", icon: "📞" },
    { field: "gender", label: "Gender", icon: "⚧️" },
  ];

  return (
    <div className="w-full max-w-full p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">View All Job Applications</h1>
        <div className="flex gap-2">
          {/* Sort Dropdown Button */}
          <div className="sort-dropdown-container relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSortDropdown}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 relative z-10"
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
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              {getSortDisplayText()}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 transition-transform ${
                  isSortDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>

            {/* Sort Dropdown Menu */}
            <AnimatePresence>
              {isSortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20"
                  style={{ top: "100%" }}
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <motion.button
                        key={option.field}
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSort(option.field)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                          sortField === option.field
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                            : ""
                        }`}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span className="flex-1">{option.label}</span>
                        {sortField === option.field && (
                          <span
                            className={`text-xs font-medium ${
                              sortOrder === 1
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {sortOrder === 1 ? "↑ Ascending" : "↓ Descending"}
                          </span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
          excludeColumns={["_id", "portfolioLink", "coverNote", "resume"]}
          data={data.data.jobs}
          sortField={sortField}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onSort={handleSort}
          sortOrder={sortOrder === 1 ? "asc" : "desc"}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          itemType="job"
          selectedItems={selectedApplications}
          onSelectItem={handleSelectApplication}
          onSelectAll={handleSelectAll}
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
    </div>
  );
};

export default ViewApplications;
