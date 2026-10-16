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

const labelCls = "font-comic text-lg tracking-wider block mb-1";
const inputCls =
  "w-full border-2 border-black bg-white px-4 py-2 transition focus:outline-none focus:bg-[#fff9d6] focus:shadow-[4px_4px_0_#000] disabled:bg-gray-200 disabled:cursor-not-allowed";
const errCls = "text-red-600 text-xs font-semibold mt-1";

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
  }, [
    dispatch,
    error,
    message,
    onClose,
    onUpdateStatus,
    verificationSubmitSuccess,
  ]);

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
      <div className="bg-white border-4 border-black shadow-[10px_10px_0_#000] w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 md:p-8 relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 bg-[#ff4b3e] text-black border-2 border-black shadow-[2px_2px_0_#000] p-1 transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <X size={20} strokeWidth={3} />
        </button>

        <h2
          className="font-comic-chip text-3xl md:text-4xl tracking-wide text-center text-[#ffd93d] -rotate-1 mb-8"
          style={{
            WebkitTextStroke: "2px #000",
            paintOrder: "stroke fill",
            textShadow: "3px 3px 0 #000",
          }}
        >
          BPL Verification
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ration Card */}
            <div>
              <label className={labelCls}>Ration Card Number</label>
              <input
                type="text"
                name="rationCardNumber"
                value={formik.values.rationCardNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls}
              />
              {formik.touched.rationCardNumber &&
                formik.errors.rationCardNumber && (
                  <p className={errCls}>{formik.errors.rationCardNumber}</p>
                )}
            </div>

            {/* State */}
            <div>
              <label className={labelCls}>State / UT</label>
              <select
                name="state"
                value={formik.values.state}
                onChange={handleStateChange}
                onBlur={formik.handleBlur}
                className={inputCls}
              >
                <option value="">Select State / UT</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {formik.touched.state && formik.errors.state && (
                <p className={errCls}>{formik.errors.state}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label className={labelCls}>District</label>
              <select
                name="district"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.state}
                className={inputCls}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {formik.touched.district && formik.errors.district && (
                <p className={errCls}>{formik.errors.district}</p>
              )}
            </div>

            {/* Head Name */}
            <div>
              <label className={labelCls}>Head of Family Name</label>
              <input
                type="text"
                name="headOfFamilyName"
                value={formik.values.headOfFamilyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls}
              />
              {formik.touched.headOfFamilyName &&
                formik.errors.headOfFamilyName && (
                  <p className={errCls}>{formik.errors.headOfFamilyName}</p>
                )}
            </div>

            {/* Mobile */}
            <div className="md:col-span-2">
              <label className={labelCls}>Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputCls}
              />
              {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                <p className={errCls}>{formik.errors.mobileNumber}</p>
              )}
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className={labelCls}>
              Upload DigiLocker BPL Card (PDF Only)
            </label>

            <div className="border-4 border-dashed border-black bg-[#fff3b0] hover:bg-[#ffe66d] transition p-6 text-center relative">
              <UploadCloud size={40} className="mx-auto text-black" />
              <p className="font-comic text-lg tracking-wider mt-1">
                Click to choose your PDF
              </p>
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
              <p className={errCls}>{formik.errors.document as string}</p>
            )}

            {formik.values.document && (
              <p className="inline-block mt-3 bg-[#b9f5d0] border-2 border-black px-3 py-0.5 text-sm font-semibold text-black">
                Selected: {formik.values.document.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full font-comic text-2xl tracking-widest bg-[#2ea7ff] text-black border-4 border-black shadow-[5px_5px_0_#000] py-2 transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#000] active:translate-y-1 active:shadow-none"
          >
            Submit for Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkshopBplForm;
