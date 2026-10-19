import { useEffect, useState, CSSProperties } from "react";
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

/* ---------- Comic inline styles (fonts from common css variables) ---------- */

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#fff8e1",
  backgroundImage: "radial-gradient(#00000014 1.2px, transparent 1.2px)",
  backgroundSize: "14px 14px",
  fontFamily: "var(--font-comic)",
};

const panelStyle: CSSProperties = {
  position: "relative",
  background: "#fff",
  border: "4px solid #111",
  borderRadius: "16px",
  boxShadow: "8px 8px 0 #111",
  padding: "2.5rem 1.5rem 1.5rem",
};

const stickerStyle: CSSProperties = {
  position: "absolute",
  top: "-22px",
  left: "20px",
  background: "#ffd23f",
  color: "#111",
  border: "3px solid #111",
  borderRadius: "8px",
  boxShadow: "4px 4px 0 #111",
  padding: "0.15rem 1rem",
  fontFamily: "var(--font-comic-chip)",
  fontSize: "1.5rem",
  letterSpacing: "0.06em",
  transform: "rotate(-3deg)",
};

const toastBase: CSSProperties = {
  fontFamily: "var(--font-comic)",
  fontSize: "1.1rem",
  letterSpacing: "0.05em",
  color: "#111",
  border: "3px solid #111",
  borderRadius: "10px",
  boxShadow: "4px 4px 0 #111",
};

const comicToast = {
  success: (msg?: string) =>
    toast.success(msg, { style: { ...toastBase, background: "#b6f2a1" } }),
  error: (msg?: string) =>
    toast.error(msg, { style: { ...toastBase, background: "#ff8b8b" } }),
};

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
      comicToast.error("OOPS! Failed to upload image");
      return;
    }
    const uploadedUrl = resultAction.payload.data.fileDetails?.url;
    setFormData((prev) => ({ ...prev, image: uploadedUrl }));
    comicToast.success("POW! File uploaded successfully");

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
      comicToast.error("HOLD ON! Please login");
      return;
    }

    console.log(formData);
    if (
      !formData.groupName.trim() ||
      !formData.description.trim() ||
      !formData.parentGroup
    ) {
      comicToast.error("WHOA! Please fill in all required fields");
      return;
    }

    const response = await createCommunity({ data: formData, token });

    if (!response.success) {
      comicToast.error("OOPS! Couldn't create Community. Please try again");
      return;
    }

    comicToast.success(response.data?.message);

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
    <div style={pageStyle}>
      <CommunityBanner />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "6rem",
        }}
      >
        <section style={panelStyle}>
          <span style={stickerStyle}>Groups</span>
          <GroupsSection
            groups={groups}
            loading={loading}
            error={error}
            refetch={fetchAllGroups}
          />
        </section>

        <section style={panelStyle}>
          <span style={stickerStyle}>Let's Revive!</span>
          <LetsRevive />
        </section>

        <section style={panelStyle}>
          <span style={stickerStyle}>Start Your Own</span>
          <CreateOwnGroup onOpenForm={() => setShowForm(true)} />
        </section>
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
    </div>
  );
};

export default Community;
