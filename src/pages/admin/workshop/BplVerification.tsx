import DynamicTable from "@/components/admin/dynamicTable";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import Pagination from "@/components/admin/pagination";
import { EXCLUDE_BPL_APPLICATIONS } from "@/constant/admin/dynamicTable/exclude";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { resetInvoiceReducer } from "@/redux/workshop/workshopSlice";
import {
  deleteBplApplicationThunk,
  getAllBplApplicationThunk,
  updateApplicationStatusThunk,
} from "@/redux/workshop/workshopThunk";
import { BplVerificationTypes } from "@/types/workshopsV2/bplVerificationTypes";
import { useAuth } from "@clerk/clerk-react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Status = "" | "Pending" | "Approved" | "Rejected";

const BplVerification = () => {
  const dispatch = useAppDispatch();
  const {
    allApplications,
    message,
    error,
    statusUpdateSuccess,
    totalApplicationPage,
    totalApplications,
    deleteSuccess,
  } = useAppSelector((state) => state.invoice);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState("createdAt");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState<Status>("");
  const [limit, setLimit] = useState(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteApplication, setDeleteApplication] =
    useState<BplVerificationTypes | null>(null);

  const { getToken } = useAuth();

  useEffect(() => {
    if (statusUpdateSuccess || deleteSuccess) {
      toast.success(message);
      dispatch(resetInvoiceReducer());
      setIsDeleteModalOpen(false);
    }
    if (error) {
      toast.error(error);
      dispatch(resetInvoiceReducer());
    }
  }, [deleteSuccess, dispatch, error, message, statusUpdateSuccess]);

  const fetchAllApplications = async () => {
    const token = await getToken();
    if (!token) {
      return;
    }
    dispatch(
      getAllBplApplicationThunk({
        token,
        limit,
        page: currentPage,
        search: debouncedSearchTerm,
        sortOrder,
        sortField,
        filter: filterOptions,
      }),
    );
  };

  useEffect(() => {
    fetchAllApplications();
  }, [
    limit,
    currentPage,
    sortField,
    sortOrder,
    debouncedSearchTerm,
    filterOptions,
  ]);

  const updateStatus = async (applicationId: string, status: string) => {
    const token = await getToken();
    if (!token) {
      return;
    }
    dispatch(
      updateApplicationStatusThunk({ data: { applicationId, status }, token }),
    ).unwrap();
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    [],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleFilter = (value: Status) => {
    setFilterOptions(value);
  };

  const handleDelete = async (data: BplVerificationTypes) => {
    setDeleteApplication(data);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const token = await getToken();
    if (!token) return;
    dispatch(
      deleteBplApplicationThunk({
        token,
        applicationId: deleteApplication?._id as string,
      }),
    ).unwrap();
  };

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">BPL Verification Applications</h1>
      <DynamicTable
        data={allApplications}
        // onEdit={editEnquiry}
        onDelete={handleDelete}
        // onView={viewEnquiry}
        sortField={sortField}
        onSort={handleSort}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        itemType="bplVerification"
        excludeColumns={EXCLUDE_BPL_APPLICATIONS}
        updateStatus={updateStatus}
        handleFilter={handleFilter}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalApplicationPage}
        totalItems={totalApplications}
        limit={limit}
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={"this application"}
      />
    </div>
  );
};

export default BplVerification;
