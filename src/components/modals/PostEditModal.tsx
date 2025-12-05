import { useEffect, useState } from "react";
import { PostDetails } from "@/types/adda/posts";
import { resetUpdateState, updatePostThunk } from "@/redux/adda/postSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

interface PostEditModalProps {
  post: PostDetails;
  onClose: () => void;
  setPost: (updatedPost: PostDetails | null) => void;
}

const PostEditModal = ({ post, onClose, setPost }: PostEditModalProps) => {
  const dispatch = useAppDispatch();
  const {
    status,
    post: updatedPost,
    error,
  } = useAppSelector((state) => state.posts);
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [articleBody, setArticleBody] = useState(post.article?.body || "");
  const [tags, setTags] = useState(post.tags?.join(", ") || "");
  const [caption, setCaption] = useState<string>(
    post.media && post.media.length > 0 ? post.media[0].caption ?? "" : ""
  );

  const { getToken } = useAuth();

  const [eventData, setEventData] = useState({
    description: post.event?.description || "",
    venue: post.event?.venue || "",
  });

  useEffect(() => {
    if (status === "succeeded") {
      toast.success("Post updated");
      setPost(updatedPost);
      dispatch(resetUpdateState());
      onClose();
    }
    if (error) {
      toast.error(error);
    }
  }, [dispatch, error, onClose, setPost, status, updatedPost]);

  const handleSave = async () => {
    const token = await getToken();

    dispatch(
      updatePostThunk({
        postId: post._id,
        token: token as string,
        data: {
          title,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0),
          ...(post.postType === "article"
            ? { article: { body: articleBody } }
            : {}),

          media: post.media?.map((m, i) => ({
            ...m,
            caption: i === 0 ? caption : m.caption,
          })),
        },
      })
    );
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[600px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold mb-3">Edit the post</h3>

        {post.postType == "article" && (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 text-xl font-bold text-gray-800 capitalize border-b border-gray-300 outline-none"
          />
        )}

        {post.postType == "article" ? (
          <textarea
            value={articleBody}
            onChange={(e) => setArticleBody(e.target.value)}
            className="w-full mb-4 font-medium text-gray-700 border border-gray-300 rounded p-2"
            rows={5}
          />
        ) : post.postType !== "event" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mb-4 text-gray-700 border border-gray-300 rounded p-2"
            rows={4}
          />
        ) : null}

        {post.media && post.media.length > 0 && (
          <div className="border border-orange-200 rounded-lg p-2 mb-4">
            {post.media?.map((item, index) => (
              <div key={index} className="mb-2 overflow-hidden rounded-lg">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.caption || `Media ${index + 1}`}
                    className="w-72 object-cover max-h-96"
                  />
                ) : (
                  <video src={item.url} controls className="w-72 max-h-96" />
                )}

                {/* Caption only for NORMAL POSTS */}
                {post.postType !== "article" &&
                  post.postType !== "event" &&
                  item.caption && (
                    <textarea
                      onChange={(e) => setCaption(e.target.value)}
                      defaultValue={caption}
                      className="mt-1 w-full text-sm italic text-gray-600 border border-gray-300 rounded p-1"
                    />
                  )}
              </div>
            ))}
          </div>
        )}

        {post.postType === "event" && post.event && (
          <div className="p-4 mb-4 border border-orange-200 rounded-lg bg-orange-50">
            {post.media && post.media.length > 0 && (
              <img
                src={post.media[0].url}
                alt="Event cover"
                className="w-72 mb-4 rounded-lg max-h-96 object-cover"
              />
            )}

            <p className="font-semibold mb-1">
              📅 {formatDate(post.event.startDate)}
              {post.event.endDate && ` → ${formatDate(post.event.endDate)}`}
            </p>

            <input
              value={eventData.venue}
              onChange={(e) =>
                setEventData({ ...eventData, venue: e.target.value })
              }
              className="w-full font-semibold border-b border-gray-300 outline-none mb-2"
            />

            <textarea
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded p-2"
              rows={3}
            />
          </div>
        )}

        {!post.article && post.postType !== "event" && (
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm"
            placeholder="tag1, tag2, tag3"
          />
        )}

        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="py-2 px-3 bg-gray-300 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-2 px-3 bg-orange-500 text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEditModal;
