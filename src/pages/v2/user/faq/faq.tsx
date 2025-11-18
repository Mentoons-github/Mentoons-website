import EnquiryModal from "@/components/modals/EnquiryModal";
import useInView from "@/hooks/useInView";
import { ModalMessage } from "@/utils/enum";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MdMessage } from "react-icons/md";

import ErrorModal from "@/components/adda/modal/error";

const FAQ = ({ data }: { data: object }) => {
  const { isInView, ref } = useInView(0.3, false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const queryType = "general";
  const [userDetails, setUserDetails] = useState<any>(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleDoubtSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim().length < 50) {
      setShowErrorModal(true);
      setShowErrorMessage("Message must be at least 50 characters long.");
      return;
    }

    try {
      const currentUrl = window.location.pathname;
      let dynamicQueryType = "general";

      if (currentUrl.includes("workshop")) {
        dynamicQueryType = "workshop";
      } else if (currentUrl.includes("assessment")) {
        dynamicQueryType = "assessment";
      } else if (currentUrl.includes("comic")) {
        dynamicQueryType = "comic";
      } else if (currentUrl.includes("product")) {
        dynamicQueryType = "product";
      }

      const finalQueryType =
        queryType !== "general" ? queryType : dynamicQueryType;
      const queryResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/query`,
        // "http://localhost:4000/api/v1/query",
        {
          message: message,
          name: name,
          email: email,
          queryType: finalQueryType,
        }
      );
      if (queryResponse.status === 201) {
        setMessage("");
        setShowEnquiryModal(true);
      }
    } catch (error: any) {
      setMessage("");
      setShowErrorModal(true);
      setShowErrorMessage(
        error?.response?.data?.message || "Failed to submit message"
      );
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/${user?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch user details");
      }
      setUserDetails(response.data.data);
    };
    fetchUserDetails();
  }, [user?.id]);

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setEmail(userDetails.email || "");
    }
  }, [userDetails]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="h-auto px-4 py-8 sm:px-8 md:px-12 lg:px-20 sm:py-10 md:py-15"
    >
      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-start font-medium text-2xl sm:text-3xl md:text-4xl tracking-[-1px]"
      >
        Frequently Asked Questions
      </motion.h1>

      <div className="flex flex-col w-full gap-6 mt-6 lg:flex-row lg:gap-10 sm:mt-10">
        <div className="flex flex-col w-full gap-4 lg:w-3/5 sm:gap-5">
          {Object.entries(data).map(([question, answer], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full overflow-hidden bg-white border border-gray-400 rounded-lg shadow-md font-manrope"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-3 sm:p-4 bg-white font-extrabold text-[12px] sm:text-lg md:text-xl transition-all hover:bg-gray-100"
              >
                <span className="pr-2 text-left">{question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0 text-xl font-bold"
                >
                  {openIndex === index ? "−" : "+"}
                </motion.span>
              </button>
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={
                  openIndex === index
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-3 sm:px-4 pb-3 sm:pb-4 font-medium text-[11px] sm:text-lg md:text-[20px]"
              >
                {answer}
              </motion.p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center flex-shrink-0 w-full gap-3 p-5 mt-6 bg-white shadow-lg sm:gap-4 lg:w-2/5 sm:p-8 rounded-xl lg:mt-0"
        >
          <MdMessage className="text-4xl text-black sm:text-5xl" />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl font-semibold text-center text-black sm:text-2xl"
          >
            Have Doubts? We are here to help you!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm leading-relaxed text-center text-black sm:text-base"
          >
            Contact us for additional help regarding your assessment or
            purchase. Our team is ready to assist you!
          </motion.p>
          <form
            onSubmit={handleDoubtSubmission}
            className="flex flex-col w-full gap-3"
          >
            <motion.div className="flex flex-col w-full gap-3 sm:flex-row">
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 transition border border-black outline-none sm:p-4 rounded-3xl focus:ring-2 focus:ring-blue-400"
                placeholder="Your Name"
              />
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 transition border border-black outline-none sm:p-4 rounded-3xl focus:ring-2 focus:ring-blue-400"
                placeholder="Your Email"
              />
            </motion.div>
            <motion.textarea
              required
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 transition border border-black outline-none sm:p-4 rounded-3xl focus:ring-2 focus:ring-blue-400"
              placeholder="Ask Your Query here..."
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 text-base font-medium transition-all bg-yellow-400 rounded-lg sm:py-3 sm:text-lg hover:bg-yellow-300 focus:ring-2 focus:ring-blue-300"
              type="submit"
            >
              Submit
            </motion.button>
          </form>
        </motion.div>
      </div>
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          message={ModalMessage.ENQUIRY_MESSAGE}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          heading="Faild to submit query"
          error={showErrorMessage}
          isOpen={showErrorModal}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </motion.section>
  );
};

export default FAQ;
