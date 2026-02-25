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

const ProductTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Products[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Products | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
          `${import.meta.env.VITE_PROD_URL}/products/${productToDelete._id}`
        );
        if (response.status === 200) {
          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => product._id !== productToDelete._id
            )
          );
          console.log(response, "response");
          successToast("Product deleted successfully");
        } else {
          const errorData = response.data;
          throw new Error(
            `Failed to delete product: ${
              errorData.message || response.statusText
            }`
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        errorToast(
          error instanceof Error ? error.message : "Failed to delete product"
        );
      }
    }
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const viewProduct = (row: Products) => {
    console.log(row._id, "row");
    navigate(`/admin/products/${row._id}`);
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
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `${
            import.meta.env.VITE_PROD_URL
          }/products?search=${debouncedSearchTerm}&sortBy=createdAt&order=${sortOrder}&page=${currentPage}&limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data.data,'ssssssssssssssssssss')
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

          const formattedCreatedAt = new Date(createdAt).toLocaleString();
          const formattedUpdatedAt = new Date(updatedAt).toLocaleString();

          console.log(details, __v, productTypeOrder, rating);

          return {
            ...rest,
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
          };
        });

        console.log(product);
        setProducts(product);
        setTotalPages(response.data.totalPages);
        setTotalProducts(response.data.total);
        setIsLoading(false);
      } catch (error) {
        toast.error("Error fetching products");
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, [currentPage, limit, debouncedSearchTerm, getToken, sortOrder]);


  return (
    <div className="w-full max-w-full flex-1 overflow-x-hidden">
      <div className="p-4 min-w-0">
        <h1 className="mb-6 text-2xl font-bold">All Products</h1>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="w-full overflow-x-auto">
            <DynamicTable
              data={products}
              onView={viewProduct}
              onEdit={editProduct}
              onDelete={removeProduct}
              sortField="createdAt"
              onSort={handleSort}
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
