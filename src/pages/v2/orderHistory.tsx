import OrderedItems from "@/components/orderHistory/orderHistory";
import { motion } from "framer-motion";
import { MdHistory } from "react-icons/md";

const OrderHistory = () => {
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
        ease: [0.22, 1, 0.36, 1],
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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8"
          variants={titleVariants}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MdHistory className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Order History
            </h1>
          </div>
          <p className="text-gray-600 text-lg ml-14">
            Track and manage all your purchases
          </p>
        </motion.div>

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <OrderedItems />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderHistory;
