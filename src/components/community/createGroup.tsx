import { Upload, Users, Tag, Plus, X } from "lucide-react";
import { useState, ChangeEvent, KeyboardEvent } from "react";

// Define interfaces for type safety
interface FormData {
  groupName: string;
  description: string;
  image: File | null;
  parentGroup: string;
  tags: string[];
  privacy: "public" | "private";
}

interface ParentGroup {
  id: string;
  name: string;
}

const CreateOwnGroup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    groupName: "",
    description: "",
    image: null,
    parentGroup: "",
    tags: [],
    privacy: "public",
  });
  const [newTag, setNewTag] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Mock parent groups - replace with actual data
  const parentGroups: ParentGroup[] = [
    { id: "1", name: "Technology" },
    { id: "2", name: "Sports" },
    { id: "3", name: "Arts & Culture" },
    { id: "4", name: "Education" },
    { id: "5", name: "Business" },
    { id: "6", name: "Health & Wellness" },
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.groupName.trim() ||
      !formData.description.trim() ||
      !formData.parentGroup
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Handle form submission here
    console.log("Group data:", formData);
    // Reset form
    setFormData({
      groupName: "",
      description: "",
      image: null,
      parentGroup: "",
      tags: [],
      privacy: "public",
    });
    setImagePreview(null);
    setShowForm(false);
  };

  const handleTagKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-6xl font-extrabold leading-tight">
              BUILD YOUR COMMUNITY
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Do you have a great idea to be a part of our community? Create a
              group to connect with others—your community starts here!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3 text-lg"
            >
              <Plus className="w-6 h-6" />
              Start a New Group
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">Create Your Own Group</h2>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Group Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Group Name *
                      </label>
                      <input
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleInputChange}
                        placeholder="Enter your group name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe what your group is about, its goals, and who should join..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-gray-700"
                      />
                    </div>

                    {/* Parent Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Parent Category *
                      </label>
                      <select
                        name="parentGroup"
                        value={formData.parentGroup}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700"
                      >
                        <option value="">Select a category</option>
                        {parentGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Privacy Settings */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Privacy Setting
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                          <input
                            type="radio"
                            name="privacy"
                            value="public"
                            checked={formData.privacy === "public"}
                            onChange={handleInputChange}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-semibold text-gray-700">
                              Public
                            </div>
                            <div className="text-sm text-gray-500">
                              Anyone can join
                            </div>
                          </div>
                        </label>
                        <label className="relative flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                          <input
                            type="radio"
                            name="privacy"
                            value="private"
                            checked={formData.privacy === "private"}
                            onChange={handleInputChange}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-semibold text-gray-700">
                              Private
                            </div>
                            <div className="text-sm text-gray-500">
                              Requires approval
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Group Image
                      </label>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="group-image"
                        />
                        <label
                          htmlFor="group-image"
                          className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                        >
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <span className="text-gray-600 font-medium">
                            Click to upload group image
                          </span>
                          <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG up to 5MB
                          </p>
                        </label>
                        {imagePreview && (
                          <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          onKeyPress={handleTagKeyPress}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                          <Tag className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-all duration-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                  >
                    <Users className="w-6 h-6" />
                    Create Group
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CreateOwnGroup;
