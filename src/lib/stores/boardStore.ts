import { writable, derived } from "svelte/store";

// Define Issue type here
export interface Issue {
  id: string;
  title: string;
  description?: string;
  creationDate: string;
  dueDate: string;
  storyPoints: number;
  priority: "Low" | "Medium" | "High";
}

interface BoardData {
  [lane: string]: Issue[];
}

const defaultData: BoardData = {
  "To Do": [],
  "Doing": [],
  "Done": [],
  "Archive": []
};

// Initialize from localStorage only in browser
let initialData: BoardData = defaultData;
if (typeof localStorage !== "undefined") {
  const stored = localStorage.getItem("kanbanData");
  if (stored) initialData = JSON.parse(stored);
}

// Writable store
export const board = writable<BoardData>(initialData);

// Persist changes in localStorage (browser only)
if (typeof localStorage !== "undefined") {
  board.subscribe(value => {
    localStorage.setItem("kanbanData", JSON.stringify(value));
  });
}

// Derived store: sum of story points per lane
export const storyPointsSum = derived(board, $board => {
  const sums: Record<string, number> = {};
  for (const lane in $board) {
    sums[lane] = $board[lane].reduce((acc, issue) => acc + issue.storyPoints, 0);
  }
  return sums;
});
