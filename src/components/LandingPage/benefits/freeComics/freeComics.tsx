import { audioComicsData, comicsData } from "@/constant/comicsConstants";
import { AudioComic, Comic } from "@/redux/comicSlice";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./freeComic.css";

const FreeComics = ({
  comicType,
  openComicModal,
}: {
  comicType: "picture" | "audio";
  openComicModal: (comicLink: string) => void;
}) => {
  const [comicList, setComicList] = useState<AudioComic[] | Comic[]>([]);
  useEffect(() => {
    if (comicType === "audio") {
      setComicList(audioComicsData.slice(0, 5));
    } else {
      setComicList(comicsData.slice(0, 5));
    }
  }, [comicType]);

  return (
    <>
      <div className="h-screen pb-20 overflow-y-auto scrollbar-hide">
        <div className="grid gap-4 p-6 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-2 place-items-center">
          {comicList &&
            comicList.length > 0 &&
            comicList.map((comic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                  delay: index * 0.3,
                }}
                className="relative overflow-hidden border border-gray-400 rounded-md md:h-35 xl:w-34 xl:h-34 shadow-3xl group"
              >
                <motion.img
                  whileHover={{ y: -5 }}
                  src={comic.thumbnail}
                  alt="comic"
                  className="object-cover w-full h-full rounded-md"
                />
                <motion.div className="absolute inset-0 transition-opacity duration-300 ease-in-out bg-gray-700 opacity-0 group-hover:opacity-50" />
                <motion.div className="absolute bottom-0 w-full p-3 text-center text-black transition duration-300 ease-in-out bg-green-400 rounded-b-md translate-y-100 group-hover:translate-y-0">
                  {/* <a
                  target="_blank"
                  href={`${
                    "comicLink" in comic ? comic.comicLink : comic.videoLink
                  }`}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    e.stopPropagation()
                  }
                  className="block w-full h-full"
                >
                  {comicType === "picture" ? "Read Comic" : "Watch Comic"}
                </a> */}
                  {comicType === "picture" ? (
                    <button
                      className="block w-full h-full"
                      onClick={() =>
                        openComicModal(
                          "comicLink" in comic
                            ? comic.comicLink
                            : comic.videoLink
                        )
                      }
                    >
                      Read Comic
                    </button>
                  ) : (
                    <a
                      target="_blank"
                      href={
                        "comicLink" in comic ? comic.comicLink : comic.videoLink
                      }
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
                        e.stopPropagation()
                      }
                      className="block w-full h-full"
                    >
                      "Watch Comic"
                    </a>
                  )}
                </motion.div>
              </motion.div>
            ))}
        </div>
      </div>
    </>
  );
};

export default FreeComics;
