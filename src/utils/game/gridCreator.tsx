interface GridCreator {
  cols: number;
  rows: number;
}

const GridCreator = ({ cols, rows }: GridCreator) => {
  return (
    <div
      className="grid gap-3 w-fit"
      style={{
        gridTemplateRows: `repeat(${rows}, 80px)`,
        gridTemplateColumns: `repeat(${cols}, 80px)`,
      }}
    >
      {[...Array(rows * cols)].map((_, i) => (
        <div
          key={i}
          className="bg-blue-500 text-white flex items-center justify-center rounded-md"
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default GridCreator;
