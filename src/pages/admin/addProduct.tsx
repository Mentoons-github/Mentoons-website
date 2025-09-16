import { useEffect, useState } from "react";
import { ProductBase } from "@/types/admin";

import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

import { useForm } from "react-hook-form";

import { useLocation } from "react-router-dom";
import { errorToast, successToast } from "../../utils/toastResposnse";
import ImageUpload from "@/components/admin/imageUpload";
import ProductTypeFields from "@/components/admin/productTypeFields";
import VideoUpload from "@/components/admin/videoUpload";

const AddProduct = () => {
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductBase | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const { state } = location;

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const productType = watch("type");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data);
        // setTotal(response.data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [getToken]);

  const onSubmit = async (data: Record<string, any>) => {
    console.log("data uploading: ", data);
    try {
      if (isEditing && selectedProduct) {
        //update the product
        setLoading(true);
        const response = await axios.put(
          `${import.meta.env.VITE_PROD_URL}/products/${selectedProduct?._id}`,
          data
        );
        //show toast
        if (response.status === 200) {
          successToast("Product updated successfully");
        }
      } else {
        //create the product
        const response = await axios.post(
          `${import.meta.env.VITE_PROD_URL}/products`,
          data
        );
        //show toast
        if (response.status === 201) {
          successToast("Product created successfully");
        }
      }
      reset();
      setIsEditing(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while saving the product.");
      errorToast("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ProductBase) => {
    if (!product) return;
    setSelectedProduct(product);
    setIsEditing(true);
    reset(product);
  };

  useEffect(() => {
    if (state?.product) {
      setSelectedProduct(state.product);
      setIsEditing(true);
      reset(state.product);
    }
  }, [state, reset]);

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_PROD_URL}/products/${id}`
      );

      console.log("Product deleted successfully");
      if (response.status === 200) {
        successToast("Product deleted successfully");
      }
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
      errorToast("Error deleting product");
    }
  };

  const handleImageUpload = (images: { imageUrl: string }[]) => {
    if (images.length) {
      const currentImages = watch("productImages") || [];
      setValue("productImages", [
        ...currentImages,
        ...images.map((img) => img.imageUrl),
      ]);
    }
  };

  const handleVideoUpload = (videos: { videoUrl: string }[]) => {
    if (videos.length) {
      setValue(
        "productVideos",
        videos.map((vid) => vid.videoUrl)
      );
    }
  };
  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Product Management</h1>
      {error && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      )}

      {/* Product Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        {/* Basic Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Title</label>
            <input
              {...register("title", { required: true })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              {...register("price", { required: true, min: 0 })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Original Product Source</label>
            <input
              {...register("orignalProductSrc")}
              className="w-full p-2 border rounded"
              placeholder="Enter source URL"
            />
          </div>

          <div>
            <label className="block mb-1">Product Type</label>
            <select
              {...register("type", { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="comic">Comic</option>
              <option value="audio comic">Audio Comic</option>
              <option value="podcast">Podcast</option>
              <option value="assessment">Assessment</option>
              <option value="mentoons card">Mentoons Cards</option>
              <option value="mentoons books">Mentoons Books</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Age Category</label>
            <select
              {...register("ageCategory", { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="6-12">Children</option>
              <option value="13-16">Teen</option>
              <option value="17-19">Young Adult</option>
              <option value="20+">Adult</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...register("rating")}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Product Level</label>
            <select
              {...register("product_type")}
              className="w-full p-2 border rounded"
            >
              <option value="Free">Free</option>
              <option value="Prime">Prime</option>
              <option value="Platinum">Platinum</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Featured Product</label>
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4 mt-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Tags</label>
            <input
              {...register("tags", {
                setValueAs: (value: any) =>
                  typeof value === "string"
                    ? value
                        .split(",")
                        .map((tag: string) => tag.trim())
                        .filter((tag: string) => tag !== "")
                    : [],
              })}
              className="w-full p-2 border rounded"
              placeholder="Enter tags separated by commas"
            />
          </div>
        </div>

        {/* Image Upload */}
        <ImageUpload
          onImageUpload={handleImageUpload}
          multiple
          initialImages={watch("productImages")?.map((url: string) => ({
            imageUrl: url,
          }))}
        />
        <VideoUpload
          onVideoUpload={handleVideoUpload}
          multiple
          initialVideos={watch("productVideos")?.map((url: string) => ({
            videoUrl: url,
          }))}
        />

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
            {products.length > 0 &&
              products.map((product) => (
                <div key={product._id} className="p-4 border rounded">
                  <h2 className="text-xl font-bold">
                    {product.title ?? "Untitled Product"}
                  </h2>
                  <p className="text-gray-600">
                    {product.description ?? "No description available."}
                  </p>
                  <p className="mt-2 text-lg font-bold">
                    ₹
                    {product.price >= 0 ? product.price : "Price not available"}
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
        </>
      )}
    </div>
  );
};

export default AddProduct;
