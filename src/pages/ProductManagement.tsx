import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "../components/MentoonsStore/ImageUpload";
import ProductTypeFields from "../components/MentoonsStore/ProductTypeFields";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  setPage,
  setSearch,
  updateProduct,
} from "../redux/productSlice";
import { RootState } from "../redux/store";
import { Product } from "../types/productTypes"; // Make sure to create this type

const ProductManagement = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
    total,
    page: currentPage,
    search,
  } = useSelector((state: RootState) => state.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState({
    type: "",
    ageCategory: "",
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const productType = watch("type");

  useEffect(() => {
    // Remove the local fetchProducts function and use the Redux action directly
    dispatch(
      fetchProducts({
        page: currentPage,
        search,
        ...filter,
      })
    );
  }, [dispatch, currentPage, search, filter]);

  const onSubmit = async (data: any) => {
    try {
      if (isEditing && selectedProduct) {
        await dispatch(
          updateProduct({
            id: selectedProduct._id!,
            updatedData: data,
          }) as any
        );
      } else {
        await dispatch(createProduct(data) as any);
      }
      reset();
      setIsEditing(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    reset(product);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id) as any);
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (urls: string[]) => {
    setValue("proudctImage", urls);
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
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="p-2 rounded border"
        >
          <option value="">All Types</option>
          <option value="COMIC">Comic</option>
          <option value="AUDIO_COMIC">Audio Comic</option>
          {/* Add other types */}
        </select>
        <select
          value={filter.ageCategory}
          onChange={(e) =>
            setFilter({ ...filter, ageCategory: e.target.value })
          }
          className="p-2 rounded border"
        >
          <option value="">All Ages</option>
          <option value="CHILDREN">Children</option>
          <option value="TEEN">Teen</option>
          {/* Add other age categories */}
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
              {...register("price", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Age Category</label>
            <select
              {...register("ageCategory")}
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
            <select {...register("type")} className="p-2 w-full rounded border">
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
              {...register("description")}
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
                <h2 className="text-xl font-bold">{product.title}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="mt-2 text-lg font-bold">₹{product.price}</p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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
