import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "../components/MentoonsStore/ImageUpload";
import ProductTypeFields from "../components/MentoonsStore/ProductTypeFields";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  setFilter,
  setPage,
  setSearch,
  updateProduct,
} from "../redux/productSlice";
import { AppDispatch, RootState } from "../redux/store";

import { AgeCategory } from "@/utils/enum";
import { ProductBase } from "../types/productTypes";

// Define Product type to ensure all product types have _id property
type Product = ProductBase & {
  _id: string;
};

const ProductManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: products,
    loading,
    error,
    total,
    page: currentPage,
    search,
    filter,
  } = useSelector((state: RootState) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const productType = watch("type");

  useEffect(() => {
    // Just fetch products without params - filter is now in Redux state
    dispatch(fetchProducts());
  }, [dispatch, currentPage, search, filter]);

  const onSubmit = async (data: Record<string, any>) => {
    try {
      if (isEditing && selectedProduct) {
        await dispatch(
          updateProduct({
            id: selectedProduct._id,
            updatedData: data,
          })
        );
      } else {
        await dispatch(createProduct(data));
      }
      reset();
      setIsEditing(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (product: Product) => {
    if (!product) return;
    setSelectedProduct(product);
    setIsEditing(true);
    reset(product);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await dispatch(deleteProduct(id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    dispatch(setPage(newPage));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value.trim()));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!name) return;

    // Dispatch filter changes through Redux
    dispatch(setFilter({ [name]: value }));
  };

  const handleImageUpload = (urls: string | string[]) => {
    if (typeof urls === "string") {
      setValue("productImage", [urls]); // Convert single string to array
    } else if (urls.length) {
      setValue("productImage", urls); // Handle array case
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Product Management</h1>

      {error && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 rounded border border-red-400">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="p-2 rounded border"
        />
        <select
          name="type"
          value={filter.type}
          onChange={handleFilterChange}
          className="p-2 rounded border"
        >
          <option value="">All Types</option>
          <option value="COMIC">Comic</option>
          <option value="AUDIO_COMIC">Audio Comic</option>
          {/* Add other types */}
        </select>
        <select
          name="ageCategory"
          value={filter.ageCategory}
          onChange={handleFilterChange}
          className="p-2 rounded border"
        >
          <option value="">All Ages</option>
          {Object.entries(AgeCategory).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        {/* Basic Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              {...register("title", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register("price", { required: true, min: 0 })}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Age Category</label>
            <select
              {...register("ageCategory", { required: true })}
              className="p-2 w-full rounded border"
            >
              <option value="CHILD">Children</option>
              <option value="TEEN">Teen</option>
              <option value="YOUNG_ADULT">Young Adult</option>
              <option value="ADULT">Adult</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Product Type</label>
            <select
              {...register("type", { required: true })}
              className="p-2 w-full rounded border"
            >
              <option value="COMIC">Comic</option>
              <option value="AUDIO_COMIC">Audio Comic</option>
              <option value="PODCAST">Podcast</option>
              <option value="WORKSHOP">Workshop</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="SELF_HELP_CARD">Mentoons Cards</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="p-2 w-full rounded border"
              rows={3}
            />
          </div>
        </div>

        {/* Image Upload */}
        <ImageUpload onImageUpload={handleImageUpload} multiple />

        {/* Dynamic Fields based on Product Type */}
        <ProductTypeFields type={productType} register={register} />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products List */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product._id} className="p-4 rounded border">
                <h2 className="text-xl font-bold">
                  {product.title ?? "Untitled Product"}
                </h2>
                <p className="text-gray-600">
                  {product.description ?? "No description available."}
                </p>
                <p className="mt-2 text-lg font-bold">
                  ₹{product.price >= 0 ? product.price : "Price not available"}
                </p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product?._id)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(total / 10) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManagement;
