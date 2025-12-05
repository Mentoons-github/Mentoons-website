import { CONTENTS } from "@/constant/adda/changes/contents";
import FlipCard from "./flipCard";

const Contents = () => {
  const entries = Object.entries(CONTENTS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-extrabold text-orange-600 mb-4">
            Explore Mentoons
          </h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {entries.map(([key, value]) => (
            <FlipCard
              key={key}
              title={(value as any).title || key}
              content={value}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contents;
