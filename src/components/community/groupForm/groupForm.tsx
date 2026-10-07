import { Tag, X } from "lucide-react";
import "./groupForm.css";
import { FormData } from "@/pages/v2/community/community";

interface ParentGroup {
  id: string;
  name: string;
}

interface GroupFormModalProps {
  showForm: boolean;
  setShowForm: (open: boolean) => void;
  formData: FormData;
  imagePreview: string | null;
  newTag: string;
  isFormValid: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onTagKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onUpdateNewTag: (value: string) => void;
  onSubmit: () => void;
  parentGroups: ParentGroup[];
}

const EMOJI_PALETTE = [
  "🌈",
  "⭐",
  "🎉",
  "🦄",
  "🐾",
  "🍭",
  "🚀",
  "🎨",
  "🌸",
  "🎮",
];

const GroupFormModal = ({
  showForm,
  setShowForm,
  formData,
  imagePreview,
  newTag,
  isFormValid,
  onInputChange,
  onImageUpload,
  onAddTag,
  onRemoveTag,
  onTagKeyPress,
  onUpdateNewTag,
  onSubmit,
  parentGroups,
}: GroupFormModalProps) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm animate-fadeIn p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden animate-bounceIn relative border-4 border-blue-300">
        {/* Confetti row — updated to blue tones */}
        <div className="confetti-row" aria-hidden>
          {[
            "#1D4ED8",
            "#3B82F6",
            "#60A5FA",
            "#93C5FD",
            "#2563EB",
            "#1E40AF",
            "#1D4ED8",
            "#3B82F6",
            "#60A5FA",
            "#93C5FD",
            "#2563EB",
            "#1E40AF",
          ].map((c, i) => (
            <span key={i} style={{ background: c }} className="confetti-dot" />
          ))}
        </div>

        {/* Header — blue gradient replacing pink/purple/blue */}
        <div
          className="relative px-6 pt-6 pb-5 text-center"
          style={{
            background:
              "linear-gradient(135deg, #1E40AF 0%, #2563EB 40%, #60A5FA 100%)",
          }}
        >
          <span className="absolute top-3 left-6 text-2xl animate-wiggle">
            ⭐
          </span>
          <span
            className="absolute top-2 right-8 text-xl animate-wiggle"
            style={{ animationDelay: "0.3s" }}
          >
            ✨
          </span>
          <span
            className="absolute bottom-3 left-16 text-lg animate-wiggle"
            style={{ animationDelay: "0.6s" }}
          >
            🌟
          </span>

          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-4xl animate-bounce-slow">🎉</span>
            <h2
              className="text-2xl font-black text-white drop-shadow-md"
              style={{
                fontFamily: "'Fredoka One', 'Nunito', cursive",
                letterSpacing: "0.02em",
              }}
            >
              Make Your Own Community!
            </h2>
            <span
              className="text-4xl animate-bounce-slow"
              style={{ animationDelay: "0.2s" }}
            >
              🦄
            </span>
          </div>
          <p
            className="text-white/90 text-sm font-semibold"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Fill in the fun stuff below 👇
          </p>

          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-all duration-200 hover:rotate-90"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — very light blue tint instead of warm cream */}
        <div
          className="overflow-y-auto max-h-[calc(95vh-180px)] p-6"
          style={{ background: "#F0F6FF" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="fun-card">
                <label className="fun-label">
                  🏷️ Community Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={onInputChange}
                  placeholder="e.g. Dino Explorers 🦕"
                  className="fun-input"
                  required
                />
              </div>

              <div className="fun-card">
                <label className="fun-label">
                  📝 What's your community about?{" "}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onInputChange}
                  placeholder="Tell everyone what makes your community super awesome! 🌟"
                  rows={3}
                  className="fun-input resize-none"
                  required
                />
              </div>

              <div className="fun-card">
                <label className="fun-label">
                  🗂️ Pick a Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="parentGroup"
                  value={formData.parentGroup}
                  onChange={onInputChange}
                  className="fun-input"
                  required
                >
                  <option value="">Choose one! 👇</option>
                  {parentGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fun-card">
                <label className="fun-label">🔐 Who can join?</label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {(
                    [
                      {
                        val: "public",
                        emoji: "🌍",
                        label: "Everyone!",
                        sub: "Open to all friends",
                      },
                      {
                        val: "private",
                        emoji: "🔒",
                        label: "Secret Community",
                        sub: "Invite only",
                      },
                    ] as const
                  ).map(({ val, emoji, label, sub }) => (
                    <label
                      key={val}
                      className={`privacy-option ${formData.privacy === val ? "privacy-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="privacy"
                        value={val}
                        checked={formData.privacy === val}
                        onChange={onInputChange}
                        className="sr-only"
                      />
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <div className="font-black text-sm text-gray-700">
                          {label}
                        </div>
                        <div className="text-xs text-gray-500">{sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="fun-card">
                <label className="fun-label">🖼️ Community Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                  id="group-image-upload"
                />
                <label
                  htmlFor="group-image-upload"
                  className="upload-zone group"
                >
                  <span className="text-4xl mb-2 group-hover:animate-wiggle inline-block">
                    📸
                  </span>
                  <span className="font-bold text-blue-600 text-sm">
                    Tap to add a picture!
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG or JPG, up to 5MB
                  </span>
                </label>

                {imagePreview && (
                  <div className="flex justify-center mt-3">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-blue-300 shadow-lg animate-pop">
                      <img
                        src={imagePreview}
                        alt="Community preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="fun-card">
                <label className="fun-label">🏷️ Cool Tags</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => onUpdateNewTag(e.target.value)}
                    onKeyPress={onTagKeyPress}
                    placeholder="Add a fun tag! 🎯"
                    className="fun-input flex-1"
                  />
                  <button
                    type="button"
                    onClick={onAddTag}
                    className="add-tag-btn"
                    aria-label="Add tag"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>

                {formData?.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData?.tags?.map((tag, i) => (
                      <span
                        key={tag}
                        className="tag-chip animate-pop"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        {EMOJI_PALETTE[i % EMOJI_PALETTE.length]} {tag}
                        <button
                          onClick={() => onRemoveTag(tag)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-all"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {formData && formData.tags && formData.tags.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    No tags yet — add some! ✨
                  </p>
                )}
              </div>

              {/* Tip box — blue tint instead of yellow */}
              <div className="tip-box">
                <span className="text-xl">💡</span>
                <p className="text-xs text-blue-800 font-semibold">
                  <strong>Pro tip:</strong> Give your community a cool name and
                  describe what awesome things you'll do together!
                </p>
              </div>
            </div>
          </div>

          {/* Footer buttons — dashed border updated to blue */}
          <div className="flex gap-3 pt-6 mt-6 border-t-2 border-dashed border-blue-300">
            <button
              onClick={onSubmit}
              disabled={!isFormValid}
              className={`create-btn flex-1 ${isFormValid ? "create-btn-active" : "create-btn-disabled"}`}
            >
              {isFormValid ? (
                <>🎉 Let's Go! Create My Community! 🚀</>
              ) : (
                <>✏️ Fill in the fields above first!</>
              )}
            </button>

            <button onClick={() => setShowForm(false)} className="cancel-btn">
              Maybe Later 👋
            </button>
          </div>
        </div>
      </div>

      <style>{`
       
      `}</style>
    </div>
  );
};

export default GroupFormModal;
