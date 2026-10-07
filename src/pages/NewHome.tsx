import BookSession from "@/components/Home/newVersion/booksession";
import DiscoverYourself from "@/components/Home/newVersion/discoverYourself";
import HowMentoonsHelpsYourChild from "@/components/Home/newVersion/HowMentoonsHelpsYourChild";
import KnowOurWorkshops from "@/components/Home/newVersion/knowOurWorkshops";
import PopularProducts from "@/components/Home/newVersion/popularProducts";
import { ArrowRight } from "lucide-react";
import CommunitySection from "./Community";
import LandingBanner from "@/components/adda/landing/landingHero/banner";

const NewHomePage = () => {
  return (
    <>
      <LandingBanner />
      <div className="flex items-center justify-center gap-10 py-20 px-20">
        <div className="flex-1 h-96 bg-gray-500">
          <img
            src="/assets/home/newHome/MTC.webp"
            alt="MTC"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col items-start justify-center gap-4">
          <h1 className="text-4xl font-semibold">We Mentor Through Cartoons</h1>
          <p className="text-lg max-w-[500px]">
            We're on a mission to help children and families rediscover balance
            between digital play and real life values through our{" "}
            <strong>
              engaging workshops, stories and community-led programs.
            </strong>
            <br />
            We empower kids to be tech-smart emotionally resilient and
            culturally rooted
          </p>
          <button className="px-5 py-2 bg-orange-400 text-white flex items-center gap-3 font-medium">
            <span>Know More About Us</span>
            <ArrowRight />
          </button>
        </div>
        <div className="flex-1 h-96 ">
          <img
            src="/assets/home/newHome/comicc.png"
            alt="Workshops"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <HowMentoonsHelpsYourChild />
      <KnowOurWorkshops />
      <PopularProducts />
      <DiscoverYourself />
      <BookSession />
      <CommunitySection />
    </>
  );
};

export default NewHomePage;
