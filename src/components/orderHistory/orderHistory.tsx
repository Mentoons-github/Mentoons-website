import { useState } from "react";

interface OrderItem {
  orderId: string;
  title: string;
  sampleProduct: string;
  price: number;
  purchasedAt: string;
  status: "Completed" | "Pending" | "Cancelled";
  isDownloaded: boolean;
  hasReviewed: boolean;
  imageUrl: string;
}

const orderedItems: OrderItem[] = [
  {
    orderId: "order-101",
    title: "Conversation Starter Cards",
    sampleProduct: "product 1",
    price: 199,
    purchasedAt: "2025-06-07T10:15:00Z",
    status: "Completed",
    isDownloaded: false,
    hasReviewed: false,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    orderId: "order-102",
    title: "Story Re-teller Cards",
    sampleProduct: "product 2",
    price: 199,
    purchasedAt: "2025-06-06T18:30:00Z",
    status: "Completed",
    isDownloaded: true,
    hasReviewed: true,
    imageUrl: "https://placehold.co/600x400",
  },
  {
    orderId: "order-103",
    title: "Silent Stories",
    sampleProduct: "product 3",
    price: 199,
    purchasedAt: "2025-06-05T20:00:00Z",
    status: "Completed",
    isDownloaded: false,
    hasReviewed: false,
    imageUrl: "https://placehold.co/600x400",
  },
];

interface StatusBadgeProps {
  status: "Completed" | "Pending" | "Cancelled";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles: { [key in StatusBadgeProps["status"]]: string } = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: {
    orderId: string;
    rating: number;
    comment: string;
  }) => void;
  orderId: string | null;
  productTitle: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  orderId,
  productTitle,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    if (orderId) {
      onSubmit({ orderId, rating, comment });
    }
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="review-modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 id="review-modal-title" className="text-xl font-semibold mb-4">
          Write a Review for {productTitle}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="review-comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4}
              placeholder="Share your thoughts about the product..."
              aria-describedby="review-comment-description"
            />
            <p
              id="review-comment-description"
              className="text-sm text-gray-500 mt-1"
            >
              Your feedback helps us improve our products.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderedItems: React.FC = () => {
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    productTitle: string;
  }>({
    isOpen: false,
    orderId: null,
    productTitle: "",
  });

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle download button click
  const handleDownload = async (
    url: string,
    isDownloaded: boolean,
    orderId: string
  ) => {
    if (isDownloaded) {
      alert(`Order ${orderId} has already been downloaded.`);
      return;
    }

    setDownloading((prev) => ({ ...prev, [orderId]: true }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.open(url, "_blank");
      console.log(`Downloading from ${url}`);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to initiate download. Please try again.");
    } finally {
      setDownloading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // Handle review submission
  const handleReviewSubmit = (review: {
    orderId: string;
    rating: number;
    comment: string;
  }) => {
    console.log(`Review submitted for ${review.orderId}:`, {
      rating: review.rating,
      comment: review.comment,
    });
    // In a real app, update hasReviewed via backend API
  };

  // Open review modal
  const openReviewModal = (orderId: string, productTitle: string) => {
    setReviewModal({ isOpen: true, orderId, productTitle });
  };

  // Close review modal
  const closeReviewModal = () => {
    setReviewModal({ isOpen: false, orderId: null, productTitle: "" });
  };

  // Fallback image
  const FALLBACK_IMAGE = "https://via.placeholder.com/150?text=Product+Image";

  return (
    <div className="flex flex-col justify-center items-center p-6 w-full">
      <div className="max-w-7xl w-full space-y-6">
        {orderedItems.map((item) => (
          <div
            key={item.orderId}
            className="flex flex-col md:flex-row items-start bg-white shadow-md rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            role="region"
            aria-labelledby={`order-${item.orderId}`}
          >
            {/* Product Image */}
            <div className="w-full md:w-32 flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                src={item.imageUrl || FALLBACK_IMAGE}
                alt={`${item.title} product image`}
                className="w-full h-32 object-cover rounded-md"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            {/* Order Details */}
            <div className="flex flex-col flex-grow space-y-2">
              <h3
                id={`order-${item.orderId}`}
                className="text-lg font-semibold text-gray-900"
              >
                Order ID: <span className="text-blue-600">#{item.orderId}</span>
              </h3>
              <p className="text-base text-gray-700">
                {item.sampleProduct}: {item.title}
              </p>
              <p className="text-sm text-gray-500">
                Purchased: {formatDate(item.purchasedAt)}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Status:</span>
                <StatusBadge status={item.status} />
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-start md:items-end space-y-2 mt-4 md:mt-0">
              <span className="text-lg font-medium text-gray-900">
                ₹{item.price}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleDownload(
                      "https://example.com/download",
                      item.isDownloaded,
                      item.orderId
                    )
                  }
                  className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
                    item.isDownloaded || downloading[item.orderId]
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={item.isDownloaded || downloading[item.orderId]}
                  aria-label={
                    item.isDownloaded
                      ? `Order ${item.orderId} already downloaded`
                      : `Download order ${item.orderId}`
                  }
                >
                  {downloading[item.orderId]
                    ? "Downloading..."
                    : item.isDownloaded
                    ? "Downloaded"
                    : "Download"}
                </button>
                {item.status === "Completed" && !item.hasReviewed && (
                  <button
                    onClick={() => openReviewModal(item.orderId, item.title)}
                    className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                    aria-label={`Write a review for order ${item.orderId}`}
                  >
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        onSubmit={handleReviewSubmit}
        orderId={reviewModal.orderId}
        productTitle={reviewModal.productTitle}
      />
    </div>
  );
};

export default OrderedItems;
