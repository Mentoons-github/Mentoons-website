import React from "react";
import DynamicTable from "@/components/admin/dynamicTable";

interface Psychologist {
  _id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  active: boolean;
  inviteStatus: string;
}

const sampleData: Psychologist[] = [
  {
    _id: "1",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    department: "Psychology",
    salary: 75000,
    active: true,
    inviteStatus: "accepted",
  },
  {
    _id: "2",
    name: "Raj Kumar",
    email: "raj.kumar@example.com",
    department: "Psychology",
    salary: 85000,
    active: true,
    inviteStatus: "accepted",
  },
  {
    _id: "3",
    name: "Aisha Khan",
    email: "aisha.khan@example.com",
    department: "Psychology",
    salary: 65000,
    active: false,
    inviteStatus: "pending",
  },
  {
    _id: "4",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    department: "Psychology",
    salary: 90000,
    active: true,
    inviteStatus: "accepted",
  },
  {
    _id: "5",
    name: "Neha Patel",
    email: "neha.patel@example.com",
    department: "Psychology",
    salary: 55000,
    active: true,
    inviteStatus: "accepted",
  },
];

const PsychologistsTable: React.FC = () => {
  const handleEdit = (item: Psychologist): void => {
    console.log("Edit psychologist:", item);
    // Implement edit logic here (e.g., open modal or navigate to edit page)
  };

  const handleDelete = (item: Psychologist): void => {
    console.log("Delete psychologist:", item);
    // Implement delete logic here (e.g., API call to remove)
  };

  const handleView = (item: Psychologist): void => {
    console.log("View psychologist details:", item);
    // Implement view logic here (e.g., open details modal)
  };

  const handleAdd = (): void => {
    console.log("Add new psychologist");
    // Implement add logic here (e.g., open add form)
  };

  const handleSearch = (term: string): void => {
    console.log("Search term:", term);
    // Implement search filtering here if needed
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Psychologists Management</h1>
      <DynamicTable
        data={sampleData}
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
    </div>
  );
};

export default PsychologistsTable;
