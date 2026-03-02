import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import DynamicTable from "@/components/admin/dynamicTable";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "@/redux/admin/employee/api";
import { AppDispatch, RootState } from "@/redux/store";
import { Employee } from "@/types/employee";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/admin/pagination";

const PsychologistsTable: React.FC = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { employees, loading, error, totalPages, totalEmployees } = useSelector(
    (state: RootState) => state.employee,
  );

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;

      dispatch(
        getEmployees({
          sortOrder,
          searchTerm,
          page: currentPage,
          limit,
          from: "psychologist",
        }),
      );
    };

    load();
  }, [currentPage, dispatch, getToken, limit, searchTerm, sortOrder]);

  const handleEdit = (item: Employee) => {
    console.log("Edit psychologist:", item);
  };

  const handleDelete = (item: Employee) => {
    console.log("Delete psychologist:", item);
  };

  const handleView = (item: Employee) => {
    navigate(`/employee/${item._id}`);
  };

  const handleAdd = () => {
    console.log("Add new psychologist");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Psychologists Management</h1>

      {employees.length === 0 ? (
        <p className="text-gray-600">No psychologists found.</p>
      ) : (
        <div>
          <DynamicTable
            data={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onView={handleView}
            onSort={handleSort}
            sortOrder={sortOrder}
            sortField="createdAt"
            onSearch={handleSearch}
            searchTerm={searchTerm}
            itemType="employee"
            excludeColumns={[]}
            idKey="_id"
            maxCellLength={30}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            totalItems={totalEmployees || 0}
            limit={limit}
            onLimitChange={handleLimitChange}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default PsychologistsTable;
