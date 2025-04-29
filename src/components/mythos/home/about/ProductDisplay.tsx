import { CardType, ProductType } from "@/utils/enum";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductDisplay = () => {
  const products = [
    {
      name: "Conversation Starter Cards",
      imageUrl: "/assets/mythos/about/mythos-conversation-starter-cards.png",
      url: `/product-page?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.CONVERSATION_STARTER_CARDS}#product`,
    },
    {
      name: "Story Re-teller Cards",
      imageUrl: "/assets/mythos/about/mythos-story-reteller-cards.png",
      url: `/product-page?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.STORY_RE_TELLER_CARD}#product`,
    },
    {
      name: "Silent Stories",
      imageUrl: "/assets/mythos/about/mythos-silent-stories.png",
      url: `/product-page?productType=${ProductType.MENTOONS_CARDS}&cardType=${CardType.SILENT_STORIES}#product`,
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="bg-[#E39712] p-3 sm:p-4 md:p-6 pb-8 sm:pb-10 md:pb-12 lg:pb-24">
      <motion.div
        className="flex flex-col items-start justify-between px-4 mt-6 sm:flex-row sm:items-center sm:pr-6 md:pr-12 sm:mt-8 md:mt-12 sm:px-6"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl font-semibold text-star text-[#1A1D3B] tracking-wide sm:tracking-widest sm:px-4 md:px-12 md:text-4xl lg:text-5xl flex leading-none mb-4 sm:mb-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          CHECK OUT OUR OTHER PRODUCTS
        </motion.h2>
        <motion.button
          className="flex items-center self-start gap-2 sm:self-auto"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            navigate("/product-page");
          }}
        >
          <span className="p-1 bg-black rounded-full">
            <img
              src="/assets/mythos/icons/star.png"
              alt="star-icon"
              className="w-3 h-3 sm:h-4 sm:w-4"
            />
          </span>
          <span className="text-sm sm:text-base">LEARN MORE</span>
        </motion.button>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between mt-8 sm:mt-10 md:mt-12 w-[95%] sm:w-[90%] mx-auto gap-4 sm:gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            className="flex flex-col items-center w-full sm:w-[30%] p-2 sm:p-4 transition-transform hover:scale-105 mb-6 sm:mb-0 cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            onClick={() => {
              navigate(product.url);
            }}
          >
            <motion.div
              className="flex items-center justify-center w-full h-48 p-1 mb-2 sm:h-56 md:h-72 lg:h-80 sm:mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 * (index + 1) }}
              viewport={{ once: true }}
            >
              <motion.img
                src={product.imageUrl}
                alt={product.name}
                className="object-contain w-full h-full max-w-[90%] hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 * (index + 1) }}
                viewport={{ once: true }}
              />
            </motion.div>
            <motion.h3
              className="text-base sm:text-lg md:text-xl font-semibold text-[#1A1D3B] text-center py-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 * (index + 1) }}
              viewport={{ once: true }}
            >
              {product.name}
            </motion.h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductDisplay;
