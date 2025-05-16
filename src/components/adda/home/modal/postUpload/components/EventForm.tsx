import { ErrorMessage, Field } from "formik";
import { motion } from "framer-motion";
import { Calendar, Info, MapPin } from "lucide-react";

const EventForm = () => {
  return (
    <div className="flex flex-col w-full gap-3 max-h-[60vh] overflow-y-auto pr-1">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-2"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Event Title
        </label>
        <Field
          type="text"
          name="title"
          className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter event title"
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
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Start Date
        </label>
        <div className="relative">
          <Calendar
            className="absolute text-gray-500 left-3 top-2 dark:text-gray-400"
            size={16}
          />
          <Field
            type="date"
            name="eventStartDate"
            className="w-full p-2 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <ErrorMessage
          name="eventStartDate"
          component="div"
          className="mt-1 text-sm text-red-500"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="relative"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          End Date (Optional)
        </label>
        <div className="relative">
          <Calendar
            className="absolute text-gray-500 left-3 top-2 dark:text-gray-400"
            size={16}
          />
          <Field
            type="date"
            name="eventEndDate"
            className="w-full p-2 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Venue
        </label>
        <div className="relative">
          <MapPin
            className="absolute text-gray-500 left-3 top-2 dark:text-gray-400"
            size={16}
          />
          <Field
            type="text"
            name="venue"
            placeholder="Event venue"
            className="w-full p-2 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <ErrorMessage
          name="venue"
          component="div"
          className="mt-1 text-sm text-red-500"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Location (Optional)
        </label>
        <div className="relative">
          <MapPin
            className="absolute text-gray-500 left-3 top-2 dark:text-gray-400"
            size={16}
          />
          <Field
            type="text"
            name="location"
            placeholder="City, Country"
            className="w-full p-2 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <div className="relative">
          <Info
            className="absolute text-gray-500 left-3 top-2 dark:text-gray-400"
            size={16}
          />
          <Field
            as="textarea"
            name="description"
            placeholder="Event description"
            className="w-full h-20 p-2 pl-10 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <Field
          as="textarea"
          name="content"
          className="w-full h-20 p-2 text-gray-900 bg-white border border-gray-300 rounded-lg resize-none dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Additional content for your event post..."
        />
        <ErrorMessage
          name="content"
          component="div"
          className="mt-1 text-sm text-red-500"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="w-full mt-1"
      >
        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Visibility
        </label>
        <Field
          as="select"
          name="visibility"
          className="w-full p-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </Field>
      </motion.div>
    </div>
  );
};

export default EventForm;
