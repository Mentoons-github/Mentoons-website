import { useState } from "react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { AddaApi } from "@/api/endpoints";
import { AxiosError } from "axios";
import { toast } from "sonner";

const CreateGroupModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupType, setGroupType] = useState("public");
  const [groupThumbnail, setGroupThumbnail] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGroupThumbnail(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setGroupDescription("");
    setGroupType("");
    setGroupThumbnail(null);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (!groupThumbnail) {
        //make alert
        return;
      }
      const groupDetails = {
        name: groupName,
        description: groupDescription,
        type: groupType,
        thumbnail: groupThumbnail,
      };
      const response = await AddaApi.createGroupParents(groupDetails);
      console.log(response);
      //make a toast here
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast(error.response?.data.message || "something went wrong");
      } else {
        toast("Unexpected error occured");
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 p-5 z-50">
      <motion.div
        className="bg-white p-6 w-full max-w-lg rounded-2xl shadow-xl animate-fadeIn flex flex-col items-center relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={handleClose}
          className="absolute top-1 right-4 text-gray-600 hover:text-gray-900 transition"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 pb-4">
          Create Your Group
        </h2>

        <div className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Enter Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />

          <select
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <div className="w-full">
            <label
              htmlFor="groupThumbnail"
              className="block text-sm font-medium text-gray-600"
            >
              Group Thumbnail (Optional)
            </label>
            <input
              type="file"
              id="groupThumbnail"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {groupThumbnail && (
              <div className="w-full flex justify-center items-center">
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(groupThumbnail)}
                    alt="Group Thumbnail Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#652D90] text-white px-5 py-2 rounded-full hover:bg-[#5a1f77] transition duration-200"
          >
            Create Group
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateGroupModal;
