import WorkshopForm from "@/components/common/WorkshopForm";
import WorkshopFeatureCard from "@/components/shared/Workshop/workshopFeatrueCard";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WORKSHOP_FEATURES } from "@/constant";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export interface WorkshopItems {
  name: string;
  desc: string;
  img: string;
  video: string;
  pageUrl: string;
}

enum WorkshopType {
  buddyCamp = "6-12",
  teenCamp = "13-19",
  "20+Camp" = "20+",
  familyCamp = "Parents",
}

const WorkshopsPage = () => {
  const location = useLocation();
  const searchParams = location.search.split("=")[1];
  // console.log(searchParams, "searchParams");
  useEffect(() => {
    setActiveCategory(searchParams || WorkshopType.buddyCamp);
  }, [searchParams]);
  const [activeCategory, setActiveCategory] = React.useState<string>("6-12");
  const [showForm, setShowForm] = React.useState<boolean>(false);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <section id="workshop-hero">
      <div className="w-full relative">
        {/* <img
          src="/assets/images/workshop-cloud.png"
          alt=""
          className="w-full object-cover"
        /> */}
        <div
          className={`flex items-center justify-center space-x-2 pt-12  ${
            activeCategory === "6-12"
              ? "bg-[#ffe5c8]"
              : activeCategory === "13-19"
              ? "bg-[#ffe899]"
              : activeCategory === "20+"
              ? "bg-[#FDF7EE]"
              : activeCategory === "Parents"
              ? "bg-[#FFEBC3]"
              : null
          }`}
        >
          <div
            className="w-[20%] md:w-[10%]"
            onClick={() => handleCategoryChange(WorkshopType.buddyCamp)}
          >
            <img
              src={`/assets/images/${
                activeCategory === "6-12"
                  ? "6-12-active-purple.png"
                  : "6-12-purple.png"
              }`}
              alt=""
              className="w-full  object-cover"
            />
          </div>
          <div
            className="w-[20%] md:w-[10%]"
            onClick={() => handleCategoryChange(WorkshopType.teenCamp)}
          >
            <img
              src={`/assets/images/${
                activeCategory === "13-19"
                  ? "13-19-active-purple.png"
                  : "13-19-purple.png"
              }`}
              alt=""
              className="w-36 object-cover"
            />
          </div>
          <div
            className="w-[27%] md:w-[14%]"
            onClick={() => handleCategoryChange(WorkshopType["20+Camp"])}
          >
            <img
              src={`/assets/images/${
                activeCategory === "20+"
                  ? "20+-active-purple.png"
                  : "20+-purple.png"
              }`}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div
            className=" w-[20%] md:w-[10%]"
            onClick={() => handleCategoryChange(WorkshopType.familyCamp)}
          >
            <img
              src={`/assets/images/${
                activeCategory === "Parents"
                  ? "parents-active-purple.png"
                  : "parents-purple.png"
              }`}
              alt=""
              className="w-full object-cover"
            />
          </div>
        </div>
        <div>
          {activeCategory === "6-12" && <WorkshopsPage1 />}
          {activeCategory === "13-19" && <WorkshopsPage2 />}
          {activeCategory === "Parents" && <WorkshopsPage3 />}
          {activeCategory === "20+" && <WorkshopPage4 />}
        </div>
        <div
          className={`relative flex items-center justify-center left-0 px-8 py-3 cursor-pointer  ${
            activeCategory === "20+" && "bg-[#FFE96C]"
          }`}
        >
          <img
            onClick={() => setShowForm(true)}
            className="w-[30%] hover:scale-105 transition-all duration-300 ease-in-out"
            src="/assets/home/talktous.png"
          />
        </div>
        {showForm && (
          <Dialog open={showForm} onOpenChange={() => setShowForm(false)}>
            <DialogContent className="z-[999999] bg-transparent border-0">
              {/* <DialogTitle></DialogTitle> */}
              <button
                onClick={() => setShowForm(false)}
                className="close-button" // Add your desired styling here
              >
                Close
              </button>
              <DialogDescription>
                <div className="relative">
                  <WorkshopForm
                    selectedWorkshop={activeCategory}
                    setShowForm={setShowForm}
                  />
                </div>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};

export default WorkshopsPage;

export const WorkshopsPage1 = () => {
  return (
    <section className="">
      <div className="w-full relative">
        <img
          src="/assets/images/buddy-camp-cloud.png"
          alt=""
          className="hidden md:block w-full object-cover"
        />
        <img
          src="/assets/images/buddy_camp_cloud_sm.svg"
          alt=""
          className="block md:hidden w-full"
        />
        <div className="absolute w-full h-full top-0">
          <div className="flex items-center justify-center pt-4">
            <img
              src="/Buddy camp.png"
              alt=""
              className="block md:hidden w-[85%] object-cover"
            />
          </div>
          <div className="flex flex-col md:flex-row items-start justify-center md:justify-between">
            <div className="md:w-[50%] flex flex-col items-center md:items-start">
              <img
                src="/assets/images/workshop-hero-text.png"
                alt=""
                className="w-[100%]  p-4  md:pt-12 md:px-12  object-cover"
              />
              <img
                src="/assets/images/workshop-subtext.png"
                alt=""
                className="hidden md:block w-[80%]  px-4  md:pt-0 md:px-12  object-cover"
              />
            </div>
            <div className="md:w-[50%]">
              <img
                src="/assets/images/workshop-hero.png"
                alt=""
                className="w-[90%] mx-auto object-cover "
              />
              <img
                src="/assets/images/workshop-subtext.png"
                alt=""
                className="block md:hidden w-[80%]  px-4  md:pt-0 md:px-12  object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-12">
        <img
          className="hidden md:block"
          src="/assets/images/workshop-info-bg.png"
          alt=""
        />
        <img
          className="block md:hidden"
          src="/assets/images/workshop-info-bg-sm.svg"
          alt=""
        />
        <div className="absolute top-0  w-full h-full flex flex-col md:flex-row">
          <div className="md:w-[50%] h-full">
            <div>
              <img
                src="/assets/images/issue-text.png"
                alt=""
                className="hidden md:block w-full object-cover p-4  md:p-12"
              />
              <img
                src="/assets/images/issue-text-sm.svg"
                alt=""
                className="block md:hidden w-full p-8"
              />
            </div>
            <div>
              <img
                src="/assets/images/issue-illustration.png"
                alt=""
                className="hidden md:block w-full object-cover p-4 pt-0 md:p-12 md:pt-0 "
              />
              <img
                src="/assets/images/issue-illustration-sm.svg"
                alt=""
                className="absolute bottom-0 block md:hidden w-full object-cover p-4 pt-0 md:p-12 md:pt-0 "
              />
            </div>
          </div>
          <div className="hidden md:block w-[50%] h-full  relative">
            <img
              src="/assets/images/mentoons-tv.png"
              alt=""
              className="w-full object-cover  p-2 pt-4  pr-3 md:p-12"
            />
            <div>
              <video
                playsInline
                webkit-playsinline
                src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Children+Common+Issues.mp4"
                className=" w-[47%] absolute top-[33%] left-[25%]  md:top-[31%] md:left-[26%]"
                autoPlay
                controls
                muted
              ></video>
            </div>
          </div>
          <div className="block md:hidden md:w-[50%] h-full p-4 absolute top-[4rem]">
            <img
              src="/assets/images/mentoons-tv.png"
              alt=""
              className="w-full object-cover p-2 pt-4 pr-3"
            />
            <div>
              <video
                playsInline
                webkit-playsinline
                src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/Children+Common+Issues.mp4"
                className=" w-[47%] absolute top-[13%] left-[25%]"
                autoPlay
                controls
                muted
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex relative">
        <div className="w-full md:w-[50%] h-full">
          <div className="w-full">
            <img
              src="/assets/images/buddy-camp-info.png"
              alt=""
              className="w-full object-cover"
            />
          </div>
        </div>
        <div className="w-[50%] h-full">
          <img
            src="/assets/images/buddy-camp-illustration.png"
            alt=""
            className="w-full object-cover"
          />
        </div>
      </div>
      <div className="block md:hidden relative">
        <img
          src="/assets/images/buddy-camp-info-sm.svg"
          alt=""
          className="w-full object-cover"
        />
      </div>
      <div className="block md:hidden relative">
        <div>
          <img
            src="/assets/images/buddy-camp-creamCover-sm.svg"
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div className="absolute top-8">
          <img
            src="/assets/images/buddy-camp-info2-sm.svg"
            alt=""
            className="w-full object-cover p-4"
          />
        </div>
        <div className="absolute bottom-8 flex items-center justify-center">
          <img
            src="/assets/images/solution-illustration-sm.svg"
            alt=""
            className="w-[80%]"
          />
        </div>
      </div>
      <div className="block md:hidden">
        <div className="px-8 py-2">
          <img src="/assets/images/buddy-camp-childParent-header.svg" alt="" />
        </div>
        <div>
          <img src="/assets/images/buddy-camp-childParent-sm.svg" alt="" />
        </div>
      </div>
    </section>
  );
};

export const WorkshopsPage2 = () => {
  return (
    <section>
      <div className="w-full relative ">
        <img
          src="/assets/images/teen-camp-cloud.png"
          alt=""
          className="w-full object-cover"
        />

        <div className=" absolute w-full h-full top-0 ">
          <div className="flex items-start  justify-between   ">
            <div className=" w-[50%] ">
              <img
                src="/assets/images/teen-camp-hero-text.png"
                alt=""
                className="w-[100%]  p-4  md:pt-12 md:px-12  object-cover"
              />
              <img
                src="/assets/images/teen-camp-subtext.png"
                alt=""
                className="w-[80%]  px-4  md:pt-0 md:px-12  object-cover"
              />
            </div>
            <div className=" w-[50%] ">
              <img
                src="/assets/images/teen-camp-hero.png"
                alt=""
                className="w-[90%] mx-auto object-cover "
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative  mt-12 ">
        <div className="absolute bottom-[5%] right-0 w-[50%]">
          <img src="/assets/images/teen-camp-aim-text.png" alt="" />
        </div>
        <img src="/assets/images/teen-camp-info-bg.png" alt="" />
        <div className=" absolute top-0  w-full h-full flex ">
          <div className="w-[50%] h-full ">
            <div className=" ">
              <img
                src="/assets/images/teen-camp-issue-text.png"
                alt=""
                className="w-full object-cover p-6 pt-8 pb-2  md:p-24 md:pb-6 "
              />
            </div>
            <div>
              <img
                src="/assets/images/teen-camp-issue-illustration.png"
                alt=""
                className="w-full object-cover p-4 pt-0 md:p-12 md:pt-0 "
              />
            </div>
          </div>
          <div className="w-[50%] h-full  relative">
            <img
              src="/assets/images/mentoons-tv.png"
              alt=""
              className="w-full object-cover  p-2 pt-4  pr-3 md:p-12"
            />
            <div>
              <video
                playsInline
                webkit-playsinline
                src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/Teen+Camp+Common+Issues.mp4"
                className=" w-[47%] absolute top-[24%] left-[25%]  md:top-[22%] md:left-[26%]"
                autoPlay
                controls
                muted
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div className="relative  flex">
        <div className="w-[50%] h-full ">
          <div>
            <img
              src="/assets/images/teen-camp-info.png"
              alt=""
              className="w-full object-cover "
            />
          </div>
        </div>
        <div className="w-[50%] h-full ">
          <img
            src="/assets/images/teen-camp-illustration.png"
            alt=""
            className="w-full object-cover "
          />
        </div>
      </div>
    </section>
  );
};
export const WorkshopsPage3 = () => {
  return (
    <section>
      <div className="w-full relative ">
        <img
          src="/assets/images/family-camp-cloud.png"
          alt=""
          className="w-full object-cover"
        />

        <div className=" absolute w-full h-full top-0 ">
          <div className="flex items-start  justify-between   ">
            <div className=" w-[50%] ">
              <img
                src="/assets/images/family-camp-hero-text.png"
                alt=""
                className="w-[100%]  p-4  md:pt-12 md:px-12  object-cover"
              />
            </div>
            <div className=" w-[50%] ">
              <img
                src="/assets/images/family-camp-hero.png"
                alt=""
                className="w-[90%] mx-auto object-cover "
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative  ">
        <div className="absolute bottom-[0%] right-0 w-[50%]">
          <img src="/assets/images/family-camp-aim-text.png" alt="" />
        </div>
        <img src="/assets/images/family-camp-info-bg.png" alt="" />
        <div className=" absolute top-0  w-full h-full flex ">
          <div className="w-[50%] h-full ">
            <div className=" ">
              <img
                src="/assets/images/family-camp-issue-text.png"
                alt=""
                className="w-full object-cover p-6 pt-8 pb-2  md:p-24 md:pb-6 "
              />
            </div>
            <div>
              <img
                src="/assets/images/family-camp-issue-illustration.png"
                alt=""
                className="w-full object-cover p-4 pt-0 md:p-12 md:pt-0 "
              />
            </div>
          </div>
          <div className="w-[50%] h-full  relative">
            <img
              src="/assets/images/mentoons-tv.png"
              alt=""
              className="w-full object-cover  p-2 pt-4  pr-3 md:p-12"
            />
            <div>
              <video
                playsInline
                webkit-playsinline
                src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+20%2B/Challenges+Parents+Face+Today.mp4"
                className=" w-[47%] absolute top-[24%] left-[25%]  md:top-[22%] md:left-[26%]"
                autoPlay
                controls
                muted
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div className="relative  flex">
        <div className="w-[50%] h-full ">
          <div>
            <img
              src="/assets/images/family-camp-info.png"
              alt=""
              className="w-full object-cover p-4 "
            />
          </div>
        </div>
        <div className="w-[50%] h-full ">
          <img
            src="/assets/images/family-camp-illustration.png"
            alt=""
            className="w-full object-cover "
          />
        </div>
      </div>
    </section>
  );
};

export const WorkshopPage4 = () => {
  const [selectedFeature, setSelectedFeature] = useState<string[]>([]);

  const handleChange = (feature: string) => {
    const updatedFeature = selectedFeature.includes(feature)
      ? selectedFeature.filter((item) => item !== feature)
      : [...selectedFeature, feature];

    setSelectedFeature(updatedFeature);
  };

  const handleSelectAllWorkShopModule = () => {
    if (selectedFeature.length === WORKSHOP_FEATURES.length) {
      setSelectedFeature([]);
    } else {
      const updatedFeature = WORKSHOP_FEATURES.map(
        (feature) => feature.heading
      );
      setSelectedFeature(updatedFeature);
    }
  };

  return (
    <>
      <div>
        <div className="bg-[#FDF7EE] flex flex-col items-start  0 md:flex-row">
          <div className="flex md:w-[50%] flex-col items-start justify-start p-12 md:px-12">
            <div className="w-full md:mt-20 md:mb-10">
              <img
                src="/assets/images/career-corner-hero-text.png"
                alt=""
                className="w-full object-cover"
              />
            </div>
            <div className="w-full ">
              <img
                src="/assets/images/career-corner-subtext.png"
                alt=""
                className="w-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-[50%] flex items-center   ">
            <img
              src="/assets/images/career-corner-hero-image.png"
              alt=""
              className="w-full"
            />
          </div>
        </div>
        <section className="bg-[url(/assets/images/career-corner-section-bg.png)] w-full ">
          <div className="w-full h-full flex flex-wrap   items-center justify-center ">
            <div className=" flex flex-col   ">
              <div className="w-full  p-12 ">
                <img
                  src="/assets/images/career-corner-section-headline.png"
                  alt=""
                  className="w-full boject-cover"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 place-content-center  gap-4 px-6 md:pb-40 md:gap-12   ">
                {WORKSHOP_FEATURES.map((feature) => (
                  <div key={feature.id}>
                    <Dialog>
                      <div className="relative marker:">
                        <DialogTrigger asChild>
                          <img
                            src={feature.imageUrl}
                            alt="portfolio management "
                            className="w-full object-cover hover:scale-105 transition-all duration-300"
                          />
                        </DialogTrigger>
                        <div className="absolute top-0 left-0">
                          <input
                            type="checkbox"
                            className="w-6 h-6"
                            checked={selectedFeature.includes(feature.heading)}
                            onChange={() => handleChange(feature.heading)}
                          />
                        </div>
                      </div>
                      <DialogContent className="bg-white flex flex-col items-center justify-center border-none w-[95%]  md:w-[60%] lg:w-[30%]  p-0 rounded-[20px] ">
                        <WorkshopFeatureCard
                          featureData={feature}
                          selectedFeature={selectedFeature}
                          handleChange={handleChange}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <button
                    className="bg-mt-pink text-white font-semibold text-xl p-1 rounded-lg px-3 py-2"
                    onClick={handleSelectAllWorkShopModule}
                  >
                    {selectedFeature.length === 0
                      ? "Select All Modules"
                      : selectedFeature.length === WORKSHOP_FEATURES.length
                      ? "Deselect All Modules"
                      : "Select More Modules"}
                  </button>
                </div>
              </div>
            </div>
            <div className=" md:w-[50%] flex items-center justify-center   ">
              <img
                src="/assets/images/career-corner-video-bg.png"
                alt="Career corner video"
                className="w-full  object-cover p-12"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
