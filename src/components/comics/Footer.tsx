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

interface ApiResponse {
  success: boolean;
  data?: unknown; // You can replace 'any' with the actual data type you expect
  message?: string; // Optional error or success message
}

interface FormValues {
  email: string;
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
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await axiosInstance.post<ApiResponse>(
        "email/subscribeToNewsletter",
        {
          email: values.email,
        }
      );

      // The data from the response is in response.data
      const res: ApiResponse = response.data;
      if (res.success) {
        setShowNewsletterModal(true);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      toast(` ${err}`);
    } finally {
      resetForm();
      setSubmitting(false);
    }
  };

  interface LinkItem {
    id: string;
    label: string;
    url: string;
  }

  const handleLinkClick = (linkItem: LinkItem) => {
    const { label, url } = linkItem;

    if (label.includes("@")) {
      window.open(`mailto:${label}`, "_blank");
      return;
    }

    if (/^[\d\s+()-]+$/.test(label)) {
      window.location.href = `tel:${label}`;
      return;
    }

    // Store label in session storage for scrolling
    sessionStorage.setItem("scrollToLabel", label);
    window.location.href = url;
    return; // Stop further execution after setting the URL
    // For regular URLs, check if it's an internal link with a section
    if (url.includes("#")) {
      // Split URL properly to preserve query parameters
      const hashIndex = url.indexOf("#");
      const path = url.substring(0, hashIndex);
      const section = url.substring(hashIndex + 1);

      console.log("Path with query params:", path);
      console.log("Section:", section);

      if (location.pathname !== path.split("?")[0]) {
        // First navigate to the path (with query params)
        navigate(path);
        // Wait for navigation to complete and page to load
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            const yOffset = -80;
            const y =
              element.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
            window.scrollTo({
              top: y,
              behavior: "smooth",
            });
          }
        }, 100);
      } else {
        // If already on correct path, just scroll
        // Small timeout to ensure any ongoing scrolling is complete
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
          } else {
            // If element not found, try scrolling to top of page
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
        }, 100);
      }
      return;
    }

    // For regular URLs without sections
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
        <div className="flex flex-col items-start justify-start flex-[0.24] mx-auto gap-4 ">
          <Formik
            initialValues={{ email: "" }} // Must match FormValues type
            validationSchema={validationSchema}
            onSubmit={handleSubmit} // Correctly passing the handleSubmit
          >
            {(
              { isSubmitting, isValid, dirty } // Added isValid and dirty
            ) => (
              <Form className="flex flex-col w-full gap-4">
                <div className="box-border w-full">
                  <Field
                    name="email"
                    type="email"
                    className="w-full p-2 px-4 rounded-full focus:outline-primary"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-800 text-[18px]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty} // Enable only if valid and dirty
                  className="w-full p-2 text-white transition-all duration-300 bg-orange-600 rounded-full cursor-pointer whitespace-nowrap hover:bg-orange-700 text-ellipsis"
                >
                  Be the first to be Informed
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
