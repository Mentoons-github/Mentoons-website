import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "@/components/admin/modal/deleteConfirmation";
import Loader from "../../components/common/Loader";
import Pagination from "@/components/admin/pagination";
import DynamicTable from "@/components/admin/dynamicTable";
import { Products } from "@/types/admin";
import { errorToast, successToast } from "../../utils/toastResposnse";
import { EXCLUDE_PRODUCT_ITEMS } from "@/constant/admin";
import FilterButton from "@/components/admin/filter";
import { ProductFilter } from "@/types/admin/product";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date", icon: "📅" },
  { value: "title", label: "Title", icon: "🔤" },
  { value: "price", label: "Price", icon: "💰" },
  { value: "ageCategory", label: "Age", icon: "👶" },
];

const ProductTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Products[]>([]);
  const [allFilters, setAllFilters] = useState<ProductFilter | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Products | null>(null);
  const [sortField, setSortField] = useState<
    "createdAt" | "title" | "price" | "ageCategory"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<string | null>(
    null,
  );
  const [selectedMembership, setSelectedMembership] = useState<string | null>(
    null,
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const { getToken } = useAuth();

  const editProduct = (row: Products) => {
    navigate(`/admin/add-products`, { state: { product: row } });
  };

  const removeProduct = (row: Products) => {
    setProductToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_PROD_URL}/products/${productToDelete._id}`,
        );
        if (response.status === 200) {
          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => product._id !== productToDelete._id,
            ),
          );
          successToast("Product deleted successfully");
        } else {
          const errorData = response.data;
          throw new Error(
            `Failed to delete product: ${errorData.message || response.statusText}`,
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        errorToast(
          error instanceof Error ? error.message : "Failed to delete product",
        );
      }
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const viewProduct = (row: Products) => {
    navigate(`/admin/products/${row._id}`);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const handleSortFieldChange = (value: string) => {
    setSortField(value as typeof sortField);
    setCurrentPage(1);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    [],
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
    const fetchAllTypes = async () => {
      if (allFilters) return;
      try {
        const token = await getToken();
        const res = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/products?getFilters=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setAllFilters(res.data || {});
      } catch (err) {
        console.error("Could not load product types", err);
      }
    };
    fetchAllTypes();
  }, [getToken, allFilters]);

  const buildQuery = () => {
    const params = new URLSearchParams();

    params.append("search", debouncedSearchTerm);
    params.append("sortBy", sortField);
    params.append("order", sortOrder);
    params.append("page", currentPage.toString());
    params.append("limit", limit.toString());

    if (selectedType) params.append("type", selectedType);
    if (selectedAgeCategory) params.append("ageCategory", selectedAgeCategory);
    if (selectedMembership) params.append("membership", selectedMembership);

    if (selectedPriceRange) {
      const [minStr, maxStr] = selectedPriceRange.split("-");
      if (minStr && maxStr) {
        params.append("minPrice", minStr);
        params.append("maxPrice", maxStr);
      }
    }

    return params.toString();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        const query = buildQuery();
        const url = `${import.meta.env.VITE_PROD_URL}/products?${query}`;

        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const product = response.data.data.map((item: any) => {
          const {
            details,
            __v,
            productTypeOrder,
            rating,
            createdAt,
            updatedAt,
            ...rest
          } = item;

          console.log(details, __v, productTypeOrder, rating);

          const formattedCreatedAt = new Date(createdAt).toLocaleString();
          const formattedUpdatedAt = new Date(updatedAt).toLocaleString();
          return {
            ...rest,
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
          };
        });

        setProducts(product);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.total);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch products");
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [
    currentPage,
    limit,
    debouncedSearchTerm,
    sortField,
    sortOrder,
    selectedType,
    selectedAgeCategory,
    selectedMembership,
    selectedPriceRange,
    getToken,
  ]);

  return (
    <div className="w-full max-w-full flex-1 overflow-x-hidden">
      <div className="p-4 min-w-0">
        <div className="flex items-center justify-between gap-5 mr-5">
          <h1 className="mb-6 text-2xl font-bold">All Products</h1>

          <div className="flex items-center gap-4 text-white">
            {allFilters && (
              <FilterButton
                filters={allFilters}
                selectedFilter={
                  selectedType ||
                  selectedAgeCategory ||
                  selectedMembership ||
                  selectedPriceRange ||
                  null
                }
                onSelect={(value) => {
                  if (value === null) {
                    setSelectedType(null);
                    setSelectedAgeCategory(null);
                    setSelectedMembership(null);
                    setSelectedPriceRange(null);
                  } else if (allFilters?.types.includes(value)) {
                    setSelectedType(value);
                    setSelectedAgeCategory(null);
                    setSelectedMembership(null);
                    setSelectedPriceRange(null);
                  } else if (allFilters?.ageCategories.includes(value)) {
                    setSelectedAgeCategory(value);
                    setSelectedType(null);
                    setSelectedMembership(null);
                    setSelectedPriceRange(null);
                  } else if (allFilters?.membershipTypes.includes(value)) {
                    setSelectedMembership(value);
                    setSelectedType(null);
                    setSelectedAgeCategory(null);
                    setSelectedPriceRange(null);
                  } else if (value?.startsWith("price:")) {
                    const range = value.replace("price:", "");
                    setSelectedPriceRange(range);
                    setSelectedType(null);
                    setSelectedAgeCategory(null);
                    setSelectedMembership(null);
                  }
                  setCurrentPage(1);
                }}
              />
            )}

            <div className="flex items-center gap-3">
              <span
                style={{
                  color: "black",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Sort by :
              </span>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "rgba(15, 23, 42, 0.75)",
                  border: "1.5px solid rgba(99, 120, 160, 0.4)",
                  borderRadius: "999px",
                  padding: "4px",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.35)",
                  gap: "2px",
                }}
              >
                {SORT_OPTIONS.map((option) => {
                  const isActive = sortField === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSortFieldChange(option.value)}
                      title={`Sort by ${option.label}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "0.42rem 1.1rem",
                        borderRadius: "999px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.88rem",
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: "0.02em",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        background: isActive
                          ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                          : "transparent",
                        color: isActive
                          ? "#ffffff"
                          : "rgba(203, 213, 225, 0.9)",
                        boxShadow: isActive
                          ? "0 1px 8px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          const btn = e.currentTarget as HTMLButtonElement;
                          btn.style.color = "#ffffff";
                          btn.style.background = "rgba(99,120,160,0.22)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          const btn = e.currentTarget as HTMLButtonElement;
                          btn.style.color = "rgba(203,213,225,0.9)";
                          btn.style.background = "transparent";
                        }
                      }}
                    >
                      <span style={{ fontSize: "1rem", lineHeight: 1 }}>
                        {option.icon}
                      </span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={toggleSortOrder}
              title={
                sortOrder === "asc"
                  ? "Ascending — click for descending"
                  : "Descending — click for ascending"
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid rgba(59,130,246,0.45)",
                background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                color: "#bfdbfe",
                fontWeight: 600,
                fontSize: "0.82rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                transition: "all 0.18s ease",
                boxShadow: "0 2px 8px rgba(30,64,175,0.35)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)";
                (e.currentTarget as HTMLButtonElement).style.color = "#bfdbfe";
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.25s ease",
                  transform:
                    sortOrder === "asc" ? "rotate(0deg)" : "rotate(180deg)",
                  fontSize: "1rem",
                  lineHeight: 1,
                }}
              >
                ↑
              </span>
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full overflow-x-auto">
            <DynamicTable
              data={products}
              onView={viewProduct}
              onEdit={editProduct}
              onDelete={removeProduct}
              sortField={sortField}
              onSort={toggleSortOrder}
              sortOrder={sortOrder}
              searchTerm={searchTerm}
              handleSearch={handleSearch}
              itemType="product"
              excludeColumns={EXCLUDE_PRODUCT_ITEMS}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalProducts}
              limit={limit}
              onLimitChange={handleLimitChange}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          itemName={
            productToDelete ? productToDelete.title || "this product" : ""
          }
        />
      </div>
    </div>
  );
};

export default ProductTable;
