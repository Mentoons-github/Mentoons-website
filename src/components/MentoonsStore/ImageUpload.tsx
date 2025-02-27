import { useState } from "react";

const ImageUpload = ({
  onImageUpload,
  multiple = false,
}: {
  onImageUpload: (urls: string | string[]) => void;
  multiple?: boolean;
}) => {
  const [uploading, setUploading] = useState(false);

  // Define interface for the API response
  interface UploadResponse {
    urls: string[];
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file: File) => {
        formData.append("images", file);
      });

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadResponse;
      onImageUpload(multiple ? data.urls : data.urls[0]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2">
      <input
        type="file"
        onChange={handleImageChange}
        multiple={multiple}
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </label>
    </div>
  );
};

export default ImageUpload;
