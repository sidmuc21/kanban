import { writable } from "svelte/store";

export type Issue = {
  id: string;
  title: string;
  description: string;
  creationDate: string; // ISO string
  dueDate: string;      // ISO string
  storyPoints: number;
  priority: "Low" | "Medium" | "High";
};

export type Board = {
  "To Do": Issue[];
  "Doing": Issue[];
  "Done": Issue[];
  "Archive": Issue[];
};

const LOCAL_STORAGE_KEY = "kanban-board";

function createBoardStore() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const initial: Board = stored
    ? JSON.parse(stored)
    : { "To Do": [], "Doing": [], "Done": [], "Archive": [] };

  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set: (b: Board) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(b));
      set(b);
    },
    update: (fn: (b: Board) => Board) => {
      update(b => {
        const newBoard = fn(b);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBoard));
        return newBoard;
      });
    }
  };
}

export const board = createBoardStore();

// Derived store to calculate story points per lane
import { derived } from "svelte/store";
export const storyPointsSum = derived(board, $board => {
  const sums: Record<string, number> = {};
  for (const lane in $board) {
    sums[lane] = $board[lane].reduce((acc, issue) => acc + issue.storyPoints, 0);
  }
  return sums;
});
