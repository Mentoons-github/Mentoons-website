import { useNavigate } from "react-router-dom";

interface AddictionCardsProps {
  title: string;
  description: string;
  image: string;
  background: string;
  gradient: string;
  text: string;
}

const AddictionCards = ({
  title,
  description,
  image,
  background,
  gradient,
  text,
}: AddictionCardsProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-full h-full rounded-lg shadow-lg relative"
      style={{ background: background }}
    >
      <div className="flex items-center justify-between gap-4 pb-10 lg:pb-0">
        <figure>
          <img src={image} alt={title} />
        </figure>
        <div className="p-4">
          <p className="text-sm">{description}</p>
        </div>
      </div>
      <div
        className="p-4 rounded-b-lg absolute bottom-0 w-full"
        style={{ background: gradient }}
      >
        <h1
          className="text-2xl font-bold flex items-center justify-between"
          style={{ color: text }}
        >
          <p>{title}</p>
          <p
            className="text-sm lg:text-lg font-thin cursor-pointer"
            onClick={() => navigate("/mentoons-workshops")}
          >
            Visit Workshop
          </p>
        </h1>
      </div>
    </div>
  );
};

export default AddictionCards;
