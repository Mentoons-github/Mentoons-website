import React from "react";
import DynamicTable from "@/components/admin/dynamicTable";

interface Freelancer {
  _id: string;
  name: string;
  email: string;
  department: string;
  hourlyRate: number;
  active: boolean;
  inviteStatus: string;
}

const sampleData: Freelancer[] = [
  {
    _id: "1",
    name: "Amit Desai",
    email: "amit.desai@example.com",
    department: "Freelance",
    hourlyRate: 1500,
    active: true,
    inviteStatus: "accepted",
  },
  {
    _id: "2",
    name: "Sonia Gupta",
    email: "sonia.gupta@example.com",
    department: "Freelance",
    hourlyRate: 2000,
    active: true,
    inviteStatus: "accepted",
  },
  {
    _id: "3",
    name: "Karan Mehta",
    email: "karan.mehta@example.com",
    department: "Freelance",
    hourlyRate: 1200,
    active: false,
    inviteStatus: "pending",
  },
  {
    _id: "4",
    name: "Riya Joshi",
    email: "riya.joshi@example.com",
    department: "Freelance",
    hourlyRate: 1800,
    active: true,
    inviteStatus: "accepted",
  },
  {
    _id: "5",
    name: "Arjun Reddy",
    email: "arjun.reddy@example.com",
    department: "Freelance",
    hourlyRate: 2200,
    active: true,
    inviteStatus: "accepted",
  },
];

const FreelancersTable: React.FC = () => {
  const handleEdit = (item: Freelancer): void => {
    console.log("Edit freelancer:", item);
    // Implement edit logic here (e.g., open modal or navigate to edit page)
  };

  const handleDelete = (item: Freelancer): void => {
    console.log("Delete freelancer:", item);
    // Implement delete logic here (e.g., API call to remove)
  };

  const handleView = (item: Freelancer): void => {
    console.log("View freelancer details:", item);
    // Implement view logic here (e.g., open details modal)
  };

  const handleAdd = (): void => {
    console.log("Add new freelancer");
    // Implement add logic here (e.g., open add form)
  };

  const handleSearch = (term: string): void => {
    console.log("Search term:", term);
    // Implement search filtering here if needed
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Freelancers Management</h1>
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

export default FreelancersTable;
