import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { uploadFile } from "@/redux/fileUploadSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { AxiosError } from "axios";

interface PDFUploadProps {
  onPdfUpload: (pdf: { pdfUrl: string } | null) => void;
  initialPdf: { pdfUrl: string } | null;
  onRemoveBackendFile?: () => Promise<void>;
}

const PDFUpload: React.FC<PDFUploadProps> = ({
  onPdfUpload,
  initialPdf,
  onRemoveBackendFile,
}) => {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isRecentlyUploaded, setIsRecentlyUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newUrl = initialPdf?.pdfUrl || "";
    if (previewUrl !== newUrl) {
      setPreviewUrl(newUrl);
      setIsRecentlyUploaded(false);
      if (!newUrl) setUploadedFileName("");
    }
  }, [initialPdf?.pdfUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.includes("pdf")) {
      alert("Please select a valid PDF file.");
      return;
    }

    setUploading(true);
    setUploadedFileName(file.name);

    try {
      const result = await dispatch(uploadFile({ file, getToken })).unwrap();
      const pdfUrl = result?.data?.fileDetails?.url;

      if (!pdfUrl) throw new Error("Upload failed: No URL returned");

      setPreviewUrl(pdfUrl);
      setIsRecentlyUploaded(true);
      onPdfUpload({ pdfUrl });
    } catch (error) {
      console.error("Upload failed:", error);
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Upload failed";
      alert(`Failed to upload PDF: ${message}`);
      onPdfUpload(null);
      setUploadedFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      if (!isRecentlyUploaded && previewUrl && onRemoveBackendFile) {
        await onRemoveBackendFile();
      }
      setPreviewUrl("");
      setIsRecentlyUploaded(false);
      setUploadedFileName("");
      onPdfUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to remove PDF:", error);
      alert("Failed to remove PDF.");
    } finally {
      setRemoving(false);
    }
  };

  const showRemoveButton = !!previewUrl && !uploading;
  const getDisplayName = () => {
    if (uploadedFileName && isRecentlyUploaded) return uploadedFileName;
    return previewUrl.split("/").pop()?.replace(/%20/g, " ") || "document.pdf";
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={uploading || removing}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
        />
        {(uploading || removing) && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm text-gray-600">
                {uploading ? "Uploading..." : "Removing..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div>Preview URL: {previewUrl || "None"}</div>
          <div>Recently Uploaded: {isRecentlyUploaded ? "Yes" : "No"}</div>
          <div>Show Remove: {showRemoveButton ? "Yes" : "No"}</div>
        </div>
      )}

      {previewUrl && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm max-w-xs">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-gray-900 truncate">
                {getDisplayName()}
              </h4>
              {isRecentlyUploaded && (
                <p className="text-xs text-green-600 mt-0.5">
                  Recently uploaded
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                title="View PDF"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </a>
              {showRemoveButton && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={removing}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                  title={removing ? "Removing..." : "Remove PDF"}
                >
                  {removing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;
