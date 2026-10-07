import { useEffect } from "react";
import { Form, Formik, type FormikErrors } from "formik";
import {
  CheckCircle2,
  Gift,
  Mail,
  MessageSquare,
  Send,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

export interface GiftPayload {
  recipientEmail: string;
  senderName: string;
  message: string;
}

interface SendGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  defaultName?: string;
  onSubmit: (payload: GiftPayload) => Promise<void> | void;
}

const MAX_MESSAGE = 200;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values: GiftPayload): FormikErrors<GiftPayload> => {
  const errors: FormikErrors<GiftPayload> = {};
  const email = values.recipientEmail.trim();
  if (!email) errors.recipientEmail = "Recipient email is required";
  else if (!EMAIL_REGEX.test(email))
    errors.recipientEmail = "Enter a valid email address";
  if (!values.senderName.trim()) errors.senderName = "Your name is required";
  if (values.message.length > MAX_MESSAGE)
    errors.message = `Message can't exceed ${MAX_MESSAGE} characters`;
  return errors;
};

const inputBase =
  "w-full rounded-xl border bg-white py-3 pl-11 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#ffc42e] focus:ring-2 focus:ring-[#ffc42e]/30";

const SendGiftModal = ({
  isOpen,
  onClose,
  productTitle,
  defaultName = "",
  onSubmit,
}: SendGiftModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-gift-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[95vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        >
          <X className="h-5 w-5" />
        </button>

        <Formik<GiftPayload>
          initialValues={{
            recipientEmail: "",
            senderName: defaultName,
            message: "",
          }}
          validate={validate}
          validateOnMount={false}
          onSubmit={async (values, { setStatus }) => {
            setStatus(undefined);
            try {
              await onSubmit({
                recipientEmail: values.recipientEmail.trim(),
                senderName: values.senderName.trim(),
                message: values.message.trim(),
              });
              setStatus({ sent: true, email: values.recipientEmail.trim() });
            } catch {
              setStatus({
                error: "Could not send the gift. Please try again.",
              });
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            status,
            isSubmitting,
            handleChange,
            handleBlur,
          }) => {
            if (status?.sent) {
              return (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-9 w-9 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#0f1b3d]">
                    Gift on its way!
                  </h2>
                  <p className="mt-2 px-2 text-sm text-gray-500">
                    We've emailed {status.email} a special link to claim{" "}
                    <span className="font-semibold text-gray-700">
                      {productTitle}
                    </span>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full rounded-xl bg-[#ffc42e] py-3 text-base font-bold text-[#0f1b3d] transition hover:bg-[#f5b800]"
                  >
                    Done
                  </button>
                </div>
              );
            }

            const emailError = touched.recipientEmail && errors.recipientEmail;
            const nameError = touched.senderName && errors.senderName;
            const messageError = touched.message && errors.message;

            return (
              <Form noValidate>
                <div className="flex items-start gap-4 pr-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff3d1]">
                    <Gift className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <h2
                      id="send-gift-title"
                      className="text-2xl font-extrabold text-[#0f1b3d]"
                    >
                      Send as a Gift
                    </h2>
                    <p className="mt-1 text-sm leading-snug text-gray-500">
                      Share the joy of learning! Send this product to someone
                      special.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="recipientEmail"
                      className="mb-1.5 block text-sm font-bold text-[#0f1b3d]"
                    >
                      Recipient Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                      <input
                        id="recipientEmail"
                        name="recipientEmail"
                        type="email"
                        value={values.recipientEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. friend@example.com"
                        className={`${inputBase} ${
                          emailError ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-1 text-xs text-red-500">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="senderName"
                      className="mb-1.5 block text-sm font-bold text-[#0f1b3d]"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                      <input
                        id="senderName"
                        name="senderName"
                        type="text"
                        value={values.senderName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Devan"
                        className={`${inputBase} ${
                          nameError ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                    </div>
                    {nameError && (
                      <p className="mt-1 text-xs text-red-500">{nameError}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-bold text-[#0f1b3d]"
                    >
                      Gift Message{" "}
                      <span className="font-normal text-gray-500">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-gray-500" />
                      <textarea
                        id="message"
                        name="message"
                        value={values.message}
                        maxLength={MAX_MESSAGE}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Write a sweet message..."
                        rows={3}
                        className={`${inputBase} resize-none pb-7 ${
                          messageError ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                      <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-gray-500">
                        {values.message.length}/{MAX_MESSAGE}
                      </span>
                    </div>
                    {messageError && (
                      <p className="mt-1 text-xs text-red-500">
                        {messageError}
                      </p>
                    )}
                  </div>
                </div>

                {status?.error && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {status.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ffc42e] py-3.5 text-base font-bold text-[#0f1b3d] shadow-sm transition hover:bg-[#f5b800] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-5 w-5" />
                  {isSubmitting ? "Sending..." : "Send Gift"}
                </button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4" />
                  We'll send an email with a special link to your recipient.
                </p>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default SendGiftModal;
