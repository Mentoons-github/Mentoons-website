import { ErrorMessage, Field } from "formik";
import { motion } from "framer-motion";

const ArticleForm = () => {
  return (
    <div className="w-full space-y-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Article Title
        </label>
        <Field
          type="text"
          name="title"
          className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter article title"
        />
        <ErrorMessage
          name="title"
          component="div"
          className="mt-1 text-sm text-red-500"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Article Body
        </label>
        <Field
          as="textarea"
          name="articleBody"
          className="w-full h-64 p-4 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Write your article..."
        />
        <ErrorMessage
          name="articleBody"
          component="div"
          className="mt-1 text-sm text-red-500"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="w-full mt-4"
      >
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Visibility
        </label>
        <Field
          as="select"
          name="visibility"
          className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </Field>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full p-3 mt-6 border border-blue-100 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800"
      >
        <p className="flex items-center justify-between text-sm text-blue-800 dark:text-blue-200">
          <span>You'll be able to add a cover image in the next step</span>
          <span className="text-xs text-blue-500">Step 1 of 3</span>
        </p>
      </motion.div>
    </div>
  );
};

export default ArticleForm;
