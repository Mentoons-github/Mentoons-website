import { fetchEmployeeIncentive } from "@/api/incentive/employeeIncentive";
import ActionBar from "@/components/employee/incentive/actionBar";
import IncentiveTable from "@/components/employee/incentive/incentiveTable";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useStatusModal } from "@/context/adda/statusModalContext";

export interface Incentive {
  _id: string;
  employee: string;
  sourceType: "WORKSHOP_BATCH" | "SESSION";
  sourceId: string;
  incentiveAmount: number;
  status: "PENDING" | "PAID";
  initialPaymentDate?: string;
  finalPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const Incentive = () => {
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();

  const [loading, setLoading] = useState(true);
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState("");

  const fetchIncentives = async (page = 1) => {
    setLoading(true);

    const response = await fetchEmployeeIncentive({
      getToken,
      page,
      limit: pagination.limit,
      search: searchTerm,
      sort: sortValue,
    });

    if (!response.success) {
      showStatus("error", response.message || "Could not load incentives");
      setIncentives([]);
      setLoading(false);
      return;
    }

    setIncentives(response.data ?? []);
    setPagination({
      page: response.page ?? 1,
      limit: response.limit ?? pagination.limit,
      total: response.total ?? 0,
      totalPages: response.totalPages ?? 0,
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchIncentives(1);
  }, [searchTerm, sortValue]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchIncentives(newPage);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSort = (value: string) => {
    setSortValue(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Incentive</h1>
          <p className="text-gray-600 mt-2 text-lg">Incentive Details</p>
        </div>

        <div className="space-y-10">
          <ActionBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            sortValue={sortValue}
            onSortChange={handleSort}
          />
          <IncentiveTable
            incentives={incentives}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Incentive;
