import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import Loader from "@/components/common/Loader";
import Pagination from "@/components/admin/pagination";
import DynamicTable from "@/components/admin/dynamicTable";
import { AppDispatch, RootState } from "@/redux/store";
import { getEmployees, deleteEmployee } from "@/redux/admin/employee/api";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { Employee } from "@/types/employee";
import { EXCLUDE_EMPLOYEE_DATA } from "@/constant/admin";

const EmployeeTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error, totalPages, totalEmployees } = useSelector(
    (state: RootState) => state.employee
  );

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  console.log("Employees Data:", employees);
  useEffect(() => {
    dispatch(
      getEmployees({
        sortOrder,
        searchTerm: debouncedSearchTerm,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, sortOrder, debouncedSearchTerm, currentPage, limit]);

  // const handleEdit = (job: JobData) => {
  //   console.log("edit employee working");
  //   navigate(`/employee/edit/${job._id}`);
  // };

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete && employeeToDelete._id) {
      try {
        const result = await dispatch(
          deleteEmployee(employeeToDelete._id)
        ).unwrap();
        if (result.status) {
          successToast(result.message || "Employee deleted successfully");
        } else {
          errorToast(result.message || "Failed to delete employee");
        }
      } catch (err) {
        console.error(err);
        errorToast("Failed to delete employee");
      }
    }
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleView = (employee: Employee) => {
    navigate(`/employee/${employee._id}`);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!employees || employees.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        No data available
      </div>
    );

  const updatedEmployees = employees.map((employee) => {
    const { place, profilePicture, ...rest } = employee;
    console.log(place, profilePicture);
    return rest;
  }) as Employee[];

  return (
    <div className="h-full p-4">
      <h1 className="mb-4 text-2xl font-bold">All Employees</h1>
      <DynamicTable
        itemType="employee"
        excludeColumns={EXCLUDE_EMPLOYEE_DATA}
        data={updatedEmployees}
        sortField="createdAt"
        onEdit={(employee: Employee) => {
          navigate(`/admin/employee/edit/${employee._id}`);
        }}
        onDelete={() => handleDelete}
        onView={handleView}
        onSort={handleSort}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
      />
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          totalItems={totalEmployees || 0}
          limit={limit}
          onLimitChange={handleLimitChange}
          onPageChange={handlePageChange}
        />
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={
          employeeToDelete ? employeeToDelete.name || "this employee" : ""
        }
      />
    </div>
  );
};

export default EmployeeTable;
