import { Zoom } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type CardsProps = {
  items: {
    url: string;
    boxUrl: string;
    cardText: string;
    linkUrl:string;
    dsecription: string;
  };
  indexValue: number;
};

const Cards: React.FC<CardsProps> = ({ items, indexValue }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  return (
    <Zoom triggerOnce>
      <div
        key={indexValue}
        className={`flex flex-col items-center text-center transform transition-transform duration-300 ease-in-out ${imageLoaded ? 'hover:scale-105 active:scale-95' : ''}`}
        onClick={() => navigate(items.linkUrl)}
      >
        <div className="w-40 h-40 relative rounded-full shadow-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-full animate-pulse">
              <div className="w-32 h-32 bg-gray-200 rounded-full" />
            </div>
          )}
          <img
            loading="lazy"
            src={items.url}
            alt={items.cardText}
            onLoad={() => setImageLoaded(true)}
            style={{ boxShadow: '6px 6px 0px rgba(255, 255, 255, 0.2)' }}
            className={`w-full h-full object-cover rounded-full border-white border-4 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[10rem] h-[3rem]">
            <img
              loading="lazy"
              src={items.boxUrl}
              alt="box"
              className="w-full h-full"
            />
            <h3 className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">
              {items.cardText}
            </h3>
          </div>
        </div>
        <p className={`mt-8 text-lg text-white ${imageLoaded ? '' : 'bg-gray-200 rounded-md animate-pulse w-3/4 h-6'}`}>
          {imageLoaded ? items.dsecription : ''}
        </p>
      </div>
    </Zoom>
  );
};

export default Cards;
