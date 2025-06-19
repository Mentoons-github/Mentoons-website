import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { motion } from "framer-motion";

const Welcome = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaSearch className="text-3xl text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Welcome to Chat
              </h2>
              <p className="text-sm">
                Select a conversation to start messaging
              </p>
            </motion.div>
          </div>
  )
}

export default Welcome