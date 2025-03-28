import { useSessionForm } from "@/utils/formik/sessionForm";

type HandleSubmit = (values: {
  name: string;
  email: string;
  phone: string;
  selectedDate: string;
  selectedTime: string;
  description?: string;
}) => void;

const SessionBookingForm = ({
  handleSubmit,
}: {
  handleSubmit: HandleSubmit;
}) => {
  const formik = useSessionForm((values, formikHelpers) => {
    handleSubmit(values);
    formikHelpers.resetForm();
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 mt-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1 font-inter"
          >
            👤 Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1 font-inter"
          >
            ✉️ Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1 font-inter"
          >
            📞 Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm">{formik.errors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="selectedDate"
            className="block text-sm font-medium text-gray-700 mb-1 font-inter"
          >
            📅 Select Date
          </label>
          <input
            type="date"
            id="selectedDate"
            name="selectedDate"
            value={formik.values.selectedDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min={new Date().toISOString().split("T")[0]}
          />
          {formik.touched.selectedDate && formik.errors.selectedDate && (
            <p className="text-red-500 text-sm">{formik.errors.selectedDate}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="selectedTime"
          className="block text-sm font-medium text-gray-700 mb-1 font-inter"
        >
          🕒 Select Time
        </label>
        <input
          type="time"
          id="selectedTime"
          name="selectedTime"
          value={formik.values.selectedTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          step="900"
        />
        {formik.touched.selectedTime && formik.errors.selectedTime && (
          <p className="text-red-500 text-sm">{formik.errors.selectedTime}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1 font-inter"
        >
          Additional Details (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Any specific topics or concerns you'd like to discuss?"
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-red-500 text-sm">{formik.errors.description}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-700 transition duration-300 font-mulish"
      >
        Book Your Session
      </button>
    </form>
  );
};

export default SessionBookingForm;
