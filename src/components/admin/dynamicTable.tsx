import React, { ChangeEvent, useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import UserDetailsModal from "./modal/userDetails";

interface DynamicTableProps<T> {
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
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
  itemType: "user" | "product" | "enquiry" | "employee" | "job";
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
}

const DynamicTable = <T extends Record<string, any>>({
  data,
  onEdit,
  onDelete,
  onAdd,
  onView,
  searchTerm = "",
  onSearch,
  sortField,
  sortOrder = "asc",
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
}: DynamicTableProps<T>) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isUser, setIsUser] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const isAllSelected =
    data.length > 0 &&
    data.every((item) => selectedItems.has(String(item[idKey])));

  const getTableColumns = () => {
    if (!data || data.length === 0) return [];

    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!excludeColumns.includes(key)) {
          allKeys.add(key);
        }
      });
    });

    return Array.from(allKeys);
  };

  const columns = getTableColumns();

  const defaultFormatCell = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return "-";

    if (
      value instanceof Date ||
      (typeof value === "string" && !isNaN(Date.parse(value)))
    ) {
      return new Date(value).toLocaleDateString();
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} items` : "None";
    }

    if (typeof value === "object") {
      return "Object";
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    const stringValue = String(value);
    return stringValue.length > maxCellLength
      ? `${stringValue.substring(0, maxCellLength)}...`
      : stringValue;
  };

  // Default header formatter
  const defaultFormatHeader = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch?.(value);
  };

  const handleSort = (field: string) => {
    onSort?.(field);
  };

  const handleView = (item: any) => {
    console.log("clicked view");
    if (itemType === "user") {
      setSelectedItem(item);
      setIsUser(true);
    } else if (
      itemType === "product" ||
      itemType === "enquiry" ||
      itemType === "job"
    ) {
      console.log("view setting");
      onView?.(item);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll?.(e.target.checked);
  };

  const handleSelectChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSelectItem?.(id, e.target.checked);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📋</div>
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
  }

  return (
    <div className="w-full">
      {/* Header with Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={localSearchTerm}
            onChange={itemType === "user" ? handleSearchChange : handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-4"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {itemType === "job" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {(formatHeader || defaultFormatHeader)(column)}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const itemId = String(item[idKey] || index);
              return (
                <tr key={itemId} className="hover:bg-gray-50 transition-colors">
                  {itemType === "job" && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(itemId)}
                        onChange={(e) => handleSelectChange(itemId, e)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      <div
                        className="max-w-xs truncate"
                        title={String(item[column] || "")}
                      >
                        {(formatCell || defaultFormatCell)(
                          item[column],
                          column,
                          item
                        )}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {itemType === "product" && onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {itemType !== "user" && onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Info */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {data.length} item{data.length !== 1 ? "s" : ""}
      </div>
      {isUser && selectedItem && (
        <UserDetailsModal
          onClose={() => {
            setIsUser(false);
            setSelectedItem(null);
          }}
          user={selectedItem}
        />
      )}
    </div>
  );
};

export default DynamicTable;
