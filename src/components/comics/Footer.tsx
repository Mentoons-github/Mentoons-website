import axiosInstance from "@/api/axios";
import { companyImg, FOOTER_PAGELINKS, SOCIAL_LINKS } from "@/constant";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiWhatsapp,
  SiYoutube,
} from "react-icons/si";

import { ModalMessage } from "@/utils/enum";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import NewsletterModal from "../modals/NewsletterModal";
import MapComponent from "./MapComponent";
import { AxiosError } from "axios";

interface ApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}

interface FormValues {
  email: string;
}

interface LinkItem {
  id: string;
  label: string;
  url: string;
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [showNewletterModal, setShowNewsletterModal] = useState(false);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      const response = await axiosInstance.post<ApiResponse>(
        "email/subscribeToNewsletter",
        {
          email: values.email,
        },
      );

      const res: ApiResponse = response.data;
      if (res.success) {
        setShowNewsletterModal(true);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;

      toast(` ${error.response?.data.error}`);
    } finally {
      resetForm();
      setSubmitting(false);
    }
  };

  const handleLinkClick = (linkItem: LinkItem) => {
    const { label, url } = linkItem;

    // Handle email links
    if (label.includes("@")) {
      window.open(`mailto:${label}`, "_blank");
      return;
    }

    // Handle phone links
    if (/^[\d\s+()-]+$/.test(label)) {
      window.location.href = `tel:${label}`;
      return;
    }

    // Handle navigation with hash fragments
    if (url.includes("#")) {
      const hashIndex = url.indexOf("#");
      const path = url.substring(0, hashIndex);
      const section = url.substring(hashIndex + 1);

      console.log("Navigating to path:", path);
      console.log("Scrolling to section:", section);

      // Check if we're on a different path
      const currentPath = location.pathname + location.search;
      if (currentPath !== path) {
        // Navigate to the new path with hash
        navigate(path + "#" + section);
      } else {
        // Same path, just scroll to the section
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
      return;
    }

    // Handle regular navigation
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  return (
    <footer className="bg-[#FF942E] relative ">
      <div className="absolute bottom-0 w-full">
        <img
          src="/assets/images/footer-illustration.png"
          alt="Mentoons logo"
          className="w-full max-h-96"
        />
      </div>
      <div className="flex flex-wrap items-center justify-center p-4 px-20 pt-8 lg:justify-between">
        <div>
          <img
            src="/assets/images/mentoons-logo.png"
            alt=""
            className="object-cover h-24"
          />
        </div>

        {!isMobile && (
          <div className="flex items-center justify-center gap-[8px] my-4 relative ">
            {SOCIAL_LINKS.map((socialItem) => (
              <Link
                key={socialItem.id}
                to={socialItem.link}
                className="p-3 text-xl bg-white rounded-full cursor-pointer"
              >
                {socialItem.icon === "linkedin" ? (
                  <SiLinkedin className="transition-all duration-300 hover:scale-110" />
                ) : socialItem.icon === "facebook" ? (
                  <SiFacebook className="transition-all duration-300 hover:scale-110" />
                ) : socialItem.icon === "instagram" ? (
                  <SiInstagram className="transition-all duration-300 hover:scale-110" />
                ) : socialItem.icon === "youtube" ? (
                  <SiYoutube className="transition-all duration-300 hover:scale-110" />
                ) : socialItem.icon === "whatsapp" ? (
                  <SiWhatsapp className="transition-all duration-300 hover:scale-110" />
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="relative gap-10 px-16 lg:flex">
        <div className="flex items-start justify-center gap-10  flex-[0.76] flex-wrap mb-8 lg:gap-10 lg:justify-end   ">
          {FOOTER_PAGELINKS.map((item) => (
            <div key={item.id} className="text-center lg:text-start">
              <Link to={item.url} className="mb-4 text-lg font-semibold">
                {item.title}
              </Link>
              <div className="mt-2 text-center">
                {item.items.map((linkItem) => (
                  <div
                    onClick={() => handleLinkClick(linkItem)}
                    key={linkItem.id}
                    className="flex items-center justify-center gap-2 text-center transition-all duration-300 cursor-pointer lg:justify-normal hover:scale-110"
                  >
                    {linkItem.label.includes("@") && <MdEmail />}
                    {linkItem.label.includes("+91") && <PiPhoneCallFill />}
                    {linkItem.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-6 rounded-2xl shadow-2xl flex flex-col items-center mb-6 lg:mb-0 border-2 border-orange-200/40 transition-all duration-300 hover:shadow-orange-500/30 h-fit">
          <div className="text-center mb-4">
            <p className="text-orange-50 text-base font-medium tracking-wide">
              Scan to Contribute ₹1
            </p>
            <p className="text-orange-100 text-xs mt-1">
              Support us with a quick scan!
            </p>
          </div>
          <div className="relative p-4 bg-white rounded-xl shadow-inner group">
            <img
              src="/assets/adda/QRCode/qrCode.jpg"
              className="w-40 h-40 rounded-lg transition-transform duration-300 group-hover:scale-105"
              alt="QR Code for contributing 1 rupee"
            />
            <div className="absolute -top-3 -right-3 bg-orange-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
              ₹1
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-orange-500/20 rounded-xl">
              <span className="text-white text-xs font-medium">Scan Now</span>
            </div>
          </div>
          <div className="flex items-center text-orange-100 text-sm mt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-orange-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Instant & Secure</span>
          </div>
          <div className="relative group">
            <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">
              Scan with your phone to contribute
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start justify-start flex-[0.24] mx-auto gap-4 shadow-xl p-3 bg-gradient-to-tr from-orange-600 t-orange-300 rounded-xl hover:shadow-none">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="relative flex flex-col w-full gap-6 p-3 rounded-2xl bg-gradient-to-br from-white to-orange-50 shadow-xl border-2 border-orange-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -translate-y-16 translate-x-16 blur-2xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-200 rounded-full translate-y-12 -translate-x-12 blur-2xl opacity-40"></div>

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      Wellness Subscription
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-3">
                    Get free Comics, self help books, relationships, menstrual
                    cycle, friendship
                  </p>
                </div>

                <div className="relative z-10 space-y-2">
                  <Field
                    name="email"
                    type="email"
                    className="w-full p-3.5 px-5 rounded-full border-2 border-orange-200 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white text-gray-800 placeholder:text-gray-400"
                    placeholder="Enter your email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 text-sm font-medium ml-5 flex items-center gap-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="relative z-10 w-full p-3.5 text-white font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full cursor-pointer shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Be the First to Get Notified
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </Form>
            )}
          </Formik>
          {isMobile && (
            <div className="flex items-center justify-center gap-[8px]  relative  my-1  w-full">
              {SOCIAL_LINKS.map((socialItem) => (
                <Link
                  key={socialItem.id}
                  to={socialItem.link}
                  className="p-3 text-xl bg-white rounded-full cursor-pointer"
                >
                  {socialItem.icon === "linkedin" ? (
                    <SiLinkedin className="transition-all duration-200 hover:scale-110" />
                  ) : socialItem.icon === "facebook" ? (
                    <SiFacebook className="transition-all duration-200 hover:scale-110" />
                  ) : socialItem.icon === "instagram" ? (
                    <SiInstagram className="transition-all duration-200 hover:scale-110" />
                  ) : socialItem.icon === "youtube" ? (
                    <SiYoutube className="transition-all duration-200 hover:scale-110" />
                  ) : socialItem.icon === "whatsapp" ? (
                    <SiWhatsapp className="transition-all duration-200 hover:scale-110" />
                  ) : null}
                </Link>
              ))}
            </div>
          )}
          <div className="w-full space-y-2">
            <MapComponent />{" "}
            <div className="flex items-center justify-start w-full text-lg font-medium tracking-wide">
              <MdLocationOn />
              Domlur, Bangalore{" "}
            </div>{" "}
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-8 mt-16">
        {companyImg.map((item) => (
          <div key={item.id} className="h-16">
            <Link to={item.url} className="cursor-pointer">
              <img
                src={item.image}
                alt=""
                className="object-cover transition-all duration-300 h-14 hover:scale-105"
              />
            </Link>
          </div>
        ))}
      </div>
      {showNewletterModal && (
        <NewsletterModal
          isOpen={showNewletterModal}
          onClose={() => setShowNewsletterModal(false)}
          message={ModalMessage.NEWSLETTER_MESSAGE}
        />
      )}
    </footer>
  );
};

export default Footer;
