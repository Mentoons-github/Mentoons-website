const PuzzleFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Explore More Puzzles</h2>
        <p className="mb-4">
          Challenge your mind with our collection of brain teasers and logic
          games!
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/puzzles/new"
            className="text-blue-400 hover:text-blue-300 transition-colors"
            aria-label="View new puzzles"
          >
            New Puzzles
          </a>
          <a
            href="/puzzles/categories"
            className="text-blue-400 hover:text-blue-300 transition-colors"
            aria-label="Browse puzzle categories"
          >
            Categories
          </a>
          <a
            href="/puzzles/community"
            className="text-blue-400 hover:text-blue-300 transition-colors"
            aria-label="Join the puzzle community"
          >
            Community
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PuzzleFooter;
