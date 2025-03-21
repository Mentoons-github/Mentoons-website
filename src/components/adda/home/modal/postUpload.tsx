import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

const PostUpload = ({
  isOpen,
  onClose,
  postType,
}: {
  isOpen: boolean;
  onClose: (val: boolean) => void;
  postType: "photo" | "video" | "event" | "article";
}) => {
  const [activeTab, setActiveTab] = useState(1);
  const [postText, setPostText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState<string>("");

  useEffect(() => {
    setActiveTab(1);
    setPostText("");
    setMediaPreview(null);
    setEventDate("");
  }, [postType]);

  if (!isOpen) return null;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleNextTab = () => {
    if (
      (postType === "article" && activeTab < 2) ||
      (postType !== "article" && activeTab < 3)
    ) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevTab = () => {
    if (activeTab > 1) {
      setActiveTab(activeTab - 1);
    }
  };

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

        <h2 className="text-xl font-semibold text-gray-800 pb-4">
          {`Create ${postType} Post`}
        </h2>

        {postType !== "article" && postType !== "event" && (
          <div className="flex justify-between w-full pb-4 border-b">
            {["Write", "Upload", "Preview"].map((label, index) => (
              <div
                key={index + 1}
                className={`flex items-center gap-3 cursor-pointer transition ${
                  activeTab === index + 1
                    ? "text-blue-500 font-bold"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(index + 1)}
              >
                <span
                  className={`w-6 h-6 flex justify-center items-center rounded-full text-white text-sm font-semibold ${
                    activeTab === index + 1 ? "bg-blue-500" : "bg-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
                {label}
              </div>
            ))}
          </div>
        )}

        <div className="py-6 w-full flex flex-col items-center h-80">
          {activeTab === 1 && (
            <>
              {postType !== "event" && postType !== "article" && (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-full"
                  placeholder={`Write about your ${postType.toLowerCase()}...`}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              )}

              {postType === "event" && (
                <div className="w-full flex flex-col gap-4">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Write about your event..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                </div>
              )}
              {postType === "article" && (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-full"
                  placeholder="Write your article..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                />
              )}
            </>
          )}

          {activeTab === 2 &&
            (postType === "photo" || postType === "video") && (
              <div className="w-full h-full flex flex-col gap-4">
                <input
                  type={postType === "video" ? "file" : "image"}
                  accept={postType === "video" ? "video/*" : "image/*"}
                  id="mediaUpload"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                <label
                  htmlFor="mediaUpload"
                  className="cursor-pointer border-2 border-dotted w-full flex-grow flex items-center justify-center border-gray-400 bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
                  style={{ maxHeight: "250px", minHeight: "150px" }}
                >
                  {mediaPreview ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="max-h-[200px] object-contain rounded-md"
                    />
                  ) : (
                    "Click to Upload"
                  )}
                </label>
              </div>
            )}

          {activeTab === 2 && postType !== "photo" && postType !== "video" && (
            <div className="w-full flex flex-col items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 text-center">
                Preview
              </h2>
              <p className="text-gray-600 text-center w-full h-10 overflow-hidden text-ellipsis">
                {postText || "No content added"}
              </p>
              <button className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition duration-200">
                Submit Post
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {activeTab > 1 && (
            <button
              onClick={handlePrevTab}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Previous
            </button>
          )}
          {activeTab < 3 && (
            <button
              onClick={handleNextTab}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostUpload;
