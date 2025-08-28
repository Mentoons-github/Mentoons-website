import AnimatedPuzzlePiece from "./puzzlePiece";

interface PuzzlePiece {
  id: number;
  size: number;
  color: string;
  delay: number;
  initialX: number;
  initialY: number;
  rotation: number;
}

const AnimatedBackground = () => {
  const colors = ["#E68A00", "#CC7A00"]; // Darker orange tones
  const minDistance = 100; // Minimum distance between pieces in pixels

  // Function to check if a new position is too close to existing pieces
  const isTooClose = (
    newX: number,
    newY: number,
    pieces: PuzzlePiece[],
    index: number
  ): boolean => {
    for (let i = 0; i < index; i++) {
      const dx = newX - pieces[i].initialX;
      const dy = newY - pieces[i].initialY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        return true;
      }
    }
    return false;
  };

  // Generate pieces with minimum distance
  const pieces = [];
  const maxAttempts = 100; // Prevent infinite loops
  const width = typeof window !== "undefined" ? window.innerWidth : 1200;
  const height = typeof window !== "undefined" ? window.innerHeight : 800;

  for (let i = 0; i < 15; i++) {
    let attempts = 0;
    let initialX, initialY;

    do {
      initialX = Math.random() * width;
      initialY = Math.random() * height;
      attempts++;
    } while (
      isTooClose(initialX, initialY, pieces, i) &&
      attempts < maxAttempts
    );

    // If max attempts reached, skip this piece to avoid infinite loop
    if (attempts < maxAttempts) {
      pieces.push({
        id: i,
        size: Math.random() * 80 + 60, // Size range 60-140
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2000,
        initialX,
        initialY,
        rotation: i < 5 ? Math.random() * 720 : Math.random() * 360, // 5 pieces with wider rotation (0-720°), others standard (0-360°)
      });
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {pieces.map((piece) => (
        <AnimatedPuzzlePiece
          key={piece.id}
          size={piece.size}
          color={piece.color}
          delay={piece.delay}
          initialX={piece.initialX}
          initialY={piece.initialY}
          rotation={piece.rotation}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
