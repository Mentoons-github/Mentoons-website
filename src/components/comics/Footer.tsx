// import GroupImg1 from "@/assets/imgs/groupImg1.jpg";
// import GroupImg2 from "@/assets/imgs/groupImg2.jpg";
// import GroupImg3 from "@/assets/imgs/groupImg3.jpg";
// import GroupImg4 from "@/assets/imgs/groupImg4.jpg";
// import Logo from "@/assets/imgs/logo mini.png";
// import { useState } from "react";
// import { AiFillInstagram } from "react-icons/ai";
// import { FaFacebookSquare } from "react-icons/fa";
// import { ImLinkedin } from "react-icons/im";
// import { IoLogoWhatsapp, IoLogoYoutube, IoMdClose } from "react-icons/io";
// import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
// import {  useNavigate } from "react-router-dom";
// import MapComponent from "./MapComponent";

// interface ImagePopupProps {
//   isOpen: boolean;
//   imageSrc: string;
//   altText: string;
//   onClose: () => void;
// }

// const Footer: React.FC = () => {
//   const navigate = useNavigate();
//   const [showEvents, setShowEvents] = useState<boolean>(false);
//   const [showWorkshop, setshowWorkshop] = useState<boolean>(false);
//   const [showInside, setShowInside] = useState<boolean>(false);
//   const [showShop, setShowShop] = useState<boolean>(false);
//   const [showContactModal, setShowContactModal] = useState(false);

//   // const comicData = [
//   //   "Don't Fade Away",
//   //   "Hungry For Likes not Life",
//   //   "Choose Wisely",
//   // ];
//   const companyImg = [
//     { image: "/activeListeners.png", url: "https://www.activelisteners.in/" },
//     { image: "/toonland.png", url: "https://toonland.in/" },
//     { image: "/storyClub.png", url: "https://storyclub.in/" },
//     { image: "/cxoBranding.png", url: "https://cxobranding.com/" },
//     {
//       image: "propellingStories.png",
//       url: "http://www.propellingstories.com/",
//     },
//   ];
// const contactIcons = [
//   {
//     icon: ImLinkedin,
//     color: "text-blue-700",
//     link: "https://www.linkedin.com/company/mentoons",
//   },
//   {
//     icon: FaFacebookSquare,
//     color: "text-blue-500",
//     link: "https://google.com",
//   },
//   {
//     icon: AiFillInstagram,
//     color: "text-rose-500",
//     link: "https://google.com",
//   },
//   { icon: IoLogoYoutube, color: "text-red-600", link: "https://google.com" },
//   {
//     icon: IoLogoWhatsapp,
//     color: "text-green-500",
//     link: "https://wa.me/+919036033300",
//   },
// ];

//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//   });

//   const images = [
//     { src: GroupImg1, alt: "Independence Day, 2023" },
//     { src: GroupImg2, alt: "Independence Day, 2023" },
//     { src: GroupImg3, alt: "Fun Moments, 2023" },
//     { src: GroupImg4, alt: "Fun Moments, 2023" },
//   ];

//   const scrollToHomeSection = () => {
//     if (location.pathname === "/") {
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth"
//       });
//     } else {
//       navigate("/", { state: { scrollToTop: true } });
//     }
//   };

//   const scrollToWorkshopPage = () => {
//     console.log("scrolled");
//     if (location.pathname === "/mentoons-workshops") {
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });
//     } else {
//       navigate("/mentoons-workshops", {
//         state: { scrollToWorkshopPage: true },
//       });
//     }
//   };

//   const [selectedImage, setSelectedImage] = useState<{
//     src: string;
//     alt: string;
//   } | null>(null);

//   const openPopup = (image: { src: string; alt: string }) => {
//     setSelectedImage(image);
//   };

//   const closePopup = () => {
//     setSelectedImage(null);
//   };

//   return (
//     <div className="relative w-full text-center text-white">
//       <img
//         className="hidden md:block"
//         src="/FooterBg.png"
//         alt="footer image"
//       />
//       <img
//         className="block md:hidden"
//         src="/footerMobileVersion.png"
//         alt="footer image"
//       />
//       subscribe to newsletter form
//       <Formik
//         initialValues={{ email: "" }} // Must match FormValues type
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit} // Correctly passing the handleSubmit
//       >
//         {(
//           { isSubmitting, isValid, dirty } // Added isValid and dirty
//         ) => (
//           <Form className="h-[9rem] w-full md:w-fit lg:h-[12rem] flex flex-col justify-evenly border-[3px] border-black bg-[#A4CC13] rounded-3xl shadow-sm absolute top-[-1.5rem] right-0 md:top-[2%] lg:top-[10%] lg:right-[10%] space-y-4 lg:space-y-6 py-6 md:px-10">
//             <h3 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
//               Subscribe to our Newsletter
//             </h3>
//             <div className="flex justify-center items-start space-x-1 md:space-x-4">
//               <div>
//                 <Field
//                   name="email"
//                   type="email"
//                   className="w-[16rem] text-black bg-gray-100 placeholder:text-gray-300 rounded-md outline-none px-4 py-2"
//                   placeholder="Enter your email"
//                 />
//                 <ErrorMessage
//                   name="email"
//                   component="div"
//                   className="text-red-800 text-[18px]"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting || !isValid || !dirty} // Enable only if valid and dirty
//                 className="px-6 py-2 text-white bg-green-800 rounded-full border-2 border-white transition-all duration-300 ease-in-out cursor-pointer hover:text-green-800 hover:bg-white hover:border-green-800"
//               >
//                 Submit
//               </button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//       <div className="container bg-[#FF7D00] w-full h-fit space-y-2 lg:space-y-5">
//         {/* top section */}
//         <div className="flex flex-wrap justify-between items-center pt-4 space-y-4 lg:pt-0 lg:space-y-0">
//           <div>
//             <Link to="/" onClick={scrollToHomeSection}>
//               <img className="w-60" src={Logo} alt="mentoons logo" />
//             </Link>
//           </div>
//           <div className="flex justify-between items-center">
//             <Link to="/" onClick={scrollToHomeSection}>
//               <div className="px-4 font-semibold border-r-2 border-white cursor-pointer">
//                 Home
//               </div>
//             </Link>
//             <Link to="/mentoons-comics">
//               <div className="px-4 font-semibold border-r-2 border-white cursor-pointer">
//                 Comics
//               </div>
//             </Link>
//             <Link to="/mentoons-podcast">
//               {" "}
//               <div className="px-4 font-semibold border-r-2 border-white cursor-pointer">
//                 Podcasts
//               </div>
//             </Link>
//             <Link to="/mentoons-workshops">
//               <div className="px-4 font-semibold cursor-pointer">Workshops</div>
//             </Link>
//           </div>
//           <div className="relative">
//             <div
//               className="w-full lg:w-fit bg-[#662d0a94] uppercase font-semibold hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full"
//               onClick={() => setShowContactModal(!showContactModal)}
//             >
//               Contact Us
//             </div>
//             {showContactModal && <ContactInfo onClose={() => setShowContactModal(false)} />}
//           </div>
//         </div>
//         {/* middle section */}
//         <div className="flex flex-wrap justify-between space-y-2">
//           {/* first div */}
//           <div className="hidden space-y-2 w-full md:w-fit">
//             <div className="w-full">
//               <div
//                 onClick={() => setShowEvents((prev) => !prev)}
//                 className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full"
//               >
//                 Upcoming Events
//               </div>
//               {/* children div */}
//               <div
//                 className={`transition-all ease-in-out duration-500 overflow-hidden ${
//                   showEvents
//                     ? "max-h-0 opacity-0"
//                     : "mt-2 space-y-2 opacity-100 max-h-[500px]"
//                 }`}
//                 style={{
//                   visibility: showEvents ? "hidden" : "visible",
//                 }}
//               >
//                 <div className="flex gap-2 items-center">
//                   <div className="text-base md:text-lg font-semibold bg-white  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer py-2">
//                     <img className="w-16" src="/Family camp.png" alt="" />
//                   </div>
//                   <div>
//                     <div className="">15 September, 2024</div>
//                     <div className="text-base font-semibold tracking-wide md:text-lg">
//                       Introducing Mentoons
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 items-center">
//                   <div className=" text-base md:text-lg font-semibold bg-white  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer py-2">
//                     <img className="w-16" src="/Family camp.png" alt="" />
//                   </div>
//                   <div>
//                     <div>30 September, 2024</div>
//                     <div className="text-lg font-bold tracking-wide">
//                       Introducing Active Listeners
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full">
//               Upcoming Meets
//             </div>
//             <div className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full">
//               Upcoming Webinars
//             </div>
//           </div>
//           {/* second div */}
//           <div className="space-y-2 w-full md:w-fit">
//             <div className="w-full">
//               <div
//                 onClick={() => navigate("/faq")}
//                 className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full"
//               >
//                 FAQ's
//               </div>
//             </div>
//             <div
//               onClick={() => navigate("/mentoons-comics/free-download")}
//               className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full"
//             >
//               Free Downloads
//             </div>
//             <div
//               onClick={() => setshowWorkshop((prev) => !prev)}
//               className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full"
//             >
//               Workshops
//             </div>
//             {/* children div */}
//             <div
//               className={`transition-all ease-in-out duration-500 flex items-center overflow-hidden ${
//                 showWorkshop
//                   ? "max-h-0 opacity-0"
//                   : "mt-2 space-x-4 opacity-100 max-h-[500px]"
//               }`}
//               style={{
//                 visibility: showWorkshop ? "hidden" : "visible",
//               }}
//             >
//               <div className="flex flex-col justify-center items-center cursor-pointer group">
//                 <img
//                   onClick={() => {
//                     scrollToWorkshopPage();
//                     navigate("/mentoons-workshops?workshop=6-12");
//                   }}
//                   className="w-20 rounded-full"
//                   src="/assets/camps/Buddy.png"
//                   alt="comic image"
//                 />
//                 <div className="transition-all duration-300 ease-in-out group-hover:text-green-300">
//                   Buddy Camp
//                 </div>
//               </div>
//               <div className="flex flex-col justify-center items-center cursor-pointer group">
//                 <img
//                   onClick={() => {
//                     scrollToWorkshopPage();
//                     navigate("/mentoons-workshops?workshop=13-19");
//                   }}
//                   className="w-20 rounded-full"
//                   src="/assets/camps/Teen.png"
//                   alt="comic image"
//                 />
//                 <div className="transition-all duration-300 ease-in-out group-hover:text-green-300">
//                   Teen Camp
//                 </div>
//               </div>
//               <div className="cursor-pointer group">
//                 <img
//                   onClick={() => {
//                     scrollToWorkshopPage();
//                     navigate("/mentoons-workshops?workshop=Parents");
//                   }}
//                   className="w-20 rounded-full"
//                   src="/assets/camps/Family.png"
//                   alt="comic image"
//                 />
//                 <div className="transition-all duration-300 ease-in-out group-hover:text-green-300">
//                   Family Camp
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* third div */}
//           <div className="space-y-2 w-full md:w-fit">
//             <div className="">
//               <div
//                 onClick={() => setShowInside((prev) => !prev)}
//                 className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white active:bg-gray-100 transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full"
//               >
//                 Inside Mentoons
//               </div>
//               {/* children div */}
//               <div
//                 className={`transition-all ease-in-out duration-500 flex items-center gap-1 overflow-hidden ${
//                   showInside
//                     ? "max-h-0 opacity-0"
//                     : "mt-2 opacity-100 max-h-[500px]"
//                 }`}
//                 style={{
//                   visibility: showInside ? "hidden" : "visible",
//                 }}
//               >
//                 <div className="flex flex-wrap gap-4">
//                   {images.map((image, index) => (
//                     <div
//                       key={index}
//                       onClick={() => openPopup(image)}
//                       className="flex items-center rounded-full border-4 border-white cursor-pointer w-fit hover:border-green-300"
//                     >
//                       <img
//                         className="w-12 rounded-full"
//                         src={image.src}
//                         alt={image.alt}
//                       />
//                     </div>
//                   ))}

//                   <ImagePopup
//                     isOpen={selectedImage !== null}
//                     imageSrc={selectedImage?.src || ""}
//                     altText={selectedImage?.alt || ""}
//                     onClose={closePopup}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="">
//               <div
//                 onClick={() => setShowShop((prev) => !prev)}
//                 className="w-full uppercase text-base md:text-lg font-semibold bg-[#662d0a94]  hover:text-[#f87218ea] hover:bg-white transition-all ease-in-out duration-300 cursor-pointer px-4 py-2 rounded-full"
//               >
//                 Subscribe to NewsLetter
//               </div>
//               <div
//                 className={`transition-all ease-in-out duration-500 overflow-hidden ${
//                   showShop
//                     ? "max-h-0 opacity-0"
//                     : "mt-2 opacity-100 max-h-[500px]"
//                 }`}
//                 style={{
//                   visibility: showShop ? "hidden" : "visible",
//                 }}
//               >
//                 <Formik
//                   initialValues={{ email: "" }}
//                   validationSchema={validationSchema}
//                   onSubmit={handleSubmit}
//                 >
//                   {({ isSubmitting, isValid, dirty }) => (
//                     <Form className="w-full">
//                       <div className="flex relative items-center">
//                         <Field
//                           name="email"
//                           type="email"
//                           className="p-3 pr-32 pl-5 w-full text-gray-700 rounded-full border-2 border-gray-200 focus:outline-none focus:border-orange-400"
//                           placeholder="Enter your email"
//                         />
//                         <button
//                           type="submit"
//                           disabled={isSubmitting || !isValid || !dirty}
//                           className="flex absolute right-1 gap-2 items-center px-6 py-2 font-medium text-white bg-orange-500 rounded-full transition-all duration-300 hover:bg-orange-600"
//                         >
//                           <span>Subscribe</span>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14v-4H8l4-6 4 6h-3v4h-2z" transform="rotate(90 12 12)"/>
//                           </svg>
//                         </button>
//                       </div>
//                       <ErrorMessage
//                         name="email"
//                         component="div"
//                         className="mt-1 ml-2 text-sm text-red-600"
//                       />
//                     </Form>
//                   )}
//                 </Formik>
//               </div>
//               {/* {comicData?.map((item: string) => {
//                   return (
//                     <div
//                       onClick={() =>
//                         navigate("/mentoons-comics/audio-comics/" + item)
//                       }
//                       className="text-lg font-semibold transition-all duration-300 ease-in-out cursor-pointer hover:text-green-300"
//                     >
//                       - {item}
//                     </div>
//                   );
//                 })} */}
//             </div>
//           </div>

//           {/* fourth div */}
//           <div className="space-y-2 w-full md:w-fit">
//             <MapComponent />
//             <div className="flex justify-start items-center text-lg font-medium tracking-wide">
//               <MdLocationOn />
//               Domlur, Bangalore
//             </div>
//             <div className="flex gap-4 justify-center items-center md:justify-between md:gap-1">
//               {contactIcons?.map((item,index) => {
//                 return (
//                   <a
//                     key={index}
//                     href={item.link}
//                     target="_blank"
//                     className="p-2 bg-white rounded-full cursor-pointer"
//                   >
//                     <item.icon className={`text-xl ${item.color}`} />
//                   </a>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//         {/* bottom section */}
//         <div className="flex flex-wrap justify-between items-center pb-10">
//           <Link to="/privacy-policy">
//             <div className="text-base font-semibold tracking-wide md:text-lg">
//               Privacy policy , Terms & conditions
//             </div>
//           </Link>
//           <div>
//             <img className="w-28" src="/flowers.png" alt="flower image" />
//           </div>
//           <div className="flex gap-2 items-center px-4 py-2 bg-white rounded-full">
//             {companyImg?.map((item, idx) => {
//               return (
//                 <Link to={item?.url} className="overflow-hidden" key={idx}>
//                   <img
//                     className={`${
//                       idx == 3 ? "w-16" : "w-20"
//                     } cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out`}
//                     src={item?.image}
//                     alt="company image"
//                   />
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ContactInfo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   return (
//     <div className="absolute top-full left-0 mt-2 w-64 bg-[#662d0a] rounded-lg shadow-lg p-4 z-10">
//       <button
//         onClick={onClose}
//         className="absolute top-2 right-5 text-white hover:text-[#f87218ea] transition-all duration-300"
//       >
//         <IoMdClose size={20} />
//       </button>
//       <div className="space-y-3">
//         <a
//           href="mailto:info@mentoons.com"
//           className="flex items-center space-x-2 text-white hover:text-[#f87218ea] transition-all duration-300"
//         >
//           <MdEmail size={20} />
//           <span>info@mentoons.com</span>
//         </a>
//         <a
//           href="tel:+919036033300"
//           className="flex items-center space-x-2 text-white hover:text-[#f87218ea] transition-all duration-300"
//         >
//           <MdPhone size={20} />
//           <span>+91 90360 33300</span>
//         </a>
//       </div>
//     </div>
//   );
// };

// export const ImagePopup: React.FC<ImagePopupProps> = ({
//   isOpen,
//   imageSrc,
//   altText,
//   onClose,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
//       <div className="relative bg-white rounded-lg shadow-lg p-4 max-w-[425px]">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-xl text-black transition-all duration-300 ease-in-out cursor-pointer hover:text-red-400 active:scale-50"
//         >
//           <IoMdClose />
//         </button>
//         <img className="mt-4 w-full rounded-md" src={imageSrc} alt={altText} />
//         <div className="mt-4 text-2xl font-semibold text-black">{altText}</div>
//       </div>
//     </div>
//   );
// };

// export default Footer;

// lskdjflsdjflskdjflskdjflsdkfjlsdkfjlsdkjflskdjflskdjflsdjflskdjflsdjf

import axiosInstance from "@/api/axios";
import {
  companyImg,
  FOOTER_NAVLINKS,
  FOOTER_PAGELINKS,
  SOCIAL_LINKS,
} from "@/constant";
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
import { useMediaQuery } from "react-responsive";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
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
        toast(`✅ ${res.message}`);
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
  const scrollToTop = (url: string) => {
    if (location.pathname === url) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      navigate(url, { state: { scrollToTop: true } });
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


    //uncomment it==================>


    // sessionStorage.setItem("scrollToLabel", label);

    // window.location.href = url;
    // For regular URLs, check if it's an internal link with a section
    if (url.includes("#")) {
      const [path, section] = url.split("#");
      console.log(section);
      const element = document.getElementById(section);
      if (location.pathname !== path) {
        // First navigate to the path
        navigate(path);
        setTimeout(() => {
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
        }, 1000);
      } else {
        // If already on correct path, just scroll
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
      }
      return;
    }

    // For regular URLs without sections
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#FEB977] to-[#FF942E] relative ">
      <div className="absolute bottom-0 w-full">
        <img
          src="/assets/images/footer-illustration.png"
          alt="Mentoons logo"
          className="w-full max-h-96"
        />
      </div>
      <div className="flex flex-wrap justify-center items-center p-4 px-20 pt-8 lg:justify-between">
        <div>
          <img
            src="/assets/images/mentoons-logo.png"
            alt=""
            className="object-cover h-24"
          />
        </div>

        <div className="flex flex-[0.4] items-center justify-between relative border-spacing-3   ">
          {FOOTER_NAVLINKS.map((navItem, index) => (
            <div
              className="flex justify-center items-center transition-all duration-300 hover:underline"
              key={navItem.id}
              onClick={() => scrollToTop(navItem.url)}
            >
              <Link
                to={navItem.url}
                className="p-2 sm:p-4 text-[16px] md:text-[22px] font-bold cursor-pointer"
              >
                {navItem.title}
              </Link>
              {index < FOOTER_NAVLINKS.length - 1 && (
                <div className=" h-3 w-[1px] bg-black" />
              )}
            </div>
          ))}
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
                    className="flex gap-2 justify-center items-center text-center transition-all duration-300 cursor-pointer lg:justify-normal hover:scale-110"
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
              <Form className="flex flex-col gap-4 w-full">
                <div className="box-border w-full">
                  <Field
                    name="email"
                    type="email"
                    className="p-2 px-4 w-full rounded-full focus:outline-primary"
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
                  className="p-2 w-full text-white whitespace-nowrap bg-orange-600 rounded-full transition-all duration-300 cursor-pointer hover:bg-orange-700 text-ellipsis"
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
          <div className="space-y-2 w-full">
            <MapComponent />{" "}
            <div className="flex justify-start items-center w-full text-lg font-medium tracking-wide">
              <MdLocationOn />
              Domlur, Bangalore{" "}
            </div>{" "}
          </div>
        </div>
      </div>

      <div className="flex relative flex-wrap gap-8 justify-center items-center mt-16">
        {companyImg.map((item) => (
          <div key={item.id} className="h-16">
            <Link to={item.url} className="cursor-pointer">
              <img
                src={item.image}
                alt=""
                className="object-cover h-14 transition-all duration-300 hover:scale-105"
              />
            </Link>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
