import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import EnquiryModal from "@/components/modals/EnquiryModal";
import ErrorModal from "@/components/adda/modal/error";
import { ModalMessage } from "@/utils/enum";

const ContactSupportSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    doubt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.doubt.trim().length < 50) {
      toast.error("Message must be at least 50 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const queryResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/query`,
        {
          message: form.doubt,
          name: form.name,
          email: form.email,
          queryType: "workshop",
        },
      );

      if (queryResponse.status === 201) {
        setForm({ name: "", email: "", doubt: "" });
        setShowEnquiryModal(true);
      }
    } catch (error: any) {
      setShowErrorModal(true);
      setShowErrorMessage(
        error?.response?.data?.message || "Failed to submit message",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-8 px-20 py-20 md:grid-cols-2 items-center">
        {/* Image Placeholder */}
        <div className="w-full h-64 md:h-[450px] rounded-lg bg-[#D9D9D9] flex items-center justify-center">
          <span className="text-sm text-neutral-400">Support Image</span>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h2 className="text-4xl font-semibold text-[#1A1A1A]">
            Having Doubts? Let us help you
          </h2>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4A4A4A]">
            Contact us for additional help regarding your workshop or purchase
            made on this platform. We will help you!
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-md border border-[#D9D9D9] bg-white px-4 text-sm outline-none focus:border-neutral-500 transition"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full h-12 rounded-md border border-[#D9D9D9] bg-white px-4 text-sm outline-none focus:border-neutral-500 transition"
            />

            <textarea
              name="doubt"
              placeholder="Write your doubt here"
              value={form.doubt}
              onChange={handleChange}
              rows={5}
              required
              className="w-full resize-none rounded-md border border-[#D9D9D9] bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500 transition"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-2 w-full rounded-md bg-[#FF7A1A] py-3 text-sm font-semibold text-white hover:bg-[#E96B0C] transition ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </section>

      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          message={ModalMessage.ENQUIRY_MESSAGE}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          open={showErrorModal}
          message={showErrorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </>
  );
};

export default ContactSupportSection;
