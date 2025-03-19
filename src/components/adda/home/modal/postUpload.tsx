import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiX } from "react-icons/fi";

const PostUpload = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (val: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [postText, setPostText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 p-5 z-50">
      <div className="bg-white p-6 w-full max-w-lg rounded-2xl shadow-xl animate-fadeIn flex flex-col items-center relative">
        <button
          onClick={() => onClose(false)}
          className="absolute top-1 right-4 text-gray-600 hover:text-gray-900 transition"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        <div className="flex justify-between w-full pb-4 border-b">
          {[
            { step: 1, label: "Write" },
            { step: 2, label: "Upload" },
            { step: 3, label: "Preview" },
          ].map(({ step, label }) => (
            <div
              key={step}
              className={`flex items-center gap-3 cursor-pointer transition ${
                activeTab === step ? "text-blue-500 font-bold" : "text-gray-600"
              }`}
              onClick={() => setActiveTab(step)}
            >
              <span
                className={`w-6 h-6 flex justify-center items-center rounded-full text-white text-sm font-semibold ${
                  activeTab === step ? "bg-blue-500" : "bg-gray-400"
                }`}
              >
                {step}
              </span>
              {label}
            </div>
          ))}
        </div>

        <div className="py-6 w-full flex flex-col items-center h-80">
          {activeTab === 1 && (
            <div className="flex flex-col gap-4 w-full h-full">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                Write about your post
              </h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-full"
                placeholder="Write something..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />
              <button
                onClick={() => setActiveTab(2)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 self-end"
              >
                Next →
              </button>
            </div>
          )}

          {activeTab === 2 && (
            <div className="flex flex-col gap-4 w-full h-full">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                Upload an Image
              </h2>
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer border-2 border-dotted w-full flex-grow flex items-center justify-center border-gray-400 bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
                style={{ maxHeight: "250px", minHeight: "150px" }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="max-h-[200px] object-contain rounded-md"
                  />
                ) : (
                  "Click to Upload"
                )}
              </label>

              <div className="flex justify-between w-full mt-4">
                <button
                  onClick={() => setActiveTab(1)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200 flex items-center gap-2"
                >
                  <FiArrowLeft /> Previous
                </button>
                <button
                  onClick={() => setActiveTab(3)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex items-center gap-2"
                >
                  Next <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="flex flex-col items-center gap-4 w-full h-full">
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                Preview Your Post
              </h2>
              <div className="w-full h-full flex items-center justify-center border border-gray-300 rounded-md overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md shadow-md"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 rounded-md">
                    No Image Selected
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-center w-full h-10 overflow-hidden text-ellipsis">
                {postText || "No text added"}
              </p>
              <button
                className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center gap-2 shadow-md"
                aria-label="Submit post"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostUpload;
