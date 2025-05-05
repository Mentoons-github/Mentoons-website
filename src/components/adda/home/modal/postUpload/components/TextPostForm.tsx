import { ErrorMessage, Field } from "formik";
import { motion } from "framer-motion";

interface TextPostFormProps {
  postType: string;
}

const TextPostForm = ({ postType }: TextPostFormProps) => {
  return (
    <div className="w-full">
      <Field
        as="textarea"
        name="content"
        className="w-full h-64 p-4 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
        placeholder={`Write about your ${postType.toLowerCase()}...`}
      />
      <ErrorMessage
        name="content"
        component="div"
        className="mt-1 text-sm text-red-500"
      />

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
    </div>
  );
};

export default TextPostForm;
