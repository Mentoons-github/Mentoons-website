import { motion } from "framer-motion";
import OrderedItems from "@/components/orderHistory/orderHistory";

// Define the CSS for the animated background
const styles = `
  @keyframes slideGradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .animated-background {
    background: linear-gradient(
      45deg,
      #e0f2fe,
      #f3f4f6,
      #e5e7eb,
      #e0f2fe
    );
    background-size: 200% 200%;
    animation: slideGradient 15s ease infinite;
  }
`;

// Animation variants
const containerVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
      staggerChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
};

const OrderHistory = () => {
  return (
    <>
      <style>{styles}</style>
      <motion.div
        className="min-h-screen animated-background p-5"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-3xl font-bold font-inter text-start text-gray-900 mb-6"
          variants={titleVariants}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
        >
          Order History
        </motion.h1>

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <OrderedItems />
        </motion.div>
      </motion.div>
    </>
  );
};

export default OrderHistory;
