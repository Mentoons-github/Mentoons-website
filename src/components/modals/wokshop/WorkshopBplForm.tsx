import { X, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import indiaDistricts from "../../../constant/workshops/indiaStatesUTDistricts.json";
import { BplVerificationSchema } from "@/validation/BPLVerificationFormValidation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useAuth } from "@clerk/clerk-react";
import { submitBplVerificationFormThunk } from "@/redux/workshop/workshopThunk";
import { uploadFile } from "@/redux/fileUploadSlice";
import { toast } from "sonner";
import { resetInvoiceReducer } from "@/redux/workshop/workshopSlice";

const WorkshopBplForm = ({
  onClose,
  onUpdateStatus,
}: {
  onClose: () => void;
  onUpdateStatus: () => void;
}) => {
  const [districts, setDistricts] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const { message, verificationSubmitSuccess, error } = useAppSelector(
    (state) => state.invoice,
  );
  const { getToken } = useAuth();

  type StateType = keyof typeof indiaDistricts;

  const states = Object.keys(indiaDistricts);

  useEffect(() => {
    if (verificationSubmitSuccess) {
      toast.success(message);
      dispatch(resetInvoiceReducer());
      onUpdateStatus();
      onClose();
    }
    if (error) {
      toast.error(error);
      dispatch(resetInvoiceReducer());
    }
  }, [dispatch, error, message, onClose, onUpdateStatus, verificationSubmitSuccess]);

  const formik = useFormik({
    initialValues: {
      rationCardNumber: "",
      state: "",
      district: "",
      headOfFamilyName: "",
      mobileNumber: "",
      document: null as File | null,
    },

    validationSchema: BplVerificationSchema,

    onSubmit: async (values) => {
      try {
        const token = await getToken();
        if (!token) {
          return;
        }

        const uploadResponse = await dispatch(
          uploadFile({ file: values.document as File, getToken }),
        ).unwrap();

        const file = uploadResponse.data.fileDetails.url;

        const finaleDetails = {
          ...values,
          mobileNumber: Number(values.mobileNumber),
          document: file,
        };

        await dispatch(
          submitBplVerificationFormThunk({
            details: finaleDetails,
            token: token as string,
          }),
        ).unwrap();
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value as StateType;

    formik.setFieldValue("state", selectedState);
    formik.setFieldValue("district", "");

    setDistricts(indiaDistricts[selectedState] || []);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6">
          BPL Verification
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ration Card */}
            <div>
              <label className="text-sm font-medium">Ration Card Number</label>
              <input
                type="text"
                name="rationCardNumber"
                value={formik.values.rationCardNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded-xl px-4 py-2"
              />
              {formik.touched.rationCardNumber &&
                formik.errors.rationCardNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.rationCardNumber}
                  </p>
                )}
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-medium">State / UT</label>
              <select
                name="state"
                value={formik.values.state}
                onChange={handleStateChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded-xl px-4 py-2"
              >
                <option value="">Select State / UT</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {formik.touched.state && formik.errors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.state}
                </p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="text-sm font-medium">District</label>
              <select
                name="district"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.state}
                className="w-full border rounded-xl px-4 py-2"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {formik.touched.district && formik.errors.district && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.district}
                </p>
              )}
            </div>

            {/* Head Name */}
            <div>
              <label className="text-sm font-medium">Head of Family Name</label>
              <input
                type="text"
                name="headOfFamilyName"
                value={formik.values.headOfFamilyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded-xl px-4 py-2"
              />
              {formik.touched.headOfFamilyName &&
                formik.errors.headOfFamilyName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.headOfFamilyName}
                  </p>
                )}
            </div>

            {/* Mobile */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded-xl px-4 py-2"
              />
              {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.mobileNumber}
                </p>
              )}
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="text-sm font-medium">
              Upload DigiLocker BPL Card (PDF Only)
            </label>

            <div className="border-2 border-dashed rounded-2xl p-6 text-center relative">
              <UploadCloud size={40} className="mx-auto text-gray-400" />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  formik.setFieldValue("document", e.target.files?.[0])
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            {formik.touched.document && formik.errors.document && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.document as string}
              </p>
            )}

            {formik.values.document && (
              <p className="text-green-600 text-sm mt-2">
                Selected: {formik.values.document.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkshopBplForm;
