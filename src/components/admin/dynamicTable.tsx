import React, { ChangeEvent, useEffect, useState, useMemo } from "react";
import {
  Eye,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Search,
  Ban,
  CheckCircle,
  Edit,
} from "lucide-react";
import UserDetailsModal from "./modal/userDetails";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/* -------------------------- Props Interface -------------------------- */
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
  itemType: "user" | "product" | "enquiry" | "employee" | "job" | "meetups";
  selectedItems?: Set<string>;
  onSelectItem?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
}

/* -------------------------- Main Component -------------------------- */
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
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  /* Sync external search term */
  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);

  /* Fire external search */
  useEffect(() => {
    if (onSearch) onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  /* Get columns */
  const getTableColumns = () => {
    if (!data.length) return [];
    const set = new Set<string>();
    data.forEach((i) =>
      Object.keys(i).forEach((k) => !excludeColumns.includes(k) && set.add(k))
    );
    return Array.from(set);
  };
  const columns = getTableColumns();

  /* Client-side filtering */
  const filteredData = useMemo(() => {
    if (onSearch || !debouncedSearchTerm) return data;
    const term = debouncedSearchTerm.toLowerCase();
    return data.filter((item) =>
      columns.some((c) => {
        const v = item[c];
        return v != null && String(v).toLowerCase().includes(term);
      })
    );
  }, [data, debouncedSearchTerm, columns, onSearch]);

  const displayData = onSearch ? data : filteredData;
  const isAllSelected =
    displayData.length > 0 &&
    displayData.every((i) => selectedItems.has(String(i[idKey])));

  /* Format helpers */
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

  /* Search handler */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocalSearchTerm(v);
    if (itemType !== "user" && handleSearch) handleSearch(e);
  };

  /* Sort */
  const handleSort = (field: string) => onSort?.(field);
  const getSortIcon = (field: string) =>
    sortField !== field ? null : sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );

  /* View */
  const handleView = (item: any) => {
    if (["user", "employee"].includes(itemType)) {
      setSelectedItem(item);
      setIsModalOpen(true);
    } else if (onView) onView(item);
  };

  /* Selection */
  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onSelectAll?.(e.target.checked);
  const handleSelectChange = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => onSelectItem?.(id, e.target.checked);

  /* Block/Unblock Button */
  const BlockButton = ({ item }: { item: T }) => {
    if (itemType !== "user" || !onBlock) return null;
    const isBlocked = !!item.isBlocked;

    return (
      <button
        onClick={() => onBlock(item)}
        className={`p-1 rounded transition-colors ${
          isBlocked
            ? "text-green-600 hover:text-green-800 hover:bg-green-100"
            : "text-red-600 hover:text-red-800 hover:bg-red-100"
        }`}
        title={isBlocked ? "Unblock user" : "Block user"}
      >
        {isBlocked ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Ban className="w-4 h-4" />
        )}
      </button>
    );
  };

  /* ---------- Render Actions – USER ONLY (View + Block) ---------- */
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
        <ViewButton pendingEdit={pendingEdit} onClick={() => handleView(item)} />
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
        <ViewButton pendingEdit={pendingEdit} onClick={() => handleView(item)} />
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

  /* Loading State */
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

  /* Empty State */
  if (!data.length) {
    return (
      <div className="w-full">
        <Header
          onAdd={onAdd}
          localSearchTerm={localSearchTerm}
          onSearch={handleSearchChange}
          itemType={itemType} 
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
      />

      {/* Desktop Table */}
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
                          item
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

      {/* Mobile Cards */}
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

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {displayData.length} item{displayData.length !== 1 ? "s" : ""}
      </div>

      {/* Modal */}
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
    </div>
  );
};

/* -------------------------- Subcomponents -------------------------- */
interface HeaderProps {
  onAdd?: () => void;
  localSearchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  itemType: DynamicTableProps<any>["itemType"];   // <-- receive it
}

const Header = ({
  onAdd,
  localSearchTerm,
  onSearch,
  itemType,
}: HeaderProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
    <div className="relative flex-1 max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search items..."
        value={localSearchTerm}
        onChange={onSearch}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>

    {/* Hide "Add" button for users */}
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
  onClick: () => void;
}

const ViewButton = ({ pendingEdit, onClick }: ViewButtonProps) => (
  <div className="relative inline-block">
    <button
      onClick={onClick}
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