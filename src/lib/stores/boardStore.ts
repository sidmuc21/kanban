import { writable, derived } from "svelte/store";

/** Issue type */
export interface Issue {
  id: string;
  title: string;
  description?: string;
  creationDate: string;
  dueDate: string;
  storyPoints: number;
  priority: "Low" | "Medium" | "High";
}

/** Board data: lanes with issues */
type BoardData = Record<string, Issue[]>;

const DEFAULT_BOARD: BoardData = {
  "To Do": [],
  "Doing": [],
  "Done": [],
  "Archive": []
};

// SSR-safe initialization
let initialBoard: BoardData = DEFAULT_BOARD;
if (typeof window !== "undefined" && localStorage.getItem("kanbanData")) {
  try {
    initialBoard = JSON.parse(localStorage.getItem("kanbanData")!);
  } catch {}
}

export const board = writable<BoardData>(initialBoard);

// Persist changes
if (typeof window !== "undefined") {
  board.subscribe((b) => localStorage.setItem("kanbanData", JSON.stringify(b)));
}

// Sum of story points per lane
export const storyPointsSum = derived(board, ($board) => {
  const sums: Record<string, number> = {};
  for (const lane in $board) {
    sums[lane] = $board[lane].reduce((acc, i) => acc + (i.storyPoints || 0), 0);
  }
  return sums;
});
