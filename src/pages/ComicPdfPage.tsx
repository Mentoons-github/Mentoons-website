import { comicsData } from "@/constant/comicsConstants";
import React from "react";
import { Link, useParams } from "react-router-dom";

const ComicPdfPage: React.FC = () => {
  const query = useParams();
  const comic = query.comic;
  const currComic = comicsData.find((item) => {
    return item.name === comic;
  });

  return (
    <div className="container h-screen bg-rose-50 flex items-center justify-center">
      <div className="w-full md:w-[45%] flex items-center justify-center">
        <img
          className="w-[60%] rounded-lg shadow-2xl shadow-rose-400"
          src={currComic?.mini_thumbnail}
          alt="comic image"
        />
      </div>
      <div className="w-full text-center md:w-[65%] space-y-10">
        <h1 className="text-7xl font-extrabold text-center">
          {currComic?.name}
        </h1>
        <p className="text-2xl font-semibold text-center">{currComic?.desc}</p>
        <div>
          <Link
            to={currComic?.comicLink || ""}
            className="bg-primary uppercase text-lg font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out text-white py-3 px-7 rounded-full"
          >
            Read Now!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComicPdfPage;
