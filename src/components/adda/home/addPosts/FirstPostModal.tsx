import React from "react";

interface FirstPostModalProps {
  onClose: () => void;
  postType?: "text" | "photo" | "video" | "article" | "event" | null;
  onCreateNewPost?: () => void;
}

const FirstPostModal: React.FC<FirstPostModalProps> = ({
  onClose,
  postType,
  onCreateNewPost,
}) => {
  // Get post type specific message
  const getPostTypeMessage = () => {
    switch (postType) {
      case "text":
        return "Your thoughts are valuable! Keep sharing your insights with the community.";
      case "photo":
        return "Pictures speak a thousand words! Your visual content enriches our community.";
      case "video":
        return "Great video content! Visual stories have a powerful impact on our community.";
      case "article":
        return "Your article is live! Detailed content like yours helps educate our community.";
      case "event":
        return "Event shared successfully! Bringing people together creates stronger bonds.";
      default:
        return "Keep sharing your wonderful ideas with us!";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl animate-fadeIn">
        <div className="flex items-center justify-center w-full rounded-full">
          <img
            src="/assets/first_post_modal.png"
            alt="Congratulations"
            className="object-cover w-full "
          />
        </div>

        <div className="w-full mb-6">
          <h2 className="mb-2 text-2xl font-bold text-center text-gray-800">
            Congratulations On Your First Blog Post!
          </h2>
          <div className="w-16 h-1 mx-auto mb-4 bg-orange-500"></div>
          <p className="text-center text-gray-600">
            Hooray! You have earned 8 points for creating a brand new post!
          </p>
          <p className="mt-2 font-medium text-center text-gray-600">
            {getPostTypeMessage()}
          </p>
        </div>

        <div className="flex w-full gap-4">
          <button
            className="flex-1 py-3 font-semibold text-gray-700 transition bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="flex-1 py-3 font-semibold text-white transition bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
            onClick={onCreateNewPost || onClose}
          >
            Create New Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstPostModal;
