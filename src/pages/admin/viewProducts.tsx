import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaLanguage,
  FaMicrophone,
  FaStar,
  FaTag,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import {
  AssessmentProduct,
  AudioComicProduct,
  ComicProduct,
  MentoonsBookProduct,
  MentoonsCardProduct,
  MerchandiseProduct,
  PodcastProduct,
  ProductBase,
  ProductType,
  WorkshopProduct,
} from "@/types/admin";
import { errorToast } from "../../utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pulse = {
  scale: [1, 1.02, 1],
  transition: { duration: 0.3 },
};

const ViewProduct: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "media" | "pricing">(
    "details"
  );
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = await getToken();
        if (!token) toast.error("Please loginto continue");
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.data) {
          throw new Error("Failed to fetch product");
        }

        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        errorToast("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-2xl font-bold"
        >
          Product not found
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/product-table")}
          className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out bg-blue-500 rounded hover:bg-blue-700"
        >
          Back to Products
        </motion.button>
      </div>
    );
  }

  const renderFilePreview = (file: string, type: "sample" | "file") => {
    if (!file || file === " ")
      return <p className="text-gray-500">No {type} available</p>;

    const fileExtension = file.split(".").pop()?.toLowerCase();

    if (["mp3", "wav", "ogg"].includes(fileExtension || "")) {
      return (
        <motion.audio
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          controls
          className="w-full mt-2"
        >
          <source src={file} type={`audio/${fileExtension}`} />
          Your browser does not support the audio element.
        </motion.audio>
      );
    } else if (["mp4", "webm", "ogg"].includes(fileExtension || "")) {
      return (
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          controls
          className="w-full mt-2 rounded-lg max-h-64"
        >
          <source src={file} type={`video/${fileExtension}`} />
          Your browser does not support the video element.
        </motion.video>
      );
    } else if (fileExtension === "pdf") {
      return (
        <motion.embed
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={file}
          type="application/pdf"
          className="w-full h-64 mt-2 rounded-lg"
        />
      );
    } else {
      return (
        <motion.a
          whileHover={{ scale: 1.05 }}
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          View {type === "sample" ? "Sample" : "File"}
        </motion.a>
      );
    }
  };

  const renderGallery = () => {
    if (
      !product ||
      !product.productImages ||
      product.productImages.length === 0
    ) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg"
        >
          <span className="text-gray-500">No images available</span>
        </motion.div>
      );
    }

    return (
      <div className="space-y-4">
        <motion.div
          key={activeImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full overflow-hidden rounded-lg aspect-video bg-gray-50"
        >
          <img
            src={product.productImages[activeImageIndex].imageUrl}
            alt={`${product.title} - image ${activeImageIndex + 1}`}
            className="object-contain w-full h-full"
          />
        </motion.div>

        {product.productImages.length > 1 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex space-x-2 overflow-x-auto"
          >
            {product.productImages.map((image, index) => (
              <motion.button
                key={image._id}
                variants={fadeIn}
                whileHover={pulse}
                onClick={() => setActiveImageIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-md border-2 ${
                  index === activeImageIndex
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </motion.button>
            ))}
          </motion.div>
        )}

        {product.productVideos && product.productVideos.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-6"
          >
            <motion.h3 variants={fadeIn} className="mb-2 text-lg font-medium">
              Videos
            </motion.h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {product.productVideos.map((video, index) => (
                <motion.div
                  key={video._id || index}
                  variants={fadeIn}
                  className="relative overflow-hidden rounded-lg aspect-video bg-gray-50"
                >
                  <video
                    controls
                    className="object-cover w-full h-full"
                    src={video.videoUrl}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderProductTypeDetails = () => {
    if (!product || !product.details) return null;

    const DetailItem = ({
      icon,
      label,
      value,
    }: {
      icon: React.ReactNode;
      label: string;
      value: React.ReactNode;
    }) => (
      <motion.div
        variants={fadeIn}
        className="flex items-center p-4 bg-white rounded-lg shadow-sm"
      >
        <div className="mr-3 text-blue-500">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="font-semibold text-gray-900">{value}</p>
        </div>
      </motion.div>
    );

    switch (product.type) {
      case ProductType.COMIC: {
        const comicDetails = product.details as ComicProduct["details"];
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {comicDetails.author && (
              <DetailItem
                icon={<FaUser />}
                label="Author"
                value={comicDetails.author}
              />
            )}
            {comicDetails.publisher && (
              <DetailItem
                icon={<FaBook />}
                label="Publisher"
                value={comicDetails.publisher}
              />
            )}
            {comicDetails.pages && (
              <DetailItem
                icon={<FaBook />}
                label="Pages"
                value={comicDetails.pages}
              />
            )}
            {comicDetails.language && (
              <DetailItem
                icon={<FaLanguage />}
                label="Language"
                value={comicDetails.language}
              />
            )}
            {comicDetails.releaseDate && (
              <DetailItem
                icon={<FaCalendarAlt />}
                label="Release Date"
                value={new Date(comicDetails.releaseDate).toLocaleDateString()}
              />
            )}
            {comicDetails.series && (
              <DetailItem
                icon={<FaTag />}
                label="Series"
                value={comicDetails.series}
              />
            )}
            {comicDetails.sampleUrl && (
              <motion.div variants={fadeIn} className="mt-4 col-span-full">
                <h3 className="mb-2 text-lg font-medium">Sample Preview</h3>
                {renderFilePreview(comicDetails.sampleUrl, "sample")}
              </motion.div>
            )}
          </motion.div>
        );
      }

      case ProductType.AUDIO_COMIC: {
        const audioComicDetails =
          product.details as AudioComicProduct["details"];
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {audioComicDetails.narrator && (
              <DetailItem
                icon={<FaMicrophone />}
                label="Narrator"
                value={audioComicDetails.narrator}
              />
            )}
            {audioComicDetails.language && (
              <DetailItem
                icon={<FaLanguage />}
                label="Language"
                value={audioComicDetails.language}
              />
            )}
            {audioComicDetails.duration && (
              <DetailItem
                icon={<FaClock />}
                label="Duration"
                value={`${audioComicDetails.duration} seconds`}
              />
            )}
            {audioComicDetails.format && (
              <DetailItem
                icon={<FaTag />}
                label="Format"
                value={audioComicDetails.format}
              />
            )}
            {audioComicDetails.releaseDate && (
              <DetailItem
                icon={<FaCalendarAlt />}
                label="Release Date"
                value={new Date(
                  audioComicDetails.releaseDate
                ).toLocaleDateString()}
              />
            )}
            {audioComicDetails.sampleUrl && (
              <motion.div variants={fadeIn} className="mt-4 col-span-full">
                <h3 className="mb-2 text-lg font-medium">Sample Preview</h3>
                {renderFilePreview(audioComicDetails.sampleUrl, "sample")}
              </motion.div>
            )}
          </motion.div>
        );
      }

      case ProductType.PODCAST: {
        const podcastDetails = product.details as PodcastProduct["details"];
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {podcastDetails.host && (
              <DetailItem
                icon={<FaMicrophone />}
                label="Host"
                value={podcastDetails.host}
              />
            )}
            {podcastDetails.category && (
              <DetailItem
                icon={<FaTag />}
                label="Category"
                value={podcastDetails.category}
              />
            )}
            {podcastDetails.episodeNumber && (
              <DetailItem
                icon={<FaTag />}
                label="Episode"
                value={podcastDetails.episodeNumber}
              />
            )}
            {podcastDetails.duration && (
              <DetailItem
                icon={<FaClock />}
                label="Duration"
                value={`${podcastDetails.duration} minutes`}
              />
            )}
            {podcastDetails.language && (
              <DetailItem
                icon={<FaLanguage />}
                label="Language"
                value={podcastDetails.language}
              />
            )}
            {podcastDetails.releaseDate && (
              <DetailItem
                icon={<FaCalendarAlt />}
                label="Release Date"
                value={new Date(
                  podcastDetails.releaseDate
                ).toLocaleDateString()}
              />
            )}
            {podcastDetails.sampleUrl && (
              <motion.div variants={fadeIn} className="mt-4 col-span-full">
                <h3 className="mb-2 text-lg font-medium">Sample Preview</h3>
                {renderFilePreview(podcastDetails.sampleUrl, "sample")}
              </motion.div>
            )}
          </motion.div>
        );
      }

      case ProductType.ASSESSMENT: {
        const assessmentDetails =
          product.details as AssessmentProduct["details"];
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {assessmentDetails.duration && (
                <DetailItem
                  icon={<FaClock />}
                  label="Duration"
                  value={`${assessmentDetails.duration} minutes`}
                />
              )}
              {assessmentDetails.difficulty && (
                <DetailItem
                  icon={<FaTag />}
                  label="Difficulty"
                  value={assessmentDetails.difficulty}
                />
              )}
              {assessmentDetails.credits && (
                <DetailItem
                  icon={<FaUser />}
                  label="Credits"
                  value={assessmentDetails.credits}
                />
              )}
              {assessmentDetails.color && (
                <DetailItem
                  icon={
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: assessmentDetails.color }}
                    ></div>
                  }
                  label="Color Theme"
                  value={assessmentDetails.color}
                />
              )}
            </div>

            {assessmentDetails.questionGallery &&
              assessmentDetails.questionGallery.length > 0 && (
                <motion.div variants={fadeIn} className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold">
                    Question Gallery
                  </h3>
                  <p className="mb-4 text-gray-600">
                    This assessment contains{" "}
                    {assessmentDetails.questionGallery.length} questions
                  </p>

                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {assessmentDetails.questionGallery.map((question, idx) => (
                      <motion.div
                        key={question._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: idx * 0.1 },
                        }}
                        className="p-4 overflow-hidden border rounded-lg"
                      >
                        {question.imageUrl && (
                          <img
                            src={question.imageUrl}
                            alt={`Question ${idx + 1}`}
                            className="object-cover w-full mb-4 rounded h-36"
                          />
                        )}
                        <div className="space-y-2">
                          <h4 className="font-medium">Question {idx + 1}</h4>
                          <div className="space-y-1">
                            {question.options.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                className={`p-2 rounded ${
                                  option === question.correctAnswer
                                    ? "bg-green-100 border border-green-200"
                                    : "bg-gray-50"
                                }`}
                              >
                                {option}
                                {option === question.correctAnswer && (
                                  <span className="ml-2 text-xs font-medium text-green-500">
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
          </motion.div>
        );
      }

      case ProductType.MENTOONS_CARDS: {
        // This is a special case as details is an array
        const cardsDetails =
          product.details as unknown as MentoonsCardProduct["details"];
        if (!Array.isArray(cardsDetails)) return null;

        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {cardsDetails.map((cardDetail, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="p-6 border rounded-lg shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <FaTag className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">
                    {cardDetail.cardType.charAt(0).toUpperCase() +
                      cardDetail.cardType.slice(1)}
                  </h3>
                </div>

                {cardDetail.accentColor && (
                  <div className="flex items-center mb-4">
                    <div
                      className="w-4 h-4 mr-2 rounded-full"
                      style={{ backgroundColor: cardDetail.accentColor }}
                    ></div>
                    <p className="font-medium">
                      Accent Color: {cardDetail.accentColor}
                    </p>
                  </div>
                )}

                {cardDetail.addressedIssues &&
                  cardDetail.addressedIssues.length > 0 && (
                    <div className="mb-6">
                      <h4 className="mb-3 text-base font-semibold">
                        Addressed Issues
                      </h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {cardDetail.addressedIssues.map((issue, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 border rounded-md"
                          >
                            <h5 className="mb-1 font-medium">{issue.title}</h5>
                            <p className="text-sm text-gray-600">
                              {issue.description}
                            </p>
                            {issue.issueIllustrationUrl && (
                              <img
                                src={issue.issueIllustrationUrl}
                                alt={issue.title}
                                className="object-cover w-full mt-2 rounded h-36"
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                {cardDetail.productDescription &&
                  cardDetail.productDescription.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-base font-semibold">
                        Product Description
                      </h4>
                      <div className="space-y-4">
                        {cardDetail.productDescription.map((desc, i) => (
                          <div key={i}>
                            <h5 className="font-medium">{desc.label}</h5>
                            <ul className="mt-2 space-y-2">
                              {desc.descriptionList.map((item) => (
                                <li key={item._id} className="flex items-start">
                                  <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-blue-500 rounded-full"></span>
                                  <span className="text-gray-700">
                                    {item.description}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </motion.div>
            ))}
          </motion.div>
        );
      }

      case ProductType.MENTOONS_BOOKS: {
        const bookDetails = product.details as MentoonsBookProduct["details"];
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {bookDetails.author && (
              <DetailItem
                icon={<FaUser />}
                label="Author"
                value={bookDetails.author}
              />
            )}
            {bookDetails.publisher && (
              <DetailItem
                icon={<FaBook />}
                label="Publisher"
                value={bookDetails.publisher}
              />
            )}
            {bookDetails.pages && (
              <DetailItem
                icon={<FaBook />}
                label="Pages"
                value={bookDetails.pages}
              />
            )}
            {bookDetails.language && (
              <DetailItem
                icon={<FaLanguage />}
                label="Language"
                value={bookDetails.language}
              />
            )}
            {bookDetails.releaseDate && (
              <DetailItem
                icon={<FaCalendarAlt />}
                label="Release Date"
                value={new Date(bookDetails.releaseDate).toLocaleDateString()}
              />
            )}
            {bookDetails.series && (
              <DetailItem
                icon={<FaTag />}
                label="Series"
                value={bookDetails.series}
              />
            )}
            {bookDetails.bookType && (
              <DetailItem
                icon={<FaTag />}
                label="Book Type"
                value={bookDetails.bookType}
              />
            )}
            {bookDetails.isbn && (
              <DetailItem
                icon={<FaTag />}
                label="ISBN"
                value={bookDetails.isbn}
              />
            )}
            {bookDetails.edition && (
              <DetailItem
                icon={<FaTag />}
                label="Edition"
                value={bookDetails.edition}
              />
            )}
          </motion.div>
        );
      }

      case ProductType.MERCHANDISE: {
        const merchDetails = product.details as MerchandiseProduct["details"];
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {merchDetails.brand && (
                <DetailItem
                  icon={<FaTag />}
                  label="Brand"
                  value={merchDetails.brand}
                />
              )}
              {merchDetails.material && (
                <DetailItem
                  icon={<FaTag />}
                  label="Material"
                  value={merchDetails.material}
                />
              )}
              {merchDetails.stockQuantity && (
                <DetailItem
                  icon={<FaTag />}
                  label="Stock Quantity"
                  value={`${merchDetails.stockQuantity} units`}
                />
              )}
              {merchDetails.price && (
                <DetailItem
                  icon={<FaDollarSign />}
                  label="Merchandise Price"
                  value={merchDetails.price}
                />
              )}
            </div>

            {merchDetails.sizes && merchDetails.sizes.length > 0 && (
              <motion.div variants={fadeIn} className="mt-4">
                <h3 className="mb-2 text-base font-medium">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {merchDetails.sizes.map((size, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                    >
                      {size}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {merchDetails.colors && merchDetails.colors.length > 0 && (
              <motion.div variants={fadeIn} className="mt-4">
                <h3 className="mb-2 text-base font-medium">Available Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {merchDetails.colors.map((color, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 border border-gray-200 rounded-full"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {merchDetails.careInstructions && (
              <motion.div
                variants={fadeIn}
                className="p-4 mt-4 rounded-lg bg-gray-50"
              >
                <h3 className="mb-2 text-base font-medium">
                  Care Instructions
                </h3>
                <p className="text-gray-700">{merchDetails.careInstructions}</p>
              </motion.div>
            )}
          </motion.div>
        );
      }

      case ProductType.WORKSHOP: {
        const workshopDetails = product.details as WorkshopProduct["details"];
        return (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workshopDetails.instructor && (
                <DetailItem
                  icon={<FaUser />}
                  label="Instructor"
                  value={workshopDetails.instructor}
                />
              )}
              {workshopDetails.location && (
                <DetailItem
                  icon={<FaTag />}
                  label="Location"
                  value={workshopDetails.location}
                />
              )}
              {workshopDetails.schedule && (
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label="Schedule"
                  value={new Date(workshopDetails.schedule).toLocaleString()}
                />
              )}
              {workshopDetails.duration && (
                <DetailItem
                  icon={<FaClock />}
                  label="Duration"
                  value={`${workshopDetails.duration} hours`}
                />
              )}
              {workshopDetails.capacity && (
                <DetailItem
                  icon={<FaUser />}
                  label="Capacity"
                  value={`${workshopDetails.capacity} participants`}
                />
              )}
            </div>

            {workshopDetails.materials &&
              workshopDetails.materials.length > 0 && (
                <motion.div variants={fadeIn} className="mt-4">
                  <h3 className="mb-2 text-base font-medium">Materials</h3>
                  <ul className="pl-5 space-y-1 list-disc">
                    {workshopDetails.materials.map((material, index) => (
                      <li key={index} className="text-gray-700">
                        {material}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

            {workshopDetails.workshopOffering &&
              workshopDetails.workshopOffering.length > 0 && (
                <motion.div variants={fadeIn} className="mt-6">
                  <h3 className="mb-3 text-base font-medium">
                    Workshop Offerings
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workshopDetails.workshopOffering.map((offering, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg"
                        style={{ borderColor: offering.accentColor }}
                      >
                        <h4
                          className="mb-2 font-medium"
                          style={{ color: offering.accentColor }}
                        >
                          {offering.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {offering.description}
                        </p>
                        {offering.imageUrl && (
                          <img
                            src={offering.imageUrl}
                            alt={offering.title}
                            className="object-cover w-full h-32 mt-2 rounded"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

            {workshopDetails.addressedIssues &&
              workshopDetails.addressedIssues.length > 0 && (
                <motion.div variants={fadeIn} className="mt-6">
                  <h3 className="mb-3 text-base font-medium">
                    Addressed Issues
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {workshopDetails.addressedIssues.map((issue, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg"
                      >
                        <h4 className="mb-1 font-medium">{issue.title}</h4>
                        <p className="text-sm text-gray-600">
                          {issue.description}
                        </p>
                        {issue.issueIllustrationUrl && (
                          <img
                            src={issue.issueIllustrationUrl}
                            alt={issue.title}
                            className="object-cover w-full h-32 mt-2 rounded"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
          </motion.div>
        );
      }

      default:
        return (
          <p className="text-gray-600">
            No specific details available for this product type.
          </p>
        );
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/admin/product-table")}
        className="flex items-center mb-6 text-blue-500 transition duration-300 ease-in-out hover:text-blue-700"
      >
        <FaArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden bg-white rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {/* Product Image Gallery - First Column */}
          <div className="p-6 md:col-span-1">{renderGallery()}</div>

          {/* Product Information - Second Column */}
          <div className="p-6 md:col-span-2 lg:col-span-3">
            {/* Product Type Badge & Status */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <motion.span
                whileHover={pulse}
                className="px-3 py-1 text-xs font-medium text-white uppercase bg-blue-500 rounded-full"
              >
                {product.type}
              </motion.span>

              {product.ageCategory && (
                <motion.span
                  whileHover={pulse}
                  className="px-3 py-1 text-xs font-medium text-white uppercase bg-green-500 rounded-full"
                >
                  Age: {product.ageCategory}
                </motion.span>
              )}

              {product.product_type && (
                <motion.span
                  whileHover={pulse}
                  className="px-3 py-1 text-xs font-medium text-white uppercase bg-purple-500 rounded-full"
                >
                  {product.product_type}
                </motion.span>
              )}

              {product.isFeatured && (
                <motion.span
                  whileHover={pulse}
                  className="px-3 py-1 text-xs font-medium text-white uppercase bg-yellow-500 rounded-full"
                >
                  Featured
                </motion.span>
              )}
            </div>

            {/* Product Title & Description */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-1 text-3xl font-bold text-gray-900"
            >
              {product.title}
            </motion.h1>

            {/* Product Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center mt-2 mb-4"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < product.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} out of 5
              </span>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-4 mb-6"
            >
              <span className="text-2xl font-bold text-gray-900">
                ₹{product.price}
              </span>
            </motion.div>

            {/* Description */}
            {product.description && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-6"
              >
                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </motion.div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-6"
              >
                <h2 className="mb-2 text-lg font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8"
            >
              <div className="flex border-b border-gray-200">
                <motion.button
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab("details")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "details"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Product Details
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab("media")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "media"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Media & Files
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab("pricing")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "pricing"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pricing & Metadata
                </motion.button>
              </div>

              <div className="pt-6">
                {activeTab === "details" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-4 text-xl font-semibold">
                      Product Specifications
                    </h2>
                    {renderProductTypeDetails()}
                  </motion.div>
                )}

                {activeTab === "media" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-4 text-xl font-semibold">
                      Media & Files
                    </h2>

                    {product.productImages &&
                      product.productImages.length > 0 && (
                        <div className="mb-6">
                          <h3 className="mb-2 text-lg font-medium">
                            Images ({product.productImages.length})
                          </h3>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {product.productImages.map((image, index) => (
                              <motion.div
                                key={image._id}
                                whileHover={{ scale: 1.05 }}
                                className="overflow-hidden rounded-lg aspect-square"
                              >
                                <img
                                  src={image.imageUrl}
                                  alt={`Product image ${index + 1}`}
                                  className="object-cover w-full h-full"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                    {product.productVideos &&
                      product.productVideos.length > 0 && (
                        <div className="mb-6">
                          <h3 className="mb-2 text-lg font-medium">
                            Videos ({product.productVideos.length})
                          </h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {product.productVideos.map((video, index) => (
                              <motion.div
                                key={video._id || index}
                                whileHover={{ scale: 1.02 }}
                                className="overflow-hidden rounded-lg aspect-video"
                              >
                                <video
                                  src={video.videoUrl}
                                  controls
                                  className="object-cover w-full h-full"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                    {product.orignalProductSrc && (
                      <div className="mb-6">
                        <h3 className="mb-2 text-lg font-medium">
                          Original Product File
                        </h3>
                        {renderFilePreview(product.orignalProductSrc, "file")}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "pricing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-4 text-xl font-semibold">
                      Pricing & Metadata
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <motion.div
                        variants={fadeIn}
                        className="p-4 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center mb-2">
                          <FaDollarSign className="mr-2 text-blue-500" />
                          <h3 className="text-lg font-semibold">Pricing</h3>
                        </div>
                        <p className="text-3xl font-bold">₹{product.price}</p>
                        {product.product_type && (
                          <p className="mt-2 text-gray-600">
                            Tier: {product.product_type}
                          </p>
                        )}
                      </motion.div>

                      <motion.div
                        variants={fadeIn}
                        className="p-4 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="mr-2 text-blue-500" />
                          <h3 className="text-lg font-semibold">Dates</h3>
                        </div>
                        {product.createdAt && (
                          <p className="text-gray-600">
                            Created:{" "}
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        )}
                        {product.updatedAt && (
                          <p className="text-gray-600">
                            Last Updated:{" "}
                            {new Date(product.updatedAt).toLocaleDateString()}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    {product._id && (
                      <motion.div
                        variants={fadeIn}
                        className="p-4 mt-4 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center mb-2">
                          <FaTag className="mr-2 text-blue-500" />
                          <h3 className="text-lg font-semibold">Product ID</h3>
                        </div>
                        <p className="p-2 font-mono text-sm bg-gray-100 rounded">
                          {product._id}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewProduct;
