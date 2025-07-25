
const AnimatedBG = () => {
  // Predefined positions for elements (in percentages), including bottom placements
  const floatingPositions = [
    { left: "10%", top: "15%" },
    { left: "25%", top: "30%" },
    { left: "40%", top: "10%" },
    { left: "55%", top: "25%" },
    { left: "70%", top: "20%" },
    { left: "15%", top: "85%" }, // Bottom
    { left: "30%", top: "90%" }, // Bottom
    { left: "45%", top: "80%" }, // Bottom
    { left: "60%", top: "88%" }, // Bottom
    { left: "75%", top: "40%" },
  ];

  const shapePositions = [
    { left: "20%", top: "20%" },
    { left: "35%", top: "55%" },
    { left: "50%", top: "30%" },
    { left: "65%", top: "15%" },
    { left: "80%", top: "85%" }, // Bottom
    { left: "25%", top: "90%" }, // Bottom
  ];

  const sparklePositions = [
    { left: "5%", top: "10%" },
    { left: "15%", top: "35%" },
    { left: "25%", top: "60%" },
    { left: "35%", top: "25%" },
    { left: "45%", top: "50%" },
    { left: "55%", top: "15%" },
    { left: "65%", top: "40%" },
    { left: "75%", top: "80%" }, // Bottom
    { left: "85%", top: "90%" }, // Bottom
    { left: "10%", top: "85%" }, // Bottom
    { left: "20%", top: "45%" },
    { left: "30%", top: "20%" },
    { left: "40%", top: "88%" }, // Bottom
    { left: "50%", top: "35%" },
    { left: "60%", top: "92%" }, // Bottom
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-200 via-orange-200 to-yellow-300 z-[-1]">
      {/* Floating Background Elements */}
      {floatingPositions.map((pos, i) => (
        <div
          key={i}
          className={`absolute ${
            i % 3 === 0 ? "text-9xl" : "text-5xl"
          } opacity-50`}
          style={{
            left: pos.left,
            top: pos.top,
          }}
        >
          {i % 3 === 0 ? "🐻" : i % 3 === 1 ? "🦒" : "🐬"}
        </div>
      ))}

      {/* Kid-Friendly Shapes */}
      {shapePositions.map((pos, i) => (
        <div
          key={`shape-${i}`}
          className="absolute"
          style={{
            left: pos.left,
            top: pos.top,
          }}
        >
          <div
            className={`${
              i % 2 === 0 ? "w-24 h-24 text-5xl" : "w-16 h-16 text-4xl"
            } flex items-center justify-center opacity-40 ${
              i % 3 === 0
                ? "bg-gradient-to-br from-red-300 to-pink-300 rounded-full"
                : i % 3 === 1
                ? "bg-gradient-to-br from-blue-300 to-purple-300 rounded-star"
                : "bg-gradient-to-br from-green-300 to-yellow-300 rounded-lg rotate-45"
            }`}
          >
            {i % 3 === 0 ? "🎈" : i % 3 === 1 ? "⭐" : "🌈"}
          </div>
        </div>
      ))}

      {/* Sparkle Effects */}
      {sparklePositions.map((pos, i) => (
        <div
          key={`sparkle-${i}`}
          className={`absolute ${
            i % 3 === 0 ? "text-2xl" : "text-lg"
          } opacity-70`}
          style={{
            left: pos.left,
            top: pos.top,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default AnimatedBG;
