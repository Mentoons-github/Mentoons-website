import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaRegEnvelope, FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const KnowMoreAboutUs = () => {
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem("mythosFormData");
    return savedFormData
      ? JSON.parse(savedFormData)
      : {
          name: "",
          email: "",
          comment: "",
        };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("mythosFormData", JSON.stringify(formData));
    try {
      setIsLoading(true);
      console.log(formData);
      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/mythosComment`,
        formData
      );
      if (response.status === 200) {
        toast.success("Comment posted successfully");
        setIsLoading(false);
        setFormData({
          name: "",
          email: "",
          comment: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setIsLoading(false);
    } finally {
      setFormData({
        name: "",
        email: "",
        comment: "",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1D3B] bg-[url('/assets/mythos/background/section/stars_background.png')] bg-center p-4 md:p-6 pb-12 md:pb-24 flex items-center">
      <div className="w-[90%] mx-auto flex flex-col md:flex-row items-start justify-start gap-8 md:gap-12 pt-12">
        <motion.div
          className="w-full md:w-[50%] flex flex-col items-start justify-center px-4 md:px-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-2xl font-semibold text-[#E39712] text-start self-start md:text-5xl lg:text-6xl py-3 leading-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            KNOW MORE ABOUT US
          </motion.h2>
          <motion.p
            className="text-sm text-[#FEE898] py-6 md:py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Your email address will not be published. Required fields are marked
            *
          </motion.p>
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <textarea
              placeholder="Your Comment"
              className="w-full p-4 pr-12 active:ring-2 focus:ring-2 focus:ring-[#E39712] focus:outline-none"
              rows={5}
              name="comment"
              value={formData.comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            ></textarea>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 pr-12 active:ring-2 focus:ring-2 focus:ring-[#E39712] focus:outline-none"
                />
                <FaRegUser className="absolute w-6 transform -translate-y-1/2 right-4 top-1/2 text-[#E39712]" />
              </div>
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 pr-12 active:ring-2 focus:ring-2 focus:ring-[#E39712] focus:outline-none"
                />
                <FaRegEnvelope className="absolute w-6 transform -translate-y-1/2 right-4 top-1/2 text-[#E39712]" />
              </div>
            </div>
            <div className="flex items-center gap-4 mt-8 mb-4 md:mt-12">
              <input
                type="checkbox"
                checked={formData.saveData}
                onChange={handleChange}
              />
              <p className="text-sm text-[#FEE898]">
                Save my name, email, and website in this browser for the next
                time I comment
              </p>
            </div>
            <motion.button
              className="flex items-center justify-center gap-6 px-8 py-4 text-white bg-black md:px-12 w-fit"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-white border-solid rounded-full border-t-transparent animate-spin" />
              ) : (
                <img src="/assets/mythos/icons/star.png" className="w-6" />
              )}
              <p>{isLoading ? "POSTING..." : "POST COMMENT"}</p>
            </motion.button>
          </motion.form>
        </motion.div>
        <motion.div
          className="w-full md:w-[50%] flex flex-col gap-8 md:gap-10 items-center justify-between mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-[80%] md:w-[68%]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img
              src="/assets/mythos/about/mythos-book-call.png"
              className="w-full"
            />
          </motion.div>
          <motion.p
            className="text-2xl md:text-4xl font-semibold text-center text-[#E39712] w-full md:w-[20ch]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Book a one-on-one video call session with us now!
          </motion.p>
          <motion.button
            className="flex items-center justify-center gap-6 px-8 py-4 text-black bg-white md:px-12 w-fit"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigate("/bookings");
            }}
          >
            <img src="/assets/mythos/icons/star.png" className="w-6" />
            <p>BOOK A CALL NOW</p>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default KnowMoreAboutUs;
