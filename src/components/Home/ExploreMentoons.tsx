import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { Fade } from 'react-awesome-reveal';

type CardData = {
  imgUrl: string;
  title: string;
  description: string;
  link: string;
  linkTitle:string;
};

const ExploreMentoons: React.FC = () => {
  const navigate = useNavigate();

  const cardsData: CardData[] = [
    {
      imgUrl: '/Comics_.jpg',
      title: 'Comics',
      linkTitle: 'View Comics',
      description: 'Dive into colorful worlds and exciting stories that teach valuable lessons while entertaining young readers. Our diverse range of comics covers various subjects, from history and science to social skills and personal growth.',
      link: '/mentoons-comics',
    },
    {
      imgUrl: '/Audio-comics.jpg',
      title: 'Audio Comics',
       linkTitle: 'Listen Audio Comics',
      description: 'Experience the magic of storytelling like never before! Our audio comics bring illustrations to life with professional voice acting, sound effects, and music, creating an immersive experience that enhances listening skills and imagination.',
      link: '/mentoons-comics/audio-comics',
    },
    {
      imgUrl: '/Podcast_.jpg',
       title: 'Podcasts',
       linkTitle: 'Listen Podcasts',
      description: 'Tune in to our educational and entertaining podcasts designed specifically for young listeners. From fascinating facts to thought-provoking discussions, our podcasts make learning fun and accessible.',
      link: '/mentoons-podcast',
    },
    {
      imgUrl: '/Workshops_.jpg',
      linkTitle: 'Attend Workshops',
      title: 'Workshops',
      description: 'Join our interactive workshops led by industry professionals and educators. We offer both in-person and virtual sessions that encourage creativity, teamwork, and skill development in areas such as comic creation, storytelling, and character design.',
      link: '/mentoons-workshops',
    },
  ];

  const handleImageClick = (link: string) => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div className="h-full w-full py-16 bg-light-blue relative">
      <div className="w-4/5 mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {cardsData.map((item, index) => (
          <Fade key={index} duration={400} delay={index * 100} direction="up">
            <div
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-[15rem] h-[15rem] rounded-full overflow-hidden border-4 border-white relative cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundImage: `url(${item.imgUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "6px 6px 0px rgba(103, 102, 102, 0.2)",
                }}
                onClick={() => handleImageClick(item.link)}
              >
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 h-[4rem] flex items-center justify-center transition-all duration-300 ease-in-out">
                  <span className="text-white text-sm font-bold flex items-center gap-3">
                    <FaEye />
                    {item.linkTitle}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center p-4">
                <h3 className="text-4xl font-semibold text-white mb-4 font-montserrat">{item.title}</h3>
                <p className="text-white text-left text-xl font-light">{item.description}</p>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
};

export default ExploreMentoons;
