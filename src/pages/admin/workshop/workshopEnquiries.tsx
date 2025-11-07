import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/redux/store";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import Loader from "../../../components/common/Loader";
import Pagination from "@/components/admin/pagination";
import DynamicTable from "@/components/admin/dynamicTable";
import { getEnquiries } from "@/redux/admin/workshop";
import { WorkshopEnquiry } from "@/types/admin";
import { useDispatch, useSelector } from "react-redux";
import { EXCLUDE_ENQUIRY_ITEMS } from "@/constant/admin";
import { useAuth } from "@clerk/clerk-react";

const GetWorkshopEnquiries = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { enquiries, loading, error, success } = useSelector(
    (state: RootState) => state.adminWorkshop
  );
  const [enquiriesData, setEnquiriesData] = useState<WorkshopEnquiry[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] =
    useState<WorkshopEnquiry | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalEnquiries, setTotalEnquiries] = useState<number>(0);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = await getToken();
      if (!token) {
        console.error("No token found");
        return;
      }
      dispatch(
        getEnquiries({ sort: sortOrder, page: currentPage, limit, token })
      );
    };

    fetchEnquiries();
  }, [dispatch, sortOrder, currentPage, limit, debouncedSearchTerm]);

  useEffect(() => {
    if (success && enquiries?.data?.enquiryData) {
      setEnquiriesData(enquiries.data.enquiryData);
      setTotalPages(enquiries.data.totalPages);
      setTotalEnquiries(enquiries.data.totalEnquiries);
    }
    if (error) {
      toast.error(error);
    }
  }, [success, enquiries, error]);

  const editEnquiry = (row: WorkshopEnquiry) => {
    navigate(`/admin/edit-enquiry`, { state: { enquiry: row } });
  };

  const removeEnquiry = (row: WorkshopEnquiry) => {
    setEnquiryToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (enquiryToDelete) {
      try {
        toast.success("Enquiry deleted successfully");
        setEnquiriesData((prevEnquiries) =>
          prevEnquiries.filter((enquiry) => enquiry._id !== enquiryToDelete._id)
        );
      } catch (error) {
        console.error("Error deleting enquiry:", error);
        toast.error("Failed to delete enquiry");
      }
    }
    setIsDeleteModalOpen(false);
    setEnquiryToDelete(null);
  };

  const viewEnquiry = (row: WorkshopEnquiry) => {
    navigate(`/admin/enquiries/${row._id}`);
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
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">Workshop Enquiries</h1>
      <DynamicTable
        data={enquiriesData}
        onEdit={editEnquiry}
        onDelete={removeEnquiry}
        onView={viewEnquiry}
        sortField="createdAt"
        onSort={handleSort}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        itemType="enquiry"
        excludeColumns={EXCLUDE_ENQUIRY_ITEMS}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalEnquiries}
        limit={limit}
        onLimitChange={handleLimitChange}
        onPageChange={handlePageChange}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={enquiryToDelete ? enquiryToDelete.name || "this enquiry" : ""}
      />
    </div>
  );
};

export default GetWorkshopEnquiries;
