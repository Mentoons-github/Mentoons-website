import AboutSection from "@/components/comics/AboutSection";
import AudioComics from "@/components/comics/AudioComics";
import Blogs from "@/components/comics/Blogs";
import NewComics from "@/components/comics/NewComics";
import Pricing from "@/components/comics/Pricing";
import Testimonials from "@/components/comics/Testimonials";
import HeroSection from "@/components/comics/HeroSection";
import React, { Suspense } from "react";
// import Team from "./Team";
import { lazy } from "react";
const Team = lazy(() => import("@/components/comics/Team"));

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <NewComics />
      <AudioComics />
      <Suspense fallback={<div>Loading...</div>}>
        <Team />
      </Suspense>
      <Testimonials />
      <Pricing />
      <Blogs />
    </>
  );
};

export default Home;
