import { useEffect, useRef, useState } from "react";
import Croppr from "croppr";
import "croppr/dist/croppr.css";
import { X } from "lucide-react";
import { useSubmissionModal } from "@/context/adda/commonModalContext";

interface EmployeeEditProfileModalProps {
  form: any;
  setForm: (v: any) => void;
  selectedFile: File | null;
  setSelectedFile: (f: File | null) => void;
  fileRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
  onSave: () => Promise<void>;
  employeeDob: string | null;
}

const EmployeeEditProfileModal = ({
  form,
  setForm,
  selectedFile,
  setSelectedFile,
  fileRef,
  onCancel,
  onSave,
  employeeDob,
}: EmployeeEditProfileModalProps) => {
  const { showModal } = useSubmissionModal();

  const [showCropper, setShowCropper] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cropInstance = useRef<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (cropInstance.current) {
      cropInstance.current.destroy();
      cropInstance.current = null;
    }

    if (imageUrl) URL.revokeObjectURL(imageUrl);

    setImageLoaded(false);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setShowCropper(true);
  };

  useEffect(() => {
    if (!showCropper || !imgRef.current || !imageUrl || !imageLoaded) return;

    const timer = setTimeout(() => {
      if (imgRef.current) {
        try {
          if (cropInstance.current) {
            cropInstance.current.destroy();
          }

          cropInstance.current = new Croppr(imgRef.current, {
            aspectRatio: 1,
            startSize: [50, 50, "%"],
          });
        } catch (error) {
          console.error("Croppr initialization error:", error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cropInstance.current) {
        try {
          cropInstance.current.destroy();
        } catch (e) {
          console.error("Croppr destroy error:", e);
        }
        cropInstance.current = null;
      }
    };
  }, [showCropper, imageUrl, imageLoaded]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const applyCrop = async () => {
    if (!cropInstance.current || !imageUrl) return;

    try {
      const { x, y, width, height } = cropInstance.current.getValue();

      const img = new Image();
      img.src = imageUrl;
      await img.decode();

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const cropped = new File([blob], "cropped.jpg", {
            type: "image/jpeg",
          });
          setSelectedFile(cropped);
          closeCropper();
        }
      }, "image/jpeg");
    } catch (error) {
      console.error("Crop apply error:", error);
    }
  };

  const closeCropper = () => {
    if (cropInstance.current) {
      try {
        cropInstance.current.destroy();
      } catch (e) {
        console.error("Destroy error:", e);
      }
      cropInstance.current = null;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageLoaded(false);
    setShowCropper(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      const field = name.split(".")[1];
      setForm((prev: any) => ({
        ...prev,
        user: { ...prev.user, [field]: value },
      }));
    }
  };

  const triggerSave = async () => {
    if (!form.user?.name) {
      showModal({
        currentStep: "error",
        isSubmitting: false,
        message: "Name is required",
      });
      return;
    }
    await onSave();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">
                Name
              </label>
              <input
                type="text"
                name="user.name"
                value={form.user?.name ?? ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="user.dob"
                value={form.user?.dob ?? ""}
                onChange={handleInputChange}
                disabled={!!employeeDob}
                className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none ${
                  employeeDob
                    ? "bg-gray-200 cursor-not-allowed"
                    : "focus:border-blue-500"
                }`}
              />
              {employeeDob && (
                <p className="text-sm text-gray-500 mt-1">
                  Date of Birth cannot be edited once set.
                </p>
              )}
            </div>

            {/* Profile picture */}
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">
                Profile Picture
              </label>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* Preview of selected/cropped image */}
              {(selectedFile || form.user?.picture) && (
                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Preview
                  </label>
                  <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                    {selectedFile ? (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={form.user.picture}
                        alt="Current"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={triggerSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {showCropper && imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Crop your photo</h3>

            <div className="w-full max-h-[400px] overflow-hidden relative">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-gray-500">Loading image...</div>
                </div>
              )}
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop preview"
                className="w-full block"
                onLoad={() => setImageLoaded(true)}
                style={{ display: imageLoaded ? "block" : "none" }}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={closeCropper}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                disabled={!imageLoaded}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeEditProfileModal;
