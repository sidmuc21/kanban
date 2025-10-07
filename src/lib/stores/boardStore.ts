import { writable, derived } from "svelte/store";

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

const initialData: BoardData = {
  "To Do": [],
  "Doing": [],
  "Done": [],
  "Archive": []
};

export const board = writable<BoardData>(initialData);

// Persist automatically
board.subscribe(value => {
  localStorage.setItem("kanbanData", JSON.stringify(value));
});

// Sum of story points per lane
export const storyPointsSum = derived(board, $board => {
  const sums: Record<string, number> = {};
  for (const lane in $board) {
    sums[lane] = $board[lane].reduce((acc, issue) => acc + issue.storyPoints, 0);
  }
  return sums;
});
