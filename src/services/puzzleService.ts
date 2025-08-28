interface Position {
  row: number;
  col: number;
}

export const getLinePath = (start: Position, end: Position): string[] => {
  const path: string[] = [];
  const rowDiff = end.row - start.row;
  const colDiff = end.col - start.col;

  if (rowDiff !== 0 && colDiff !== 0) return [];

  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

  for (let i = 0; i <= steps; i++) {
    const row = start.row + i * rowStep;
    const col = start.col + i * colStep;
    path.push(`${row}-${col}`);
  }

  return path;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

export const getItemPositions = (
  row: number,
  col: number,
  direction: "horizontal" | "vertical",
  length: number
): [number, number][] => {
  const positions: [number, number][] = [];
  for (let i = 0; i < length; i++) {
    switch (direction) {
      case "horizontal":
        positions.push([row, col + i]);
        break;
      case "vertical":
        positions.push([row + i, col]);
        break;
    }
  }
  return positions;
};

export const placeItem = (
  grid: string[][],
  itemChars: string[],
  row: number,
  col: number,
  direction: "horizontal" | "vertical"
): void => {
  const positions = getItemPositions(row, col, direction, itemChars.length);
  positions.forEach(([r, c], i) => {
    grid[r][c] = itemChars[i];
  });
};

export const canPlaceItem = (
  grid: string[][],
  itemChars: string[],
  row: number,
  col: number,
  direction: "horizontal" | "vertical",
  size: number
): boolean => {
  const positions = getItemPositions(row, col, direction, itemChars.length);
  return positions.every(([r, c], index) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    return grid[r][c] === "" || grid[r][c] === itemChars[index];
  });
};
