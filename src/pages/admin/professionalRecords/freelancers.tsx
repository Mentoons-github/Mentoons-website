import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import DynamicTable from "@/components/admin/dynamicTable";
import { useDispatch, useSelector } from "react-redux";
import { getEmployees } from "@/redux/admin/employee/api";
import { AppDispatch, RootState } from "@/redux/store";
import { Employee } from "@/types/employee";
import { useNavigate } from "react-router-dom";

const FreelancersTable: React.FC = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { employees, loading, error } = useSelector(
    (state: RootState) => state.employee
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (!token) return;

      dispatch(
        getEmployees({
          sortOrder: "asc",
          searchTerm,
          page: 1,
          limit: 1000,
        })
      );
    };

    load();
  }, [dispatch, getToken, searchTerm]);

  const freelancers = employees.filter(
    (emp) =>
      emp.department?.toLowerCase() === "freelance" ||
      emp.department?.toLowerCase() === "freelancer"
  );

  const handleEdit = (item: Employee) => {
    console.log("Edit freelancer:", item);
    // TODO: navigate to edit page or open modal
  };

  const handleDelete = (item: Employee) => {
    console.log("Delete freelancer:", item);
    // TODO: dispatch delete action
  };

  const handleView = (item: Employee) => {
    navigate(`/employee/${item._id}`);
  };

  const handleAdd = () => {
    console.log("Add new freelancer");
    // TODO: open add freelancer form
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
      <h1 className="text-2xl font-bold mb-6">Freelancers Management</h1>

      {freelancers.length === 0 ? (
        <p className="text-gray-600">No freelancers found.</p>
      ) : (
        <DynamicTable
          data={freelancers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onView={handleView}
          onSearch={handleSearch}
          itemType="employee"
          excludeColumns={[]}
          idKey="_id"
          maxCellLength={30}
        />
      )}
    </div>
  );
};

export default FreelancersTable;
