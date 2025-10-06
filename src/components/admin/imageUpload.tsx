import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { errorToast, successToast } from "../../utils/toastResposnse";

interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    fileDetails: {
      url: string;
      key: string;
      originalName: string;
      mimetype: string;
      uploadedAt: string;
      userId: string;
      fileSize: number;
    };
  };
}

interface ImageData {
  imageUrl: string;
  _id?: string;
}

interface BackendImageData {
  imageUrl: {
    imageUrl: string;
    _id: string;
  };
}

const ImageUpload = ({
  onImageUpload,
  multiple = false,
  initialImages = [],
  productId,
}: {
  onImageUpload: (images: ImageData[]) => void;
  multiple?: boolean;
  initialImages?: (ImageData | BackendImageData)[];
  productId?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const [productImages, setProductImages] = useState<ImageData[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      const formattedImages = initialImages.map((img) =>
        "imageUrl" in img &&
        typeof img.imageUrl === "object" &&
        img.imageUrl.imageUrl
          ? { imageUrl: img.imageUrl.imageUrl, _id: img.imageUrl._id }
          : img
      ) as ImageData[];
      setProductImages(formattedImages);
    } else {
      setProductImages([]);
    }
  }, [initialImages]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    setUploading(true);

    try {
      const token = await getToken();

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post<UploadResponse>(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!response.data.success || !response.data.data.fileDetails) {
          throw new Error(`Failed to process ${file.name}`);
        }

        return { imageUrl: response.data.data.fileDetails.url };
      });

      const uploadedImages = await Promise.all(uploadPromises);

      const newProductImages = multiple
        ? [...productImages, ...uploadedImages]
        : uploadedImages;

      setProductImages(newProductImages);
      onImageUpload(newProductImages);

      successToast(`Uploaded ${uploadedImages.length} image(s) successfully`);
    } catch (error) {
      console.error("Error uploading images:", error);
      errorToast("Failed to upload one or more images");
    } finally {
      setUploading(false);
      const fileInput = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const imageToRemove = productImages[indexToRemove];
    if (imageToRemove._id && productId) {
      try {
        const token = await getToken();
        const response = await axios.delete(
          `https://mentoons-backend-zlx3.onrender.com/api/v1/products/image/${imageToRemove._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              productId,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to delete image from backend");
        }

        successToast("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error);
        errorToast("Failed to delete image");
        return;
      }
    }

    const updatedImages = productImages.filter(
      (_, index) => index !== indexToRemove
    );
    setProductImages(updatedImages);
    onImageUpload(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="file"
          onChange={handleImageChange}
          multiple={multiple}
          accept="image/*"
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 disabled:opacity-50"
        >
          <FaPlus className="mr-2" />
          {uploading ? "Uploading..." : "Add Image"}
        </label>
        {uploading && (
          <span className="text-sm text-gray-500">
            Uploading, please wait...
          </span>
        )}
      </div>

      {/* Image Preview Section */}
      {productImages.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Image Preview
          </h4>
          <div
            className={`grid gap-4 ${
              multiple
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {productImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="object-cover w-full h-32 border border-gray-200 rounded shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                  title="Remove image"
                >
                  <FaTrashAlt size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
