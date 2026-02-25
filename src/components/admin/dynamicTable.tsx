import React, { ChangeEvent, useEffect, useState, useMemo } from "react";
import {
  Eye,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Search,
  Edit,
  UserX,
  UserCheck,
  SortDesc,
  SortAsc,
} from "lucide-react";
import CommonModal from "../common/modal/commonModal";
import UserDetailsModal from "./modal/userDetails";
import BplApplicationViewModal from "./workshop/BplApplicationViewModal";

type BblApplicationFilterStatus = "" | "Pending" | "Approved" | "Rejected";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface DynamicTableProps<T> {
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onBlock?: (item: T) => void;
  onAdd?: () => void;
  onView?: (row: any) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  excludeColumns?: string[];
  maxCellLength?: number;
  handleSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
  formatCell?: (value: any, key: string, item: T) => React.ReactNode;
  formatHeader?: (key: string) => string;
  idKey?: keyof T;
  isLoading?: boolean;
  itemType:
    | "user"
    | "product"
    | "enquiry"
    | "employee"
    | "job"
    | "workshop"
    | "meetups"
    | "bplVerification";
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  updateStatus?: ((applicationId: string, status: string) => void) | undefined;
  handleFilter?: (value: BblApplicationFilterStatus) => void;
}

const DynamicTable = <T extends Record<string, any>>({
  data,
  onEdit,
  onDelete,
  onBlock,
  onAdd,
  onView,
  searchTerm = "",
  onSearch,
  sortField,
  sortOrder,
  onSort,
  excludeColumns = [],
  maxCellLength = 50,
  formatCell,
  formatHeader,
  handleSearch,
  idKey = "_id" as keyof T,
  isLoading = false,
  itemType = "user",
  selectedItems = new Set(),
  onSelectItem,
  onSelectAll,
  updateStatus,
  handleFilter,
}: DynamicTableProps<T>) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [commonModalOpen, setCommonModalOpen] = useState(false);
  const [commonModalData, setCommonModalData] = useState<T | null>(null);
  const [bplApplicationModalOpen, setBplApplicationModalOpen] =
    useState<boolean>(false);
  const [selectedBplApplication, setSelectedBplApplication] =
    useState<T | null>(null);

  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);

  const handleBplApplicationModal = (item: any) => {
    setSelectedBplApplication(item);
    setBplApplicationModalOpen(true);
  };

  useEffect(() => {
    if (onSearch) onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const getTableColumns = () => {
    if (!data.length) return [];
    const set = new Set<string>();
    data.forEach((i) =>
      Object.keys(i).forEach((k) => !excludeColumns.includes(k) && set.add(k)),
    );
    return Array.from(set);
  };
  const columns = getTableColumns();

  const filteredData = useMemo(() => {
    if (onSearch || !debouncedSearchTerm) return data;
    const term = debouncedSearchTerm.toLowerCase();
    return data.filter((item) =>
      columns.some((c) => {
        const v = item[c];
        return v != null && String(v).toLowerCase().includes(term);
      }),
    );
  }, [data, debouncedSearchTerm, columns, onSearch]);

  const displayData = onSearch ? data : filteredData;
  const isAllSelected =
    displayData.length > 0 &&
    displayData.every((i) => selectedItems.has(String(i[idKey])));

  const defaultFormatCell = (value: any): React.ReactNode => {
    if (value == null) return "-";
    if (value instanceof Date || !isNaN(Date.parse(String(value))))
      return new Date(value).toLocaleDateString();
    if (Array.isArray(value))
      return value.length ? `${value.length} items` : "None";
    if (typeof value === "object") return "Object";
    if (typeof value === "boolean") return value ? "Yes" : "No";

    const s = String(value);
    return s.length > maxCellLength ? `${s.slice(0, maxCellLength)}...` : s;
  };

  const defaultFormatHeader = (k: string) =>
    k
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .trim();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalSearchTerm(v);
    if (itemType !== "user" && handleSearch) handleSearch(e);
  };

  const handleSort = (field: string) => onSort?.(field);
  const getSortIcon = (field: string) =>
    sortField !== field ? null : sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );

  const handleView = (item: any) => {
    if (["workshop", "job"].includes(itemType)) {
      setCommonModalData(item);
      setCommonModalOpen(true);
    } else if (["user", "employee"].includes(itemType)) {
      setSelectedItem(item);
      setIsModalOpen(true);
    } else if (onView) {
      onView(item);
    }
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onSelectAll?.(e.target.checked);
  const handleSelectChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => onSelectItem?.(id, e.target.checked);

  const BlockButton = ({ item }: { item: T }) => {
    if (itemType !== "user" || !onBlock) return null;

    const isBlocked = !!(item.isBlocked ?? false);

    return (
      <button
        onClick={() => onBlock(item)}
        className={`
          group relative inline-flex items-center gap-1.5 px-3 py-1.5 
          rounded-md font-medium text-xs transition-all duration-200
          ${
            isBlocked
              ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 hover:border-green-300"
              : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:border-red-300"
          }
        `}
        title={
          isBlocked ? "Click to unblock this user" : "Click to block this user"
        }
      >
        {isBlocked ? (
          <>
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unblock</span>
          </>
        ) : (
          <>
            <UserX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Block</span>
          </>
        )}

        {/* Enhanced Tooltip */}
        <span
          className="
            absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
            opacity-0 group-hover:opacity-100 transition-opacity 
            bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg 
            whitespace-nowrap pointer-events-none z-10
            after:content-[''] after:absolute after:top-full after:left-1/2 
            after:-translate-x-1/2 after:border-4 after:border-transparent 
            after:border-t-gray-900
          "
        >
          {isBlocked ? "Restore user access" : "Restrict user access"}
        </span>
      </button>
    );
  };

  const renderDesktopActions = (item: T) => {
    if (itemType === "user") {
      return (
        <div className="flex items-center gap-2">
          <ViewButton pendingEdit={false} onClick={() => handleView(item)} />
          <BlockButton item={item} />
        </div>
      );
    }

    const pendingEdit =
      itemType === "employee" && item.profileEditRequest?.status === "pending";

    return (
      <div className="flex items-center gap-2">
        <ViewButton
          pendingEdit={pendingEdit}
          onClick={() => handleView(item)}
          itemType={itemType}
          handleBplApplicationModal={() => handleBplApplicationModal(item)}
        />
        {onEdit && (
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <BlockButton item={item} />
      </div>
    );
  };

  const renderMobileActions = (item: T) => {
    if (itemType === "user") {
      return (
        <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
          <ViewButton pendingEdit={false} onClick={() => handleView(item)} />
          <BlockButton item={item} />
        </div>
      );
    }

    const pendingEdit =
      itemType === "employee" && item.profileEditRequest?.status === "pending";

    return (
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
        <ViewButton
          pendingEdit={pendingEdit}
          onClick={() => handleView(item)}
          itemType={itemType}
          handleBplApplicationModal={() => handleBplApplicationModal(item)}
        />
        {onEdit && (
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <BlockButton item={item} />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full">
        <Header
          onAdd={onAdd}
          localSearchTerm={localSearchTerm}
          onSearch={handleSearchChange}
          itemType={itemType}
          sortOrder={sortOrder}
          onSort={onSort}
          handleFilter={handleFilter}
        />
        <EmptyState onAdd={onAdd} />
      </div>
    );
  }

  if (displayData.length === 0) {
    return (
      <div className="w-full">
        <Header
          onAdd={onAdd}
          localSearchTerm={localSearchTerm}
          onSearch={handleSearchChange}
          itemType={itemType}
          sortOrder={sortOrder}
          onSort={onSort}
          handleFilter={handleFilter}
        />
        <NoResults />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Header
        onAdd={onAdd}
        localSearchTerm={localSearchTerm}
        onSearch={handleSearchChange}
        itemType={itemType}
        sortOrder={sortOrder}
        onSort={onSort}
        handleFilter={handleFilter}
      />

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              {itemType === "job" && (
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={c}
                  onClick={() => handleSort(c)}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {(formatHeader || defaultFormatHeader)(c)}
                    {getSortIcon(c)}
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayData.map((item, idx) => {
              const itemId = String(item[idKey] ?? idx);

              return (
                <tr key={itemId} className="hover:bg-gray-50 transition-colors">
                  {itemType === "job" && (
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(itemId)}
                        onChange={(e) => handleSelectChange(itemId, e)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                    >
                      <div
                        className="max-w-xs truncate"
                        title={String(item[col] ?? "")}
                      >
                        {(formatCell || defaultFormatCell)(
                          item[col],
                          col,
                          item,
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {renderDesktopActions(item)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="block sm:hidden space-y-4">
        {displayData.map((item, idx) => {
          const itemId = String(item[idKey] ?? idx);

          return (
            <div
              key={itemId}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {itemType === "job" && (
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(itemId)}
                    onChange={(e) => handleSelectChange(itemId, e)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                {columns.map((col) => (
                  <div key={col} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">
                      {(formatHeader || defaultFormatHeader)(col)}:
                    </span>
                    <span className="text-gray-900 truncate max-w-[60%]">
                      {(formatCell || defaultFormatCell)(item[col], col, item)}
                    </span>
                  </div>
                ))}
              </div>

              {renderMobileActions(item)}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {displayData.length} item{displayData.length !== 1 ? "s" : ""}
      </div>

      {isModalOpen && selectedItem && (
        <UserDetailsModal
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          itemType={itemType}
        />
      )}

      <CommonModal
        values={commonModalData}
        isOpen={commonModalOpen}
        onClose={setCommonModalOpen}
      />

      {bplApplicationModalOpen && selectedBplApplication && (
        <BplApplicationViewModal
          data={selectedBplApplication}
          onClose={() => {
            setBplApplicationModalOpen(false);
            setSelectedBplApplication(null);
          }}
          updateStatus={updateStatus!}
        />
      )}
    </div>
  );
};

interface HeaderProps {
  onAdd?: () => void;
  localSearchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  itemType: DynamicTableProps<any>["itemType"];
  onSort?: (field: string) => void;
  sortOrder?: "asc" | "desc";
  handleFilter?: (value: BblApplicationFilterStatus) => void;
}

const Header = ({
  onAdd,
  localSearchTerm,
  onSearch,
  itemType,
  onSort,
  sortOrder,
  handleFilter,
}: HeaderProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
    <div className="md:flex items-center w-full space-y-2 md:space-y-0 justify-between gap-5">
      <div className="relative flex-1 max-w-md ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search items..."
          value={localSearchTerm}
          onChange={onSearch}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      <div className="flex items-center gap-3 md:gap-5 justify-between md:justify-normal ">
        {itemType === "bplVerification" && (
          <div>
            <select
              className="border px-2 md:px-3 py-1 md:py-2 rounded-md"
              onChange={(e) =>
                handleFilter &&
                handleFilter(e.target.value as BblApplicationFilterStatus)
              }
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}
        <div
          className="flex px-2 md:px-3 py-1 md:py-2 border rounded-md cursor-pointer space-x-2 items-center "
          onClick={() => onSort && onSort("createdAt")}
        >
          <h4>
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}{" "}
          </h4>
          {sortOrder === "asc" ? <SortAsc /> : <SortDesc />}
        </div>
      </div>
    </div>

    {onAdd && itemType !== "user" && (
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
      >
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    )}
  </div>
);

const EmptyState = ({ onAdd }: { onAdd?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <div className="text-6xl mb-4">Empty List</div>
    <h3 className="text-xl font-medium mb-2">No Data Available</h3>
    <p className="text-gray-400 mb-4">
      There are no items to display at the moment.
    </p>
    {onAdd && (
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    )}
  </div>
);

const NoResults = () => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
    <div className="text-6xl mb-4">Search</div>
    <h3 className="text-xl font-medium mb-2">No results found</h3>
    <p className="text-gray-400">Try adjusting your search term.</p>
  </div>
);

interface ViewButtonProps {
  pendingEdit: boolean;
  onClick?: () => void;
  itemType?: string;
  handleBplApplicationModal?: () => void;
}

const ViewButton = ({
  pendingEdit,
  onClick,
  itemType,
  handleBplApplicationModal,
}: ViewButtonProps) => (
  <div className="relative inline-block">
    <button
      onClick={() => {
        if (itemType === "bplVerification") {
          handleBplApplicationModal?.();
        } else {
          onClick?.();
        }
      }}
      className={`p-1 ${
        pendingEdit
          ? "text-red-600 hover:text-red-800 hover:bg-red-100"
          : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"
      } rounded transition-colors`}
      title="View"
    >
      <Eye className="w-4 h-4" />
    </button>
    {pendingEdit && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
        1
      </span>
    )}
  </div>
);

export default DynamicTable;
