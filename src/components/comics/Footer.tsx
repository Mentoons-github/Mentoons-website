import { FOOTER_PAGELINKS, SOCIAL_LINKS } from "@/constant";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { SiFacebook, SiInstagram, SiWhatsapp, SiYoutube } from "react-icons/si";

import { useMediaQuery } from "react-responsive";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TiSocialLinkedin } from "react-icons/ti";

interface LinkItem {
  id: string;
  label: string;
  url: string;
}

// ---------------------------------------------------------------
// 👉 PASTE YOUR VIDEO LINK HERE
// Examples:
//   "https://www.youtube.com/watch?v=XXXXXXXXXXX"
//   "https://youtu.be/XXXXXXXXXXX"
//   "https://yourdomain.com/videos/intro.mp4"
// Leave empty ("") to show the placeholder.
// // ---------------------------------------------------------------
// const FOOTER_VIDEO_URL = "/assets/v3/footer/footerVideo.mp4";

// Converts any YouTube link into an embeddable URL (returns null if not YouTube)
// const getYouTubeEmbedUrl = (url: string): string | null => {
//   const match = url.match(
//     /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
//   );
//   return match ? `https://www.youtube.com/embed/${match[1]}` : null;
// };

// ---- section lookups (Products removed) ----
const hasTitle = (title: string, key: string) =>
  title.toLowerCase().includes(key);

const isPhoneLabel = (label: string) => /^[\d\s+()-]+$/.test(label);

const aboutSection = FOOTER_PAGELINKS.find((s) => hasTitle(s.title, "about"));
const contactSection = FOOTER_PAGELINKS.find((s) =>
  hasTitle(s.title, "contact"),
);
const otherSections = FOOTER_PAGELINKS.filter(
  (s) =>
    !hasTitle(s.title, "product") &&
    !hasTitle(s.title, "about") &&
    !hasTitle(s.title, "contact"),
);

// comic look: hard shadow on cards/buttons
const comicShadow = "shadow-[3px_3px_0_#000]";

// heading: big, bold, uppercase, underlined bar
const comicHeading =
  "relative inline-block pb-1 text-2xl md:text-3xl tracking-[0.15em] uppercase text-black font-comic-chip drop-shadow-[2px_2px_0_rgba(255,255,255,0.7)] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:bg-black after:content-['']";

// ---- Video block (placeholder until a URL is provided) ----
// const FooterVideo = ({
//   url,
//   className = "",
// }: {
//   url: string;
//   className?: string;
// }) => {
//   const embedUrl = url ? getYouTubeEmbedUrl(url) : null;

//   return (
//     <div
//       className={`w-full overflow-hidden bg-black border-4 border-black rounded-2xl ${comicShadow} ${className}`}
//     >
//       <div className="relative w-full aspect-video">
//         {!url ? (
//           // Placeholder
//           <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-orange-600">
//             <MdPlayCircleFilled className="text-6xl text-white drop-shadow-[2px_2px_0_#000]" />
//             <p className="text-lg tracking-wider text-white font-comic-chip">
//               Video Coming Soon
//             </p>
//           </div>
//         ) : embedUrl ? (
//           // YouTube
//           <iframe
//             src={embedUrl}
//             title="Mentoons footer video"
//             className="absolute inset-0 w-full h-full"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//         ) : (
//           // Direct video file (mp4, webm, etc.)
//           <video
//             src={url}
//             controls
//             playsInline
//             preload="metadata"
//             className="absolute inset-0 object-cover w-full h-full"
//           />
//         )}
//       </div>
//     </div>
//   );
// };

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // phones only (below the 480px tablet layout)
  const isMobile = useMediaQuery({ maxWidth: 479 });

  const handleLinkClick = (linkItem: LinkItem) => {
    const { label, url } = linkItem;

    if (label.includes("@")) {
      window.open(`mailto:${label}`, "_blank");
      return;
    }

    if (isPhoneLabel(label)) {
      window.location.href = `tel:${label}`;
      return;
    }

    if (url.includes("#")) {
      const hashIndex = url.indexOf("#");
      const path = url.substring(0, hashIndex);
      const section = url.substring(hashIndex + 1);

      const currentPath = location.pathname + location.search;
      if (currentPath !== path) {
        navigate(path + "#" + section);
      } else {
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
          }
        }, 100);
      }
      return;
    }

    if (location.pathname !== url) {
      navigate(url);
    }
  };

  const renderSocialIcons = (iconSize: "sm" | "lg") => (
    <div
      className={`relative z-10 flex items-center justify-center gap-[8px] ${
        iconSize === "lg" ? "my-4" : "my-1 w-full"
      }`}
    >
      {SOCIAL_LINKS.map((socialItem) => (
        <Link
          key={socialItem.id}
          to={socialItem.link}
          className={`p-3 text-xl bg-white rounded-full cursor-pointer border-2 border-black ${comicShadow} transition-all duration-200 hover:-translate-y-1`}
        >
          {socialItem.icon === "linkedin" ? (
            <TiSocialLinkedin />
          ) : socialItem.icon === "facebook" ? (
            <SiFacebook />
          ) : socialItem.icon === "instagram" ? (
            <SiInstagram />
          ) : socialItem.icon === "youtube" ? (
            <SiYoutube />
          ) : socialItem.icon === "whatsapp" ? (
            <SiWhatsapp />
          ) : null}
        </Link>
      ))}
    </div>
  );

  // smaller, tighter links (always left-aligned)
  const renderLinkItems = (items: LinkItem[], textColor = "text-black") =>
    items.map((linkItem) => (
      <div
        onClick={() => handleLinkClick(linkItem)}
        key={linkItem.id}
        className={`flex items-center justify-start gap-1.5 font-comic text-sm md:text-base leading-tight tracking-wide text-left ${textColor} cursor-pointer transition-all duration-200 hover:translate-x-1 hover:text-white`}
      >
        {linkItem.label.includes("@") && <MdEmail />}
        {linkItem.label.includes("+91") && <PiPhoneCallFill />}
        {linkItem.label}
      </div>
    ));

  // contact links: phone number gets a highlighted pill so it stands out
  const renderContactItems = (items: LinkItem[]) =>
    items.map((linkItem) => {
      if (isPhoneLabel(linkItem.label)) {
        return (
          <div
            onClick={() => handleLinkClick(linkItem)}
            key={linkItem.id}
            className={`flex items-center justify-start gap-2 px-3 py-1.5 my-1 font-comic text-base md:text-lg font-bold leading-tight tracking-wider text-left text-black bg-white border-2 border-black rounded-full cursor-pointer ${comicShadow} transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-300`}
          >
            <PiPhoneCallFill className="text-xl text-orange-600" />
            {linkItem.label}
          </div>
        );
      }

      return (
        <div
          onClick={() => handleLinkClick(linkItem)}
          key={linkItem.id}
          className="flex items-center justify-start gap-1.5 font-comic text-sm md:text-base leading-tight tracking-wide text-left text-black cursor-pointer transition-all duration-200 hover:translate-x-1 hover:text-white"
        >
          {linkItem.label.includes("@") && <MdEmail />}
          {linkItem.label}
        </div>
      );
    });

  return (
    <footer className="relative bg-[#FF942E] pb-8">
      {/*
        Phone (<480)      : single column
                            1 About → 2 Contact → 3 Video → 4 QR → 5 other links → icons at bottom
        Tablet (480-1023) : 2 columns
                            row 1: About | Contact
                            row 2: Video (left, smaller) | QR (right)
                            row 3: Social icons (under video + QR)
                            row 4: other link sections
        Desktop (1024+)   : 4 columns in DOM order, icons at the bottom
      */}
      <div className="relative z-10 grid gap-6 px-6 pt-8 min-[480px]:grid-cols-2 min-[480px]:items-center min-[480px]:gap-x-8 min-[480px]:gap-y-8 min-[480px]:px-8 md:gap-x-10 md:px-16 lg:grid-cols-[1fr_1.5fr_auto_auto] lg:items-start lg:gap-x-6 lg:gap-y-6">
        {/* 1. Logo + About list directly underneath */}
        <div className="flex flex-col items-start order-1 gap-2 min-[480px]:self-start lg:order-none">
          <img
            src="/assets/images/mentoons-logo.png"
            alt="Mentoons logo"
            className="object-cover h-20 md:h-24"
          />
          {aboutSection && (
            <div className="flex flex-col items-start w-full gap-1">
              <Link
                to={aboutSection.url}
                className="relative inline-block pb-1 mb-1 text-3xl md:text-4xl tracking-[0.15em] uppercase text-black font-comic-chip drop-shadow-[2px_2px_0_rgba(255,255,255,0.7)] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-full after:rounded-full after:bg-black after:content-['']"
              >
                {aboutSection.title}
              </Link>
              {renderLinkItems(aboutSection.items, "text-black")}
            </div>
          )}
        </div>

        {/*
          CENTER wrapper:
          - phone + tablet : "contents" → video and link sections become direct grid items
          - desktop        : flex column (video on top, link sections below)
        */}
        <div className="contents lg:flex lg:flex-col lg:items-center lg:gap-6 lg:px-4">
          {/* 3. Video: full width on phone, smaller + left on tablet */}
          {/* <FooterVideo
            url={FOOTER_VIDEO_URL}
            className="order-3 max-w-xl mx-auto min-[480px]:mx-0 min-[480px]:max-w-xs min-[480px]:justify-self-start lg:order-none lg:mx-auto lg:max-w-xl lg:justify-self-auto"
          /> */}

          {/* 5. Other link sections */}
          {otherSections.length > 0 && (
            <div className="flex flex-wrap items-start justify-start order-5 w-full gap-8 min-[480px]:order-6 min-[480px]:col-span-2 min-[480px]:justify-center min-[480px]:gap-x-16 lg:order-none lg:col-span-1 lg:justify-start lg:gap-x-8">
              {otherSections.map((item) => (
                <div key={item.id} className="text-left">
                  <Link to={item.url} className={comicHeading}>
                    {item.title}
                  </Link>
                  <div className="flex flex-col items-start gap-1 mt-2">
                    {renderLinkItems(item.items)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. QR: below the video on phone, right of the video on tablet */}
        <div
          className={`flex flex-col items-center self-start order-4 p-3 mx-auto bg-orange-600 border-4 border-black rounded-2xl ${comicShadow} h-fit w-fit min-[480px]:mx-0 min-[480px]:self-center min-[480px]:justify-self-center lg:order-none lg:mx-auto lg:self-start lg:justify-self-auto`}
        >
          <p className="font-comic-chip text-base tracking-wide text-white">
            Scan to Contribute ₹1
          </p>
          <div className="relative p-2 mt-2 bg-white border-2 border-black rounded-xl group">
            <img
              src="/assets/adda/QRCode/qrCode.jpg"
              className="w-24 h-24 transition-transform duration-300 rounded-lg group-hover:scale-105"
              alt="QR Code for contributing 1 rupee"
            />
            <div className="absolute -top-3 -right-3 bg-yellow-300 text-black font-comic-chip text-xs px-2 py-1 rounded-full border-2 border-black">
              ₹1
            </div>
          </div>
          <span className="mt-2 font-comic text-sm tracking-wider text-white">
            Instant & Secure
          </span>
        </div>

        {/* 2. Contact: right after About on phone, right of About on tablet */}
        <div className="flex flex-col order-2 w-full gap-4 min-[480px]:self-start min-[480px]:pt-[5.5rem] md:pt-[6.5rem] lg:order-none lg:w-64 lg:pt-0">
          {contactSection && (
            <div className="flex flex-col items-start gap-1">
              <Link to={contactSection.url} className={comicHeading}>
                {contactSection.title}
              </Link>
              <div className="flex flex-col items-start gap-1 mt-2">
                {renderContactItems(contactSection.items)}
                <div className="flex items-center justify-start gap-1.5 font-comic text-sm md:text-base leading-tight tracking-wide text-black text-left">
                  <MdLocationOn />
                  Domlur, Bangalore, India
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social icons: tablet only, directly under video + QR */}
        <div className="hidden min-[480px]:order-5 min-[480px]:col-span-2 min-[480px]:block lg:hidden">
          {renderSocialIcons("lg")}
        </div>
      </div>

      {/* Social icons: phone + desktop (bottom of footer) */}
      <div className="min-[480px]:hidden lg:block">
        {isMobile ? renderSocialIcons("sm") : renderSocialIcons("lg")}
      </div>
    </footer>
  );
};

export default Footer;
