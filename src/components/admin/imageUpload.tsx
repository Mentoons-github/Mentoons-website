import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
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
}

const ImageUpload = ({
  onImageUpload,
  multiple = false,
  initialImages = [],
}: {
  onImageUpload: (images: ImageData[]) => void;
  multiple?: boolean;
  initialImages?: ImageData[];
}) => {
  const [uploading, setUploading] = useState(false);
  const [productImages, setProductImages] =
    useState<ImageData[]>(initialImages);
  const { getToken } = useAuth();

  // Initialize with initial images if provided
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setProductImages(initialImages);
    }
  }, [initialImages]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    setUploading(true);

    try {
      const token = await getToken();

      // Upload all files concurrently
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "https://mentoons-backend-zlx3.onrender.com/api/v1/upload/file",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const data = (await response.json()) as UploadResponse;

        if (data.success && data.data.fileDetails) {
          return { imageUrl: data.data.fileDetails.url };
        } else {
          throw new Error(`Failed to process ${file.name}`);
        }
      });

      // Wait for all uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);

      // Add new images to the existing ones (if multiple is true)
      const newProductImages = multiple
        ? [...productImages, ...uploadedImages]
        : uploadedImages;

      // Update state and call onImageUpload
      setProductImages(newProductImages);
      onImageUpload(newProductImages);

      successToast(`Uploaded ${uploadedImages.length} image(s) successfully`);
    } catch (error) {
      console.error("Error uploading images:", error);
      errorToast("Failed to upload one or more images");
    } finally {
      setUploading(false);
      // Clear the input value to allow uploading the same file again
      const fileInput = document.getElementById(
        "image-upload"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
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
