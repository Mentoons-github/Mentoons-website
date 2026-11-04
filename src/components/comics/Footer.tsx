import { FOOTER_PAGELINKS, SOCIAL_LINKS } from "@/constant";
import { MdEmail, MdLocationOn, MdPlayCircleFilled } from "react-icons/md";
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
// ---------------------------------------------------------------
const FOOTER_VIDEO_URL = "/assets/v3/footer/footerVideo.mp4";

// Converts any YouTube link into an embeddable URL (returns null if not YouTube)
const getYouTubeEmbedUrl = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// ---- section lookups (Products removed) ----
const hasTitle = (title: string, key: string) =>
  title.toLowerCase().includes(key);

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
const FooterVideo = ({ url }: { url: string }) => {
  const embedUrl = url ? getYouTubeEmbedUrl(url) : null;

  return (
    <div
      className={`w-full max-w-xl mx-auto overflow-hidden bg-black border-4 border-black rounded-2xl ${comicShadow}`}
    >
      <div className="relative w-full aspect-video">
        {!url ? (
          // Placeholder
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-orange-600">
            <MdPlayCircleFilled className="text-6xl text-white drop-shadow-[2px_2px_0_#000]" />
            <p className="text-lg tracking-wider text-white font-comic-chip">
              Video Coming Soon
            </p>
          </div>
        ) : embedUrl ? (
          // YouTube
          <iframe
            src={embedUrl}
            title="Mentoons footer video"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Direct video file (mp4, webm, etc.)
          <video
            src={url}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 object-cover w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });

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

  // smaller, tighter links
  const renderLinkItems = (items: LinkItem[], textColor = "text-black") =>
    items.map((linkItem) => (
      <div
        onClick={() => handleLinkClick(linkItem)}
        key={linkItem.id}
        className={`flex items-center gap-1.5 font-comic text-sm md:text-base leading-tight tracking-wide ${textColor} cursor-pointer transition-all duration-200 hover:translate-x-1 hover:text-white`}
      >
        {linkItem.label.includes("@") && <MdEmail />}
        {linkItem.label.includes("+91") && <PiPhoneCallFill />}
        {linkItem.label}
      </div>
    ));

  return (
    <footer className="relative bg-[#FF942E] pb-8">
      <div className="relative z-10 grid gap-6 px-6 pt-8 md:px-16 lg:grid-cols-[1fr_1.5fr_auto_auto] lg:items-start">
        {/* Logo + About list directly underneath */}
        <div className="flex flex-col items-center gap-2 lg:items-start">
          <img
            src="/assets/images/mentoons-logo.png"
            alt="Mentoons logo"
            className="object-cover h-20 md:h-24"
          />
          {aboutSection && (
            <div className="flex flex-col items-center w-full gap-1 lg:items-start">
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

        {/* CENTER: Video (placeholder) + remaining link sections */}
        <div className="flex flex-col items-center gap-6 lg:px-4">
          <FooterVideo url={FOOTER_VIDEO_URL} />

          {otherSections.length > 0 && (
            <div className="flex flex-wrap items-start justify-center gap-8 lg:justify-start">
              {otherSections.map((item) => (
                <div key={item.id} className="text-center lg:text-start">
                  <Link to={item.url} className={comicHeading}>
                    {item.title}
                  </Link>
                  <div className="flex flex-col items-center gap-1 mt-2 lg:items-start">
                    {renderLinkItems(item.items)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Smaller QR */}
        <div
          className={`flex flex-col items-center self-start p-3 mx-auto bg-orange-600 border-4 border-black rounded-2xl ${comicShadow} h-fit w-fit`}
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

        {/* Contact */}
        <div className="flex flex-col w-full gap-4 mx-auto lg:w-64">
          {contactSection && (
            <div className="flex flex-col items-center gap-1 lg:items-start">
              <Link to={contactSection.url} className={comicHeading}>
                {contactSection.title}
              </Link>
              <div className="flex flex-col items-center gap-1 mt-2 lg:items-start">
                {renderLinkItems(contactSection.items)}
                <div className="flex items-center gap-1.5 font-comic text-sm md:text-base leading-tight tracking-wide text-black">
                  <MdLocationOn />
                  Domlur, Bangalore
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile ? renderSocialIcons("sm") : renderSocialIcons("lg")}
    </footer>
  );
};

export default Footer;
