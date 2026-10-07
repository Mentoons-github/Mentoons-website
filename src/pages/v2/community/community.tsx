import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchGroups } from "@/redux/community/groupsThunk";
import CommunityBanner from "@/components/community/banner";
import GroupsSection from "@/components/community/groups";
import LetsRevive from "@/components/community/letsRevive/letsRevive";
import { useAuth } from "@clerk/clerk-react";
import CreateOwnGroup from "@/components/community/createGroup";
import GroupFormModal from "@/components/community/groupForm/groupForm";
import { createCommunity } from "@/api/groups/community";
import { uploadFile } from "@/redux/fileUploadSlice";
import { toast } from "sonner";

interface ParentGroup {
  id: string;
  name: string;
}

export interface FormData {
  groupName: string;
  description: string;
  image: string | null;
  parentGroup: string;
  tags?: string[];
  privacy: "public" | "private";
  subTitle?: string;
}

const parentGroups: ParentGroup[] = [
  { id: "technology", name: "Technology" },
  { id: "sports", name: "Sports" },
  { id: "arts&culture", name: "Arts & Culture" },
  { id: "education", name: "Education" },
  { id: "business", name: "Business" },
  { id: "health&wellness", name: "Health & Wellness" },
];

const Community = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: groups,
    error,
    loading,
  } = useSelector((state: RootState) => state.groups);
  const { getToken } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    groupName: "",
    description: "",
    image: null,
    parentGroup: "",
    tags: [],
    privacy: "public",
  });
  const [newTag, setNewTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchAllGroups = async () => {
    const token = await getToken();
    if (!token) return;
    await dispatch(fetchGroups(token));
  };

  useEffect(() => {
    fetchAllGroups();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resultAction = await dispatch(uploadFile({ file, getToken }));
    console.log(resultAction);

    if (!uploadFile.fulfilled.match(resultAction)) {
      toast.error("Failed to upload Image");
      return;
    }
    const uploadedUrl = resultAction.payload.data.fileDetails?.url;
    setFormData((prev) => ({ ...prev, image: uploadedUrl }));
    toast.success("File Uploaded successfully");

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !formData.tags?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), trimmed],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    const token = await getToken();
    if (!token) {
      toast.error("Please login");
      return;
    }

    console.log(formData);
    if (
      !formData.groupName.trim() ||
      !formData.description.trim() ||
      !formData.parentGroup
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const response = await createCommunity({ data: formData, token });

    if (!response.success) {
      toast.error("Couldn't create Community. Please try again");
      return;
    }

    toast.success(response.data?.message);

    setFormData({
      groupName: "",
      description: "",
      image: null,
      parentGroup: "",
      tags: [],
      privacy: "public",
    });
    setImagePreview(null);
    setNewTag("");
    setShowForm(false);

    fetchAllGroups();
  };

  const isFormValid =
    formData.groupName.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.parentGroup !== "";

  return (
    <>
      <CommunityBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10 space-y-20">
        <GroupsSection
          groups={groups}
          loading={loading}
          error={error}
          refetch={fetchAllGroups}
        />

        <LetsRevive />

        <CreateOwnGroup onOpenForm={() => setShowForm(true)} />
      </div>

      {showForm && (
        <GroupFormModal
          showForm={showForm}
          setShowForm={setShowForm}
          formData={formData}
          imagePreview={imagePreview}
          newTag={newTag}
          isFormValid={isFormValid}
          onInputChange={handleInputChange}
          onImageUpload={handleImageUpload}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onTagKeyPress={handleTagKeyPress}
          onUpdateNewTag={(value: string) => setNewTag(value)}
          onSubmit={handleSubmit}
          parentGroups={parentGroups}
        />
      )}
    </>
  );
};

export default Community;
